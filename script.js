const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'aaa82a7849msh38bac61ac13aa96p1a2038jsn79f1fe00953e',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

let currentResults = [];
let isAscending = true;
let pageOffset = 0;
let currentQuery = { title: "", type: "" };
let isLoading = false;

// Fetch + append
async function fetchMovies(append = false) {
  const { title, type } = currentQuery;
  const url = `https://imdb236.p.rapidapi.com/imdb/search?originalTitle=${encodeURIComponent(
    title
  )}&type=${type}&genre=Drama&rows=25&start=${pageOffset}&sortOrder=ASC&sortField=id`;

  try {
    isLoading = true;
    const res = await fetch(url, options);
    const data = await res.json();
    const newResults = data.results || [];

    if (append) {
      currentResults.push(...newResults);
    } else {
      currentResults = newResults;
    }

    sortAndDisplay();
    pageOffset += 25;
    isLoading = false;
  } catch (err) {
    console.error("Error fetching movies:", err);
    isLoading = false;
    if (!append) {
      document.getElementById("results-list").innerHTML =
        "<li class='error'>Failed to load movies.</li>";
    }
  }
}

function sortAndDisplay() {
  const sorted = [...currentResults];

  sorted.sort((a, b) => {
    const aTitle = a.primaryTitle?.toLowerCase() || "";
    const bTitle = b.primaryTitle?.toLowerCase() || "";
    return isAscending
      ? aTitle.localeCompare(bTitle)
      : bTitle.localeCompare(aTitle);
  });

  displayMovies(sorted);
}

function displayMovies(movies) {
  const list = document.getElementById("results-list");
  list.innerHTML = ""; // clear and re-render all

  movies.forEach((movie) => {
    const li = document.createElement("li");
    li.className = "movie-item";
    li.innerHTML = `
      <img src="${movie.primaryImage}" alt="${movie.primaryTitle}">
      <h3><span>${movie.type}</span> ${movie.primaryTitle}</h3>
      <p>${movie.description?.slice(0, 200) || "No description available"}</p>
      <p>Release date: ${movie.releaseDate}</p>
      ${
        movie.runtimeMinutes
          ? `<p>Runtime: ${movie.runtimeMinutes} minutes</p>`
          : ""
      }
      ${
        movie.contentRating
          ? `<p>Content Rating: ${movie.contentRating}</p>`
          : ""
      }
      ${
        movie.averageRating
          ? `<p>Average Rating: ${movie.averageRating}</p>`
          : ""
      }
    `;
    list.appendChild(li);
  });
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#title").value.trim();
  const type = document.querySelector("#type").value;

  if (!title) {
    alert("Enter a title to search.");
    return;
  }

  currentQuery = { title, type };
  pageOffset = 0;
  fetchMovies(false);
  document.querySelector("#title").value = "";
  document.querySelector("#type").value = "";
});

document.querySelector(".sort-by-alphabet").addEventListener("click", () => {
  isAscending = !isAscending;
  sortAndDisplay();
});

// 🚀 Infinite Scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200 &&
    !isLoading &&
    currentQuery.title
  ) {
    fetchMovies(true);
  }
});
