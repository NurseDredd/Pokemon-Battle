
let statsDisplay = document.querySelector("#stats");
let firstDropdown = document.querySelector('#firstDropdown');
let secondDropdown = document.querySelector('#secondDropdown');
let pokemonCard = document.querySelector("#card");
let pokemonCard2 = document.querySelector("#card2");
let chosenPokemons = [];
let compareBtn = document.querySelector('#compare');
let battleBtn = document.querySelector('#battle');
let messages = document.querySelector(".messages");
let buttonContainer = document.querySelector(".buttonContainer");
let slideButtons = document.querySelectorAll(".slide-button");

let attackBtnOne;
let attackBtnTwo;
let playAgainBtn;

let colors = {
    normal: "#A8A878",
    fighting: "#C03028",
    flying: "#A890F0",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    bug: "#A8B820",
    ghost: "#705898",
    steel: "#B8B8D0",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC"
};


class Pokemon {
    constructor(name, imgUrl, type, weight, height, baseStats, move) {
        this.name = capitalizeFirstLetter(name);
        this.imgUrl = imgUrl;
        this.type = type;
        this.weight = weight;
        this.height = height;
        this.stats = {
            hp: baseStats[0],
            attack: baseStats[1],
            defense: baseStats[2],
            specialAttack: baseStats[3],
            specialDefense: baseStats[4],
            speed: baseStats[5]
        };
        this.move = capitalizeFirstLetter(move);
    }
    comparePokemon(otherPokemon) {
        messages.innerHTML = "";
        let pokemon1 = this;
        let pokemon2 = otherPokemon;
        let pokemon1Wins = 0;
        let pokemon2Wins = 0;
        let resultString = "";
    
        // Jämför vikt
        if (pokemon1.weight > pokemon2.weight) {
            pokemon1Wins++;
        } else if (pokemon1.weight < pokemon2.weight) {
            pokemon2Wins++;
        }
    
        // Jämför längd
        if (pokemon1.height > pokemon2.height) {
            pokemon1Wins++;
        } else if (pokemon1.height < pokemon2.height) {
            pokemon2Wins++;
        }
    
          // Jämför varje stat
        Object.entries(pokemon1.stats).forEach(([stat, value]) => {
        if (value > pokemon2.stats[stat]) {
            pokemon1Wins++;
        } else if (value < pokemon2.stats[stat]) {
            pokemon2Wins++;
        }
        });
        // Lägg grön border-animation på det vinnande kortet
        if(pokemon1Wins > pokemon2Wins){
            resultString = `${pokemon1.name} is superior in ${pokemon1Wins} of 8 categories.`;
           pokemonCard.classList.remove("slide-in-left")
            pokemonCard.classList.add('pokemon-card-animation');
            setTimeout(() => {
                pokemonCard.classList.remove('pokemon-card-animation');
            }, 3000);
            messages.append(resultString);
            
        }else {
            resultString = `${pokemon2.name} is superior in ${pokemon2Wins} of 8 categories.`;
            pokemonCard2.classList.remove("slide-in-right");
            pokemonCard2.classList.add('pokemon-card-animation');
            setTimeout(() => {
                pokemonCard2.classList.remove('pokemon-card-animation');
            }, 3000);
            messages.append(resultString);
            
        }
        // Returnera resultatmeddelande
        return resultString;
        };
    };
    // Om spelaren valt två Pokemonkort, jämför dessa med compare-metoden.
    compareBtn.addEventListener("click", () => {
    if (chosenPokemons.length === 2) {
        let pokemon1 = chosenPokemons[0];
        let pokemon2 = chosenPokemons[1];

        let result = pokemon1.comparePokemon(pokemon2);
        console.log(result); 
    } else {
        console.log("Välj två Pokemon för att jämföra.");
    }
});


// Funktion för att hämta data från Pokemon API:et
async function getPokemonData() {
    try {
      let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      let data = await response.json();
      return data.results; // returnera en array med Pokemon-objekt
      console.log(data);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      return []; // returnera en tom array om något går fel
    }
  }
  
  // Funktion för att fylla dropdown-menyn med Pokemon-alternativ
  async function fillPokemonDropdown() {
    let dropdowns = document.querySelectorAll('.pokemonDropdown');
    let pokemonData = await getPokemonData();
  
    // Loopa igenom alla Pokemon och skapa ett alternativ för varje
    pokemonData.forEach(pokemon => {
      dropdowns.forEach(dropdown => {
          let option = document.createElement('option');
          option.value = pokemon.name; // använd Pokemon-namnet som value
          option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // gör första bokstaven stor
          dropdown.appendChild(option);
      });
    });
}

// För varje dropDown med class pokemonDropDown kör dropDownEvent.
document.querySelectorAll('.pokemonDropdown').forEach((dropdown, index) => {
    dropDownEvent(dropdown, index);
});
  
  // Kör funktionen för att fylla dropdown-menyn när sidan laddas
  fillPokemonDropdown();

  // Hämta pokemondata och skapa upp ny Pokemon
  function dropDownEvent(dropdown, index){
    dropdown.addEventListener("change", async (event) => {
        messages.innerHTML = "";
        let selectedPokemon = event.target.value;
        if(selectedPokemon){
            let response = await fetch (`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
            let pokemonDetails = await response.json();
            let move = pokemonDetails.moves[0].move.name;
            let baseStats = pokemonDetails.stats.map(stat => stat.base_stat);
            
            let chosenPokemon = new Pokemon (
                pokemonDetails.name,
                pokemonDetails.sprites.other['official-artwork'].front_shiny,
                pokemonDetails.types.map(typeObj => typeObj.type.name),
                pokemonDetails.weight,
                pokemonDetails.height,
                baseStats,
                move, 
            );

            // Kontrollera om det redan finns en Pokemon på det angivna indexet
            if (chosenPokemons[index]) {
                // Uppdatera index med ny information
                chosenPokemons[index] = chosenPokemon;
            } else {
                // Lägg till ny Pokemon i array
                chosenPokemons.push(chosenPokemon);
            }
        
            if (dropdown === firstDropdown) {
                displayPokemonDetails(chosenPokemon, pokemonCard);
            } else if (dropdown === secondDropdown) {
                displayPokemonDetails(chosenPokemon, pokemonCard2);
            }
            console.log(chosenPokemons);
            console.log('Selected Pokemon:', pokemonDetails);
    
        }
    });
}
 // Skapa upp Pokemonkort och visa ut i DOM
 function displayPokemonDetails(pokemon, div) {
    let info = document.createElement('div');
    let text = document.createElement('div');
    let statsDisplay = document.createElement('div');

    info.id = "info";
    text.id = "text";
    statsDisplay.id = "stats";

    div.innerHTML = ''; 
    div.style.border = "2px solid black"; div.style.borderRadius = "6px";
    text.style.width = "100%";
    text.style.display = "flex";
    text.style.justifyContent = "space-between";

       // Hämta färgkoden för Pokomons type (index 0)
       let typeColor = colors[pokemon.type[0]];
   
       // Applicera bakgrundsfärgen på kortet
       div.style.background = typeColor;

     //Visa ut i DOM
    info.innerHTML = `
    <img src="${pokemon.imgUrl}" alt="${pokemon.name}" style="height: 300px; width: 300px; background-color:white; border:2px solid black;" />
     <h3 style=" font-size:2rem; text-align:center;">${pokemon.name}</h3>
     `;

    text.innerHTML = `
    <p>Type: ${pokemon.type.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}</p>
    <p>Weight: ${pokemon.weight}</p>
    <p>Height: ${pokemon.height}</p>
    `;

    statsDisplay.innerHTML = `
    <p class="HP-display">HP: ${pokemon.stats.hp}</p>
    <p>Attack: ${pokemon.stats.attack}</p>
    <p>Defense: ${pokemon.stats.defense}</p>
    <p>Special Attack: ${pokemon.stats.specialAttack}</p>
    <p>Special Defense: ${pokemon.stats.specialDefense}</p>
    <p>Speed: ${pokemon.stats.speed}</p>
    `;

    div.appendChild(info);
    div.appendChild(text);
    div.appendChild(statsDisplay);

     // Lägg till animationsklass beroende på vilket kort det är
     if (div.id === "card") {
        div.classList.add('slide-in-left');
    } else if (div.id === "card2") {
        div.classList.add('slide-in-right');
    }

 };

    // Inaktivera den andra dropdown-menyn initialt
    secondDropdown.disabled = true;

    // Lägg till en lyssnare för första dropdown-menyn
    firstDropdown.addEventListener("change", () => {
    // Aktivera den andra dropdown-menyn när en pokémon väljs från den första
    secondDropdown.disabled = false;
    if (firstDropdown.value) {
        // Ta bort "hidden" klassen från slide-in knapparna
        slideButtons.forEach(button => {
            button.classList.remove("hidden");
        });
        // Anropa funktionen för att lägga till slide-in-top klassen på knapparna
        slideInTop();
    }
    });

    battleBtn.addEventListener("click", () => {
    if (chosenPokemons.length === 2) {

        // Inaktivera selectsen när battle är igång
        firstDropdown.disabled = true;
        secondDropdown.disabled = true; 

        let pokemon1 = chosenPokemons[0];
        let pokemon2 = chosenPokemons[1];

        // Skapa attackknappar och appenda till kort
        attackBtnOne = document.createElement('button');
        attackBtnTwo = document.createElement('button');
        attackBtnOne.classList.add("attackBtn");
        attackBtnTwo.classList.add("attackBtn");
        attackBtnOne.innerText = "ATTACK";
        attackBtnTwo.innerText = "ATTACK";
        pokemonCard.append(attackBtnOne);
        pokemonCard2.append(attackBtnTwo);

        // Kontrollera vem som har högst speed och därmed börjar
        if (pokemon1.stats.speed > pokemon2.stats.speed) {
            disableAttackBtn(attackBtnTwo);
            messages.innerHTML = `${pokemon1.name} is faster than ${pokemon2.name}. ${pokemon1.name} begins!`;
            console.log("poke1 is faster");
        } else {
            disableAttackBtn(attackBtnOne);
            console.log("poke2 is faster");
            messages.innerHTML = `${pokemon2.name} is faster than ${pokemon1.name}. ${pokemon2.name} begins!`;
        }

        // Inaktivera "Battle" -knappen efter att den har använts
        battleBtn.disabled = true;
    } else {
        // Om användaren inte har valt två pokémon, visa ett meddelande
        messages.innerHTML = "Choose your Pokemons";
    }
});

function disableAttackBtn(attackBtn) {
    attackBtn.style.backgroundColor = "grey";
    attackBtn.disabled = true;
};
    


document.addEventListener("click", (event) => {
    // Kontrollera om det klickade elementet är en attackBtn
    if (event.target.classList.contains("attackBtn")) {
        // Hämta referensen till den aktuella attackBtn
        let attackBtn = event.target;
        // Hämta indexet för den aktuella Pokemonen baserat på dess föräldrekort
        let pokemonIndex = attackBtn.parentElement.id === "card" ? 0 : 1;
        // Utför attacken med den aktuella Pokemonen
        pokemonAttack(chosenPokemons[pokemonIndex], chosenPokemons[1 - pokemonIndex]);

        let otherAttackBtn = pokemonIndex === 0 ? attackBtnTwo : attackBtnOne;
        otherAttackBtn.disabled = false;
        otherAttackBtn.style.backgroundColor = "black";
        console.log(otherAttackBtn);
    }
});
 
    let attackerTurn = true;

    function pokemonAttack(pokemonAttacker, pokemonDefender) {
        
        messages.innerHTML = "";
        let attack = pokemonAttacker.move;
        // Beräkna skadan baserat på attackerarens attack och försvararens försvar
        //Math.max returnerar det största värdet av två uttryck. Om skadan är mindre än 10 så returneras 10.
        let damage = Math.max((pokemonAttacker.stats.attack + pokemonAttacker.stats.specialAttack) - (pokemonDefender.stats.defense + pokemonDefender.stats.specialDefense) * 0.8, 10);
        // Minska försvararens HP med skadan
        pokemonDefender.stats.hp -= damage;

        //Avrundar nedåt till heltal.
        damage = Math.floor(damage);
        //Avrundar hp till heltal
        pokemonDefender.stats.hp = Math.floor(pokemonDefender.stats.hp);
        
        if(pokemonDefender.stats.hp <= 0){
            pokemonDefender.stats.hp = 0;
        }
        // Toggla knappfunktionalitet beroende på vems tur det är
         
        if (attackerTurn) {
            disableAttackBtn(attackBtnOne);
            disableAttackBtn(attackBtnTwo, false);
            } else {
                disableAttackBtn(attackBtnTwo);
                disableAttackBtn(attackBtnOne, false);
            }

            attackerTurn = !attackerTurn; // Byt tur

        updateHP(pokemonDefender, document.querySelector(`#${pokemonDefender === chosenPokemons[0] ? 'card' : 'card2'} .HP-display`));
        
        
        // Skapa ett meddelande som beskriver attacken och skadan
        let message = `${pokemonAttacker.name} used ${attack} and did ${damage} damage. ${pokemonDefender.name} remaining HP: ${pokemonDefender.stats.hp}.`;
        
         // Kontrollera om försvararens HP är noll eller mindre
        if (pokemonDefender.stats.hp <= 0) {
        // Om försvararens HP är noll eller mindre, avsluta fighten och visa ett meddelande
        let message = `${pokemonAttacker.name} used ${attack} and did ${damage} damage. Remaining HP:0. ${pokemonDefender.name} fainted! ${pokemonAttacker.name} wins the battle!`;
        messages.append(message);
        
        //Skapa knapp för att spela igen
        playAgainBtn = document.createElement("button");
        playAgainBtn.classList.add("play-again-btn");
        playAgainBtn.innerHTML = "PLAY AGAIN";
        buttonContainer.append(playAgainBtn);

            //Ladda om sidan för nytt spel
        playAgainBtn.addEventListener('click', () => {
            window.location.reload();
            });
            
            // Lägg på ett filter över förlorarkortet
            if (pokemonDefender === chosenPokemons[0]) {
                pokemonCard.classList.add('lost');
            } else {
                pokemonCard2.classList.add('lost');
            }
            // Ta bort attack-knappar
            attackBtnOne.style.display = "none";
            attackBtnTwo.style.display = "none";
            
            return;
        }
        // Visa meddelandet i DOM
        messages.append(message); 
};


//Funktion för att göra stor första bokstav.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};


    // Hämta HP-elementet för de aktuell Pokemon och uppdatera innehåll
    function updateHP(pokemon, hpDisplay) {
        hpDisplay.textContent = `HP: ${pokemon.stats.hp}`;

           // Lägg till klassen "blink" för att starta damage-blink
           hpDisplay.classList.add("blink");

           // Efter två sek, ta bort klassen "blink" för att stoppa blinkningen
           setTimeout(() => {
               hpDisplay.classList.remove("blink");
           }, 2000);
    };

    function slideInTop() {
        slideButtons.forEach(button => {
            button.classList.add("slide-in-top");
        });
    }


