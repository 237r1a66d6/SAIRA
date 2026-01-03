// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        // User endpoints
        USER_REGISTER: '/users/register',
        USER_LOGIN: '/users/login',
        USER_PROFILE: '/users/profile',
        
        // Admin endpoints
        ADMIN_LOGIN: '/admin/login',
        ADMIN_USERS: '/admin/users',
        ADMIN_STATS: '/admin/stats',
        ADMIN_USER_STATUS: '/admin/users',
        ADMIN_LIST: '/admin/admins',
        ADMIN_CREATE: '/admin/admins',
        ADMIN_UPDATE: '/admin/admins',
    }
};

// API Helper Functions
const api = {
    // Make API request
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const token = localStorage.getItem('authToken');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
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
    }

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
