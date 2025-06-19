const API_KEY = '63f568ca8b3bbb806284ff9e018bee43';
const BASE_URL = 'https://api.themoviedb.org/3';

const movieContainer = document.getElementById('movie-container');
const noResults = document.getElementById('no-results');
const categoryButtons = document.querySelectorAll('.category-btn');

// Language map
function mapLanguageToCategory(lang) {
  switch (lang) {
    case 'en': return 'Hollywood';
    case 'hi': return 'Bollywood';
    case 'ur': return 'Pakistani';
    case 'ja': return 'Anime';
    default: return 'Other';
  }
}

// Add Movies (search or popular)
async function addMovies(searchVal = "", isPopular = false) {
  const url = isPopular
    ? `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    : `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchVal)}`;

  const response = await fetch(url);
  const data = await response.json();
  const movies = data.results;

  movieContainer.innerHTML = '';

  if (!movies || movies.length === 0) {
    noResults.classList.remove('hidden');
    return;
  } else {
    noResults.classList.add('hidden');
  }

  movies.forEach(movie => {
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    const category = mapLanguageToCategory(movie.original_language);
    const movieBox = document.createElement('div');
    movieBox.setAttribute('data-category', category);
    movieBox.className = `
      movie-box group flex flex-col bg-white/100 rounded-xl overflow-hidden
      border border-blue-400 shadow-md hover:shadow-purple-500/40
      transition-all duration-300 hover:scale-105 w-full
    `;

    movieBox.innerHTML = `
      <div class="w-full h-[200px] sm:h-[220px] md:h-[250px] overflow-hidden">
        <img src="${poster}" alt="${movie.title}" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col gap-2 px-3 py-3 text-black">
        <h1 class="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-transparent bg-clip-text text-center">${movie.title}</h1>
        <p class="text-xs sm:text-sm text-gray-800 text-center">${movie.release_date || "No release date"}</p>
        <p class="text-xs sm:text-sm text-gray-800 text-center">Rating: ${movie.vote_average}</p>
        <p class="text-xs sm:text-sm text-gray-800 text-center">${movie.overview.slice(0, 100)}...</p>
        <button class="detail-btn w-full mt-1 px-3 py-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-white rounded-full text-xs sm:text-sm font-semibold transition duration-300 hidden group-hover:block hover:brightness-110 self-center">View more detail</button>
        <button class="watch-now-btn w-full mt-1 px-3 py-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-white rounded-full text-xs sm:text-sm font-semibold transition duration-300 hidden group-hover:block hover:brightness-110 self-center">Watch Now</button>
      </div>
    `;

    movieContainer.appendChild(movieBox);

    // ✅ Correct way to attach event to button in current movie box
    const detailBtn = movieBox.querySelector('.detail-btn');
    detailBtn.addEventListener('click', () => {
      window.location.href = `.html?id=${movie.id}`;
    });
    const watchBtn = movieBox.querySelector('.watch-now-btn');
    watchBtn.addEventListener('click', () => {
    window.location.href = `watch.html?id=${movie.id}`;
    });

  });
}

// Filter by category
function filterMoviesByCategory(category) {
  const allMovies = document.querySelectorAll('.movie-box');
  allMovies.forEach(movie => {
    const movieCategory = movie.getAttribute('data-category');
    const match = category === "All" || movieCategory === category;
    movie.style.display = match ? 'flex' : 'none';
  });
}

// Category buttons
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = btn.getAttribute('data-category');
    filterMoviesByCategory(selected);
  });
});

// Search input
const searchInputs = [document.getElementById('search'), document.getElementById('search-mobile')];
searchInputs.forEach(input => {
  if (input) {
    input.addEventListener('input', (e) => {
      const searchVal = e.target.value.trim();
      if (searchVal.length >= 2) {
        addMovies(searchVal);
      } else {
        addMovies("", true); // Show popular
      }
    });
  }
});

// Load popular movies on page load
window.addEventListener('DOMContentLoaded', () => {
  addMovies("", true);
});

// Toggle mobile menu
document.getElementById("menu-toggle").addEventListener("click", () => {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
});
