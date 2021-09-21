const mongoose = require('mongoose');

const pokemonSchema = mongoose.Schema({
  name : String
});

const PokemonModel = mongoose.model('pokemons', pokemonSchema);

module.exports = PokemonModel;


