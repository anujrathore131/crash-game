import * as PIXI from "pixi.js";
import { ReelController } from "./ReelController";
import { SpinButton } from "../ui/SpinButton";
import { GameConfig } from "../config/GameConfig";

export class SlotGame {

  private gameContainer = new PIXI.Container();
  private spinButton: SpinButton;
  private reelController: ReelController;
  private background!: PIXI.Sprite;

  constructor(private app: PIXI.Application) {
    const observer = new ResizeObserver(() => {
      this.handleWindowResize();
    });

    observer.observe(document.body);

    this.background = new PIXI.Sprite(
      PIXI.Texture.from("/assets/bg.jpg")
    );
    this.app.stage.addChild(this.background);
    this.app.stage.addChild(this.gameContainer);


    const symbolTextures: PIXI.Texture[] = GameConfig.symbols.map(path =>
      PIXI.Texture.from(path)
    );
    this.reelController = new ReelController(symbolTextures);
    const totalReelWidth =
      GameConfig.reels * GameConfig.reel.width +
      (GameConfig.reels - 1) * GameConfig.reel.gap;
    this.reelController.container.x =
      (GameConfig.designWidth - totalReelWidth) / 2;
    const reelHeight =
      GameConfig.rows * GameConfig.reel.symbolSize;
    this.reelController.container.y =
      (GameConfig.designHeight - reelHeight) / 2;
    this.gameContainer.addChild(this.reelController.container);
    this.spinButton = new SpinButton(() => this.handleSpin());
    this.spinButton.x = 560;
    this.spinButton.y = 600;
    this.gameContainer.addChild(this.spinButton);
    this.app.ticker.add((ticker) => {
      this.reelController.update(ticker.deltaTime);
    });
    window.addEventListener("resize", () => this.resize());
    this.resize();
  }


  private handleSpin() {
    if (this.reelController.spinning) return;

    this.reelController.startSpin();

    setTimeout(() => {
      this.reelController.stopSpin();
    }, GameConfig.spin.spinDuration);
  }


  private resize() {

    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    const bgScale = Math.max(
      screenWidth / this.background.texture.width,
      screenHeight / this.background.texture.height
    );

    this.background.scale.set(bgScale);

    this.background.x =
      (screenWidth - this.background.width) / 2;

    this.background.y =
      (screenHeight - this.background.height) / 2;

    const { designWidth, designHeight } = GameConfig;

    const gameScale = Math.min(
      screenWidth / designWidth,
      screenHeight / designHeight
    );

    this.gameContainer.scale.set(gameScale);

    this.gameContainer.x =
      (screenWidth - designWidth * gameScale) / 2;

    this.gameContainer.y =
      (screenHeight - designHeight * gameScale) / 2;
  }


  private handleWindowResize() {
    this.app.renderer.resize(
      window.innerWidth,
      window.innerHeight
    );
    this.resize();
  }


}
