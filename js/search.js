    function searchButtons() {
        // Get the search query from the input field
        var query = document.getElementById("searchInput").value.toLowerCase();

        // Get all the buttons on the page
        var buttons = document.getElementsByTagName("button");

        // Loop through the buttons and check if their text contains the search query
        for (var i = 0; i < buttons.length; i++) {
            var buttonText = buttons[i].textContent.toLowerCase();
            if (buttonText.includes(query)) {
                buttons[i].style.display = "flex"; // Show the button
            } else {
                buttons[i].style.display = "none"; // Hide the button
            }
        }
    }