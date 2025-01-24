const leaderboards = {
  weekly: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      name: `Weekly User ${i + 1}`,
      score: 1000 + i * 50 + " Points",
      image: `https://via.placeholder.com/50?text=W${i + 1}` 
  })),
  monthly: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      name: `Monthly User ${i + 1}`,
      score: 2000 + i * 100 + " Points",
      image: `https://via.placeholder.com/50?text=M${i + 1}` 
  })),
  overall: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      name: `Overall User ${i + 1}`,
      score: 5000 + i * 200 + " Points",
      image: `https://via.placeholder.com/50?text=O${i + 1}` 
  }))
};

const leaderboardList = document.getElementById('leaderboardList');

function showLeaderboard(type) {
  const data = leaderboards[type];
  leaderboardList.innerHTML = '';
  data.forEach(entry => {
      const listItem = document.createElement('li');
      listItem.className = 'leaderboard-item';
      listItem.innerHTML = `
          <span class="leaderboard-rank">#${entry.rank}</span>
          <img src="${entry.image}" alt="User Image" class="leaderboard-image">
          <span class="leaderboard-name">${entry.name}</span>
          <span class="leaderboard-score">${entry.score}</span>
      `;
      leaderboardList.appendChild(listItem);
  });
}
