const pokemonList = document.querySelector('.pokemon-list');

// Função para criar um card de Pokémon
function createPokemonCard(pokemonData) {
    const pokemonCard = document.createElement('li');
    pokemonCard.className = `card ${pokemonData.types[0].type.name}`;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';

    const pokemonName = document.createElement('span');
    pokemonName.textContent = pokemonData.name;
    infoDiv.appendChild(pokemonName);

    const pokemonNumber = document.createElement('span');
    pokemonNumber.textContent = `#${pokemonData.id}`;
    infoDiv.appendChild(pokemonNumber);

    pokemonCard.appendChild(infoDiv);

    const buttonDiv = document.createElement('div');

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

    const typesList = document.createElement('ul');
    typesList.className = 'types';

    pokemonData.types.forEach(type => {
        const typeItem = document.createElement('li');
        typeItem.className = `type ${type.type.name}`;
        typeItem.textContent = type.type.name;
        typesList.appendChild(typeItem);
    });

    pokemonCard.appendChild(typesList);

    const description = document.createElement('p');
    description.className = 'Details';
    description.textContent = 'Há uma semente de planta em suas costas desde o dia em que este Pokémon nasceu. A semente cresce lentamente.';
    pokemonCard.appendChild(description);

    return pokemonCard;
}

// Função para buscar a lista de Pokémon e criar os cards
function fetchPokemonList() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1008')
        .then(response => response.json())
        .then(data => {
            const pokemonResults = data.results;
            pokemonResults.forEach((pokemon, index) => {
                fetchPokemonData(pokemon.url, index + 1);
            });
        })
        .catch(error => {
            console.error('Erro ao obter lista de Pokémon:', error);
        });
}

// Função para buscar os dados de um Pokémon específico
function fetchPokemonData(url, pokemonId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pokemonCard = createPokemonCard(data);
            pokemonList.appendChild(pokemonCard);

            // Obtendo as URLs das imagens "default" e "shiny"
            const defaultImageUrl = data.sprites.front_default;
            const shinyImageUrl = data.sprites.front_shiny;

            // Atualizando as imagens dos Pokémon no card
            const spriteImage = document.querySelector(`.sprite.g${pokemonId}`);
            spriteImage.src = defaultImageUrl;

            const shinyButton = document.querySelector(`#shiny-button${pokemonId}`);
            const selectBox = document.querySelector('.select');
            selectBox.addEventListener('change', function () {
                const selectedOption = selectBox.options[selectBox.selectedIndex];
                const selectedValue = selectedOption.value;
                const imgShiny = document.querySelector(`.shiny-img.a${pokemonId}`);

                if (selectedValue === 'shiny') {
                    spriteImage.src = shinyImageUrl;
                    imgShiny.classList.add("shiny");
                    imgShiny.classList.add("shiny-click");
                    imgShiny.setAttribute("src", "./src/imagens/shiny.png");
                } else {
                    spriteImage.src = defaultImageUrl;
                    imgShiny.classList.remove("shiny");
                    imgShiny.classList.remove("shiny-click");
                    imgShiny.setAttribute("src", "./src/imagens/notshiny.png");
                }
            });
            shinyButton.addEventListener('click', function () {
                const isShiny = spriteImage.src === shinyImageUrl;
                const imgShiny = document.querySelector(`.shiny-img.a${pokemonId}`);


                if (isShiny) {
                    spriteImage.src = defaultImageUrl;
                    imgShiny.classList.remove("shiny");
                    imgShiny.classList.remove("shiny-click");
                    imgShiny.setAttribute("src", "./src/imagens/notshiny.png");

                } else {
                    spriteImage.src = shinyImageUrl;
                    imgShiny.classList.add("shiny");
                    imgShiny.classList.add("shiny-click");
                    imgShiny.setAttribute("src", "./src/imagens/shiny.png");
                }
            });
        })
        .catch(error => {
            console.error(`Erro ao obter dados do Pokémon ${pokemonId}:`, error);
        });
}
// Chamando a função para buscar a lista de Pokémon e criar os cards
fetchPokemonList();