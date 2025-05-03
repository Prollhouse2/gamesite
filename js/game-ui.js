// Game UI functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a game page (URL contains /g/)
  if (window.location.pathname.includes("/g/")) {
    setupGameUI()
  }
})

function setupGameUI() {
  // Get the game name from the URL
  let gameName = "Game"
  const pathMatch = window.location.pathname.match(/\/g\/([^/]+)/)
  if (pathMatch && pathMatch[1]) {
    // Convert URL format to readable name (e.g., "retro-bowl" to "Retro Bowl")
    gameName = pathMatch[1]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Add game-page class to body
  document.body.classList.add("game-page")

  // Clear any existing content
  document.body.innerHTML = ""

  // Create game UI structure
  const gameHTML = `
        <div class="game-title-bar">
            <div class="game-title">${gameName}</div>
            <div class="game-controls">
                <div class="game-control-button fullscreen-toggle" title="Toggle Fullscreen">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        </div>
        <div class="game-container">
            <iframe src="${window.location.pathname}" class="game-iframe" allowfullscreen allow="autoplay; fullscreen; camera; microphone; gamepad"></iframe>
        </div>
    `

  // Add the game UI to the body
  document.body.innerHTML = gameHTML

  // Setup fullscreen functionality
  const fullscreenBtn = document.querySelector(".fullscreen-toggle")
  fullscreenBtn.addEventListener("click", toggleFullscreen)

  // Listen for escape key to exit fullscreen
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("fullscreen-mode")) {
      toggleFullscreen()
    }
  })
}

function toggleFullscreen() {
  const body = document.body
  const fullscreenBtn = document.querySelector(".fullscreen-toggle")

  body.classList.toggle("fullscreen-mode")

  if (body.classList.contains("fullscreen-mode")) {
    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>'
    fullscreenBtn.title = "Exit Fullscreen"

    // Try to request fullscreen on the container
    const gameContainer = document.querySelector(".game-container")
    if (gameContainer.requestFullscreen) {
      gameContainer.requestFullscreen()
    } else if (gameContainer.mozRequestFullScreen) {
      gameContainer.mozRequestFullScreen()
    } else if (gameContainer.webkitRequestFullscreen) {
      gameContainer.webkitRequestFullscreen()
    } else if (gameContainer.msRequestFullscreen) {
      gameContainer.msRequestFullscreen()
    }
  } else {
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>'
    fullscreenBtn.title = "Toggle Fullscreen"

    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}
