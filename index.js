let app_key = "54718bb4de8ee6755aaf7069e0369524";
let apiUrl = "https://api.edamam.com/api/recipes/v2?type=public&q=";
let searchInput = document.getElementById("search_input");
let searchButton = document.getElementById("search_btn");

let app_id = "82117429";
let recipes = "chicken";
let user_id = "SatwikaJahnavi";

let foodData = async () => {
    try {
        let foodApiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${recipes}&app_id=${app_id}&app_key=${app_key}`;
        let response = await fetch(foodApiUrl, {
            headers: {
                "Edamam-Account-User": user_id
            }
        });
        let data = await response.json();
        console.log(data);

        let cardContainer = document.getElementById("card_container");
        cardContainer.innerHTML = ""; 

        data.hits.forEach(hit => {
            let recipe = hit.recipe;

            
            let card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
                <div class="card">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.label}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.label}</h5>
                        <p class="card-text">Calories: ${Math.round(recipe.calories)}</p>
                        <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
                        <button class="btn btn-secondary view-ingredients-btn">View Ingredients</button>
                        <button class="addFavButton btn btn-primary">Add ❤️</button>
                    </div>
                </div>
            `;

            cardContainer.appendChild(card);

            let ingredientsButton = card.querySelector(".view-ingredients-btn");
            ingredientsButton.addEventListener("click", () => {
                alert(`Ingredients:\n${recipe.ingredientLines.join("\n")}`);
            });

            let addFavButton = card.querySelector(".addFavButton");
            addFavButton.addEventListener("click", () => {
                addToFavorites({
                    id: recipe.uri, 
                    title: recipe.label,
                    image: recipe.image,
                    calories: recipe.calories,
                    url: recipe.url
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
};

function addToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.some(fav => fav.id === recipe.id)) {
        alert(`${recipe.title} is already in your favorites!`);
        return;
    }

    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${recipe.title} has been added to your favorites!`);
}

function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cardContainer = document.getElementById("card_container");
    cardContainer.innerHTML = ""; 

    if (favorites.length === 0) {
        cardContainer.innerHTML = `<p class="text-center">No favorites added yet!</p>`;
        return;
    }

    favorites.forEach(recipe => {
        let card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text">Calories: ${Math.round(recipe.calories)}</p>
                    <a href="${recipe.url}" target="_blank" class="btn btn-primary">View Recipe</a>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}

let favoritesButton = document.getElementById("favoritesButton");
favoritesButton.addEventListener("click", displayFavorites);

searchButton.addEventListener("click", async (e) => {
    try {
        e.preventDefault();
        recipes = searchInput.value;
        await foodData();
    } catch (error) {
        alert("Please enter a valid recipe name.");
    }
});

foodData();