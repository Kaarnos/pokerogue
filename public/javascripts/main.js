//// IMPORT
// Global Constants
import {tileW, tileH, mapW, mapH, 
  floorTypes, tileTypes, directions, 
  keysDown, AButton, BButton, cursorPositions
} from './globalConst.js';
// Dungeon
import dungeon from './exploration/dungeon.js';
// Classes
import Character from './exploration/Character.js';
import Pokemon from './battle/Pokemon.js';
// Game States
import {gameStates, logStates} from './gameStates.js';
// Sprites
import {interfaceSprite, battleBgSprite, pokemonSprite
} from './battle/sprites.js' 
import {tilesetSprite, charSprite, pokeIconSprite
} from './exploration/sprites.js'

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
let typesTable;
let myPoke;
let foePoke;
let log;
 
// Time (add description)
let currentSecond = 0;
let frameCount = 0;
let framesLastSecond = 0;
let lastFrameTime = 0;


let player = new Character();
player.placeAt(4, 4);
player.direction = directions.down;

let canvas = document.getElementById('game'); //Declare canvas element
let ctx = canvas.getContext('2d'); 

let width = 380;
let height = 380;
canvas.width = width;
canvas.height = height;

//Event listeners
$(window).keydown(function(event) {
  keysDown[event.keyCode] = true;
});

$(window).keyup(function(event) {
  keysDown[event.keyCode] = false;
});

// Start the game
async function setup() {
  battleBgSprite.load();
  interfaceSprite.load();
  pokemonSprite.load();
  tilesetSprite.load();
  charSprite.load();
  pokeIconSprite.load();

  
  ctx.font = "bold 10pt sans-serif"; // for FPS text

  typesTable = await fetchTypesTable();
  gameState = gameStates.explo.default;
  // cursorPosition = cursorPositions.action.topLeft;
  
  requestAnimationFrame(drawGame);
}

const addPoke = async () => {
  const rawData = await fetch(`http://localhost:3000/addPokemon`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `name=pikachu`
    });
  const data = await rawData.json();
  console.log(data);
  // return data;
}
// Start
setup();



///////// RENDERING
async function drawGame() {
  if (ctx === null) { // Prevent errors
    requestAnimationFrame(drawGame);
    return;
  }

  // Test db
  if (keysDown[84]) {
    addPoke();
  }



  // if(!tilesetLoaded || !charSpritesLoaded ||!pokeIconLoaded) { // Wait for images loading
  //   requestAnimationFrame(drawGame);
  //   // console.log("not loaded");
  //   return;
  // }
  // console.log('foePoke', foePoke);
  // Alisasing
  ctx.imageSmoothingEnabled = false;
  // console.log(ctx.imageSmoothingEnabled);

  let currentFrameTime = Date.now(); // time at which the game is rendered

  switch (gameState) {
    case gameStates.explo.default:
      // console.log(ctx.imageSmoothingEnabled);
      let width = 380;
      let height = 380;
      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingEnabled = false;      
      // console.log(ctx.imageSmoothingEnabled);
      if (keysDown[AButton]) {
        keysDown[AButton] = false;
        gameState = gameStates.battle.log;
        logStage = 0;
        logState = logStates.battle.intro;
        let rdm = Math.floor(Math.random() * 151);
        myPoke = await Pokemon.createByName(rdm, 25);
        rdm = Math.floor(Math.random() * 151);
        foePoke = await Pokemon.createByName(10, 25);
        console.log('myPoke', myPoke);
        console.log('foePoke', foePoke);
      }
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

      // Render room
      for (let x = 0 ; x < mapW ; x++) {
        for (let y = 0 ; y < mapH ; y++) {
          let frame = tileTypes[gameMap[toIndex(x, y)]].sprite[0]
          ctx.drawImage(tilesetSprite.el,
            frame.x, frame.y, frame.w, frame.h,
            x*tileW, y*tileH, tileW, tileH
          );
        }
      }

      let charImage = player.sprites[player.direction];
      // console.log(isMoving);
      let timeElapsed = currentFrameTime - player.timeMoved ;
      let frame = getFrame(charImage.sprite, charImage.spriteDuration, timeElapsed, isMoving);
      // console.log(currentFrameTime);
     
      // Render character
      ctx.drawImage(charSprite.el,
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
      break;

      case gameStates.battle.actionList:
        canvas.width = 480;
        canvas.height = 320;
        ctx.imageSmoothingEnabled = false;  
        drawBattleScreen();
        if (keysDown[AButton]) {
          // buttonDown = 'A';
          switch (cursorPosition) {
            case cursorPositions.action.topLeft: // FIGHT
              gameState = gameStates.battle.attackList;
              cursorPosition = cursorPositions.attack.topLeft;
              break;
            case cursorPositions.action.topRight: // BAG
              break;
            case cursorPositions.action.botLeft: // SWITCH
              break;
            case cursorPositions.action.botRight: // RUN
              break;
            default:
              break;
          }
          keysDown[AButton] = false; 
        } else if (keysDown[BButton]) {
          // buttonDown = 'B';
        }
        updateCursor();
        drawBattleActionList();
        break;
  
      case gameStates.battle.attackList:
        canvas.width = 480;
        canvas.height = 320;
        ctx.imageSmoothingEnabled = false;  
        drawBattleScreen();
        drawBattleAttackList();
        updateCursor();
        if (keysDown[AButton]) {
          myAttack.move = getSelectedMove();
          myAttack.move.currentPP -= 1;
  
          foeAttack.move = getFoeMove();
          foeAttack.move.currentPP -= 1;
  
          let myDamage = calculateDamage(myAttack.move, myPoke, foePoke);
          myAttack.damage = myDamage.damage;
          myAttack.log = myDamage.log;
  
          let foeDamage = calculateDamage(foeAttack.move, foePoke, myPoke);
          foeAttack.damage = foeDamage.damage;
          foeAttack.log = foeDamage.log;
  
          // console.log('myAttack', myAttack);
          // console.log('foeAttack', foeAttack);
  
          if (myPoke.currentStats.speed > foePoke.currentStats.speed) {
            myPokeFirst = true;
          } else if (myPoke.currentStats.speed < foePoke.currentStats.speed) {
            myPokeFirst = false;
          } else {
            let rdm = Math.random()
            if (rdm < 0.5) {
              myPokeFirst = true;
            } else {
              myPokeFirst = false;
            }
          }
  
  
          
  
          keysDown[AButton] = false;
          gameState = gameStates.battle.log;
          logStage = 0;
          if (myPokeFirst) {
            logState = logStates.battle.myAttack;
          } else {
            logState = logStates.battle.foeAttack;
          }
         
        } else if (keysDown[BButton]) {
          // buttonDown = 'B';
          gameState = gameStates.battle.actionList;
          cursorPosition = cursorPositions.action.topLeft
        }
        
        
        break;
  
      case gameStates.battle.log:
        // width = 480;
        // height = 320;
        // canvas.width = width;
        // canvas.height = height;

        canvas.width = 480;
        canvas.height = 320;
        ctx.imageSmoothingEnabled = false;  
        
        switch (logState) {
          case logStates.battle.intro:
            if (keysDown[AButton]) {
              keysDown[AButton] = false;
              logStage++;
            }
            if (logStage >= 2) {
              gameState = gameStates.battle.actionList;
              cursorPosition = cursorPositions.action.topLeft;
            }
            log = getLogText();
            drawBattleScreen();
            drawBattleLog(log);
            break;
          case logStates.battle.myAttack:
            if (keysDown[AButton]) {
              logStage++;
              if (logStage === 1) {
                foePoke.currentHP -= myAttack.damage;
                if (foePoke.currentHP <= 0) {
                  foePoke.currentHP = 0;
                } 
              }
              keysDown[AButton] = false;
            }
  
            log = getLogText(myAttack.move, myAttack.log);
            
            if (log === '' && gameState === gameStates.battle.log) {
              logStage++;
            }
            if (logStage >= 2) {
              if (myPokeFirst) {
                logState = logStates.battle.foeAttack;
                logStage = 0;
              } else {
                gameState = gameStates.battle.actionList;
                cursorPosition = cursorPositions.action.topLeft;
              }
              if (foePoke.currentHP === 0) {
                gameState = gameStates.battle.log;
                logState = logStates.battle.ending;
                logStage = 0;
              }
            }
            drawBattleScreen();
            drawBattleLog(log);
            break;
          case logStates.battle.foeAttack:
            if (keysDown[AButton]) {
              logStage++;
              if (logStage === 1) {
                myPoke.currentHP -= foeAttack.damage;
                if (myPoke.currentHP <= 0) {
                  myPoke.currentHP = 0;
                }
              }
              keysDown[AButton] = false;
            }
            
            log = getLogText(foeAttack.move, foeAttack.log);
            
            if (log === '' && gameState === gameStates.battle.log) {
              logStage++;
            }
            if (logStage >= 2) {
              if (myPokeFirst) {
                gameState = gameStates.battle.actionList;
                cursorPosition = cursorPositions.action.topLeft;
              } else {
                logState = logStates.battle.myAttack;
                logStage = 0;
              }
              if (myPoke.currentHP === 0) {
                gameState = gameStates.battle.log;
                logState = logStates.battle.ending;
                logStage = 0;
              }
            }
            drawBattleScreen();
            drawBattleLog(log);
            break;
          case logStates.battle.ending:
            if (keysDown[AButton]) {
              keysDown[AButton] = false;
              logStage++;
            }
            
            log = getLogText();
            drawBattleScreen();
            drawBattleLog(log);
            if (logStage >= 2) {
              gameState = gameStates.explo.default
              // logStage = 0;
              // logState = logStates.battle.intro;
              // myPoke = await Pokemon.createByName(25, 25);
              // let rdm = Math.floor(Math.random() * 151);
              // foePoke = await Pokemon.createByName(rdm, 25);
              // cursorPosition = cursorPositions.action.topLeft;
            }
            break;
            
          default:
            break;
        }
    default:
      break;
  }



  requestAnimationFrame(drawGame);
}




function drawBattleScreen() {
  // Background
  ctx.drawImage(battleBgSprite.el,
    battleBgSprite.coords['grass'].x, battleBgSprite.coords['grass'].y,
    battleBgSprite.coords['grass'].w, battleBgSprite.coords['grass'].h,
    0, 0, 
    battleBgSprite.coords['grass'].w, battleBgSprite.coords['grass'].h);

  // Back Pokemon
  ctx.drawImage(pokemonSprite.el,
    myPoke.sprites.back.x, myPoke.sprites.back.y,
    myPoke.sprites.back.w, myPoke.sprites.back.h,
    canvas.width / 7, canvas.height - interfaceSprite.coords.logBox.h - myPoke.sprites.back.h,
    myPoke.sprites.back.w, myPoke.sprites.back.h)

  // Front Pokemon
  ctx.drawImage(pokemonSprite.el,
    foePoke.sprites.front.x, foePoke.sprites.front.y,
    foePoke.sprites.front.w, foePoke.sprites.front.h,
    canvas.width * 0.58, canvas.height * 0.49 - foePoke.sprites.front.h,
    foePoke.sprites.front.w, foePoke.sprites.front.h)

  // Pokemon infos
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.pokeHp.x, interfaceSprite.coords.pokeHp.y,
    interfaceSprite.coords.pokeHp.w, interfaceSprite.coords.pokeHp.h,
    252, 146,
    interfaceSprite.coords.pokeHp.w, interfaceSprite.coords.pokeHp.h)

  // Enemy infos
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.enemyHp.x, interfaceSprite.coords.enemyHp.y,
    interfaceSprite.coords.enemyHp.w, interfaceSprite.coords.enemyHp.h,
    25, 32,
    interfaceSprite.coords.enemyHp.w, interfaceSprite.coords.enemyHp.h)

  // Pokemon HP
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.noHP.x, interfaceSprite.coords.noHP.y,
    interfaceSprite.coords.noHP.w, interfaceSprite.coords.noHP.h,
    348, 180,
    96, interfaceSprite.coords.noHP.h)

  let ratio = myPoke.currentHP / myPoke.maxHP
  let widthHP = Math.round(ratio * 96);
  let colorHP = 'greenHP';

  if (ratio <= 0.5) {
    colorHP = 'orangeHP';
  }
  if (ratio <= 0.2) {
    colorHP = 'redHP';
  }

  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords[colorHP].x, interfaceSprite.coords[colorHP].y,
    interfaceSprite.coords[colorHP].w, interfaceSprite.coords[colorHP].h,
    348, 180,
    widthHP, interfaceSprite.coords[colorHP].h);

  // Enemy HP
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.noHP.x, interfaceSprite.coords.noHP.y,
    interfaceSprite.coords.noHP.w, interfaceSprite.coords.noHP.h,
    103, 66,
    96, interfaceSprite.coords.noHP.h)

  ratio = foePoke.currentHP / foePoke.maxHP
  widthHP = Math.round(ratio * 96);
  colorHP = 'greenHP';

  if (ratio <= 0.5) {
    colorHP = 'orangeHP';
  }
  if (ratio <= 0.2) {
    colorHP = 'redHP';
  }

  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords[colorHP].x, interfaceSprite.coords[colorHP].y,
    interfaceSprite.coords[colorHP].w, interfaceSprite.coords[colorHP].h,
    103, 66,
    widthHP, interfaceSprite.coords[colorHP].h)

  // Dialog Box
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.logBox.x, interfaceSprite.coords.logBox.y,
    interfaceSprite.coords.logBox.w, interfaceSprite.coords.logBox.h,
    0, battleBgSprite.coords['grass'].h,
    interfaceSprite.coords.logBox.w, interfaceSprite.coords.logBox.h)

  // Text
  ctx.font = '18px monospace';
  ctx.fillStyle = 'black';
  ctx.fillText(`${foePoke.data.name.toUpperCase()}`, 40, 56);
  ctx.fillText(`${myPoke.data.name.toUpperCase()}`, 290, 170);

  ctx.fillText(`${foePoke.level}`, 190, 56);
  ctx.fillText(`${myPoke.level}`, 435, 170)

  ctx.fillText(`${myPoke.currentHP} / ${myPoke.maxHP}`, 350, 204);
  ctx.fillText(`${foePoke.currentHP} / ${foePoke.maxHP}`, 100, 110);
}

function drawBattleActionList () {
  // Action Box
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.actionBox.x, interfaceSprite.coords.actionBox.y,
    interfaceSprite.coords.actionBox.w, interfaceSprite.coords.actionBox.h,
    interfaceSprite.coords.actionBox.w, battleBgSprite.coords['grass'].h,
    interfaceSprite.coords.actionBox.w, interfaceSprite.coords.actionBox.h);

  // Cursor
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.cursor.x, interfaceSprite.coords.cursor.y,
    interfaceSprite.coords.cursor.w, interfaceSprite.coords.cursor.h,
    cursorPosition.x, cursorPosition.y,
    interfaceSprite.coords.cursor.w, interfaceSprite.coords.cursor.h);

}

function drawBattleAttackList() {
  // Attack box
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.attackBox.x, interfaceSprite.coords.attackBox.y,
    interfaceSprite.coords.attackBox.w, interfaceSprite.coords.attackBox.h,
    0, battleBgSprite.coords['grass'].h,
    interfaceSprite.coords.logBox.w, interfaceSprite.coords.logBox.h);

  // Cursor
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.cursor.x, interfaceSprite.coords.cursor.y,
    interfaceSprite.coords.cursor.w, interfaceSprite.coords.cursor.h,
    cursorPosition.x, cursorPosition.y,
    interfaceSprite.coords.cursor.w, interfaceSprite.coords.cursor.h);

  ctx.font = '18px monospace';
  myPoke.moveSet.map((move, index) => {
    //Attack name
    ctx.fillText(`${move.name.toUpperCase()}`, 40 + (index % 2)*120, 265 + Math.floor(index/2)*30); 
    
  });

  let moveSelected = getSelectedMove();

  // console.log('moveselected', moveSelected);

  // PP
  ctx.fillText(`${moveSelected.currentPP}`, 400, 265);
  ctx.fillText(`${moveSelected.pp}`, 445, 265);

  // Type
  ctx.fillText(`${moveSelected.type.name.toUpperCase()}`, 385, 295);
}

function drawBattleLog(log) {
  // Dialog Box
  ctx.drawImage(interfaceSprite.el,
    interfaceSprite.coords.logBox.x, interfaceSprite.coords.logBox.y,
    interfaceSprite.coords.logBox.w, interfaceSprite.coords.logBox.h,
    0, battleBgSprite.coords['grass'].h,
    interfaceSprite.coords.logBox.w, interfaceSprite.coords.logBox.h)

  let logText = log

  // if (foePoke.currentHP === 0) {
  //   logText = 'YOU WON'
  // }
  ctx.font = '20px monospace';
  ctx.fillStyle = 'white';
  ctx.fillText(logText, 30, 265);
}

// UTILITY FUNCTIONS
function updateCursor() {
  switch (gameState) {
    case gameStates.battle.actionList:
      if ((keysDown[40] && cursorPosition === cursorPositions.action.topLeft) ||
      (keysDown[37] && cursorPosition === cursorPositions.action.botRight)) {
        cursorPosition = cursorPositions.action.botLeft;
      } else if ((keysDown[38] && cursorPosition === cursorPositions.action.botLeft) ||
      (keysDown[37] && cursorPosition === cursorPositions.action.topRight)) {
        cursorPosition = cursorPositions.action.topLeft;
      } else if ((keysDown[39] && cursorPosition === cursorPositions.action.topLeft) ||
      (keysDown[38] && cursorPosition === cursorPositions.action.botRight)) {
        cursorPosition = cursorPositions.action.topRight;
      } else if ((keysDown[40] && cursorPosition === cursorPositions.action.topRight) ||
      (keysDown[39] && cursorPosition === cursorPositions.action.botLeft)) {
        cursorPosition = cursorPositions.action.botRight;
      }
      break;
    case gameStates.battle.attackList:
      if ((keysDown[40] && cursorPosition === cursorPositions.attack.topLeft) ||
      (keysDown[37] && cursorPosition === cursorPositions.attack.botRight)) {
        cursorPosition = cursorPositions.attack.botLeft;
      } else if ((keysDown[38] && cursorPosition === cursorPositions.attack.botLeft) ||
      (keysDown[37] && cursorPosition === cursorPositions.attack.topRight)) {
        cursorPosition = cursorPositions.attack.topLeft;
      } else if ((keysDown[39] && cursorPosition === cursorPositions.attack.topLeft) ||
      (keysDown[38] && cursorPosition === cursorPositions.attack.botRight)) {
        cursorPosition = cursorPositions.attack.topRight;
      } else if ((keysDown[40] && cursorPosition === cursorPositions.attack.topRight) ||
      (keysDown[39] && cursorPosition === cursorPositions.attack.botLeft)) {
        cursorPosition = cursorPositions.attack.botRight;
      }
      break;
  
    default:
      break;
  }
}

function getSelectedMove() {
  let move;
  switch (cursorPosition) {
    case cursorPositions.attack.topLeft:
      move = myPoke.moveSet[0];
      break;
    case cursorPositions.attack.topRight:
      move = myPoke.moveSet[1];
      break;
    case cursorPositions.attack.botLeft:
      move = myPoke.moveSet[2];
      break;
    case cursorPositions.attack.botRight:
      move = myPoke.moveSet[3];
      break;
    default:
      break;
  }
  return move;
}

function getFoeMove() {
  let nbMoves = foePoke.moveSet.length
  let rdm = Math.floor(Math.random() * nbMoves);
  let move = foePoke.moveSet[rdm];
  return move;
}

function calculateDamage(move, attackPoke, defendPoke) {
  let damageClass = move.damage_class.name;
  let attackStat;
  let defenseStat;
  let isStatus = false ;
  switch (damageClass) {
    case 'physical':
      attackStat = attackPoke.stats.attack;
      defenseStat = defendPoke.stats.defense;
      break;
    case 'special':
      attackStat = attackPoke.stats['special-attack'];
      defenseStat = defendPoke.stats['special-defense'];
      break;
    case 'status':
      isStatus = true;
      attackStat = attackPoke.stats['special-attack'];
      defenseStat = defendPoke.stats['special-defense'];
      break;
    default:
      attackStat = attackPoke.stats.attack;
      defenseStat = defendPoke.stats.defense;
      break;
  }
  let baseDamage = ( ( 2 * attackPoke.level / 5 + 2 ) 
    * move.power * attackStat / defenseStat / 50 ) + 2;

  let rdm = Math.floor(Math.random() * 16 + 85) / 100;
  let isStab = attackPoke.data.types.find(type => type === move.type.name);
  let stab = isStab ? 1.5 : 1;

  let typeMod = getModType(move.type.name, defendPoke.data.types);

  let damage = isStatus ? 0 : Math.floor(baseDamage * rdm * stab * typeMod.mod);
  // console.log('damage', damage);
  // console.log('log', typeMod.description);
  return {damage, log: typeMod.description};
}

function getModType(attackType, defenderTypes) {
  let mod = 1;
  console.log('attackType', attackType);
  console.log('defenderTypes', defenderTypes);
  defenderTypes.map((defType) => {
    let double = typesTable[defType]['doubleFrom'].find((type) => type == attackType);
    if (double) {
      mod = mod * 2;
    }
    let half = typesTable[defType]['halfFrom'].find((type) => type == attackType);
    if (half) {
      mod = mod * 0.5;
    }
    let no = typesTable[defType]['noFrom'].find((type) => type == attackType);
    if (no) {
      mod = mod * 0;
    }
  })
  let description = '';
  if (mod === 0) {
    description = "It has no effect!"
  } else if (mod < 1) {
    description = "It's not very effective..."
  } else if (mod > 1) {
    description = "It's super effective!"
  }
  let response = {mod, description}
  return response;
}



function getLogText(move, typeLog) {
  let log = '';
  // console.log('logStage', logStage);
  // console.log('logState', logState);
  switch (logState) {
    case logStates.battle.intro:
      switch (logStage) {
        case 0:
          log = `${foePoke.data.name} wants to fight!`;
          break;
        case 1:
          log = `Go! ${myPoke.data.name}!`
          break;
        default:
          break;
      }
      break;
    case logStates.battle.myAttack:
      switch (logStage) {
        case 0:
          log = `${myPoke.data.name} used ${move.name}`;
          break;
        case 1:
          log = typeLog
          break;
        default:
          break;
      }
      break;
    case logStates.battle.foeAttack:
      switch (logStage) {
        case 0:
          log = `${foePoke.data.name} used ${move.name}`;
          break;
        case 1:
          log = typeLog
          break;
        default:
          break;
      }
      break;
    case logStates.battle.ending:
      let isFoeFainted = false;
      if (foePoke.currentHP === 0) {
        isFoeFainted = true;
      }
      switch (logStage) {
        case 0:
          if (isFoeFainted) {
            log = `Foe ${foePoke.data.name} fainted!`
          } else {
            log = `${myPoke.data.name} fainted!`
          }
          break;
        case 1:
          if (isFoeFainted) {
            log = `You WON!`
          } else {
            log = `You LOST!`
          }
          break;
        default:
          break;
      }
  
    default:
      break;
  }
  return log;
}


export {gameMap, ctx};