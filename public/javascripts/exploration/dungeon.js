import {startRoom, treasureRoom, bossRoom, rooms} from './rooms.js';
import {toIndex} from './utils.js'

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
let startRoomIndex = 35;

dungeon[startRoomIndex] = {state: 'exist', distance: 0 };
let queue = [startRoomIndex];

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

dungeon[startRoomIndex] = {state: 'start', distance: 0 };

// Fill dungeon with rooms
let roomsCopy = [...rooms];
dungeon.forEach((room, index) => {
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


export default dungeon;



