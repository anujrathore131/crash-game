import { Application, Assets } from "pixi.js";
import { SlotGame } from "./game/SlotGame";

(async () => {
  const app = new Application();
    (globalThis as any).__PIXI_APP__ = app;
  await app.init({
    resizeTo: window,
    backgroundColor: 0x1a1a1a,
  });
  app.canvas.style.position = 'absolute';
  document.body.appendChild(app.canvas);

  await Assets.load([
    "/assets/slot/symbols/A1.png",
    "/assets/slot/symbols/Blue.png",
    "/assets/slot/symbols/Grey.png",
    "/assets/slot/symbols/J1.png",
    "/assets/slot/symbols/K1.png",
    "/assets/slot/symbols/Purple.png",
    "/assets/slot/symbols/Q1.png",
    "/assets/slot/symbols/Red.png",
    "/assets/slot/symbols/Scatter.png",
    "/assets/bg.jpg"
  ]);

  new SlotGame(app);
})();
