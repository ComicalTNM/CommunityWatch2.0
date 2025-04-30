async function initializeAdminView()
{
    try{
        const response = await fetch('/api/user/admin');
        const userData = await response.json();

        if(userData.organizationId)
        {
            //Fetch organizations data since user has an organizationId
            const orgResponse = await fetch(`/api/organizations/${userData.organizationId}`);
            const organizationData = await orgResponse.json();

            //Populate the form fields
            document.getElementById("new-title").value = organizationData.name || "";
            document.getElementById("change-description").value = organizationData.description || "";

            //Handle logo
            document.getElementById("org-logo").value = organizationData.profileImage || "";

            //Handle categories
            if(organizationData.causes && Array.isArray(organizationData.causes))
            {
                organizationData.causes.forEach(cause => {
                    const checkBox = document.querySelector(`#filters input[type="checkbox"][value="${cause}]"`);
                    if(checkBox)
                    {
                        checkBox.checked = true;
                    }
                });
                updateSelected(); //Update the display
            }

            // Store the organization ID for updates later
            document.getElementById("organization-id").value = organizationData._id; 
        }

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
    const newPhoto = document.getElementById("org-photo").files[0];
    const newDescription = document.getElementById("change-description").value;
    const organizationId = document.getElementById("organization-id").value;
    const selectedCaterogies = Array.from(document.querySelectorAll('#filters input[type="checkbox"]:checked')).map(checkBox => checkBox.value);

    const formData = new FormData();
    formData.append("name", newTitle);
    formData.append("description", newDescription);
    if(newPhoto)
    {
        formData.append("profileImage", newPhoto);
    }
    formData.append("causes", JSON.stringify(selectedCaterogies));

    let url = '/api/organizations';
    let method = 'POST';

    if(organizationId)
    {
        url = `/api/organizations/${organizationId}`; // URL for updating
        method = 'PUT';
        formData.append("_id", organizationId); // Include the ID for the update
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
    closeOrganizationSidebar();
}

// Call initializeAdminView when the page loads
window.onload = function() {
    initializeAdminView();
};


