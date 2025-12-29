// Admin Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
});

function handleAdminLogin(event) {
    event.preventDefault();
    
    hideError('errorMessage');
    
    // Get form values
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    // Validation
    if (!username || !password) {
        showError('errorMessage', 'All fields are required.');
        return;
    }
    
    // Get all admins
    const admins = getAdmins();
    
    // Find admin by username and password
    const admin = admins.find(a => 
        a.username === username && 
        a.password === password &&
        a.status === 'active'
    );
    
    if (!admin) {
        showError('errorMessage', 'Invalid admin credentials. Please check your username and password.');
        return;
    }
    
    // Set current admin
    setCurrentAdmin(admin);
    
    // Redirect to admin dashboard
    window.location.href = 'admin-dashboard.html';
}
