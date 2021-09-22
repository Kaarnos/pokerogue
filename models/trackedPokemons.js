const mongoose = require('mongoose');

const trackedPokemonsSchema = mongoose.Schema({
  ailments: [String],
  currentHP: Number,
  currentStats: {
    attack: Number,
    defense: Number,
    specialAttack: Number,
    specialDefense: Number,
    speed: Number
  },
  xp: Number,
  level: Number,
  maxHP: Number,
  moveSet: [{
    move: {
      type: mongoose.Schema.Types.ObjectId, 
      ref : 'moves'
    },
    currentPP: Number
  }],
  stats: {
    attack: Number,
    defense: Number,
    specialAttack: Number,
    specialDefense: Number,
    speed: Number
  },
  holdItem: {
    type: mongoose.Schema.Types.ObjectId, 
    ref : 'items'
  }
});

const trackedPokemonsModel = mongoose.model('trackedPokemons', trackedPokemonsSchema);
module.exports = trackedPokemonsModel;