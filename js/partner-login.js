// School Partner Login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const partner = JSON.parse(localStorage.getItem('schoolPartner') || 'null');
    if (partner && partner.token) {
        window.location.href = 'partner-dashboard.html';
        return;
    }

    const loginForm = document.getElementById('partnerLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        // Try backend login first
        if (typeof api !== 'undefined') {
            const response = await api.schoolPartnerLogin({ username, password });
            
            if (response && response.success) {
                // Store partner data
                const partnerData = {
                    token: response.token,
                    ...response.partner,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('schoolPartner', JSON.stringify(partnerData));
                
                // Redirect to dashboard
                window.location.href = 'partner-dashboard.html';
                return;
            }
        }
        
        // Fallback to localStorage
        const partners = JSON.parse(localStorage.getItem('schoolPartners') || '[]');
        const partner = partners.find(p => p.username === username && p.password === password && p.status !== 'inactive');
        
        if (partner) {
            const partnerData = {
                id: partner.id,
                username: partner.username,
                schoolName: partner.name,
                email: partner.email,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('schoolPartner', JSON.stringify(partnerData));
            window.location.href = 'partner-dashboard.html';
        } else {
            showError('Invalid username or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}
