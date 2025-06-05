Assignment - Pokemon Application G/VG

Your task is to create an interface where you can retrieve information about different Pokemon.

API Endpoint: https://pokeapi.co/api/v2/pokemon?limit=151

Part 1 - Pokedex
Create a dropdown list with all the Pokemon. The user should be able to select a Pokemon to fetch its data. Create a class for each Pokemon that includes the following properties: name, image, types (from the "types" field in the API), weight, height, all 6 of its stats (HP, Attack, Special Attack, Defense, Special Defense, Speed), and a method to compare two Pokemon. Display the selected Pokemon with all its associated properties.

Part 2 - Compare Pokemon
Allow the user to select another Pokemon and display all its properties. Enable the user to compare two Pokemon with each other, highlighting with color which Pokemon has the highest value in each comparison (weight, height, and all stats). Display in the DOM which Pokemon wins in the most categories.

Part 3 - Pokemon Battle (VG)
Allow the two selected Pokemon to battle each other and see who wins. Both Pokemon take turns attacking each other until one of their HP reaches 0. The Pokemon with the highest speed goes first. The name of a Pokemon's attack is the first in its "moves" list. The damage calculation formula is: (Attacking Pokemon's Attack + Special Attack) - (Defending Pokemon's Defense + Special Defense * 0.8) = Damage. Subtract the defending Pokemon's HP by the damage dealt, ensuring each attack does at least 10 damage (if calculated damage is less than 10, change it to 10).

Display in the DOM how the battle unfolds. For example: "Mewtwo used Mega Punch and did 45 damage. Bulbasaur's remaining HP: 10. Bulbasaur used Razor Wind and did 10 damage. Mewtwo's remaining HP: 180. Mewtwo used Mega Punch and did 45 damage. Bulbasaur's remaining HP: 0. Mewtwo wins!"
