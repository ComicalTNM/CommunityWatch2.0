document.addEventListener("DOMContentLoaded", function () {
    const filterToggle = document.getElementById("toggle-filters");
    const filters = document.getElementById("filters");
    const searchBar = document.getElementById("search-bar");
    const carouselInner = document.getElementById("carousel-inner");
    const resultsContainer = document.querySelector(".results-container");
    const filterLabels = document.querySelectorAll(".filters label");

    const clearFiltersButton = document.getElementById("clear-filters");
clearFiltersButton.addEventListener("click", function () {
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => {
        checkbox.checked = false;
    });
});

    
    document.addEventListener("DOMContentLoaded", function () {
        const iframe = document.getElementById("resultsFrame");

        iframe.onload = function () {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Find the existing CSS link tag (assuming it's in a folder like /css/styles.css)
            const existingCSS = iframeDoc.querySelector("link[rel='stylesheet']");

            if (existingCSS) {
                // Override with the new Searchpage.css file
                existingCSS.href = "css/Searchpage.css";
            } 
        };
    });

    filterToggle.addEventListener("click", function () {
        filters.style.display = filters.style.display === "none" || filters.style.display === "" ? "flex" : "none";
    });

    filterLabels.forEach(label => {
        label.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });

    searchBar.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            resultsContainer.style.display = "flex";
            carouselInner.style.transform = "translateX(-30%)";
            setTimeout(() => {
                carouselInner.style.transform = "translateX(0)";
            }, 2000);
        }
    });
});
