const mongoose = require('mongoose');

const pokemonSchema = mongoose.Schema({
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
    'special-attack': Number,
    'special-defense': Number
  }
});

const PokemonModel = mongoose.model('pokemons', pokemonSchema);

module.exports = PokemonModel;


