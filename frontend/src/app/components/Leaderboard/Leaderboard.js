const leaderboards = {
    weekly: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      name: `Weekly User ${i + 1}`,
      score: 1000 + i * 50
    })),
    monthly: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      name: `Monthly User ${i + 1}`,
      score: 2000 + i * 100
    })),
    overall: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      name: `Overall User ${i + 1}`,
      score: 5000 + i * 200
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
        <span class="leaderboard-name">${entry.name}</span>
        <span class="leaderboard-score">${entry.score}</span>
      `;
      leaderboardList.appendChild(listItem);
    });
  }