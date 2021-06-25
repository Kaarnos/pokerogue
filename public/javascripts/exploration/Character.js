import {directions, tileW, tileH, mapW, mapH, tileTypes, floorTypes} from '../globalConst.js'
import {toIndex} from './utils.js'
import {gameMap} from '../main.js'

export default class Character { // Character class
  constructor() {
    this.dimensions = [38, 57]; // px
    this.tileFrom = [1, 1]; // Tile where movement started
    this.tileTo = [1, 1]; // Tile where movement ends
    this.position = [38, 19] // px
    this.timeMoved = 0; // time at which the movement started
    this.delayMove = 200 // ms / Time to move 1 tile
    this.direction = directions.down // Facing direction
    this.roomIndex = 35;
    this.discoveredRooms = [35];

    this.sprites = {}; // Declaration of the sprites object
    this.sprites[directions.down] = {sprite: [
      {x:12,y:5,w:38,h:57,d:this.delayMove/4},
      {x:76,y:5,w:38,h:57,d:this.delayMove/4},
      {x:140,y:5,w:38,h:57,d:this.delayMove/4},
      {x:204,y:5,w:38,h:57,d:this.delayMove/4}
      ]};
    this.sprites[directions.left] = {sprite: [
      {x:12,y:69,w:38,h:57,d:this.delayMove/4},
      {x:76,y:69,w:38,h:57,d:this.delayMove/4},
      {x:140,y:69,w:38,h:57,d:this.delayMove/4},
      {x:204,y:69,w:38,h:57,d:this.delayMove/4}
      ]};
    this.sprites[directions.right] = {sprite: [
      {x:12,y:133,w:38,h:57,d:this.delayMove/4},
      {x:76,y:133,w:38,h:57,d:this.delayMove/4},
      {x:140,y:133,w:38,h:57,d:this.delayMove/4},
      {x:204,y:133,w:38,h:57,d:this.delayMove/4}
      ]};
    this.sprites[directions.up] = {sprite: [
      {x:12,y:197,w:38,h:57,d:this.delayMove/4},
      {x:76,y:197,w:38,h:57,d:this.delayMove/4},
      {x:140,y:197,w:38,h:57,d:this.delayMove/4},
      {x:204,y:197,w:38,h:57,d:this.delayMove/4}
      ]};
  }

  placeAt(x, y) { // Place the character at tile [x,y]
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [tileW * x, tileH * y + (tileH - this.dimensions[1])]; // Modify if character is not same size than tile
  }

  // Return false if no movement at this time 
  // Return true and move the character if there is movement
  processMovement(time) { 
    if (this.tileFrom[0] === this.tileTo[0] && 
      this.tileFrom[1] === this.tileTo[1]) {
      // console.log("movement", false);
      return false;
    }
    
    // if the elapsed movement time is greater than the time needed to go to the tile
    if ( (time - this.timeMoved) >= this.delayMove) {
      this.placeAt(this.tileTo[0], this.tileTo[1]); // place the character on the tile
    }
    // else move the character 
    else { // Center the character on start tile
      // console.log("updating position");
      this.position[0] = ( this.tileFrom[0] * tileW ) + 
                            ( (tileW - this.dimensions[0]) / 2 );
      this.position[1] = ( this.tileFrom[1] * tileH ) + 
                            (tileH - this.dimensions[1]);
      if ( this.tileTo[0] != this.tileFrom[0] ) { // if move left or right
        // distance moved since the start of movement
        var diff = ( tileW / this.delayMove) * (time - this.timeMoved);
        // if going left substract the distance, of going right add
        this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
      }
      if ( this.tileTo[1] != this.tileFrom[1] ) { // if move up or down
        var diff = ( tileH / this.delayMove) * (time - this.timeMoved);
        this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
      }
      // round to integer px
      this.position[0] = Math.round(this.position[0]);
      this.position[1] = Math.round(this.position[1]);
    }
    
    return true;
  }

  canMoveTo(x, y) { // tile coordonates
    if (x < 0 || y < 0 || x >= mapW || y >= mapH) {
      return false;
    } else if (tileTypes[gameMap[toIndex(x, y)]].floor === floorTypes.solid) {
      return false;
    }
    return true;
  }

  canMoveUp() {
    return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1);
  }
  canMoveDown() {
    return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
  }
  canMoveLeft() {
    return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]);
  }
  canMoveRight() {
    return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]);
  }

}