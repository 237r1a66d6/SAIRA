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
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Entered Full Name:', fullName);
    console.log('Entered Password:', password);
    
    // Validation
    if (!fullName || !password) {
        showError('errorMessage', 'All fields are required.');
        return;
    }
    
    // Get all users
    const users = getUsers();
    console.log('Total users in storage:', users.length);
    console.log('All users:', users);
    
    // Find user by full name and password
    const user = users.find(u => {
        const nameMatch = u.fullName.toLowerCase() === fullName.toLowerCase();
        const passMatch = u.password === password;
        console.log(`Checking user: ${u.fullName} | Name match: ${nameMatch} | Pass match: ${passMatch}`);
        return nameMatch && passMatch;
    });
    
    if (!user) {
        console.log('❌ LOGIN FAILED - No matching user found');
        showError('errorMessage', 'Invalid credentials. Please check your name and password. DEBUG: Found ' + users.length + ' users total.');
        return;
    }
    
    console.log('✅ LOGIN SUCCESS - User found:', user);
    
    // Set current user
    setCurrentUser(user);
    
    // Redirect to user dashboard
    window.location.href = 'user-dashboard.html';
}
