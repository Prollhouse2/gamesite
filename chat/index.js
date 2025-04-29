document.addEventListener("DOMContentLoaded", () => {
  const fullscreenBtn = document.getElementById("fullscreen-btn")
  const discordContainer = document.querySelector(".discord-container")
  const icon = fullscreenBtn.querySelector("i")

  let isFullscreen = false

  fullscreenBtn.addEventListener("click", () => {
    isFullscreen = !isFullscreen

    if (isFullscreen) {
      discordContainer.classList.add("fullscreen")
      icon.classList.remove("fa-expand")
      icon.classList.add("fa-compress")
    } else {
      discordContainer.classList.remove("fullscreen")
      icon.classList.remove("fa-compress")
      icon.classList.add("fa-expand")
    }
  })
})
