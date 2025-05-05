const backendUrl = 'http://localhost:5000';
async function initializeAdminView()
{
    try{
        const loggedInUserId = sessionStorage.getItem("userId");
        if(!loggedInUserId)
        {
            console.error("User ID not found.");
            return;
        }

        const response = await fetch(`${backendUrl}/api/users/admin/${loggedInUserId}`);
        const userData = await response.json();

        const organizationInfoDisplay = document.getElementById("exisiting-organization-info");
        const organizationForm = document.getElementById("edit-organization");

        if(userData.organizationId)
        {
            //ensure organizationId is a string
            const organizationIdString = 
                typeof userData.organizationId === 'object' && userData.organizationId !== null
                    ? userData.organizationId._id
                    : userData.organizationId;

            //Fetch organizations data since user has an organizationId
            const orgResponse = await fetch(`${backendUrl}/api/organizations/${organizationIdString}`);
            const organizationData = await orgResponse.json();

            //Display existing organization information
            organizationInfoDisplay.innerHTML = `
                <h3>Your Organization:</h3>
                <p><strong>Title:</strong> ${organizationData.name || "N/A"}</p>
                <p><strong>Description:</strong> ${organizationData.description || "N/A"}</p>
                ${organizationData.profileImage ? `<p><strong>Logo:</strong></p><img src=${organizationData.profileImage} alt="Organization Logo" style="size: cover;"\>` : ''}
                <p><strong>Categories:</strong> ${organizationData.causes ? organizationData.causes.join(", ") : "N/A"}</p>
                <hr>
            `;
            organizationForm.style.display = "block"; //Show the form for potential updates (or cretaing a new organization)
            document.getElementById("organization-id").value = organizationData._id || "";

            // Store the organization ID for updates later
            document.getElementById("organization-id").value = organizationData._id; 

            const myOrgLink = document.getElementById('myOrgLink');
            myOrgLink.href = `../OrgHomePage?orgId=${organizationIdString}`;
        }
        else {
            organizationInfoDisplay.innerHTML = "<p>No organization associated with your account yet.</p><hr>";
            organizationForm.style.display = "block"; //Show the form for creating a new organization
            document.getElementById("organization-id").value = ""; //Ensure no ID is present for new creation
        }

        // Clear the form fields
        document.getElementById("new-title").value = "";
        document.getElementById("change-description").value = "";
        const checkboxes = document.querySelectorAll('#filters input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        updateSelected(); // Clear the displayed selected categories

    }
    catch(error)
    {
        console.error("Error intitializing Admin View:", error);
        alert("Error prepopulating data in the form.");
    }
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
async function submitChanges() {
    // Get new values from the input fields
    const newTitle = document.getElementById("new-title").value;
    const newPhoto = document.getElementById("org-logo");
    const newDescription = document.getElementById("change-description").value;
    const newWebsite = document.getElementById("website").value;
    const newDonationWebsite = document.getElementById("donation-website").value;
    const organizationId = document.getElementById("organization-id").value;
    const selectedCaterogies = Array.from(document.querySelectorAll('#filters input[type="checkbox"]:checked')).map(checkBox => checkBox.value);
    const loggedInUserId = sessionStorage.getItem("userId");

    if(!loggedInUserId)
    {
        console.error("User ID not found during submission.");
        return;
    }

    const formData = new FormData();
    formData.append("name", newTitle);
    formData.append("description", newDescription);
    formData.append("website", newWebsite);
    formData.append("donationWebsite", newDonationWebsite);
    if(newPhoto.files && newPhoto.files.length > 0)
    {
        formData.append("logo", newPhoto.files[0]);
    }
    formData.append("causes", JSON.stringify(selectedCaterogies));

    let url = `${backendUrl}/api/organizations`;
    let method = 'POST';

    if(organizationId)
    {
        url = `${backendUrl}/api/organizations/${organizationId}`; // URL for updating
        method = 'PUT';
        formData.append("_id", organizationId); // Include the ID for the update
    }
    else{
        // New organization: Include the admin's ID in the request
        formData.append("adminId", loggedInUserId);
    }

    try{
        const response = await fetch(url, {
            method: method,
            body: formData 
        });

        if(!response.ok)
        {
            throw new Error (`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json()
        console.log("Success:", result);
        alert("Changes uploaded");
    }
    catch(error)
    {
        console.error("Error saving organization:", error);
        alert('Error upload organizations');
    }

    // Close the sidebar after submission
    //closeOrganizationSidebar();
}

// Call initializeAdminView when the page loads
window.onload = function() {
    initializeAdminView();
};


