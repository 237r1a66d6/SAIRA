// API Configuration with auto-detection
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

const API_CONFIG = {
    // Auto-switch between production and development
    BASE_URL: isProd 
        ? 'https://your-backend-url.onrender.com' // UPDATE THIS for production
        : 'http://localhost:5000',
    ENDPOINTS: {
        // User endpoints
        USER_REGISTER: '/api/users/register',
        USER_LOGIN: '/api/users/login',
        USER_PROFILE: '/api/users/profile',
        
        // Admin endpoints
        ADMIN_LOGIN: '/api/admin/login',
        ADMIN_USERS: '/api/admin/users',
        ADMIN_STATS: '/api/admin/stats',
        ADMIN_USER_STATUS: '/api/admin/users',
        ADMIN_LIST: '/api/admin/admins',
        ADMIN_CREATE: '/api/admin/admins',
        ADMIN_UPDATE: '/api/admin/admins',
        
        // School Partner endpoints
        PARTNER_LOGIN: '/api/school-partner/login',
        PARTNER_CREATE: '/api/school-partner/create',
        PARTNER_LIST: '/api/school-partner/all',
        PARTNER_UPDATE: '/api/school-partner/update',
        PARTNER_DELETE: '/api/school-partner/delete'
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
