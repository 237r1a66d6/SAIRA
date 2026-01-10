// School Partner Dashboard JavaScript
import { API_BASE_URL } from './api-config.js';

let currentTab = 'overview';
let partnerToken = null;

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
    partnerToken = localStorage.getItem('partnerToken');
    const partner = JSON.parse(localStorage.getItem('schoolPartner') || 'null');
    
    if (!partner || !partner.username) {
        window.location.href = 'school-login.html';
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

async function loadDashboardData() {
    try {
        // Try to fetch from backend if token exists
        if (partnerToken) {
            const [jobAppsRes, teacherAppsRes, mentorAppsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/school-partner/applications/jobs`, {
                    headers: {
                        'Authorization': `Bearer ${partnerToken}`
                    }
                }),
                fetch(`${API_BASE_URL}/school-partner/applications/teachers`, {
                    headers: {
                        'Authorization': `Bearer ${partnerToken}`
                    }
                }),
                fetch(`${API_BASE_URL}/school-partner/applications/mentors`, {
                    headers: {
                        'Authorization': `Bearer ${partnerToken}`
                    }
                })
            ]);

            const jobAppsData = await jobAppsRes.json();
            const teacherAppsData = await teacherAppsRes.json();
            const mentorAppsData = await mentorAppsRes.json();

            const jobApps = jobAppsData.success ? jobAppsData.applications : [];
            const teacherApps = teacherAppsData.success ? teacherAppsData.applications : [];
            const mentorApps = mentorAppsData.success ? mentorAppsData.applications : [];

            // Update stats
            document.getElementById('totalJobApps').textContent = jobApps.length;
            document.getElementById('totalTeacherApps').textContent = teacherApps.length;
            document.getElementById('totalMentorApps').textContent = mentorApps.length;
            document.getElementById('pendingReviews').textContent = jobApps.length + teacherApps.length + mentorApps.length;

            // Load applications tables
            loadJobApplications(jobApps);
            loadTeacherApplications(teacherApps);
            loadMentorApplications(mentorApps);
        } else {
            // Fallback to localStorage
            loadFromLocalStorage();
        }
    } catch (error) {
        console.error('Error loading dashboard data from backend:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
    }
}

function loadFromLocalStorage() {
    // Load applications from localStorage as fallback
    const jobApps = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const teacherApps = JSON.parse(localStorage.getItem('teacherApplications') || '[]');
    const mentorApps = JSON.parse(localStorage.getItem('mentorApplications') || '[]');
    
    // Update stats
    document.getElementById('totalJobApps').textContent = jobApps.length;
    document.getElementById('totalTeacherApps').textContent = teacherApps.length;
    document.getElementById('totalMentorApps').textContent = mentorApps.length;
    document.getElementById('pendingReviews').textContent = jobApps.length + teacherApps.length + mentorApps.length;
    
    // Load applications tables
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
    localStorage.removeItem('schoolPartner');
    localStorage.removeItem('partnerToken');
    window.location.href = 'index.html';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}
// Make functions globally available for inline event handlers
window.logout = logout;
window.showTab = showTab;