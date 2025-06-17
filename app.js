const API_KEY = '63f568ca8b3bbb806284ff9e018bee43';
    const BASE_URL = 'https://api.themoviedb.org/3';
    // const searchInput = document.getElementById('search');
    const movieContainer = document.getElementById('movie-container');
    const noResults = document.getElementById('no-results');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Map language to category name
    function mapLanguageToCategory(lang) {
      switch (lang) {
        case 'en': return 'Hollywood';
        case 'hi': return 'Bollywood';
        case 'ur': return 'Pakistani';
        case 'ja': return 'Anime';
        default: return 'Other';
      }
    }

    // Filter by category
    function filterMoviesByCategory(category) {
      const allMovies = document.querySelectorAll('.movie-box');

      allMovies.forEach(movie => {
        const movieCategory = movie.getAttribute('data-category');
        const match = category === 'All' || movieCategory === category;
        movie.style.display = match ? 'flex' : 'none';
      });
    }

    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-category');
        filterMoviesByCategory(selected);
      });
    });

    // Add movies to DOM
    async function addMovies(searchVal) {
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchVal)}`);
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
          movie-box group relative flex flex-col justify-between 
          w-full max-w-[300px] bg-[#0f0f0f] rounded-2xl 
          overflow-hidden border border-purple-600/30 
          shadow-lg hover:shadow-purple-500/40 
          transition-all duration-300 hover:scale-105
        `;

        movieBox.innerHTML = `
          <div class="w-full h-[250px] overflow-hidden">
            <img src="${poster}" alt="${movie.title}" class="w-full h-full object-cover rounded-t-2xl" />
          </div>
          <div class="flex flex-col gap-2 px-4 py-3 text-white">
            <h1 class="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text text-center">${movie.title}</h1>
            <p class="text-sm text-gray-400 text-center">${movie.release_date || "No release date"}</p>
            <p class="text-sm text-gray-400 text-center">Rating: ${movie.vote_average}</p>
            <p class="text-sm text-gray-400 text-center">${movie.overview.slice(0, 100)}...</p>
            <button class="mt-2 px-4 w-full py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full text-sm font-semibold transition duration-300 hidden group-hover:block hover:brightness-110 self-center">Watch Now</button>
          </div>
        `;

        movieContainer.appendChild(movieBox);
      });
    }

    // Search input listener
    const searchInputs = [
      document.getElementById('search'),          // desktop
      document.getElementById('search-mobile')    // mobile
    ];
    
    searchInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', (e) => {
          const searchVal = e.target.value.trim();
          if (searchVal.length >= 2) {
            addMovies(searchVal);
          } else {
            movieContainer.innerHTML = '';
            noResults.classList.add('hidden');
          }
        });
      }
    });
    
  // Toggle the mobile menu
  document.getElementById("menu-toggle").addEventListener("click", () => {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
  });
