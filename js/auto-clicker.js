// Default settings (can be customized in the settings page)
let clickSpeed = 1000; // Click interval in milliseconds
let keybind = 'a';     // Default key to start/stop auto-clicking
let autoClickerActive = false;
let autoClicker;
let mouseX = 0;
let mouseY = 0;

// Update settings based on stored values if present
if (localStorage.getItem('clickSpeed')) {
    clickSpeed = parseInt(localStorage.getItem('clickSpeed'));
}
if (localStorage.getItem('keybind')) {
    keybind = localStorage.getItem('keybind');
}

// Track mouse position
document.addEventListener('mousemove', (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

// Function to perform a click at the cursor's position
function autoClick() {
    const elementAtCursor = document.elementFromPoint(mouseX, mouseY);
    if (elementAtCursor) {
        elementAtCursor.click();
    }
}

// Start or stop auto-clicking when the keybind is pressed
document.addEventListener('keydown', (event) => {
    if (event.key === keybind) {
        if (autoClickerActive) {
            clearInterval(autoClicker);
            autoClickerActive = false;
            console.log("Auto-clicking stopped.");
        } else {
            autoClicker = setInterval(autoClick, clickSpeed);
            autoClickerActive = true;
            console.log("Auto-clicking started.");
        }
    }
});
