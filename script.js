// Resume Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            
            // Simple validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (name === '' || email === '' || subject === '' || message === '') {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Format the subject line to include the sender's name
            const mailtoSubject = encodeURIComponent(`${subject} - from ${name}`);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            
            // Create the mailto URL
            const mailtoUrl = `mailto:bhinrichs1380@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
            
            // Open the user's email client
            window.location.href = mailtoUrl;
            
            // Reset the form after a short delay
            setTimeout(() => {
                this.reset();
            }, 500);
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add skill level tooltips
    const skillLevels = document.querySelectorAll('.skill');
    skillLevels.forEach(skill => {
        const level = skill.textContent;
        skill.setAttribute('title', `${level} proficiency level`);
    });

    // Add print button
    const addPrintButton = () => {
        const footer = document.querySelector('footer');
        if (footer) {
            const printBtn = document.createElement('button');
            printBtn.className = 'btn';
            printBtn.style.marginTop = '20px';
            printBtn.innerHTML = '<i class="fas fa-print"></i> Print Resume';
            printBtn.addEventListener('click', () => {
                window.print();
            });
            
            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            btnContainer.style.textAlign = 'center';
            btnContainer.appendChild(printBtn);
            
            footer.insertBefore(btnContainer, footer.firstChild);
        }
    };
    
    addPrintButton();

    // Portfolio Carousel
    const carousel = document.querySelector('.portfolio-carousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.portfolio-item');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;

        function showItem(index) {
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
                showItem(currentIndex);
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
                showItem(currentIndex);
            });
        }

        // Show the first item initially
        if (items.length > 0) {
            showItem(currentIndex);
        }
    }
});
