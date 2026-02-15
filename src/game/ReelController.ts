import { Container, Texture } from "pixi.js";
import { Reel } from "./Reel";
import { GameConfig } from "../config/GameConfig";

export class ReelController {
  public container: Container = new Container();

  private reels: Reel[] = [];
  private isSpinning: boolean = false;

  constructor(symbolTextures: Texture[]) {
    this.createReels(symbolTextures);
  }

  private createReels(symbolTextures: Texture[]) {
    const {
      reels,
      reel: { width, gap, symbolSize },
      rows
    } = GameConfig;

    const reelHeight = rows * symbolSize;

    for (let i = 0; i < reels; i++) {
      const reel = new Reel({
        x: i * (width + gap),
        width,
        height: reelHeight,
        symbolSize,
        symbolTextures
      });

      this.reels.push(reel);
      this.container.addChild(reel.container);
    }
  }

  public startSpin() {
    if (this.isSpinning) return;

    this.isSpinning = true;

    this.reels.forEach(reel => reel.start());
  }

  public stopSpin() {
    const { stopDelay } = GameConfig.spin;

    this.reels.forEach((reel, index) => {
      setTimeout(() => {
        reel.stop();
      }, index * stopDelay);
    });
  }

  public update(delta: number) {
    this.reels.forEach(reel => reel.update(delta));
    if (this.isSpinning && this.reels.every(r => !r.spinning)) {
      this.isSpinning = false;
    }
  }

  public get spinning(): boolean {
    return this.isSpinning;
  }
}
