// timeTracker.js

// Function to load time from local storage or initialize it
function loadTimeSpent(key) {
    const timeSpent = localStorage.getItem(key);
    return timeSpent ? parseInt(timeSpent, 10) : 0;
}

// Function to save time to local storage
function saveTimeSpent(key, time) {
    localStorage.setItem(key, time);
}

// Function to track time spent on the page
function trackTimeSpent() {
    const totalKey = 'totalTimeSpent';
    let totalTimeSpent = loadTimeSpent(totalKey);
    const startTime = Date.now();

    // Update total time when the page is unloaded
    window.addEventListener('beforeunload', () => {
        const endTime = Date.now();
        const timeSpentOnCurrentPage = Math.floor((endTime - startTime) / 1000); // in seconds
        totalTimeSpent += timeSpentOnCurrentPage;
        saveTimeSpent(totalKey, totalTimeSpent);
    });
}

// Initialize tracking
trackTimeSpent();
