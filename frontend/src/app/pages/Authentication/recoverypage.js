<script>
document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); //Prevent the form from reloading the page

    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNew = document.getElementById('confirmNew').value;

    //Check if the passwords match
    if(newPassword !== confirmNew)
    {
        alert("Passwords do not match!");
        return;
    }

    //Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if(!passwordRegex.test(newPassword))
    {
        alert("New Password must have at least 1 uppercase character, 1 lowercase character, 1 number, 1 special character, and be longer than 8 characters.");
        return;
    }

    try{
        const response = await fetch("http://localhost:5000/api/auth/reset-password",{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, newPassword})
        });

        const result = await response.json();
        if(response.ok){
            alert("Password successfully reset!");
            window.location.href = "../../pages/Authentication/communitywatchlogin.html"; //Redirect to login page
        }
        else{
            alert(result.message);
        }
    }
    catch(error)
    {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }

});
</script>