// School Partner Login JavaScript
import { API_BASE_URL } from './api-config.js';

document.getElementById('schoolLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('schoolUsername').value.trim();
    const password = document.getElementById('schoolPassword').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    errorMessage.style.display = 'none';
    
    // First try localStorage (immediate login for admin-created partners)
    const partners = JSON.parse(localStorage.getItem('schoolPartners') || '[]');
    const partner = partners.find(p => p.username === username && p.password === password);
    
    if (partner) {
        // Store partner info for session
        localStorage.setItem('schoolPartner', JSON.stringify({
            id: partner.id || partner._id,
            username: partner.username,
            schoolName: partner.schoolName,
            email: partner.email
        }));
        
        // Redirect to partner dashboard
        window.location.href = 'partner-dashboard.html';
        return;
    }
    
    // If not in localStorage, try backend API
    try {
        const response = await fetch(`${API_BASE_URL}/school-partner/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            // Store token and partner info
            localStorage.setItem('partnerToken', data.token);
            localStorage.setItem('schoolPartner', JSON.stringify(data.partner));
            
            // Redirect to partner dashboard
            window.location.href = 'partner-dashboard.html';
        } else {
            errorMessage.textContent = data.message || 'Invalid username or password';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});
