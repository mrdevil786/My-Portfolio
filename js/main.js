document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    
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

    const navbar = document.querySelector('nav');
    setTimeout(() => {
        navbar.classList.remove('translate-y-[-100%]');
    }, 500);

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuContent = mobileMenu.querySelector('div');

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains('pointer-events-none');
        const spans = menuBtn.querySelectorAll('span:not(.sr-only)');
        
        if (isHidden) {
            mobileMenu.classList.remove('pointer-events-none', 'opacity-0');
            mobileMenuContent.classList.remove('-translate-y-full');
            document.body.style.overflow = 'hidden';
            document.querySelector('main')?.classList.add('blur-sm');
            
            spans[0].classList.add('rotate-45', 'translate-y-0');
            spans[1].classList.add('opacity-0');
            spans[2].classList.add('-rotate-45', 'translate-y-0');
            
            menuBtn.classList.add('text-blue-600');
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenuContent.classList.add('-translate-y-full');
            document.body.style.overflow = '';
            document.querySelector('main')?.classList.remove('blur-sm');
            
            spans[0].classList.remove('rotate-45', 'translate-y-0');
            spans[1].classList.remove('opacity-0');
            spans[2].classList.remove('-rotate-45', 'translate-y-0');
            
            menuBtn.classList.remove('text-blue-600');
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            toggleMenu();
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

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

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
        scrollRevealObserver.observe(el);
    });

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const navObserverOptions = {
        root: null,
        rootMargin: '-10% 0px -80% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('text-blue-600');
                    link.classList.add('text-gray-600');
                });

                const activeId = entry.target.id;
                const activeLink = document.querySelector(`nav a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.remove('text-gray-600');
                    activeLink.classList.add('text-blue-600');
                }
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    function setInitialActiveState() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
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

    setInitialActiveState();
    window.addEventListener('load', setInitialActiveState);

    window.addEventListener('resize', () => {
        if (!mobileMenu.classList.contains('pointer-events-none')) {
            mobileMenu.style.height = `${window.innerHeight - 64}px`;
        }
    });

    document.querySelectorAll('#mobile-menu a').forEach((link, index) => {
        link.style.transitionDelay = `${index * 50}ms`;
        link.addEventListener('click', () => {
            toggleMenu();
            setTimeout(() => {
                link.style.transitionDelay = '0ms';
            }, 300);
        });
    });

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    function calculateExperience() {
        const startDate = new Date('2022-08-10');
        const currentDate = new Date();
        
        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();
        let days = currentDate.getDate() - startDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const experienceElement = document.getElementById('total-experience');
        if (experienceElement) {
            experienceElement.textContent = `${years} Years ${months} Months ${days} Days`;
        }
    }

    calculateExperience();
    setInterval(calculateExperience, 24 * 60 * 60 * 1000);
});