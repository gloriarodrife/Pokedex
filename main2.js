const formElement = document.querySelector('.js_form');
const pokemonList = document.querySelector('.js_pokemons');
const pokemonDetail = document.querySelector('.js_pokemon_detail');

const API_URL = 'https://polymer-pokedex.firebaseio.com';

async function getList() {
  const response = await fetch(`${API_URL}/pokemons.json`);
  const data = await response.json();

  // Corregimos todas las imagenes de la lista
  // Porque las imágenes empiezan en 1
  data.forEach((item, index) => {
    const itemId = index + 1;
    item.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${itemId}.png`;
  });

  return data;
}

async function getItem(itemId) {
  const response = await fetch(`${API_URL}/pokemon/${itemId}.json`);
  const data = await response.json();

  // Corregimos la imagen
  // Porque las imágenes empiezan en 1
  itemId++;
  data.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${itemId}.png`;

  return data;
}

async function getListBySearch(search) {
  const list = await getList();

  const filteredItems = list.filter((item) => {
    const nameLowercase = item.name.toLowerCase();
    const searchLowercase = search.toLowerCase();

    return nameLowercase.includes(searchLowercase);
  });

  return filteredItems;
}

function renderItemDetail(itemDetail) {
  const img = document.createElement('img');
  img.src = itemDetail.image;
  pokemonDetail.appendChild(img);

  const nameElement = document.createElement('span');
  nameElement.innerText = itemDetail.name;
  pokemonDetail.appendChild(nameElement);

  const descriptionElement = document.createElement('p');
  descriptionElement.innerText = itemDetail.description;
  pokemonDetail.appendChild(descriptionElement);

  // Añadimos el botón de cierre
  const closeButton = document.createElement('button');
  closeButton.classList.add('close');
  closeButton.innerText = 'x';
  pokemonDetail.appendChild(closeButton);
  closeButton.addEventListener('click', () => {
    // Borramos el detalle del item
    pokemonDetail.innerHTML = '';

    // Ocultamos el detalle
    pokemonDetail.classList.add('hidden');

    // Mostramos la lista
    pokemonList.classList.remove('hidden');
  });
}

function showItemDetail(itemId) {
  // Esta es la función de callback que ejecutará el listener
  return async () => {
    // Ocultamos la lista
    pokemonList.classList.add('hidden');

    // Mostramos el detalle
    pokemonDetail.classList.remove('hidden');

    // Conseguir el detalle del item
    const itemDetail = await getItem(itemId);

    // Renderizamos el detalle item
    renderItemDetail(itemDetail);
  };
}

function renderItem(item) {
  const li = document.createElement('li');
  li.classList.add('pokemon');

  const img = document.createElement('img');
  img.src = item.image;
  li.appendChild(img);

  const nameElement = document.createElement('span');
  nameElement.innerText = item.name;
  li.appendChild(nameElement);

  pokemonList.appendChild(li);

  // ID - 1 porque la API empieza en 0
  const itemId = item.id - 1;
  // Cuando click en el elemento, mostramos el detalle
  li.addEventListener('click', showItemDetail(itemId));
}

function renderList(list) {
  // Renderizamos cada elemento de la lista
  list.forEach(renderItem);
}

async function renderFilteredList(event) {
  event.preventDefault();

  // Cogemos los datos del formulario
  const formData = Object.fromEntries(new FormData(event.target));

  // Cogemos el valor del input search
  const search = formData.search;

  // Pedir la lista filtrada
  const filteredItems = await getListBySearch(search);

  // Borramos la lista actual
  pokemonList.innerHTML = '';

  // Renderizamos la lista filtrada
  renderList(filteredItems);
}

async function startApplication() {
  // Pedir la lista
  const list = await getList();

  // Renderizamos toda la lista
  renderList(list);

  // Configuramos la búsqueda
  formElement.addEventListener('submit', renderFilteredList);
  formElement.addEventListener('reset', () => {
    pokemonList.innerHTML = '';

    // Renderizamos toda la lista
    renderList(list);

    pokemonDetail.classList.add('hidden');
    pokemonList.classList.remove('hidden');
  });
}

startApplication();
