// Admin Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
});

async function handleAdminLogin(event) {
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
                const response = await api.adminLogin({
                    username,
                    password
                });
                
                console.log('Admin login response:', response);
                
                if (response.success) {
                    // Save token and admin data
                    localStorage.setItem('adminToken', response.token);  // Save as adminToken for dashboard
                    localStorage.setItem('authToken', response.token);    // Also save as authToken for API calls
                    setCurrentAdmin(response.admin);
                    
                    // Redirect to admin dashboard
                    window.location.href = 'admin-dashboard.html';
                    return;
                }
            } catch (apiError) {
                console.log('Backend API unavailable, falling back to localStorage');
            }
        }
        
        // Fallback to localStorage
        console.log('Using localStorage for admin authentication');
        
        // Initialize default admin if needed
        initializeDefaultAdmin();
        
        // Get all admins
        const admins = getAdmins();
        console.log('Available admins:', admins);
        console.log('Trying to login with:', { username, password: '***' });
        
        // Find admin by username and password
        const admin = admins.find(a => {
            console.log('Checking admin:', { 
                username: a?.username, 
                passwordMatch: a?.password === password,
                status: a?.status
            });
            return a && a.username === username && 
                   a.password === password &&
                   (!a.status || a.status === 'active');
        });
        
        if (!admin) {
            console.error('No matching admin found');
            console.log('Available usernames:', admins.map(a => a.username));
            throw new Error('Invalid admin credentials. Please check your username and password.');
        }
        
        console.log('✅ Admin found:', admin.username);
        
        // Set current admin
        setCurrentAdmin(admin);
        
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
        
    } catch (error) {
        console.error('Admin login error:', error);
        showError('errorMessage', error.message || 'Invalid admin credentials. Please check your username and password.');
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Admin Login';
    }
}
