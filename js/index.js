// ===== GAME MODAL FUNCTIONALITY =====
function openGame(gameFile, downloadFile) {
  document.getElementById("game-iframe").src = gameFile;
  document.getElementById("game-modal").style.display = "block";
  document.getElementById("modal-overlay").style.display = "block";

  if (downloadFile) {
    document.getElementById("download-button").setAttribute("href", downloadFile);
    document.getElementById("download-button").setAttribute("download", downloadFile);
    document.getElementById("download-button").style.display = "inline-flex";
  } else {
    document.getElementById("download-button").style.display = "none";
  }
  document.querySelector("footer").style.position = "relative";
  document.querySelector("footer").style.zIndex = "1000";
}

function closeGame() {
  document.getElementById("game-modal").style.display = "none";
  document.getElementById("modal-overlay").style.display = "none";
  document.getElementById("game-iframe").src = "";
}

function openGameInNewTab() {
  const gameFile = document.getElementById("game-iframe").src;
  if (gameFile) window.open(gameFile, "_blank");
}

function toggleFullScreen() {
  const iframe = document.getElementById("game-iframe");
  if (iframe.requestFullscreen) iframe.requestFullscreen();
  else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
  else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
  else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
}

// ===== FAVORITES FUNCTIONALITY =====
function getFavorites() {
  return JSON.parse(localStorage.getItem("favoriteGames")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favoriteGames", JSON.stringify(favorites));
}

function toggleFavorite(event) {
  event.stopPropagation();
  event.preventDefault();

  const star = event.target.closest(".favorite-star");
  const button = star.closest(".button");
  const link = button.querySelector("a");
  const gamePath = link.getAttribute("href");
  const gameTitle = link.querySelector("span")?.textContent.trim() || "";
  const gameImg = link.querySelector("img")?.src || "";

  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.path === gamePath);

  if (existingIndex === -1) {
    favorites.push({ path: gamePath, title: gameTitle, image: gameImg });
    star.classList.replace("far", "fas");
    star.style.color = "gold";
  } else {
    favorites.splice(existingIndex, 1);
    star.classList.replace("fas", "far");
    star.style.color = "#ccc";
  }

  saveFavorites(favorites);
  updateFavoritesSection();
}

function updateFavoritesSection() {
  const favorites = getFavorites();
  const container = document.getElementById("favorites-container");
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = '<div class="no-favorites">Star games to add them here!</div>';
    document.getElementById("favorites-section").style.display = "none";
    return;
  }

  document.getElementById("favorites-section").style.display = "block";
  favorites.forEach(game => {
    const button = document.createElement("button");
    button.className = "button";
    button.innerHTML = `
      <div class="game-button-wrapper">
        <i class="fas fa-star favorite-star" style="color: gold"></i>
        <a href="${game.path}" style="text-decoration: none">
          <img src="${game.image}" alt="${game.title}">
          <span><br>${game.title}</span>
        </a>
      </div>
    `;
    button.querySelector(".favorite-star").addEventListener("click", toggleFavorite);
    button.querySelector("a").addEventListener("click", e => {
      e.preventDefault();
      openGame(game.path);
    });
    container.appendChild(button);
  });
}

function addStarsToAllButtons() {
  document.querySelectorAll(".button").forEach(button => {
    if (button.querySelector(".favorite-star")) return;
    
    const wrapper = document.createElement("div");
    wrapper.className = "game-button-wrapper";
    wrapper.innerHTML = button.innerHTML;
    
    const star = document.createElement("i");
    star.className = "far fa-star favorite-star";
    star.style.color = "#ccc";
    
    const favorites = getFavorites();
    const link = button.querySelector("a");
    if (link) {
      const gamePath = link.getAttribute("href");
      if (favorites.some(f => f.path === gamePath)) {
        star.className = "fas fa-star favorite-star";
        star.style.color = "gold";
      }
    }
    
    wrapper.prepend(star);
    button.innerHTML = "";
    button.appendChild(wrapper);
    
    star.addEventListener("click", toggleFavorite);
  });
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  // Game buttons
  document.querySelectorAll(".button a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      openGame(link.getAttribute("href"));
    });
  });

  // Add stars to all buttons
  addStarsToAllButtons();
  
  // Initialize favorites
  updateFavoritesSection();

  // Modal handling
  document.querySelector(".game-modal").addEventListener("click", e => e.stopPropagation());
});
