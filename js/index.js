// Game modal functionality
function openGame(gameFile, downloadFile) {
  document.getElementById("game-iframe").src = gameFile
  document.getElementById("game-modal").style.display = "block"
  document.getElementById("modal-overlay").style.display = "block"

  // Set download attributes if provided
  if (downloadFile) {
    document.getElementById("download-button").setAttribute("href", downloadFile)
    document.getElementById("download-button").setAttribute("download", downloadFile)
    document.getElementById("download-button").style.display = "inline-flex"
  } else {
    document.getElementById("download-button").style.display = "none"
  }

  // Make sure footer stays visible
  document.querySelector("footer").style.position = "relative"
  document.querySelector("footer").style.zIndex = "1000"
}

function closeGame() {
  document.getElementById("game-modal").style.display = "none"
  document.getElementById("modal-overlay").style.display = "none"
  document.getElementById("game-iframe").src = ""
}

function openGameInNewTab() {
  const gameFile = document.getElementById("game-iframe").src
  if (gameFile) {
    window.open(gameFile, "_blank")
  }
}

function toggleFullScreen() {
  const iframe = document.getElementById("game-iframe")
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen()
  } else if (iframe.mozRequestFullScreen) {
    iframe.mozRequestFullScreen()
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen()
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen()
  }
}

// Initialize game buttons when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Get all game buttons
  const gameButtons = document.querySelectorAll(".button a")

  // Add click event listeners to each button
  gameButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault() // Prevent default link behavior
      const gamePath = this.getAttribute("href")
      openGame(gamePath)
    })
  })

  // Make sure the modal doesn't affect the footer
  document.querySelector(".game-modal").addEventListener("click", (e) => {
    e.stopPropagation() // Prevent clicks from affecting elements behind the modal
  })
})
// ===== FAVORITES FUNCTIONALITY =====
// Get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem("favoriteGames")
  return favorites ? JSON.parse(favorites) : []
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem("favoriteGames", JSON.stringify(favorites))
}

// Toggle favorite status for a game
function toggleFavorite(event) {
  event.stopPropagation()

  const gameButton = event.target.closest(".button")
  const gameLink = gameButton.querySelector("a")
  const gamePath = gameLink.getAttribute("href")
  const gameTitle = gameLink.querySelector("span").textContent.trim()
  const gameImage = gameLink.querySelector("img").getAttribute("src")

  const favorites = getFavorites()

  // Check if game is already a favorite
  const index = favorites.findIndex((game) => game.path === gamePath)

  if (index === -1) {
    // Add to favorites
    favorites.push({
      path: gamePath,
      title: gameTitle,
      image: gameImage,
    })
    event.target.classList.remove("far")
    event.target.classList.add("fas")
    event.target.style.color = "#FFD700" // Gold color for active star
  } else {
    // Remove from favorites
    favorites.splice(index, 1)
    event.target.classList.remove("fas")
    event.target.classList.add("far")
    event.target.style.color = "#ffffff" // White color for inactive star
  }

  saveFavorites(favorites)
  updateFavoritesSection()
}

// Update the favorites section with current favorites
function updateFavoritesSection() {
  const favorites = getFavorites()
  const favoritesContainer = document.getElementById("favorites-container")

  // Clear current favorites
  favoritesContainer.innerHTML = ""

  // If no favorites, show a message
  if (favorites.length === 0) {
    const message = document.createElement("div")
    message.className = "no-favorites-message"
    message.textContent = "Star your favorite games to see them here!"
    favoritesContainer.appendChild(message)

    // Hide the favorites section if there are no favorites
    document.getElementById("favorites-section").style.display = "none"
  } else {
    // Show the favorites section
    document.getElementById("favorites-section").style.display = "block"

    // Add each favorite game
    favorites.forEach((game) => {
      const button = document.createElement("button")
      button.className = "button"

      const link = document.createElement("a")
      link.href = game.path
      link.style.textDecoration = "none"

      const img = document.createElement("img")
      img.src = game.image
      img.alt = game.title

      const span = document.createElement("span")
      span.innerHTML = `<br>${game.title}`

      const starIcon = document.createElement("i")
      starIcon.className = "fas fa-star favorite-star"
      starIcon.style.color = "#FFD700" // Gold color
      starIcon.addEventListener("click", toggleFavorite)

      link.appendChild(img)
      link.appendChild(span)
      button.appendChild(link)
      button.appendChild(starIcon)

      favoritesContainer.appendChild(button)
    })

    // Add event listeners to the newly created favorite game buttons
    const favoriteGameButtons = favoritesContainer.querySelectorAll(".button a")
    favoriteGameButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        const gamePath = this.getAttribute("href")
        openGame(gamePath)
      })
    })
  }
}
