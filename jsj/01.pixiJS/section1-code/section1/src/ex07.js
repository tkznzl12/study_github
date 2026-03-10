import './style.css';
import {
    Application, 
    Assets, 
    BlurFilter,
    ColorMatrixFilter,
    DisplacementFilter,
    AlphaFilter,
    NoiseFilter, 
    Sprite
} from 'pixi.js';


//pixijs의 가장 기본적인 구조
export default async function main() {
//Application
    const app = new Application();
    globalThis.__PIXI_APP__ = app
    await app.init({
        background:'royalblue',
        // 현재 브라우저 크기에 맞게 사이즈 조절
        resizeTo : window,
        // 화면 확대
        resolution: window.devicePixelRatio || 1,
        autoDensity:true
    });

    app.canvas.id = 'app-canvas';
    document.body.appendChild(app.canvas);

    //Sprite
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    app.stage.addChild(bunny);
    bunny.anchor.set(0.5);
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    bunny.scale.set(2);

    // const blurFilter = new BlurFilter({strength: 3})
    // bunny.filters = blurFilter;

    const colorMatrixFilter = new ColorMatrixFilter();
    colorMatrixFilter.hue(Math.random() * 360);

    const filterSpriteTexture = await Assets.load('https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png')
    const filterSprite = new Sprite(filterSpriteTexture);

    const filters = [
        new BlurFilter({strength : 5}),
        colorMatrixFilter,
        new DisplacementFilter(filterSprite),
        new AlphaFilter({alpha : 0.3}),
        new NoiseFilter({noise : 0.5})
    ]

    bunny.filters = filters[2];

}


