import './style.css';
import {Application} from 'pixi.js';


//pixijs의 가장 기본적인 구조
export default async function main() {
//Application
    const app = new Application();

    await app.init({
        background:'royalblue',
        resizeTo : window
        // width: 500,
        // height: 300
    });

    app.canvas.id = 'app-canvas';

    document.body.appendChild(app.canvas);
}

