import './style.css';
import * as PIXI from 'pixi.js';


//pixijs의 가장 기본적인 구조
(async()=> {
//Application
    const app = new PIXI.Application();

    await app.init({
        background:'royalblue'
    });

    app.canvas.id = 'app-canvas';

    document.body.appendChild(app.canvas);
}
)()
