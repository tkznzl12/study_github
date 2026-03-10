// Graphics, Sprite
import './style.css';
import {
    Application,
    Assets,
    Sprite,
    Graphics
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

    // Sprite
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    app.stage.addChild(bunny);

    // bunny.position.x = 100;
    // bunny.position.y = 200;
    // bunny.x = 100;
    // bunny.y = 200;
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    bunny.anchor.set(0.5);
    // bunny.scale.set(5);

    // Graphics
    const border = new Graphics();
    border.rect(
        50,
        200,
        100,
        100
    );
    border.fill('orange');
    app.stage.addChild(border);

    const line = new Graphics();
    line.moveTo(0, 100);
    line.lineTo(app.screen.width, 100);
    line.stroke({
        color: '#fff',
        width: 5
    });
    app.stage.addChild(line);
}