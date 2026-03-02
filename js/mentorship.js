// Mentorship & Training Page Functions

function getApiBaseUrl() {
    if (window.API_BASE_URL) return window.API_BASE_URL;
    const prod = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (!prod) return 'http://localhost:5000';
    const host = window.location.hostname.replace(/^www\./, '');
    return `https://api.${host}`;
}

// Show enrollment modal
function showEnrollmentForm() {
    document.getElementById('enrollmentModal').style.display = 'block';
}

// Close enrollment modal
function closeEnrollmentForm() {
    document.getElementById('enrollmentModal').style.display = 'none';
}

// Enroll in specific program
function enrollProgram(programType) {
    showEnrollmentForm();
    const programSelect = document.getElementById('program');
    if (programSelect) {
        programSelect.value = programType;
    }
}

// Handle enrollment form submission
async function handleEnrollment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${getApiBaseUrl()}/api/forms/enrollment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Thank you for your enrollment! Our team will contact you within 24 hours.');
            closeEnrollmentForm();
            event.target.reset();
        } else {
            alert('There was an error processing your enrollment. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your enrollment. Please try again.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('enrollmentModal');
    if (event.target === modal) {
        closeEnrollmentForm();
    }
}
