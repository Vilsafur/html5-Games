import Map from './Map';
import Character from './Character';
import { Direction } from './Direction';

export default class Scene {
  private map: Map;
  private player: Character;
  private pnj: Character[] = [];
  private end: boolean = false;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private coord: Coord = {x: 0, y: 0};
  private maxSize: {width: number; height: number};

  public async init(
    context: CanvasRenderingContext2D,
    map: MapData,
    playerInfo: {name: string, direction: Direction},
    maxWidth: number,
    maxHeight: number,
  ) {
    this.map = new Map();
    this.player = new Character();
    this.maxSize = {
      width: maxWidth,
      height: maxHeight,
    };

    this.context = context;

    await this.map.load(map);
    this.width = (this.map.getWidth() < maxWidth) ? this.map.getWidth() : maxWidth;
    this.height = (this.map.getHeight() < maxHeight) ? this.map.getHeight() : maxHeight;

    await this.player.load(playerInfo.name, this.map.getStart().x, this.map.getStart().y, playerInfo.direction);
    this.initMovePlayer();
  }

  public async updateMap(map: MapData) {
    this.map = new Map();
    await this.map.load(map);
    this.width = (this.map.getWidth() < this.maxSize.width) ? this.map.getWidth() : this.maxSize.width;
    this.height = (this.map.getHeight() < this.maxSize.height) ? this.map.getHeight() : this.maxSize.height;

    this.player.moveTo(this.map.getStart());
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getPxWidth(): number {
    return this.width * 32;
  }

  public getPxHeight(): number {
    return this.height * 32;
  }

  public addPnj(character: Character) {
    this.pnj.push(character);
  }

  public draw() {
    if (this.map.getWidth() === 0) {
      return;
    }
    this.centerScene();
    this.context.clearRect(0, 0, this.getPxWidth(), this.getPxHeight());
    this.map.draw(this.context, this.coord, this.width, this.height);

    this.player.draw(this.context, this.coord);

    if (!this.end && this.player.isArrivedAt(this.map.getEnd())) {
      this.end = true;
      alert('Gagner !!!');
    }

    const l = this.pnj.length;
    for (let i: number = 0 ; i < l ; i++) {
      this.pnj[i].draw(this.context, this.coord);
    }
  }

  private initMovePlayer() {
    window.onkeydown = (event) => {
      const e = event || window.event;
      const key = e.which || e.keyCode;

      switch (key) {
        case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut, z, w, Z, W
          this.player.move(Direction.UP, this.map);
          break;
        case 40 : case 115 : case 83 : // Flèche bas, s, S
          this.player.move(Direction.DOWN, this.map);
          break;
        case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
          this.player.move(Direction.LEFT, this.map);
          break;
        case 39 : case 100 : case 68 : // Flèche droite, d, D
          this.player.move(Direction.RIGHT, this.map);
          break;
        default :
          return true;
      }

      return false;
    };
  }

  private centerScene() {
    let nextX  = this.player.getPosition().x - (this.width / 2);
    if (nextX < 0) {
      nextX = 0;
    } else if (nextX + this.width > this.map.getWidth()) {
      nextX = this.map.getWidth() - this.width;
    }
    this.coord.x = nextX;

    let nextY  = this.player.getPosition().y - (this.height / 2);

    if (nextY < 0) {
      nextY = 0;
    } else if (nextY + this.height > this.map.getHeight()) {
      nextY = this.map.getHeight() - this.height;
    }
    this.coord.y = nextY;
  }
}
