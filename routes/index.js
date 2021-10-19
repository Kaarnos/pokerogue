var express = require('express');
var router = express.Router();
const axios = require('axios');

const Pokemon = require('../scripts/Pokemon')
const PokemonDataModel = require('../models/pokemonData');
const AbilityModel = require('../models/abilities')

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

  let rdm = Math.floor(Math.random() * 151);
  // rdm = 30;
  console.log('rdmId', rdm);

  let pokemonData = await PokemonDataModel.findOne({
    pokemonId: rdm
  }).exec();

  console.log('pokemonData', pokemonData);

  if (pokemonData === null) {
    console.log('random pokemon not found in db');

    pokemonData = await Pokemon.createByName(rdm, level);

    const refAbilities = [];
    pokemonData.data.abilities.forEach(async abilityObj => {
      console.log('in forEach loop');
      let request = await axios.get(abilityObj.ability.url);
      console.log('request.data', request.data);
      let abilityId = request.data.id;
      let abilityInDb = await AbilityModel.findOne({
        abilityId: abilityId
      })
      console.log('abilityInDb', abilityInDb);
      if (abilityInDb === null) { // if not found in db
        const newAbility = new AbilityModel({
          abilityId: request.data.id,
          name: request.data.name
        })
        const newAbilityInDb = await newAbility.save();
        refAbilities.push(newAbilityInDb._id);
      } else {
        refAbilities.push(abilityInDb._id);
      }
    })

    console.log('refAbilities', refAbilities);
    
    const newPokemon = new PokemonDataModel({
      pokemonId: pokemonData.data.id,
      name: pokemonData.data.name,
      height: pokemonData.data.height,
      weight: pokemonData.data.weight,
      types: pokemonData.data.types,
      specie: pokemonData.data.specie,
      baseStats: {
        attack: pokemonData.data.baseStats.attack,
        defense: pokemonData.data.baseStats.defense,
        hp: pokemonData.data.baseStats.hp,
        specialAttack: pokemonData.data.baseStats['special-attack'],
        specialDefense: pokemonData.data.baseStats['special-defense'],
        speed: pokemonData.data.baseStats.speed
      },
      baseXp: pokemonData.data.baseExp,
      // abilities: pokemonData.data.ability,
      // moves: pokemonData.data.moves

    });
    await newPokemon.save();
    
  }

  // let myPokemon = await Pokemon.createByName(rdm, level);

  res.json({
    response: 'called /pickOneRandomPokemon',
    // data: myPokemon
  })
})




module.exports = router;
