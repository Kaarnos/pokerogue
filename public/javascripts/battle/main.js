
// Intialisation and Declaration of global variables
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let width = 480;
let height = 320;
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
  Sprite.load(battleBgSprite);
  Sprite.load(interfaceSprite);
  Sprite.load(pokemonSprite);
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
setup();

// DRAW
function drawGame() {
 
  // Alisasing
  ctx.imageSmoothingEnabled = false;

  ///// Inputs variables
  // let buttonDown = '';
  let log;


  // Render
  drawBattleScreen();

  switch (gameState) {
    case gameStates.battle.actionList:
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
      updateCursor();
      drawBattleAttackList();
      break;

    case gameStates.battle.log:
      switch (logState) {
        case logStates.battle.intro:
          if (keysDown[AButton]) {
            keysDown[AButton] = false;
            logStage++;
          }
          if (logStage >= 2) {
            gameState = gameStates.battle.actionList;
          }
          log = getLogText();
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
          drawBattleLog(log);
          break;
        case logStates.battle.ending:
          if (keysDown[AButton]) {
            keysDown[AButton] = false;
            logStage++;
          }
          if (logStage >= 2) {
            gameState = gameStates.battle.actionList;
            cursorPosition = cursorPositions.action.topLeft;
          }
          log = getLogText();
          drawBattleLog(log);
          break;
          
        default:
          break;
      }
      

    default:
      break;
  }
  // console.log('logStage', logStage);
  // if (foePoke.currentHP === 0) {
  //   drawBattleLog();
  // }

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
  let rdm = Math.floor(Math.random() * 4);
  console.log('random', rdm);
  let move = foePoke.moveSet[rdm];
  console.log('move', move);
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