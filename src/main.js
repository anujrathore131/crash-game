import { Application, Assets, TilingSprite, Sprite, Text, TextStyle } from "pixi.js";

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
    const bg = new TilingSprite({
        texture: bgTexture,
        width: app.screen.width,
        height: app.screen.height,
    });
    bg.tileScale.set(0.2);
    app.stage.addChild(bg);


    const rocket = new Sprite(rocketTexture);
    rocket.anchor.set(0.5);
    rocket.scale.set(0.5);
    rocket.x = app.screen.width * 0.50; // start offscreen on the left
    rocket.y = app.screen.height - rocket.height / 2;
    rocket.rotation = 5.940;
    app.stage.addChild(rocket);

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
        multiplierText.text = "1.00x";
        rocket.rotation = 5.940;
        rocket.x = app.screen.width * 0.50;
        rocket.y = app.screen.height - rocket.height / 2;
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
    const rocketLaunchTween = gsap.to(rocket, { x: app.screen.width * 0.50, y: app.screen.height * 0.50, duration: 1, yoyo: false, repeat: 0, ease: "Bounce.inOut", paused: true}); 
    const rocketFlewTween = gsap.to(rocket, { x: app.screen.width * 0.50, y: -app.screen.height * 0.50, duration: 1, yoyo: false, repeat: 0, ease: "Bounce.inOut", paused: true}); 
    const rocketShakeTween = gsap.to(rocket, { rotation: 5.960, duration: 0.1, yoyo: true, repeat: -1, ease: "Sinosoidal.inOut", paused: true }); 
    app.ticker.add(() => {
        if (!running) return;
        bg.tilePosition.y += 10;
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
    window.addEventListener("resize", () => {
        bg.width = app.screen.width;
        bg.height = app.screen.height;
        rocket.anchor.set(0.5);
        rocket.x = app.screen.width * 0.50; // start offscreen on the left
        rocket.y = app.screen.height - rocket.height / 2;
        rocket.rotation = 5.940;
        multiplierText.anchor.set(0.5);
        multiplierText.x = app.screen.width / 2;
        multiplierText.y = app.screen.height * 0.25;
    });
})();   