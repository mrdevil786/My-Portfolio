document.addEventListener('DOMContentLoaded', function() {
    // Typing animation for hero headline
    const heroHeadline = document.querySelector('#hero-content h1');
    if (heroHeadline) {
        const originalText = heroHeadline.textContent;
        heroHeadline.textContent = '';
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < originalText.length) {
                heroHeadline.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                // Add blinking cursor after animation completes
                heroHeadline.innerHTML += '<span class="typing-cursor">|</span>';
            }
        }, 100);
    }

    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    
    // Set initial theme and aria-pressed state
    const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.querySelectorAll('[aria-label="Toggle dark mode"]').forEach(btn => {
            btn.setAttribute('aria-pressed', 'true');
        });
    } else {
        document.documentElement.classList.remove('dark');
        document.querySelectorAll('[aria-label="Toggle dark mode"]').forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
        });
    }

    function toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        
        // Add transition class for smooth color changes
        html.classList.add('transition-all');
        html.classList.add('duration-500');
        
        // Toggle dark mode and update aria-pressed state
        if (isDark) {
            html.classList.remove('dark');
            localStorage.theme = 'light';
            document.querySelectorAll('[aria-label="Toggle dark mode"]').forEach(btn => {
                btn.setAttribute('aria-pressed', 'false');
            });
        } else {
            html.classList.add('dark');
            localStorage.theme = 'dark';
            document.querySelectorAll('[aria-label="Toggle dark mode"]').forEach(btn => {
                btn.setAttribute('aria-pressed', 'true');
            });
        }
        
        // Remove transition classes after animation completes
        setTimeout(() => {
            html.classList.remove('transition-all', 'duration-500');
        }, 500);
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
            menuBtn.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenuContent.classList.add('-translate-y-full');
            document.body.style.overflow = '';
            document.querySelector('main')?.classList.remove('blur-sm');
            
            spans[0].classList.remove('rotate-45', 'translate-y-0');
            spans[1].classList.remove('opacity-0');
            spans[2].classList.remove('-rotate-45', 'translate-y-0');
            
            menuBtn.classList.remove('text-blue-600');
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
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

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index
                const delay = Math.min(index * 100, 800);
                
                setTimeout(() => {
                    entry.target.classList.add(
                        'opacity-100',
                        'translate-y-0',
                        'blur-none'
                    );
                    entry.target.classList.remove(
                        'opacity-0',
                        'translate-y-8',
                        'blur-sm'
                    );
                    scrollRevealObserver.unobserve(entry.target);
                }, delay);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.05
    });

    document.querySelectorAll('.scroll-reveal').forEach((el, index) => {
        // Add staggered initial styles
        el.classList.add(
            'opacity-0',
            'translate-y-8',
            'blur-sm',
            'transition-all',
            'duration-700',
            'ease-out'
        );
        
        // Set custom delay property for CSS
        el.style.setProperty('--delay', `${Math.min(index * 50, 500)}ms`);
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
                const allNavLinks = document.querySelectorAll('nav a[href^="#"], #mobile-menu a[href^="#"]');
                allNavLinks.forEach(link => {
                    link.classList.remove('text-blue-600', 'dark:text-blue-400');
                    link.classList.add('text-gray-600', 'dark:text-gray-300');
                });

                const activeId = entry.target.id;
                const activeLinks = document.querySelectorAll(`nav a[href="#${activeId}"], #mobile-menu a[href="#${activeId}"]`);
                activeLinks.forEach(activeLink => {
                    activeLink.classList.remove('text-gray-600', 'dark:text-gray-300');
                    activeLink.classList.add('text-blue-600', 'dark:text-blue-400');
                });
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

        const allNavLinks = document.querySelectorAll('nav a[href^="#"], #mobile-menu a[href^="#"]');
        allNavLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'dark:text-blue-400');
            link.classList.add('text-gray-600', 'dark:text-gray-300');
            
            if (link.getAttribute('href') === `#${activeSection.id}`) {
                link.classList.remove('text-gray-600', 'dark:text-gray-300');
                link.classList.add('text-blue-600', 'dark:text-blue-400');
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

    function renderExperience() {
        const loadingElement = document.getElementById('experience-loading');
        const experienceContainer = document.querySelector('#experience .space-y-8');
        
        try {
            if (!window.experienceData) {
                throw new Error('Experience data not found');
            }

            if (experienceContainer) {
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }

                experienceContainer.innerHTML = window.experienceData.experiences.map(exp => `
                    <div class="group bg-white dark:bg-dark-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 dark:border-gray-700">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div class="mb-4 md:mb-0">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${exp.company}</h3>
                                <p class="text-blue-600 dark:text-blue-400">${exp.position}</p>
                            </div>
                            <span class="inline-block px-3 py-1 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">${exp.period}</span>
                        </div>
                        <div class="mt-4">
                            <ul class="space-y-2">
                                ${exp.responsibilities.map(resp => `
                                    <li class="flex items-start">
                                        <svg class="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span class="text-gray-600 dark:text-gray-300">${resp}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error rendering experience data:', error);
            if (experienceContainer) {
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                experienceContainer.innerHTML = `
                    <div class="text-center text-red-600 dark:text-red-400">
                        <i class="fas fa-exclamation-circle text-2xl"></i>
                        <p class="mt-2">Failed to load experience data. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    function renderSkills() {
        const loadingElement = document.getElementById('skills-loading');
        const skillsContainer = document.getElementById('skills-container');
        
        try {
            if (!window.skillsData) {
                throw new Error('Skills data not found');
            }

            if (skillsContainer) {
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }

                skillsContainer.innerHTML = window.skillsData.skills.map(skill => `
                    <div class="skill-card bg-white dark:bg-dark-bg rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700" data-category="${skill.category.toLowerCase()}">
                        <div class="flex items-center mb-6">
                            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                                <i class="fas fa-${skill.icon} text-blue-600 dark:text-blue-400 text-xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${skill.category}</h3>
                        </div>
                        <div class="space-y-4">
                            ${skill.items.map(item => `
                                <div class="has-tooltip relative">
                                    <div class="flex items-center justify-between mb-1">
                                        <span class="text-gray-600 dark:text-gray-300">${item.name}</span>
                                        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">${item.proficiency}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div class="skill-bar bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                                             style="width: ${item.proficiency}%"></div>
                                    </div>
                                    <div class="tooltip absolute z-10 w-64 p-3 mt-2 text-sm text-white bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg">
                                        ${item.description}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('');

                // Add filter functionality
                document.querySelectorAll('.skill-filter').forEach(button => {
                    button.addEventListener('click', function() {
                        const filter = this.dataset.filter;
                        
                        // Update active button
                        document.querySelectorAll('.skill-filter').forEach(btn => {
                            btn.classList.remove('bg-blue-100', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-400');
                            btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
                        });
                        this.classList.add('bg-blue-100', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-400');
                        this.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');

                        // Filter skills
                        document.querySelectorAll('.skill-card').forEach(card => {
                            if (filter === 'all' || card.dataset.category === filter) {
                                card.classList.remove('hidden');
                            } else {
                                card.classList.add('hidden');
                            }
                        });
                    });
                });

                // Animate skill bars on scroll
                const skillBars = document.querySelectorAll('.skill-bar');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const width = entry.target.style.width;
                            entry.target.style.width = '0';
                            setTimeout(() => {
                                entry.target.style.width = width;
                            }, 100);
                        }
                    });
                }, { threshold: 0.1 });

                skillBars.forEach(bar => observer.observe(bar));
            }
        } catch (error) {
            console.error('Error rendering skills data:', error);
            if (skillsContainer) {
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                skillsContainer.innerHTML = `
                    <div class="text-center text-red-600 dark:text-red-400 col-span-full">
                        <i class="fas fa-exclamation-circle text-2xl"></i>
                        <p class="mt-2">Failed to load skills data. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    // Critical image lazy loading with intersection observer
    const heroImage = document.querySelector('#about img');
    if (heroImage) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        imgObserver.unobserve(img);
                    }
                }
            });
        }, { threshold: 0.1 });

        // Store original src in data-src and remove src
        heroImage.dataset.src = heroImage.src;
        heroImage.src = '';
        imgObserver.observe(heroImage);
    }

    setTimeout(() => {
        renderExperience();
        renderSkills();
    }, 100);
});