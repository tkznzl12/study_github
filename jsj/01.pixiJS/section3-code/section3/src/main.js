import { Application, Assets, AnimatedSprite, Container, Graphics, Rectangle, Text, Texture } from "pixi.js";
import "./style.css";

const WIDTH = 360;
const HEIGHT = 640;
const FINISH_Y = 150;

const PLAYER_COUNT = 10;
const PLAYER_SIZE = 32;
const DOLL_SIZE = 64;

const GAME_SECONDS = 60;

const DollState = Object.freeze({ idle: "idle", watch: "watch" });
const PlayerState = Object.freeze({
  idle: "idle",
  running: "running",
  eliminated: "eliminated",
  finished: "finished",
});

function nowMs() {
  return performance.now();
}

function sliceStripTextures(baseTexture, frameW, frameH, frameCount) {
  const textures = [];
  for (let i = 0; i < frameCount; i += 1) {
    textures.push(
      new Texture({
        source: baseTexture.source,
        frame: new Rectangle(i * frameW, 0, frameW, frameH),
      })
    );
  }
  return textures;
}

(async () => {
  const root = document.getElementById("game-root") ?? document.body;
  const coverEl = document.getElementById("game-cover");
  const coverTitleEl = document.getElementById("cover-title");
  const coverSubEl = document.getElementById("cover-sub");
  const restartButtonEl = document.getElementById("restart-button");

  const app = new Application();
  await app.init({
    width: WIDTH,
    height: HEIGHT,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    background: "#9d7e56", // 캔버스 내부 운동장 바닥색
  });

  app.canvas.id = "app-canvas";
  root.appendChild(app.canvas);

  app.stage.sortableChildren = true;

  const finishLine = new Graphics()
    .rect(0, FINISH_Y, WIDTH, 2)
    .fill({ color: 0xffffff, alpha: 0.9 });
  app.stage.addChild(finishLine);

  const timerText = new Text({
    text: String(GAME_SECONDS),
    style: {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      fontSize: 18,
      fontWeight: "800",
      fill: 0xffffff,
    },
  });
  timerText.anchor.set(1, 0);
  timerText.position.set(WIDTH - 12, 10);
  app.stage.addChild(timerText);

  const centerMessage = new Text({
    text: "",
    style: {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      fontSize: 22,
      fontWeight: "900",
      fill: 0xffffff,
      align: "center",
    },
  });
  centerMessage.anchor.set(0.5);
  centerMessage.position.set(WIDTH / 2, HEIGHT / 2);
  centerMessage.visible = false;
  centerMessage.zIndex = 10;

  app.stage.addChild(centerMessage);

  const world = new Container();
  world.zIndex = 1;
  app.stage.addChild(world);

  // Assets
  const [dollBase, playerBase] = await Promise.all([
    Assets.load("/images/doll-sprite.png"),
    Assets.load("/images/player-sprite.png"),
  ]);

  const dollFrames = sliceStripTextures(dollBase, 128, 128, 3);
  const playerFrames = sliceStripTextures(playerBase, 64, 64, 4);

  const voiceAudio = new Audio("/sounds/voice.mp3");
  voiceAudio.preload = "auto";
  const gunAudio = new Audio("/sounds/gun.mp3");
  gunAudio.preload = "auto";

  // Doll
  const doll = new AnimatedSprite(dollFrames);
  doll.anchor.set(0.5, 0);
  doll.width = DOLL_SIZE;
  doll.height = DOLL_SIZE;
  doll.position.set(WIDTH / 2, 26);
  world.addChild(doll);

  /** @type {{ id:number, sprite: AnimatedSprite, state:string }[]} */
  const players = [];
  const playerYStart = HEIGHT - 70;
  const spacing = WIDTH / (PLAYER_COUNT + 1);
  const playerStartPositions = [];

  function applyPlayerState(model, nextState) {
    if (model.state === PlayerState.eliminated || model.state === PlayerState.finished) return;
    model.state = nextState;

    const s = model.sprite;
    if (nextState === PlayerState.idle) {
      s.textures = [playerFrames[0]];
      s.gotoAndStop(0);
      s.alpha = 1;
    } else if (nextState === PlayerState.running) {
      s.textures = [playerFrames[1], playerFrames[2]];
      s.animationSpeed = 0.18;
      s.loop = true;
      s.play();
      s.alpha = 1;
    }
  }

  function eliminatePlayer(model) {
    const localSessionId = sessionId;
    if (model.state === PlayerState.eliminated || model.state === PlayerState.finished) return;
    model.state = PlayerState.eliminated;
    const s = model.sprite;
    s.stop();
    s.alpha = 1;

    try {
      gunAudio.currentTime = 0;
      void gunAudio.play();
    } catch {
      // ignore
    }

    window.setTimeout(() => {
      if (sessionId !== localSessionId) return;
      if (model.state !== PlayerState.eliminated) return;
      s.textures = [playerFrames[3]];
      s.gotoAndStop(0);
      s.alpha = 0.75;
    }, 1000);
  }

  function checkFinish(model) {
    if (model.state === PlayerState.eliminated || model.state === PlayerState.finished) return;
    if (model.sprite.y <= FINISH_Y) {
      model.state = PlayerState.finished;
      model.sprite.stop();
      model.sprite.textures = [playerFrames[0]];
      model.sprite.gotoAndStop(0);
      model.sprite.alpha = 1;
    }
  }

  for (let i = 0; i < PLAYER_COUNT; i += 1) {
    const p = new AnimatedSprite([playerFrames[1], playerFrames[2]]);
    p.anchor.set(0.5);
    p.width = PLAYER_SIZE;
    p.height = PLAYER_SIZE;
    p.position.set(spacing * (i + 1), playerYStart);
    p.animationSpeed = 0.18;
    p.loop = true;
    p.play();
    p.eventMode = "static";
    p.cursor = "pointer";

    const model = { id: i, sprite: p, state: PlayerState.running };
    playerStartPositions.push({ x: p.x, y: p.y });
    p.on("pointertap", () => {
      if (!gameRunning || gameEnded) return;
      if (model.state === PlayerState.running) applyPlayerState(model, PlayerState.idle);
      else if (model.state === PlayerState.idle) applyPlayerState(model, PlayerState.running);
    });

    players.push(model);
    world.addChild(p);
  }

  let gameRunning = false;
  let gameEnded = false;
  let dollState = DollState.idle;
  let dollStateUntilMs = 0;
  let watchCheckActive = false;
  let gameEndAtMs = 0;
  let sessionId = 0;

  function setDollState(next) {
    const localSessionId = sessionId;
    dollState = next;
    watchCheckActive = false;

    doll.loop = false;
    doll.animationSpeed = 0.1;

    if (next === DollState.idle) {
      doll.textures = [dollFrames[1], dollFrames[0]]; // 2 -> 1
      doll.play();
      dollStateUntilMs = nowMs() + 5000;

      try {
        voiceAudio.currentTime = 0;
        void voiceAudio.play();
      } catch {
        // ignore
      }
    } else {
      doll.textures = [dollFrames[1], dollFrames[2]]; // 2 -> 3
      doll.play();
      dollStateUntilMs = nowMs() + 3000;
      window.setTimeout(() => {
        if (sessionId !== localSessionId) return;
        if (gameRunning && !gameEnded && dollState === DollState.watch) watchCheckActive = true;
      }, 500);
    }
  }

  function endGame() {
    if (gameEnded) return;
    gameEnded = true;
    gameRunning = false;
    const score = players.filter((p) => p.state === PlayerState.finished).length;
    let statusText = "";
    if (score === 0) {
      statusText = "전원탈락";
    } else if (score === PLAYER_COUNT) {
      statusText = "전원생존";
    } else {
      statusText = `${score}명 생존`;
    }

    centerMessage.text = `점수: ${score}\n${statusText}`;
    centerMessage.visible = true;

    if (restartButtonEl) {
      restartButtonEl.classList.remove("restart-button-hidden");
      restartButtonEl.textContent = "다시 시작하기";
    }
    if (coverTitleEl) coverTitleEl.textContent = "클릭해서 시작";
    if (coverSubEl) coverSubEl.textContent = `점수: ${score}`;
    if (coverEl) coverEl.classList.add("hidden");
  }

  function updateTimer() {
    if (!gameRunning || gameEnded) return;
    const remaining = Math.ceil((gameEndAtMs - nowMs()) / 1000);
    timerText.text = String(Math.max(0, remaining));
    if (remaining <= 0) {
      endGame();
    }
  }

  function checkEndConditions() {
    if (!gameRunning || gameEnded) return;
    const aliveNotEliminated = players.filter((p) => p.state !== PlayerState.eliminated).length;
    const finished = players.filter((p) => p.state === PlayerState.finished).length;
    const active = players.filter(
      (p) => p.state === PlayerState.idle || p.state === PlayerState.running
    ).length;

    if (aliveNotEliminated === 0) {
      endGame();
    }
    else if (active === 0) {
      endGame();
    }
  }

  function resetGameState() {
    sessionId += 1;

    doll.stop();
    doll.textures = [dollFrames[0]];
    doll.gotoAndStop(0);

    for (let i = 0; i < players.length; i += 1) {
      const model = players[i];
      const startPos = playerStartPositions[i];
      model.sprite.position.set(startPos.x, startPos.y);
      model.sprite.alpha = 1;
      model.state = PlayerState.running;
      applyPlayerState(model, PlayerState.running);
    }

    timerText.text = String(GAME_SECONDS);
    centerMessage.visible = false;
    watchCheckActive = false;
    dollStateUntilMs = 0;
    gameEndAtMs = 0;
  }

  function startGame() {
    if (gameRunning) return;
    resetGameState();
    gameRunning = true;
    gameEnded = false;
    centerMessage.visible = false;
    gameEndAtMs = nowMs() + GAME_SECONDS * 1000;
    timerText.text = String(GAME_SECONDS);
    setDollState(DollState.idle);
  }

  if (coverEl) {
    const onStart = () => {
      coverEl.classList.add("hidden");
      if (coverTitleEl) coverTitleEl.textContent = "클릭해서 시작";
      if (coverSubEl) coverSubEl.textContent = "인형이 볼 때는 멈추세요.";
      startGame();
    };
    coverEl.addEventListener("click", onStart);
    coverEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") onStart();
    });
  } else {
    startGame();
  }

  if (restartButtonEl) {
    restartButtonEl.addEventListener("click", () => {
      restartButtonEl.classList.add("restart-button-hidden");
      centerMessage.visible = false;
      if (coverTitleEl) coverTitleEl.textContent = "클릭해서 시작";
      if (coverSubEl) coverSubEl.textContent = "인형이 볼 때는 멈추세요.";
      if (coverEl) coverEl.classList.remove("hidden");
    });
  }

  app.ticker.add((ticker) => {
    if (!gameRunning || gameEnded) return;

    const dt = ticker.deltaTime / 60;
    const speedPxPerSec = 55;

    if (nowMs() >= dollStateUntilMs) {
      setDollState(dollState === DollState.idle ? DollState.watch : DollState.idle);
    }

    if (dollState === DollState.idle) {
      for (const p of players) {
        if (p.state === PlayerState.running) p.sprite.y -= speedPxPerSec * dt;
        checkFinish(p);
      }
    } else if (watchCheckActive) {
      for (const p of players) {
        if (p.state === PlayerState.running) eliminatePlayer(p);
      }
    }

    updateTimer();
    checkEndConditions();
  });
})();
