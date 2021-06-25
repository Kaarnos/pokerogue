console.log('hello JS');

let typesTable = {};
let loaded = false;

async function fetchTypesTable(typeId) {
  for (let typeId = 1 ; typeId < 19 ; typeId++) {
    let dataRaw = await fetch(`https://pokeapi.co/api/v2/type/${typeId}/`);
    let data = await dataRaw.json();
    typesTable[data.name] = {};
    typesTable[data.name]['doubleFrom'] = [];
    typesTable[data.name]['halfFrom'] = [];
    typesTable[data.name]['noFrom'] = [];
    data['damage_relations']['double_damage_from'].map((type) => {
      typesTable[data.name]['doubleFrom'].push(type.name);
    });
    data['damage_relations']['half_damage_from'].map((type) => {
      typesTable[data.name]['halfFrom'].push(type.name);
    })
    data['damage_relations']['no_damage_from'].map((type) => {
      typesTable[data.name]['noFrom'].push(type.name);
    })
  }
}

fetchTypesTable().then(() => {
  console.log(typesTable);
  console.log(getModType('fighting', ['ghost']));
});


function getModType(attackType, defenderTypes) {
  let mod = 1;
  defenderTypes.map((defType) => {
    let double = typesTable[defType]['doubleFrom'].find((type) => type == attackType);
    if (double) {
      mod = mod * 2;
    }
    let half = typesTable[defType]['halfFrom'].find((type) => type == attackType);
    if (half) {
      mod = mod * 0.5;
    }
    let no = typesTable[defType]['noFrom'].find((type) => type == attackType);
    if (no) {
      mod = mod * 0;
    }
  })
  let description = '';
  if (mod === 0) {
    description = "It doesn't affect "
  } else if (mod < 1) {
    description = "It's not very effective..."
  } else if (mod > 1) {
    description = "It's super effective!"
  }
  let response = {mod, description}
  return response;
}



