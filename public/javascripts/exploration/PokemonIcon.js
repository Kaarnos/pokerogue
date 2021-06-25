import {tileH, tileW} from '../globalConst.js'

export default class PokemonIcon {
  constructor() {
    this.dimensions = [64, 64]; // px
    this.tileFrom = [1, 1]; // Tile where movement started
    this.tileTo = [1, 1]; // Tile where movement ends
    this.position = [64, 64] // px
  }

  placeAt(x, y) { // Place the character at tile [x,y]
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [tileW * x, tileH * y + (tileH - this.dimensions[1])]; // Modify if character is not same size than tile
  }
}