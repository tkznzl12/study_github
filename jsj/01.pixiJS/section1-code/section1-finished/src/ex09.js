// Sound
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
    const frames = [];
    for (let i = 0; i < 5; i++) {
        const frame = new Texture({
            source: texture,
            frame: new Rectangle(i * 128, 0, 128, 128)
        });
        frames.push(frame);
    }

    const punchSound = new Audio('/sounds/punch.mp3');

    const zombie = new AnimatedSprite(frames);
    app.stage.addChild(zombie);

    zombie.animationSpeed = 0.2;
    zombie.loop = false;
    // zombie.play();

    zombie.eventMode = 'static';
    zombie.cursor = 'pointer';
    zombie.on('pointertap', () => {
        zombie.gotoAndPlay(0);
        punchSound.currentTime = 0;
        punchSound.play();
    });
    zombie.onComplete = () => {
        zombie.gotoAndStop(0);
    };
}