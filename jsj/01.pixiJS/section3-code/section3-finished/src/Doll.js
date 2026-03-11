import { Container, Sprite, Texture, Assets, Rectangle } from 'pixi.js';

export class Doll extends Container {
    sprite;
    frames = [];
    state = 'idle';
    stateTime = 0;
    watchDelay = 0;
    game;
    
    constructor(game) {
        super();
        this.game = game;
        this.init();
    }

    async init() {
        // 스프라이트 생성
        const texture = await Assets.get('/images/doll-sprite.png');
        
        // 프레임 설정 (384x128 이미지를 3개의 프레임으로 분할)
        const frameWidth = 384 / 3;
        const frameHeight = 128;
        
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
            })
        ];
        
        // 스프라이트 생성 및 설정
        this.sprite = new Sprite(this.frames[1]);  // 2번 프레임으로 시작
        this.sprite.width = 64;
        this.sprite.height = 64;
        this.sprite.anchor.set(0.5);
        
        this.addChild(this.sprite);
        this.position.set(180, 100);

        // 초기 상태 설정 (약간의 지연 후 실행)
        setTimeout(() => {
            // 2번 프레임으로 시작
            this.sprite.texture = this.frames[1];
            
            // 0.5초 후 1번 프레임으로 전환하고 사운드 재생
            setTimeout(() => {
                this.sprite.texture = this.frames[0];  // 1번 프레임
                if (this.game) {
                    this.game.playSound('voice');
                }
            }, 500);

            this.state = 'idle';
            this.stateTime = 0;
        }, 100);
    }

    update(delta) {
        // 상태 시간 업데이트
        this.stateTime += 1;
        
        if (this.state === 'watch') {
            this.watchDelay += 1;
        }
        
        // 상태 전환 체크
        if (this.state === 'idle' && this.stateTime >= 300) {  // 5초 = 300 프레임
            this.changeState('watch');
        } else if (this.state === 'watch' && this.stateTime >= 180) {  // 3초 = 180 프레임
            this.changeState('idle');
        }
    }

    changeState(newState) {
        if (this.state === newState) return;
        
        console.log('State changing to:', newState);
        
        this.state = newState;
        this.stateTime = 0;
        this.watchDelay = 0;
        
        if (newState === 'idle') {
            // idle 상태: 2번 프레임으로 시작
            this.sprite.texture = this.frames[1];
            
            // 0.5초 후 1번 프레임으로 전환하고 사운드 재생
            setTimeout(() => {
                if (this.state === 'idle') {  // 상태가 여전히 idle인 경우에만
                    this.sprite.texture = this.frames[0];  // 1번 프레임
                    if (this.game) {
                        this.game.playSound('voice');
                    }
                }
            }, 500);
        } else if (newState === 'watch') {
            // watch 상태: 2번 프레임으로 시작
            this.sprite.texture = this.frames[1];
            
            // 0.5초 후 3번 프레임으로 전환
            setTimeout(() => {
                if (this.state === 'watch') {  // 상태가 여전히 watch인 경우에만
                    this.sprite.texture = this.frames[2];  // 3번 프레임
                }
            }, 500);
        }
    }

    isWatching() {
        // watch 상태이고 0.5초가 지난 후에만 true 반환
        return this.state === 'watch' && this.watchDelay >= 30;  // 0.5초 = 30 프레임
    }
}