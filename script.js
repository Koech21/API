const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'aaa82a7849msh38bac61ac13aa96p1a2038jsn79f1fe00953e',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

let currentResults = [];
let sortMode = "title"; // 'title', 'rating', or 'date'
let isAscending = true;

async function serachAndDisplaymovies(title, type) {
  try {
    const url = `https://imdb236.p.rapidapi.com/api/imdb/search?originalTitle=${title}&type=${type}&genre=Drama&rows=25&sortOrder=ASC&sortField=id`;
    console.log(url);

    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);

    currentResults = result.results || [];
    sortAndDisplay();

  } catch (error) {
    console.error(error);
    const moviesList = document.getElementById("results-list");
    moviesList.innerHTML = `
      <li class="error">Error loading movies. Please try again later.</li>
    `;
  }
}

function sortAndDisplay() {
  const sorted = [...currentResults];

  sorted.sort((a, b) => {
    let aVal, bVal;

    if (sortMode === "title") {
      aVal = a.primaryTitle?.toLowerCase() || "";
      bVal = b.primaryTitle?.toLowerCase() || "";
      document.getElementsByClassName("showsortby").innerHTML = `Sorted by: ${sortMode} (${isAscending ? "Ascending" : "Descending"})`
      return isAscending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      
    }

    if (sortMode === "rating") {
      aVal = a.averageRating || 0;
      bVal = b.averageRating || 0;
      document.getElementsByClassName("showsortby").innerHTML = `Sorted by: ${sortMode} (${isAscending ? "Ascending" : "Descending"})`
      return isAscending ? aVal - bVal : bVal - aVal;
      
    }

    if (sortMode === "date") {
      aVal = new Date(a.releaseDate || "1900-01-01");
      bVal = new Date(b.releaseDate || "1900-01-01");
      document.getElementsByClassName("showsortby").innerHTML = `Sorted by: ${sortMode} (${isAscending ? "Ascending" : "Descending"})`
      return isAscending ? aVal - bVal : bVal - aVal;
    }
  });

  displayMovies(sorted);
}

function displayMovies(movies) {
  const moviesList = document.getElementById("results-list");
  moviesList.innerHTML = "";

  if (movies.length === 0) {
    moviesList.innerHTML = `<li>No results found.</li>`;
    return;
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement("li");
    movieElement.className = "movie-item";
    movieElement.innerHTML = `
      <img src="${movie.primaryImage}" alt="${movie.primaryTitle}">
      <h3><span>${movie.type}</span> ${movie.primaryTitle}</h3>
      <p>${movie.description?.slice(0, 200) || "No description available"}</p>
      ${
        movie.releaseDate
          ? `<p> Release date
          : ${movie.releaseDate}</p>`
          : ""
      }
      ${
        movie.runtimeMinutes
          ? `<p> Runtime: ${movie.runtimeMinutes} Minutes</p>`
          : ""
      }
      ${
        movie.contentRating
          ? `<p>Content Rating: ${movie.contentRating}</p>`
          : ""
      }
      ${
        movie.averageRating
          ? `<p id="Average-Rating">Average Rating: ${movie.averageRating}</p>`
          : ""
      }
    `;
    moviesList.appendChild(movieElement);
  });
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = document.querySelector("#title").value.trim();
  const typeitem = document.querySelector("#type").value;

  if (searchTerm === "") {
    alert("Please search for something before submitting the form.");
    return;
  }

  serachAndDisplaymovies(searchTerm, typeitem);
  document.querySelector("#title").value = "";
  document.querySelector("#type").value = "";
});

document.querySelector(".sort-by-alphabet").addEventListener("click", () => {
  if (!currentResults.length) return;

  // Cycle through sorting modes
  if (sortMode === "title") {
    sortMode = "rating";
    document.getElementsByClassName("showsortby").innerHTML = `Sorted by: ${sortMode} (${isAscending ? "Ascending" : "Descending"})`
  } else if (sortMode === "rating") {
    sortMode = "date";
    document.getElementsByClassName("showsortby").innerHTML = `Sorted by: ${sortMode} (${isAscending ? "Ascending" : "Descending"})`
  } else {
    sortMode = "title";
    isAscending = !isAscending; // Flip direction when looping back
    document.getElementsByClassName("showsortby").innerHTML = `Sorted by: ${sortMode} (${isAscending ? "Ascending" : "Descending"})`
  }

  sortAndDisplay();
});
