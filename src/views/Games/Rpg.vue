<template>
  <div class="bricks">
    <h1>Rpg Game</h1>
    <div>
      <b-form-select v-model="labSelect" :options="labyrinthe" size="sm" @change="updateMap">
      </b-form-select>
    </div>
    <div>
        <canvas id="RpgCanvas">Votre navigateur ne supporte pas HTML5, veuillez le mettre à jour pour jouer.</canvas>
    </div>
  </div>
</template>

<script lang="ts">
/// <reference types="./Rpg" />
import { Component, Vue } from 'vue-property-decorator';
import Scene from '../../utils/Scene';
import { Direction } from '../../utils/Direction';
import axios from 'axios';

@Component
export default class Rpg extends Vue {
  private scene: Scene;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private labyrinthe = [
    'premiere',
    'seconde',
    'troisieme',
    'quatrieme',
    'cinquieme',
  ];
  private labSelect: string = 'seconde';

  public mounted() {
    this.initLabirynthe();
  }

  private initLabirynthe() {
    this.canvas = document.getElementById('RpgCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.scene = new Scene();
    axios.get('/maps/' + this.labSelect + '.json').then((response) => {
      this.scene.init(
        this.ctx,
        response.data,
        {
          name: 'greenbaragon_good.png',
          direction: Direction.RIGHT,
        },
        13,
        10,
      ).then(() => {
        this.canvas.width = this.scene.getPxWidth();
        this.canvas.height = this.scene.getPxHeight();
        this.draw();
      });
    });
  }

  private updateMap() {
    axios.get('/maps/' + this.labSelect + '.json').then((response) => {
      this.scene.updateMap(
        response.data,
      ).then(() => {
        this.canvas.width = this.scene.getPxWidth();
        this.canvas.height = this.scene.getPxHeight();
      });
    });
  }

  private draw() {
    this.scene.draw();
    requestAnimationFrame(this.draw);
  }
}
</script>

<style lang="scss" scoped>
canvas {
  background: #eee;
  display: block;
  margin: 0 auto;
  border: 1px solid black;
}  
</style>