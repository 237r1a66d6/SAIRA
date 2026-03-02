// User Dashboard JavaScript

let currentUserTab = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = checkAuth('user');
    if (!user) return;
    
    // Display user name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `Welcome, ${user.username || 'User'}`;
    }
    
    // Load user data
    loadUserDashboard(user);
});

function showUserTab(tabName) {
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
    
    currentUserTab = tabName;
}

function loadUserDashboard(user) {
    // Welcome name
    const welcomeElement = document.getElementById('welcomeName');
    if (welcomeElement) {
        welcomeElement.textContent = user.username || 'User';
    }
    
    // Stats
    document.getElementById('enrolledCourses').textContent = user.enrolledCourses || 0;
    document.getElementById('completedCourses').textContent = user.completedCourses || 0;
    document.getElementById('inProgressCourses').textContent = user.inProgressCourses || 0;
    document.getElementById('userProgress').textContent = (user.progress || 0) + '%';
    
    // User info
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPhone').textContent = user.phone || user.phoneNumber || 'N/A';
    document.getElementById('userQualification').textContent = user.qualification || 'N/A';
    document.getElementById('memberSince').textContent = formatDate(user.created_at || user.registeredDate);
    
    // Profile tab
    const initial = (user.username || 'U').charAt(0).toUpperCase();
    document.getElementById('profileInitial').textContent = initial;
    document.getElementById('profileName').textContent = user.username || 'User';
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileFullName').textContent = user.username || 'User';
    document.getElementById('profileEmailAddress').textContent = user.email;
    document.getElementById('profilePhone').textContent = user.phone || user.phoneNumber || 'N/A';
    document.getElementById('profileQualification').textContent = user.qualification || 'N/A';
    document.getElementById('profileMemberSince').textContent = formatDate(user.created_at || user.registeredDate);
}

function enrollCourse(courseName) {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login to enroll in courses.');
        return;
    }
    
    // Get user courses
    const courses = getUserCourses(user.email);
    
    // Check if already enrolled
    const existingCourse = courses.find(c => c.name === courseName);
    if (existingCourse) {
        alert('You are already enrolled in this course!');
        return;
    }
    
    // Add course
    const newCourse = {
        name: courseName,
        enrolledDate: new Date().toISOString(),
        progress: 0,
        status: 'in-progress'
    };
    
    courses.push(newCourse);
    saveUserCourses(user.email, courses);
    
    // Update user stats
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex].enrolledCourses = courses.length;
        users[userIndex].inProgressCourses = courses.filter(c => c.status === 'in-progress').length;
        users[userIndex].completedCourses = courses.filter(c => c.status === 'completed').length;
        
        // Calculate average progress
        let totalProgress = 0;
        courses.forEach(c => {
            totalProgress += c.progress || 0;
        });
        users[userIndex].progress = courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;
        
        saveUsers(users);
        setCurrentUser(users[userIndex]);
        
        // Reload dashboard
        loadUserDashboard(users[userIndex]);
    }
    
    alert(`Successfully enrolled in ${courseName}! You can now access the course materials.`);
}

// Edit Profile Functions
function showEditProfileModal() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login first.');
        return;
    }
    
    // Fill form with current user data
    document.getElementById('editProfileOldEmail').value = user.email;
    document.getElementById('editProfileName').value = user.username || '';
    document.getElementById('editProfileEmail').value = user.email;
    document.getElementById('editProfilePhone').value = user.phone || user.phoneNumber || '';
    document.getElementById('editProfileQualification').value = user.qualification || '';
    document.getElementById('editProfilePassword').value = '';
    document.getElementById('confirmEditProfilePassword').value = '';
    
    const modal = document.getElementById('editProfileModal');
    modal.classList.add('show');
    hideError('editProfileModalError');
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    modal.classList.remove('show');
    document.getElementById('editProfileForm').reset();
}

// Handle Edit Profile Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleEditProfile();
        });
    }
});

function handleEditProfile() {
    hideError('editProfileModalError');
    
    const oldEmail = document.getElementById('editProfileOldEmail').value;
    const fullName = document.getElementById('editProfileName').value.trim();
    const newEmail = document.getElementById('editProfileEmail').value.trim();
    const phoneNumber = document.getElementById('editProfilePhone').value.trim();
    const qualification = document.getElementById('editProfileQualification').value;
    const newPassword = document.getElementById('editProfilePassword').value;
    const confirmPassword = document.getElementById('confirmEditProfilePassword').value;
    
    // Validation
    if (!fullName || !newEmail || !phoneNumber || !qualification) {
        showError('editProfileModalError', 'All required fields must be filled.');
        return;
    }
    
    if (!isValidEmail(newEmail)) {
        showError('editProfileModalError', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phoneNumber)) {
        showError('editProfileModalError', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    // Check if new email already exists (if email changed)
    if (oldEmail !== newEmail) {
        const users = getUsers();
        const existingUser = users.find(u => u.email === newEmail);
        if (existingUser) {
            showError('editProfileModalError', 'A user with this email already exists.');
            return;
        }
    }
    
    // Validate password if provided
    if (newPassword) {
        if (newPassword.length < 8) {
            showError('editProfileModalError', 'Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            showError('editProfileModalError', 'Passwords do not match.');
            return;
        }
    }
    
    // Update user
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === oldEmail);
    
    if (userIndex === -1) {
        showError('editProfileModalError', 'User not found!');
        return;
    }
    
    users[userIndex].fullName = fullName;
    users[userIndex].email = newEmail;
    users[userIndex].phoneNumber = phoneNumber;
    users[userIndex].qualification = qualification;
    
    // Update password if provided
    if (newPassword) {
        users[userIndex].password = newPassword;
    }
    
    saveUsers(users);
    
    // Update current user session
    setCurrentUser(users[userIndex]);
    
    // Reload dashboard with updated data
    loadUserDashboard(users[userIndex]);
    
    // Update navbar
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `Welcome, ${fullName}`;
    }
    
    closeEditProfileModal();
    
    alert('Profile updated successfully!');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}
