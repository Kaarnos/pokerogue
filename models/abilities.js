const mongoose = require('mongoose');

const abilitySchema = mongoose.Schema({
  id: Number,
  name: String
});

const AbilityModel = mongoose.model('abilities', abilitySchema);
module.exports = AbilityModel;