const mongoose = require('mongoose');

const moveSchema = mongoose.Schema({
  accuracy: Number,
  damageClass: String,
  flavorText: String,
  id: Number,
  name: String,
  power : Number,
  pp: Number,
  priority: Number,
  target: String,
  type: {
    type: String,
    enum: ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug',
      'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice',
      'dragon', 'dark', 'fairy', 'unknown', 'shadow']
  }
});

const MoveModel = mongoose.model('moves', moveSchema);

module.exports = MoveModel;