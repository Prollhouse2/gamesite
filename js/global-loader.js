// This file should be included in every page to load the sidebar and other global components

document.addEventListener('DOMContentLoaded', function() {
    // Load CSS files
    loadCSS('sidebar.css');
    
    // Check if we're on a game page
    if (window.location.pathname.includes('/g/')) {
        loadCSS('game-ui.css');
        loadScript('game-ui.js');
    }
    
    // Load sidebar script
    loadScript('sidebar.js');
});

// Function to load CSS files
function loadCSS(filename) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/css/${filename}`;
    document.head.appendChild(link);
}

// Function to load JavaScript files
function loadScript(filename) {
    const script = document.createElement('script');
    script.src = `/js/${filename}`;
    document.body.appendChild(script);
}
