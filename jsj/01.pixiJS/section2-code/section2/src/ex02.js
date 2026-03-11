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

    let texture;
    try {
        texture = await Assets.load('/images/flag.jpg');
    } catch {
        // Fallback so the demo still runs even if the local asset is missing.
        texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    }
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
    const basePositions = Float32Array.from(buffer.data);

    let timer = 0;
    let lastScrollAt = -Infinity;
    const SCROLL_ACTIVE_MS = 250;
    let lastScrollY = window.scrollY;
    let waveIntensity = 0; // 0..1
    let scrollVelocity = 0;
    const vertCount = buffer.data.length / 2;
    const yVel = new Float32Array(vertCount);

    // Wave tuning
    const AMP = 12; // px
    const TIME_SPEED = 0.08;
    const SPACE_FREQ_X = 0.02;
    const SPACE_FREQ_Y = 0.018; // add y component for diagonal wave

    // Spring tuning (smooth follow + smooth return)
    const SPRING = 180; // stiffness
    const DAMPING = 0.85; // velocity damping per frame (scaled below)

    const activateWave = () => {
        lastScrollAt = performance.now();
    };

    window.addEventListener(
        'scroll',
        activateWave,
        { passive: true }
    );
    window.addEventListener('wheel', activateWave, { passive: true });
    window.addEventListener('touchmove', activateWave, { passive: true });

    app.ticker.add((time) => {
        const now = performance.now();
        const currentScrollY = window.scrollY;
        if (currentScrollY !== lastScrollY) {
            const dy = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;
            lastScrollAt = now;
            // Smooth scroll velocity so intensity changes aren't jittery
            scrollVelocity = scrollVelocity * 0.8 + dy * 0.2;
        }
        const scrolling = now - lastScrollAt < SCROLL_ACTIVE_MS;

        // Intensity ramps up while scrolling and decays after.
        // Using scroll velocity makes the wave feel "driven" by user input.
        const targetIntensity = scrolling ? Math.min(1, Math.abs(scrollVelocity) / 40) : 0;
        waveIntensity += (targetIntensity - waveIntensity) * 0.12;

        timer += time.deltaTime;
        const dt = Math.min(2, time.deltaTime); // avoid huge jumps when tab was inactive
        const damping = Math.pow(DAMPING, dt);

        // aPosition is (x, y) pairs; apply wave to y only with spring smoothing.
        for (let vi = 0; vi < vertCount; vi++) {
            const i = vi * 2;
            const baseX = basePositions[i];
            const baseY = basePositions[i + 1];
            const x = baseX;
            const yBase = baseY;

            // Diagonal wave: phase advances across both X and Y.
            const phase = timer * TIME_SPEED + x * SPACE_FREQ_X + yBase * SPACE_FREQ_Y;
            const wave = Math.sin(phase) * AMP * waveIntensity;
            const targetY = baseY + wave;

            buffer.data[i] = baseX;

            const y = buffer.data[i + 1];
            const v = yVel[vi];
            const a = (targetY - y) * (SPRING * 0.001) * dt;
            const v2 = (v + a) * damping;
            const y2 = y + v2 * dt;

            yVel[vi] = v2;
            buffer.data[i + 1] = y2;
        }
        buffer.update();
    });
};
