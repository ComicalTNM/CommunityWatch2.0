function openSidebar(section) {
    document.getElementById("sidebar").style.right = "0";
    document.getElementById("sidebar-title").innerText = section;
    
    let content = {
        "Roles": "Manage user roles and permissions.",
        "Metrics": "View site analytics and reports.",
        "Calendar": "Schedule and view events.",
        "Payment": "Manage payment settings and transactions."
    };
    
    document.getElementById("sidebar-content").innerText = content[section];
}

function closeSidebar() {
    document.getElementById("sidebar").style.right = "-300px";
}
