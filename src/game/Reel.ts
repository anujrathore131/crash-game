// src/game/Reel.ts

import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { GameConfig } from "../config/GameConfig";

export class Reel {
  public container: Container = new Container();

  private symbolContainer: Container = new Container();
  private symbols: Sprite[] = [];

  private textures: Texture[];

  private speed: number = 0;
  private isSpinning: boolean = false;
  private stopping: boolean = false;

  private scrollY: number = 0;

  private symbolSize: number;
  private reelHeight: number;
  private totalHeight: number;
  private stopDistance: number = 0;
  private stoppingPhase: boolean = false;

  constructor(config: {
    x: number;
    width: number;
    height: number;
    symbolSize: number;
    symbolTextures: Texture[];
  }) {
    this.container.x = config.x;

    this.symbolSize = config.symbolSize;
    this.reelHeight = config.height;
    this.textures = config.symbolTextures;

    this.container.addChild(this.symbolContainer);

    this.createMask(config.width, config.height);
    this.createSymbols();

    this.totalHeight = this.symbols.length * this.symbolSize;
  }

  private createMask(width: number, height: number) {
    const mask = new Graphics()
      .rect(0, 0, width, height)
      .fill(0xffffff);

    this.container.addChild(mask);
    this.symbolContainer.mask = mask;
  }

  private createSymbols() {
    const total = GameConfig.rows + GameConfig.reel.extraSymbols;

    for (let i = 0; i < total; i++) {
      const texture =
        this.textures[Math.floor(Math.random() * this.textures.length)];

      const sprite = new Sprite(texture);

      sprite.width = this.symbolSize;
      sprite.height = this.symbolSize;

      sprite.y = i * this.symbolSize;

      this.symbolContainer.addChild(sprite);
      this.symbols.push(sprite);
    }
  }


  public start() {
    this.speed = GameConfig.spin.startSpeed;
    this.isSpinning = true;
    this.stopping = false;
  }

  public stop() {
    this.stopping = true;

    const remainder = this.scrollY % this.symbolSize;
    this.stopDistance = this.symbolSize - remainder;

    this.stoppingPhase = true;
  }

  public update(delta: number) {
    if (!this.isSpinning) return;
    this.scrollY += this.speed * delta;
    this.symbolContainer.y = this.scrollY;

    this.recycleSymbols();

    if (this.stoppingPhase) {

      const moveAmount = this.speed * delta;

      this.stopDistance -= moveAmount;

      if (this.stopDistance <= 0) {

        this.scrollY += this.stopDistance;

        this.symbolContainer.y = this.scrollY;

        this.speed = 0;
        this.isSpinning = false;
        this.stopping = false;
        this.stoppingPhase = false;

      } else {
        this.speed *= GameConfig.spin.decelerationFactor;
      }
    }

  }


  private recycleSymbols() {
    for (const symbol of this.symbols) {
      const globalY = symbol.y + this.scrollY;

      if (globalY >= this.reelHeight) {
        symbol.y -= this.totalHeight;
        symbol.texture =
          this.textures[Math.floor(Math.random() * this.textures.length)];
      }
    }
  }


  public get spinning(): boolean {
    return this.isSpinning;
  }
}
