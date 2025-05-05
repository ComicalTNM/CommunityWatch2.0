document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById('toggle-filters');
    const filtersBox = document.getElementById('filters-box');
    const clearBtn = document.getElementById('clear-filters');
    const searchButton = document.getElementById("search-button");
    const searchBar = document.querySelector(".search-bar");
    const carouselInner = document.getElementById("carousel-inner");
    const resultsContainer = document.getElementById("results-container");
    const filterLabels = document.querySelectorAll(".filters label");
    const backendURL = "http://localhost:5000";
    const userId = sessionStorage.getItem("userId");
    

    toggleBtn.addEventListener('click', () => {
        filtersBox.classList.toggle('hidden');
      });
    
      clearBtn.addEventListener('click', () => {
        document.querySelectorAll('.filters input[type="checkbox"]').forEach(cb => cb.checked = false);
      });


    async function fetchUserData()
    {
        try{
            const response = await fetch(`${backendURL}/api/users/${userId}`);
            if(!response.ok)
            {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const userData = await response.json();
            return userData;
        }
        catch(error)
        {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    // Listen for search input
    searchButton.addEventListener("click", updateResults);

    // Listen for checkbox changes
    document.querySelectorAll(".filters input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", updateResults);
    });

    async function updateResults() {
        const userData = await fetchUserData();
        changeNavBar(userData.role);
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
        resultsContainer.style.display = "block";

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
                <a href="../Organization/OrgHomePage?orgId=${org._id}">Visit Homepage</a>
            `;
            resultsContainer.appendChild(orgCard);
        });
    }

    // Initial load
    updateResults();

    filterLabels.forEach(label => {
        label.addEventListener("click", function () {
            this.classList.toggle("selected");
        });
    });
});

function changeNavBar(userRole)
{
        const nav = document.querySelector('.topnav');
        nav.innerHTML = '';

        //Create the base nav
        let logo = document.createElement('img');
        logo.src = "../../components/NavBar/imgs/New_CommunityWatch_Logo.png";
        logo.alt = "Community Watch Logo";
        logo.classList.add('logo');
        nav.appendChild(logo);

        if(userRole === "admin")
        {
            let dashboardLink = createNavLink("../Organization/AdminstrationPage/AdminView.html", "Home");
            let organizationLink = createNavLink("../UserPage/MyOrganizations.html", "My Organizations");
            let profileLink = createNavLink("../../pages/ProfilePage/UserProfile.html", "Profile");
            let volunteerLink = createNavLink("../HomePage/homepage.html", "Volunteer");
            let searchLink = createNavLink("../../pages/SearchPage/SearchPage.html", "Search");
            nav.appendChild(dashboardLink);
            nav.appendChild(organizationLink);
            nav.appendChild(profileLink);
            nav.appendChild(volunteerLink);
            nav.appendChild(searchLink);
        }
        else if(userRole === "member")
        {
            let homeLink = createNavLink("../Organization/MemberPage/MemberView.html", "Home");
            let organizationLink = createNavLink("../UserPage/MyOrganizations.html", "My Organizations");
            let profileLink = createNavLink("../../pages/ProfilePage/UserProfile.html", "Profile");
            let volunteerLink = createNavLink("../HomePage/homepage.html", "Volunteer");
            let searchLink = createNavLink("../../pages/SearchPage/SearchPage.html", "Search");
            nav.appendChild(homeLink);
            nav.appendChild(organizationLink);
            nav.appendChild(profileLink);
            nav.appendChild(volunteerLink);
            nav.appendChild(searchLink);
        }
        else{
            let homeLink = createNavLink("../../pages/HomePage/homepage.html", "Home");
            let searchLink = createNavLink("../../pages/SearchPage/SearchPage.html", "Search");
            let organizationLink = createNavLink("../../pages/UserPage/MyOrganizations.html", "My Organizations");
            let profileLink = createNavLink("../../pages/ProfilePage/UserProfile.html", "Profile");
            nav.appendChild(homeLink);
            nav.appendChild(searchLink);
            nav.appendChild(organizationLink);
            nav.appendChild(profileLink);
        }
}
function createNavLink(href, text)
{
        let link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        return link;
}






