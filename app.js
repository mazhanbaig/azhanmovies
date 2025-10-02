// 🎬 AZHAN Movies Website JS

const API_KEY = "63f568ca8b3bbb806284ff9e018bee43";
const BASE_URL = "https://api.themoviedb.org/3";

const searchInputs = [
  document.getElementById("search"),
  document.getElementById("search-mobile")
];
const searchSection = document.getElementById("search-section");
const searchResults = document.getElementById("search-results");
const noResults = document.getElementById("no-results");
const homepageSections = document.getElementById("homepage-sections");

const genresMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

// Render Genre Dropdown
function renderGenreDropdown() {
  const genreSelect = document.getElementById("genre-select");
  if (!genreSelect) return;

  genreSelect.innerHTML = '<option value="all">All Genres</option>';
  for (let id in genresMap) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = genresMap[id];
    genreSelect.appendChild(option);
  }
}
function makeMovieCard(movie) {
  const poster = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/640x360?text=No+Image";

  // Card wrapper
  const card = document.createElement("div");
  card.className =
    "poster-card relative w-full sm:w-[220px] md:w-[280px] lg:w-[320px] max-w-full aspect-video rounded-xl overflow-hidden cursor-pointer transition transform hover:scale-105 hover:shadow-2xl bg-gray-900 flex-shrink-0 group";

  // Poster
  const img = document.createElement("img");
  img.src = poster;
  img.alt = movie.title;
  img.className =
    "w-full h-full object-cover transition duration-500 group-hover:brightness-75";
  card.appendChild(img);

  // Overlay
  const overlay = document.createElement("div");
  overlay.className =
    "absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-4";

  // Title
  const title = document.createElement("h2");
  title.className =
    "text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white truncate";
  title.textContent = movie.title;
  overlay.appendChild(title);

  // Meta info
  const meta = document.createElement("p");
  meta.className = "text-xs sm:text-sm text-gray-300 mt-1";
  meta.textContent = `${movie.release_date ? movie.release_date.slice(0, 4) : "N/A"} • ⭐ ${movie.vote_average.toFixed(1)}`;
  overlay.appendChild(meta);

  // Buttons
  const btns = document.createElement("div");
  btns.className = "flex gap-2 mt-3 flex-wrap";

  const createButton = (text, bgHover, onClick) => {
    const btn = document.createElement("button");
    btn.className =
      `px-3 py-1 rounded-md bg-white/20 hover:${bgHover} text-xs sm:text-sm font-semibold transition`;
    btn.textContent = text;
    btn.addEventListener("click", onClick);
    return btn;
  };

  const detailBtn = createButton("Details", "bg-red-600", () => {
    window.location.href = `movie.html?id=${movie.id}`;
  });

  const watchBtn = createButton("Watch", "bg-green-600", () => {
    window.location.href = `watch.html?id=${movie.id}`;
  });

  const favBtn = createButton("Fav", "bg-yellow-500", () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let alreadyAdded = favorites.some(fav => fav.id === movie.id);

    if (!alreadyAdded) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("❤️ Added to favorites!");
    } else {
      alert("✅ Already in favorites!");
    }
  });

  btns.appendChild(detailBtn);
  btns.appendChild(watchBtn);
  btns.appendChild(favBtn);

  overlay.appendChild(btns);
  card.appendChild(overlay);

  return card;
}


// Load Section
async function loadSection(containerId, endpoint) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
    const data = await res.json();
    data.results.slice(0, 20).forEach(movie => {
      container.appendChild(makeMovieCard(movie));
    });
  } catch (err) {
    console.error("Error loading", endpoint, err);
  }
}

// Search Movies
async function searchMovies(query) {
  if (!query) {
    searchSection.classList.add("hidden");
    homepageSections.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
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

    const groups = { en: [], hi: [], ur: [], ja: [], other: [] };
    data.results.forEach(movie => {
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
      other: "🎬 Other Languages"
    };

    for (const lang in groups) {
      if (groups[lang].length > 0) {
        const title = document.createElement("h3");
        title.textContent = langLabels[lang];
        title.className = "text-xl font-bold text-pink-400 mb-2";
        searchResults.appendChild(title);

        const container = document.createElement("div");
        container.className =
          "flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory";

        groups[lang].forEach(movie => {
          container.appendChild(makeMovieCard(movie));
        });

        searchResults.appendChild(container);
      }
    }
  } catch (err) {
    console.error("Search error", err);
  }
}

// Theme
function applySavedTheme() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }
}
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Event Listeners
searchInputs.forEach(input => {
  input?.addEventListener("input", e => {
    searchMovies(e.target.value.trim());
  });
});
document.getElementById("genre-select")?.addEventListener("change", e => {
  const selectedGenre = e.target.value;
  document.querySelectorAll("[data-genres]").forEach(card => {
    const genres = card.getAttribute("data-genres")?.split(",") || [];
    card.style.display =
      selectedGenre === "all" || genres.includes(selectedGenre)
        ? "block"
        : "none";
  });
});
document.getElementById("menu-toggle")?.addEventListener("click", () => {
  document.getElementById("dropdown-menu").classList.toggle("hidden");
});
document.getElementById("mode-toggle")?.addEventListener("click", toggleTheme);

// Init
window.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  renderGenreDropdown();
  loadSection("trending-container", "/trending/movie/week");
  loadSection("popular-container", "/movie/popular");
  loadSection("toprated-container", "/movie/top_rated");
  loadSection("newest-container", "/movie/now_playing");
  loadSection("upcoming-container", "/movie/upcoming");
});
