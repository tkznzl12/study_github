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

    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const bunny = new Sprite(texture);
    app.stage.addChild(bunny);

    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    bunny.anchor.set(0.5);
    bunny.scale.set(2);

    let n = 0;

    app.ticker.add((detta) =>{
        // deltaTime: 실행되는 시간 간격
        // 기기마다 속도가 달라질 수 있지만, deltaTime을 이용해서 조정가능.
        bunny.x += 2 * detta.deltaTime;
        bunny.rotation += detta.deltaTime * 0.1;
        if (bunny.x > app.screen.width) {
            bunny.x = 0;
        }

  
    })
}


