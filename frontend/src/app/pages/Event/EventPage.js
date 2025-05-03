document.addEventListener('DOMContentLoaded', function() {
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