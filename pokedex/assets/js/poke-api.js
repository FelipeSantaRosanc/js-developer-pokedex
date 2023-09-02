const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  pokemon.weight = pokeDetail.weight/10
  pokemon.height = pokeDetail.height/10

  pokemon.base_stats.hp = pokeDetail.stats[0].base_stat;
  pokemon.base_stats.attack = pokeDetail.stats[1].base_stat;
  pokemon.base_stats.defense = pokeDetail.stats[2].base_stat;
  pokemon.base_stats.specialAttack = pokeDetail.stats[3].base_stat;
  pokemon.base_stats.specialDefense = pokeDetail.stats[4].base_stat;
  pokemon.base_stats.speed = pokeDetail.stats[5].base_stat;

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json()) //transformando a lista de pokemons em json.
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url) //requisição da lista de pokemons
    .then((response) => response.json()) //retornando um httresponse e transformando em json
    .then((jsonBody) => jsonBody.results) //listagem dos pokemons
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //converteu a lista de pokemons em uma novarequisição de detalhes dos pokemons
    .then((detailRequests) => Promise.all(detailRequests)) //após pegar essa lista de detalhes, transformou essa lista em json com o "getPokemonDetail"
    .then((pokemonsDetails) => pokemonsDetails); //lista de detalhes de pokemon(modelo de api)
};
