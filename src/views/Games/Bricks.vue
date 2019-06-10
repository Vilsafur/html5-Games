<template>
  <div class="bricks">
    <h1>Bricks Game</h1>
    <div>
        <canvas id="bricksCanvas" width="480" height="320"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
/// <reference types="./Bricks" />
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Bricks extends Vue {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D ;
  private ball = {
    x: 0,
    y: 0,
    radius: 10,
    direction: {
      x: 2,
      y: -2,
    },
  };
  private paddle = {
    height: 10,
    width: 75,
    x: 0,
  };
  private rightPressed: boolean = false;
  private leftPressed: boolean = false;
  private brick = {
    nbRow: 3,
    nbColumn: 5,
    width: 75,
    height: 20,
    padding: 10,
    offset: {
      top: 10,
      left: 30,
    },
  };
  private bricks: Brick[][] = [];
  private score: number = 0;

  public mounted() {
    this.canvas = document.getElementById('bricksCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    for (let c = 0; c < this.brick.nbColumn; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brick.nbRow; r++) {
        this.bricks[c][r] = {
          x: 0,
          y: 0,
          status: true,
        };
      }
    }
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.paddle.x = (this.canvas.width - this.paddle.width) / 2;

    document.addEventListener('keydown', this.keyDownHandler, false);
    document.addEventListener('keyup', this.keyUpHandler, false);
    document.addEventListener('mousemove', this.mouseMoveHandler, false);
    alert('Go !');
    this.draw();
  }

  private drawScore() {
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fillText('Score: ' + this.score, 8, 20);
  }

  private collisionDetection() {
    for (let c = 0; c < this.brick.nbColumn; c++) {
      for (let r = 0; r < this.brick.nbRow; r++) {
        const b = this.bricks[c][r];
        if (b.status === true) {
          if (
            this.ball.x > b.x - this.ball.radius &&
            this.ball.x < b.x + this.brick.width + this.ball.radius &&
            this.ball.y > b.y - this.ball.radius &&
            this.ball.y < b.y + this.brick.height + this.ball.radius
          ) {
            this.ball.direction.y = -this.ball.direction.y;
            b.status = false;
            this.score++;
            if (this.score === this.brick.nbRow * this.brick.nbColumn) {
              alert('YOU WIN, CONGRATULATIONS!');
              document.location.reload();
            }
          }
        }
      }
    }
  }

  private drawBricks() {
    for (let c = 0; c < this.brick.nbColumn; c++) {
      for (let r = 0; r < this.brick.nbRow; r++) {
        if (this.bricks[c][r].status === true) {
          const brickX = (c * (this.brick.width + this.brick.padding)) + this.brick.offset.left;
          const brickY = (r * (this.brick.height + this.brick.padding)) + this.brick.offset.top;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brick.width, this.brick.height);
          this.ctx.fillStyle = '#0095DD';
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }

  private drawPaddle() {
    this.ctx.beginPath();
    this.ctx.rect(this.paddle.x, this.canvas.height - this.paddle.height, this.paddle.width, this.paddle.height);
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fill();
    this.ctx.closePath();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBall();
    this.drawPaddle();
    this.drawBricks();
    this.collisionDetection();
    this.drawScore();

    if (
      this.ball.x + this.ball.direction.x > this.canvas.width - this.ball.radius ||
      this.ball.x + this.ball.direction.x < this.ball.radius) {
      this.ball.direction.x = -this.ball.direction.x;
    }
    if (this.ball.y + this.ball.direction.y < this.ball.radius) {
      this.ball.direction.y = -this.ball.direction.y;
    } else if (this.ball.y + this.ball.direction.y > this.canvas.height - this.ball.radius) {
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.direction.y = -this.ball.direction.y;
      } else {
        alert('GAME OVER');
        document.location.reload();
      }
    }
    this.ball.x += this.ball.direction.x;
    this.ball.y += this.ball.direction.y;

    if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.x += 7;
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.x -= 7;
    }
    requestAnimationFrame(this.draw);
  }

  private keyDownHandler(e: KeyboardEvent) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  private keyUpHandler(e: KeyboardEvent) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  private mouseMoveHandler(e: MouseEvent) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.x = relativeX - this.paddle.width / 2;
    }
  }
}
</script>

<style lang="scss">
canvas {
  background: #eee;
  display: block;
  margin: 0 auto;
}  
</style>