// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        console.log('Login form found, attaching event listener');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form not found!');
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    hideError('errorMessage');
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const password = document.getElementById('password').value;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Entered Full Name:', fullName);
    
    // Validation
    if (!fullName || !password) {
        showError('errorMessage', 'All fields are required.');
        return;
    }
    
    // Disable submit button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    // Check if backend API is available
    const useBackend = typeof api !== 'undefined';
    
    try {
        if (useBackend) {
            // Try backend API first
            try {
                // For login, we need email but form uses fullName
                // First try to get users to find email by name (fallback)
                const users = getUsers();
                const userByName = users.find(u => u.fullName.toLowerCase() === fullName.toLowerCase());
                
                if (userByName && userByName.email) {
                    // Use the email to login via API
                    const response = await api.loginUser({
                        email: userByName.email,
                        password: password
                    });
                    
                    if (response.success) {
                        saveAuthToken(response.token);
                        setCurrentUser(response.user);
                        
                        console.log('✅ LOGIN SUCCESS via API');
                        window.location.href = 'user-dashboard.html';
                        return;
                    }
                }
                
                // Fallback: try using fullName as email (in case user enters email)
                if (isValidEmail(fullName)) {
                    const response = await api.loginUser({
                        email: fullName,
                        password: password
                    });
                    
                    if (response.success) {
                        saveAuthToken(response.token);
                        setCurrentUser(response.user);
                        
                        console.log('✅ LOGIN SUCCESS via API (email)');
                        window.location.href = 'user-dashboard.html';
                        return;
                    }
                }
            } catch (apiError) {
                console.log('Backend API unavailable, falling back to localStorage');
            }
        }
        
        // Fallback to localStorage (if backend not available or failed)
        console.log('Using localStorage authentication');
        const users = getUsers();
        console.log('Total users in storage:', users.length);
        
        // Find user by full name and password
        const user = users.find(u => {
            const nameMatch = u.fullName.toLowerCase() === fullName.toLowerCase();
            const passMatch = u.password === password;
            console.log(`Checking user: ${u.fullName} | Name match: ${nameMatch} | Pass match: ${passMatch}`);
            return nameMatch && passMatch;
        });
        
        if (!user) {
            console.log('❌ LOGIN FAILED - No matching user found');
            throw new Error('Invalid credentials. Please check your username and password.');
        }
        
        console.log('✅ LOGIN SUCCESS - User found:', user);
        
        // Set current user
        setCurrentUser(user);
        
        // Redirect to user dashboard
        window.location.href = 'user-dashboard.html';
        
    } catch (error) {
        console.error('❌ LOGIN FAILED:', error);
        showError('errorMessage', error.message || 'Invalid credentials. Please check your name/email and password.');
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}
