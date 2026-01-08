// School Login JavaScript

document.getElementById('schoolLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('schoolUsername').value.trim();
    const password = document.getElementById('schoolPassword').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Get schools from localStorage
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    
    // Find matching school
    const school = schools.find(s => s.username === username && s.password === password);
    
    if (school) {
        // Store session
        const schoolSession = {
            id: school.id,
            username: school.username,
            schoolName: school.schoolName,
            email: school.email,
            loginTime: new Date().toISOString(),
            userType: 'school'
        };
        localStorage.setItem('schoolSession', JSON.stringify(schoolSession));
        
        // Redirect to school dashboard
        window.location.href = 'school-dashboard.html';
    } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.style.display = 'block';
    }
});
