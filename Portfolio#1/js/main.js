// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });
});

// GSAP Animations Controller
const AnimationController = {
    init() {
        this.initGSAP();
        this.initNavbarScroll();
        this.initHeroAnimations();
        this.initScrollAnimations();
        this.initSkillAnimations();
    },

    initGSAP() {
        gsap.registerPlugin(ScrollTrigger);
    },

    initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    },

    initHeroAnimations() {
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
        
        heroTimeline
            .from('.hero .subtitle', {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2
            })
            .from('.hero h1', {
                y: 40,
                opacity: 0,
                duration: 1
            }, '-=0.8')
            .from('.hero .lead', {
                y: 30,
                opacity: 0,
                duration: 1
            }, '-=0.8')
            .from('.hero .social-links, .hero .cta-buttons', {
                y: 30,
                opacity: 0,
                duration: 1
            }, '-=0.6');
    },

    initScrollAnimations() {
        gsap.utils.toArray('section:not(.hero)').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    },

    initSkillAnimations() {
        gsap.utils.toArray('.skill-item').forEach(skill => {
            const progressBar = skill.querySelector('.progress-bar');
            const width = progressBar.style.width;
            
            gsap.fromTo(progressBar, 
                { width: '0%' },
                {
                    width: width,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: skill,
                        start: 'top 80%'
                    }
                }
            );
        });
    }
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AnimationController.init();
});

// Theme Toggle
const initTheme = () => {
    // Check for saved user preference, if any, on load of the website
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const darkModeOn = localStorage.getItem('darkMode') === 'true' || darkModeMediaQuery.matches;
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', darkModeOn ? 'dark' : 'light');
    
    // Listen for theme toggle clicks
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('darkMode', newTheme === 'dark');
        
        // Optional: Trigger a custom event that other parts of your app can listen to
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    });
    
    // Listen for system theme changes
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('darkMode')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
};

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', initTheme);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReducedMotion() {
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        gsap.globalTimeline.clear();
        AOS.init({ disable: true });
    }
}

prefersReducedMotion.addEventListener('change', handleReducedMotion);
handleReducedMotion();

// Back to top button click handler
const backToTop = document.querySelector('.back-to-top');
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Basic validation
        let isValid = true;
        
        if (!name.trim()) {
            showError('name', 'Name is required');
            isValid = false;
        }
        
        if (!email.trim()) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }
        
        if (!message.trim()) {
            showError('message', 'Message is required');
            isValid = false;
        }
        
        if (isValid) {
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        }
    });
}

// Helper functions
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    
    // Create or update error message
    let errorDiv = field.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    errorDiv.textContent = message;
    
    // Remove error after 3 seconds
    setTimeout(() => {
        field.classList.remove('is-invalid');
        errorDiv.remove();
    }, 3000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add input event listeners to remove error state
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        const errorDiv = this.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
            errorDiv.remove();
        }
    });
});

// Typing Animation
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if(this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = this.txt;

        // Initial Type Speed
        let typeSpeed = 100;

        if(this.isDeleting) {
            typeSpeed /= 2; // Faster when deleting
        }

        // If word is complete
        if(!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
    const txtElement = document.querySelector('.typing-text');
    const words = ['UI/UX Designer', 'Backend Developer', 'Frontend Developer'];
    const wait = 2000;
    
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
}
