import { Application, Assets, Graphics, Text } from "pixi.js";
import './style.css'
import { Doll } from './Doll';
import { Player } from './Player';

class Game {
    app;
    gameStarted = false;
    players = [];
    timer = 60;
    sounds = {};
    
    constructor() {
        this.init();
    }

    async init() {
        // PixiJS 애플리케이션 생성
        this.app = new Application();

        // 캔버스 초기화
        await this.app.init({
            width: 360,
            height: 640,
            backgroundColor: 0xC2956E,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        this.app.canvas.id = 'app-canvas';
        document.body.appendChild(this.app.canvas);

        // 게임 커버 생성
        this.createGameCover();

        // 에셋 로드
        await this.loadGameAssets();
        
        // 결승선 그리기
        this.drawFinishLine();
    }

    createGameCover() {
        const cover = document.createElement('div');
        cover.id = 'game-cover';
        cover.style.width = '360px';
        cover.style.height = '640px';
        cover.style.position = 'absolute';
        cover.style.left = '50%';
        cover.style.top = '30px';
        cover.style.transform = 'translateX(-50%)';
        cover.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        cover.style.cursor = 'pointer';
        cover.style.zIndex = '1';

        // 게임 시작 텍스트
        const startText = document.createElement('div');
        startText.textContent = '클릭하여 게임 시작';
        startText.style.color = 'white';
        startText.style.fontSize = '24px';
        startText.style.position = 'absolute';
        startText.style.left = '50%';
        startText.style.top = '50%';
        startText.style.transform = 'translate(-50%, -50%)';
        cover.appendChild(startText);

        // 클릭 이벤트
        cover.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.startGame();
                cover.style.display = 'none';
            }
        });

        document.body.appendChild(cover);
    }

    async loadGameAssets() {
        // 이미지 에셋 로드
        await Assets.load([
            '/images/doll-sprite.png',
            '/images/player-sprite.png'
        ]);

        // 사운드 에셋 생성 및 설정
        this.sounds = {
            voice: new Audio('/sounds/voice.mp3'),
            gun: new Audio('/sounds/gun.mp3')
        };

        // 사운드 볼륨 설정
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
            // 사운드 프리로드
            sound.load();
        });
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            // 사운드 재생 시도
            const playPromise = sound.play();
            if (playPromise) {
                playPromise.catch(error => {
                    console.log('Sound play failed:', error);
                });
            }
        }
    }

    drawFinishLine() {
        const graphics = new Graphics();
        
        // 결승선 시각적 표시 (165 위치)
        graphics.moveTo(0, 165);
        graphics.lineTo(360, 165);
        
        // 결승선 그리기
        graphics.stroke({
            color: '#FFFFFF',
            width: 4,
            alpha: 1
        });
        
        this.app.stage.addChild(graphics);
    }

    startGame() {
        this.gameStarted = true;
        
        // Doll 생성
        this.doll = new Doll(this);
        this.app.stage.addChild(this.doll);
        
        // Players 생성
        for (let i = 0; i < 10; i++) {
            const player = new Player(i, this);
            this.players.push(player);
            this.app.stage.addChild(player);
        }
        
        // 게임 루프 시작
        this.app.ticker.add(this.update.bind(this));
        
        // 타이머 시작
        this.startTimer();
    }

    update(delta) {
        if (!this.gameStarted) return;
        
        this.doll.update(delta);
        
        for (const player of this.players) {
            player.update(delta);
            
            // 플레이어 체크 - doll이 watch 상태이고 0.5초가 지난 후에만 체크
            if (this.doll.isWatching() && player.state === 'running') {
                player.setState('eliminated');
            }
            
            // 결승선 도달 체크
            if (player.isFinished() && player.state !== 'eliminated') {
                player.setState('idle');
            }
        }
        
        this.checkGameEnd();
    }

    startTimer() {
        const timerText = new Text({
            text: '60',
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xFFFFFF
            }
        });
        timerText.position.set(300, 30);
        this.app.stage.addChild(timerText);
        
        const interval = setInterval(() => {
            this.timer--;
            timerText.text = this.timer.toString();
            
            if (this.timer <= 0) {
                clearInterval(interval);
                this.endGame();
            }
        }, 1000);
    }

    checkGameEnd() {
        const allEliminated = this.players.every(p => p.state === 'eliminated');
        const allFinished = this.players.every(p => p.state === 'eliminated' || p.isFinished());
        
        if (allEliminated || allFinished || this.timer <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.gameStarted = false;
        const survivors = this.players.filter(p => p.isFinished()).length;
        
        const resultText = new Text({
            text: `게임 종료!\n생존자: ${survivors}명`,
            style: {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xFFFFFF,
                align: 'center'
            }
        });
        resultText.anchor.set(0.5);
        resultText.position.set(180, 320);
        this.app.stage.addChild(resultText);
    }
}

// 게임 인스턴스 생성
new Game();
