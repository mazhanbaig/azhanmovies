// const API_KEY = '63f568ca8b3bbb806284ff9e018bee43';
// const BASE_URL = 'https://api.themoviedb.org/3';

// const movieContainer = document.getElementById('movie-container');
// const noResults = document.getElementById('no-results');
// const categoryButtons = document.querySelectorAll('.category-btn');

// // Language map
// function mapLanguageToCategory(lang) { //2 second
//   switch (lang) {
//     case 'en': return 'Hollywood';
//     case 'hi': return 'Bollywood';
//     case 'ur': return 'Pakistani';
//     case 'ja': return 'Anime';
//     default: return 'Other';
//   }
// }

// // Add Movies (search or popular)
// async function addMovies(searchVal = "", isPopular = false) {
//   const url = isPopular
//     ? `${BASE_URL}/movie/popular?api_key=${API_KEY}`
//     : `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchVal)}`;

//   const response = await fetch(url);
//   const data = await response.json();
//   const movies = data.results;

//   movieContainer.innerHTML = '';

//   if (!movies || movies.length === 0) {
//     noResults.classList.remove('hidden');
//     return;
//   } else {
//     noResults.classList.add('hidden');
//   }

//   movies.forEach(movie => {
//     const poster = movie.poster_path
//       ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//       : 'https://via.placeholder.com/300x450?text=No+Image';

//     const category = mapLanguageToCategory(movie.original_language); //1 first
//     const movieBox = document.createElement('div');
//     movieBox.setAttribute('data-category', category);
//     movieBox.className = `
//       movie-box group flex flex-col bg-white/100 rounded-xl overflow-hidden
//       border border-blue-400 shadow-md hover:shadow-purple-500/40
//       transition-all duration-300 hover:scale-105 w-full
//     `;

//     movieBox.innerHTML = `
//       <div class="w-full h-[200px] sm:h-[220px] md:h-[250px] overflow-hidden">
//         <img src="${poster}" alt="${movie.title}" class="w-full h-full object-cover" />
//       </div>
//       <div class="flex flex-col gap-2 px-3 py-3 text-black">
//         <h1 class="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-transparent bg-clip-text text-center">${movie.title}</h1>
//         <p class="text-xs sm:text-sm text-gray-800 text-center">${movie.release_date || "No release date"}</p>
//         <p class="text-xs sm:text-sm text-gray-800 text-center">Rating: ${movie.vote_average}</p>
//         <p class="text-xs sm:text-sm text-gray-800 text-center">${movie.overview.slice(0, 100)}...</p>
//         <button class="detail-btn w-full mt-1 px-3 py-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-white rounded-full text-xs sm:text-sm font-semibold transition duration-300 hidden group-hover:block hover:brightness-110 self-center">View more detail</button>
//         <button class="watch-now-btn w-full mt-1 px-3 py-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-white rounded-full text-xs sm:text-sm font-semibold transition duration-300 hidden group-hover:block hover:brightness-110 self-center">Watch Now</button>
//       </div>
//     `;

//     movieContainer.appendChild(movieBox);

//     // ✅ Correct way to attach event to button in current movie box
//     const detailBtn = movieBox.querySelector('.detail-btn');
//     detailBtn.addEventListener('click', () => {
//       window.location.href = `movie.html?id=${movie.id}`;
//     });
//     const watchBtn = movieBox.querySelector('.watch-now-btn');
//     watchBtn.addEventListener('click', () => {
//     window.location.href = `watch.html?id=${movie.id}`;
//     });

//   });
// }

// // Filter by category 4 forth one and the last one 
// function filterMoviesByCategory(category) {
//   const allMovies = document.querySelectorAll('.movie-box');
//   allMovies.forEach(movie => {
//     const movieCategory = movie.getAttribute('data-category');
//     const match = category === "All" || movieCategory === category;
//     movie.style.display = match ? 'flex' : 'none';
//   });
// }

// // Category buttons
// categoryButtons.forEach(btn => { //3 third
//   btn.addEventListener('click', () => {
//     const selected = btn.getAttribute('data-category');
//     filterMoviesByCategory(selected);
//   });
// });

// // Search input
// const searchInputs = [document.getElementById('search'), document.getElementById('search-mobile')];
// searchInputs.forEach(input => {
//   if (input) {
//     input.addEventListener('input', (e) => {
//       const searchVal = e.target.value.trim();
//       if (searchVal.length >= 2) {
//         addMovies(searchVal);
//       } else {
//         addMovies("", true); // Show popular
//       }
//     });
//   }
// });

// // Load popular movies on page load
// window.addEventListener('DOMContentLoaded', () => {
//   addMovies("", true);
// });

// // Toggle mobile menu
// document.getElementById("menu-toggle").addEventListener("click", () => {
//   const menu = document.getElementById("mobile-menu");
//   menu.classList.toggle("hidden");
// });
















const API_KEY = '63f568ca8b3bbb806284ff9e018bee43';
const BASE_URL = 'https://api.themoviedb.org/3';

const popularContainer = document.getElementById('popular-container');
const newestContainer = document.getElementById('newest-container');
const searchSection = document.getElementById('search-section');
const searchResults = document.getElementById('search-results');
const noResults = document.getElementById('no-results');
const popularSection = document.getElementById('popular-section');
const newestSection = document.getElementById('newest-section');

const searchInputs = [document.getElementById('search'), document.getElementById('search-mobile')];

// Create movie box with updated layout
function createMovieBox(movie, fullWidth = false) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const box = document.createElement('div');
  box.className = `
    glass ${fullWidth ? 'w-full min-w-full snap-center' : 'w-[250px] min-w-[250px]'}
    rounded-xl overflow-hidden transition hover:scale-[1.03] flex flex-col
  `;

  box.innerHTML = `
    <img src="${poster}" alt="${movie.title}" class="w-full h-[370px] object-cover" />
    <div class="p-4 flex flex-col gap-2 text-left text-white">
      <h2 class="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">${movie.title}</h2>
      <div class="flex justify-between text-sm text-gray-400">
        <span>${movie.release_date || 'No date'}</span>
        <span>⭐ ${movie.vote_average}</span>
      </div>
      <p class="text-sm text-gray-300">${movie.overview?.slice(0, 100)}...</p>
      <div class="flex gap-3 mt-3">
        <button class="detail-btn flex-1 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-semibold rounded-full hover:scale-105 transition">
          ℹ View Details
        </button>
        <button class="watch-now-btn flex-1 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-full hover:scale-105 transition">
          ▶ Watch Now
        </button>
      </div>
    </div>
  `;

  box.querySelector('.detail-btn').addEventListener('click', () => {
    window.location.href = `movie.html?id=${movie.id}`;
  });

  box.querySelector('.watch-now-btn').addEventListener('click', () => {
    window.location.href = `watch.html?id=${movie.id}`;
  });

  return box;
}

// Load All Movies (popular and newest sections)
async function loadAllMovies() {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
  const res = await fetch(url);
  const data = await res.json();

  popularContainer.innerHTML = '';
  newestContainer.innerHTML = '';

  // First 10 as popular
  data.results.slice(0, 10).forEach(movie => {
    popularContainer.appendChild(createMovieBox(movie));
  });

  // Next 10 as newest
  data.results.slice(10, 20).forEach(movie => {
    newestContainer.appendChild(createMovieBox(movie));
  });
}

// Handle Search Input
async function handleSearch(query) {
  if (!query) {
    searchSection.classList.add('hidden');
    popularSection.classList.remove('hidden');
    newestSection.classList.remove('hidden');
    return;
  }

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  const movies = data.results;

  searchResults.innerHTML = '';
  noResults.classList.add('hidden');
  searchSection.classList.remove('hidden');
  popularSection.classList.add('hidden');
  newestSection.classList.add('hidden');

  if (!movies || movies.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  movies.forEach(movie => {
    // fullWidth = true for horizontal scroll and full width on mobile
    searchResults.appendChild(createMovieBox(movie, true));
  });
}

// Search inputs event listeners
searchInputs.forEach(input => {
  input?.addEventListener('input', e => {
    const val = e.target.value.trim();
    handleSearch(val);
  });
});

// DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  loadAllMovies();
});

// Mobile menu toggle
document.getElementById("menu-toggle")?.addEventListener("click", () => {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
});
