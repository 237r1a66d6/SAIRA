// Work With Us Page Functions

function getApiBaseUrl() {
    if (window.API_BASE_URL) return window.API_BASE_URL;
    const prod = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (!prod) return 'http://localhost';
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
}

// Show school requirement form
function showSchoolForm() {
    document.getElementById('schoolFormModal').style.display = 'block';
}

// Close school form
function closeSchoolForm() {
    document.getElementById('schoolFormModal').style.display = 'none';
}

// Show teacher resume form
function showTeacherForm() {
    document.getElementById('teacherFormModal').style.display = 'block';
}

// Close teacher form
function closeTeacherForm() {
    document.getElementById('teacherFormModal').style.display = 'none';
}

// Show mentor application form
function showMentorForm() {
    document.getElementById('mentorFormModal').style.display = 'block';
}

// Close mentor form
function closeMentorForm() {
    document.getElementById('mentorFormModal').style.display = 'none';
}

// Handle school requirement submission
async function handleSchoolRequirement(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${getApiBaseUrl()}/api/forms/school-requirement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Thank you! Your requirement has been submitted. Our team will contact you within 24 hours with suitable candidates.');
            closeSchoolForm();
            event.target.reset();
        } else {
            alert('There was an error submitting your requirement. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your requirement. Please try again.');
    }
}

// Handle teacher resume submission
async function handleTeacherResume(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const response = await fetch(`${getApiBaseUrl()}/api/forms/teacher-application`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Thank you for submitting your application! Our team will review your profile and contact you with suitable opportunities.');
            closeTeacherForm();
            event.target.reset();
        } else {
            alert('There was an error submitting your application. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your application. Please try again.');
    }
}

// Handle mentor application submission
async function handleMentorApplication(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${getApiBaseUrl()}/api/forms/mentor-application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Thank you for your interest in becoming a mentor! Our team will review your application and contact you soon.');
            closeMentorForm();
            event.target.reset();
        } else {
            alert('There was an error submitting your application. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your application. Please try again.');
    }
}

// Apply for a job
async function applyJob(jobId) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userToken');
    
    if (!isLoggedIn) {
        alert('Please login to apply for jobs.');
        window.location.href = 'login.html';
        return;
    }
    
    // Redirect to application or show application modal
    alert('Application feature will be available in your dashboard. Redirecting...');
    window.location.href = 'user-dashboard.html';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const schoolModal = document.getElementById('schoolFormModal');
    const teacherModal = document.getElementById('teacherFormModal');
    const mentorModal = document.getElementById('mentorFormModal');
    
    if (event.target === schoolModal) {
        closeSchoolForm();
    } else if (event.target === teacherModal) {
        closeTeacherForm();
    } else if (event.target === mentorModal) {
        closeMentorForm();
    }
}
