//Sprite Animation
import "./style.css";
import {
  AnimatedSprite,
  Application,
  Assets,
  Rectangle,
  TilingSprite,
  Texture,
} from "pixi.js";

//pixijs의 가장 기본적인 구조
export default async function main() {
  //Application
  const app = new Application();
  globalThis.__PIXI_APP__ = app;
  await app.init({
    background: "royalblue",
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  app.canvas.id = "app-canvas";
  document.body.appendChild(app.canvas);

  const bgTexture = await Assets.load("/images/ruins2.png");
  const bgSprite = new TilingSprite({
    texture: bgTexture,
    width: app.screen.width,
    height: app.screen.height,
  });

  app.stage.addChild(bgSprite);
  // bgSprite.tileScale.set(0.1);

  function adjustTileScale() {
    const scale = window.innerHeight / bgTexture.height;
    bgSprite.tileScale.set(scale);
    bgSprite.width = window.innerWidth;
    bgSprite.height = window.innerHeight;
    zombie.y = app.screen.height * 0.52 - zombie.height;
  }

  const texture = await Assets.load("/images/Attack.png");

  const frames = [];
  for (let i = 0; i < 5; i++) {
    const frame = new Texture({
      source: texture,
      frame: new Rectangle(i * 128, 0, 128, 128),
    });
    frames.push(frame);
  }

  const punchSound = new Audio("/sounds/punch.wav");

  const zombie = new AnimatedSprite(frames);
  app.stage.addChild(zombie);

  zombie.y = app.screen.height * 0.5;
  zombie.animationSpeed = 0.2;
  zombie.loop = false;

  zombie.eventMode = "static";
  zombie.cursor = "pointer";
  zombie.on("pointertap", () => {
    zombie.gotoAndPlay(0);
    punchSound.currentTime = 0;
    punchSound.play();
  });

  zombie.onComplete = () => {
    zombie.gotoAndStop(0);
  };

  window.addEventListener("resize", adjustTileScale);

  adjustTileScale();

  app.ticker.add((delta) => {
    bgSprite.tilePosition.x -= 2 * delta.deltaTime;
  });
}
