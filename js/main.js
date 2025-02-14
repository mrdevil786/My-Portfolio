// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    
    // Check for saved theme preference, otherwise use system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    }

    themeToggle?.addEventListener('click', toggleTheme);
    themeToggleMobile?.addEventListener('click', toggleTheme);

    // Navbar animation on load
    const navbar = document.querySelector('nav');
    setTimeout(() => {
        navbar.classList.remove('translate-y-[-100%]');
    }, 500);

    // Mobile menu functionality
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuContent = mobileMenu.querySelector('div');

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains('pointer-events-none');
        const spans = menuBtn.querySelectorAll('span:not(.sr-only)');
        
        if (isHidden) {
            // Show menu
            mobileMenu.classList.remove('pointer-events-none', 'opacity-0');
            mobileMenuContent.classList.remove('-translate-y-full');
            document.body.style.overflow = 'hidden';
            document.querySelector('main')?.classList.add('blur-sm');
            
            // Animate to X
            spans[0].classList.add('rotate-45', 'translate-y-0');
            spans[1].classList.add('opacity-0');
            spans[2].classList.add('-rotate-45', 'translate-y-0');
            
            // Add active state
            menuBtn.classList.add('text-blue-600');
        } else {
            // Hide menu
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenuContent.classList.add('-translate-y-full');
            document.body.style.overflow = '';
            document.querySelector('main')?.classList.remove('blur-sm');
            
            // Animate back to hamburger
            spans[0].classList.remove('rotate-45', 'translate-y-0');
            spans[1].classList.remove('opacity-0');
            spans[2].classList.remove('-rotate-45', 'translate-y-0');
            
            // Remove active state
            menuBtn.classList.remove('text-blue-600');
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
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
        threshold: 0.15  // Increased threshold for smoother reveal
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
        rootMargin: '-10% 0px -80% 0px', // Adjusted margins for better accuracy
        threshold: [0, 0.25, 0.5, 0.75, 1] // Multiple thresholds for smoother transitions
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
        const scrollPosition = window.scrollY + window.innerHeight / 3; // Adjusted scroll position calculation
        let activeSection = sections[0];

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
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

    // Add resize event listener for mobile menu height adjustment
    window.addEventListener('resize', () => {
        if (!mobileMenu.classList.contains('pointer-events-none')) {
            mobileMenu.style.height = `${window.innerHeight - 64}px`;
        }
    });

    // Add smooth transition for menu items
    document.querySelectorAll('#mobile-menu a').forEach((link, index) => {
        link.style.transitionDelay = `${index * 50}ms`;
        link.addEventListener('click', () => {
            toggleMenu();
            // Reset transition delay after animation
            setTimeout(() => {
                link.style.transitionDelay = '0ms';
            }, 300);
        });
    });
});