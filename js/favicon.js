document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('faviconModal');
    const openFaviconButton = document.getElementById('openFaviconUI');
    const closeModalButton = document.getElementById('closeModal');

    // Open modal when the button is clicked (only on homepage)
    if (openFaviconButton) {
        openFaviconButton.addEventListener('click', function () {
            modal.style.display = 'block';
        });
    }

    // Close modal when the close button is clicked
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

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

    // If on the homepage, enable favicon selection
    if (window.location.pathname === '/') {
        const faviconOptions = document.querySelectorAll('.favicon-option');

        faviconOptions.forEach(option => {
            // Highlight previously selected option
            if (option.dataset.favicon === savedFavicon) {
                option.style.border = '2px solid #555'; // Highlight selected
            }

            // Add click event listener for each option
            option.addEventListener('click', function () {
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
            modal.style.display = 'none';

            // Optional: Provide feedback
            alert('Favicon and title updated successfully!');
        });
    }
});
