document.addEventListener('DOMContentLoaded', async function() {
    console.log("EventPage.js: DOMContentLoaded"); 
    console.log("EventPage.js: URL:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    console.log("eventId from URL:", eventId);
    const volunteerButton = document.getElementById('volunteerButton');
    if(eventId)
    {
        fetchEventDetails(eventId);
        volunteerButton.href += eventId;
    }
    else{
        console.error("Event ID not found in the URL.");
        alert("Couldn't find the event to display!");
    }
    const userData = await fetchUserData();
    changeNavBar(userData.role);
});

async function fetchEventDetails(eventId)
{
    const backendURL = 'http://localhost:5000';
    try {
        const response = await fetch(`${backendURL}/api/posts/${eventId}`);
        if(!response.ok)
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const eventData = await response.json();
        displayEventDetails(eventData);
    }
    catch(error)
    {
        console.error("Error fetching event details:", error);
        alert("Couldn't fetch event details!");
    }
}

//Fetch user data
async function fetchUserData() {
    const backendURL = 'http://localhost:5000';
    const userId = sessionStorage.getItem("userId");
    const response = await fetch(`${backendURL}/api/users/${userId}`);
    const userData = await response.json();
    return userData; //This should include registeredEvents, completedEvents, and interests
}

function displayEventDetails(event)
{
    document.querySelector(".title-ex").innerText = event.title || "No Title Provided";
    document.querySelector(".organization-ex").innerText = event.organization?.name || "No Organization Provided";
    document.querySelector(".description-ex").innerText = event.description || "No Description Provided";
    document.querySelector(".date-ex").innerText = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "No Date Provided";

    let goalsText = "Goals: ";

    if(event.volunteersNeeded)
    {
        goalsText += `\nVolunteers Needed: ${event.volunteersNeeded}`;
    }
    if(event.itemsNeeded && event.itemsNeeded.length > 0)
    {
        goalsText += "\nItems Needed:";
        event.itemsNeeded.forEach(item => {
            goalsText += `\n- ${item.item}: ${item.quantity}`;
        });
    }
    if(goalsText === "Goals: ")
    {
        goalsText += "No goals provided";
    }
    
    document.querySelector(".goals").innerText = goalsText;
    document.querySelector(".location").innerText = `Location: ${event.location || "No Location Provided"}`;
}
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