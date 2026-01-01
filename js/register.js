// Register Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function handleRegister(event) {
    event.preventDefault();
    
    hideError('errorMessage');
    hideSuccess('successMessage');
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const qualification = document.getElementById('qualification').value;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!fullName || !phoneNumber || !qualification || !email || !password || !confirmPassword) {
        showError('errorMessage', 'All fields are required.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('errorMessage', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phoneNumber)) {
        showError('errorMessage', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    if (password.length < 8) {
        showError('errorMessage', 'Password must be at least 8 characters long.');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('errorMessage', 'Passwords do not match.');
        return;
    }
    
    // Check if user already exists
    const users = getUsers();
    console.log('Current users in storage:', users);
    console.log('Checking for email:', email);
    
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        console.log('Found existing user with email:', existingUser);
        showError('errorMessage', 'An account with this email already exists. DEBUG: Found ' + users.length + ' users in storage.');
        return;
    }
    
    // Check if full name is already taken
    const existingName = users.find(user => user.fullName.toLowerCase() === fullName.toLowerCase());
    
    if (existingName) {
        console.log('Found existing user with name:', existingName);
        showError('errorMessage', 'An account with this name already exists. Please use a different name.');
        return;
    }
    
    console.log('No existing user found, proceeding with registration');
    
    // Create new user
    const newUser = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        qualification: qualification,
        email: email,
        password: password,
        registeredDate: new Date().toISOString(),
        progress: 0,
        enrolledCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0
    };
    
    console.log('Creating new user:', newUser);
    
    // Save to localStorage
    users.push(newUser);
    console.log('Users array after push:', users);
    
    saveUsers(users);
    console.log('saveUsers called');
    
    // Verify it was saved
    const savedUsers = getUsers();
    console.log('Verification - users in storage after save:', savedUsers);
    console.log('localStorage.users =', localStorage.getItem('users'));
    
    // Show success message
    showSuccess('successMessage', 'Registration successful! Redirecting to login page...');
    
    // Redirect to login page after 2 seconds
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 2000);
}
