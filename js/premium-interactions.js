// Ultra Premium Interactions

// 1. 3D Tilt Effect for Cards
class CardTilt {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', () => {
            this.element.style.transition = 'none';
        });

        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }
}

// 2. Magnetic Button Effect
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.magnetStrength = 30;
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.3;
            const deltaY = (e.clientY - centerY) * 0.3;

            this.element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.1)`;
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'translate(0, 0) scale(1)';
        });
    }
}

// 3. Animated Counter
class AnimatedCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
    }

    animate() {
        const start = 0;
        const increment = this.target / (this.duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= this.target) {
                this.element.textContent = this.target.toLocaleString();
                clearInterval(timer);
            } else {
                this.element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
}

// 4. Particle Background
class ParticleBackground {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }

    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.container.style.position = 'relative';
        this.container.insertBefore(this.canvas, this.container.firstChild);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(249, 168, 38, ${particle.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 5. Ripple Effect
function createRipple(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Apply 3D tilt to cards
    const cards = document.querySelectorAll('.course-card, .benefit-card, .process-step, .pricing-card');
    cards.forEach(card => {
        new CardTilt(card);
        card.style.transformStyle = 'preserve-3d';
    });

    // Apply magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-cta, .btn-large');
    buttons.forEach(btn => {
        new MagneticButton(btn);
        btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add ripple effect on click
        btn.addEventListener('click', (e) => createRipple(e, btn));
    });

    // Add particle background to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleBackground(heroSection);
    }

    // Animate statistics if they exist
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    new AnimatedCounter(counter, target).animate();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    .course-card, .benefit-card, .process-step, .pricing-card {
        transform-style: preserve-3d;
        will-change: transform;
    }

    .btn-primary, .btn-cta, .btn-large {
        will-change: transform;
    }
`;
document.head.appendChild(style);
