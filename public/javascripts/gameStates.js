// Game states
let gameStates = {
  battle: {
    intro: 0,
    actionList: 1,
    attackList: 2,
    log: 3,
    ending: 4
  }
}

let logStates = {
  battle : {
    intro: 0,
    myAttack: 1,
    foeAttack: 2,
    ending: 3
  }
}


export {gameStates, logStates}