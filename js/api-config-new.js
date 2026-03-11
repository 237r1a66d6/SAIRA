// Production-ready API Configuration for Hostinger PHP Backend
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

function normalizeBaseUrl(url) {
    return String(url || '').trim().replace(/\/+$/, '');
}

function getDefaultProdApiBaseUrl() {
    // For Hostinger, use the same domain
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/api`;
}

function resolveApiBaseUrl() {
    // Optional override hooks for deployments
    // 1) window.SAIRA_API_BASE_URL
    // 2) localStorage.SAIRA_API_BASE_URL
    const override = window.SAIRA_API_BASE_URL || localStorage.getItem('SAIRA_API_BASE_URL');
    const base = override ? normalizeBaseUrl(override) : (isProd ? getDefaultProdApiBaseUrl() : 'http://localhost/api');

    return normalizeBaseUrl(base);
}

const API_CONFIG = {
    // Automatically use production or development URL
    BASE_URL: resolveApiBaseUrl(),
    
    ENDPOINTS: {
        // User endpoints
        USER_REGISTER: '/users/register.php',
        USER_LOGIN: '/users/login.php',
        USER_PROFILE: '/users/profile.php',
        
        // Admin endpoints
        ADMIN_LOGIN: '/admin/login.php',
        ADMIN_DASHBOARD: '/admin/dashboard.php',
        ADMIN_USERS: '/admin/users.php',
        ADMIN_CREATE_USER: '/admin/create-user.php',
        ADMIN_UPDATE_USER: '/admin/update-user.php',
        ADMIN_DELETE_USER: '/admin/delete-user.php',
        
        // School Partner endpoints
        PARTNER_LOGIN: '/school-partner/login.php',
        PARTNER_CREATE: '/school-partner/create.php',
        PARTNER_ALL: '/school-partner/all.php',
        PARTNER_UPDATE: '/school-partner/update.php',
        PARTNER_DELETE: '/school-partner/delete.php',
        PARTNER_JOBS: '/school-partner/applications/jobs.php',
        PARTNER_TEACHERS: '/school-partner/applications/teachers.php',
        PARTNER_MENTORS: '/school-partner/applications/mentors.php',
        
        // Teacher endpoints
        TEACHER_LOGIN: '/teacher/login.php',
        
        // Form endpoints
        CONTACT_FORM: '/forms/contact.php',
        SCHOOL_REQUIREMENT: '/forms/school-requirement.php',
        TEACHER_APPLICATION: '/forms/teacher-application.php',
        MENTOR_APPLICATION: '/forms/mentor-application.php',
        JOB_APPLICATION: '/forms/job-application.php',
        ENROLLMENT: '/forms/enrollment.php',
        CONSULTATION: '/forms/consultation.php'
    }
};
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

        const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

        const defaultOptions = {
            ...options,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers
            }
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
