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
        // Use API_BASE_URL if available, otherwise use relative path
        const apiBaseUrl = window.API_BASE_URL || '';
        const apiUrl = `${apiBaseUrl}/api/forms/contact.php`;
        
        console.log('📤 Submitting contact form to:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log('📥 Response status:', response.status);
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Server returned ${response.status}. API file may not be uploaded. Expected JSON but got: ${contentType}`);
        }
        
        const result = await response.json();
        console.log('✅ Response data:', result);
        
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
        console.error('❌ Contact form error:', error);
        const messageElement = document.getElementById('notificationMessage');
        const notification = document.getElementById('customNotification');
        
        // More detailed error message
        if (error.message.includes('404')) {
            messageElement.textContent = 'API endpoint not found. Please contact support.';
        } else if (error.message.includes('500')) {
            messageElement.textContent = 'Server error. Please try again later.';
        } else {
            messageElement.textContent = 'Unable to send message. Please check your connection.';
        }
        
        notification.classList.add('show');
    }
    
    return false;
}
