// School Partner Dashboard JavaScript

let currentTab = 'overview';

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const partner = checkPartnerAuth();
    if (!partner) return;
    
    // Display partner info
    displayPartnerInfo(partner);
    
    // Load dashboard data
    loadDashboardData();
});

function checkPartnerAuth() {
    const partner = JSON.parse(localStorage.getItem('schoolPartner') || 'null');
    if (!partner || !partner.username) {
        window.location.href = 'partner-login.html';
        return null;
    }
    return partner;
}

function displayPartnerInfo(partner) {
    const partnerNameElement = document.getElementById('partnerName');
    const schoolNameDisplay = document.getElementById('schoolNameDisplay');
    const profileSchoolName = document.getElementById('profileSchoolName');
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    
    if (partnerNameElement) {
        partnerNameElement.textContent = partner.schoolName || partner.username;
    }
    if (schoolNameDisplay) {
        schoolNameDisplay.textContent = partner.schoolName || partner.username;
    }
    if (profileSchoolName) {
        profileSchoolName.textContent = partner.schoolName || partner.username;
    }
    if (profileUsername) {
        profileUsername.textContent = partner.username;
    }
    if (profileEmail) {
        profileEmail.textContent = partner.email || 'N/A';
    }
}

function loadDashboardData() {
    // Load applications from localStorage
    const jobApps = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const teacherApps = JSON.parse(localStorage.getItem('teacherApplications') || '[]');
    const mentorApps = JSON.parse(localStorage.getItem('mentorApplications') || '[]');
    
    // Update stats
    document.getElementById('totalJobApps').textContent = jobApps.length;
    document.getElementById('totalTeacherApps').textContent = teacherApps.length;
    document.getElementById('totalMentorApps').textContent = mentorApps.length;
    document.getElementById('pendingReviews').textContent = jobApps.length + teacherApps.length + mentorApps.length;
    
    // Load job applications table
    loadJobApplications(jobApps);
    loadTeacherApplications(teacherApps);
    loadMentorApplications(mentorApps);
}

function loadJobApplications(applications) {
    const tableBody = document.getElementById('jobApplicationsTable');
    
    if (applications.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No job applications found</td></tr>';
        return;
    }
    
    let html = '';
    applications.forEach(app => {
        html += `
            <tr>
                <td>${app.fullName || 'N/A'}</td>
                <td>${app.email || 'N/A'}</td>
                <td>${app.phone || 'N/A'}</td>
                <td>${app.position || 'N/A'}</td>
                <td>${app.experience || 'N/A'}</td>
                <td>${formatDate(app.submittedAt || new Date().toISOString())}</td>
                <td>
                    ${app.resume ? `<a href="${app.resume}" target="_blank" class="btn btn-small">View</a>` : 'N/A'}
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function loadTeacherApplications(applications) {
    const tableBody = document.getElementById('teacherApplicationsTable');
    
    if (applications.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No teacher applications found</td></tr>';
        return;
    }
    
    let html = '';
    applications.forEach(app => {
        html += `
            <tr>
                <td>${app.fullName || 'N/A'}</td>
                <td>${app.email || 'N/A'}</td>
                <td>${app.phone || 'N/A'}</td>
                <td>${app.experience || 'N/A'}</td>
                <td>${app.subjects || 'N/A'}</td>
                <td>${formatDate(app.submittedAt || new Date().toISOString())}</td>
                <td>
                    ${app.resume ? `<a href="${app.resume}" target="_blank" class="btn btn-small">View</a>` : 'N/A'}
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function loadMentorApplications(applications) {
    const tableBody = document.getElementById('mentorApplicationsTable');
    
    if (applications.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No mentor applications found</td></tr>';
        return;
    }
    
    let html = '';
    applications.forEach(app => {
        html += `
            <tr>
                <td>${app.fullName || 'N/A'}</td>
                <td>${app.email || 'N/A'}</td>
                <td>${app.phone || 'N/A'}</td>
                <td>${app.experience || 'N/A'}</td>
                <td>${app.specialization || 'N/A'}</td>
                <td>${formatDate(app.submittedAt || new Date().toISOString())}</td>
                <td>
                    ${app.resume ? `<a href="${app.resume}" target="_blank" class="btn btn-small">View</a>` : 'N/A'}
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
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
    event.target.closest('.menu-item').classList.add('active');
    
    currentTab = tabName;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('schoolPartner');
        window.location.href = 'partner-login.html';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}
