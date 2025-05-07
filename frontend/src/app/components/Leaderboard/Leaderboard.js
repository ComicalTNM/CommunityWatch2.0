

const leaderboardList = document.getElementById('leaderboardList');

function showLeaderboard(type) {
  fetchLeaderboard();
}

async function fetchLeaderboard() {
    try {
        const response = await fetch('http://localhost:5000/api/users/leaderboard'); // Fetch from your API
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }
        const users = await response.json();
        displayLeaderboard(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        leaderboardList.innerHTML = '<li>Error loading leaderboard.</li>';
    }
}

function displayLeaderboard(users) {
    leaderboardList.innerHTML = ''; // Clear existing list

    users.forEach((user, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'leaderboard-item';
        listItem.innerHTML = `
            <span class="leaderboard-rank">#<span class="math-inline">${index + 1}</span>
            <span class="leaderboard-name">${user.username}</span>
            <span class="leaderboard-score">${user.pointsPoints}</span><imgsrc="https://via.placeholder.com/50?text={user.username.charAt(0).toUpperCase()}" alt="${user.username}" class="leaderboard-image">
            `;
        leaderboardList.appendChild(listItem);
    });
}

fetchLeaderboard();
