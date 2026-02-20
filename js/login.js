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
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Entered identifier:', identifier);
    
    // Validation
    if (!identifier || !password) {
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
            // Try backend API first with identifier (email or fullName) and password
            try {
                const response = await api.loginUser({
                    identifier: identifier,
                    password: password
                });
                
                if (response.success) {
                    saveAuthToken(response.token);
                    setCurrentUser(response.user);
                    
                    console.log('✅ LOGIN SUCCESS via API');
                    window.location.href = 'user-dashboard.html';
                    return;
                } else {
                    // API returned error
                    throw new Error(response.message || 'Login failed');
                }
            } catch (apiError) {
                console.log('Backend API error:', apiError.message);
                // If it's a network error, fall back to localStorage
                // If it's an authentication error, throw it
                if (apiError.message && !apiError.message.includes('fetch') && !apiError.message.includes('network')) {
                    throw apiError;
                }
                console.log('Falling back to localStorage');
            }
        }
        
        // Fallback to localStorage (if backend not available or failed)
        console.log('Using localStorage authentication');
        const users = getUsers();
        console.log('Total users in storage:', users.length);
        
        // Check if identifier is an email
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        
        // Find user by email or full name and password
        const user = users.find(u => {
            const match = isEmail 
                ? u.email && u.email.toLowerCase() === identifier.toLowerCase()
                : u.fullName.toLowerCase() === identifier.toLowerCase();
            const passMatch = u.password === password;
            console.log(`Checking user: ${u.fullName} (${u.email}) | Match: ${match} | Pass match: ${passMatch}`);
            return match && passMatch;
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
