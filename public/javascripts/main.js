console.log("Hello JS");

// Import
import {startRoom, treasureRoom, bossRoom, rooms} from './maps.js';
import dungeon from './dungeon.js';


// console.log(exportDefault);

///////// GLOBAL VARIABLES DECRALATIONS
let ctx = null; //Declare canvas element

// Map layout
let tileW = 38; //px
let tileH = 38; //px
let mapW = 10; //tiles
let mapH = 10; //tiles

// Fill dungeon with rooms

let roomsCopy = [...rooms];
dungeon.map((room, index) => {
  if (room.state === 'exist' || room.state === 'deadend') {
    let rdmIndex = Math.floor(Math.random()* roomsCopy.length);
    room.room = [...roomsCopy[rdmIndex]];
    roomsCopy.splice(rdmIndex, 1);
    if (roomsCopy.length === 0) {
      roomsCopy = [...rooms];
    }
  }
  if (room.state === 'boss') {
    room.room = bossRoom;
  }
  if (room.state === 'treasure') {
    room.room = treasureRoom;
  }
  if (room.state === 'start') {
    room.room = startRoom;
  }
  if (room.state !== 'empty' && dungeon[index + 10].state !== 'empty') {
    console.log('door down');
    room.room[toIndex(4, 9)] = 0;
    room.room[toIndex(5, 9)] = 0;
  }
  if (room.state !== 'empty' && dungeon[index - 10].state !== 'empty') {
    room.room[toIndex(4, 0)] = 0;
    room.room[toIndex(5, 0)] = 0;
  }
  if (room.state !== 'empty' && dungeon[index + 1].state !== 'empty') {
    room.room[toIndex(9, 4)] = 0;
    room.room[toIndex(9, 5)] = 0;
  }
  if (room.state !== 'empty' && dungeon[index - 1].state !== 'empty') {
    room.room[toIndex(0, 4)] = 0;
    room.room[toIndex(0, 5)] = 0;
  }

  return;
});

console.log('dungeon', dungeon);
console.log('room', rooms);
console.log('roomsCopy', roomsCopy);


let gameMap = dungeon[35].room;


// Draw map
// let mapEl = document.getElementById('map');
// // console.log('dungeon', dungeon);
// for (let i = 0; i < dungeon.length ; i++) {
//   let room = document.createElement('div');
//   // console.log('test');
//   if (dungeon[i].state === 'exist' || dungeon[i].state === 'deadend' || dungeon[i].state === 'start') {
//     room.className = 'room exist'
//   } else if (dungeon[i].state === 'treasure') {
//     room.className = 'room treasure'
//   } else if (dungeon[i].state === 'boss') {
//     room.className = 'room boss'
//   } else {
//     room.className = 'room empty'
//   }
//   room.textContent = dungeon[i].distance
//   mapEl.appendChild(room);
// }


 
// Time (add description)
var currentSecond = 0;
var frameCount = 0;
var framesLastSecond = 0;
var lastFrameTime = 0;

//// Images
// Tileset
let tileset = null; // Declare img element
let tilesetURL = './images/floor-tiles.png';
let tilesetLoaded = false; // bool to keep track of loading of img file

// Character
let charSprites = null; // Declare img element
let charSpritesURL = './images/red-sprite.png';
let charSpritesLoaded = false;

// Floor types
let floorTypes = {
  solid: 0,
  path: 1,
  exit: 2
};

let tileTypes = {
  0: {floor: floorTypes.exit, sprite:[{x:152, y:14, w:64, h:64}]}, // Entrance/exit
  1: {floor: floorTypes.path, sprite:[{x:20,y:14,w:64,h:64}]}, // Grass
  2: {floor: floorTypes.solid, sprite:[{x:416,y:80,w:64,h:64}]}, // Wall
  3: {floor: floorTypes.path, sprite:[{x:86,y:14,w:64,h:64}]}, // Ground
  4: {floor: floorTypes.path, sprite:[{x:218,y:14,w:64,h:64}]}, // Ford
  5: {floor: floorTypes.solid, sprite:[{x:152,y:80,w:64,h:64}]}, // River
  6: {floor: floorTypes.path, sprite:[{x:416,y:14,w:64,h:64}]}, // Meadow
  7: {floor: floorTypes.path, sprite:[{x:284,y:14,w:64,h:64}]}, // Forest
  8: {floor: floorTypes.path, sprite:[{x:350,y:14,w:64,h:64}]}, // Snow
  9: {floor: floorTypes.path, sprite:[{x:20,y:80,w:64,h:64}]}, // Ice
  10: {floor: floorTypes.path, sprite:[{x:86,y:80,w:64,h:64}]}, // Frost
  11: {floor: floorTypes.path, sprite:[{x:218,y:80,w:64,h:64}]}, // Swamp
  12: {floor: floorTypes.path, sprite:[{x:284,y:80,w:64,h:64}]}, // Sand
  13: {floor: floorTypes.solid, sprite:[{x:350,y:80,w:64,h:64}]}, // Rock 
};

// Miscellaneous
let directions = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
};

let keysDown = {
  37: false,
  38: false,
  39: false,
  40: false,
}





////////// INITIALIZATION

class Character { // Character class
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


///////// UTILITY FUNCTIONS
function toIndex(x, y) { // get map index from tile position
  return ( x + (y * mapW));
}

function getFrame(sprite, duration, time, animated) {
  if(!animated) {
    return sprite[0];
  }
  time = time % duration;
  for (let indexSprite in sprite) {
    if (sprite[indexSprite].end >= time) {
      return sprite[indexSprite];
    }
  }
}

//////// START GAME
let player = new Character();
player.placeAt(4, 4);
player.direction = directions.down;


window.onload = () => {
  ctx = document.getElementById('game').getContext('2d');
  requestAnimationFrame(drawGame);
  ctx.font = "bold 10pt sans-serif"; // for FPS text

  $(window).keydown(function(event) {
    keysDown[event.keyCode] = true;
  });

  $(window).keyup(function(event) {
    keysDown[event.keyCode] = false;
  });

  tileset = new Image();
  tileset.onerror = function () {
    ctx = null;
    alter('Failed loading images');
  }
  tileset.onload = function() {
    tilesetLoaded = true;
  }
  tileset.src = tilesetURL;

  charSprites = new Image();
  charSprites.onerror = function () {
    ctx = null;
    alter('Failed loading images');
  }
  charSprites.onload = function() {
    charSpritesLoaded = true;
  }
  charSprites.src = charSpritesURL;


  for (let key in player.sprites) {
    player.sprites[key]['animated'] = player.sprites[key].sprite.length > 1 ? true : false;

    if (player.sprites[key].animated) {
      let time = 0;
      for ( let indexSprite in player.sprites[key].sprite) {
        player.sprites[key].sprite[indexSprite]['start'] = time;
        time += player.sprites[key].sprite[indexSprite].d;
        player.sprites[key].sprite[indexSprite]['end'] = time;
        // console.log('finaltime', time + "_" + indexSprite);
      }
      player.sprites[key].spriteDuration = time;
      
    }
  }
  // console.log(player.sprites);
}

///////// RENDERING
function drawGame() {
  if (ctx === null) { // Prevent errors
    return;
  }
  if(!tilesetLoaded || !charSpritesLoaded) { // Wait for images loading
    requestAnimationFrame(drawGame);
    // console.log("not loaded");
    return;
  }

  var currentFrameTime = Date.now(); // time at which the game is rendered

  let isMoving = true;
  // Check if there is movement and update the position of the player
  if (!player.processMovement(currentFrameTime)) { // if true, update position
    isMoving = false;
    if (keysDown[38] && player.canMoveUp()) {
      player.tileTo[1] -= 1;
      player.timeMoved = currentFrameTime;
      player.direction = directions.up;
    } else if (keysDown[40] && player.canMoveDown()) {
      player.tileTo[1] += 1;
      player.timeMoved = currentFrameTime;
      player.direction = directions.down;
    } else if (keysDown[37] && player.canMoveLeft()) {
      player.tileTo[0] -= 1;
      player.timeMoved = currentFrameTime;
      player.direction = directions.left;
    } else if (keysDown[39] && player.canMoveRight()) {
      player.tileTo[0] += 1;
      player.timeMoved = currentFrameTime;
      player.direction = directions.right;
    }
    if (tileTypes[gameMap[toIndex(player.tileTo[0], player.tileTo[1])]].floor === floorTypes.exit) {

      switch (player.direction) {
        case directions.up:
          player.placeAt(player.tileTo[0], player.tileTo[1] + (mapH - 1));
          gameMap = dungeon[player.roomIndex - 10].room;
          player.roomIndex = player.roomIndex - 10;
          break;
        case directions.down:
          player.placeAt(player.tileTo[0], player.tileTo[1] - (mapH - 1));
          gameMap = dungeon[player.roomIndex + 10].room;
          player.roomIndex = player.roomIndex + 10;
          break;
        case directions.right:
          player.placeAt(player.tileTo[0] - (mapW - 1), player.tileTo[1]);
          gameMap = dungeon[player.roomIndex + 1].room;
          player.roomIndex = player.roomIndex + 1;
          break;
        case directions.left:
          player.placeAt(player.tileTo[0] + (mapW - 1), player.tileTo[1]);
          gameMap = dungeon[player.roomIndex - 1].room;
          player.roomIndex = player.roomIndex - 1;
          break;
        default:
          break;
      }
      player.discoveredRooms.push(player.roomIndex);
      // player.placeAt(0, 4);
      // player.direction = directions.right;
    }
  }

  // Render map
  for (let x = 0 ; x < mapW ; x++) {
    for (let y = 0 ; y < mapH ; y++) {
      let frame = tileTypes[gameMap[toIndex(x, y)]].sprite[0]
      ctx.drawImage(tileset,
        frame.x, frame.y, frame.w, frame.h,
        x*tileW, y*tileH, tileW, tileH
      );
    }
  }

  let charSprite = player.sprites[player.direction];
  // console.log(isMoving);
  let timeElapsed = currentFrameTime - player.timeMoved ;
  let frame = getFrame(charSprite.sprite, charSprite.spriteDuration, timeElapsed, isMoving);
  // console.log(currentFrameTime);
  // Render character
  ctx.drawImage(charSprites,
    frame.x, frame.y,
    frame.w, frame.h,
    player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]
  );



  // Draw map
  let mapEl = document.getElementById('map');

  mapEl.innerHTML = '';
  // console.log('dungeon', dungeon);
  for (let i = 0; i < dungeon.length ; i++) {
    let room = document.createElement('div');
    // console.log('test');
    if (player.discoveredRooms.find(room => room === i)) {
      if (dungeon[i].state === 'exist' || dungeon[i].state === 'deadend' || dungeon[i].state === 'start') {
        room.className = 'room exist'
      } else if (dungeon[i].state === 'treasure') {
        room.className = 'room treasure'
      } else if (dungeon[i].state === 'boss') {
        room.className = 'room boss'
      }
    } else {
      room.className = 'room empty'
    }
    if (player.roomIndex === i) {
      room.textContent = 'P'
    }
    mapEl.appendChild(room);
}




  requestAnimationFrame(drawGame);
}
