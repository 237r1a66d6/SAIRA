// Register Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleRegister(event) {
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
    
    // Disable submit button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    // Check if backend API is available
    const useBackend = typeof api !== 'undefined';
    
    try {
        if (useBackend) {
            // Try backend API first
            try {
                const response = await api.registerUser({
                    fullName,
                    phoneNumber,
                    qualification,
                    email,
                    password
                });
                
                console.log('Registration response:', response);
                
                if (response.success) {
                    // Show success message
                    showSuccess('successMessage', response.message || 'Registration successful! Redirecting to login page...');
                    
                    // Redirect to login page after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                    return;
                }
            } catch (apiError) {
                console.log('Backend API unavailable, falling back to localStorage');
            }
        }
        
        // Fallback to localStorage
        console.log('Using localStorage for registration');
        
        // Check if user already exists
        const users = getUsers();
        console.log('Current users in storage:', users);
        
        // Check if username already exists FIRST (most important check)
        const existingName = users.find(user => user.fullName.toLowerCase() === fullName.toLowerCase());
        if (existingName) {
            throw new Error('⚠️ Username already exists! The username "' + fullName + '" is already taken. Please choose a different username.');
        }
        
        // Check if email already exists
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            throw new Error('⚠️ Email already exists! An account with the email "' + email + '" is already registered. Please use a different email or try logging in.');
        }
        
        // Note: Password can be reused - we don't check for duplicate passwords
        // Users can register with the same password as other users
        
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
        
        // Save to localStorage
        users.push(newUser);
        saveUsers(users);
        
        // Show success message
        showSuccess('successMessage', 'Registration successful! Redirecting to login page...');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        
    } catch (error) {
        console.error('Registration error:', error);
        showError('errorMessage', error.message || 'Registration failed. Please try again.');
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Now';
    }
}
