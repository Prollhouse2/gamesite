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
