const API_KEY = '63f568ca8b3bbb806284ff9e018bee43';
const BASE_URL = 'https://api.themoviedb.org/3';
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
  document.getElementById('search'),       // desktop
  document.getElementById('search-mobile') // mobile
];

searchInputs.forEach(input => {
  if (input) {
    input.addEventListener('input', (e) => {
      const searchVal = e.target.value.trim();
      if (searchVal.length >= 2) {
        addMovies(searchVal);
      } else {
        movieContainer.innerHTML = '';
        noResults.classList.remove('hidden');
      }
    });
  }
});

// Toggle the mobile menu
document.getElementById("menu-toggle").addEventListener("click", () => {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
});
<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="src/output.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

</head>

<body class="font-sans">
    <!-- Navbar -->
    <nav class="bg-white/40 backdrop-blur-md text-white sticky top-0 left-0 w-full z-50 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[80px] flex items-center justify-between">
            <!-- Desktop Layout -->
            <div class="hidden md:flex w-full items-center justify-between">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-wide w-fit">
                    <span
                        class="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text drop-shadow-md">
                        AZHAN
                    </span>
                </h1>
                <div class="flex justify-center flex-1">
                    <input
                        class="bg-black text-white px-3 py-1 rounded-3xl border-2 border-white outline-none h-[50px] w-full md:max-w-[450px] lg:max-w-[550px]"
                        type="search" placeholder="Search" name="search" id="search" />
                </div>
                <div class="w-fit flex justify-end space-x-6">
                    <a href="index.html"
                        class="hover:underline hover:scale-105 underline-offset-4 transition text-black">Home</a>
                    <a href="contact.html" class="hover:underline underline-offset-4 transition text-black">Contact</a>
                </div>
            </div>

            <!-- Mobile Layout -->
            <div class="md:hidden w-full flex items-center justify-between">
                <h1 class="text-2xl font-bold tracking-wide mr-[20px]">
                    <span
                        class="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">AZHAN</span>
                </h1>
                <div class="flex justify-center flex-1">
                    <input
                        class="bg-black text-white px-3 py-1 rounded-3xl border-2 border-white outline-none h-[40px] w-full md:max-w-[450px] lg:max-w-[550px]"
                        type="search" placeholder="Search" name="search" id="search-mobile" />
                </div>
                <button id="menu-toggle" class="focus:outline-none text-2xl w-[50px] h-[50px] text-black">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu"
            class="md:hidden hidden  bg-black text-white w-[100px] h-fit flex-col space-y-4 py-4 px-3 absolute top-[80px] right-4 z-50 shadow-lg rounded-lg">
            <a href="index.html" class="block hover:underline">Home</a>
            <a href="contact.html" class="block hover:underline">Contact</a>
        </div>
    </nav>
    <!-- ended  -->
    <!-- ended  -->
    <!-- types section   -->
    <!-- Types Section - Vibrant & Futuristic -->
    <div
        class="w-full flex flex-wrap justify-center items-center gap-3 px-4 py-5 bg-[#0e0e10] shadow-[0_0_10px_#6b21a8] border-t border-purple-800/40">
        <button data-category="All"
            class="category-btn px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-[#6b21a8] to-[#9333ea] shadow-md hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105">
            All
        </button>
        <button data-category="Hollywood"
            class="category-btn px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-[#3b82f6] to-[#6366f1] shadow-md hover:shadow-blue-400/60 transition-all duration-300 hover:scale-105">
            Hollywood
        </button>
        <button data-category="Bollywood"
            class="category-btn px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-[#f97316] to-[#f43f5e] shadow-md hover:shadow-orange-400/60 transition-all duration-300 hover:scale-105">
            Bollywood
        </button>
        <button data-category="Pakistani"
            class="category-btn px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-[#22c55e] to-[#10b981] shadow-md hover:shadow-green-400/60 transition-all duration-300 hover:scale-105">
            Pakistani
        </button>
        <button data-category="Anime"
            class="category-btn px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-[#eab308] to-[#f59e0b] shadow-md hover:shadow-yellow-400/60 transition-all duration-300 hover:scale-105">
            Anime
        </button>
        <button data-category="Other"
            class="category-btn px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-[#eab308] to-[#f59e0b] shadow-md hover:shadow-yellow-400/60 transition-all duration-300 hover:scale-105">
            Anime
        </button>
    </div>

    <!-- Movie Section -->
    <div class="wrapper bg-black/90 w-full h-[100%] pb-[50px]">
        <h1 class="text-4xl sm:text-5xl md:text-7xl text-white font-semibold pt-[50px] text-center">
            Films
        </h1>
        <div id="movie-container"
            class="grid gap-y-8 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 mt-12 w-full">
            <!-- Movies injected by JS -->
        </div>


        <!-- No Results Message -->
        <p id="no-results"
            class="mb-[20px] bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text text-center text-xl mt-10 hidden">
            No match found
        </p>
    </div>

    <!-- Footer -->
    <footer class="bg-black text-white py-10 px-6 mt-auto">
        <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- About -->
            <div>
                <h2 class="text-xl font-semibold mb-3">AZHAN Movies</h2>
                <p class="text-sm text-gray-400">
                    Your daily dose of entertainment. Stream the best movies right here, anytime, anywhere.
                </p>
            </div>

            <!-- Links -->
            <div>
                <h2 class="text-lg font-semibold mb-3">Quick Links</h2>
                <ul class="space-y-2 text-sm text-gray-300">
                    <li><a href="index.html" class="hover:underline">Home</a></li>
                    <li><a href="#" class="hover:underline">Contact</a></li>
                    <li><a href="#" class="hover:underline">Support</a></li>
                    <li><a href="#" class="hover:underline">Privacy Policy</a></li>
                </ul>
            </div>

            <!-- Newsletter -->
            <div>
                <h2 class="text-lg font-semibold mb-3">Newsletter</h2>
                <form class="flex flex-col space-y-2">
                    <input type="email" placeholder="Your email"
                        class="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 outline-none focus:ring-2 focus:ring-cyan-500" />
                    <button
                        class="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-md hover:opacity-90 transition">
                        Subscribe
                    </button>
                </form>
            </div>

            <!-- Socials -->
            <div>
                <h2 class="text-lg font-semibold mb-3">Follow Us</h2>
                <div class="flex space-x-4 text-xl">
                    <a href="#" class="hover:text-blue-500"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="hover:text-pink-500"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="hover:text-blue-400"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="hover:text-red-500"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>

        <div class="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
            &copy; 2025 AZHAN Movies. All rights reserved.
        </div>
    </footer>


    <!-- Scripts -->
    <script src="app.js"></script>
</body>