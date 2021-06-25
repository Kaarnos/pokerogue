

// Pokemon class
export default class Pokemon {
  constructor(pokeData, lvl) {
    this.sprites = this.getCoordsOfPokemonSprite(pokeData.id);
    this.data = {
      id: pokeData.id,
      name: pokeData.name,
      height: pokeData.height,
      weight: pokeData.weight,
      types: pokeData.types.map((obj) => obj.type.name),
      specie: pokeData.species.name,
      baseStats: Object.fromEntries(pokeData.stats.map((obj) => [obj.stat.name, obj.base_stat])),
      baseExp: pokeData['base_experience'],
      ability: pokeData.abilities.filter((obj) => obj['is_hidden'] === false),
      moves: this.getAllMoves(pokeData.moves)
    };
    this.level = lvl;
    this.exp = 0;
    this.stats = Object.fromEntries(Object.entries(this.data.baseStats).filter((el) => el[0] !== 'hp').map((stat) => [ stat[0] , Math.round(2 * stat[1] * lvl / 100 + 5) ]));
    this.currentStats = {...this.stats};
    this.maxHP = Math.round(2 * this.data.baseStats.hp * lvl / 100 + lvl + 10);
    this.currentHP = this.maxHP;
    this.ailments = [];
    this.moveSet = this.getNewMoveSet(this.data.moves, lvl);
  }

  // Method to get sprite coordonnates
  getCoordsOfPokemonSprite(id) {
    let coords = {
      front: {
        x: 16 + ((id - 1) % 3) * 656,
        y: 48 + Math.floor( (id - 1) / 3 ) * 144,
        w: 128,
        h: 128
      },
      back: {
        x: 304 + ((id - 1) % 3) * 656,
        y: 48 + Math.floor( (id - 1) / 3 ) * 144,
        w: 128,
        h: 128
      },
      icon: [{
        x: 592 + ((id - 1) % 3) * 656,
        y: 48 + Math.floor( (id - 1) / 3 ) * 144,
        w: 64,
        h: 64
      }, {
        x: 592 + ((id - 1) % 3) * 656,
        y: 112 + Math.floor( (id - 1) / 3 ) * 144,
        w: 64,
        h: 64
      }]
    }
    return coords;
  }

  // get a moveset with last moves learned at this level
  getNewMoveSet(moveList, pokemonLevel) {
    let moveSet = [];
    moveList = moveList.filter((move) => move.method === 'level-up' && move.level <= pokemonLevel);
    moveList.map((moveFromList) => {
      if (moveSet.length < 4) {
        moveSet.push(moveFromList);
        return;
      }
      let worstMove = moveSet[0];
      let worstIndex = 0;
      moveSet.map((moveFromSet, index) => {
        if (moveFromSet.level <= worstMove.level) {
          worstMove = moveFromSet;
          worstIndex = index;
        }
      })
      if (moveFromList.level >= worstMove.level) {
        moveSet[worstIndex] = moveFromList;
      }
      return;
    });
    moveSet = moveSet.map((move) => {
      return {name: move.name, url: move.url}
    });
    return moveSet;
  }

  // get all the moves that pokemon can learn by leveling-up or TM/HM
  getAllMoves(moveList) {
    let allMoves = [];
    moveList.map((move) => {
      move['version_group_details'].map((version) => {
        if (version['version_group'].name === 'firered-leafgreen' 
        && (version['move_learn_method'].name === 'level-up' || 
        version['move_learn_method'].name ==='machine') ) {
          allMoves.push({
            name: move.move.name,
            method: version['move_learn_method'].name,
            level: version['level_learned_at'],
            url: move.move.url
          });  
        }
      });
    });
    return allMoves
  }

  static create(id, lvl) {
    return new Promise((resolve, reject) => {
      let poke1;
      Pokemon.getPokemonData(id)
      .then((data) => {
        poke1 = new Pokemon(data, lvl);
        return poke1.moveSet;
      })
      .then(async (moveSet) => {
        let moveSetData = [];
        for (let i = 0 ; i < moveSet.length ; i++) {
          let moveData = await Pokemon.getMoveData(moveSet[i].url);
          moveData.currentPP = moveData.pp;
          moveSetData.push(moveData);
        }
        return moveSetData;
      }) 
      .then((moveSetData) => {
        poke1.moveSet = moveSetData;
        resolve(poke1);
      });
    })
  }

  // Only for using name friendly method, create() accept both name string or id number
  static async createById(id, lvl) {
    const pokemon = await Pokemon.create(id, lvl);
    return pokemon;
  }

  static async createByName(name, lvl) {
    const pokemon = await Pokemon.create(name, lvl);
    return pokemon;
  }

  // get all data from API
  static async getPokemonData(id) {
    const dataRaw = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let data = await dataRaw.json();
    return data;
  }
  
  // get all moves from API
  static async getMoveData(url) {
    const dataRaw = await fetch(url);
    let data = await dataRaw.json();
    return data;
  }

}