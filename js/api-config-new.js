// Production-ready API Configuration
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

const API_CONFIG = {
    // Automatically use production or development URL
    BASE_URL: isProd 
        ? 'https://your-backend-url.onrender.com/api' // UPDATE THIS for production
        : 'http://localhost:5000/api',
    
    ENDPOINTS: {
        // User endpoints
        USER_REGISTER: '/users/register',
        USER_LOGIN: '/users/login',
        USER_PROFILE: '/users/profile',
        
        // Admin endpoints
        ADMIN_LOGIN: '/admin/login',
        ADMIN_DASHBOARD: '/admin/dashboard',
        ADMIN_USERS: '/admin/users',
        ADMIN_CREATE_USER: '/admin/create-user',
        ADMIN_UPDATE_USER: '/admin/update-user',
        ADMIN_DELETE_USER: '/admin/delete-user',
        
        // School Partner endpoints
        PARTNER_LOGIN: '/school-partner/login',
        PARTNER_CREATE: '/school-partner/create',
        PARTNER_ALL: '/school-partner/all',
        PARTNER_UPDATE: '/school-partner/update',
        PARTNER_DELETE: '/school-partner/delete',
        PARTNER_JOBS: '/school-partner/applications/jobs',
        PARTNER_TEACHERS: '/school-partner/applications/teachers',
        PARTNER_MENTORS: '/school-partner/applications/mentors',
        
        // Form endpoints
        ENROLLMENT: '/forms/enrollment',
        SCHOOL_REQUIREMENT: '/forms/school-requirement',
        TEACHER_APPLICATION: '/forms/teacher-application',
        MENTOR_APPLICATION: '/forms/mentor-application',
        JOB_APPLICATION: '/forms/job-application',
        CONTACT: '/forms/contact',
        CONSULTATION: '/forms/consultation'
    }
};

// Unified API request handler with comprehensive error handling
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        const token = localStorage.getItem('authToken') || 
                     localStorage.getItem('adminToken') || 
                     localStorage.getItem('partnerToken');
        
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, defaultOptions);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            
            // Handle offline/network errors
            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your network.');
            }
            
            // Handle server errors
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Please try again later.');
            }
            
            throw error;
        }
    },

    // User API methods
    registerUser(userData) {
        return this.request(API_CONFIG.ENDPOINTS.USER_REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    loginUser(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.USER_LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    // Admin API methods
    adminLogin(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    getAllUsers() {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_USERS, {
            method: 'GET'
        });
    },

    createUser(userData) {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_CREATE_USER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    updateUser(userId, userData) {
        return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_UPDATE_USER}/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    deleteUser(userId) {
        return this.request(`${API_CONFIG.ENDPOINTS.ADMIN_DELETE_USER}/${userId}`, {
            method: 'DELETE'
        });
    },

    // School Partner API methods
    partnerLogin(credentials) {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    createSchoolPartner(partnerData) {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_CREATE, {
            method: 'POST',
            body: JSON.stringify(partnerData)
        });
    },

    getAllSchoolPartners() {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_ALL, {
            method: 'GET'
        });
    },

    updateSchoolPartner(partnerId, partnerData) {
        return this.request(`${API_CONFIG.ENDPOINTS.PARTNER_UPDATE}/${partnerId}`, {
            method: 'PUT',
            body: JSON.stringify(partnerData)
        });
    },

    deleteSchoolPartner(partnerId) {
        return this.request(`${API_CONFIG.ENDPOINTS.PARTNER_DELETE}/${partnerId}`, {
            method: 'DELETE'
        });
    },

    getJobApplications() {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_JOBS, {
            method: 'GET'
        });
    },

    getTeacherApplications() {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_TEACHERS, {
            method: 'GET'
        });
    },

    getMentorApplications() {
        return this.request(API_CONFIG.ENDPOINTS.PARTNER_MENTORS, {
            method: 'GET'
        });
    },

    // Form submission methods
    submitEnrollment(formData) {
        return this.request(API_CONFIG.ENDPOINTS.ENROLLMENT, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    },

    submitSchoolRequirement(formData) {
        return this.request(API_CONFIG.ENDPOINTS.SCHOOL_REQUIREMENT, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    },

    submitTeacherApplication(formData) {
        return this.request(API_CONFIG.ENDPOINTS.TEACHER_APPLICATION, {
            method: 'POST',
            body: formData, // FormData for file upload
            headers: {} // Let browser set Content-Type for FormData
        });
    },

    submitMentorApplication(formData) {
        return this.request(API_CONFIG.ENDPOINTS.MENTOR_APPLICATION, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    },

    submitJobApplication(formData) {
        return this.request(API_CONFIG.ENDPOINTS.JOB_APPLICATION, {
            method: 'POST',
            body: formData, // FormData for file upload
            headers: {} // Let browser set Content-Type for FormData
        });
    },

    submitContact(formData) {
        return this.request(API_CONFIG.ENDPOINTS.CONTACT, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    },

    submitConsultation(formData) {
        return this.request(API_CONFIG.ENDPOINTS.CONSULTATION, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
    }
};

// Storage helper functions
function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// Export for ES6 modules
export const API_BASE_URL = API_CONFIG.BASE_URL;
export { API_CONFIG, api, saveAuthToken, getAuthToken, removeAuthToken };
