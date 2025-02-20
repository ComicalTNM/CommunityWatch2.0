//Updated Code
// Ensure Stripe is loaded
//const stripe = Stripe("your-publishable-key-here"); // Replace with your Stripe publishable key

let currentDate = new Date();

// Open Sidebar Function
function openSidebar(section) {
    var sidebar = document.getElementById("sidebar");
    var title = document.getElementById("sidebar-title");
    var content = document.getElementById("sidebar-content");
    var calendar = document.getElementById("calendar-container");
    var donations = document.getElementById("donations-container"); // Add this line to define `donations` container

    //Print statement
    console.log(document.getElementById("donateButton"));
    // Set the title and content dynamically
    title.textContent = section;
    content.textContent = "Content for " + section;

    // Remove previous background classes
    sidebar.classList.remove("roles", "metrics", "donations", "calendar");

    // Hide calendar by default
    calendar.style.display = "none";
    if (donations) {
        donations.style.display = "none"; // Ensure donations section is hidden
    }

    // Add the appropriate class based on the section
    if (section === "Roles") {
        sidebar.classList.add("roles");
    } else if (section === "Metrics") {
        sidebar.classList.add("metrics");
    } else if (section === "donations") {
        sidebar.classList.add("donations");
        if (donations) {
            donations.style.display = "block"; // Show donations UI
            content.innerHTML =
             `  <br>
                <p>Click below to proceed with donations.</p>
                <button id="donateButton">View Donations</button>
            `;
        }
    } else if (section === "Calendar") {
        sidebar.classList.add("calendar");
        calendar.style.display = "block"; // Show the calendar when "Calendar" is clicked
        generateCalendar(); // ✅ Ensure calendar is refreshed properly
    }

    // Show the sidebar
    sidebar.classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("active");
}

//Added code
document.addEventListener("DOMContentLoaded", function() {
    const donateButton = document.getElementById("donateButton");

    if (donateButton) {
        donateButton.addEventListener("click", function() {
            // Your event handler code here
        });
    } else {
        console.warn("donateButton element not found");
    }
});

document.getElementById("sidebar").addEventListener("click", function(event) {
    if (event.target && event.target.id === "donateButton") {
        // Handle the click event for the donate button
    }
});


// ✅ Attach Calendar Event Listeners Once
document.addEventListener("DOMContentLoaded", function () {
    console.log("Generating calendar...");
    
    // Ensure buttons exist before adding event listeners
    let prevBtn = document.getElementById("prevBtn");
    let nextBtn = document.getElementById("nextBtn");

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => changeMonth(-1));
        nextBtn.addEventListener("click", () => changeMonth(1));
    }

    generateCalendar(); // ✅ Load calendar on page load
});

// ✅ Generates Calendar
function generateCalendar() {
    console.log("generateCalendar() called..."); // Debugging message

    const monthYear = document.getElementById("monthYear");
    const datesContainer = document.getElementById("dates");

    if (!monthYear || !datesContainer) {
        console.error("Error: Calendar elements not found in the DOM.");
        return;
    }

    // Clear previous dates
    datesContainer.innerHTML = "";

    // Get month and year
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();

    // Update month-year display
    monthYear.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentDate);

    // Get first day and total days of the month
    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
        let emptyDiv = document.createElement("div");
        emptyDiv.classList.add("date", "empty");
        datesContainer.appendChild(emptyDiv);
    }

    // Fill actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        let dayDiv = document.createElement("div");
        dayDiv.classList.add("date");
        dayDiv.textContent = day;
        datesContainer.appendChild(dayDiv);
    }
}

// ✅ Change Month Function
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateCalendar();
}

document.addEventListener("DOMContentLoaded", function () {
    // Stripe redirect logic
    document.getElementById("payButton").addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:3000/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const session = await response.json();
            await stripe.redirectToCheckout({ sessionId: session.id });
        } catch (error) {
            console.error("Error:", error);
        }
    });
});