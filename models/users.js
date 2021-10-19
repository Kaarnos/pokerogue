const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  pokemons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trakedPokemons'
  }],
  items: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref : 'items'
  }]
});

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;