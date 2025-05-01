// ===== FAVORITES FUNCTIONALITY =====
function getFavorites() {
  const favorites = localStorage.getItem("favoriteGames");
  return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favoriteGames", JSON.stringify(favorites));
}

function toggleFavorite(event) {
  event.stopPropagation();
  event.preventDefault();

  const starIcon = event.target;
  const gameButton = starIcon.closest(".button");
  const gameLink = gameButton.querySelector("a");
  
  if (!gameLink) return;
  
  const gamePath = gameLink.getAttribute("href");
  const gameTitle = gameLink.querySelector("span")?.textContent.trim() || '';
  const gameImage = gameLink.querySelector("img")?.getAttribute("src") || '';

  const favorites = getFavorites();
  const index = favorites.findIndex(game => game.path === gamePath);

  if (index === -1) {
    // Add to favorites
    favorites.push({
      path: gamePath,
      title: gameTitle,
      image: gameImage,
    });
    starIcon.classList.remove("far");
    starIcon.classList.add("fas");
    starIcon.style.color = "#FFD700";
  } else {
    // Remove from favorites
    favorites.splice(index, 1);
    starIcon.classList.remove("fas");
    starIcon.classList.add("far");
    starIcon.style.color = "#ffffff";
  }

  saveFavorites(favorites);
  updateFavoritesSection();
}

function updateFavoritesSection() {
  const favorites = getFavorites();
  const favoritesContainer = document.getElementById("favorites-container");

  // Clear current favorites
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    const message = document.createElement("div");
    message.className = "no-favorites-message";
    message.textContent = "Star your favorite games to see them here!";
    favoritesContainer.appendChild(message);
    document.getElementById("favorites-section").style.display = "none";
  } else {
    document.getElementById("favorites-section").style.display = "block";

    favorites.forEach((game) => {
      const button = document.createElement("button");
      button.className = "button";

      const link = document.createElement("a");
      link.href = game.path;
      link.style.textDecoration = "none";

      const img = document.createElement("img");
      img.src = game.image;
      img.alt = game.title;

      const span = document.createElement("span");
      span.innerHTML = `<br>${game.title}`;

      const starIcon = document.createElement("i");
      starIcon.className = "fas fa-star favorite-star";
      starIcon.style.color = "#FFD700";
      starIcon.addEventListener("click", toggleFavorite);

      link.appendChild(img);
      link.appendChild(span);
      button.appendChild(link);
      button.appendChild(starIcon);

      favoritesContainer.appendChild(button);
    });

    // Add click handlers to favorite game buttons
    const favoriteGameButtons = favoritesContainer.querySelectorAll(".button a");
    favoriteGameButtons.forEach((button) => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        openGame(this.getAttribute("href"));
      });
    });
  }
}

function addStarIconsToGames() {
  const gameButtons = document.querySelectorAll(".button-container .button, .regular-games .button");
  
  gameButtons.forEach(button => {
    if (button.querySelector(".favorite-star")) return;
    
    const gameLink = button.querySelector("a");
    if (gameLink) {
      const starIcon = document.createElement("i");
      starIcon.className = "far fa-star favorite-star";
      starIcon.style.position = "absolute";
      starIcon.style.top = "5px";
      starIcon.style.right = "5px";
      starIcon.style.cursor = "pointer";
      starIcon.style.zIndex = "10";
      starIcon.style.color = "#ffffff";
      starIcon.style.transition = "all 0.3s ease";
      
      starIcon.addEventListener("click", toggleFavorite);
      
      button.style.position = "relative";
      button.appendChild(starIcon);
      
      // Initialize star state
      const favorites = getFavorites();
      const gamePath = gameLink.getAttribute("href");
      if (favorites.some(game => game.path === gamePath)) {
        starIcon.classList.remove("far");
        starIcon.classList.add("fas");
        starIcon.style.color = "#FFD700";
      }
    }
  });
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize game buttons
  const gameButtons = document.querySelectorAll(".button a");
  gameButtons.forEach((button) => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      openGame(this.getAttribute("href"));
    });
  });

  // Add star icons to all games
  addStarIconsToGames();
  
  // Initialize favorites section
  updateFavoritesSection();

  // Modal click handling
  document.querySelector(".game-modal").addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
