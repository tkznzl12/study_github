import { Container, Sprite, Texture, Assets, Rectangle } from 'pixi.js';

export class Player extends Container {
    sprite;
    state = 'running';
    eliminatedTimer = 0;
    game;  // Game 인스턴스 저장용
    
    constructor(index, game) {  // Game 인스턴스를 받음
        super();
        this.index = index;
        this.game = game;  // Game 인스턴스 저장
        this.init();
    }

    async init() {
        // 스프라이트 생성
        const texture = await Assets.get('/images/player-sprite.png');
        
        // 프레임 설정 (256x64 이미지를 4개의 프레임으로 분할)
        const frameWidth = 256 / 4;  // 256/4 = 64
        const frameHeight = 64;      // 원본 이미지 높이
        
        // 각 프레임을 개별 텍스처로 생성
        this.frames = [
            new Texture({
                source: texture,
                frame: new Rectangle(0, 0, frameWidth, frameHeight)
            }),
            new Texture({
                source: texture,
                frame: new Rectangle(frameWidth, 0, frameWidth, frameHeight)
            }),
            new Texture({
                source: texture,
                frame: new Rectangle(frameWidth * 2, 0, frameWidth, frameHeight)
            }),
            new Texture({
                source: texture,
                frame: new Rectangle(frameWidth * 3, 0, frameWidth, frameHeight)
            })
        ];
        
        // 스프라이트 생성 및 설정
        this.sprite = new Sprite(this.frames[0]);  // 초기 프레임
        this.sprite.width = 32;      // 표시 크기 32x32
        this.sprite.height = 32;
        this.sprite.anchor.set(0.5);
        
        this.addChild(this.sprite);
        
        // 위치 설정 (화면 하단에 가로로 배치)
        const spacing = 32;
        this.position.set(40 + (this.index * spacing), 580);
        
        // 클릭 이벤트
        this.eventMode = 'static';
        this.cursor = 'pointer';  // 마우스 커서를 손가락 모양으로
        this.on('pointertap', () => this.toggleState());
    }

    update(delta) {
        if (this.state === 'running') {
            // 위로 이동 (속도를 절반으로 줄임)
            this.position.y -= 0.5;
            
            // 달리기 애니메이션
            if (Math.floor(Date.now() / 200) % 2 === 0) {
                this.sprite.texture = this.frames[1];
            } else {
                this.sprite.texture = this.frames[2];
            }
        }
        
        if (this.state === 'eliminated') {
            this.eliminatedTimer += delta;
            if (this.eliminatedTimer >= 1000 && this.sprite.texture !== this.frames[3]) {
                this.sprite.texture = this.frames[3];
            }
        }
    }

    setState(newState) {
        if (this.state === newState) return;
        if (this.state === 'eliminated') return;
        
        this.state = newState;
        if (newState === 'eliminated') {
            this.eliminatedTimer = 0;
            if (this.game) {
                this.game.playSound('gun');
            }
            // 1초 후에 4번 프레임으로 전환
            setTimeout(() => {
                this.sprite.texture = this.frames[3];  // 4번 프레임
            }, 1000);
        } else if (newState === 'idle') {
            this.sprite.texture = this.frames[0];
        } else if (newState === 'running') {
            this.sprite.texture = this.frames[1];
        }
    }

    toggleState() {
        if (this.state === 'eliminated') return;
        
        if (this.state === 'idle') {
            this.setState('running');
        } else if (this.state === 'running') {
            this.setState('idle');
        }
    }

    isFinished() {
        return this.position.y <= 150;
    }
} 