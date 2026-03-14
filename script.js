/**
 * Modern Portfolio - Interactive Features
 * Brandon Hinrichs Professional Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // THEME TOGGLE (DARK MODE)
    // ===================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add rotation animation
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }
    
    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    // ===================================
    // NAVBAR SCROLL EFFECT
    // ===================================
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    function handleNavbarScroll() {
        if (!navbar) return;
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Initial check
    handleNavbarScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navbarMenu.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    }
    
    // ===================================
    // ACTIVE NAVIGATION LINK
    // ===================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    // ===================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when visible
                if (entry.target.classList.contains('skill-item') || 
                    entry.target.classList.contains('timeline-item')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress + '%';
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .skill-category, .portfolio-card, .achievement-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item.visible,
        .skill-category.visible,
        .portfolio-card.visible,
        .achievement-item.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // ===================================
    // SKILL BARS ANIMATION
    // ===================================
    const skillBarsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 200);
                });
                skillBarsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const skillSections = document.querySelectorAll('.skill-category');
    skillSections.forEach(section => {
        skillBarsObserver.observe(section);
    });
    
    // ===================================
    // PORTFOLIO FILTERING
    // ===================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // ===================================
    // CONTACT FORM HANDLING
    // ===================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const subject = document.getElementById('subject')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';
            
            // Validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Create mailto URL
            const mailtoSubject = encodeURIComponent(`${subject} - from ${name}`);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoUrl = `mailto:bhinrichs1380@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
            
            // Open email client
            window.location.href = mailtoUrl;
            
            // Show success message
            showNotification('Opening your email client...', 'success');
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
            }, 500);
        });
    }
    
    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--emerald-500)' : type === 'error' ? 'var(--rose-500)' : 'var(--primary-500)'};
            color: white;
            padding: 16px 24px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add notification animations
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // ===================================
    // DYNAMIC YEAR IN FOOTER
    // ===================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        // Initially hide
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'auto';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        }, { passive: true });
    }
    
    // ===================================
    // TYPING EFFECT FOR HERO (OPTIONAL)
    // ===================================
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        // Add fade-in animation
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.animation = 'fadeInUp 0.8s ease-out 0.3s forwards';
    }
    
    // ===================================
    // STAT COUNTER ANIMATION
    // ===================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const endValue = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(endValue)) {
                    animateValue(entry.target, 0, endValue, 2000);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // ===================================
    // CARD HOVER EFFECTS ENHANCEMENT
    // ===================================
    const cards = document.querySelectorAll('.timeline-card, .portfolio-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.filter = 'blur(2px)';
                    c.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            cards.forEach(c => {
                c.style.filter = '';
                c.style.opacity = '';
            });
        });
    });
    
    // ===================================
    // PRINT FUNCTIONALITY
    // ===================================
    // Add keyboard shortcut for print (Ctrl/Cmd + P)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            // Let the default print dialog handle it
        }
    });
    
    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================
    // Lazy load images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.loading === undefined) {
            // Browser doesn't support native lazy loading
            img.loading = 'lazy';
        }
    });
    
    // ===================================
    // CONSOLE WELCOME MESSAGE
    // ===================================
    console.log('%c👋 Welcome to Brandon Hinrichs Portfolio!', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
    console.log('%cBuilt with modern web technologies and a focus on user experience.', 'font-size: 12px; color: #64748b;');
    console.log('%cInterested in the code? Check out the GitHub repository!', 'font-size: 12px; color: #64748b;');
    
    // ===================================
    // PAGE LOAD ANIMATION
    // ===================================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-out';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});
