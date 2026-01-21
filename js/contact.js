// Contact Us Page Functions

// Handle contact form submission
async function handleContactForm(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = {
        contactName: formData.get('contactName'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        contactSubject: formData.get('contactSubject'),
        contactMessage: formData.get('contactMessage'),
        contactType: formData.get('contactType')
    };
    
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/forms/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        // Show appropriate message
        const messageElement = document.getElementById('notificationMessage');
        const notification = document.getElementById('customNotification');
        
        if (result.duplicate) {
            messageElement.textContent = 'Already Submitted';
        } else if (result.success) {
            messageElement.textContent = 'Message Sent Successfully!';
            event.target.reset(); // Clear form on success
        } else {
            messageElement.textContent = 'Something went wrong. Please try again.';
        }
        
        notification.classList.add('show');
    } catch (error) {
        console.error('Error:', error);
        const messageElement = document.getElementById('notificationMessage');
        const notification = document.getElementById('customNotification');
        messageElement.textContent = 'Unable to send message. Please check your connection.';
        notification.classList.add('show');
    }
    
    return false;
}
