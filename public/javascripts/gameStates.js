// Game states
let gameStates = {
  battle: {
    intro: 'battle_intro',
    actionList: 'battle_actionList',
    attackList: 'battle_attackList',
    log: 'battle_log',
    ending: 'battle_ending'
  },
  explo: {
    default: 'explo_default',
    menu: 'explo_menu'
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