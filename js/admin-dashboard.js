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
    
    // Check for new consultations and show notification
    checkNewConsultations();
    
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
    } else if (tabName === 'schools') {
        loadPartnerSchoolsDisplay();
    } else if (tabName === 'school-partners') {
        loadSchoolPartnersManagement();
    } else if (tabName === 'school-accounts') {
        loadSchoolAccounts();
    } else if (tabName === 'consultations') {
        loadConsultations();
    } else if (tabName === 'debug-storage') {
        refreshDebugData();
    }
    
    currentTab = tabName;
}

async function loadDashboardData() {
    const admins = await fetchAdmins();
    const users = getUsers(); // users remain local for now
    const partners = await getSchoolPartners();
    
    document.getElementById('totalAdmins').textContent = admins.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalPartnerSchools').textContent = partners.length;
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
    
    // Add School Partner Form
    const addSchoolPartnerForm = document.getElementById('addSchoolPartnerForm');
    if (addSchoolPartnerForm) {
        addSchoolPartnerForm.addEventListener('submit', handleAddSchoolPartner);
    }
    
    // Edit School Partner Form
    const editSchoolPartnerForm = document.getElementById('editSchoolPartnerForm');
    if (editSchoolPartnerForm) {
        editSchoolPartnerForm.addEventListener('submit', handleEditSchoolPartner);
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
                    showAdminNotification('Success', 'Admin added successfully!');
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
        
        showAdminNotification('Success', 'Admin added successfully!');
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
    
    showAdminNotification('Success', 'User added successfully!');
}

// Edit User Functions
function editUser(email) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showAdminNotification('Error', 'User not found!', 'error');
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
    
    showAdminNotification('Success', 'User updated successfully!');
}

// Edit Admin Functions
function editAdmin(adminId) {
    const admin = adminListCache.find(a => (a._id || a.id || a.username) === adminId);
    
    if (!admin) {
        showAdminNotification('Error', 'Admin not found!', 'error');
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
                    showAdminNotification('Success', 'Admin updated successfully!');
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
        
        showAdminNotification('Success', 'Admin updated successfully!');
    } catch (error) {
        console.error('Edit admin error:', error);
        showError('editAdminModalError', error.message || 'Unable to update admin');
    }
}

// Delete Functions
async function deleteAdmin(adminId) {
    const confirmed = await showCustomConfirm(
        'Are you sure you want to delete this admin? This action cannot be undone.',
        'Delete Admin',
        'Delete'
    );
    
    if (!confirmed) {
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
                    showAdminNotification('Success', 'Admin deleted successfully!');
                    return;
                }
            } catch (apiError) {
                console.warn('Backend delete admin failed, falling back to localStorage', apiError);
            }
        }

        const admins = getAdmins();
        const adminToDelete = admins.find(a => (a._id || a.id || a.username) === adminId);
        if (adminToDelete && adminToDelete.username === 'admin') {
            showAdminNotification('Error', 'Cannot delete the default admin!', 'error');
            return;
        }

        const filteredAdmins = admins.filter(a => (a._id || a.id || a.username) !== adminId);
        saveAdmins(filteredAdmins);
        adminListCache = filteredAdmins;
        adminSource = 'local';
        loadAdminManagement();
        loadDashboardData();
        
        showAdminNotification('Success', 'Admin deleted successfully!');
    } catch (error) {
        console.error('Delete admin error:', error);
        showAdminNotification('Error', error.message || 'Unable to delete admin', 'error');
    }
}

function deleteUser(email) {
    showCustomConfirm(
        'Are you sure you want to delete this user? This action cannot be undone.',
        'Delete User',
        'Delete'
    ).then(confirmed => {
        if (!confirmed) return;
        
        const users = getUsers();
        const filteredUsers = users.filter(u => u.email !== email);
    
    saveUsers(filteredUsers);
    loadUserManagement();
    loadDashboardData();
    
    showAdminNotification('Success', 'User deleted successfully!');
    });
}

// Custom Confirmation Modal
let confirmCallback = null;

function showCustomConfirm(message, title = 'Confirm Action', buttonText = 'Confirm') {
    return new Promise((resolve) => {
        const modal = document.getElementById('customConfirmModal');
        const modalTitle = document.getElementById('confirmModalTitle');
        const modalMessage = document.getElementById('confirmModalMessage');
        const confirmBtn = document.getElementById('confirmModalBtn');
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmBtn.textContent = buttonText;
        
        confirmCallback = resolve;
        modal.classList.add('show');
    });
}

function confirmAction() {
    const modal = document.getElementById('customConfirmModal');
    modal.classList.remove('show');
    if (confirmCallback) {
        confirmCallback(true);
        confirmCallback = null;
    }
}

function cancelConfirm() {
    const modal = document.getElementById('customConfirmModal');
    modal.classList.remove('show');
    if (confirmCallback) {
        confirmCallback(false);
        confirmCallback = null;
    }
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
    showCustomConfirm(
        'Are you sure you want to clear ALL localStorage data? This will remove all users and admins (except the default admin).',
        'Clear All Data',
        'Clear All'
    ).then(confirmed => {
        if (!confirmed) return;
        
        localStorage.clear();
        initializeDefaultAdmin();
        showAdminNotification('Success', 'All data cleared! Default admin reinitialized.');
        refreshDebugData();
        loadDashboardData();
        if (currentTab === 'admin-management') {
            loadAdminManagement();
        } else if (currentTab === 'user-management') {
            loadUserManagement();
        }
    });
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
    showAdminNotification('Success', 'Sample user added!');
    refreshDebugData();
    loadDashboardData();
    if (currentTab === 'user-management') {
        loadUserManagement();
    }
}

// Consultation Management Functions
function checkNewConsultations() {
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    const unreadCount = consultations.filter(c => !c.viewed).length;
    
    const badge = document.getElementById('consultationBadge');
    if (badge && unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline-block';
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Consultation Bookings', {
                body: `You have ${unreadCount} new consultation booking${unreadCount > 1 ? 's' : ''}`,
                icon: 'assets/OnlyLogo(noBG).png'
            });
        }
    }
}

function loadConsultations() {
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    const tbody = document.getElementById('consultationsTableBody');
    const notification = document.getElementById('consultationNotification');
    const notificationText = document.getElementById('notificationText');
    
    const unreadCount = consultations.filter(c => !c.viewed).length;
    
    if (unreadCount > 0) {
        notificationText.textContent = `You have ${unreadCount} new consultation booking${unreadCount > 1 ? 's' : ''}`;
        notification.style.display = 'flex';
    } else {
        notification.style.display = 'none';
    }
    
    if (consultations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">No consultations yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = consultations.reverse().map(consultation => `
        <tr style="${!consultation.viewed ? 'background-color: #fff8e1;' : ''}">
            <td>${consultation.id.substring(0, 8)}...</td>
            <td>${consultation.consultName}</td>
            <td>${consultation.consultEmail}</td>
            <td>${consultation.consultPhone}</td>
            <td>${consultation.consultationType || 'General'}</td>
            <td>${new Date(consultation.consultDate).toLocaleDateString()}</td>
            <td>${consultation.consultTime}</td>
            <td>
                <span class="status-badge status-${consultation.status}">
                    ${consultation.status}
                </span>
            </td>
            <td>
                <button onclick="viewConsultation('${consultation.id}')" class="btn-icon" title="View">👁️</button>
                <button onclick="updateConsultationStatus('${consultation.id}', 'confirmed')" class="btn-icon" title="Confirm">✅</button>
                <button onclick="updateConsultationStatus('${consultation.id}', 'declined')" class="btn-icon" title="Decline">❌</button>
                <button onclick="deleteConsultation('${consultation.id}')" class="btn-icon" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function viewConsultation(id) {
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    const consultation = consultations.find(c => c.id === id);
    
    if (consultation) {
        // Mark as viewed
        consultation.viewed = true;
        localStorage.setItem('consultations', JSON.stringify(consultations));
        
        // Populate modal with consultation details
        document.getElementById('detailId').textContent = consultation.id;
        document.getElementById('detailName').textContent = consultation.consultName;
        document.getElementById('detailEmail').textContent = consultation.consultEmail;
        document.getElementById('detailPhone').textContent = consultation.consultPhone;
        document.getElementById('detailOrganization').textContent = consultation.consultSchool || 'N/A';
        document.getElementById('detailType').textContent = consultation.consultationType || 'General';
        document.getElementById('detailDate').textContent = new Date(consultation.consultDate).toLocaleDateString();
        document.getElementById('detailTime').textContent = consultation.consultTime;
        
        const statusSpan = document.getElementById('detailStatus');
        statusSpan.innerHTML = `<span class="status-badge status-${consultation.status}">${consultation.status}</span>`;
        
        document.getElementById('detailTimestamp').textContent = new Date(consultation.timestamp).toLocaleString();
        document.getElementById('detailMessage').textContent = consultation.consultMessage || 'No message provided';
        
        // Show modal
        document.getElementById('consultationDetailsModal').style.display = 'block';
        
        // Refresh the display
        loadConsultations();
        checkNewConsultations();
    }
}

function closeConsultationDetails() {
    document.getElementById('consultationDetailsModal').style.display = 'none';
}

function updateConsultationStatus(id, newStatus) {
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    const consultation = consultations.find(c => c.id === id);
    
    if (consultation) {
        consultation.status = newStatus;
        consultation.viewed = true;
        localStorage.setItem('consultations', JSON.stringify(consultations));
        
        // Send email notification to the user
        sendConsultationStatusEmail(consultation, newStatus);
        
        showAdminNotification('Status Updated', `Consultation status updated to: ${newStatus}. Email notification sent to ${consultation.email}`);
        loadConsultations();
        checkNewConsultations();
    }
}

// Function to send email notification (simulated)
function sendConsultationStatusEmail(consultation, status) {
    const emailData = {
        to: consultation.email,
        subject: `Consultation Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - SAIRA ACAD`,
        body: `
Dear ${consultation.name},

Your consultation booking has been ${status}.

Booking Details:
- Type: ${consultation.consultType}
- Date: ${consultation.consultDate}
- Time: ${consultation.consultTime}
- Phone: ${consultation.phone}

${status === 'confirmed' ? 
    'We look forward to meeting with you. Please arrive 5 minutes early.' : 
    'We apologize for any inconvenience. Please feel free to reschedule or contact us for alternative options.'}

Best regards,
SAIRA ACAD Team
        `
    };
    
    // Log the email data (in production, this would send via backend API)
    console.log('Email notification prepared:', emailData);
    
    // Simulate email sending - in production, this would be an API call
    // fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailData) })
}

let consultationToDelete = null;

function deleteConsultation(id) {
    consultationToDelete = id;
    const modal = document.getElementById('deleteConfirmModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeDeleteConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        consultationToDelete = null;
    }, 300);
}

function confirmDelete() {
    if (consultationToDelete) {
        let consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
        consultations = consultations.filter(c => c.id !== consultationToDelete);
        localStorage.setItem('consultations', JSON.stringify(consultations));
        
        closeDeleteConfirm();
        showAdminNotification('Deleted', 'Consultation deleted successfully');
        loadConsultations();
        checkNewConsultations();
    }
}

function markAllAsRead() {
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    consultations.forEach(c => c.viewed = true);
    localStorage.setItem('consultations', JSON.stringify(consultations));
    
    loadConsultations();
    checkNewConsultations();
}

// Show admin notification
function showAdminNotification(title, message, type = 'success') {
    const notification = document.getElementById('adminNotification');
    const notificationTitle = document.getElementById('adminNotificationTitle');
    const notificationMessage = document.getElementById('adminNotificationMessage');
    const notificationIcon = document.getElementById('adminNotificationIcon');
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    if (type === 'error') {
        notificationIcon.textContent = '✗';
        notificationIcon.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    } else {
        notificationIcon.textContent = '✓';
        notificationIcon.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
    }
    
    notification.style.display = 'flex';
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
}

// Close admin notification
function closeAdminNotification() {
    const notification = document.getElementById('adminNotification');
    notification.classList.remove('show');
    setTimeout(() => {
        notification.style.display = 'none';
    }, 300);
}

// ===== SCHOOL ACCOUNT MANAGEMENT =====

function loadSchoolAccounts() {
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    const tableBody = document.getElementById('schoolAccountsTableBody');
    
    if (schools.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No school accounts found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = schools.map(school => `
        <tr>
            <td>${school.schoolName}</td>
            <td>${school.username}</td>
            <td>${school.email}</td>
            <td>${school.phone || 'N/A'}</td>
            <td>${school.location || 'N/A'}</td>
            <td>${new Date(school.createdAt).toLocaleDateString()}</td>
            <td>
                <button onclick="editSchool('${school.id}')" class="btn-icon" title="Edit">✏️</button>
                <button onclick="deleteSchool('${school.id}')" class="btn-icon" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function showAddSchoolModal() {
    document.getElementById('addSchoolModal').style.display = 'flex';
    document.getElementById('addSchoolForm').reset();
    document.getElementById('schoolModalError').style.display = 'none';
}

function closeAddSchoolModal() {
    document.getElementById('addSchoolModal').style.display = 'none';
}

document.getElementById('addSchoolForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const schoolName = document.getElementById('schoolName').value.trim();
    const username = document.getElementById('schoolUsername').value.trim();
    const password = document.getElementById('schoolPassword').value;
    const email = document.getElementById('schoolEmail').value.trim();
    const phone = document.getElementById('schoolPhone').value.trim();
    const location = document.getElementById('schoolLocation').value.trim();
    
    const errorDiv = document.getElementById('schoolModalError');
    
    // Get existing schools
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    
    // Check if username already exists
    if (schools.some(s => s.username === username)) {
        errorDiv.textContent = 'Username already exists';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if email already exists
    if (schools.some(s => s.email === email)) {
        errorDiv.textContent = 'Email already exists';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Create new school account
    const newSchool = {
        id: Date.now().toString(),
        schoolName,
        username,
        password,
        email,
        phone,
        location,
        createdAt: new Date().toISOString()
    };
    
    schools.push(newSchool);
    localStorage.setItem('schools', JSON.stringify(schools));
    
    closeAddSchoolModal();
    showAdminNotification('Success', `School account created for ${schoolName}`);
    loadSchoolAccounts();
});

function editSchool(id) {
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    const school = schools.find(s => s.id === id);
    
    if (school) {
        document.getElementById('editSchoolId').value = school.id;
        document.getElementById('editSchoolName').value = school.schoolName;
        document.getElementById('editSchoolUsername').value = school.username;
        document.getElementById('editSchoolEmail').value = school.email;
        document.getElementById('editSchoolPhone').value = school.phone || '';
        document.getElementById('editSchoolLocation').value = school.location || '';
        document.getElementById('editSchoolPassword').value = '';
        document.getElementById('editSchoolModalError').style.display = 'none';
        document.getElementById('editSchoolModal').style.display = 'flex';
    }
}

function closeEditSchoolModal() {
    document.getElementById('editSchoolModal').style.display = 'none';
}

document.getElementById('editSchoolForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('editSchoolId').value;
    const schoolName = document.getElementById('editSchoolName').value.trim();
    const username = document.getElementById('editSchoolUsername').value.trim();
    const password = document.getElementById('editSchoolPassword').value;
    const email = document.getElementById('editSchoolEmail').value.trim();
    const phone = document.getElementById('editSchoolPhone').value.trim();
    const location = document.getElementById('editSchoolLocation').value.trim();
    
    const errorDiv = document.getElementById('editSchoolModalError');
    const schools = JSON.parse(localStorage.getItem('schools') || '[]');
    const schoolIndex = schools.findIndex(s => s.id === id);
    
    if (schoolIndex === -1) {
        errorDiv.textContent = 'School not found';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if username is taken by another school
    if (schools.some(s => s.username === username && s.id !== id)) {
        errorDiv.textContent = 'Username already exists';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if email is taken by another school
    if (schools.some(s => s.email === email && s.id !== id)) {
        errorDiv.textContent = 'Email already exists';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Update school
    schools[schoolIndex].schoolName = schoolName;
    schools[schoolIndex].username = username;
    schools[schoolIndex].email = email;
    schools[schoolIndex].phone = phone;
    schools[schoolIndex].location = location;
    
    // Update password only if provided
    if (password) {
        schools[schoolIndex].password = password;
    }
    
    localStorage.setItem('schools', JSON.stringify(schools));
    
    closeEditSchoolModal();
    showAdminNotification('Success', `School account updated for ${schoolName}`);
    loadSchoolAccounts();
});

function deleteSchool(id) {
    showCustomConfirm(
        'Are you sure you want to delete this school account? This action cannot be undone.',
        'Delete School Account',
        'Delete'
    ).then(confirmed => {
        if (!confirmed) return;
        
        let schools = JSON.parse(localStorage.getItem('schools') || '[]');
        schools = schools.filter(s => s.id !== id);
        localStorage.setItem('schools', JSON.stringify(schools));
        
        showAdminNotification('Success', 'School account deleted successfully');
        loadSchoolAccounts();
    });
}

// ===========================
// School Partners Management
// ===========================

function getSchoolPartnersSync() {
    // Get from localStorage immediately (synchronous)
    return JSON.parse(localStorage.getItem('schoolPartners') || '[]');
}

async function getSchoolPartners() {
    // Return localStorage data immediately
    const localData = getSchoolPartnersSync();
    
    // Try to sync with backend in background (non-blocking)
    if (typeof api !== 'undefined') {
        api.getAllSchoolPartners().then(response => {
            if (response && response.success && Array.isArray(response.partners)) {
                // Update localStorage if backend has data
                localStorage.setItem('schoolPartners', JSON.stringify(response.partners));
            }
        }).catch(error => {
            console.warn('Backend sync failed:', error);
        });
    }
    
    return localData;
}

function loadSchoolPartnersManagement() {
    // Load instantly from localStorage
    const partners = getSchoolPartnersSync();
    const tableBody = document.getElementById('schoolPartnersTableBody');
    
    if (!tableBody) return;
    
    if (partners.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No school partners found. Add your first partner!</td></tr>';
        return;
    }
    
    let html = '';
    partners.forEach(partner => {
        const partnerId = partner._id || partner.id;
        html += `
            <tr>
                <td><strong>${partner.schoolName || partner.name}</strong></td>
                <td>${partner.username}</td>
                <td>${partner.email}</td>
                <td>${formatDate(partner.createdDate || partner.createdAt)}</td>
                <td>
                    <button class="action-btn edit" onclick="editSchoolPartner('${partnerId}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteSchoolPartner('${partnerId}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Load Partner Schools Display (for the "Partner Schools" tab)
function loadPartnerSchoolsDisplay() {
    // Load instantly from localStorage
    const partners = getSchoolPartnersSync();
    const schoolsList = document.getElementById('schoolsList');
    
    if (!schoolsList) return;
    
    if (partners.length === 0) {
        schoolsList.innerHTML = `
            <div class="no-data-message" style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">🏫</div>
                <h3 style="color: #333; margin-bottom: 10px;">No Partner Schools Yet</h3>
                <p style="margin-bottom: 20px;">Get started by adding your first school partner.</p>
                <button class="btn btn-primary" onclick="showTab('school-partners')">
                    Add School Partner
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    partners.forEach(partner => {
        const schoolName = partner.schoolName || partner.name || 'School Partner';
        const email = partner.email || 'N/A';
        const username = partner.username || 'N/A';
        
        html += `
            <div class="school-card">
                <div class="school-logo-large">
                    <h3>${schoolName}</h3>
                </div>
                <div class="school-info">
                    <h4>${schoolName}</h4>
                    <p>Partnered educational institution committed to academic excellence and student development.</p>
                    <div class="school-stats">
                        <span>📧 ${email}</span>
                        <span>👤 ${username}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    schoolsList.innerHTML = html;
}

function showAddSchoolPartnerModal() {
    const modal = document.getElementById('addSchoolPartnerModal');
    modal.classList.add('show');
    hideError('schoolPartnerModalError');
}

function closeAddSchoolPartnerModal() {
    const modal = document.getElementById('addSchoolPartnerModal');
    modal.classList.remove('show');
    document.getElementById('addSchoolPartnerForm').reset();
}

function showEditSchoolPartnerModal() {
    const modal = document.getElementById('editSchoolPartnerModal');
    modal.classList.add('show');
    hideError('editSchoolPartnerModalError');
}

function closeEditSchoolPartnerModal() {
    const modal = document.getElementById('editSchoolPartnerModal');
    modal.classList.remove('show');
    document.getElementById('editSchoolPartnerForm').reset();
}

// Handle Add School Partner Form
async function handleAddSchoolPartner(event) {
    event.preventDefault();
    hideError('schoolPartnerModalError');
    
    const name = document.getElementById('schoolPartnerName').value.trim();
    const username = document.getElementById('schoolPartnerUsername').value.trim();
    const email = document.getElementById('schoolPartnerEmail').value.trim();
    const password = document.getElementById('schoolPartnerPassword').value;
    const confirmPassword = document.getElementById('confirmSchoolPartnerPassword').value;
    
    // Validation
    if (!name || !username || !email || !password || !confirmPassword) {
        showError('schoolPartnerModalError', 'All fields are required.');
        return;
    }
    
    if (password.length < 8) {
        showError('schoolPartnerModalError', 'Password must be at least 8 characters long.');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('schoolPartnerModalError', 'Passwords do not match.');
        return;
    }
    
    try {
        // Create partner object first
        const newPartner = {
            id: Date.now().toString(),
            name: name,
            username: username,
            email: email,
            password: password,
            status: 'active',
            createdDate: new Date().toISOString()
        };
        
        // Get current partners from localStorage
        const partners = getSchoolPartnersSync();
        
        // Check duplicates
        if (partners.some(p => p.name && p.name.toLowerCase() === name.toLowerCase())) {
            showError('schoolPartnerModalError', 'A partner with this name already exists.');
            return;
        }
        
        if (partners.some(p => p.username && p.username.toLowerCase() === username.toLowerCase())) {
            showError('schoolPartnerModalError', 'Username already exists.');
            return;
        }
        
        if (partners.some(p => p.email && p.email.toLowerCase() === email.toLowerCase())) {
            showError('schoolPartnerModalError', 'Email already exists.');
            return;
        }
        
        // Optimistic update - save to localStorage immediately
        partners.push(newPartner);
        localStorage.setItem('schoolPartners', JSON.stringify(partners));
        
        // Close modal and update UI immediately
        closeAddSchoolPartnerModal();
        showAdminNotification('Success', 'School partner added successfully!');
        
        // Update UI in parallel
        Promise.all([
            loadSchoolPartnersManagement(),
            loadPartnerSchoolsDisplay()
        ]);
        
        // Try to sync with backend in background (non-blocking)
        if (typeof api !== 'undefined') {
            api.createSchoolPartner({
                schoolName: name,
                username: username,
                email: email,
                password: password
            }).catch(error => {
                console.warn('Backend sync failed:', error);
                // Data is already saved in localStorage, so no need to show error
            });
        }
    } catch (error) {
        console.error('Add school partner error:', error);
        showError('schoolPartnerModalError', error.message || 'Unable to add school partner');
    }
}

// Handle Edit School Partner Form
async function handleEditSchoolPartner(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('editSchoolPartnerModalError');
    hideError('editSchoolPartnerModalError');
    
    const id = document.getElementById('editSchoolPartnerId').value;
    const name = document.getElementById('editSchoolPartnerName').value.trim();
    const username = document.getElementById('editSchoolPartnerUsername').value.trim();
    const email = document.getElementById('editSchoolPartnerEmail').value.trim();
    const password = document.getElementById('editSchoolPartnerPassword').value;
    const confirmPassword = document.getElementById('confirmEditSchoolPartnerPassword').value;
    
    if (!name || !username || !email) {
        errorDiv.textContent = 'School name, username, and email are required';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Validate password if provided
    if (password) {
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (password.length < 8) {
            errorDiv.textContent = 'Password must be at least 8 characters';
            errorDiv.style.display = 'block';
            return;
        }
    }
    
    const partners = getSchoolPartnersSync();
    const partnerIndex = partners.findIndex(p => p.id === id);
    
    if (partnerIndex === -1) {
        errorDiv.textContent = 'Partner not found';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if name is taken by another partner
    if (partners.some(p => p.name && p.name.toLowerCase() === name.toLowerCase() && p.id !== id)) {
        errorDiv.textContent = 'A partner with this name already exists';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if username is taken by another partner
    if (partners.some(p => p.username && p.username.toLowerCase() === username.toLowerCase() && p.id !== id)) {
        errorDiv.textContent = 'Username already exists';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if email is taken by another partner
    if (partners.some(p => p.email && p.email.toLowerCase() === email.toLowerCase() && p.id !== id)) {
        errorDiv.textContent = 'Email already exists';
        errorDiv.style.display = 'block';
        return;
    }
    
    partners[partnerIndex].name = name;
    partners[partnerIndex].username = username;
    partners[partnerIndex].email = email;
    
    // Update password only if provided
    if (password) {
        partners[partnerIndex].password = password;
    }
    
    // Save to localStorage immediately
    localStorage.setItem('schoolPartners', JSON.stringify(partners));
    
    // Close modal and show notification
    closeEditSchoolPartnerModal();
    showAdminNotification('Success', `School partner "${name}" updated successfully`);
    
    // Update UI in parallel
    Promise.all([
        loadSchoolPartnersManagement(),
        loadPartnerSchoolsDisplay()
    ]);
    
    // Sync with backend in background if available
    if (typeof api !== 'undefined') {
        const updateData = {
            schoolName: name,
            username: username,
            email: email
        };
        if (password) {
            updateData.password = password;
        }
        
        api.updateSchoolPartner(id, updateData).catch(error => {
            console.warn('Backend sync failed:', error);
        });
    }
}

function editSchoolPartner(id) {
    const partners = getSchoolPartnersSync();
    const partner = partners.find(p => p.id === id);
    
    if (!partner) {
        showAdminNotification('Error', 'Partner not found', 'error');
        return;
    }
    
    document.getElementById('editSchoolPartnerId').value = partner.id;
    document.getElementById('editSchoolPartnerName').value = partner.name || '';
    document.getElementById('editSchoolPartnerUsername').value = partner.username || '';
    document.getElementById('editSchoolPartnerEmail').value = partner.email || '';
    
    showEditSchoolPartnerModal();
}

function deleteSchoolPartner(id) {
    const partners = getSchoolPartnersSync();
    const partner = partners.find(p => p.id === id);
    
    if (!partner) {
        showAdminNotification('Error', 'Partner not found', 'error');
        return;
    }
    
    showCustomConfirm(
        `Are you sure you want to delete "${partner.name}"? This action cannot be undone.`,
        'Delete School Partner',
        'Delete'
    ).then(confirmed => {
        if (!confirmed) return;
        
        // Delete from localStorage immediately
        const updatedPartners = partners.filter(p => p.id !== id);
        localStorage.setItem('schoolPartners', JSON.stringify(updatedPartners));
        
        // Show notification
        showAdminNotification('Success', `School partner "${partner.name}" deleted successfully`);
        
        // Update UI in parallel
        Promise.all([
            loadSchoolPartnersManagement(),
            loadPartnerSchoolsDisplay()
        ]);
        
        // Sync with backend in background if available
        if (typeof api !== 'undefined') {
            api.deleteSchoolPartner(id).catch(error => {
                console.warn('Backend sync failed:', error);
            });
        }
    });
}
