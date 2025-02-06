// Function to open the expandable box
function expandCard(button) {
    let card = button.closest('.card');
    let expandedCard = document.querySelector('.expanded-card');
    
    if (expandedCard) {
        expandedCard.style.display = 'block';
        card.style.display = 'none';
    }
}

function collapseCard(button) {
    let expandedCard = button.closest('.expanded-card');
    let originalCard = document.querySelector('.card');
    
    if (originalCard) {
        expandedCard.style.display = 'none';
        originalCard.style.display = 'block';
    }
}

function openExpandable() {
    document.getElementById('expandableBox').style.display = 'flex';
}

// Function to close the expandable box
function closeExpandable() {
    document.getElementById('expandableBox').style.display = 'none';
}

// Add hover effects to cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Progress bar animation (can be dynamic)
const progressBars = document.querySelectorAll('.progress-bar');
progressBars.forEach(bar => {
    const progress = parseInt(bar.style.width);
    bar.style.transition = 'width 1s ease';
    setTimeout(() => {
        bar.style.width = progress + '%';
    }, 100);
});
