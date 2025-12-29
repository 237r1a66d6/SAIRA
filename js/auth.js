// Authentication and Database Utility Functions

// Initialize default admin on first load
function initializeDefaultAdmin() {
    const admins = getAdmins();
    if (admins.length === 0) {
        const defaultAdmin = {
            username: 'admin',
            password: '1234567@_a',
            createdDate: new Date().toISOString(),
            status: 'active'
        };
        admins.push(defaultAdmin);
        localStorage.setItem('admins', JSON.stringify(admins));
    }
}

// Get all admins from localStorage
function getAdmins() {
    const admins = localStorage.getItem('admins');
    return admins ? JSON.parse(admins) : [];
}

// Save admins to localStorage
function saveAdmins(admins) {
    localStorage.setItem('admins', JSON.stringify(admins));
}

// Get all users from localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current logged-in user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Set current logged-in user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Get current logged-in admin
function getCurrentAdmin() {
    const admin = localStorage.getItem('currentAdmin');
    return admin ? JSON.parse(admin) : null;
}

// Set current logged-in admin
function setCurrentAdmin(admin) {
    localStorage.setItem('currentAdmin', JSON.stringify(admin));
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function checkAuth(requiredType) {
    if (requiredType === 'admin') {
        const admin = getCurrentAdmin();
        if (!admin) {
            window.location.href = 'admin-login.html';
            return false;
        }
        return admin;
    } else if (requiredType === 'user') {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return false;
        }
        return user;
    }
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Hide error message
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Show success message
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
    }
}

// Hide success message
function hideSuccess(elementId) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.style.display = 'none';
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number (10 digits)
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get user progress (random for demo purposes)
function getUserProgress(email) {
    const courses = getUserCourses(email);
    if (courses.length === 0) return 0;
    
    let totalProgress = 0;
    courses.forEach(course => {
        totalProgress += course.progress || 0;
    });
    
    return Math.round(totalProgress / courses.length);
}

// Get user courses
function getUserCourses(email) {
    const coursesKey = `courses_${email}`;
    const courses = localStorage.getItem(coursesKey);
    return courses ? JSON.parse(courses) : [];
}

// Save user courses
function saveUserCourses(email, courses) {
    const coursesKey = `courses_${email}`;
    localStorage.setItem(coursesKey, JSON.stringify(courses));
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultAdmin();
});
