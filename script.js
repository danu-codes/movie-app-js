const logo = document.getElementById("logo");

logo.addEventListener("click", function()
{
   location.reload(); 
});



const popularMovies = ["Inception", "The Dark Knight", "Avengers", "Interstellar", "Joker", "Titanic", "Spider-Man", "Frozen", "The Lion King", "The Nun", "The Flash", "The Mummy", "Top Gun: Maverick", "Bullet Train"];

function getRandomMovies(array, num) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num)
}

async function displayRandomMovies() {
    const randomMovies = getRandomMovies(popularMovies, 5);
    const movieContainer = document.querySelector(".movie-container");

    movieContainer.innerHTML = "";

    for (let title of randomMovies) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=eb7bb818&t=${encodeURIComponent(title)}`);
        const movie = await res.json();

        if (movie.Response === "True") {
            const card = document.createElement("div");
            card.classList.add("movie-card");

            card.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.jpg"}" alt="${movie.Title}">
        <h4>${movie.Title}</h4>
        <p>(${movie.Year})</p>
        `;
            movieContainer.append(card);
        }

    }
}

window.addEventListener("DOMContentLoaded", displayRandomMovies);


const API_KEY = "eb7bb818";
const userInput = document.getElementById("user-input");
const searchButton = document.querySelector(".search-icon")
const movieSearchContainer = document.querySelector(".searched-movie-container")
const movieContainer = document.querySelector(".movie-container");

searchButton.addEventListener("click", async function () {

    const query = userInput.value.trim();
    if (!query) return;

    movieContainer.style.display = "none";
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