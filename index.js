document.addEventListener("DOMContentLoaded", () => {
  const filmsList = document.getElementById("films");
  const movieTitle = document.getElementById("movie-title");
  const moviePoster = document.getElementById("movie-poster");
  const movieDescription = document.getElementById("description");
  const movieRuntime = document.getElementById("runtime");
  const movieShowtime = document.getElementById("showtime");
  const availableTickets = document.getElementById("available-tickets");
  const buyButton = document.getElementById("buy-ticket");

  let currentMovie = null;

  // Fetch and display all movies
  fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(films => {
      films.forEach(film => {
        const li = document.createElement("li");
        li.textContent = film.title;
        li.className = "film";
        li.addEventListener("click", () => {
          displayMovieDetails(film);
        });
        filmsList.appendChild(li);
      });

      // Display the first movie by default
      if (films.length > 0) {
        displayMovieDetails(films[0]);
      }
    });

  // Display movie details
  function displayMovieDetails(film) {
    currentMovie = film;

    movieTitle.textContent = film.title;
    moviePoster.src = film.poster;
    movieDescription.textContent = film.description;
    movieRuntime.textContent = `${film.runtime} mins`;
    movieShowtime.textContent = film.showtime;

    const ticketsAvailable = film.capacity - film.tickets_sold;
    availableTickets.textContent = ticketsAvailable;

    buyButton.disabled = ticketsAvailable === 0;
    buyButton.textContent = ticketsAvailable > 0 ? "Buy Ticket" : "Sold Out";

    // Highlight the selected film in the menu
    document.querySelectorAll("li.film").forEach(li => li.classList.remove("selected"));
    document.querySelectorAll("li.film").forEach(li => {
      if (li.textContent === film.title) {
        li.classList.add("selected");
      }
    });
  }

  // Handle ticket purchase
  buyButton.addEventListener("click", () => {
    const ticketsAvailable = parseInt(availableTickets.textContent, 10);

    if (ticketsAvailable > 0) {
      availableTickets.textContent = ticketsAvailable - 1;
      currentMovie.tickets_sold += 1;

      if (ticketsAvailable - 1 === 0) {
        buyButton.textContent = "Sold Out";
        buyButton.disabled = true;
      }
    }
  });
});

  