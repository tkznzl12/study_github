// Group
import './style.css';
import {
    Application,
    Assets,
    Sprite,
    Graphics,
    Container
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

    const container = new Container();
    app.stage.addChild(container);
    container.x = 200;
    container.y = 200;

    // Sprite
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    container.addChild(bunny);

    bunny.x = 100;
    bunny.y = 100;

    const rect = new Graphics();
    rect.rect(0, 0, 50, 50);
    rect.fill();
    container.addChild(rect);

    app.ticker.add((delta) => {
        container.rotation += delta.deltaTime * 0.01;
    });
}