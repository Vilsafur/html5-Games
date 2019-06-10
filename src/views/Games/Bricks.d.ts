declare interface Brick {
  x: number;
  y: number;
  status: boolean;
}

declare interface Bricks {
  canvas?: HTMLElement;
  ctx?: CanvasRenderingContext2D;
  ball: {
    x: number;
    y: number;
    radius: number;
    direction: {
      x: number;
      y: number;
    };
  };
  paddle: {
    height: number;
    width: number;
    x: number;
  };
  rightPressed: boolean;
  leftPressed: boolean;
  brick: {
    nbRow: number;
    nbColumn: number;
    width: number;
    height: number;
    padding: number;
    offset: {
      top: number;
      left: number;
    };
  };
  bricks: Brick[][];
}