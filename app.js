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

// Get elements
const searchInputs = [document.getElementById('search'), document.getElementById('search-mobile')];
const searchSection = document.getElementById('search-section');
const searchResults = document.getElementById('search-results');
const noResults = document.getElementById('no-results');
const homepageSections = document.getElementById('homepage-sections');

// Genre map
const genresMap = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

// Render genre buttons
function renderGenreButtons() {
  const genreBox = document.getElementById('genre-buttons');
  genreBox.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.textContent = "All";
  allBtn.setAttribute('data-genre', 'all');
  allBtn.className = 'genre-btn px-3 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-pink-500 hover:to-purple-500 text-white text-sm';
  genreBox.appendChild(allBtn);

  for (let id in genresMap) {
    const btn = document.createElement('button');
    btn.textContent = genresMap[id];
    btn.setAttribute('data-genre', id);
    btn.className = allBtn.className;
    genreBox.appendChild(btn);
  }
}

// Language to Category
function getCategory(lang) {
  if (lang === 'en') return 'Hollywood';
  if (lang === 'hi') return 'Bollywood';
  if (lang === 'ur') return 'Pakistani';
  if (lang === 'ja') return 'Anime';
  return 'Other';
}

// Movie card UI
function makeMovieCard(movie) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const card = document.createElement('div');
  card.className = 'glass w-[250px] min-w-[250px] rounded-xl overflow-hidden transition hover:scale-105 snap-center flex-shrink-0';
  card.setAttribute('data-genres', movie.genre_ids?.join(',') || '');

  card.innerHTML = `
    <img src="${poster}" alt="${movie.title}" class="w-full h-[370px] object-cover" />
    <div class="p-4 flex flex-col gap-2 text-white">
      <h2 class="text-lg font-bold bg-gradient-to-r from-cyan-400 to-pink-400 text-transparent bg-clip-text">${movie.title}</h2>
      <div class="text-sm flex justify-between text-gray-400">
        <span>${movie.release_date || 'No date'}</span>
        <span>⭐ ${movie.vote_average}</span>
      </div>
      <div class="flex gap-2 mt-2">
        <button class="detail-btn flex-1 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-[10px]">Details</button>
        <button class="watch-now-btn flex-1 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-[10px]">Watch</button>
        <button class="add-fav-btn flex-1 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[10px]">❤️</button>
      </div>
    </div>
  `;

  card.querySelector('.detail-btn').addEventListener('click', () => {
    window.location.href = `movie.html?id=${movie.id}`;
  });

  card.querySelector('.watch-now-btn').addEventListener('click', () => {
    window.location.href = `watch.html?id=${movie.id}`;
  });

  card.querySelector('.add-fav-btn').addEventListener('click', () => {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favs.some(f => f.id === movie.id)) {
      favs.push(movie);
      localStorage.setItem('favorites', JSON.stringify(favs));
    }
  });

  return card;
}

// Load category section
async function loadSection(containerId, endpoint) {
  const box = document.getElementById(containerId);
  box.innerHTML = '';

  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
    const data = await res.json();
    const movies = data.results.slice(0, 10);

    movies.forEach(movie => {
      const card = makeMovieCard(movie);
      box.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading section", error);
  }
}

// Search
async function searchMovies(query) {
  if (!query) {
    searchSection.classList.add('hidden');
    homepageSections.classList.remove('hidden');
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    searchResults.innerHTML = '';
    noResults.classList.add('hidden');
    searchSection.classList.remove('hidden');
    homepageSections.classList.add('hidden');

    if (!data.results || data.results.length === 0) {
      noResults.classList.remove('hidden');
      return;
    }

    const grouped = {};
    data.results.forEach(movie => {
      const category = getCategory(movie.original_language);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(movie);
    });

    for (let cat in grouped) {
      const section = document.createElement('div');
      section.className = 'mb-10';
      section.innerHTML = `<h3 class="text-xl font-bold mb-3 text-pink-400">${cat}</h3>`;

      const row = document.createElement('div');
      row.className = 'flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory';

      grouped[cat].forEach(movie => {
        const card = makeMovieCard(movie);
        row.appendChild(card);
      });

      section.appendChild(row);
      searchResults.appendChild(section);
    }
  } catch (err) {
    console.error("Search error:", err);
  }
}

// Filter genre
function filterMoviesByGenre(genreId) {
  const cards = document.querySelectorAll('.glass[data-genres]');
  cards.forEach(card => {
    const genres = card.getAttribute('data-genres')?.split(',') || [];
    const show = genreId === 'all' || genres.includes(genreId);
    card.style.display = show ? 'block' : 'none';
  });
}

// Theme switch
function applySavedTheme() {
  const icon = document.querySelector('#mode-toggle i');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

function toggleTheme() {
  const icon = document.querySelector('#mode-toggle i');
  const isLight = document.body.classList.contains('light-mode');
  if (isLight) {
    document.body.classList.remove('light-mode');
    localStorage.setItem("theme", "dark");
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    document.body.classList.add('light-mode');
    localStorage.setItem("theme", "light");
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

// Event Listeners
searchInputs.forEach(input => {
  input?.addEventListener('input', (e) => {
    searchMovies(e.target.value.trim());
  });
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('genre-btn')) {
    const genreId = e.target.getAttribute('data-genre');
    filterMoviesByGenre(genreId);
  }
});

document.getElementById("mode-toggle")?.addEventListener("click", toggleTheme);

document.getElementById("menu-toggle")?.addEventListener("click", () => {
  document.getElementById("mobile-menu")?.classList.toggle("hidden");
});

// On Load
window.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  renderGenreButtons();
  loadSection('trending-container', '/trending/movie/week');
  loadSection('popular-container', '/movie/popular');
  loadSection('toprated-container', '/movie/top_rated');
  loadSection('newest-container', '/movie/now_playing');
  loadSection('upcoming-container', '/movie/upcoming');
});
