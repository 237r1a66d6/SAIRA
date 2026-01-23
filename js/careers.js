// Careers Page Functions

function getApiBaseUrl() {
    if (window.API_BASE_URL) return window.API_BASE_URL;
    const prod = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (!prod) return 'http://localhost:5000';
    const host = window.location.hostname.replace(/^www\./, '');
    return `https://api.${host}`;
}

// Apply for a role
function applyForRole(roleName) {
    const modal = document.getElementById('applicationModal');
    const positionField = document.getElementById('position');
    
    if (positionField) {
        positionField.value = roleName;
    }
    
    modal.style.display = 'block';
}

// Apply for internship
function applyForInternship() {
    const modal = document.getElementById('applicationModal');
    const positionField = document.getElementById('position');
    
    if (positionField) {
        positionField.value = 'Internship Application';
    }
    
    modal.style.display = 'block';
}

// Apply as general applicant
function applyGeneral() {
    const modal = document.getElementById('applicationModal');
    const positionField = document.getElementById('position');
    
    if (positionField) {
        positionField.value = 'General Application';
    }
    
    modal.style.display = 'block';
}

// Close application form
function closeApplicationForm() {
    document.getElementById('applicationModal').style.display = 'none';
}

// Handle job application submission
async function handleJobApplication(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch(`${getApiBaseUrl()}/api/forms/job-application`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Thank you for your application! Our team will review your profile and contact you if there\'s a match.');
            closeApplicationForm();
            event.target.reset();
        } else {
            alert('There was an error submitting your application. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your application. Please try again.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('applicationModal');
    if (event.target === modal) {
        closeApplicationForm();
    }
}
