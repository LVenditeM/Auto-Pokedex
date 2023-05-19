const pokemonList = document.querySelector('.pokemon-list');
const previousPageButton = document.getElementById('previous-page');
const nextPageButton = document.getElementById('next-page');
const currentPageElement = document.getElementById('current-page');
const pagination = document.querySelector('.pagination');

let currentPage = 1; // Página atual
let ShinySelect = 1; // Página atual
previousPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        currentPageElement.textContent = ` ${currentPage} `;
        fetchPokemonList(currentPage).then(data => {
            // Chamar a função toggleshiny com os dados atualizados
            toggleshinySelect(data);
        });
    }
});

nextPageButton.addEventListener('click', () => {
    currentPage++;
    currentPageElement.textContent = ` ${currentPage} `;
    fetchPokemonList(currentPage).then(data => {
        // Chamar a função toggleshiny com os dados atualizados
        toggleshinySelect(data);
    });
});


// Função para criar um card de Pokémon
function createPokemonCard(pokemonData) {
    const pokemonCard = document.createElement('li');
    pokemonCard.className = `card`;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';

    const pokemonName = document.createElement('span');
    pokemonName.textContent = pokemonData && pokemonData.name ? pokemonData.name : 'Unknown';
    infoDiv.appendChild(pokemonName);

    const pokemonNumber = document.createElement('span');
    pokemonNumber.textContent = pokemonData && pokemonData.id ? `#${pokemonData.id}` : '';
    infoDiv.appendChild(pokemonNumber);

    pokemonCard.appendChild(infoDiv);

    const buttonDiv = document.createElement('div');

    if (ShinySelect === 1) {
        const shinyButton = document.createElement('button');
        shinyButton.id = `shiny-button${pokemonData.id}`;
        shinyButton.className = 'shiny-button';

        const shinyImg = document.createElement('img');
        shinyImg.src = './src/imagens/notshiny.png';
        shinyImg.className = `shiny-img a${pokemonData.id}`;

        shinyButton.appendChild(shinyImg);
        buttonDiv.appendChild(shinyButton);
        pokemonCard.appendChild(buttonDiv);

        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemonData.sprites.front_default;
        pokemonImage.alt = pokemonData.name;
        pokemonImage.className = `sprite g${pokemonData.id}`;
        pokemonCard.appendChild(pokemonImage);

    } else {
        const shinyButton = document.createElement('button');
        shinyButton.id = `shiny-button${pokemonData.id}`;
        shinyButton.className = 'shiny-button';

        const shinyImg = document.createElement('img');
        shinyImg.src = './src/imagens/shiny.png';
        shinyImg.className = `shiny-img shiny-click shiny a${pokemonData.id}`;

        shinyButton.appendChild(shinyImg);
        buttonDiv.appendChild(shinyButton);
        pokemonCard.appendChild(buttonDiv);

        const pokemonImage = document.createElement('img');

        pokemonImage.src = pokemonData.sprites.front_shiny;
        pokemonImage.alt = pokemonData.name;
        pokemonImage.className = `sprite g${pokemonData.id}`;
        pokemonCard.appendChild(pokemonImage);
    }

    const typesList = document.createElement('ul');
    typesList.className = 'types';

    pokemonData.types.forEach(type => {
        const typeItem = document.createElement('li');
        typeItem.className = `type ${type.type.name}`;
        typeItem.textContent = type.type.name;
        typesList.appendChild(typeItem);
    });

    pokemonCard.appendChild(typesList);

    const statsList = document.createElement('ul');
    statsList.className = 'Stats';
    pokemonData.stats.forEach(stat => {
        const statItem = document.createElement('li');

        const statName = document.createElement('span');
        statName.className = 'stat-name';
        statName.textContent = ` (${stat.stat.name} / ${stat.base_stat})`;
        statItem.appendChild(statName);

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const progress = document.createElement('div');
        progress.className = 'progress';
        progress.style.width = `${stat.base_stat}%`;

        const progressValue = document.createElement('span');
        progressValue.className = 'progress-value';
        progressValue.textContent = stat.base_stat;

        const totalValue = document.createElement('span');
        totalValue.className = 'total-value';
        totalValue.textContent = ` / ${stat.stat.total}`;

        progressBar.appendChild(progress);
        progressBar.appendChild(progressValue);
        progressBar.appendChild(totalValue);
        statItem.appendChild(progressBar);

        statsList.appendChild(statItem);
    });

    pokemonCard.appendChild(statsList);

    return pokemonCard;
}

// Função para buscar a lista de Pokémon e criar os cards
function fetchPokemonList(page) {
    const limit = 10;
    const offset = (page - 1) * limit;

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}&shiny=true`)
        .then(response => response.json())
        .then(data => {
            const pokemonResults = data.results;
            const pokemonPromises = pokemonResults.map(pokemon => {
                const pokemonId = getPokemonIdFromUrl(pokemon.url);
                const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
                return fetchPokemonData(pokemonUrl, pokemonId);
            });

            Promise.all(pokemonPromises)
                .then(pokemonDataArray => {
                    pokemonList.innerHTML = '';
                    pokemonDataArray.forEach(({ data, pokemonId }) => {
                        const isShiny = true; // Defina a flag de isShiny como true para criar um Pokémon shiny
                        const pokemonCard = createPokemonCard(data, pokemonId, isShiny);
                        pokemonList.appendChild(pokemonCard);
                    });
                })

        })

}

// Função para obter o ID do Pokémon a partir da URL
function getPokemonIdFromUrl(url) {
    // Verifica se a URL contém "shiny" para determinar o formato da URL
    if (url.includes('shiny')) {
        // A URL tem o formato 'https://pokeapi.co/api/v2/pokemon/{id}/shiny/'
        const urlParts = url.split('/');
        const pokemonId = parseInt(urlParts[urlParts.length - 3]);
        return pokemonId;
    } else {
        // A URL tem o formato 'https://pokeapi.co/api/v2/pokemon/{id}/'
        const urlParts = url.split('/');
        const pokemonId = parseInt(urlParts[urlParts.length - 2]);
        return pokemonId;
    }
}

function toggleshinySelect(data, pokemonId) {
    const defaultImageUrl = data.sprites.front_default;
    const shinyImageUrl = data.sprites.front_shiny;

    // Atualizando as imagens dos Pokémon no card

    const spriteImage = document.querySelector(`.sprite.g${pokemonId}`);
    const imgShiny = document.querySelector(`.shiny-img.a${pokemonId}`);

    const selectBox = document.querySelector('.select');
    const selectedOption = selectBox.options[selectBox.selectedIndex];
    const selectedValue = selectedOption.value;

    if (selectedValue === 'shiny') {
        ShinySelect = 0;
        spriteImage.src = shinyImageUrl;
        imgShiny.classList.add("shiny");
        imgShiny.classList.add("shiny-click");
        imgShiny.setAttribute("src", "./src/imagens/shiny.png");
    } else {
        ShinySelect = 1;
        spriteImage.src = defaultImageUrl;
        imgShiny.classList.remove("shiny");
        imgShiny.classList.remove("shiny-click");
        imgShiny.setAttribute("src", "./src/imagens/notshiny.png");
    }
}
function toggleshinyButton(data, pokemonId) {
    const defaultImageUrl = data.sprites.front_default;
    const shinyImageUrl = data.sprites.front_shiny;

    // Atualizando as imagens dos Pokémon no card
    const spriteImage = document.querySelector(`.sprite.g${pokemonId}`);
    const isShiny = spriteImage.src === shinyImageUrl;
    const imgShiny = document.querySelector(`.shiny-img.a${pokemonId}`);

    if (isShiny) {
        spriteImage.src = defaultImageUrl;
        imgShiny.classList.remove('shiny');
        imgShiny.classList.remove('shiny-click');
        imgShiny.src = './src/imagens/notshiny.png';
    } else {
        spriteImage.src = shinyImageUrl;
        imgShiny.classList.add('shiny');
        imgShiny.classList.add('shiny-click');
        imgShiny.src = './src/imagens/shiny.png';
    }
}

function fetchPokemonData(url, pokemonId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {


            const pokemonCard = createPokemonCard(data);
            pokemonList.appendChild(pokemonCard);

            const shinyButton = document.querySelector(`#shiny-button${pokemonId}`);
            const selectBox = document.querySelector('.select');

            selectBox.addEventListener('change', function () {
                toggleshinySelect(data, pokemonId);
            });

            shinyButton.addEventListener('click', function () {
                toggleshinyButton(data, pokemonId);
            });

        })

}
// Obtém os elementos HTML da barra de pesquisa
const searchBar = document.querySelector('.search-bar');
const searchInput = searchBar.querySelector('input');

// Função para pesquisar e filtrar os Pokémon com base no termo digitado
function searchPokemonByName(pokemonName) {
    const encodedName = encodeURIComponent(pokemonName); // Codifica o nome do Pokémon

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=1008`)
        .then(response => response.json())
        .then(data => {
            const pokemonResults = data.results;
            const matchedPokemon = pokemonResults.filter(pokemon => pokemon.name.includes(encodedName));
            pokemonList.innerHTML = ''; // Limpa a lista antes de adicionar os cards pesquisados

            if (matchedPokemon.length > 0) {
                matchedPokemon.forEach((pokemon, index) => {
                    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}/`;
                    fetchPokemonData(pokemonUrl, index + 1); // Passa o pokemonId como segundo argumento
                });
            } 
        })

}

// Adiciona um ouvinte de evento de digitação ao campo de entrada
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm !== '') {
        pagination.classList.add("hidden");
        searchPokemonByName(searchTerm);
    } else {
        pagination.classList.remove("hidden");
        fetchPokemonList(currentPage);
    }
});



// Chamando a função para buscar a lista de Pokémon e criar os cards
fetchPokemonList();