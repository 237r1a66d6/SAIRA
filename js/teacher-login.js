// Teacher Login Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('teacherLoginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Clear previous error messages
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Basic validation
        if (!username || !password) {
            showError('Please fill in all fields');
            return;
        }

        try {
            // For now, we'll use a simple authentication
            // In production, this should connect to your backend API
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Store user data in localStorage
                localStorage.setItem('teacherToken', data.token);
                localStorage.setItem('teacherData', JSON.stringify(data.user));
                
                // Redirect to teacher dashboard
                window.location.href = 'teacher-dashboard.html';
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed. Please try again later.');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
