// ==========================================================================
// LANDING PAGE INTERACTIONS
// ==========================================================================

// Smooth scroll to sections
function scrollToDemo() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle click outside modal to close
document.addEventListener('click', (e) => {
    const modal = document.getElementById('auth-modal');
    const modalContent = document.querySelector('.modal-content');
    
    if (modal && !modal.classList.contains('hidden')) {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeAuthModal();
        }
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthModal();
    }
});

// Add scroll animations for features
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});