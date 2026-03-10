// Graphics, Sprite : 이미지

import './style.css';
import {Application, Assets, Sprite, Graphics} from 'pixi.js';


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

    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    app.stage.addChild(bunny);
    //Sprite
    // bunny.position.x = 100;
    // bunny.position.y = 100;
    // bunny.x = 100;
    // bunny.y = 200;
    bunny.anchor.set(0.5);

    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    //sprite의 중심을 기준으로 확대
  
    // bunny.scale.set(5);
    
    //Graphics
    const border = new Graphics();
    border.rect(
        50,
        200,
        100,
        100
    );
    border.fill('orange');
    app.stage.addChild(border)

    const line = new Graphics();
    line.moveTo(0, 100);
    line.lineTo(app.screen.width, 100);
    line.stroke({
        color: '#fff',
        width: 5,
    });
    app.stage.addChild(line);
}


