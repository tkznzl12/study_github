// Filter
import './style.css';
import {
    Application,
    Assets,
    Sprite,
    BlurFilter,
    ColorMatrixFilter,
    DisplacementFilter,
    AlphaFilter,
    NoiseFilter
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
    bunny.anchor.set(0.5);
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    bunny.scale.set(2);

    // Filters
    // const blurFilter = new BlurFilter({ strength: 5 });
    // bunny.filters = blurFilter;
    const colorMatrixFilter = new ColorMatrixFilter();
    colorMatrixFilter.hue(Math.random() * 360);

    const filterSpriteTexture = await Assets.load('https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png');
    const filterSprite = new Sprite(filterSpriteTexture);

    const filters = [
        new BlurFilter({ strength: 5 }),
        colorMatrixFilter,
        new DisplacementFilter(filterSprite),
        new AlphaFilter({ alpha: 0.3 }),
        new NoiseFilter({ noise: 0.5 })
    ]
    bunny.filters = filters[2];
}