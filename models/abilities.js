const mongoose = require('mongoose');

const abilitySchema = mongoose.Schema({
  abilityId: Number,
  name: String
});

const AbilityModel = mongoose.model('abilities', abilitySchema);
module.exports = AbilityModel;