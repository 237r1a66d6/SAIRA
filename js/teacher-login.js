// Teacher Login Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('teacherLoginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Clear previous error messages
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        try {
            // Get teachers from localStorage
            const teachers = getTeachers();
            
            // Find teacher with matching email and password
            const teacher = teachers.find(t => t.email === email && t.password === password);
            
            if (teacher) {
                // Store teacher data in localStorage
                localStorage.setItem('currentTeacher', JSON.stringify(teacher));
                localStorage.setItem('teacherToken', 'teacher-' + Date.now());
                
                // Show success message
                showSuccess('Login successful! Redirecting...');
                
                // Redirect to teacher dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'teacher-dashboard.html';
                }, 1000);
            } else {
                showError('Invalid email or password. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed. Please try again later.');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#dc3545';
    }
    
    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#28a745';
    }
    
    function getTeachers() {
        const teachers = localStorage.getItem('teachers');
        return teachers ? JSON.parse(teachers) : [];
    }
});
