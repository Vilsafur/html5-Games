
export default class Tileset {
  private image: HTMLImageElement;
  private largeur: number;

  public load(url: string) {
    return new Promise((resolve) => {
      this.image = new Image();
      this.image.onload = () => {
        this.largeur = this.image.width / 32;
        resolve();
      };
      this.image.src = require('../assets/tilesets/' + url);
    });
  }

  public draw(nb: number, context: CanvasRenderingContext2D, x: number, y: number) {
    const xSourceInTiles = (nb % this.largeur !== 0) ? nb % this.largeur : this.largeur;
    const ySourceInTiles = Math.ceil(nb / this.largeur);

    const xSource = (xSourceInTiles - 1) * 32;
    const ySource = (ySourceInTiles - 1) * 32;

    context.drawImage(this.image, xSource, ySource, 32, 32, x, y, 32, 32);
  }
}
