// Global loader script - loads appropriate CSS and JS files based on page type
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a game page
  if (window.location.pathname.includes("/g/")) {
    loadCSS("game-ui.css")
    loadScript("game-ui.js")
  }
})

// Function to load CSS files
function loadCSS(filename) {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = `/css/${filename}`
  document.head.appendChild(link)
}

// Function to load JavaScript files
function loadScript(filename) {
  const script = document.createElement("script")
  script.src = `/js/${filename}`
  document.body.appendChild(script)
}
