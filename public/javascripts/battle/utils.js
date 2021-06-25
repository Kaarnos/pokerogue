

async function fetchTypesTable() {
  let typesTable = {}
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
  return typesTable;
}

export {fetchTypesTable}