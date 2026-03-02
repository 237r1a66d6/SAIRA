// API Configuration with auto-detection
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

function normalizeBaseUrl(url) {
    return String(url || '').trim().replace(/\/+$/, '');
}

function getDefaultProdApiBaseUrl() {
    // For Hostinger PHP backend, use same domain
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
}

function resolveApiBaseUrl() {
    // Optional override hooks for deployments
    // 1) window.SAIRA_API_BASE_URL (you can set this in a small inline script)
    // 2) localStorage.SAIRA_API_BASE_URL (quick testing without redeploy)
    const override = window.SAIRA_API_BASE_URL || localStorage.getItem('SAIRA_API_BASE_URL');
    const base = override ? normalizeBaseUrl(override) : (isProd ? getDefaultProdApiBaseUrl() : 'http://localhost');

    return normalizeBaseUrl(base);
}

const API_CONFIG = {
    // Auto-switch between production and development
    BASE_URL: resolveApiBaseUrl(),
    ENDPOINTS: {
        // User endpoints
        USER_REGISTER: '/api/users/register.php',
        USER_LOGIN: '/api/users/login.php',
        USER_PROFILE: '/api/users/profile.php',
        
        // Admin endpoints
        ADMIN_LOGIN: '/api/admin/login.php',
        ADMIN_USERS: '/api/admin/users.php',
        ADMIN_STATS: '/api/admin/stats.php',
        ADMIN_USER_STATUS: '/api/admin/users.php',
        ADMIN_LIST: '/api/admin/admins.php',
        ADMIN_CREATE: '/api/admin/admins.php',
        ADMIN_UPDATE: '/api/admin/admins.php',
        
        // School Partner endpoints
        PARTNER_LOGIN: '/api/school-partner/login.php',
        PARTNER_CREATE: '/api/school-partner/create.php',
        PARTNER_LIST: '/api/school-partner/all.php',
        PARTNER_UPDATE: '/api/school-partner/update.php',
        PARTNER_DELETE: '/api/school-partner/delete.php',
        
        // Teacher endpoints
        TEACHER_LOGIN: '/api/teacher/login.php',
        
        // Form endpoints
        CONTACT_FORM: '/api/forms/contact.php',
        SCHOOL_REQUIREMENT: '/api/forms/school-requirement.php',
        TEACHER_APPLICATION: '/api/forms/teacher-application.php',
        MENTOR_APPLICATION: '/api/forms/mentor-application.php',
        JOB_APPLICATION: '/api/forms/job-application.php',
        ENROLLMENT: '/api/forms/enrollment.php',
        CONSULTATION: '/api/forms/consultation.php',
        
        // Applications for partners
        PARTNER_JOBS: '/api/school-partner/applications/jobs.php',
        PARTNER_TEACHERS: '/api/school-partner/applications/teachers.php',
        PARTNER_MENTORS: '/api/school-partner/applications/mentors.php'
    }
};

// API Helper Functions
const api = {
    // Make API request
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        // Check for adminToken first (for admin routes), then fall back to authToken
        const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        try {
            // Add 3 second timeout for faster fallback
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(url, { ...config, signal: controller.signal });
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // User API calls
    async registerUser(userData) {
        return this.request(API_CONFIG.ENDPOINTS.USER_REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async loginUser(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.USER_LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async getUserProfile(userId) {
        return this.request(`${API_CONFIG.ENDPOINTS.USER_PROFILE}/${userId}`, {
            method: 'GET'
        });
    },

    async updateUserProfile(userId, userData) {
        return this.request(`${API_CONFIG.ENDPOINTS.USER_PROFILE}/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // Admin API calls
    async adminLogin(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async getAllUsers() {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_USERS, {
            method: 'GET'
        });
    },

    async getAdminStats() {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_STATS, {
            method: 'GET'
        });
    },

    async getAllAdmins() {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_LIST, {
            method: 'GET'
        });
    },

    async createAdmin(adminData) {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_CREATE, {
            method: 'POST',
            body: JSON.stringify(adminData)
        });
    },

    async updateAdmin(adminId, adminData) {
        return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_UPDATE}/${adminId}`, {
            method: 'PUT',
            body: JSON.stringify(adminData)
        });
    },

    async deleteAdmin(adminId) {
        return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_UPDATE}/${adminId}`, {
            method: 'DELETE'
        });
    },

    async updateUserStatus(userId, status) {
        return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_USER_STATUS}/${userId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    async deleteUser(userId) {
        return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_USER_STATUS}/${userId}`, {
            method: 'DELETE'
        });
    },

    // School Partner API calls
    async schoolPartnerLogin(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async createSchoolPartner(partnerData) {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_CREATE, {
            method: 'POST',
            body: JSON.stringify(partnerData)
        });
    },

    async getAllSchoolPartners() {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_LIST, {
            method: 'GET'
        });
    },

    async updateSchoolPartner(partnerId, partnerData) {
        return this.request(`${API_CONFIG.ENDPOINTS.PARTNER_UPDATE}/${partnerId}`, {
            method: 'PUT',
            body: JSON.stringify(partnerData)
        });
    },

    async deleteSchoolPartner(partnerId) {
        return this.request(`${API_CONFIG.ENDPOINTS.PARTNER_DELETE}/${partnerId}`, {
            method: 'DELETE'
        });
    }
};

// Storage helper to save auth token
function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// Make API_BASE_URL globally available
window.API_BASE_URL = API_CONFIG.BASE_URL;
const API_BASE_URL = API_CONFIG.BASE_URL;
