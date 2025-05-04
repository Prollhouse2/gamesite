
        document.addEventListener('DOMContentLoaded', function() {

            function navigateToPage(pageId) {

                document.querySelectorAll('.content-area').forEach(area => {
                    area.classList.remove('active');
                });

                const contentArea = document.getElementById(pageId + '-content');
                if (contentArea) {
                    contentArea.classList.add('active');
                }

                window.location.hash = pageId;

                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-page') === pageId) {
                        item.classList.add('active');
                    }
                });
            }

            function handleInitialLoad() {
                const hash = window.location.hash.substring(1) || 'home';
                navigateToPage(hash);
            }

            window.addEventListener('hashchange', function() {
                const hash = window.location.hash.substring(1) || 'home';
                navigateToPage(hash);
            });

            document.querySelectorAll('.nav-item').forEach(item => {
                const pageId = item.getAttribute('data-page');

                if (!item.hasAttribute('target')) {
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        navigateToPage(pageId);
                    });
                }
            });

            handleInitialLoad();
        });

        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.querySelector('.sidebar');
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            const sidebarMobileToggle = document.querySelector('.sidebar-mobile-toggle');
            const sidebarOverlay = document.querySelector('.sidebar-overlay');

            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('expanded');
                });
            }

            if (sidebarMobileToggle) {
                sidebarMobileToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('expanded');
                });
            }

            if (sidebarOverlay) {
                sidebarOverlay.addEventListener('click', function() {
                    sidebar.classList.remove('expanded');
                });
            }
        });

        async function loadGames() {
            try {
                const response = await fetch('games.json');
                const data = await response.json();
                return data.games;
            } catch (error) {
                console.error('Error loading games:', error);
                return [];
            }
        }

        function getFavorites() {
            const favorites = localStorage.getItem("favoriteGames");
            return favorites ? JSON.parse(favorites) : [];
        }

        function saveFavorites(favorites) {
            localStorage.setItem("favoriteGames", JSON.stringify(favorites));
        }

        function toggleFavorite(event) {
            event.stopPropagation();
            event.preventDefault();

            const gameCard = event.target.closest(".game-card");
            const gameLink = gameCard.querySelector("a");
            const gamePath = gameLink.getAttribute("href");
            const gameTitle = gameLink.querySelector(".game-card-title").textContent;
            const gameImage = gameLink.querySelector(".game-card-image").getAttribute("src");

            const favorites = getFavorites();

            const index = favorites.findIndex((game) => game.path === gamePath);

            if (index === -1) {

                favorites.push({
                    path: gamePath,
                    title: gameTitle,
                    image: gameImage
                });
                event.target.classList.remove("far");
                event.target.classList.add("fas");
                event.target.classList.add("active");
                event.target.classList.add("star-animation");
                setTimeout(() => {
                    event.target.classList.remove("star-animation");
                }, 500);
            } else {

                favorites.splice(index, 1);
                event.target.classList.remove("fas", "active");
                event.target.classList.add("far");
            }

            saveFavorites(favorites);
            updateFavoritesSection();
        }

        function updateFavoritesSection() {
            const favorites = getFavorites();
            const favoritesContainer = document.getElementById("favorites-container");
            const favoritesSection = document.getElementById("favorites-section");
            const favoritesHeading = document.getElementById("favorites-heading");

            favoritesContainer.innerHTML = "";

            if (favorites.length === 0) {
                const message = document.createElement("div");
                message.className = "no-favorites-message";
                message.textContent = "Star your favorite games to see them here!";
                favoritesContainer.appendChild(message);
            } else {

                favorites.forEach((game) => {
                    const gameCard = document.createElement("div");
                    gameCard.className = "game-card";

                    gameCard.innerHTML = `
                        <a href="${game.path}" target="_blank" style="text-decoration: none; color: inherit;">
                            <img src="${game.image}" alt="${game.title}" class="game-card-image">
                            <div class="game-card-title">${game.title}</div>
                        </a>
                        <i class="fas fa-star favorite-star active"></i>
                    `;

                    const starIcon = gameCard.querySelector(".favorite-star");
                    starIcon.addEventListener("click", toggleFavorite);

                    favoritesContainer.appendChild(gameCard);
                });
            }
        }

        async function searchGames() {
            const query = document.getElementById("searchInput").value.toLowerCase();
            const allGamesGrid = document.getElementById("all-games-grid");

            allGamesGrid.innerHTML = "";

            const allGames = await loadGames();

            const filteredGames = allGames.filter(game => 
                game.title.toLowerCase().includes(query) || 
                game.category.toLowerCase().includes(query)
            );

            renderGames(filteredGames, allGamesGrid);
        }

        function renderGames(games, container) {
            const favorites = getFavorites();

            games.forEach(game => {
                const isFavorite = favorites.some(fav => fav.path === game.path);

                const gameCard = document.createElement("div");
                gameCard.className = "game-card";

                gameCard.innerHTML = `
                    <a href="${game.path}" target="_blank" style="text-decoration: none; color: inherit;">
                        <img src="${game.image}" alt="${game.title}" class="game-card-image">
                        <div class="game-card-title">${game.title}</div>
                    </a>
                    <i class="${isFavorite ? 'fas' : 'far'} fa-star favorite-star ${isFavorite ? 'active' : ''}"></i>
                `;

                const starIcon = gameCard.querySelector(".favorite-star");
                starIcon.addEventListener("click", toggleFavorite);

                container.appendChild(gameCard);
            });
        }

        function displayTotalTimeSpent() {
            const totalKey = "totalTimeSpent";
            let totalTimeSpent = Number.parseInt(localStorage.getItem(totalKey)) || 0;

            function updateDisplay() {
                const totalDays = Math.floor(totalTimeSpent / 86400);
                const totalHours = Math.floor((totalTimeSpent % 86400) / 3600);
                const totalMinutes = Math.floor((totalTimeSpent % 3600) / 60);
                const totalSeconds = totalTimeSpent % 60;

                const message = `${totalDays} days, ${totalHours} hours, ${totalMinutes} minutes, and ${totalSeconds} seconds.`;
                document.getElementById("timeSpent").innerHTML = message;
            }

            updateDisplay();

            setInterval(() => {
                totalTimeSpent++;
                localStorage.setItem(totalKey, totalTimeSpent);
                updateDisplay();
            }, 1000);
        }

        document.addEventListener("DOMContentLoaded", async () => {

            displayTotalTimeSpent();

            document.getElementById("current-year").textContent = new Date().getFullYear();

            if (typeof particlesJS !== "undefined") {
                particlesJS("snow", {
                    particles: {
                        number: {
                            value: 150,
                            density: { enable: true, value_area: 800 },
                        },
                        color: { value: "#ffffff" },
                        shape: {
                            type: "circle",
                            stroke: { width: 0, color: "#000000" },
                        },
                        opacity: {
                            value: 0.5,
                            random: false,
                            anim: { enable: false },
                        },
                        size: {
                            value: 3,
                            random: true,
                            anim: { enable: false },
                        },
                        line_linked: { enable: false },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: "bottom",
                            random: false,
                            straight: false,
                            out_mode: "out",
                            bounce: false,
                        },
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: { enable: true },
                            onclick: { enable: false },
                            resize: true,
                        },
                    },
                    retina_detect: true,
                });
            }

            const allGames = await loadGames();

            const popularGamesGrid = document.getElementById("popular-games-grid");
            renderGames(allGames.slice(0, 8), popularGamesGrid);

            const allGamesGrid = document.getElementById("all-games-grid");
            renderGames(allGames, allGamesGrid);

            updateFavoritesSection();

            function updateTime() {
                const timeElement = document.getElementById("time");
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const seconds = now.getSeconds().toString().padStart(2, '0');
                timeElement.textContent = `${hours}:${minutes}:${seconds}`;
            }

            updateTime();
            setInterval(updateTime, 1000);
        });
