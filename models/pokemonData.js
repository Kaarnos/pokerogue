const mongoose = require('mongoose');

const pokemonDataSchema = mongoose.Schema({
  id : Number,
  name : String,
  height: Number,
  weight: Number,
  types: [String],
  specie: String,
  baseStats: {
    attack : Number,
    defense : Number,
    hp : Number,
    specialAttack: Number,
    specialDefense: Number,
    speed : Number
  },
  baseXp: Number,
  abilities: [{type: mongoose.Schema.Types.ObjectId, ref : 'abilities'}],
  moves: [{type: mongoose.Schema.Types.ObjectId, ref : 'moves'}]
});

const PokemonDataModel = mongoose.model('pokemonData', pokemonDataSchema);

module.exports = PokemonDataModel;


