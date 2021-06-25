//// IMPORT
// Global Constants
import {tileW, tileH, mapW, mapH, 
  floorTypes, tileTypes, directions, keysDown, cursorPositions
} from './globalConst.js';
// Dungeon
import dungeon from './exploration/dungeon.js';
// Classes
import Character from './exploration/Character.js';
import PokemonIcon from './exploration/PokemonIcon.js';

import Pokemon from './battle/Pokemon.js';
import Sprite from './Sprite.js';
// Game States
import {gameStates, logStates} from './gameStates.js';
// Sprites
import {interfaceSprite, battleBgSprite, pokemonSprite
} from './battle/sprites.js' 

// Utility functions
import {getFrame, toIndex} from './exploration/utils.js';
import {fetchTypesTable} from './battle/utils.js'

///////// GLOBAL VARIABLES DECRALATIONS

let gameMap = dungeon[35].room;
let myAttack = {
  move: {},
  damage: 0,
  log: ''
};
let foeAttack = {
  move: {},
  damage: 0,
  log: ''
};
let gameState;
let logState;
let logStage = 0;
let cursorPosition;
let myPokeFirst;
let typesTable = {};
let myPoke;
let foePoke;
 
// Time (add description)
let currentSecond = 0;
let frameCount = 0;
let framesLastSecond = 0;
let lastFrameTime = 0;


// Start the game
async function setup() {
  battleBgSprite.load();
  interfaceSprite.load();
  pokemonSprite.load();
  myPoke = await Pokemon.createByName(25, 25);
  foePoke = await Pokemon.createByName(6, 25);
  console.log('myPoke', myPoke);
  console.log('foePoke', foePoke);
  await fetchTypesTable();
  // console.log(getModType('fighting', ['ghost']));
  gameState = gameStates.battle.log;
  logState = logStates.battle.intro;
  cursorPosition = cursorPositions.action.topLeft;

  requestAnimationFrame(drawGame);
}

// Start
// setup();


//// Images
let ctx = null; //Declare canvas element
// Tileset
let tileset = null; // Declare img element
const tilesetURL = './images/floor-tiles.png';
let tilesetLoaded = false; // bool to keep track of loading of img file

// Character
let charSprites = null; // Declare img element
const charSpritesURL = './images/red-sprite.png';
let charSpritesLoaded = false;

// Character
let pokeIcon = null; // Declare img element
const pokeIconURL = './images/icon_gif/Ani001MS.gif';
let pokeIconLoaded = false;

//////// START GAME
let player = new Character();
player.placeAt(4, 4);
player.direction = directions.down;


window.onload = () => {
  ctx = document.getElementById('game').getContext('2d');
  requestAnimationFrame(drawGame);
  ctx.imageSmoothingEnabled = false;
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
    alert('Failed loading images');
  }
  tileset.onload = function() {
    tilesetLoaded = true;
  }
  tileset.src = tilesetURL;

  charSprites = new Image();
  charSprites.onerror = function () {
    ctx = null;
    alert('Failed loading images');
  }
  charSprites.onload = function() {
    charSpritesLoaded = true;
  }
  charSprites.src = charSpritesURL;

  pokeIcon = new Image();
  pokeIcon.onerror = function () {
    ctx = null;
    alert('Failed loading images');
  }
  pokeIcon.onload = function() {
    pokeIconLoaded = true;
  }
  pokeIcon.src = pokeIconURL;



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
  if(!tilesetLoaded || !charSpritesLoaded ||!pokeIconLoaded) { // Wait for images loading
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


export {gameMap, ctx};