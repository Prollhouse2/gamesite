// This file contains the game UI functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a game page (contains an iframe with game)
    const gameIframe = document.querySelector('iframe[src*="/g/"]');
    if (gameIframe) {
        createGameUI(gameIframe);
    }
});

// Function to create the game UI
function createGameUI(existingIframe) {
    // Get the game name from the URL or document title
    let gameName = document.title;
    const pathMatch = window.location.pathname.match(/\/g\/([^\/]+)/);
    if (pathMatch && pathMatch[1]) {
        // Convert URL format to readable name (e.g., "retro-bowl" to "Retro Bowl")
        gameName = pathMatch[1].split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    
    // Create title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'game-title-bar';
    
    // Add game title
    const gameTitle = document.createElement('div');
    gameTitle.className = 'game-title';
    gameTitle.textContent = gameName;
    titleBar.appendChild(gameTitle);
    
    // Add controls
    const controls = document.createElement('div');
    controls.className = 'game-controls';
    
    // Add fullscreen button
    const fullscreenBtn = document.createElement('div');
    fullscreenBtn.className = 'game-control-button fullscreen-toggle';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.title = 'Toggle Fullscreen';
    controls.appendChild(fullscreenBtn);
    
    titleBar.appendChild(controls);
    
    // Create new iframe if needed or use the existing one
    let gameIframe;
    if (existingIframe) {
        // Use existing iframe
        gameIframe = existingIframe;
        // Replace the iframe with our container
        existingIframe.parentNode.insertBefore(gameContainer, existingIframe);
        gameContainer.appendChild(gameIframe);
        gameIframe.className = 'game-iframe';
    } else {
        // Create new iframe
        gameIframe = document.createElement('iframe');
        gameIframe.className = 'game-iframe';
        gameIframe.src = window.location.pathname;
        gameIframe.setAttribute('allowfullscreen', '');
        gameIframe.setAttribute('allow', 'autoplay; fullscreen; camera; microphone; gamepad');
        gameContainer.appendChild(gameIframe);
    }
    
    // Add title bar after iframe
    gameContainer.appendChild(titleBar);
    
    // Add to document if we created a new iframe
    if (!existingIframe) {
        document.body.appendChild(gameContainer);
    }
    
    // Fullscreen toggle functionality
    fullscreenBtn.addEventListener('click', function() {
        toggleFullscreen(gameContainer, fullscreenBtn);
    });
    
    // Listen for escape key to exit fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && gameContainer.classList.contains('fullscreen')) {
            toggleFullscreen(gameContainer, fullscreenBtn);
        }
    });
}

// Function to toggle fullscreen
function toggleFullscreen(container, button) {
    container.classList.toggle('fullscreen');
    
    if (container.classList.contains('fullscreen')) {
        button.innerHTML = '<i class="fas fa-compress"></i>';
        button.title = 'Exit Fullscreen';
        
        // Try to request fullscreen on the container
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    } else {
        button.innerHTML = '<i class="fas fa-expand"></i>';
        button.title = 'Toggle Fullscreen';
        
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
