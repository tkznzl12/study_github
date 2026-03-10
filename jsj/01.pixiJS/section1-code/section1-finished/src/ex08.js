// Sprite Animation
import './style.css';
import {
    Application,
    Assets,
    AnimatedSprite,
    Rectangle,
    Texture
} from 'pixi.js';

export default async function main() {
    const app = new Application();

    await app.init({
        background: 'royalblue',
        resizeTo: window,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });

    app.canvas.id = 'app-canvas';
    document.body.appendChild(app.canvas);

    const texture = await Assets.load('/images/Attack.png');
    // const frames = [
    //     // 5 frames
    //     new Texture({
    //         source: texture,
    //         frame: new Rectangle(0, 0, 128, 128)
    //     }),
    //     new Texture({
    //         source: texture,
    //         frame: new Rectangle(128, 0, 128, 128)
    //     }),
    //     new Texture({
    //         source: texture,
    //         frame: new Rectangle(256, 0, 128, 128)
    //     }),
    //     new Texture({
    //         source: texture,
    //         frame: new Rectangle(384, 0, 128, 128)
    //     }),
    //     new Texture({
    //         source: texture,
    //         frame: new Rectangle(512, 0, 128, 128)
    //     }),
    // ];
    const frames = [];
    for (let i = 0; i < 5; i++) {
        const frame = new Texture({
            source: texture,
            frame: new Rectangle(i * 128, 0, 128, 128)
        });
        frames.push(frame);
    }

    const zombie = new AnimatedSprite(frames);
    app.stage.addChild(zombie);

    zombie.animationSpeed = 0.2;
    zombie.loop = false;
    // zombie.play();

    zombie.eventMode = 'static';
    zombie.cursor = 'pointer';
    zombie.on('pointertap', () => {
        // zombie.play();
        zombie.gotoAndPlay(0);
    });
    zombie.onComplete = () => {
        zombie.gotoAndStop(0);
    };
}