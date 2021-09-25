var express = require('express');
var router = express.Router();

const Pokemon = require('../scripts/Pokemon')
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

router.post('/pickOneRandomPokemon', async (req, res, next) => {
  console.log('req.body', req.body);

  const level = parseInt(req.body.level, 10);
  console.log('level', level);

  let rdm = Math.floor(Math.random() * 151);


  let myPokemon = await Pokemon.createByName(rdm, level);

  res.json({
    response: 'called /pickOneRandomPokemon',
    data: myPokemon
  })
})




module.exports = router;
