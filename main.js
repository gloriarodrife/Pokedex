const searchInput = document.querySelector('.js_input');
const searchButton = document.querySelector('.js_button');
const pokemonList = document.querySelector('.js_pokemons');
const pokemonDetail = document.querySelector('.js_pokemon_detail');

// Creamos funcion asincrona, devolviendo el json con todos los datos
async function getPokemons() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
  const data = await response.json();
  return data;
}
async function getPokemon(pokemon) {
  const response = await fetch(pokemon.url);
  const data = await response.json();
  return data;
}
function getPokemonImage(index) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`;
}

function renderPokemon(pokemon, index) {
  const li = document.createElement('li');
  li.classList.add('pokemon');
  const img = document.createElement('img');
  const span = document.createElement('span');
  // Conseguir el pokemon index
  const pokemonIndex = index + 1;
  img.src = getPokemonImage(pokemonIndex);
  span.innerText = pokemon.name;
  // Metes la etiqueta de img dentro de el li
  li.appendChild(img);
  li.appendChild(span);
  pokemonList.appendChild(li);

  // Escuchamos el elemento
  li.addEventListener('click', async () => {
    pokemonList.classList.add('hidden');
    pokemonDetail.classList.remove('hidden');
    const detail = await getPokemon(pokemon);
    const span = document.createElement('span');
    const img = document.createElement('img');
    const description = document.createElement('p');
    const closeButton = document.createElement('button');
    closeButton.innerText = `X`;
    span.innerText = detail.name;
    img.src = detail.sprites.front_default;
    description.innerHTML = `Heigth: ${detail.height} / Weight: ${detail.weight}`;
    pokemonDetail.appendChild(img);
    pokemonDetail.appendChild(span);
    pokemonDetail.appendChild(description);
    pokemonDetail.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
      pokemonList.classList.remove('hidden');
      pokemonDetail.classList.add('hidden');
      pokemonDetail.innerHTML = '';
    });
  });
}

async function renderPokemons() {
  // await = esperar respuesta de la promesa
  const pokemonsResponse = await getPokemons();
  const pokemons = pokemonsResponse.results;
  pokemons.forEach(renderPokemon);
}

await renderPokemons();

// buttonElement.addEventListener('click', () => {});
