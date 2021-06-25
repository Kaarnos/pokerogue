import {mapW} from '../globalConst.js';

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

// get map index from tile position
function toIndex(x, y) { 
  return ( x + (y * mapW));
}


export {getFrame, toIndex}