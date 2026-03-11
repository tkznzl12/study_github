import { Application, Assets, MeshPlane } from "pixi.js";
import './style.css'

export default async function example() {
    const app = new Application();
    await app.init({
        backgroundAlpha: 0,
        width: 500,
        height: 700,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });
    app.canvas.id = 'app-canvas';
    document.querySelector('.page').appendChild(app.canvas);

    const texture = await Assets.load('/images/flag.jpg');
    const plane = new MeshPlane({
        texture,
        verticesX: 10,
        verticesY: 10
    })

    plane.width = 426;
    plane.height = 640;
    plane.x = 30;
    plane.y = 30;
    app.stage.addChild(plane)

    const { buffer } = plane.geometry.getAttribute('aPosition');
    // console.log(buffer)

    let timer = 0;
    app.ticker.add(() => {
        for(let i = 0; i < buffer.data.length; i ++){
            buffer.data[i] += Math.sin(timer * 0.1 + i ) * 0.2 ;
        }
        buffer.update()
        timer++;
    })
};
