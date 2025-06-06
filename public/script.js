// Preloader Animation
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('open');
    setTimeout(() => {
        preloader.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 1000);
});

// Dynamic Food Background Based on Time
const backgrounds = {
    morning: 'https://via.placeholder.com/1920x1080.png?text=Breakfast',
    afternoon: 'https://via.placeholder.com/1920x1080.png?text=Lunch',
    evening: 'https://via.placeholder.com/1920x1080.png?text=Dinner',
    night: 'https://via.placeholder.com/1920x1080.png?text=Desserts'
};

const hero = document.getElementById('hero');
const now = new Date();
const hour = now.getHours();

if (hour < 12) {
    hero.style.backgroundImage = `url(${backgrounds.morning})`;
} else if (hour < 18) {
    hero.style.backgroundImage = `url(${backgrounds.afternoon})`;
} else if (hour < 22) {
    hero.style.backgroundImage = `url(${backgrounds.evening})`;
} else {
    hero.style.backgroundImage = `url(${backgrounds.night})`;
}

// Dynamic Call-to-Action Button Text
const ctaButton = document.getElementById('cta-button');
const texts = ['Order Now', 'Explore Menu', 'Join Us'];
let index = 0;

setInterval(() => {
    ctaButton.textContent = texts[index];
    index = (index + 1) % texts.length;
}, 3000);

// Modal Functionality
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

ctaButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close Modal on Outside Click
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});