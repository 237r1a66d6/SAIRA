// Careers Page Functions

// Apply for a role
function applyForRole(roleId) {
    const modal = document.getElementById('applicationModal');
    const positionField = document.getElementById('position');
    
    // Set position based on role
    const roleNames = {
        'recruitment-specialist': 'Education Recruitment Specialist',
        'content-writer': 'Educational Content Writer',
        'bd-manager': 'Business Development Manager',
        'software-engineer': 'Senior Software Engineer',
        'career-counselor': 'Career Counselor',
        'digital-marketing': 'Digital Marketing Specialist'
    };
    
    if (positionField && roleNames[roleId]) {
        positionField.value = roleNames[roleId];
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
        const response = await fetch('/api/job-applications', {
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
