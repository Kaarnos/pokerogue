const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  name: String,
  id: Number
});

const ItemModel = mongoose.model('users', itemSchema);
module.exports = ItemModel;