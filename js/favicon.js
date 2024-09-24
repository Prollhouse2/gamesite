document.addEventListener('DOMContentLoaded', () => {
    // Load saved favicon and title from localStorage
    const savedFavicon = localStorage.getItem('selectedFavicon');
    const savedTitle = localStorage.getItem('selectedTitle');

    // Set the favicon and title if they exist in localStorage
    if (savedFavicon) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.rel = 'icon';
        link.href = savedFavicon;
        document.head.appendChild(link);
    }

    if (savedTitle) {
        document.title = savedTitle;
    }

    // Show the modal when the button is clicked
    document.getElementById('openFaviconUI').addEventListener('click', () => {
        document.getElementById('faviconModal').style.display = 'block';
    });

    // Close the modal
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('faviconModal').style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('faviconModal')) {
            document.getElementById('faviconModal').style.display = 'none';
        }
    });

    const faviconOptions = document.querySelectorAll('.favicon-option');

    faviconOptions.forEach(option => {
        // Check if this option was previously selected and highlight it
        if (option.dataset.favicon === savedFavicon) {
            option.style.border = '2px solid #555'; // Highlight selected
        }

        // Add click event listener for each option
        option.addEventListener('click', function() {
            // Clear previously selected favicon option
            faviconOptions.forEach(opt => opt.style.border = '2px solid transparent');
            this.style.border = '2px solid #555'; // Highlight selected

            // Save the selected favicon and title to localStorage
            const selectedFavicon = this.dataset.favicon;
            const selectedTitle = this.dataset.title;
            localStorage.setItem('selectedFavicon', selectedFavicon);
            localStorage.setItem('selectedTitle', selectedTitle);
        });
    });

    document.getElementById('setFavicon').addEventListener('click', () => {
        const currentSelectedFavicon = localStorage.getItem('selectedFavicon');
        const currentSelectedTitle = localStorage.getItem('selectedTitle');

        // Update the favicon if a selection was made
        if (currentSelectedFavicon) {
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.rel = 'icon';
            link.href = currentSelectedFavicon;
            document.head.appendChild(link);
        }

        // Update the title if a selection was made
        if (currentSelectedTitle) {
            document.title = currentSelectedTitle;
        }

        // Close the modal
        document.getElementById('faviconModal').style.display = 'none';
    });
});
