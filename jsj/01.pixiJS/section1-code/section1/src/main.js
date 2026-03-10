import * as PIXI from 'pixi.js';

//Application
const app = new PIXI.Application();

app.init({
    background:'royalblue'
});

document.body.appendChild(app.canvas);