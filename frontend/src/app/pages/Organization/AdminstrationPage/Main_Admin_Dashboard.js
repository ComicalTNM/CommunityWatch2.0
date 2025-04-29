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
    var donations = document.getElementById("donations-container");

    // Set the title and content dynamically
    title.textContent = section;
    content.textContent = "Content for " + section;

    // Remove previous background classes
    sidebar.classList.remove("roles", "metrics", "donations", "calendar");

    // Hide calendar by default
    calendar.style.display = "none";
    if (donations) {
        donations.style.display = "none";
    }

    // Add the appropriate class based on the section
    if (section === "Roles") {
        sidebar.classList.add("roles");
        content.innerHTML = `
        <p>Manage member access and permissions here.</p>
        <form id="roles-form">
            <input 
                type="text" 
                placeholder="Enter Member's full name" 
                name="fullName"
                required
                style="width: 100%; padding: 10px; margin: 10px 0; border-radius: 5px; border: 1px solid #ccc;"
            />
            <select 
                name="accessLevel"
                style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
                <option value="admin">Admin Access</option>
                <option value="member">Member Access</option>
            </select>
        </form>
    `;
    } else if (section === "Metrics") {
        sidebar.classList.add("metrics");
        content.innerHTML = `
        <p>View engagement metrics for your organization below.</p>
        <form id="metrics-form" style="display: flex; flex-direction: column; gap: 15px;">
            <label>
                Number page visits:
                <input type="text" name="visitedPage" style="margin-left: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
            </label>
            <label>
                Number of people signed up for past events:
                <input type="text" name="pastEvents" style="margin-left: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
            </label>
            <label>
                Number of people signed up for upcoming events:
                <input type="text" name="upcomingEvents" style="margin-left: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
            </label>
            <label>
                Total events created:
                <input type="text" name="totalEvents" style="margin-left: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
            </label>

            <label>
                Demographics (Race):
                <div id="demographics-chart" style="width: 100%; height: 200px; background: #e0e0e0; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #666;">
                    Chart goes here
                </div>
            </label>

            <label>
                Age Groups:
                <div id="age-groups-chart" style="width: 100%; height: 200px; background: #e0e0e0; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #666;">
                    Chart goes here
                </div>
            </label>
        </form>
    `;
    } else if (section === "Donations") {
        sidebar.classList.add("donations");
        if (donations) {
            donations.style.display = "block"; // Show donations UI
            content.innerHTML = `
                <br>
                <p>Click below to view all donations.</p>
                <br>
                <button id="donateButton" style="color: var(--color-BG); background-color: var(--color-accent);">View Donations</button>
            `;
            // Attach event listener after button is added
            const donateButton = document.getElementById("donateButton");
            if (donateButton) {
                donateButton.addEventListener("click", function() {
                    console.log("Donate button clicked!");
                });
            }
        }
    } else if (section === "Calendar") {
        sidebar.classList.add("calendar");
        calendar.style.display = "block";
        generateCalendar();
    }

    sidebar.classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("active");
}




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