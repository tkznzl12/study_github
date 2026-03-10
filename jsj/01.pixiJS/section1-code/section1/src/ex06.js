// Graphics, Sprite : 이미지

import './style.css';
import {Application, Assets, Sprite} from 'pixi.js';


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

    bunny.eventMode = 'static';
    bunny.cursor = 'pointer';

    let n = 1;

    // 모바일, PC 전체 클릭 기능 구현시 사용(click 대신)
    bunny.on('pointertap', () => {
        bunny.scale.set(++n)
    });

}


