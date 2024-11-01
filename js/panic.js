// panicButton.js
document.addEventListener('DOMContentLoaded', function () {
    // Load saved keybind and URL from localStorage
    const savedKeybind = localStorage.getItem('customKeybind') || '\\'; // Default to '\' if not set
    const savedUrl = localStorage.getItem('customUrl') || 'https://www.google.com'; // Default URL if not set

    // Function to redirect without allowing back navigation
    function changeUrlWithoutRedirect(url) {
        window.location.replace(url);
    }

    // Listen for keydown events to trigger the panic redirect
    document.addEventListener('keydown', function (event) {
        if (event.key === savedKeybind) {
            changeUrlWithoutRedirect(savedUrl);
        }
    });
});
