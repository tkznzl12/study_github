// Basic Structure
import './style.css';
import { Application } from 'pixi.js';

export default async function main() {
    const app = new Application();

    await app.init({
        background: 'royalblue',
        resizeTo: window
    });

    app.canvas.id = 'app-canvas';

    document.body.appendChild(app.canvas);
}