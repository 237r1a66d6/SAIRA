// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(event) {
    event.preventDefault();
    
    hideError('errorMessage');
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const password = document.getElementById('password').value;
    
    // Validation
    if (!fullName || !password) {
        showError('errorMessage', 'All fields are required.');
        return;
    }
    
    // Get all users
    const users = getUsers();
    
    // Find user by full name and password
    const user = users.find(u => 
        u.fullName.toLowerCase() === fullName.toLowerCase() && 
        u.password === password
    );
    
    if (!user) {
        showError('errorMessage', 'Invalid credentials. Please check your name and password.');
        return;
    }
    
    // Set current user
    setCurrentUser(user);
    
    // Redirect to user dashboard
    window.location.href = 'user-dashboard.html';
}
