document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById('toggle-filters');
    const filtersBox = document.getElementById('filters-box');
    const clearBtn = document.getElementById('clear-filters');
    const searchBar = document.getElementById("search-bar");
    const carouselInner = document.getElementById("carousel-inner");
    const resultsContainer = document.querySelector("results-container");
    const filterLabels = document.querySelectorAll(".filters label");
    const backendURL = "http://localhost:5000";
    

    toggleBtn.addEventListener('click', () => {
        filtersBox.classList.toggle('hidden');
      });
    
      clearBtn.addEventListener('click', () => {
        document.querySelectorAll('.filters input[type="checkbox"]').forEach(cb => cb.checked = false);
      });




    // Listen for search input
    searchBar.addEventListener("input", updateResults);

    // Listen for checkbox changes
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", updateResults);
    });

    async function updateResults() {
        const searchText = searchBar.value.trim();
        const selectedFilters = Array.from(document.querySelectorAll(".filters input[type='checkbox']:checked"))
                                    .map(checkbox => checkbox.value);

        try {
            const response = await fetch(`${backendURL}/api/organizations/search?query=${encodeURIComponent(searchText)}&filters=${selectedFilters.join(",")}`);
            const organizations = await response.json();
            displayResults(organizations);
        } catch (error) {
            console.error("Error fetching organizations:", error);
        }
    }

    function displayResults(filteredOrganizations) {
        resultsContainer.innerHTML = ""; // Clear previous results

        if (filteredOrganizations.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }

        filteredOrganizations.forEach(org => {
            const orgCard = document.createElement("div");
            orgCard.classList.add("organization-card");
            orgCard.innerHTML = `
                <img src="${org.bannerImage}" alt="${org.name}" class="org-banner">
                <h3>${org.name}</h3>
                <p>${org.description}</p>
                <a href="${org.website}" target="_blank">Visit Website</a>
            `;
            resultsContainer.appendChild(orgCard);
        });
    }

    // Initial load
    updateResults();

    
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

    filterLabels.forEach(label => {
        label.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });
});
