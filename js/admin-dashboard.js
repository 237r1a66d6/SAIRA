// Admin Dashboard JavaScript

let currentTab = 'overview';
let adminListCache = [];
let adminSource = 'local';

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const admin = checkAuth('admin');
    if (!admin) return;
    
    // Display admin name
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = `Admin: ${admin.username}`;
    }
    
    // Load initial data
    await loadDashboardData();
    
    // Setup modal event listeners
    setupModalListeners();
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
    
    // Load data for the tab
    if (tabName === 'admin-management') {
        loadAdminManagement();
    } else if (tabName === 'user-management') {
        loadUserManagement();
    } else if (tabName === 'debug-storage') {
        refreshDebugData();
    }
    
    currentTab = tabName;
}

async function loadDashboardData() {
    const admins = await fetchAdmins();
    const users = getUsers(); // users remain local for now
    
    document.getElementById('totalAdmins').textContent = admins.length;
    document.getElementById('totalUsers').textContent = users.length;
}

// Fetch admins from backend when possible; fallback to localStorage
async function fetchAdmins(forceRefresh = false) {
    if (!forceRefresh && adminListCache.length > 0) {
        return adminListCache;
    }

    if (typeof api !== 'undefined') {
        try {
            const response = await api.getAllAdmins();
            if (response && response.success && Array.isArray(response.admins)) {
                adminSource = 'backend';
                adminListCache = response.admins.map(a => ({
                    ...a,
                    createdDate: a.createdDate || a.createdAt || a.created_on || new Date().toISOString()
                }));
                return adminListCache;
            }
        } catch (error) {
            console.warn('Fetch admins via backend failed, using localStorage', error);
        }
    }

    adminSource = 'local';
    adminListCache = getAdmins().map(a => ({
        ...a,
        createdDate: a.createdDate || new Date().toISOString()
    }));
    return adminListCache;
}

async function loadAdminManagement() {
    const admins = await fetchAdmins();
    const tableBody = document.getElementById('adminTableBody');
    
    if (admins.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="no-data">No admins found</td></tr>';
        return;
    }
    
    let html = '';
    admins.forEach(admin => {
        const adminId = admin._id || admin.id || admin.username;
        html += `
            <tr>
                <td>${admin.username}</td>
                <td>${formatDate(admin.createdDate)}</td>
                <td><span class="status-badge ${admin.status}">${admin.status}</span></td>
                <td>
                    ${admin.username !== 'admin' ? `
                        <button class="action-btn edit" onclick="editAdmin('${adminId}')">Edit</button>
                        <button class="action-btn delete" onclick="deleteAdmin('${adminId}')">Delete</button>
                    ` : '<em>Default Admin</em>'}
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function loadUserManagement() {
    const users = getUsers();
    const tableBody = document.getElementById('userTableBody');
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
        return;
    }
    
    let html = '';
    users.forEach(user => {
        const progress = getUserProgress(user.email);
        html += `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.qualification}</td>
                <td>${progress}%</td>
                <td>
                    <button class="action-btn edit" onclick="editUser('${user.email}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteUser('${user.email}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Modal Functions
function setupModalListeners() {
    // Add Admin Form
    const addAdminForm = document.getElementById('addAdminForm');
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', handleAddAdmin);
    }
    
    // Add User Form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }
    
    // Edit User Form
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', handleEditUser);
    }
    
    // Edit Admin Form
    const editAdminForm = document.getElementById('editAdminForm');
    if (editAdminForm) {
        editAdminForm.addEventListener('submit', handleEditAdmin);
    }
}

function showAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    modal.classList.add('show');
    hideError('adminModalError');
}

function closeAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    modal.classList.remove('show');
    document.getElementById('addAdminForm').reset();
}

function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.classList.add('show');
    hideError('userModalError');
}

function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.classList.remove('show');
    document.getElementById('addUserForm').reset();
}

function showEditUserModal() {
    const modal = document.getElementById('editUserModal');
    modal.classList.add('show');
    hideError('editUserModalError');
}

function closeEditUserModal() {
    const modal = document.getElementById('editUserModal');
    modal.classList.remove('show');
    document.getElementById('editUserForm').reset();
}

function showEditAdminModal() {
    const modal = document.getElementById('editAdminModal');
    modal.classList.add('show');
    hideError('editAdminModalError');
}

function closeEditAdminModal() {
    const modal = document.getElementById('editAdminModal');
    modal.classList.remove('show');
    document.getElementById('editAdminForm').reset();
}

// Add Admin Handler
async function handleAddAdmin(event) {
    event.preventDefault();
    hideError('adminModalError');
    
    const username = document.getElementById('newAdminUsername').value.trim();
    const password = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('confirmAdminPassword').value;
    
    // Validation
    if (!username || !password || !confirmPassword) {
        showError('adminModalError', 'All fields are required.');
        return;
    }
    
    if (password.length < 8) {
        showError('adminModalError', 'Password must be at least 8 characters long.');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('adminModalError', 'Passwords do not match.');
        return;
    }
    
    try {
        // Prefer backend when available
        if (typeof api !== 'undefined') {
            try {
                const response = await api.createAdmin({ username, password });
                if (response && response.success) {
                    await fetchAdmins(true);
                    closeAddAdminModal();
                    loadAdminManagement();
                    loadDashboardData();
                    alert('Admin added successfully!');
                    return;
                }
            } catch (apiError) {
                console.warn('Backend create admin failed, falling back to localStorage', apiError);
            }
        }

        // Fallback to localStorage
        const admins = getAdmins();
        const existingAdmin = admins.find(a => a.username === username);
        
        if (existingAdmin) {
            showError('adminModalError', 'Admin with this username already exists.');
            return;
        }
        
        const newAdmin = {
            username: username,
            password: password,
            createdDate: new Date().toISOString(),
            status: 'active'
        };
        
        admins.push(newAdmin);
        saveAdmins(admins);
        adminListCache = admins;
        adminSource = 'local';
        
        closeAddAdminModal();
        loadAdminManagement();
        loadDashboardData();
        
        alert('Admin added successfully!');
    } catch (error) {
        console.error('Add admin error:', error);
        showError('adminModalError', error.message || 'Unable to add admin');
    }
}

// Add User Handler
function handleAddUser(event) {
    event.preventDefault();
    hideError('userModalError');
    
    const fullName = document.getElementById('newUserName').value.trim();
    const phoneNumber = document.getElementById('newUserPhone').value.trim();
    const qualification = document.getElementById('newUserQualification').value;
    const email = document.getElementById('newUserEmail').value.trim();
    const password = document.getElementById('newUserPassword').value;
    
    // Validation
    if (!fullName || !phoneNumber || !qualification || !email || !password) {
        showError('userModalError', 'All fields are required.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('userModalError', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phoneNumber)) {
        showError('userModalError', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    if (password.length < 8) {
        showError('userModalError', 'Password must be at least 8 characters long.');
        return;
    }
    
    // Check if user exists
    const users = getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showError('userModalError', 'User with this email already exists.');
        return;
    }
    
    // Create new user
    const newUser = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        qualification: qualification,
        email: email,
        password: password,
        registeredDate: new Date().toISOString(),
        progress: 0,
        enrolledCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0
    };
    
    users.push(newUser);
    saveUsers(users);
    
    closeAddUserModal();
    loadUserManagement();
    loadDashboardData();
    
    alert('User added successfully!');
}

// Edit User Functions
function editUser(email) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        alert('User not found!');
        return;
    }
    
    // Fill form with user data
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserName').value = user.fullName;
    document.getElementById('editUserNewEmail').value = user.email;
    document.getElementById('editUserPhone').value = user.phoneNumber;
    document.getElementById('editUserQualification').value = user.qualification;
    document.getElementById('editUserPassword').value = '';
    document.getElementById('confirmEditUserPassword').value = '';
    
    showEditUserModal();
}

function handleEditUser(event) {
    event.preventDefault();
    hideError('editUserModalError');
    
    const oldEmail = document.getElementById('editUserEmail').value;
    const fullName = document.getElementById('editUserName').value.trim();
    const newEmail = document.getElementById('editUserNewEmail').value.trim();
    const phoneNumber = document.getElementById('editUserPhone').value.trim();
    const qualification = document.getElementById('editUserQualification').value;
    const newPassword = document.getElementById('editUserPassword').value;
    const confirmPassword = document.getElementById('confirmEditUserPassword').value;
    
    // Validation
    if (!fullName || !newEmail || !phoneNumber || !qualification) {
        showError('editUserModalError', 'All required fields must be filled.');
        return;
    }
    
    if (!isValidEmail(newEmail)) {
        showError('editUserModalError', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phoneNumber)) {
        showError('editUserModalError', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    // Check if new email already exists (if email changed)
    if (oldEmail !== newEmail) {
        const users = getUsers();
        const existingUser = users.find(u => u.email === newEmail);
        if (existingUser) {
            showError('editUserModalError', 'A user with this email already exists.');
            return;
        }
    }
    
    // Validate password if provided
    if (newPassword) {
        if (newPassword.length < 8) {
            showError('editUserModalError', 'Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            showError('editUserModalError', 'Passwords do not match.');
            return;
        }
    }
    
    // Update user
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === oldEmail);
    
    if (userIndex === -1) {
        showError('editUserModalError', 'User not found!');
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
    
    // Update current user if editing logged in user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.email === oldEmail) {
        setCurrentUser(users[userIndex]);
    }
    
    closeEditUserModal();
    loadUserManagement();
    loadDashboardData();
    
    alert('User updated successfully!');
}

// Edit Admin Functions
function editAdmin(adminId) {
    const admin = adminListCache.find(a => (a._id || a.id || a.username) === adminId);
    
    if (!admin) {
        alert('Admin not found!');
        return;
    }
    
    // Fill form with admin data
    document.getElementById('editAdminUsername').value = admin.username;
    document.getElementById('editAdminId').value = admin._id || admin.id || admin.username;
    document.getElementById('editAdminNewUsername').value = admin.username;
    document.getElementById('editAdminPassword').value = '';
    document.getElementById('confirmEditAdminPassword').value = '';
    
    showEditAdminModal();
}

async function handleEditAdmin(event) {
    event.preventDefault();
    hideError('editAdminModalError');
    
    const oldUsername = document.getElementById('editAdminUsername').value;
    const adminId = document.getElementById('editAdminId').value;
    const newUsername = document.getElementById('editAdminNewUsername').value.trim();
    const newPassword = document.getElementById('editAdminPassword').value;
    const confirmPassword = document.getElementById('confirmEditAdminPassword').value;

    // Validate password if provided
    if (newPassword) {
        if (newPassword.length < 8) {
            showError('editAdminModalError', 'Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            showError('editAdminModalError', 'Passwords do not match.');
            return;
        }
    }
    
    // Validation
    if (!newUsername) {
        showError('editAdminModalError', 'Username is required.');
        return;
    }
    
    try {
        // Try backend first
        if (typeof api !== 'undefined') {
            try {
                const payload = { username: newUsername };
                if (newPassword) payload.password = newPassword;
                const response = await api.updateAdmin(adminId, payload);
                if (response && response.success) {
                    await fetchAdmins(true);
                    closeEditAdminModal();
                    loadAdminManagement();
                    loadDashboardData();
                    alert('Admin updated successfully!');
                    return;
                }
            } catch (apiError) {
                console.warn('Backend update admin failed, falling back to localStorage', apiError);
            }
        }
    
        // Fallback to localStorage
        if (newPassword) {
            if (newPassword.length < 8) {
                showError('editAdminModalError', 'Password must be at least 8 characters long.');
                return;
            }
            if (newPassword !== confirmPassword) {
                showError('editAdminModalError', 'Passwords do not match.');
                return;
            }
        }

        const admins = getAdmins();
        if (oldUsername !== newUsername) {
            const existingAdmin = admins.find(a => a.username === newUsername);
            if (existingAdmin) {
                showError('editAdminModalError', 'An admin with this username already exists.');
                return;
            }
        }

        const adminIndex = admins.findIndex(a => a.username === oldUsername);
        
        if (adminIndex === -1) {
            showError('editAdminModalError', 'Admin not found!');
            return;
        }
        
        admins[adminIndex].username = newUsername;
        
        if (newPassword) {
            admins[adminIndex].password = newPassword;
        }
        
        saveAdmins(admins);
        adminListCache = admins;
        adminSource = 'local';
        
        const currentAdmin = getCurrentAdmin();
        if (currentAdmin && currentAdmin.username === oldUsername) {
            setCurrentAdmin(admins[adminIndex]);
            const adminNameElement = document.getElementById('adminName');
            if (adminNameElement) {
                adminNameElement.textContent = `Admin: ${newUsername}`;
            }
        }
        
        closeEditAdminModal();
        loadAdminManagement();
        loadDashboardData();
        
        alert('Admin updated successfully!');
    } catch (error) {
        console.error('Edit admin error:', error);
        showError('editAdminModalError', error.message || 'Unable to update admin');
    }
}

// Delete Functions
async function deleteAdmin(adminId) {
    if (!confirm('Are you sure you want to delete this admin?')) {
        return;
    }
    
    try {
        if (typeof api !== 'undefined') {
            try {
                const response = await api.deleteAdmin(adminId);
                if (response && response.success) {
                    await fetchAdmins(true);
                    loadAdminManagement();
                    loadDashboardData();
                    alert('Admin deleted successfully!');
                    return;
                }
            } catch (apiError) {
                console.warn('Backend delete admin failed, falling back to localStorage', apiError);
            }
        }

        const admins = getAdmins();
        const adminToDelete = admins.find(a => (a._id || a.id || a.username) === adminId);
        if (adminToDelete && adminToDelete.username === 'admin') {
            alert('Cannot delete the default admin!');
            return;
        }

        const filteredAdmins = admins.filter(a => (a._id || a.id || a.username) !== adminId);
        saveAdmins(filteredAdmins);
        adminListCache = filteredAdmins;
        adminSource = 'local';
        loadAdminManagement();
        loadDashboardData();
        
        alert('Admin deleted successfully!');
    } catch (error) {
        console.error('Delete admin error:', error);
        alert(error.message || 'Unable to delete admin');
    }
}

function deleteUser(email) {
    if (!confirm(`Are you sure you want to delete this user?`)) {
        return;
    }
    
    const users = getUsers();
    const filteredUsers = users.filter(u => u.email !== email);
    
    saveUsers(filteredUsers);
    loadUserManagement();
    loadDashboardData();
    
    alert('User deleted successfully!');
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// Debug Storage Functions
async function refreshDebugData() {
    // Get users
    const users = getUsers();
    document.getElementById('debugUsersData').textContent = JSON.stringify(users, null, 2);
    document.getElementById('debugUserCount').textContent = users.length;

    // Get admins
    const admins = await fetchAdmins(true);
    document.getElementById('debugAdminsData').textContent = JSON.stringify(admins, null, 2);
    document.getElementById('debugAdminCount').textContent = admins.length;

    // Get session
    const currentUser = getCurrentUser();
    const currentAdmin = getCurrentAdmin();
    const sessionInfo = {
        currentUser: currentUser,
        currentAdmin: currentAdmin
    };
    document.getElementById('debugSessionData').textContent = JSON.stringify(sessionInfo, null, 2);

    // Get all localStorage keys
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            allData[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            allData[key] = localStorage.getItem(key);
        }
    }
    document.getElementById('debugAllKeys').textContent = JSON.stringify(allData, null, 2);
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL localStorage data? This will remove all users and admins (except the default admin).')) {
        localStorage.clear();
        initializeDefaultAdmin();
        alert('All data cleared! Default admin reinitialized.');
        refreshDebugData();
        loadDashboardData();
        if (currentTab === 'admin-management') {
            loadAdminManagement();
        } else if (currentTab === 'user-management') {
            loadUserManagement();
        }
    }
}

function addSampleUser() {
    const users = getUsers();
    const sampleUser = {
        fullName: 'Test User ' + (users.length + 1),
        phoneNumber: '1234567890',
        qualification: 'Graduation',
        email: 'test' + Date.now() + '@example.com',
        password: 'Test123456',
        registeredDate: new Date().toISOString(),
        progress: 0,
        enrolledCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0
    };
    users.push(sampleUser);
    saveUsers(users);
    alert('Sample user added!');
    refreshDebugData();
    loadDashboardData();
    if (currentTab === 'user-management') {
        loadUserManagement();
    }
}
