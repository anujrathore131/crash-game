
import * as PIXI from "pixi.js";

 export class SpinButton extends PIXI.Container {
  constructor(onClick: () => void) {
    super();

    const bg = new PIXI.Graphics();
    bg.beginFill(0xff0000);
    bg.drawRoundedRect(0, 0, 150, 60, 10);
    bg.endFill();

    const label = new PIXI.Text("SPIN", { fill: 0xffffff, fontSize: 24 });
    label.anchor.set(0.5);
    label.x = 75;
    label.y = 30;

    this.addChild(bg, label);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", onClick);
  }
}
