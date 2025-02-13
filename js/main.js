// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuContent = mobileMenu.querySelector('div');

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        
        if (isHidden) {
            // Show menu
            mobileMenuContent.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        } else {
            // Hide menu
            mobileMenuContent.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            toggleMenu();
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll reveal animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                scrollRevealObserver.unobserve(entry.target); // Unobserve after animation
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
        scrollRevealObserver.observe(el);
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    // Improved intersection observer for nav highlighting
    const navObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Adjust these values to control when the active state changes
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('text-blue-600');
                    link.classList.add('text-gray-600');
                });

                // Add active class to corresponding link
                const activeId = entry.target.id;
                const activeLink = document.querySelector(`nav a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.remove('text-gray-600');
                    activeLink.classList.add('text-blue-600');
                }
            }
        });
    }, navObserverOptions);

    // Observe all sections
    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Handle initial active state
    function setInitialActiveState() {
        const scrollPosition = window.scrollY;
        let activeSection = sections[0];

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight/2 && 
                scrollPosition < sectionTop + sectionHeight - window.innerHeight/2) {
                activeSection = section;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-600');
            link.classList.add('text-gray-600');
            
            if (link.getAttribute('href') === `#${activeSection.id}`) {
                link.classList.remove('text-gray-600');
                link.classList.add('text-blue-600');
            }
        });
    }

    // Set initial active state and handle page refresh
    setInitialActiveState();
    window.addEventListener('load', setInitialActiveState);
});