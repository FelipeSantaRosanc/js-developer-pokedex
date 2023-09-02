const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const frame = document.getElementById("frame");
const pagination = document.querySelector(".pagination");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
    getPokemonData();
  });
}

function getPokemonData() {
    const allPokemons = document.querySelectorAll(".pokemon");
    allPokemons.forEach((pokemon) => {
      pokemon.addEventListener("click", () => {
        const frame = document.getElementById("frame");
        frame.innerHTML = "";
        const id = pokemon.querySelector(".number").textContent.replace("#", "");
        const number = Number.parseInt(id) - 1;
  
        pokeApi.getPokemons(number, 1).then((poke = []) => {
          const pokemonCard = poke.map(convertPokemonToDetailed);
          frame.innerHTML += pokemonCard;
          frame.classList.remove("hidden");
      });
    });
  });
}

const backButton = document.getElementById("backButton");

backButton.addEventListener('click', ()=> {
    pokemonList.classList.remove('hidden')
    pagination.classList.remove('hidden')
    backButton.classList.add('hidden')
    frame.classList.add('hidden')

})

function convertPokemonToDetailed(pokemon) {
  return `
    <div class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            <ul class="characteristics">
                <li>Height: ${pokemon.height} m</li>
                <li>Weight: ${pokemon.weight} kg</li>
            </ul>
            <div class="statsWindow">
                <h3>Base Stats</h3>
                <table class="stats">
                    <tr>
                        <td>HP</td>
                        <td>${pokemon.base_stats.hp}</td>
                    </tr>
                    <tr>
                        <td>Attack</td>
                        <td>${pokemon.base_stats.attack}</td>
                    </tr>
                    <tr>
                        <td>Defense</td>
                        <td>${pokemon.base_stats.defense}</td>
                    </tr>
                    <tr>
                        <td>Sp. Atk.</td>
                        <td>${pokemon.base_stats.specialAttack}</td>
                    </tr>
                    <tr>
                        <td>Sp. Def.</td>
                        <td>${pokemon.base_stats.specialDefense}</td>
                    </tr>
                    <tr>
                        <td>Speed</td>
                        <td>${pokemon.base_stats.speed}</td>
                    </tr>
                </table>
            </div>
        </div>
    `;
}

function loadPokeDetails(pokemonId) {
  if (pokemonId > 0) {
    pokeApi.getPokemons(pokemonId - 1, 1).then((pokemon) => {
      const newHtml = pokemon.map(convertPokemonToDetailed);
      currentPokemonInfo.innerHTML = newHtml;
    });
  }
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordNextPage = offset + limit;

  if (qtdRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
