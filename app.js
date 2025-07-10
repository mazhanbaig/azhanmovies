// My API key and base URL for TMDB
const API_KEY = "63f568ca8b3bbb806284ff9e018bee43";
const BASE_URL = "https://api.themoviedb.org/3";

// Getting important HTML elements from the page
const searchInputs = [
  document.getElementById("search"),
  document.getElementById("search-mobile"),
];
const searchSection = document.getElementById("search-section");
const searchResults = document.getElementById("search-results");
const noResults = document.getElementById("no-results");
const homepageSections = document.getElementById("homepage-sections");

// All genre IDs mapped to names, I’ll use these for filter buttons
const genresMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Making genre buttons show up
function renderGenreDropdown() {
  const genreSelect = document.getElementById("genre-select");
  genreSelect.innerHTML = '<option value="all">All Genres</option>'; // default

  for (let id in genresMap) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = genresMap[id];
    genreSelect.appendChild(option);
  }
}

// Creating movie card for each movie
function makeMovieCard(movie) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const card = document.createElement("div");
  card.className =
    "glass w-[250px] min-w-[250px] rounded-xl overflow-hidden transition hover:scale-105 snap-center flex-shrink-0";
  card.setAttribute("data-genres", movie.genre_ids?.join(",") || "");

  card.innerHTML = `
    <img src="${poster}" alt="${
    movie.title
  }" class="w-full h-[370px] object-cover" />
    <div class="p-4 flex flex-col gap-2 text-white">
      <h2 class="text-lg font-bold bg-gradient-to-r from-cyan-400 to-pink-400 text-transparent bg-clip-text">${
        movie.title
      }</h2>
      <div class="text-sm flex justify-between text-gray-400">
        <span>${movie.release_date || "No date"}</span>
        <span>⭐ ${movie.vote_average}</span>
      </div>
      <div class="flex gap-2 mt-2">
        <button class="detail-btn flex-1 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-[10px]">Details</button>
        <button class="watch-now-btn flex-1 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-[10px]">Watch</button>
        <button class="add-fav-btn flex-1 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[10px]">❤️</button>
      </div>
    </div>
  `;

  // Click on detail will go to detail page
  card.querySelector(".detail-btn").addEventListener("click", () => {
    window.location.href = `movie.html?id=${movie.id}`;
  });

  // Click on watch goes to watch.html
  card.querySelector(".watch-now-btn").addEventListener("click", () => {
    window.location.href = `watch.html?id=${movie.id}`;
  });

  // Add to favorites, saves in localStorage
  card.querySelector(".add-fav-btn").addEventListener("click", () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let alreadyAdded = favorites.some((fav) => fav.id === movie.id);

    if (!alreadyAdded) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("❤️ Added to favorites!");
    } else {
      alert("✅ Already in favorites!");
    }
  });

  return card;
}

// Load a specific section like trending, popular etc
async function loadSection(containerId, endpoint) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
    const data = await res.json();
    data.results.slice(0, 20).forEach((movie) => {
      container.appendChild(makeMovieCard(movie));
    });
  } catch (e) {
    console.error("Error loading", endpoint, e);
  }
}

// Search movies and group them by language
async function searchMovies(query) {
  if (!query) {
    searchSection.classList.add("hidden");
    homepageSections.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    searchResults.innerHTML = "";
    noResults.classList.add("hidden");
    searchSection.classList.remove("hidden");
    homepageSections.classList.add("hidden");

    if (!data.results || data.results.length === 0) {
      noResults.classList.remove("hidden");
      return;
    }

    // Group movies by language
    const groups = { en: [], hi: [], ur: [], ja: [], other: [] };

    data.results.forEach((movie) => {
      const lang = movie.original_language;
      if (lang === "en") groups.en.push(movie);
      else if (lang === "hi") groups.hi.push(movie);
      else if (lang === "ur") groups.ur.push(movie);
      else if (lang === "ja") groups.ja.push(movie);
      else groups.other.push(movie);
    });

    const langLabels = {
      en: "🎬 Hollywood Movies",
      hi: "🎬 Bollywood Movies",
      ur: "🎬 Pakistani Movies",
      ja: "🎬 Anime",
      other: "🎬 Other Languages",
    };

    // Create section per language
    for (const lang in groups) {
      if (groups[lang].length > 0) {
        const title = document.createElement("h3");
        title.textContent = langLabels[lang];
        title.className = "text-xl font-bold text-pink-400 mb-2";
        searchResults.appendChild(title);

        const container = document.createElement("div");
        container.className =
          "flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory";

        groups[lang].forEach((movie) => {
          const card = makeMovieCard(movie);
          container.appendChild(card);
        });

        searchResults.appendChild(container);
      }
    }
  } catch (err) {
    console.error("Search error", err);
  }
}

// Apply saved theme (dark or light)
function applySavedTheme() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }
}

// Toggle between light and dark theme
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Event listener for search inputs
searchInputs.forEach((input) => {
  input?.addEventListener("input", (e) => {
    searchMovies(e.target.value.trim());
  });
});

// Genre filter logic
document.getElementById("genre-select")?.addEventListener("change", (e) => {
  const selectedGenre = e.target.value;
  document.querySelectorAll(".glass[data-genres]").forEach((card) => {
    const genres = card.getAttribute("data-genres")?.split(",") || [];
    card.style.display =
      selectedGenre === "all" || genres.includes(selectedGenre)
        ? "block"
        : "none";
  });
});

// For mobile menu toggle
document.getElementById("menu-toggle")?.addEventListener("click", () => {
  document.getElementById("dropdown-menu").classList.toggle("hidden");
});

// For dark/light mode button
document.getElementById("mode-toggle")?.addEventListener("click", toggleTheme);

// Run everything when page loads
window.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  renderGenreDropdown();
  loadSection("trending-container", "/trending/movie/week");
  loadSection("popular-container", "/movie/popular");
  loadSection("toprated-container", "/movie/top_rated");
  loadSection("newest-container", "/movie/now_playing");
  loadSection("upcoming-container", "/movie/upcoming");
});
