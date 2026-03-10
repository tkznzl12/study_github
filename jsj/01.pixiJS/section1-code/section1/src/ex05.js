// Graphics, Sprite : 이미지

import './style.css';
import {Application, Assets, Sprite, Graphics, Container} from 'pixi.js';


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

    const container = new Container();
    app.stage.addChild(container);
    container.x = 200;
    container.y = 200;
    
    //Sprite
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    container.addChild(bunny);

    bunny.x = 100;
    bunny.y = 100;

    const rect = new Graphics();
    rect.rect(0, 0, 50, 50)
    rect.fill()
    container.addChild(rect);

    app.ticker.add((detta) =>{
        container.rotation += detta.deltaTime * 0.01
    })
}


