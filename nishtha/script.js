// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    /* ===== Theme Toggle Feature ===== */
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const body = document.body;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('mode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'mode-light' || (!savedTheme && !systemPrefersDark)) {
        body.classList.remove('mode-dark');
        body.classList.add('mode-light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    } else {
        if (!body.classList.contains('mode-dark') && !body.classList.contains('mode-light')) {
            body.classList.add('mode-dark');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.classList.contains("mode-dark")) {
                body.classList.remove("mode-dark");
                body.classList.add("mode-light");
            } else {
                body.classList.remove("mode-light");
                body.classList.add("mode-dark");
            }
            
            const isLight = body.classList.contains('mode-light');
            localStorage.setItem('mode', isLight ? 'mode-light' : 'mode-dark');
            
            if (isLight) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }

    /* ===== DOM Elements ===== */
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    // Get all sections based on nav links
    const sections = Array.from(navLinksItems).map(link => {
        const id = link.getAttribute('href');
        return document.querySelector(id.startsWith('#') && id !== '#' ? id : null);
    }).filter(sec => sec !== null);

    /* ===== Combined Scroll Event Listener ===== */
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // 1. Scroll Progress Indicator
        if (scrollProgress) {
            const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollTotal > 0) {
                scrollProgress.style.width = ((scrollPosition / scrollTotal) * 100) + '%';
            }
        }

        // 2. Navbar Scrolled Style
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 3. Active Section Highlight
        const offsetPosition = scrollPosition + 150; // offset for fixed navbar
        let currentSectionId = '';

        sections.forEach(sec => {
            if (offsetPosition >= sec.offsetTop && offsetPosition < sec.offsetTop + sec.offsetHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        // Ensure bottom gets "Contact" section highlighted
        if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 50) {
            currentSectionId = 'contact';
        }

        // Apply active class
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ===== Mobile Menu Toggle ===== */
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    /* ===== Intersection Observer for Staggered Scroll Animations ===== */
    const appearElements = document.querySelectorAll('.skill-card, .project-card, .edu-card, .cert-card, .cert-img-card, .section-title, .timeline-content, .training-card, .learning-card, .contact-item, .data-pipeline, .pipeline-subtitle');
    
    // Add default hidden classes based on element type
    appearElements.forEach(el => {
        if (el.classList.contains('project-card') || el.classList.contains('timeline-content')) {
             el.classList.add('fade-in-slide-right');
        } else {
             el.classList.add('fade-in-slide-up');
        }
    });

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    let fadeBatch = [];
    let fadeTimeout = null;
    const staggerDelay = 120; // ms

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fadeBatch.push(entry.target);
                observer.unobserve(entry.target);
            }
        });

        if (fadeBatch.length > 0) {
            clearTimeout(fadeTimeout);
            fadeTimeout = setTimeout(() => {
                const currentBatch = [...fadeBatch];
                fadeBatch = []; // Reset for next batch
                
                currentBatch.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, index * staggerDelay);
                });
            }, 50); // Small debounce to collect items appearing simultaneously
        }
    }, appearOptions);

    appearElements.forEach(el => appearOnScroll.observe(el));

    /* ===== Smooth Scroll with Offset for Fixed Header ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 20;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                
                // Active link highlighting
                navLinksItems.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    /* ===== Interactive Expertise Toggle ===== */
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        const skillCards = skillsGrid.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Prevent document click from closing immediately
                e.stopPropagation();
                
                const isActive = this.classList.contains('active');
                
                // Reset all cards
                skillCards.forEach(c => c.classList.remove('active', 'shake'));
                
                if (!isActive) {
                    // Activate clicked card
                    this.classList.add('active');
                    skillsGrid.classList.add('has-active');
                    
                    // Trigger subtle shake animation
                    void this.offsetWidth; // Force reflow
                    this.classList.add('shake');
                    
                    setTimeout(() => {
                        this.classList.remove('shake');
                    }, 400);
                } else {
                    skillsGrid.classList.remove('has-active');
                }
            });
        });
        
        // Click outside to deactivate
        document.addEventListener('click', () => {
            skillCards.forEach(c => c.classList.remove('active', 'shake'));
            skillsGrid.classList.remove('has-active');
        });
    }

    /* ===== Projects Carousel ===== */
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-dots');
        const dots = Array.from(dotsNav.children);

        let currentSlideIndex = 0;

        const updateCarousel = (index) => {
            // center the slide (width is 80%, so push by 10% inside the track)
            track.style.transform = `translateX(calc(-${index * 80}% + 10%))`;
            
            // update classes for scaling and opacity
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active-slide');
                } else {
                    slide.classList.remove('active-slide');
                }
            });

            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
            currentSlideIndex = index;
        };

        // Initialize first slide's class and position
        updateCarousel(0);

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextIndex = (currentSlideIndex + 1) % slides.length;
                updateCarousel(nextIndex);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                updateCarousel(prevIndex);
            });
        }

        if (dotsNav) {
            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('.dot');
                if (!targetDot) return;
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                updateCarousel(targetIndex);
            });
        }

        // Touch/Swipe Events
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});

        const handleSwipe = () => {
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                // Swipe Left (Next)
                const nextIndex = (currentSlideIndex + 1) % slides.length;
                updateCarousel(nextIndex);
            } else if (touchEndX - touchStartX > threshold) {
                // Swipe Right (Prev)
                const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                updateCarousel(prevIndex);
            }
        };
    }

    /* ===== Interactive Connect Cards ===== */
    const contactMethods = document.querySelector('.contact-methods');
    if (contactMethods) {
        const contactItems = contactMethods.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Ignore clicks on actual links within detail
                if (e.target.tagName.toLowerCase() === 'a') return;
                
                e.stopPropagation();
                
                const isExpanded = this.classList.contains('expanded');
                
                // Collapse all
                contactItems.forEach(c => c.classList.remove('expanded'));
                
                // Toggle clicked
                if (!isExpanded) {
                    this.classList.add('expanded');
                    contactMethods.classList.add('has-expanded');
                } else {
                    contactMethods.classList.remove('has-expanded');
                }
            });
        });

        // Click outside closes them
        document.addEventListener('click', () => {
            contactItems.forEach(c => c.classList.remove('expanded'));
            contactMethods.classList.remove('has-expanded');
        });
    }

    /* ===== Typewriter Effect for Hero Subtitle ===== */
    const typedTextSpan = document.getElementById("typed-text");
    const cursorSpan = document.querySelector(".cursor");

    if (typedTextSpan && cursorSpan) {
        const textArray = [
            "Data Scientist",
            "Machine Learning Enthusiast",
            "Turning Data into Insights"
        ];
        const typingDelay = 120;
        const erasingDelay = 60;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 500);
            }
        }

        // Start typing effect
        setTimeout(type, 1000);
    }

    /* ===== Cursor Glow Follow Effect ===== */
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (e) => {
            document.body.style.setProperty("--cursor-x", `${e.clientX}px`);
            document.body.style.setProperty("--cursor-y", `${e.clientY}px`);
        });
    }

});

/* ============================================ */
/* ADD THIS AT THE VERY END OF YOUR script.js FILE */
/* ============================================ */

/* ===== Skills Category Filtering ===== */
const categoryTabs = document.querySelectorAll('.category-tab');
const skillCards = document.querySelectorAll('.skill-card-3d');
const skillCountSpan = document.getElementById('skill-count');

// Function to update visible skills
function filterSkills(category) {
    let visibleCount = 0;
    
    skillCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hide');
            visibleCount++;
            // Add animation delay for staggered appearance
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'fadeInScale 0.5s ease forwards';
        } else {
            card.classList.add('hide');
        }
    });
    
    // Update skill count
    if (skillCountSpan) {
        skillCountSpan.textContent = visibleCount;
    }
}

// Add click event to category tabs
if (categoryTabs.length > 0) {
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get category and filter
            const category = tab.dataset.category;
            filterSkills(category);
        });
    });
}

// Initialize - show all skills and count
if (skillCountSpan) {
    skillCountSpan.textContent = skillCards.length;
}

// Optional: Add smooth scroll to skills section when tabs are clicked
categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        // If you want to scroll to skills section on mobile when filtering
        if (window.innerWidth <= 768) {
            const skillsSection = document.getElementById('skills');
            if (skillsSection && !skillsSection.classList.contains('in-view')) {
                setTimeout(() => {
                    skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    });
});

/* ===== About Me Section Animations ===== */
const aboutElements = document.querySelectorAll('.about-card-wrapper');
if (aboutElements.length > 0) {
    const aboutObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Stagger
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

    aboutElements.forEach(el => {
        el.classList.add('fade-in-slide-up');
        aboutObserver.observe(el);
    });
}

/* ===== About Me Stats Count-Up ===== */
const statElements = document.querySelectorAll('.about-stat-count');
if (statElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let current = 0;
                const duration = 2800; // ms
                const incrementTime = 40; // ms
                const steps = duration / incrementTime;
                const increment = Math.ceil(target / steps) || 1;
                
                // Clear existing timer if any
                if(entry.target.timer) clearInterval(entry.target.timer);
                
                entry.target.timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.innerText = target;
                        clearInterval(entry.target.timer);
                    } else {
                        entry.target.innerText = current;
                    }
                }, incrementTime);
            } else {
                // Reset to 0 when out of view so it counts up again next time
                if(entry.target.timer) clearInterval(entry.target.timer);
                entry.target.innerText = "0";
            }
        });
    }, { threshold: 0.5 });

    statElements.forEach(el => statsObserver.observe(el));
}
