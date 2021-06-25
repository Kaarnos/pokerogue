import Sprite from '../Sprite.js';

const tilesetSpriteURL = './images/floor-tiles.png';
const tilesetSpriteCoords = {};

const charSpriteURL = './images/red-sprite.png';
const charSpriteCoords = {};

const pokeIconSpriteURL = './images/icon_gif/Ani001MS.gif';
const pokeIconSpriteCoords = {};

const tilesetSprite = new Sprite(tilesetSpriteURL, tilesetSpriteCoords);
const charSprite = new Sprite(charSpriteURL, charSpriteCoords);
const pokeIconSprite = new Sprite(pokeIconSpriteURL, pokeIconSpriteCoords);

export {tilesetSprite, charSprite, pokeIconSprite};