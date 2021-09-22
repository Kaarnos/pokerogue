var express = require('express');
var router = express.Router();

const PokemonDataModel = require('../models/pokemonData');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pokemon Rogue' });
});

router.post('/addPokemon', async (req, res, next) => {
  console.log('req.body', req.body);

  const newPokemon = new PokemonDataModel({
    name: req.body.name
  })

  await newPokemon.save();

  res.json({
    response: 'called /addPokemon',
    pokemon : newPokemon
  });
});

// router.post('/pickTwoRandomPokemon', async (req, res, next) => {
//   console.log('req.body', req.body);

//   const level = req.body.level;


// })




module.exports = router;
