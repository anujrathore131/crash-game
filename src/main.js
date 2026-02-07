import { Application } from "pixi.js";
import CrashView from "./crash/crashView.js";
import ViewFactory from "./buildFactory/viewFactory.js";
import AssetLoader from "./assetLoader.js";

(async () => {
    const app = new Application();
    try {
        await app.init({
            background: "#000000",
            resizeTo: window
        });
    } catch (err) {
        console.error("App bootstrap failed:", err);
    }


    globalThis.__PIXI_APP__ = app;
    document.body.appendChild(app.canvas);
    await AssetLoader.init();
    const viewFactory = new ViewFactory();
    const crashView = new CrashView(viewFactory, app);
    app.stage.addChild(crashView);
})();   