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
 particlesJS('snow', {
            particles: {
                number: {
                    value: 150,
                    density: { enable: true, value_area: 800 }
                },
                color: { value: "#ffffff" },
                shape: {
                    type: "circle",
                    stroke: { width: 0, color: "#000000" }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: { enable: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: false }
                },
                line_linked: { enable: false },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "bottom",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true },
                    onclick: { enable: false },
                    resize: true
                }
            },
            retina_detect: true
        });
