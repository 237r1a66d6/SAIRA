// API Configuration with auto-detection
// Version: 2.0.1 - Fixed delete user endpoint (2026-03-06 14:00)
// IMPORTANT: ID is sent in REQUEST BODY, not URL path
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

console.log('📌 API Config v2.0.1 loaded - DELETE sends ID in body');


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
    // Make API request with mobile-optimized timeouts
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        // Check for adminToken first (for admin routes), then fall back to authToken
        const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
        
        // Detect mobile device for adaptive timeout
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Increased timeout for production servers - admin APIs need more time
        const isAdminEndpoint = endpoint.includes('/admin/');
        let timeout = 30000; // 30 seconds for admin endpoints (increased for production)
        if (!isAdminEndpoint) {
            timeout = isMobile ? 15000 : 12000; // Longer timeout for non-admin endpoints too
        }
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        try {
            console.log(`📡 API Request to: ${url} (timeout: ${timeout}ms)`);
            
            // Add adaptive timeout based on device
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.warn(`⏰ Request timeout after ${timeout}ms for ${endpoint}`);
                controller.abort();
            }, timeout);
            
            const fetchStart = Date.now();
            const response = await fetch(url, { ...config, signal: controller.signal });
            clearTimeout(timeoutId);
            
            const fetchDuration = Date.now() - fetchStart;
            console.log(`✅ API Response received in ${fetchDuration}ms`);
            if (fetchDuration > 5000) {
                console.warn(`⚠️  Slow API response: ${fetchDuration}ms for ${endpoint}`);
            }
            
            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn(`⚠️ Non-JSON response from: ${url}`);
                console.warn(`Content-Type: ${contentType}`);
                console.warn(`Status: ${response.status}`);
                
                // Try to get response text for debugging
                const responseText = await response.text();
                console.error(`Response body: ${responseText.substring(0, 500)}`);
                
                throw new Error(`API endpoint returned non-JSON response (${response.status}). Check server logs or API endpoint.`);
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `API request failed with status ${response.status}`);
            }
            
            return data;
        } catch (error) {
            // Provide more specific error messages
            if (error.name === 'AbortError') {
                console.error('❌ API request timeout:', url);
                console.error(`   Timeout was set to: ${timeout}ms`);
                console.error('   This usually means:');
                console.error('   1. Server is slow or under heavy load');
                console.error('   2. API endpoint is not responding');
                console.error('   3. Network connection is poor');
                throw new Error(`API request timeout after ${timeout}ms - server may be slow or unavailable`);
            }
            if (error instanceof SyntaxError) {
                console.warn('API returned invalid JSON:', url);
                throw new Error('API endpoint returned invalid response');
            }
            console.warn('API Error:', error.message, 'URL:', url);
            throw error;
        }
    },

    // User API calls
    async registerUser(userData) {
        console.log('🌐 API.registerUser called');
        console.log('📤 Endpoint:', API_CONFIG.ENDPOINTS.USER_REGISTER);
        console.log('📤 Full URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_REGISTER}`);
        console.log('📤 Data to send:', {
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            qualification: userData.qualification,
            hasPassword: !!userData.password
        });
        
        const response = await this.request(API_CONFIG.ENDPOINTS.USER_REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        console.log('📥 registerUser response:', response);
        return response;
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

    async getAllUsers(retryCount = 0) {
        const maxRetries = 3; // Increased to 3 retry attempts
        try {
            console.log(`🔍 getAllUsers called (attempt ${retryCount + 1}/${maxRetries + 1})`);
            console.log(`📍 Requesting: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}`);
            
            const result = await this.request(API_CONFIG.ENDPOINTS.ADMIN_USERS, {
                method: 'GET'
            });
            console.log('✅ getAllUsers successful:', result);
            return result;
        } catch (error) {
            console.error(`❌ getAllUsers failed (attempt ${retryCount + 1}):`, error.message);
            console.error('Full error:', error);
            
            // Retry on timeout or network errors
            if ((error.message.includes('timeout') || error.message.includes('network') || error.name === 'AbortError') && retryCount < maxRetries) {
                const waitTime = (retryCount + 1) * 2000; // Exponential backoff: 2s, 4s, 6s
                console.log(`🔄 Retrying in ${waitTime}ms... (attempt ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.getAllUsers(retryCount + 1);
            }
            
            // If all retries failed, provide helpful diagnostic info
            if (retryCount >= maxRetries) {
                console.error('❌ All retry attempts exhausted');
                console.error('🔍 Diagnostic Info:');
                console.error('   - API Base URL:', API_CONFIG.BASE_URL);
                console.error('   - Full endpoint:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}`);
                console.error('   - Server may be slow, down, or API files not uploaded');
                console.error('   - Check: 1) Server is running, 2) API files are uploaded, 3) PHP is configured');
            }
            
            throw error;
        }
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

    async updateUser(userId, userData) {
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_USERS, {
            method: 'PUT',
            body: JSON.stringify({ id: userId, ...userData })
        });
    },

    // Delete user from database (v2.0 - fixed body payload)
    async deleteUser(userId) {
        console.log('🗑️ API deleteUser called with userId:', userId);
        console.log('📤 Sending DELETE to:', API_CONFIG.ENDPOINTS.ADMIN_USERS);
        console.log('📦 Body payload:', { id: userId });
        
        return this.request(API_CONFIG.ENDPOINTS.ADMIN_USERS, {
            method: 'DELETE',
            body: JSON.stringify({ id: userId })
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
window.API_CONFIG = API_CONFIG; // Expose full config for debugging
window.api = api; // Expose API methods for debugging
const API_BASE_URL = API_CONFIG.BASE_URL;
