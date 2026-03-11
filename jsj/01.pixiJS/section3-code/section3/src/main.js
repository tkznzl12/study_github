import { Application } from "pixi.js";
import './style.css'

(async () => {
    const app = new Application();
    await app.init({
        width: 360,
        height: 640,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });
    app.canvas.id = 'app-canvas';
    document.body.appendChild(app.canvas);

    
})();
