<template>
  <div class="bricks">
    <h1>Labyrinth Game</h1>
    <b-container fluid>
      <b-row>
        <b-col md="3" xl="2" col="12">
          <b-form-select v-model="labSelect" :options="labyrinthe" size="sm" @change="updateMap">
          </b-form-select>
        </b-col>
        <b-col md="9" xl="8" col="12" pb-md-3 pl-md-5>
          <canvas id="RpgCanvas">Votre navigateur ne supporte pas HTML5, veuillez le mettre à jour pour jouer.</canvas>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Scene from '../../utils/Scene';
import { Direction } from '../../utils/Direction';
import axios from 'axios';

@Component
export default class Labyrinth extends Vue {
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
        30,
        20,
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