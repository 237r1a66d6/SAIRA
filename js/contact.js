// Contact Us Page Functions

// Handle contact form submission
async function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Thank you for contacting us! We will respond to your inquiry within 24 hours.');
            event.target.reset();
        } else {
            alert('There was an error sending your message. Please try again or contact us directly.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again or contact us directly.');
    }
}

// Open live chat
function openLiveChat() {
    // This would integrate with a live chat service like Intercom, Drift, etc.
    alert('Live chat will be available soon! Please email us at info@sairaacad.com or call +91 98765 43210.');
}

// Book consultation
function bookConsultation(type) {
    const modal = document.getElementById('consultationModal');
    const consultationType = document.getElementById('consultationType');
    
    if (consultationType) {
        consultationType.value = type;
    }
    
    // Set minimum date to tomorrow
    const dateInput = document.getElementById('consultDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
}

// Close consultation modal
function closeConsultationModal() {
    document.getElementById('consultationModal').style.display = 'none';
}

// Handle consultation booking
async function handleConsultationBooking(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Add timestamp and status
    const consultation = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        viewed: false
    };
    
    try {
        // Store in localStorage
        const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
        consultations.push(consultation);
        localStorage.setItem('consultations', JSON.stringify(consultations));
        
        // Update unread count for admin notifications
        const unreadCount = consultations.filter(c => !c.viewed).length;
        localStorage.setItem('unreadConsultations', unreadCount.toString());
        
        showCustomNotification('Consultation Booked!', 'Your consultation has been booked! We will send you a confirmation email with meeting details.');
        closeConsultationModal();
        event.target.reset();
    } catch (error) {
        console.error('Error:', error);
        showCustomNotification('Error', 'There was an error booking your consultation. Please try again.', 'error');
    }
}

// Show custom notification
function showCustomNotification(title, message, type = 'success') {
    const notification = document.getElementById('customNotification');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    if (type === 'error') {
        notificationIcon.textContent = '✗';
        notificationIcon.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    } else {
        notificationIcon.textContent = '✓';
        notificationIcon.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
    }
    
    notification.style.display = 'flex';
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
}

// Close custom notification
function closeCustomNotification() {
    const notification = document.getElementById('customNotification');
    notification.classList.remove('show');
    setTimeout(() => {
        notification.style.display = 'none';
    }, 300);
}

// Toggle FAQ
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');
    
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        toggle.textContent = '−';
    } else {
        answer.style.maxHeight = '0';
        toggle.textContent = '+';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('consultationModal');
    if (event.target === modal) {
        closeConsultationModal();
    }
}
