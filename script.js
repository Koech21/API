
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'aaa82a7849msh38bac61ac13aa96p1a2038jsn79f1fe00953e',
		'x-rapidapi-host': 'imdb236.p.rapidapi.com'
	}
};

 async function serachAndDisplaymovies(title,type){
try {
	const response = await fetch(`https://imdb236.p.rapidapi.com/api/imdb/search?originalTitle=${title}&$type=${type}&genre=Drama&rows=25&sortOrder=ASC&sortField=id`, options);
	const result = await response.json();
	console.log(result);
    const moviesList = document.getElementById("results-list")
    moviesList.innerHTML=""
    result.results.forEach((movie)=>{
        const movieElement = document.createElement("li");
        movieElement.className= "movie-item";
        movieElement.innerHTML=`
          <img src="${movie.primaryImage}" alt="${movie.primaryTitle}">
          <h3><span>${movie.type}</span>${movie}</h3>
          <p>${movie.description?.slice(0,200)|| "No description available" }</p>
          ${
            movie.contentRating
            ? `<p> Content Rating: ${movie.contentRating}</p>`
            : ""
          }
         ${
            movie.averageRating
            ? `<p id="Average-Rating"> Average Rating: ${movie.averageRating}</p>`
            : ""
          }
        `;
        moviesList.appendChild(movieElement);
    })
} catch (error) {
	console.error(error);
    const moviesList = document.getElementById("results-list")
    moviesList.innerHTML=`
       <li class="error">Error loading movies. please try again later</li>
    `
}
}


document.querySelector("form").addEventListener("submit", (event)=>{
    event.preventDefault();

     const searchTerm = document.querySelector("#title").value;
     const typeitem = document.querySelector("#type").value;
  if (searchTerm.trim() === "") {
    alert("Please search for something before submiting the form.");
    return;
  }

    serachAndDisplaymovies(searchTerm,typeitem)
    document.querySelector("#title").value = "";
    document.querySelector("#type").value = "";
})
//task - ammend the code to include a drop down menu for a search category