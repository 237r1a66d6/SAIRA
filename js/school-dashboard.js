// School Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const schoolSession = JSON.parse(localStorage.getItem('schoolSession') || 'null');
    
    if (!schoolSession || schoolSession.userType !== 'school') {
        window.location.href = 'school-login.html';
        return;
    }
    
    // Display school name
    document.getElementById('schoolName').textContent = `School: ${schoolSession.schoolName}`;
    
    // Load profile data
    loadProfile();
    
    // Load dashboard stats
    loadDashboardStats();
});

function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked menu item
    event.target.closest('.menu-item').classList.add('active');
}

function loadProfile() {
    const schoolSession = JSON.parse(localStorage.getItem('schoolSession'));
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    const school = schools.find(s => s.id === schoolSession.id);
    
    if (school) {
        document.getElementById('profileSchoolName').textContent = school.schoolName;
        document.getElementById('profileUsername').textContent = school.username;
        document.getElementById('profileEmail').textContent = school.email;
        document.getElementById('profilePhone').textContent = school.phone || 'Not provided';
        document.getElementById('profileLocation').textContent = school.location || 'Not provided';
        document.getElementById('profileCreated').textContent = new Date(school.createdAt).toLocaleDateString();
    }
}

function loadDashboardStats() {
    // Placeholder for stats - these would come from actual data
    document.getElementById('totalPostings').textContent = '0';
    document.getElementById('totalApplications').textContent = '0';
    document.getElementById('hiredTeachers').textContent = '0';
    document.getElementById('pendingReview').textContent = '0';
}

function showAddJobModal() {
    alert('Job posting feature coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('schoolSession');
        window.location.href = 'school-login.html';
    }
}
