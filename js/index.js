// Game modal functionality
function openGame(gameFile, downloadFile) {
  document.getElementById("game-iframe").src = gameFile
  document.getElementById("game-modal").style.display = "block"

  // Set download attributes if provided
  if (downloadFile) {
    document.getElementById("download-button").setAttribute("href", downloadFile)
    document.getElementById("download-button").setAttribute("download", downloadFile)
  } else {
    document.getElementById("download-button").style.display = "none"
  }
}

function closeGame() {
  document.getElementById("game-modal").style.display = "none"
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
})
