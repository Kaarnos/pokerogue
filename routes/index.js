var express = require('express');
var router = express.Router();

const PokemonModel = require('../models/pokemons');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pokemon Rogue' });
});

router.post('/addPokemon', async (req, res, next) => {
  console.log('req.body', req.body);

  const newPokemon = new PokemonModel({
    name: req.body.name
  })

  await newPokemon.save();

  res.json({
    response: 'called /addPokemon',
    pokemon : newPokemon
  });
})


module.exports = router;
