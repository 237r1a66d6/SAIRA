// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu toggle button
    const containernav = document.querySelector('.containernav');
    const navMenu = document.querySelector('.nav-menu');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (!containernav || !navMenu) return;

    // Create hamburger button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
    mobileToggle.innerHTML = `
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // Clone nav buttons for mobile menu
    if (navButtons) {
        const mobileButtons = navButtons.cloneNode(true);
        mobileButtons.classList.add('mobile');
        containernav.appendChild(mobileButtons);
        
        // Store reference to mobile buttons
        window.mobileButtonsElement = mobileButtons;
    }
    
    // Insert toggle button before nav-buttons
    if (navButtons) {
        containernav.insertBefore(mobileToggle, navButtons);
    } else {
        containernav.appendChild(mobileToggle);
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('mobile-active') ? 'hidden' : '';
        
        // Add show class after a brief delay for animation
        if (navMenu.classList.contains('mobile-active')) {
            setTimeout(() => {
                navMenu.classList.add('show');
                if (window.mobileButtonsElement) {
                    window.mobileButtonsElement.classList.add('show');
                }
            }, 10);
        } else {
            navMenu.classList.remove('show');
            if (window.mobileButtonsElement) {
                window.mobileButtonsElement.classList.remove('show');
            }
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('mobile-active', 'show');
        overlay.classList.remove('active');
        if (window.mobileButtonsElement) {
            window.mobileButtonsElement.classList.remove('show');
        }
        document.body.style.overflow = '';
    }

    // Event listeners
    mobileToggle.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);

    // Close menu when clicking nav links (except dropdown button)
    const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-btn)');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Handle dropdown in mobile menu
    const dropdownBtns = navMenu.querySelectorAll('.dropdown-btn');
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });

    // Close dropdown links in mobile
    const dropdownLinks = navMenu.querySelectorAll('.dropdown-content a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968) {
            closeMobileMenu();
        }
    });
});
