// Teacher Dashboard Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const teacherToken = localStorage.getItem('teacherToken');
    const teacherData = localStorage.getItem('teacherData');

    if (!teacherToken || !teacherData) {
        window.location.href = 'teacher-login.html';
        return;
    }

    const teacher = JSON.parse(teacherData);
    
    // Display teacher name
    const teacherNameElements = document.querySelectorAll('#teacherName, #teacherNameDisplay');
    teacherNameElements.forEach(el => {
        el.textContent = teacher.name || teacher.username || 'Teacher';
    });

    // Populate profile information
    if (document.getElementById('profileFullName')) {
        document.getElementById('profileFullName').textContent = teacher.name || 'N/A';
    }
    if (document.getElementById('profileUsername')) {
        document.getElementById('profileUsername').textContent = teacher.username || 'N/A';
    }
    if (document.getElementById('profileEmail')) {
        document.getElementById('profileEmail').textContent = teacher.email || 'N/A';
    }
    if (document.getElementById('profilePhone')) {
        document.getElementById('profilePhone').textContent = teacher.phone || 'N/A';
    }
    if (document.getElementById('profileJoinDate')) {
        const joinDate = teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : 'N/A';
        document.getElementById('profileJoinDate').textContent = joinDate;
    }

    // Set random stats (in production, fetch from API)
    document.getElementById('totalCourses').textContent = '3';
    document.getElementById('completedCourses').textContent = '1';
    document.getElementById('certifications').textContent = '1';
    document.getElementById('learningHours').textContent = '45';

    // Load dashboard data
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const teacherToken = localStorage.getItem('teacherToken');
        
        // In production, fetch actual data from API
        // const response = await fetch(`${API_BASE_URL}/api/teachers/dashboard`, {
        //     headers: {
        //         'Authorization': `Bearer ${teacherToken}`
        //     }
        // });
        
        // For now, we'll use mock data
        console.log('Dashboard data loaded');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

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
    const clickedMenuItem = event?.target.closest('.menu-item');
    if (clickedMenuItem) {
        clickedMenuItem.classList.add('active');
    }
}

function logout() {
    // Clear stored data
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherData');
    
    // Redirect to login page
    window.location.href = 'teacher-login.html';
}

// Make functions globally available
window.showTab = showTab;
window.logout = logout;
