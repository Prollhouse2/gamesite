// Default settings (can be customized in the settings page)
let autoclickerInterval = 10; // Auto-click interval in milliseconds
let autoclickerKeybind = '[';   // Default key to start/stop auto-clicking
let autoclickerActive = false; // Tracks whether the auto-clicker is active
let autoclicker;               // Interval reference for the auto-clicker
let mouseX = 0;                // Mouse X position
let mouseY = 0;                // Mouse Y position

// Load settings from localStorage if available
if (localStorage.getItem('autoclickerInterval')) {
    autoclickerInterval = parseInt(localStorage.getItem('autoclickerInterval'));
}
if (localStorage.getItem('autoClickerKeybind')) {
    autoclickerKeybind = localStorage.getItem('autoClickerKeybind');
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
    if (event.key === autoclickerKeybind) {
        if (autoclickerActive) {
            clearInterval(autoclicker);
            autoclickerActive = false;
            console.log("Auto-clicking stopped.");
        } else {
            autoclicker = setInterval(autoClick, autoclickerInterval);
            autoclickerActive = true;
            console.log("Auto-clicking started.");
        }
    }
});

// Utility to update auto-clicker settings
function updateAutoclickerSettings(interval, keybind) {
    if (interval >= 1) {
        autoclickerInterval = interval;
        localStorage.setItem('autoclickerInterval', interval);
    }
    if (keybind.length === 1) {
        autoclickerKeybind = keybind;
        localStorage.setItem('autoclickerKeybind', keybind);
    }
    console.log("Auto-clicker settings updated:", { autoclickerInterval, autoclickerKeybind });
}
