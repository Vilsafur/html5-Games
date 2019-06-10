/// <reference types="./Character" />
import { Direction } from './Direction';
import Map from './Map';

export default class Character {
  private img: HTMLImageElement;
  private width: number;
  private height: number;
  private x: number;
  private y: number;
  private direction: Direction;
  private animationState: number = -1;
  private animationDuration: number = 4;
  private travelingTime: number = 15;

  public getPosition(): Coord {
    return {x: this.x, y: this.y};
  }

  public load(url: string, x: number, y: number, direction: Direction) {
    return new Promise ((resolve) => {
      this.x = x;
      this.y = y;
      this.direction = direction;

      this.img = new Image();
      this.img.onload = () => {
        this.width = this.img.width / 4;
        this.height = this.img.height / 4;

        resolve();
      };
      this.img.src = require('../assets/sprites/' + url);
    });
  }

  public moveTo(position: Coord) {
    this.x = position.x;
    this.y = position.y;
  }

  public draw(context: CanvasRenderingContext2D, camCoord: Coord) {
    let frame: number = 0; // Numéro de l'image à prendre pour l'animation
    let offsetX: number = 0;
    let offsetY: number = 0; // Décalage à appliquer à la position du personnage

    if (this.animationState >= this.travelingTime) {
      // Si le déplacement a atteint ou dépassé le temps nécessaire pour s'effectuer, on le termine
      this.animationState = -1;
    } else if (this.animationState >= 0) {
      // On calcule l'image (frame) de l'animation à afficher
      frame = Math.floor(this.animationState / this.animationDuration);
      if (frame > 3) {
        frame %= 4;
      }

      // Nombre de pixels restant à parcourir entre les deux cases
      const PixelsToBrowse = 32 - (32 * (this.animationState / this.travelingTime));
      // À partir de ce nombre, on définit le décalage en x et y.
      // NOTE : Si vous connaissez une manière plus élégante que ces quatre conditions, je suis preneur
      if (this.direction === Direction.UP) {
        offsetY = PixelsToBrowse;
      } else if (this.direction === Direction.DOWN) {
        offsetY = -PixelsToBrowse;
      } else if (this.direction === Direction.LEFT) {
        offsetX = PixelsToBrowse;
      } else if (this.direction === Direction.RIGHT) {
        offsetX = -PixelsToBrowse;
      }

      this.animationState++;
    }

    // Point de destination (dépend de la taille du personnage)
    const destX = (((this.x - camCoord.x) * 32) - (this.width / 2) + 16 + offsetX);
    const destY = (((this.y - camCoord.y) * 32) - this.height + 24 + offsetY);

    context.drawImage(
      this.img,
      // Point d'origine du rectangle source à prendre dans notre image
      this.width * frame, this.direction * this.height,
      this.width, this.height, // Taille du rectangle source (c'est la taille du personnage)
      destX, destY,
      this.width, this.height, // Taille du rectangle destination (c'est la taille du personnage)
    );
  }

  public move(direction: Direction, map: Map): boolean {
    if (this.animationState >= 0) {
      return false;
    }

    this.direction = direction;

    const nextCase: Coord = this.getAdjacentCoordinates(direction);

    if (!this.isValidNextCase(nextCase, map)) {
      return false;
    }

    this.animationState = 1;
    this.x = nextCase.x;
    this.y = nextCase.y;

    return true;
  }

  public isArrivedAt(frame: Coord): boolean {
    if (frame.x === this.x && frame.y === this.y && this.animationState === -1) {
      return true;
    }

    return false;
  }

  private isValidNextCase(nextCase: Coord, map: Map): boolean {
    if (nextCase.x < 0 || nextCase.y < 0) {
      return false;
    }

    return map.isValidCase(nextCase);
  }

  private getAdjacentCoordinates(direction: Direction): Coord {
    const coord: Coord = {
      x: this.x,
      y: this.y,
    };

    switch (direction) {
      case Direction.DOWN:
        coord.y++;
        break;

      case Direction.LEFT:
        coord.x--;
        break;

      case Direction.RIGHT:
        coord.x++;
        break;

      case Direction.UP:
        coord.y--;
        break;
    }

    return coord;
  }
}
