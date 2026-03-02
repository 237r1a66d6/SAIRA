// Register Page JavaScript

// Debug: Log when script loads
console.log('✅ register.js loaded successfully');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOMContentLoaded event fired');
    console.log('📄 Current page:', window.location.href);
    
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        console.log('✅ Register form found, attaching event listener');
        registerForm.addEventListener('submit', handleRegister);
        
        // Debug: List all form elements
        const elements = {
            username: document.getElementById('username'),
            phone: document.getElementById('phone'),
            qualification: document.getElementById('qualification'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword')
        };
        
        console.log('📋 Form elements check:', elements);
        
        // Check if any are missing
        const missing = [];
        for (let key in elements) {
            if (!elements[key]) missing.push(key);
        }
        
        if (missing.length > 0) {
            console.error('❌ Missing form elements:', missing);
        } else {
            console.log('✅ All form elements found');
        }
    } else {
        console.warn('⚠️ Register form not found - this script should only be loaded on register.html');
    }
});

async function handleRegister(event) {
    console.log('🎯 handleRegister function called');
    
    event.preventDefault();
    event.stopPropagation();
    
    console.log('=== REGISTRATION ATTEMPT ===');
    
    // Safely call hideError/hideSuccess
    try {
        hideError('errorMessage');
        hideSuccess('successMessage');
    } catch (e) {
        console.warn('Error calling hide functions:', e);
    }
    
    // Get form elements first (Google's recommended defensive approach)
    console.log('📝 Getting form elements...');
    
    const usernameEl = document.getElementById('username');
    const phoneEl = document.getElementById('phone');
    const qualificationEl = document.getElementById('qualification');
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const confirmPasswordEl = document.getElementById('confirmPassword');
    
    // Log which elements were found
    console.log('Form elements found:', {
        username: !!usernameEl,
        phone: !!phoneEl,
        qualification: !!qualificationEl,
        email: !!emailEl,
        password: !!passwordEl,
        confirmPassword: !!confirmPasswordEl
    });
    
    // Check if ANY element is missing
    if (!usernameEl || !phoneEl || !qualificationEl || !emailEl || !passwordEl || !confirmPasswordEl) {
        const missing = [];
        if (!usernameEl) missing.push('username');
        if (!phoneEl) missing.push('phone');
        if (!qualificationEl) missing.push('qualification');
        if (!emailEl) missing.push('email');
        if (!passwordEl) missing.push('password');
        if (!confirmPasswordEl) missing.push('confirmPassword');
        
        console.error('❌ Missing form elements:', missing);
        alert('Registration form error: Missing form fields (' + missing.join(', ') + '). Please refresh the page.');
        return;
    }
    
    // Now safely get values using optional chaining
    console.log('✅ All elements found, getting values...');
    const username = usernameEl.value?.trim() || '';
    const phone = phoneEl.value?.trim() || '';
    const qualification = qualificationEl.value || '';
    const email = emailEl.value?.trim() || '';
    const password = passwordEl.value || '';
    const confirmPassword = confirmPasswordEl.value || '';
    
    console.log('Form values:', { username, phone, qualification, email, passwordLength: password.length });
    
    // Validation - check for empty values
    if (!username || !phone || !qualification || !email || !password || !confirmPassword) {
        console.error('Validation failed: Missing required fields');
        showError('errorMessage', 'All fields are required.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('errorMessage', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phone)) {
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
                    username,
                    phone,
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
        const existingName = users.find(user => user && user.username && user.username.toLowerCase() === username.toLowerCase());
        if (existingName) {
            throw new Error('⚠️ Username already exists! The username "' + username + '" is already taken. Please choose a different username.');
        }
        
        // Check if email already exists
        const existingUser = users.find(user => user && user.email && user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            throw new Error('⚠️ Email already exists! An account with the email "' + email + '" is already registered. Please use a different email or try logging in.');
        }
        
        // Note: Password can be reused - we don't check for duplicate passwords
        // Users can register with the same password as other users
        
        // Create new user
        const newUser = {
            username: username,
            phone: phone,
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
