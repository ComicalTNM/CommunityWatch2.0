// Function to open the sidebar
function openOrganizationSidebar() {
    document.getElementById("organization-sidebar").style.display = "block";
}

// Function to close the sidebar
function closeOrganizationSidebar() {
    document.getElementById("organization-sidebar").style.display = "none";
}

var expanded =false;
function showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded){
        checkboxes.style,display = "block";
        expanded = true;
    }
    else {
        checkboxes.style.display = "none";
        expanded =false;
    }
}
function updateSelected() {
    const selected = [];
    const checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        selected.push(checkbox.value);
    });
    // Display selected values
    const display = document.getElementById("checkbox-display");
    display.innerText = "Category: " + (selected.length > 0 ? selected.join(", ") : "None");
  }

// Function to handle form submission and update the section content
function submitChanges() {
    // Get new values from the input fields
    var newTitle = document.getElementById("new-title").value;
    var newPhoto = document.getElementById("new-photo").value;
    var newDescription = document.getElementById("new-description").value;

    // Update the organization title, photo, and description
    if (newTitle) {
        document.getElementById("org-title").textContent = newTitle;
    }
    if (newPhoto) {
        document.getElementById("org-photo").style.backgroundImage = "url('" + newPhoto + "')";
    }
    if (newDescription) {
        document.getElementById("org-description").innerHTML = newDescription;
    }

    // Close the sidebar after submission
    closeOrganizationSidebar();
}
