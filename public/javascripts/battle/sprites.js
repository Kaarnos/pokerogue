import Sprite from '../Sprite.js';

// Sprites
const battleBgSpriteURL = '../images/battle-bg.png';
const battleBgSpriteCoords = {
  grass: {x:4, y:44, w:480, h:224},
  swamp: {x:490, y:44, w:480, h:224}
};
const interfaceSpriteURL = '../images/interface.png'
const interfaceSpriteCoords = {
  enemyHp: {x:6, y:6, w:200, h:58},
  pokeHp: {x:6, y:88, w:208, h:74},
  actionBox: {x:292, y:8, w:240, h:96},
  attackBox: {x:594, y:8, w:480, h:96},
  logBox: {x:594, y:112, w:480, h:96},
  greenHP: {x:234, y:18, w:1, h:6},
  orangeHP: {x:234, y:26, w:1, h:6},
  redHP: {x:234, y:34, w:1, h:6},
  noHP: {x:234, y:42, w:1, h:6},
  cursor: {x:538, y:8, w:12, h:20}
};
const pokemonSpriteURL = '../images/pokemon.png';
const pokemonSpriteCoords = {};

// Creation of sprites
const interfaceSprite = new Sprite(interfaceSpriteURL, interfaceSpriteCoords);
const battleBgSprite = new Sprite(battleBgSpriteURL, battleBgSpriteCoords);
const pokemonSprite = new Sprite(pokemonSpriteURL, pokemonSpriteCoords);

export {interfaceSprite, battleBgSprite, pokemonSprite};