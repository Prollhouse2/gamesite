document.addEventListener('DOMContentLoaded', function() {
    var accordionItems = document.querySelectorAll('.accordion .card');
    
    accordionItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var isActive = this.classList.contains('active');
            closeAllAccordionItems();
            
            if (!isActive) {
                this.classList.add('active');
            }
        });
    });
    
    function closeAllAccordionItems() {
        accordionItems.forEach(function(item) {
            item.classList.remove('active');
        });
    }
});
