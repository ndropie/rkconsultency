// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Active link highlighting
function setActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const id = section.getAttribute('id');
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// Project data
const projects = [
    {
        title: "Open-Pit Mine Optimization",
        description: "Comprehensive analysis and optimization of extraction methods for a large-scale open-pit mining operation.",
        category: "Mining",
        image: "images/project1.jpeg"
    },
    {
        title: "Sustainable Mining Practices",
        description: "Development of environmentally sustainable mining practices with minimal ecological impact.",
        category: "Mining",
        image: "images/project2.jpeg"
    },
    {
        title: "Mining Equipment Optimization",
        description: "Analysis and optimization of heavy mining equipment fleet for maximum efficiency.",
        category: "Mining",
        image: "images/project3.jpeg"
    },
];

// Project filtering functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectGrid = document.querySelector('.project-grid');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Clear existing projects
        projectGrid.innerHTML = '';
        
        // Filter and load projects
        const filteredProjects = filterValue === 'all' 
            ? projects 
            : projects.filter(project => project.category === filterValue);
            
        loadFilteredProjects(filteredProjects);
    });
});

// Load filtered projects with animation
function loadFilteredProjects(projectsToLoad) {
    const projectGrid = document.querySelector('.project-grid');
    projectGrid.innerHTML = ''; // Clear existing projects
    
    projectsToLoad.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-overlay">
                    <span class="project-category">${project.category}</span>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="#contact" class="project-link">Learn More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        projectGrid.appendChild(projectCard);
        
        // Add animation class after a brief delay
        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Update the loadProjects function to use the new loading mechanism
function loadProjects() {
    loadFilteredProjects(projects);
}

// Smooth scrolling with offset for header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Form submission with validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const nameInput = this.querySelector('input[name="name"]');
        const emailInput = this.querySelector('input[name="email"]');
        const subjectInput = this.querySelector('input[name="subject"]');
        const messageInput = this.querySelector('textarea[name="message"]');
        const submitButton = this.querySelector('button[type="submit"]');
        
        // Reset previous errors
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
        
        // Validation
        let isValid = true;
        const showError = (input, message) => {
            isValid = false;
            input.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            input.parentElement.appendChild(errorDiv);
        };
        
        // Name validation
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
        }
        
        // Subject validation
        if (!subjectInput.value.trim()) {
            showError(subjectInput, 'Subject is required');
        }
        
        // Message validation
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
        }
        
        if (isValid) {
            try {
                // Disable submit button and show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Send form data to Web3Forms
                const formData = new FormData(this);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message. We will get back to you soon!';
                    this.appendChild(successMessage);
                    
                    // Reset form
                    this.reset();
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Sorry, there was an error sending your message. Please try again.';
                this.appendChild(errorMessage);
                console.error('Form submission failed:', error);
            } finally {
                // Re-enable submit button and restore original text
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
            }
        }
    });
    
    // Clear error when user starts typing
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    });
}

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .about-content, .contact-card').forEach(el => {
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
});
