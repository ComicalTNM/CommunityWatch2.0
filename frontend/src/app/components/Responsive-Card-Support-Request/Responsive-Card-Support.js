const BACKEND_URL = "http://localhost:5000";

document.addEventListener('DOMContentLoaded', function() {
    console.log("Responsive-Card-Support.js loaded. URL:", window.location.href, "Search:", window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdFromUrl = urlParams.get('eventId');

    // Find all 'see-more' p tags and attach the onclick listener
    const seeMoreElements = document.getElementById("see-more");
    seeMoreElements.onclick = function() {
        console.log("Redirecting with eventId:", eventIdFromUrl);
        redirect(eventIdFromUrl); // Pass the extracted eventId
    };
});

//Function to redirect to the event page
function redirect(eventId)
{
    if(eventId)
    {
        window.top.location.href = `../../pages/Event/EventPage?eventId=${eventId}`;
    }
    else {
        console.error("Event ID not found to redirect.");
        alert("Couldn't get the event information!");
    }
}

function collapseCard(button) {
    let expandedCard = button.closest('.expanded-card');
    let originalCard = document.querySelector('.card');
    
    if (originalCard) {
        expandedCard.style.display = 'none';
        originalCard.style.display = 'block';
    }
}

function openExpandable() {
    document.getElementById('expandableBox').style.display = 'flex';
}

// Function to close the expandable box
function closeExpandable() {
    document.getElementById('expandableBox').style.display = 'none';
}

// Add hover effects to cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Progress bar animation (can be dynamic)
const progressBars = document.querySelectorAll('.progress-bar');
progressBars.forEach(bar => {
    const progress = parseInt(bar.style.width);
    bar.style.transition = 'width 1s ease';
    setTimeout(() => {
        bar.style.width = progress + '%';
    }, 100);
});

const eventId = new URLSearchParams(window.location.search).get("eventId");

if (!eventId) {
    console.warn("No event ID found in URL. Skipping card load.");
} else {
    fetchEventDetails(eventId);
}

async function fetchEventDetails(id){
    try{
        const response = await fetch(`${BACKEND_URL}/api/posts/${id}`, {
            credentials: 'include'
        });
        const post = await response.json();
        updateEventCard(post); //Update the card with event details
    }
    catch(error){
        console.error("Failed to fetch event details:", error)
    }
}

function updateEventCard(event){
    //Use the event data to update the event card's content
    document.querySelector(".card-header h3").innerText = event.title || "No Title Provided";
    document.querySelector(".card-header h4").innerText = event.organization?.name || "No Organization Provided";
    document.querySelector(".card-header h5").innerText = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "No Date Provided";
    document.querySelector(".description").innerText = event.description || "No Description Provided";
    document.querySelector(".filter-box1").innerText = event.tags[0] || "No Filter";
    document.querySelector(".filter-box2").innerText = event.tags[1] || "No Filter";
    document.querySelector(".filter-box3").innerText = event.tags[2] || "No Filter";



    const progress = event.progress || 0;
    document.querySelector(".progress-bar").style.width = `${progress}%`;

    const card = document.querySelector('.card');
    card.dataset.eventType = event.eventType || "";


}