/// <reference types="./Map" />
import Tileset from './Tileset';

export default class Map {
  private tileset: Tileset;
  private ground: number[][];
  private invalidFrame: number[];
  private start: Coord;
  private end: Coord;

  public load(mapData: MapData) {
    return new Promise(async (resolve) => {
      this.tileset = new Tileset();
      this.tileset.load(mapData.tileset).then(() => {
        this.ground = mapData.ground;
        this.invalidFrame = mapData.invalidFrame || [];
        this.start = mapData.start;
        this.end = mapData.end;
        resolve();
      });
    });
  }

  public getStart(): Coord {
    return this.start;
  }

  public getWidth() {
    return this.ground[0].length;
  }

  public getHeight() {
    return this.ground.length;
  }

  public draw(context: CanvasRenderingContext2D, camCoord: Coord, width: number, height: number) {
    for (let i = 0; i < this.ground.length; i++) {
      if (i >= camCoord.y && i <= camCoord.y + height) {
        const ligne: number[] = this.ground[i];
        const y: number = (i - camCoord.y) * 32;
        for (let j = 0, k = ligne.length; j < k; j++) {
          if (j >= camCoord.x && j <= camCoord.x + width) {
            const x = (j - camCoord.x) * 32;
            this.tileset.draw(ligne[j], context, x, y);
          }
        }
      }
    }
  }

  public getEnd(): Coord {
    return this.end;
  }

  public isValidCase(coord: Coord): boolean {
    if (coord.x >= this.getWidth() || coord.y >= this.getHeight()) {
      return false;
    }

    if (this.invalidFrame.indexOf(this.ground[coord.y][coord.x]) !== -1) {
      return false;
    }

    return true;
  }
}
