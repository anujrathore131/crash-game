import { Application, Assets, TilingSprite, Sprite, Text, TextStyle, ParticleContainer, Particle } from "pixi.js";

// -----------------------------
// todos and notes (if time permits resolve these): 
// -----------------------------
// instead of auto rounds, used buttons to control the game flow
// -----------------------------
// had other bg assets planned but couldnt implement due to time constraints    
// -----------------------------
(async () => {
    const app = new Application();
    await app.init({
        background: "#000000",
        resizeTo: window
    });
    globalThis.__PIXI_APP__ = app;
    document.body.appendChild(app.canvas);

    const bgTexture = await Assets.load("./assets/bg4.png");
    const rocketTexture = await Assets.load("./assets/rocket-removebg-preview.png");
    await Assets.load("./assets/smoke.png");
    const bg = new TilingSprite({
        texture: bgTexture,
        width: app.screen.width,
        height: app.screen.height,
    });
    bg.tileScale.set(0.2);
    app.stage.addChild(bg);

    const rocket = new Sprite(rocketTexture);
    rocket.anchor.set(0.5);
    rocket.scale.set(0.8);
    rocket.x = 0;
    rocket.y = app.screen.height + rocket.height / 2;
    rocket.rotation = 0;
    app.stage.addChild(rocket);
    const rocketLaunchTween = gsap.to(rocket, { x: app.screen.width * 0.50, y: app.screen.height * 0.50, rotation: 0.5, duration: 1, yoyo: false, repeat: 0, ease: "Bounce.inOut", paused: true });
    const rocketFlewTween = gsap.to(rocket, { x: app.screen.width * 2, y: -app.screen.height, rotation: 0.5, duration: 2, yoyo: false, repeat: 0, ease: "Sinosoidal.In", paused: true });
    const rocketShakeTween = gsap.to(rocket, { rotation: 0.509, duration: 0.1, yoyo: true, repeat: -1, ease: "Sinosoidal.inOut", paused: true });
    const texture = Sprite.from("./assets/smoke.png").texture;
    const SMOKE_LIFETIME = 1000;
    let lastBgX = 0;
    let lastBgY = 0;
    const smokes = [];
    const cashInBtn = document.getElementById("cashInBtn");
    const startBtn = document.getElementById("startBtn");
    const cashOutBtn = document.getElementById("cashOutBtn");
    const status = document.getElementById("statusText");
    let running = false;
    let crashed = false;
    let multiplier = 1.0;
    let crashAt = 0;
    let hasBet = false;
    let startTime = 0;



    const container = new ParticleContainer({
        dynamicProperties: {
            position: true,
            scale: true,
            rotation: false,
            color: false,
        },
    });

    const style = new TextStyle({
        dropShadowBlur: 5,
        dropShadowColor: "#1cf000",
        fill: "#ffffff",
        fontSize: 30,
        fontVariant: "small-caps",
        fontWeight: 100,
        lineJoin: "round",
        stroke: "#2e335c",
        strokeThickness: 3
    });

    const multiplierText = new Text({
        text: "1.00x",
        style,
    });
    multiplierText.anchor.set(0.5);
    multiplierText.x = app.screen.width / 2;
    multiplierText.y = app.screen.height * 0.25;
    app.stage.addChild(multiplierText);


    function generateCrashPoint() {
        const r = Math.random();
        const val = 1 + (Math.exp(r * 2.4) - 1);
        return Math.max(1.05, +val.toFixed(2));
    }
    function resetRound() {
        rocketShakeTween.pause(0);
        running = false;
        crashed = false;
        hasBet = false;
        multiplier = 1.0;
        crashAt = 0;
        bg.tilePosition.set(0, 0);
        multiplierText.text = "1.00x";
        rocket.anchor.set(0.5);
        rocket.scale.set(0.8);
        rocket.x = 0;
        rocket.y = app.screen.height + rocket.height / 2;
        rocket.rotation = 0;
        cashInBtn.disabled = false;
        startBtn.disabled = true;
        cashOutBtn.disabled = true;
        status.textContent = "Place a bet and press Start.";
    }

    cashInBtn.addEventListener("click", () => {
        hasBet = true;
        status.textContent = "Bet placed. Ready to start!";
        cashInBtn.disabled = true;
        startBtn.disabled = false;
        rocketLaunchTween.restart();
    });

    startBtn.addEventListener("click", () => {
        if (!hasBet) return;
        running = true;
        crashed = false;
        multiplier = 1.0;
        startTime = performance.now();
        crashAt = generateCrashPoint();
        status.textContent = "Round started. Try to cash out before crash!";
        startBtn.disabled = true;
        cashOutBtn.disabled = false;
        rocketShakeTween.restart();
    });

    cashOutBtn.addEventListener("click", () => {
        if (!running || crashed) return;
        const win = (multiplier * 10).toFixed(2);
        status.textContent = `Cashed out at ${multiplier.toFixed(2)}x : Won ₹${win}`;
        cashOutBtn.disabled = true;
    });


    app.ticker.add(() => {
        emitAndRemoveSmoke();
        if (!running) return;
        bg.tilePosition.y += 10;
        bg.tilePosition.x -= 10;
        const elapsed = (performance.now() - startTime) / 1000;
        const growth = 0.6;
        multiplier = 1 + (Math.exp(growth * elapsed) - 1);
        multiplierText.text = `${multiplier.toFixed(2)}x`;

        if (multiplier >= crashAt) {
            crashed = true;
            running = false;
            multiplierText.text = `flew at : ${crashAt.toFixed(2)}x`;
            rocketFlewTween.restart();
            rocketShakeTween.pause(0);
            cashOutBtn.disabled = true;
            setTimeout(resetRound, 3000);
        }
    });

    function emitAndRemoveSmoke() {
        const now = performance.now();
        const deltaX = bg.tilePosition.x - lastBgX;
        const deltaY = bg.tilePosition.y - lastBgY;
        lastBgX = bg.tilePosition.x;
        lastBgY = bg.tilePosition.y;

        const randomScale = Math.random() * 0.3 + 0.1;

        const smoke = new Particle({
            texture,
            x: rocket.x - 100,
            y: rocket.y + rocket.height / 4 + 20,
            scaleX: randomScale,
            scaleY: randomScale,
            alpha: 0.8,
            anchorX: 0.5,
            anchorY: 0.5,
        });

        container.addParticle(smoke);

        smokes.push({
            sprite: smoke,
            bornAt: now,
        });

        for (let i = smokes.length - 1; i >= 0; i--) {
            const s = smokes[i];
            const sprite = s.sprite;
            sprite.x += deltaX;
            sprite.y += deltaY;
            if (now - s.bornAt >= SMOKE_LIFETIME) {
                container.removeParticle(sprite);
                try { sprite.destroy?.(); } catch (_) { }
                smokes.splice(i, 1);
            }
            else {
                sprite.alpha = 0.8 * (1 - (now - s.bornAt) / SMOKE_LIFETIME);
            }
        }
    }
    app.stage.addChild(container);
    window.addEventListener("resize", () => {
        if (running) return;
        bg.width = app.screen.width;
        bg.height = app.screen.height;
        rocket.anchor.set(0.5);
        rocket.scale.set(0.8);
        rocket.x = 0;
        rocket.y = app.screen.height + rocket.height / 2;
        rocket.rotation = 0;
        multiplierText.anchor.set(0.5);
        multiplierText.x = app.screen.width / 2;
        multiplierText.y = app.screen.height * 0.25;
    });
})();   