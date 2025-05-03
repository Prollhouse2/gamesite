// This file contains the sidebar functionality that will be loaded on every page

document.addEventListener('DOMContentLoaded', function() {
    // Create the sidebar structure if it doesn't exist
    if (!document.querySelector('.sidebar')) {
        createSidebar();
    }
    
    initializeSidebar();
});

// Function to create the sidebar HTML structure
function createSidebar() {
    const sidebarHTML = `
        <nav class="sidebar">
            <div class="sidebar-logo">
                <i class="fas fa-gamepad"></i>
            </div>
            <div class="sidebar-toggle">
                <i class="fas fa-chevron-right"></i>
            </div>
            <div class="sidebar-nav">
                <a href="/index.html" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-home"></i></div>
                    <div class="nav-text">Home</div>
                </a>
                <a href="/g" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-gamepad"></i></div>
                    <div class="nav-text">Games</div>
                </a>
                <a href="/static" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-globe"></i></div>
                    <div class="nav-text">Web Browser</div>
                </a>
                <a href="https://tinyurl.com/45j4r62u" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-plus"></i></div>
                    <div class="nav-text">Request Games</div>
                </a>
            </div>
            <div class="sidebar-divider"></div>
            <div class="sidebar-nav">
                <a href="/settings" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-cog"></i></div>
                    <div class="nav-text">Settings</div>
                </a>
                <a href="/leaderboard" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-trophy"></i></div>
                    <div class="nav-text">Leaderboard</div>
                </a>
                <a href="https://discord.gg/proll" class="nav-item">
                    <div class="nav-icon"><i class="fab fa-discord"></i></div>
                    <div class="nav-text">Discord</div>
                </a>
                <a href="/chat" class="nav-item">
                    <div class="nav-icon"><i class="fas fa-comments"></i></div>
                    <div class="nav-text">Chatroom</div>
                </a>
            </div>
            <div class="sidebar-divider"></div>
            <div class="sidebar-nav">
                <a href="https://github.com/Prollhouse2/gamesite" class="nav-item">
                    <div class="nav-icon"><i class="fab fa-github"></i></div>
                    <div class="nav-text">Source Code</div>
                </a>
            </div>
        </nav>

        <!-- Mobile Sidebar Toggle -->
        <div class="sidebar-mobile-toggle">
            <i class="fas fa-bars"></i>
        </div>

        <!-- Sidebar Overlay (for mobile) -->
        <div class="sidebar-overlay"></div>
    `;
    
    // Insert the sidebar at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    
    // Adjust the main content to make room for the sidebar
    const mainContent = document.createElement('div');
    mainContent.className = 'main-container';
    
    // Move all body children (except the sidebar elements) into the main container
    const sidebarElements = document.querySelectorAll('.sidebar, .sidebar-mobile-toggle, .sidebar-overlay');
    Array.from(document.body.children).forEach(child => {
        if (!Array.from(sidebarElements).includes(child)) {
            mainContent.appendChild(child);
        }
    });
    
    // Append the main container to the body
    document.body.appendChild(mainContent);
}

// Function to initialize sidebar functionality
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarMobileToggle = document.querySelector('.sidebar-mobile-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    // Toggle sidebar on button click
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
        });
    }
    
    // Mobile toggle
    if (sidebarMobileToggle) {
        sidebarMobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
        });
    }
    
    // Close sidebar when clicking overlay (mobile)
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('expanded');
        });
    }
    
    // Highlight active nav item
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        // Remove domain part if it exists
        const cleanItemPath = itemPath.replace(/^https?:\/\/[^\/]+/, '');
        
        if (currentPath.includes(cleanItemPath) && cleanItemPath !== '/index.html' && cleanItemPath !== '/') {
            item.classList.add('active');
        } else if ((currentPath === '/' || currentPath === '/index.html') && 
                  (cleanItemPath === '/index.html' || cleanItemPath === '/')) {
            item.classList.add('active');
        }
    });
}
