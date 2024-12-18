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
    .then((response) => response.json())
    .then((films) => {
      films.forEach((film) => {
        createFilmListItem(film);
      });

      // Display the first movie by default
      if (films.length > 0) {
        displayMovieDetails(films[0]);
      }
    });

  // Create a film list item
  function createFilmListItem(film) {
    const li = document.createElement("li");
    li.textContent = film.title;
    li.className = "film";

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the list item click event
      deleteFilm(film, li);
    });

    li.appendChild(deleteButton);

    li.addEventListener("click", () => {
      displayMovieDetails(film);
    });

    filmsList.appendChild(li);
  }

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
    document.querySelectorAll("li.film").forEach((li) => li.classList.remove("selected"));
    document.querySelectorAll("li.film").forEach((li) => {
      if (li.textContent.includes(film.title)) {
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

      // Update the backend
      fetch(`http://localhost:3000/films${currentMovie.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets_sold: currentMovie.tickets_sold }),
      });
    }
  });

  // Handle film deletion
  function deleteFilm(film, li) {
    fetch(`http://localhost:3000/films${film.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the list item from the DOM
          li.remove();

          // Clear movie details if the deleted movie is currently displayed
          if (currentMovie && currentMovie.id === film.id) {
            movieTitle.textContent = "";
            moviePoster.src = "";
            movieDescription.textContent = "";
            movieRuntime.textContent = "";
            movieShowtime.textContent = "";
            availableTickets.textContent = "";
            buyButton.disabled = true;
            buyButton.textContent = "Buy Ticket";
          }
        } else {
          console.error("Failed to delete film");
        }
      })
      .catch((error) => console.error("Error deleting film:", error));
  }
});

  