// Particle.js configuration
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 1000 } },
                color: { value: "#3b82f6" },
                shape: { type: "circle" },
                opacity: { value: 0.4, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 200, color: "#3b82f6", opacity: 0.3, width: 1 },
                move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }

    // Typing animation for hero headline
    const heroTitle = document.querySelector('#hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50);
    }

    // Scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce';
    scrollIndicator.innerHTML = `
        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
    `;
    document.querySelector('#about').appendChild(scrollIndicator);
    
    // Hide scroll indicator after first scroll
    let scrolled = false;
    window.addEventListener('scroll', () => {
        if (!scrolled) {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                scrollIndicator.remove();
            }, 500);
            scrolled = true;
        }
    }, { once: true });
});