// Dungeon initialization
let dungeon = [];
for (let i = 0 ; i < 80 ; i++) {
  dungeon.push({state: 'empty', distance: null });
}

// Other initialization
let forbiddenRooms = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 20, 30, 40, 50, 60, 70,
  19, 29, 39, 49, 59, 69, 79,
  71, 72, 73, 74, 75, 76, 77, 78
];

let nbRooms = 7; // Max 25
let startRoom = 35;

dungeon[startRoom] = {state: 'exist', distance: 0 };
let queue = [startRoom];

// Dungeon generating algorithm
while (queue.length < nbRooms) {  
  let queueCopy = queue;
  queueCopy.map((room, index) => {

    let newRoom = room + getNextRoom();
    if (dungeon[newRoom].state === 'exist') {
      return;
    }
    if (forbiddenRooms.includes(newRoom)) {
      return;
    }
    if (getNbOfNeighbours(newRoom) >= 2) {
      return;
    }
    if (queue.length === nbRooms) {
      return;
    }
    dungeon[newRoom].state = 'exist';
    dungeon[newRoom].distance = dungeon[room].distance + 1;
    queue.push(newRoom);
    return;
  })
}


// Find dead-ends and Boss room
let furthestRoom = {room: 0, distance: 0};
queue.map((room, index) => {
  if(getNbOfNeighbours(room) === 1) {
    dungeon[room].state = 'deadend';
    if (dungeon[room].distance > furthestRoom.distance) {
      furthestRoom.room = room;
      furthestRoom.distance = dungeon[room].distance;
    }
  }
})
dungeon[furthestRoom.room].state = 'boss';


let deadends = queue.filter(room => dungeon[room].state === 'deadend');
// console.log('deadends', deadends);
let rdmIndex = Math.floor(Math.random() * deadends.length);
dungeon[deadends[rdmIndex]].state = 'treasure';

dungeon[startRoom] = {state: 'start', distance: 0 };

// Draw map
// let mapEl = document.getElementById('map');

// for (let i = 0; i < dungeon.length ; i++) {
//   let room = document.createElement('div');
//   if (dungeon[i].state === 'exist') {
//     room.className = 'room exist'
//   } else if (dungeon[i].state === 'deadend') {
//     room.className = 'room deadend'
//   } else if (dungeon[i].state === 'boss') {
//     room.className = 'room boss'
//   } else {
//     room.className = 'room empty'
//   }
//   room.textContent = dungeon[i].distance
//   mapEl.appendChild(room);
  
// }


// UTILITY FUNCTIONS
function getNextRoom() {
  let randomNumber = Math.floor(Math.random() * 4);
  switch (randomNumber) {
    case 0:
      return -10; // Go up
    case 1: 
      return 1; // Go right
    case 2: 
      return +10; // Go down
    case 3:
      return -1; // Go left
    default: 
      return 0;
  }
};

function getNbOfNeighbours(room) {
  let nbOfNeighbours = 0;
  if (dungeon[room + 1].state === 'exist') {
    nbOfNeighbours++
  }
  if (dungeon[room - 1].state === 'exist') {
    nbOfNeighbours++
  }
  if (dungeon[room + 10].state === 'exist') {
    nbOfNeighbours++
  }
  if (dungeon[room - 10].state === 'exist') {
    nbOfNeighbours++
  }
  return nbOfNeighbours;
}

// console.log(dungeon);

export default dungeon;



