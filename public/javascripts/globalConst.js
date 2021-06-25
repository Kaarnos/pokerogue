
// Map layout
const tileW = 38; //px
const tileH = 38; //px
const mapW = 10; //tiles
const mapH = 10; //tiles

// Floor types
const floorTypes = {
  solid: 0,
  path: 1,
  exit: 2
};

const tileTypes = {
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
const directions = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
};

// Inputs
let AButton = 32; //space //keycode
let BButton = 70; //f //keycode
let keysDown = {
  37: false, //left
  38: false, //up
  39: false, //right
  40: false, //down
  [AButton]: false,
  [BButton]: false
}

// Cursor
let cursorPositions = {
  action: {
    topLeft : {x:258,y:249},
    topRight : {x:370,y:249},
    botLeft : {x:258,y:281},
    botRight : {x:370,y:281},
  },
  attack: {
    topLeft : {x:25,y:249},
    topRight : {x:145,y:249},
    botLeft : {x:25,y:281},
    botRight : {x:145,y:281},
  }
}


export {tileW, tileH, mapW, mapH, floorTypes, tileTypes, directions, keysDown, cursorPositions}