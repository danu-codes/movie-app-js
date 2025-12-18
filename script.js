//elements
const API_KEY = "eb7bb818";
const logo = document.getElementById("logo");
const userInput = document.getElementById("user-input");
const searchButton = document.querySelector(".search-icon")
const movieSearchContainer = document.querySelector(".searched-movie-container")

//go to homepage
logo.addEventListener("click", function()
{
    movieSearchContainer.innerHTML = "";
    document.getElementById("categories").style.display = "block";
});

//movie category array
const categories = {
    "Action": ["Avengers", "The Dark Knight", "John Wick", "Mad Max", "The Flash"],
    "Sci-Fi": ["Interstellar", "Inception", "The Matrix", "Avatar", "Dune"],
    "Horror": ["The Nun", "IT", "Conjuring", "Annabelle", "Insidious"],
    "Comedy": ["Central Intelligence", "Free Guy", "Jumanji", "Home Alone", "Ted"],
    "Animation": ["Frozen", "The Lion King", "Toy Story", "Coco", "Up"]
};

//get random movie function
function getRandomItems(arr, count) {
    return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

//load movie by categories 
async function loadCategories() {
    const categoryWrapper = document.getElementById("categories");
    categoryWrapper.innerHTML = "";

    for (let category in categories) {
        const section = document.createElement("div");
        section.classList.add("section-container");

        section.innerHTML = `
            <h2 class="category-title">${category}</h2>
            <div class="movie-container" id="${category}"></div>
        `;

        categoryWrapper.appendChild(section);

        const movies = getRandomItems(categories[category], 4);
        const container = section.querySelector(".movie-container");

        for (let title of movies) {
            try {
                const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
                const movie = await res.json();

                if (movie.Response === "True") {
                    const card = document.createElement("div");
                    card.classList.add("movie-card");

                    card.innerHTML = `
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.jpg"}">
                        <h4>${movie.Title}</h4>
                        <p>(${movie.Year})</p>
                    `;

                    container.appendChild(card);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
}

window.addEventListener("DOMContentLoaded", loadCategories);

//search movie function by name
searchButton.addEventListener("click", async function () {

    const query = userInput.value.trim();
    if (!query) return;

    document.getElementById("categories").style.display = "none";
    movieSearchContainer.innerHTML = "";

    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.Response === "False") {

            movieSearchContainer.innerHTML = `
            <h1>No movies found.</h1>`;
            return;
        }

        for (let item of data.Search) {
            try {
                const detailRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${item.imdbID}`);
                const movie = await detailRes.json();
                if (movie.Response === "True") {
                    const card = document.createElement("div")
                    card.classList.add("movie-card");
                    card.innerHTML = `
                        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'assets/no-image.jpg'}" alt="${movie.Title}">
                        <h4>${movie.Title}</h4>
                        <h5>(${movie.Year})</h5>
                        <p>Director :<br> ${movie.Director || 'N/A'}</p>
                        <p>Actors : <br>${movie.Actors || 'N/A'}</p>
                        <p>Genre : <br>${movie.Genre || 'N/A'}</p>
                        <p>Rated : <br>${movie.Rated || 'N/A'}</p>
                        <p>Released : <br>${movie.Released || 'N/A'}</p>
                        <p>Runtime : <br>${movie.Runtime || 'N/A'}</p>
                        <p>Writer : <br>${movie.Writer || 'N/A'}</p>
                        <p>Box Office : <br>${movie.BoxOffice || 'N/A'}</p>
                    `;
                    movieSearchContainer.appendChild(card);
                }
            } catch (err) {
                console.error("Error fetching movie details:", item.Title, err);
            }
        }

    } catch (err) {
        movieSearchContainer.innerHTML = `<h1>Error fetching movies.</h1>`;
        console.error(err);
    }
})
