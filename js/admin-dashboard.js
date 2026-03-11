// Admin Dashboard JavaScript
// Version: 2.0.1 - Enhanced delete functionality with database integration (2026-03-06)

let currentTab = 'overview';
let adminListCache = [];
let adminSource = 'local';
let userListCache = [];
let userSource = 'local';
let lastSyncTime = null;
let syncFailureCount = 0;
let isRefreshing = false;
let isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Simple notification function
function showNotification(message, type = 'success') {
    const alertType = type === 'success' ? 'success' : 'error';
    alert(message);
}

// Mobile debug logger - MUST be defined early since other functions use it
function logMobileDebug(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] 📱 ${message}`;
    
    console.log(logMessage, data || '');
    
    // Store last 20 logs in localStorage for debugging  
    try {
        const logs = JSON.parse(localStorage.getItem('mobileSyncLogs') || '[]');
        logs.push({ time: timestamp, message, data });
        if (logs.length > 20) logs.shift(); // Keep last 20
        localStorage.setItem('mobileSyncLogs', JSON.stringify(logs));
    } catch (e) {
        // Silent fail if storage is full
    }
}

// Real-time status indicator functions
function updateRealtimeStatus(status, message = '', timestamp = null) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const lastUpdate = document.getElementById('lastUpdate');
    
    console.log(`🔔 Status Update: ${status} - ${message}`);
    logMobileDebug(`Status changed to: ${status}`, { message, timestamp });
    
    if (!statusDot || !statusText) {
        console.warn('⚠️  Status elements not found in DOM');
        return;
    }
    
    // Remove all status classes
    statusDot.className = 'status-dot';
    
    switch(status) {
        case 'syncing':
            statusDot.classList.add('status-syncing');
            statusText.textContent = message || 'Syncing...';
            statusText.style.color = '#ffa500';
            break;
        case 'connected':
            statusDot.classList.add('status-connected');
            statusText.textContent = message || 'Live';
            statusText.style.color = '#4CAF50';
            syncFailureCount = 0;
            break;
        case 'error':
            statusDot.classList.add('status-error');
            statusText.textContent = message || 'Connection Error';
            statusText.style.color = '#f44336';
            break;
    }
    
    if (lastUpdate && timestamp) {
        lastSyncTime = timestamp;
        const timeStr = new Date(timestamp).toLocaleTimeString();
        lastUpdate.textContent = `Updated: ${timeStr}`;
        lastUpdate.style.display = 'inline';
    }
}

function formatTimeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
}

// Update time display every second
setInterval(() => {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate && lastSyncTime) {
        const timeStr = formatTimeSince(new Date(lastSyncTime));
        lastUpdate.textContent = `Updated: ${timeStr}`;
    }
}, 1000);

// Mobile visual feedback indicator
function flashMobileIndicator(type = 'success') {
    const mobileBtn = document.getElementById('mobileRefreshBtn');
    if (!mobileBtn || !isMobileDevice) return;
    
    if (type === 'success') {
        mobileBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        setTimeout(() => {
            mobileBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 500);
    }
}

// Mobile debug logger - helps troubleshoot mobile issues
function logMobileDebug(message, data = null) {
    if (!isMobileDevice) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] 📱 ${message}`;
    
    console.log(logMessage, data || '');
    
    // Store last 10 logs in localStorage for debugging
    try {
        const logs = JSON.parse(localStorage.getItem('mobileSyncLogs') || '[]');
        logs.push({ time: timestamp, message, data });
        if (logs.length > 10) logs.shift();
        localStorage.setItem('mobileSyncLogs', JSON.stringify(logs));
    } catch (e) {
        // Silent fail if storage is full
    }
}

// Progressive loading strategy for faster mobile experience
let isInitialLoadComplete = false;
let criticalDataLoaded = false;

document.addEventListener('DOMContentLoaded', async function() {
    const loadStartTime = Date.now();
    console.log('\ud83d\ude80 Starting optimized dashboard load...');
    
    // Check authentication
    const admin = checkAuth('admin');
    if (!admin) return;
    
    // Display admin name immediately (critical UI)
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = `Admin: ${admin.username}`;
    }
    
    // Detect which tab is currently active on page load
    const activeTabs = document.querySelectorAll('.tab-content.active');
    if (activeTabs.length > 0) {
        const activeTabId = activeTabs[0].id;
        currentTab = activeTabId;
        console.log('\ud83c\udfaf Detected active tab on load:', currentTab);
    }
    
    // Initialize real-time status immediately
    updateRealtimeStatus('syncing', 'Loading...');
    
    // PHASE 1: Load critical data first (Overview counts) - Fast!
    console.log('\ud83c\udfaf Phase 1: Loading critical overview data...');
    let dataLoadSuccess = false;
    try {
        const result = await loadDashboardDataOptimized();
        criticalDataLoaded = true;
        dataLoadSuccess = result !== false;
        const phase1Time = Date.now() - loadStartTime;
        console.log(`\u2705 Phase 1 complete in ${phase1Time}ms`, { success: dataLoadSuccess });
    } catch (error) {
        console.error('\u274c Phase 1 failed:', error);
        criticalDataLoaded = false;
        dataLoadSuccess = false;
    }
    
    // Setup modal event listeners (synchronous, fast)
    setupModalListeners();
    
    // Enable auto-refresh immediately for real-time updates
    startAutoRefresh();
    
    // Mark as connected ONLY if data loaded successfully
    if (dataLoadSuccess && criticalDataLoaded) {
        updateRealtimeStatus('connected', 'Live', Date.now());
    } else {
        updateRealtimeStatus('error', 'Load Failed - Retrying');
        // Try manual refresh after brief delay
        setTimeout(() => {
            console.log('\ud83d\udd04 Retrying data load...');
            manualRefresh();
        }, 2000);
    }
    
    // PHASE 2: Load secondary data in background (non-blocking)
    console.log('📦 Phase 2: Loading secondary data in background...');
    setTimeout(async () => {
        try {
            // Load User Management data if that tab is active
            const userManagementTab = document.getElementById('user-management');
            console.log('🔍 Checking user-management tab:', {
                exists: !!userManagementTab,
                hasActiveClass: userManagementTab?.classList.contains('active'),
                currentTab: currentTab
            });
            
            if (userManagementTab && userManagementTab.classList.contains('active')) {
                console.log('🚀 User Management tab is active - loading data...');
                try {
                    await fetchUsersFromDatabase(true);
                    console.log('✅ fetchUsersFromDatabase completed');
                    await loadUserManagement();
                    console.log('✅ loadUserManagement completed');
                } catch (err) {
                    console.error('❌ Error loading user management on initial load:', err);
                    console.error('Error details:', err.message, err.stack);
                }
            } else if (currentTab === 'user-management') {
                // Fallback: If currentTab is set but element check failed
                console.log('🔄 Loading user management via currentTab fallback...');
                try {
                    await fetchUsersFromDatabase(true);
                    await loadUserManagement();
                } catch (err) {
                    console.error('❌ Error in fallback user management load:', err);
                }
            }
            
            // Check for new consultations (low priority)
            checkNewConsultations();
            
            isInitialLoadComplete = true;
            const totalTime = Date.now() - loadStartTime;
            console.log(`✅ Full dashboard loaded in ${totalTime}ms`);
        } catch (error) {
            console.error('⚠️  Phase 2 warning:', error);
            // Non-critical, continue anyway
        }
    }, 100); // Small delay to not block critical rendering
    
    // Setup mobile-specific features
    setupMobileOptimizations();
});

// Mobile-specific optimizations for real-time updates
function setupMobileOptimizations() {
    // Page Visibility API - handle mobile tab switching and background states
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle page focus/blur for mobile devices
    window.addEventListener('focus', handlePageFocus);
    window.addEventListener('blur', handlePageBlur);
    
    // Network Information API for mobile network optimization
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            console.log(`Mobile network type: ${connection.effectiveType}`);
            
            // Listen for network changes
            connection.addEventListener('change', () => {
                console.log(`Network changed to: ${connection.effectiveType}`);
                handleNetworkChange(connection.effectiveType);
            });
        }
    }
    
    // Online/offline detection for mobile
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    console.log('Mobile optimizations enabled: Page Visibility API + Network Detection active');
}

function handleNetworkChange(effectiveType) {
    // Adjust refresh behavior based on network quality
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        console.log('Slow network detected - consider reducing refresh frequency');
        updateRealtimeStatus('connected', 'Live (slow network)', lastSyncTime);
    } else if (effectiveType === '3g') {
        updateRealtimeStatus('connected', 'Live (3G)', lastSyncTime);
    } else {
        updateRealtimeStatus('connected', 'Live', lastSyncTime);
    }
}

function handleOnline() {
    console.log('Mobile device is online - resuming refresh');
    updateRealtimeStatus('connected', 'Back Online');
    if (!autoRefreshInterval) {
        startAutoRefresh();
    }
    // Immediate refresh after coming back online
    setTimeout(() => manualRefresh(), 500);
}

function handleOffline() {
    console.log('Mobile device is offline');
    updateRealtimeStatus('error', 'Offline - No Connection');
    stopAutoRefresh();
}

function handleVisibilityChange() {
    if (document.hidden) {
        // Page is hidden (user switched tabs or app went to background)
        console.log('📴 Page hidden - pausing aggressive refresh (battery saving)');
        // Keep interval running but will skip refreshes while hidden
    } else {
        // Page is visible again - immediately refresh to show latest data
        const timeSinceLastSync = lastSyncTime ? Date.now() - lastSyncTime : Infinity;
        console.log(`👁️  Page visible - refreshing immediately (last sync: ${Math.round(timeSinceLastSync/1000)}s ago)`);
        updateRealtimeStatus('syncing', 'Updating...');
        
        // Force immediate refresh when user returns (more aggressive on mobile)
        const delay = isMobileDevice ? 50 : 100; // Even faster on mobile
        setTimeout(async () => {
            try {
                // Force fresh data from server
                await fetchUsersFromDatabase(true);
                await fetchAdmins(true);
                await refreshCurrentTabData();
                updateRealtimeStatus('connected', 'Live', Date.now());
                console.log('✅ Mobile: Data refreshed successfully on return');
                
                if (isMobileDevice) {
                    flashMobileIndicator('success');
                }
            } catch (error) {
                console.error('❌ Mobile: Refresh on visibility change failed', error);
                updateRealtimeStatus('error', 'Refresh Failed');
                // Retry once more after 2 seconds
                setTimeout(() => manualRefresh(), 2000);
            }
        }, delay);
    }
}

function handlePageFocus() {
    console.log('Page focused - mobile device active');
    // Restart auto-refresh if it was stopped
    if (!autoRefreshInterval) {
        startAutoRefresh();
    }
}

function handlePageBlur() {
    console.log('Page blurred - mobile device may be inactive');
    // Keep running but log the state change
}

// Auto-refresh functionality for real-time database updates
let autoRefreshInterval = null;
const MOBILE_REFRESH_INTERVAL = 15000; // Increased to 15 seconds for mobile to reduce load
const DESKTOP_REFRESH_INTERVAL = 20000; // Increased to 20 seconds for desktop
const MAX_RETRY_FAILURES = 3; // Stop auto-refresh after 3 consecutive failures
let lastSuccessfulSync = null;
let consecutiveFailures = 0;

function startAutoRefresh() {
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Mobile gets faster refresh for better real-time experience
    const refreshInterval = isMobileDevice ? MOBILE_REFRESH_INTERVAL : DESKTOP_REFRESH_INTERVAL;
    const deviceType = isMobileDevice ? 'mobile' : 'desktop';
    const interval = isMobileDevice ? '15 seconds' : '20 seconds';
    console.log(`🔄 Starting real-time sync for ${deviceType} (every ${interval})...`);
    
    // Refresh data at specified interval for real-time updates
    autoRefreshInterval = setInterval(async () => {
        // Skip refresh if page is hidden on mobile to save battery
        if (isMobileDevice && document.hidden) {
            console.log('📱 Mobile: Skipping refresh while page is hidden (battery saving)');
            return;
        }
        if (isRefreshing) {
            console.log('Refresh already in progress, skipping...');
            return;
        }
        
        const startTime = Date.now();
        console.log(`${isMobileDevice ? '📱' : '💻'} Auto-refreshing data from database...`);
        updateRealtimeStatus('syncing', 'Syncing...');
        
        try {
            await refreshCurrentTabData();
            const syncDuration = Date.now() - startTime;
            console.log(`✅ Sync completed in ${syncDuration}ms`);
            
            lastSuccessfulSync = Date.now();
            consecutiveFailures = 0;
            syncFailureCount = 0;
            updateRealtimeStatus('connected', 'Live', Date.now());
            
            // Show sync success indicator on mobile
            if (isMobileDevice) {
                flashMobileIndicator('success');
            }
        } catch (error) {
            console.error('❌ Auto-refresh error:', error);
            consecutiveFailures++;
            syncFailureCount++;
            
            if (consecutiveFailures >= MAX_RETRY_FAILURES) {
                updateRealtimeStatus('error', 'Connection Lost - Auto-refresh Paused');
                console.error(`🔴 ${consecutiveFailures} consecutive failures detected. Stopping auto-refresh.`);
                console.error('⚠️ To retry, click the "Refresh" button manually or reload the page.');
                
                // STOP auto-refresh to prevent overwhelming the server
                stopAutoRefresh();
                
                // Show error notification to user
                if (typeof showAdminNotification !== 'undefined') {
                    showAdminNotification('Connection Error', 'Auto-refresh paused due to connection issues. Click "Refresh" to retry manually.', 'error');
                }
            } else {
                updateRealtimeStatus('connected', `Retry ${consecutiveFailures}/${MAX_RETRY_FAILURES}`, lastSyncTime);
                console.warn(`⚠️ Retry attempt ${consecutiveFailures} of ${MAX_RETRY_FAILURES}`);
            }
        }
    }, refreshInterval);
    
    console.log(`✅ Real-time auto-refresh enabled (${refreshInterval}ms interval)`);
    
    // Add mobile-specific optimizations
    if (isMobileDevice) {
        console.log('📱 Mobile optimizations: Fast polling (5s), aggressive reconnection, battery-aware');
    }
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        updateRealtimeStatus('error', 'Offline');
        console.log('Auto-refresh stopped');
    }
}

async function refreshCurrentTabData() {
    if (isRefreshing) {
        console.log('Refresh already in progress, skipping duplicate call...');
        return;
    }
    
    isRefreshing = true;
    const deviceType = isMobileDevice ? '[Mobile]' : '[Desktop]';
    console.log(`${deviceType} Refreshing current tab data...`);
    
    try {
        // Force refresh cache for current tab based on what's visible
        if (currentTab === 'overview') {
            await loadDashboardData();
        } else if (currentTab === 'user-management') {
            await fetchUsersFromDatabase(true); // Force refresh
            await loadUserManagement();
        } else if (currentTab === 'admin-management') {
            await fetchAdmins(true); // Force refresh
            await loadAdminManagement();
        } else if (currentTab === 'partner-messages') {
            await loadPartnerMessages();
        } else if (currentTab === 'educator-messages') {
            await loadEducatorMessages();
        } else if (currentTab === 'schools' || currentTab === 'school-partners') {
            // Refresh school-related data
            await loadPartnerSchoolsDisplay();
        }
        
        // Always refresh overview counts in background
        await updateOverviewCounts();
    } finally {
        isRefreshing = false;
    }
}

// Helper function to update overview counts without full page reload
async function updateOverviewCounts() {
    try {
        const admins = await fetchAdmins();
        const users = await fetchUsersFromDatabase();
        const teachers = getTeachers();
        const partners = await getSchoolPartners();
        
        const totalAdminsEl = document.getElementById('totalAdmins');
        const totalUsersEl = document.getElementById('totalUsers');
        const totalTeachersEl = document.getElementById('totalTeachers');
        const totalPartnerSchoolsEl = document.getElementById('totalPartnerSchools');
        
        if (totalAdminsEl) totalAdminsEl.textContent = admins.length;
        if (totalUsersEl) totalUsersEl.textContent = users.length;
        if (totalTeachersEl) totalTeachersEl.textContent = teachers.length;
        if (totalPartnerSchoolsEl) totalPartnerSchoolsEl.textContent = partners.length;
    } catch (error) {
        console.error('Error updating overview counts:', error);
    }
}

// Global manual refresh function for all devices (especially mobile)
async function manualRefresh() {
    console.log('🔄 Manual refresh triggered (mobile/desktop) - FORCING DATABASE REFRESH');
    updateRealtimeStatus('syncing', 'Refreshing...');
    
    // Animate the refresh button
    const mobileBtn = document.getElementById('mobileRefreshBtn');
    const overviewIcon = document.getElementById('overviewRefreshIcon');
    
    if (mobileBtn) {
        mobileBtn.classList.add('spinning');
    }
    if (overviewIcon) {
        overviewIcon.style.animation = 'spin 1s linear infinite';
    }
    
    try {
        console.log('📊 Step 1: Force refresh users from database...');
        // Force refresh all data
        await fetchUsersFromDatabase(true);
        
        console.log('📊 Step 2: Force refresh admins from database...');
        await fetchAdmins(true);
        
        console.log('📊 Step 3: Reload dashboard data...');
        await loadDashboardData();
        
        console.log('📊 Step 4: Refresh current tab data...');
        await refreshCurrentTabData();
        
        updateRealtimeStatus('connected', 'Live', Date.now());
        
        // Show success feedback
        if (isMobileDevice) {
            showAdminNotification('Success', '✓ Data refreshed successfully!');
        }
        
        console.log('✅ Manual refresh completed successfully');
    } catch (error) {
        console.error('❌ Manual refresh error:', error);
        console.error('Error details:', error.message, error.stack);
        updateRealtimeStatus('error', 'Refresh Failed');
        showAdminNotification('Error', 'Failed to refresh data: ' + error.message, 'error');
    } finally {
        // Stop animation
        if (mobileBtn) {
            mobileBtn.classList.remove('spinning');
        }
        if (overviewIcon) {
            overviewIcon.style.animation = '';
        }
    }
}

// Manual refresh function for user management
async function refreshUserData() {
    console.log('Manually refreshing user data from database...');
    updateRealtimeStatus('syncing', 'Refreshing...');
    
    const refreshBtn = document.getElementById('refreshUsersBtn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Refreshing...';
    }
    
    try {
        await fetchUsersFromDatabase(true); // Force refresh from database
        await loadUserManagement();
        await loadDashboardData(); // Update counts
        updateRealtimeStatus('connected', 'Live', Date.now());
        showAdminNotification('Success', 'User data refreshed from database!');
    } catch (error) {
        console.error('Refresh error:', error);
        updateRealtimeStatus('error', 'Refresh Failed');
        showAdminNotification('Error', 'Failed to refresh data', 'error');
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄 Refresh';
        }
    }
}

function showTab(tabName) {
    console.log('=== Switching to tab:', tabName, '===');
    
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
    if (event && event.target) {
        const menuItem = event.target.closest('.menu-item');
        if (menuItem) {
            menuItem.classList.add('active');
        }
    }
    
    // Update current tab immediately
    currentTab = tabName;
    
    // Load data for the tab - Force refresh from database for critical tabs
    if (tabName === 'admin-management') {
        loadAdminManagement();
    } else if (tabName === 'user-management') {
        console.log('🎯 Loading User Management tab...');
        console.log('Current userSource before fetch:', userSource);
        console.log('Cache size before fetch:', userListCache.length);
        
        // Show loading state immediately with helpful message
        const tableBody = document.getElementById('userTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" class="no-data" style="text-align: center; padding: 40px;"><div style="font-size: 18px; margin-bottom: 10px;">🔄 Loading users from database...</div><div style="font-size: 14px; color: #666;">This may take up to 15 seconds on slower servers</div><div style="font-size: 12px; color: #999; margin-top: 10px;">Check console (F12) for detailed progress</div></td></tr>';
        }
        
        // Update status indicator
        updateRealtimeStatus('syncing', 'Fetching users...');
        
        // Always fetch fresh data from database when opening user management
        const startTime = Date.now();
        fetchUsersFromDatabase(true)
            .then(() => {
                const duration = Date.now() - startTime;
                console.log(`✅ Fetch complete in ${duration}ms, loading user management UI...`);
                console.log('userSource after fetch:', userSource);
                console.log('Cache size after fetch:', userListCache.length);
                return loadUserManagement();
            })
            .then(() => {
                console.log('✅ User management UI loaded successfully');
                updateRealtimeStatus('connected', 'Live', Date.now());
            })
            .catch(error => {
                console.error('❌ Error loading user management:', error);
                console.error('Stack:', error.stack);
                updateRealtimeStatus('error', 'Load Failed');
                // Try to load anyway with cached data
                loadUserManagement();
            });
    } else if (tabName === 'teacher-management') {
        loadTeacherManagement();
    } else if (tabName === 'schools') {
        loadPartnerSchoolsDisplay();
    } else if (tabName === 'school-partners') {
        loadSchoolPartnersManagement();
    } else if (tabName === 'school-accounts') {
        loadSchoolAccounts();
    } else if (tabName === 'consultations') {
        loadConsultations();
    } else if (tabName === 'partner-messages') {
        loadPartnerMessages();
    } else if (tabName === 'educator-messages') {
        loadEducatorMessages();
    } else if (tabName === 'debug-storage') {
        refreshDebugData();
    }
}

// Optimized dashboard data loading with parallel requests and caching
async function loadDashboardDataOptimized() {
    const startTime = Date.now();
    try {
        console.log('⚡ Loading dashboard data in parallel...');
        logMobileDebug('Starting parallel data load');
        
        // FORCE REFRESH on initial load to ensure fresh data from database
        const forceInitialRefresh = !isInitialLoadComplete;
        console.log('🔄 Force refresh:', forceInitialRefresh);
        
        // Load all data in parallel with timeout protection
        const loadPromises = [
            fetchAdmins(forceInitialRefresh), // Force refresh on initial load
            fetchUsersFromDatabase(forceInitialRefresh), // Force refresh from database
            Promise.resolve(getTeachers()), // Synchronous, wrap in Promise
            getSchoolPartners()
        ];
        
        // Add individual timeouts to each promise
        const timedPromises = loadPromises.map((p, i) => 
            Promise.race([
                p,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Timeout loading data ${i}`)), 5000)
                )
            ])
        );
        
        const [admins, users, teachers, partners] = await Promise.allSettled(timedPromises);
        
        // Extract values, handling rejected promises
        const adminsData = admins.status === 'fulfilled' ? admins.value : [];
        const usersData = users.status === 'fulfilled' ? users.value : [];
        const teachersData = teachers.status === 'fulfilled' ? teachers.value : [];
        const partnersData = partners.status === 'fulfilled' ? partners.value : [];
        
        // Update counts with null checks
        const totalAdminsEl = document.getElementById('totalAdmins');
        const totalUsersEl = document.getElementById('totalUsers');
        const totalTeachersEl = document.getElementById('totalTeachers');
        const totalPartnerSchoolsEl = document.getElementById('totalPartnerSchools');
        
        if (totalAdminsEl) totalAdminsEl.textContent = adminsData.length;
        if (totalUsersEl) totalUsersEl.textContent = usersData.length;
        if (totalTeachersEl) totalTeachersEl.textContent = teachersData.length;
        if (totalPartnerSchoolsEl) totalPartnerSchoolsEl.textContent = partnersData.length;
        
        const loadTime = Date.now() - startTime;
        const hasData = adminsData.length > 0 || usersData.length > 0;
        console.log(`✅ Dashboard data loaded in ${loadTime}ms (parallel):`, {
            admins: adminsData.length,
            users: usersData.length,
            teachers: teachersData.length,
            partners: partnersData.length,
            hasData: hasData
        });
        logMobileDebug('Dashboard data loaded', { 
            time: loadTime, 
            counts: { 
                admins: adminsData.length, 
                users: usersData.length 
            },
            hasData: hasData
        });
        
        // Return true only if we have actual data
        if (!hasData) {
            console.warn('⚠️ Dashboard loaded but no data found!');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('❌ CRITICAL ERROR loading dashboard data:', error);
        console.error('Error details:', error.message, error.stack);
        logMobileDebug('Dashboard load error', { error: error.message });
        
        // Show error in UI
        const totalAdminsEl = document.getElementById('totalAdmins');
        const totalUsersEl = document.getElementById('totalUsers');
        const totalTeachersEl = document.getElementById('totalTeachers');
        const totalPartnerSchoolsEl = document.getElementById('totalPartnerSchools');
        
        if (totalAdminsEl) totalAdminsEl.textContent = '⚠️';
        if (totalUsersEl) totalUsersEl.textContent = '⚠️';
        if (totalTeachersEl) totalTeachersEl.textContent = '⚠️';
        if (totalPartnerSchoolsEl) totalPartnerSchoolsEl.textContent = '⚠️';
        
        return false;
    }
}

async function loadDashboardData() {
    try {
        const admins = await fetchAdmins();
        const users = await fetchUsersFromDatabase(); // Now fetching from database
        const teachers = getTeachers(); // teachers remain local for now
        const partners = await getSchoolPartners();
        
        // Update counts with null checks
        const totalAdminsEl = document.getElementById('totalAdmins');
        const totalUsersEl = document.getElementById('totalUsers');
        const totalTeachersEl = document.getElementById('totalTeachers');
        const totalPartnerSchoolsEl = document.getElementById('totalPartnerSchools');
        
        if (totalAdminsEl) totalAdminsEl.textContent = admins.length;
        if (totalUsersEl) totalUsersEl.textContent = users.length;
        if (totalTeachersEl) totalTeachersEl.textContent = teachers.length;
        if (totalPartnerSchoolsEl) totalPartnerSchoolsEl.textContent = partners.length;
        
        console.log('Dashboard data loaded:', {
            admins: admins.length,
            users: users.length,
            teachers: teachers.length,
            partners: partners.length
        });
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Fetch admins from backend when possible; fallback to localStorage
async function fetchAdmins(forceRefresh = false) {
    if (!forceRefresh && adminListCache.length > 0) {
        return adminListCache;
    }

    if (typeof api !== 'undefined') {
        try {
            const response = await api.getAllAdmins();
            // Handle both response formats: response.admins or response.data.admins
            const admins = response.admins || (response.data && response.data.admins);
            
            if (response && response.success && Array.isArray(admins)) {
                adminSource = 'backend';
                adminListCache = admins.map(a => ({
                    ...a,
                    createdDate: a.createdDate || a.createdAt || a.created_on || new Date().toISOString()
                }));
                console.log(`✓ Loaded ${adminListCache.length} admins from database backend`);
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

// NEW: Fetch users from database backend when possible; fallback to localStorage
async function fetchUsersFromDatabase(forceRefresh = false) {
    console.log('📡 fetchUsersFromDatabase called with forceRefresh:', forceRefresh);
    console.log('📊 Current cache status:', { cacheLength: userListCache.length, userSource });
    
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && userListCache.length > 0 && userSource === 'backend') {
        console.log('✅ Returning cached users from backend:', userListCache.length);
        return userListCache;
    }

    // Check if API is available
    if (typeof api === 'undefined' || typeof API_CONFIG === 'undefined') {
        console.error('❌ API or API_CONFIG not available!');
        console.error('typeof api:', typeof api);
        console.error('typeof API_CONFIG:', typeof API_CONFIG);
        // Fall through to localStorage
    } else {
        try {
            console.log('🌐 Attempting to fetch users from database API...');
            console.log('📍 API BASE URL:', API_CONFIG.BASE_URL);
            console.log('📍 API Endpoint:', API_CONFIG.ENDPOINTS.ADMIN_USERS);
            console.log('📍 Full URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}`);
            
            const response = await api.getAllUsers();
            console.log('✅ API Response received:', response);
            console.log('Response structure:', {
                hasSuccess: 'success' in response,
                success: response.success,
                hasData: 'data' in response,
                hasUsers: 'users' in response,
                dataKeys: response.data ? Object.keys(response.data) : 'no data',
                topLevelKeys: Object.keys(response)
            });
            
            // Handle both response formats: response.users or response.data.users
            let users = null;
            if (response.data && Array.isArray(response.data.users)) {
                users = response.data.users;
                console.log('✓ Found users in response.data.users');
            } else if (Array.isArray(response.users)) {
                users = response.users;
                console.log('✓ Found users in response.users');
            }
            
            console.log('Extracted users array:', users);
            console.log('Is array?', Array.isArray(users));
            console.log('User count:', users ? users.length : 'null/undefined');
            
            // Check if response is successful and users is an array (even if empty)
            if (response && response.success === true && Array.isArray(users)) {
                userSource = 'backend';
                userListCache = users.map(u => ({
                    ...u,
                    fullName: u.fullName || u.username,
                    phoneNumber: u.phoneNumber || u.phone,
                    createdDate: u.createdDate || u.created_at || new Date().toISOString()
                }));
                console.log(`✅ SUCCESS: Loaded ${userListCache.length} users from database backend`);
                if (userListCache.length > 0) {
                    console.log('📋 Sample user data:', JSON.stringify(userListCache[0], null, 2));
                    console.log('🎯 All users:', userListCache.map(u => ({ id: u.id, username: u.username, email: u.email })));
                } else {
                    console.log('ℹ️  Database is empty - no users registered yet');
                }
                return userListCache;
            } else {
                console.error('❌ API response validation failed!');
                console.error('📊 Response details:', {
                    hasResponse: !!response,
                    success: response?.success,
                    successType: typeof response?.success,
                    hasUsers: !!users,
                    isArray: Array.isArray(users),
                    userCount: users?.length,
                    responseKeys: response ? Object.keys(response) : [],
                    dataKeys: response?.data ? Object.keys(response.data) : []
                });
                console.error('📄 Full response:', JSON.stringify(response, null, 2));
                console.error('⚠️  Falling through to localStorage due to validation failure');
            }
        } catch (error) {
            console.error('❌ CRITICAL: Fetch users from database failed!');
            console.error('Error message:', error.message);
            console.error('Error name:', error.name);
            console.error('Error stack:', error.stack);
            console.error('Full error object:', error);
            console.error('⚠️  Falling through to localStorage due to exception');
            
            // Store error for diagnostic panel
            localStorage.setItem('lastUserAPIError', `${error.name}: ${error.message}`);
            
            // Show diagnostic panel if available
            if (typeof showDiagnosticWithError === 'function') {
                showDiagnosticWithError(`${error.name}: ${error.message}`);
            }
        }
    }

    // Fallback to localStorage
    console.log('📦 Falling back to localStorage');
    userSource = 'local';
    userListCache = getUsers().map(u => ({
        ...u,
        createdDate: u.createdDate || new Date().toISOString()
    }));
    console.log(`📦 Loaded ${userListCache.length} users from localStorage`);
    return userListCache;
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

async function loadUserManagement() {
    console.log('🎯 loadUserManagement called');
    console.log('Current state: userSource=' + userSource + ', cache=' + userListCache.length);
    
    const tableBody = document.getElementById('userTableBody');
    
    if (!tableBody) {
        console.error('❌ userTableBody element not found in DOM!');
        return;
    }
    
    try {
        console.log('🔄 Fetching users (will use cache if available)...');
        const users = await fetchUsersFromDatabase(); // This returns cached data if userSource is 'backend'
        console.log('📊 fetchUsersFromDatabase returned:', { 
            count: users?.length, 
            source: userSource,
            isArray: Array.isArray(users)
        });
        
        // ALWAYS update data source indicator
        updateDataSourceIndicator(userSource);
        
        // ALWAYS update last refresh time
        const now = new Date().toLocaleTimeString();
        const lastUpdateEl = document.getElementById('lastUpdateTime');
        if (lastUpdateEl) {
            lastUpdateEl.textContent = `Last updated: ${now} (${userSource})`;
        }
        
        // Check if we have no users
        if (!users || !Array.isArray(users) || users.length === 0) {
            const sourceText = userSource === 'backend' ? 
                '🟢 Connected to Live Database - No users registered yet<br><small style="color: #28a745;">✅ Database connection successful • Source: Hostinger MySQL<br>Users will appear here once they register on your website.</small>' : 
                '🟡 Using Local Storage (Fallback)<br><small style="color: #ffc107;">⚠️ Could not connect to database<br>Check browser console (F12) for detailed error messages<br>Click "Test API" button for diagnostics</small>';
            const errorMsg = `<tr><td colspan="6" class="no-data" style="padding: 40px; text-align: center;">${sourceText}</td></tr>`;
            tableBody.innerHTML = errorMsg;
            console.log('ℹ️  No users to display. Source:', userSource);
            console.log('Debug info:', { 
                users, 
                userSource, 
                cacheLength: userListCache.length,
                apiConfigExists: !!API_CONFIG,
                apiObjectExists: typeof api !== 'undefined',
                apiBaseUrl: API_CONFIG?.BASE_URL,
                apiEndpoint: API_CONFIG?.ENDPOINTS?.ADMIN_USERS
            });
            
            // Show diagnostic panel if using localStorage
            if (userSource === 'local' && typeof showDiagnosticWithError === 'function') {
                const lastError = localStorage.getItem('lastUserAPIError') || 'API call failed - check console';
                setTimeout(() => showDiagnosticWithError(lastError), 500);
            }
            
            return;
        }
        
        console.log('✅ Processing', users.length, 'users for display...');
        console.log('Sample user:', users[0]);
    
        let html = '';
        users.forEach((user, index) => {
            const progress = getUserProgress(user.email);
            const userId = user.id || user.email; // Use database ID if available, fallback to email
            const statusBadge = user.status ? `<span class="status-badge ${user.status}">${user.status}</span>` : '';
            const sourceLabel = userSource === 'backend' ? `<small style="color: #28a745;">(DB-${user.id})</small>` : '<small style="color: #ffc107;">(Local)</small>';
            
            html += `
                <tr>
                    <td>${user.fullName || user.username || 'N/A'} ${user.id ? sourceLabel : ''}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.phoneNumber || user.phone || 'N/A'}</td>
                    <td>${user.qualification || 'N/A'}</td>
                    <td>${progress}%</td>
                    <td>
                        <button class="action-btn edit" onclick="editUser('${user.email}')">Edit</button>
                        <button class="action-btn delete" onclick="deleteUser('${userId}', '${user.email}')">Delete</button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        console.log(`✅ SUCCESS: Displayed ${users.length} users from ${userSource} at ${now}`);
        console.log('Table HTML length:', html.length);
        console.log('TableBody has content:', tableBody.innerHTML.length > 0);
        
    } catch (error) {
        console.error('❌ Error in loadUserManagement:', error);
        console.error('Error stack:', error.stack);
        updateDataSourceIndicator('error');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" class="no-data" style="color: #dc3545; padding: 40px; text-align: center;">❌ Error loading users<br><small>' + error.message + '</small><br><small>Check browser console (F12) for full details</small></td></tr>';
        }
        
        // Store error for diagnostic
        localStorage.setItem('lastUserAPIError', error.message);
    }
}

// Update data source indicator
function updateDataSourceIndicator(source) {
    const indicator = document.getElementById('dataSourceIndicator');
    if (indicator) {
        if (source === 'backend') {
            indicator.innerHTML = '🟢 Live Database (Hostinger MySQL)';
            indicator.style.color = '#28a745';
        } else if (source === 'error') {
            indicator.innerHTML = '🔴 Error Loading Data';
            indicator.style.color = '#dc3545';
        } else {
            indicator.innerHTML = '🟡 Local Storage (Fallback)';
            indicator.style.color = '#ffc107';
        }
    }
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
    
    // Add Teacher Form
    const addTeacherForm = document.getElementById('addTeacherForm');
    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', handleAddTeacher);
    }
    
    // Edit Teacher Form
    const editTeacherForm = document.getElementById('editTeacherForm');
    if (editTeacherForm) {
        editTeacherForm.addEventListener('submit', handleEditTeacher);
    }
    
    // Edit Admin Form
    const editAdminForm = document.getElementById('editAdminForm');
    if (editAdminForm) {
        editAdminForm.addEventListener('submit', handleEditAdmin);
    }
    
    // Delete Confirmation Modal Buttons - Ensure they work
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
        const deleteBtn = deleteModal.querySelector('.btn-danger');
        const cancelBtn = deleteModal.querySelector('.btn-secondary');
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delete button clicked via event listener');
                confirmDelete();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cancel button clicked via event listener');
                closeDeleteConfirm();
            });
        }
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
async function handleAddUser(event) {
    event.preventDefault();
    console.log('🆕 handleAddUser called - Starting user creation process...');
    hideError('userModalError');
    
    const fullName = document.getElementById('newUserName').value.trim();
    const phoneNumber = document.getElementById('newUserPhone').value.trim();
    const qualification = document.getElementById('newUserQualification').value;
    const email = document.getElementById('newUserEmail').value.trim();
    const password = document.getElementById('newUserPassword').value;
    
    console.log('📝 Form data collected:', {
        fullName,
        phoneNumber,
        qualification,
        email,
        passwordLength: password.length
    });
    
    // Validation
    if (!fullName || !phoneNumber || !qualification || !email || !password) {
        console.error('❌ Validation failed: Missing required fields');
        showError('userModalError', 'All fields are required.');
        return;
    }
    
    if (!isValidEmail(email)) {
        console.error('❌ Validation failed: Invalid email');
        showError('userModalError', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phoneNumber)) {
        console.error('❌ Validation failed: Invalid phone number');
        showError('userModalError', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    if (password.length < 8) {
        console.error('❌ Validation failed: Password too short');
        showError('userModalError', 'Password must be at least 8 characters long.');
        return;
    }
    
    console.log('✅ All validations passed');
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding to Database...';
    
    try {
        // Try to add user to Hostinger database via API
        if (typeof api !== 'undefined') {
            console.log('🎯 API object is available');
            console.log('📍 API Base URL:', API_CONFIG?.BASE_URL);
            console.log('📍 Register endpoint:', API_CONFIG?.ENDPOINTS?.USER_REGISTER);
            console.log('🎯 Adding user to Hostinger MySQL database...');
            
            const userData = {
                username: fullName,
                phone: phoneNumber,
                qualification: qualification,
                email: email,
                password: password
            };
            
            console.log('📤 Sending request to API with data:', {
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                qualification: userData.qualification
            });
            
            const response = await api.registerUser(userData);
            console.log('📡 API Response received:', response);
            console.log('📊 Response details:', {
                success: response?.success,
                message: response?.message,
                hasData: !!response?.data,
                dataId: response?.data?.id
            });
            
            if (response && response.success === true) {
                console.log('✅ SUCCESS: User successfully added to database!');
                console.log('📋 User ID:', response.data?.id);
                console.log('📋 Username:', response.data?.username);
                
                console.log('🔄 Step 1: Refreshing user list from database...');
                // Refresh user list from database
                await fetchUsersFromDatabase(true);
                
                console.log('🔄 Step 2: Reloading user management UI...');
                await loadUserManagement();
                
                console.log('🔄 Step 3: Updating dashboard counts...');
                await loadDashboardData();
                
                console.log('✅ All refresh steps completed');
                
                closeAddUserModal();
                showAdminNotification('Success', `User "${fullName}" added to database successfully! They can now login.`);
                updateRealtimeStatus('connected', 'Live', Date.now());
                console.log('🎉 User creation process completed successfully!');
                return;
            } else {
                // API returned error
                const errorMsg = response?.message || 'Failed to add user to database';
                console.error('❌ API returned failure response');
                console.error('❌ Error message:', errorMsg);
                console.error('❌ Full response:', JSON.stringify(response, null, 2));
                throw new Error(errorMsg);
            }
        } else {
            console.error('❌ API object not available!');
            console.error('typeof api:', typeof api);
            throw new Error('API not available - cannot connect to database');
        }
        
    } catch (error) {
        console.error('❌ EXCEPTION CAUGHT: Failed to add user to database');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Show specific error messages
        let errorMessage = 'Failed to add user to database. ';
        
        if (error.message.includes('already exists')) {
            errorMessage = 'A user with this email or username already exists in the database.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Database connection timeout. Please check your internet connection.';
        } else if (error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += 'Please check console for details.';
        }
        
        console.error('❌ Showing error to user:', errorMessage);
        showError('userModalError', errorMessage);
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Don't fall back to localStorage - we want database only
        updateRealtimeStatus('error', 'Database Error');
    }
}

// Edit User Functions
async function editUser(email) {
    console.log('📝 Loading user data for editing:', email);
    
    // Try to find user from cache first
    let user = userListCache.find(u => u.email === email);
    
    // Fallback to localStorage
    if (!user) {
        const users = getUsers();
        user = users.find(u => u.email === email);
    }
    
    if (!user) {
        showAdminNotification('Error', 'User not found!', 'error');
        return;
    }
    
    console.log('Found user:', user);
    
    // Fill form with user data
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserName').value = user.fullName || user.username;
    document.getElementById('editUserNewEmail').value = user.email;
    document.getElementById('editUserPhone').value = user.phoneNumber || user.phone;
    document.getElementById('editUserQualification').value = user.qualification;
    document.getElementById('editUserPassword').value = '';
    document.getElementById('confirmEditUserPassword').value = '';
    
    // Store user ID for later use
    if (user.id) {
        document.getElementById('editUserForm').setAttribute('data-user-id', user.id);
    }
    
    showEditUserModal();
}

async function handleEditUser(event) {
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
    
    // Get user ID from form attribute
    const userId = document.getElementById('editUserForm').getAttribute('data-user-id');
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';
    
    try {
        // Try to update in database if user has ID (from backend)
        if (userId && typeof api !== 'undefined') {
            console.log('🎯 Updating user in Hostinger MySQL database...');
            console.log('User ID:', userId);
            
            const updateData = {
                username: fullName,
                phone: phoneNumber,
                qualification: qualification,
                email: newEmail
            };
            
            // Add password if provided
            if (newPassword) {
                updateData.password = newPassword;
            }
            
            console.log('Update data:', updateData);
            
            const response = await api.updateUser(userId, updateData);
            console.log('📡 API Response:', response);
            
            if (response && response.success) {
                console.log('✅ User successfully updated in database!');
                
                // Refresh user list from database
                await fetchUsersFromDatabase(true);
                await loadUserManagement();
                await loadDashboardData();
                
                closeEditUserModal();
                showAdminNotification('Success', `User "${fullName}" updated successfully in database!`);
                updateRealtimeStatus('connected', 'Live', Date.now());
                return;
            } else {
                const errorMsg = response.message || 'Failed to update user in database';
                console.error('❌ API Error:', errorMsg);
                throw new Error(errorMsg);
            }
        } else {
            // Fallback to localStorage for old users without database ID
            console.log('⚠️ User has no database ID, updating localStorage only...');
            
            // Check if new email already exists (if email changed)
            if (oldEmail !== newEmail) {
                const users = getUsers();
                const existingUser = users.find(u => u.email === newEmail);
                if (existingUser) {
                    showError('editUserModalError', 'A user with this email already exists.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    return;
                }
            }
            
            // Update user in localStorage
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === oldEmail);
            
            if (userIndex === -1) {
                showError('editUserModalError', 'User not found!');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
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
            
            closeEditUserModal();
            loadUserManagement();
            loadDashboardData();
            
            showAdminNotification('Success', 'User updated successfully in localStorage!');
        }
        
    } catch (error) {
        console.error('❌ Failed to update user:', error);
        
        let errorMessage = 'Failed to update user. ';
        if (error.message) {
            errorMessage += error.message;
        } else {
            errorMessage += 'Please check console for details.';
        }
        
        showError('editUserModalError', errorMessage);
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        updateRealtimeStatus('error', 'Database Error');
    }
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

function deleteUser(userId, email) {
    console.log('🗑️ deleteUser called:', { userId, email, userSource });
    
    showCustomConfirm(
        'Are you sure you want to delete this user? This action cannot be undone.',
        'Delete User',
        'Delete'
    ).then(async confirmed => {
        if (!confirmed) {
            console.log('Delete cancelled by user');
            return;
        }
        
        try {
            // Try backend deletion first if user is from database
            if (userSource === 'backend' && userId && typeof api !== 'undefined') {
                console.log('🌐 Attempting to delete user from database...', { userId, email });
                
                try {
                    const response = await api.deleteUser(userId);
                    console.log('🔍 Delete API response:', response);
                    
                    if (response && response.success) {
                        console.log('✅ User deleted successfully from database!');
                        
                        // Refresh data from database
                        await fetchUsersFromDatabase(true);
                        loadUserManagement();
                        loadDashboardData();
                        
                        showAdminNotification('Success', 'User deleted successfully from database!');
                        return;
                    } else {
                        console.error('❌ Delete API returned unsuccessful response:', response);
                        showAdminNotification('Error', response?.message || 'Failed to delete user from database', 'error');
                        return;
                    }
                } catch (apiError) {
                    console.error('❌ Backend delete user failed:', apiError);
                    showAdminNotification('Error', 'Failed to delete user from database: ' + (apiError.message || 'Unknown error'), 'error');
                    return;
                }
            }
            
            // If not using backend, fall back to localStorage
            console.log('⚠️ Using localStorage fallback for delete');
            const users = getUsers();
            const filteredUsers = users.filter(u => u.email !== email);
        
            saveUsers(filteredUsers);
            userListCache = filteredUsers;
            userSource = 'local';
            loadUserManagement();
            loadDashboardData();
            
            showAdminNotification('Success', 'User deleted from local storage!');
        } catch (error) {
            console.error('❌ Delete user error:', error);
            showAdminNotification('Error', error.message || 'Unable to delete user', 'error');
        }
    });
}

// ===== TEACHER MANAGEMENT FUNCTIONS =====

function showAddTeacherModal() {
    const modal = document.getElementById('addTeacherModal');
    modal.classList.add('show');
    hideError('teacherModalError');
}

function closeAddTeacherModal() {
    const modal = document.getElementById('addTeacherModal');
    modal.classList.remove('show');
    document.getElementById('addTeacherForm').reset();
}

function showEditTeacherModal() {
    const modal = document.getElementById('editTeacherModal');
    modal.classList.add('show');
    hideError('editTeacherModalError');
}

function closeEditTeacherModal() {
    const modal = document.getElementById('editTeacherModal');
    modal.classList.remove('show');
    document.getElementById('editTeacherForm').reset();
}

// Add Teacher Handler
function handleAddTeacher(event) {
    event.preventDefault();
    hideError('teacherModalError');
    
    const fullName = document.getElementById('newTeacherName').value.trim();
    const phoneNumber = document.getElementById('newTeacherPhone').value.trim();
    const qualification = document.getElementById('newTeacherQualification').value;
    const email = document.getElementById('newTeacherEmail').value.trim();
    const password = document.getElementById('newTeacherPassword').value;
    
    // Validation
    if (!fullName || !phoneNumber || !qualification || !email || !password) {
        showError('teacherModalError', 'All fields are required.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('teacherModalError', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phoneNumber)) {
        showError('teacherModalError', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    if (password.length < 8) {
        showError('teacherModalError', 'Password must be at least 8 characters long.');
        return;
    }
    
    // Check if teacher exists
    const teachers = getTeachers();
    const existingTeacher = teachers.find(t => t.email === email);
    
    if (existingTeacher) {
        showError('teacherModalError', 'Teacher with this email already exists.');
        return;
    }
    
    // Create new teacher
    const newTeacher = {
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
    
    teachers.push(newTeacher);
    saveTeachers(teachers);
    
    closeAddTeacherModal();
    loadTeacherManagement();
    loadDashboardData();
    
    showAdminNotification('Success', 'Teacher added successfully!');
}

// Edit Teacher Functions
function editTeacher(email) {
    const teachers = getTeachers();
    const teacher = teachers.find(t => t.email === email);
    
    if (!teacher) {
        showAdminNotification('Error', 'Teacher not found!', 'error');
        return;
    }
    
    // Fill form with teacher data
    document.getElementById('editTeacherEmail').value = teacher.email;
    document.getElementById('editTeacherName').value = teacher.fullName;
    document.getElementById('editTeacherNewEmail').value = teacher.email;
    document.getElementById('editTeacherPhone').value = teacher.phoneNumber;
    document.getElementById('editTeacherQualification').value = teacher.qualification;
    document.getElementById('editTeacherPassword').value = '';
    document.getElementById('confirmEditTeacherPassword').value = '';
    
    showEditTeacherModal();
}

function handleEditTeacher(event) {
    event.preventDefault();
    hideError('editTeacherModalError');
    
    const oldEmail = document.getElementById('editTeacherEmail').value;
    const fullName = document.getElementById('editTeacherName').value.trim();
    const newEmail = document.getElementById('editTeacherNewEmail').value.trim();
    const phoneNumber = document.getElementById('editTeacherPhone').value.trim();
    const qualification = document.getElementById('editTeacherQualification').value;
    const newPassword = document.getElementById('editTeacherPassword').value;
    const confirmPassword = document.getElementById('confirmEditTeacherPassword').value;
    
    // Validation
    if (!fullName || !newEmail || !phoneNumber || !qualification) {
        showError('editTeacherModalError', 'All required fields must be filled.');
        return;
    }
    
    if (!isValidEmail(newEmail)) {
        showError('editTeacherModalError', 'Please enter a valid email address.');
        return;
    }
    
    if (!isValidPhone(phoneNumber)) {
        showError('editTeacherModalError', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    // Check if new email already exists (if email changed)
    if (oldEmail !== newEmail) {
        const teachers = getTeachers();
        const existingTeacher = teachers.find(t => t.email === newEmail);
        if (existingTeacher) {
            showError('editTeacherModalError', 'A teacher with this email already exists.');
            return;
        }
    }
    
    // Validate password if provided
    if (newPassword) {
        if (newPassword.length < 8) {
            showError('editTeacherModalError', 'Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            showError('editTeacherModalError', 'Passwords do not match.');
            return;
        }
    }
    
    // Update teacher
    const teachers = getTeachers();
    const teacherIndex = teachers.findIndex(t => t.email === oldEmail);
    
    if (teacherIndex === -1) {
        showError('editTeacherModalError', 'Teacher not found!');
        return;
    }
    
    teachers[teacherIndex].fullName = fullName;
    teachers[teacherIndex].email = newEmail;
    teachers[teacherIndex].phoneNumber = phoneNumber;
    teachers[teacherIndex].qualification = qualification;
    
    // Update password if provided
    if (newPassword) {
        teachers[teacherIndex].password = newPassword;
    }
    
    saveTeachers(teachers);
    
    closeEditTeacherModal();
    loadTeacherManagement();
    loadDashboardData();
    
    showAdminNotification('Success', 'Teacher updated successfully!');
}

function deleteTeacher(email) {
    showCustomConfirm(
        'Are you sure you want to delete this teacher? This action cannot be undone.',
        'Delete Teacher',
        'Delete'
    ).then(confirmed => {
        if (!confirmed) return;
        
        const teachers = getTeachers();
        const filteredTeachers = teachers.filter(t => t.email !== email);
    
    saveTeachers(filteredTeachers);
    loadTeacherManagement();
    loadDashboardData();
    
    showAdminNotification('Success', 'Teacher deleted successfully!');
    });
}

// Load Teacher Management
function loadTeacherManagement() {
    const teachers = getTeachers();
    const tbody = document.getElementById('teacherTableBody');
    
    if (!tbody) return;
    
    if (teachers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No teachers found</td></tr>';
        return;
    }
    
    tbody.innerHTML = teachers.map(teacher => `
        <tr>
            <td>${escapeHtml(teacher.fullName)}</td>
            <td>${escapeHtml(teacher.email)}</td>
            <td>${escapeHtml(teacher.phoneNumber)}</td>
            <td>${escapeHtml(teacher.qualification)}</td>
            <td>
                <div class="progress-info">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${teacher.progress || 0}%"></div>
                    </div>
                    <span class="progress-text">${teacher.progress || 0}%</span>
                </div>
            </td>
            <td class="actions-cell">
                <button onclick="editTeacher('${escapeHtml(teacher.email)}')" class="btn-icon" title="Edit">✏️</button>
                <button onclick="deleteTeacher('${escapeHtml(teacher.email)}')" class="btn-icon" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Get/Save Teachers from localStorage
function getTeachers() {
    const teachers = localStorage.getItem('teachers');
    return teachers ? JSON.parse(teachers) : [];
}

function saveTeachers(teachers) {
    localStorage.setItem('teachers', JSON.stringify(teachers));
}

// ===== END TEACHER MANAGEMENT FUNCTIONS =====

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

async function loadConsultations() {
    const tbody = document.getElementById('consultationsTableBody');
    const notification = document.getElementById('consultationNotification');
    const notificationText = document.getElementById('notificationText');
    
    // Show loading state
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">Loading consultations...</td></tr>';
    }
    
    try {
        // Fetch from backend
        const response = await fetch(`${API_BASE_URL}/api/forms/consultations`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const consultations = data.consultations || [];
            
            // Store in localStorage for offline access
            localStorage.setItem('consultations', JSON.stringify(consultations));
            
            // Count unread consultations
            const unreadCount = consultations.filter(c => !c.viewed).length;
            
            if (notification && notificationText) {
                if (unreadCount > 0) {
                    notificationText.textContent = `You have ${unreadCount} new consultation booking${unreadCount > 1 ? 's' : ''}`;
                    notification.style.display = 'flex';
                } else {
                    notification.style.display = 'none';
                }
            }
            
            if (!tbody) return;
            
            if (consultations.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="no-data">No consultations yet</td></tr>';
                return;
            }
            
            tbody.innerHTML = consultations.reverse().map(consultation => `
                <tr style="${!consultation.viewed ? 'background-color: #fff8e1;' : ''}">
                    <td>${(consultation._id || consultation.id || '').substring(0, 8)}...</td>
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
                        <button onclick="viewConsultation('${consultation._id || consultation.id}')" class="btn-icon" title="View">👁️</button>
                        <button onclick="updateConsultationStatus('${consultation._id || consultation.id}', 'confirmed')" class="btn-icon" title="Confirm">✅</button>
                        <button onclick="updateConsultationStatus('${consultation._id || consultation.id}', 'declined')" class="btn-icon" title="Decline">❌</button>
                    </td>
                </tr>
            `).join('');
        } else {
            // Fallback to localStorage if API fails
            const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
            const unreadCount = consultations.filter(c => !c.viewed).length;
            
            if (notification && notificationText) {
                if (unreadCount > 0) {
                    notificationText.textContent = `You have ${unreadCount} new consultation booking${unreadCount > 1 ? 's' : ''}`;
                    notification.style.display = 'flex';
                } else {
                    notification.style.display = 'none';
                }
            }
            
            if (!tbody) return;
            
            if (consultations.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="no-data">No consultations yet</td></tr>';
                return;
            }
            
            tbody.innerHTML = consultations.reverse().map(consultation => `
                <tr style="${!consultation.viewed ? 'background-color: #fff8e1;' : ''}">
                    <td>${(consultation.id || '').substring(0, 8)}...</td>
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
    } catch (error) {
        console.error('Load consultations error:', error);
        // Fallback to localStorage
        const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
        const unreadCount = consultations.filter(c => !c.viewed).length;
        
        if (notification && notificationText) {
            if (unreadCount > 0) {
                notificationText.textContent = `You have ${unreadCount} new consultation booking${unreadCount > 1 ? 's' : ''}`;
                notification.style.display = 'flex';
            } else {
                notification.style.display = 'none';
            }
        }
        
        if (!tbody) return;
        
        if (consultations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="no-data">No consultations yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = consultations.reverse().map(consultation => `
            <tr style="${!consultation.viewed ? 'background-color: #fff8e1;' : ''}">
                <td>${(consultation.id || '').substring(0, 8)}...</td>
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
    console.log('Delete consultation called with ID:', id);
    consultationToDelete = id;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } else {
        console.error('Modal not found');
    }
}

function closeDeleteConfirm() {
    console.log('Close delete confirm called');
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            consultationToDelete = null;
        }, 300);
    }
}

function confirmDelete() {
    console.log('Confirm delete called, ID:', consultationToDelete);
    
    if (!consultationToDelete) {
        console.error('No consultation ID to delete');
        return;
    }
    
    // Remove from localStorage and UI immediately
    let consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    console.log('Before delete, consultations:', consultations.length);
    
    consultations = consultations.filter(c => {
        const itemId = c.id || c._id || '';
        const match = String(itemId) !== String(consultationToDelete);
        console.log(`Comparing ${itemId} with ${consultationToDelete}: ${match}`);
        return match;
    });
    
    console.log('After delete, consultations:', consultations.length);
    localStorage.setItem('consultations', JSON.stringify(consultations));
    
    closeDeleteConfirm();
    showAdminNotification('Deleted', 'Consultation removed');
    loadConsultations();
    checkNewConsultations();
    
    // Try to delete from backend in the background (don't wait for it)
    fetch(`${API_BASE_URL}/api/forms/consultation/${consultationToDelete}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
    }).then(res => res.json()).then(data => {
        console.log('Backend delete response:', data);
    }).catch(err => console.log('Backend delete failed:', err));
}

function markAllAsRead() {
    const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    consultations.forEach(c => c.viewed = true);
    localStorage.setItem('consultations', JSON.stringify(consultations));
    
    loadConsultations();
    checkNewConsultations();
}

// Load Partner Messages
async function loadPartnerMessages() {
    const tbody = document.getElementById('partnerMessagesTableBody');
    
    if (!tbody) {
        console.error('Partner messages table body not found');
        return;
    }
    
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">Loading partner messages...</td></tr>';
    
    try {
        const token = localStorage.getItem('adminToken');
        const url = `${window.API_BASE_URL}/api/admin/contacts/partners.php`;
        console.log('📨 Fetching partner contacts from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).catch(err => {
            console.error('Network error fetching partner messages:', err);
            throw new Error('Network connection failed. Please check your internet connection.');
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Partner messages error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Partner contacts result:', result);
        
        // Check for data in result.data.contacts or result.contacts
        const contacts = result.data?.contacts || result.contacts || [];
        
        if (contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">📭 No partner messages yet. Messages will appear here when partners submit the contact form.</td></tr>';
            return;
        }
        
        tbody.innerHTML = contacts.map(contact => {
            // Truncate message to first 5 words
            const words = contact.contactMessage.split(' ');
            const truncatedMessage = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
            
            return `
            <tr style="${contact.status === 'new' ? 'background-color: #fff8e1;' : ''}">
                <td>${contact.contactName}</td>
                <td>${contact.contactEmail}</td>
                <td>${contact.contactPhone}</td>
                <td>${contact.contactSubject}</td>
                <td style="min-width: 100px; max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;" title="${contact.contactMessage}">
                    ${truncatedMessage}
                </td>
                <td>
                    <span class="status-badge status-${contact.status}">
                        ${contact.status}
                    </span>
                </td>
                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                <td style="display: flex; gap: 8px; align-items: center;">
                    <button onclick="viewPartnerMessage(${contact.id}, '${contact.contactName.replace(/'/g, "\\'")}', '${contact.contactEmail}', '${contact.contactPhone}', '${contact.contactSubject.replace(/'/g, "\\'")}', \`${contact.contactMessage.replace(/`/g, "\\`")}\`, '${contact.status}')" class="btn-icon btn-view" title="View">
                        View
                    </button>
                    <button onclick="markPartnerAsRead(${contact.id})" class="btn-icon btn-mark-read" title="Mark as Read" ${contact.status !== 'new' ? 'disabled' : ''}>
                        ✓
                    </button>
                </td>
            </tr>
        `}).join('');
    } catch (error) {
        console.error('❌ Error loading partner messages:', error);
        tbody.innerHTML = `<tr><td colspan="9" class="no-data" style="color: #dc3545;">
            ⚠️ Error loading partner messages: ${error.message}<br>
            <small>This may occur if the API endpoint is not set up or the database table needs updating.</small>
        </td></tr>`;
    }
}

// Load Educator Messages
async function loadEducatorMessages() {
    const tbody = document.getElementById('educatorMessagesTableBody');
    
    if (!tbody) {
        console.error('Educator messages table body not found');
        return;
    }
    
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">Loading educator messages...</td></tr>';
    
    try {
        const token = localStorage.getItem('adminToken');
        const url = `${window.API_BASE_URL}/api/admin/contacts/educators.php`;
        console.log('👩‍🏫 Fetching educator contacts from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).catch(err => {
            console.error('Network error fetching educator messages:', err);
            throw new Error('Network connection failed. Please check your internet connection.');
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Educator messages error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Educator contacts result:', result);
        
        // Check for data in result.data.contacts or result.contacts
        const contacts = result.data?.contacts || result.contacts || [];
        
        if (contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">📭 No educator messages yet. Messages will appear here when educators submit the contact form.</td></tr>';
            return;
        }
        
        tbody.innerHTML = contacts.map(contact => {
            // Truncate message to first 5 words
            const words = contact.contactMessage.split(' ');
            const truncatedMessage = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
            
            return `
            <tr style="${contact.status === 'new' ? 'background-color: #fff8e1;' : ''}">
                <td>${contact.contactName}</td>
                <td>${contact.contactEmail}</td>
                <td>${contact.contactPhone}</td>
                <td>${contact.contactSubject}</td>
                <td style="min-width: 100px; max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;" title="${contact.contactMessage}">
                    ${truncatedMessage}
                </td>
                <td>
                    <span class="status-badge status-${contact.status}">
                        ${contact.status}
                    </span>
                </td>
                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                <td style="display: flex; gap: 8px; align-items: center;">
                    <button onclick="viewEducatorMessage(${contact.id}, '${contact.contactName.replace(/'/g, "\\'")}', '${contact.contactEmail}', '${contact.contactPhone}', '${contact.contactSubject.replace(/'/g, "\\'")}', \`${contact.contactMessage.replace(/`/g, "\\`")}\`, '${contact.status}')" class="btn-icon btn-view" title="View">
                        View
                    </button>
                    <button onclick="markEducatorAsRead(${contact.id})" class="btn-icon btn-mark-read" title="Mark as Read" ${contact.status !== 'new' ? 'disabled' : ''}>
                        ✓
                    </button>
                </td>
            </tr>
        `}).join('');
    } catch (error) {
        console.error('❌ Error loading educator messages:', error);
        tbody.innerHTML = `<tr><td colspan="9" class="no-data" style="color: #dc3545;">
            ⚠️ Error loading educator messages: ${error.message}<br>
            <small>This may occur if the API endpoint is not set up or the database table needs updating.</small>
        </td></tr>`;
    }
}

// Load Contact Messages (Legacy)
async function loadContactMessages() {
    const tbody = document.getElementById('contactMessagesTableBody');
    
    if (!tbody) {
        console.error('Contact messages table body not found');
        return;
    }
    
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">Loading contact messages...</td></tr>';
    
    try {
        console.log('Fetching contacts from:', `${window.API_BASE_URL}/api/forms/contacts`);
        const response = await fetch(`${window.API_BASE_URL}/api/forms/contacts`);
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Result:', result);
        
        if (result.success && result.contacts) {
            const contacts = result.contacts;
            
            if (contacts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="no-data">No contact messages yet</td></tr>';
                return;
            }
            
            tbody.innerHTML = contacts.map(contact => `
                <tr style="${contact.status === 'new' ? 'background-color: #fff8e1;' : ''}">
                    <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td>
                        <span class="type-badge ${contact.contactType === 'partner' ? 'type-partner' : 'type-educator'}">
                            ${contact.contactType === 'partner' ? 'Partner' : 'Educator'}
                        </span>
                    </td>
                    <td>${contact.contactName}</td>
                    <td>${contact.contactEmail}</td>
                    <td>${contact.contactPhone}</td>
                    <td>${contact.contactSubject}</td>
                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${contact.contactMessage}
                    </td>
                    <td>
                        <span class="status-badge status-${contact.status}">
                            ${contact.status}
                        </span>
                    </td>
                    <td>
                        <button onclick="replyToContact(${contact.id})" class="btn-icon" title="Reply">✉️</button>
                        <button onclick="markContactAsRead(${contact.id})" class="btn-icon" title="Mark as Read">✓</button>
                    </td>
                </tr>
            `).join('');
        } else {
            console.error('Invalid response format:', result);
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">Error loading contact messages</td></tr>';
        }
    } catch (error) {
        console.error('Error loading contact messages:', error);
        tbody.innerHTML = `<tr><td colspan="8" class="no-data">Error: ${error.message}</td></tr>`;
    }
}

// Reply to Contact
async function replyToContact(contactId) {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/forms/contacts`);
        const result = await response.json();
        
        if (result.success && result.contacts) {
            const contact = result.contacts.find(c => c.id === contactId);
            
            if (contact) {
                document.getElementById('replyContactId').value = contactId;
                document.getElementById('replyContactName').textContent = contact.contactName;
                document.getElementById('replyContactEmail').textContent = contact.contactEmail;
                document.getElementById('replyContactPhone').textContent = contact.contactPhone;
                document.getElementById('replyContactSubject').textContent = contact.contactSubject;
                document.getElementById('replyContactMessage').textContent = contact.contactMessage;
                document.getElementById('replySubject').value = `Re: ${contact.contactSubject}`;
                
                document.getElementById('contactReplyModal').style.display = 'block';
                
                // Mark as read
                await markContactAsRead(contactId);
            }
        }
    } catch (error) {
        console.error('Error fetching contact details:', error);
        showAdminNotification('Error', 'Failed to load contact details', 'error');
    }
}

// Close Contact Reply Modal
function closeContactReplyModal() {
    document.getElementById('contactReplyModal').style.display = 'none';
    document.getElementById('contactReplyForm').reset();
}

// Handle Contact Reply Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const replyForm = document.getElementById('contactReplyForm');
    if (replyForm) {
        replyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const contactId = document.getElementById('replyContactId').value;
            const email = document.getElementById('replyContactEmail').textContent;
            const subject = document.getElementById('replySubject').value;
            const message = document.getElementById('replyMessage').value;
            
            try {
                // Send reply through backend API
                const response = await fetch(`${API_BASE_URL}/api/forms/contact/${contactId}/reply`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        email,
                        subject,
                        message
                    })
                });
                
                if (response.ok) {
                    showAdminNotification('Reply Sent', 
                        `Your reply has been sent to ${email}. Subject: ${subject}`, 
                        'success');
                    closeContactReplyModal();
                    loadContactMessages();
                } else {
                    showAdminNotification('Error', 'Failed to send reply', 'error');
                }
            } catch (error) {
                console.error('Error sending reply:', error);
                showAdminNotification('Error', 'Failed to send reply', 'error');
            }
        });
    }
});

// Mark Partner Contact as Read
async function markPartnerContactAsRead(contactId) {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/forms/contact/partner/${contactId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'read' })
        });
        
        if (response.ok) {
            loadPartnerMessages();
        }
    } catch (error) {
        console.error('Error marking partner contact as read:', error);
    }
}

// Mark Educator Contact as Read
async function markEducatorContactAsRead(contactId) {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/forms/contact/educator/${contactId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'read' })
        });
        
        if (response.ok) {
            loadEducatorMessages();
        }
    } catch (error) {
        console.error('Error marking educator contact as read:', error);
    }
}

// Reply functions for Partner and Educator contacts
async function replyToPartnerContact(contactId) {
    // TODO: Implement reply modal for partner contacts
    console.log('Reply to partner contact:', contactId);
}

async function replyToEducatorContact(contactId) {
    // TODO: Implement reply modal for educator contacts
    console.log('Reply to educator contact:', contactId);
}

// Mark Contact as Read
async function markContactAsRead(contactId) {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/forms/contact/${contactId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'read' })
        });
        
        if (response.ok) {
            loadContactMessages();
        }
    } catch (error) {
        console.error('Error marking contact as read:', error);
    }
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
        try {
            const response = await api.getAllSchoolPartners();
            // Handle both response formats: response.partners or response.data.partners
            const partners = response.partners || (response.data && response.data.partners);
            
            if (response && response.success && Array.isArray(partners)) {
                // Update localStorage if backend has data
                localStorage.setItem('schoolPartners', JSON.stringify(partners));
                console.log(`✅ Synced ${partners.length} school partners from database`);
                return partners;
            }
        } catch (error) {
            console.warn('Backend school partners sync failed, using localStorage:', error.message);
        }
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

// View Partner Message Details
function viewPartnerMessage(id, name, email, phone, subject, message, status) {
    const modal = document.getElementById('messageViewModal');
    const title = document.getElementById('messageViewTitle');
    const content = document.getElementById('messageViewContent');
    
    title.textContent = '🤝 Partner Message Details';
    content.innerHTML = `
        <div style="background: linear-gradient(135deg, #f5f7ff 0%, #fff5f7 100%); padding: 20px; border-radius: 12px; border: 2px solid #e0e7ff; margin-bottom: 20px;">
            <div style="display: grid; gap: 15px;">
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Name:</span>
                    <span style="color: #333;">${name}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Email:</span>
                    <span style="color: #333;">${email}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Phone:</span>
                    <span style="color: #333;">${phone}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Subject:</span>
                    <span style="color: #333;">${subject}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Status:</span>
                    <span class="status-badge status-${status}">${status}</span>
                </div>
            </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e7ff;">
            <h4 style="color: #6366f1; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Message:</h4>
            <p style="color: #555; line-height: 1.8; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
        </div>
    `;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

// View Educator Message Details
function viewEducatorMessage(id, name, email, phone, subject, message, status) {
    const modal = document.getElementById('messageViewModal');
    const title = document.getElementById('messageViewTitle');
    const content = document.getElementById('messageViewContent');
    
    title.textContent = '👨‍🏫 Educator Message Details';
    content.innerHTML = `
        <div style="background: linear-gradient(135deg, #f5f7ff 0%, #fff5f7 100%); padding: 20px; border-radius: 12px; border: 2px solid #e0e7ff; margin-bottom: 20px;">
            <div style="display: grid; gap: 15px;">
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Name:</span>
                    <span style="color: #333;">${name}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Email:</span>
                    <span style="color: #333;">${email}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Phone:</span>
                    <span style="color: #333;">${phone}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Subject:</span>
                    <span style="color: #333;">${subject}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="font-weight: 600; color: #6366f1; min-width: 80px;">Status:</span>
                    <span class="status-badge status-${status}">${status}</span>
                </div>
            </div>
        </div>
        <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e7ff;">
            <h4 style="color: #6366f1; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📝 Message:</h4>
            <p style="color: #555; line-height: 1.8; margin: 0; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
        </div>
    `;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

// Close Message View Modal
function closeMessageViewModal() {
    const modal = document.getElementById('messageViewModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Show Delete Confirmation Modal
function showDeleteConfirmModal(message, onConfirm) {
    const modal = document.getElementById('deleteConfirmModal');
    const messageElement = document.getElementById('deleteConfirmMessage');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    messageElement.textContent = message;
    
    // Remove any existing event listeners by cloning the button
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add the new event listener
    newConfirmBtn.onclick = () => {
        closeDeleteConfirmModal();
        onConfirm();
    };
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
}

// Close Delete Confirmation Modal
function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// Delete Partner Message
async function deletePartnerMessage(id) {
    showDeleteConfirmModal(
        'Are you sure you want to delete this partner message? This action cannot be undone.',
        async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${window.API_BASE_URL}/api/admin/contacts/partners.php?id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    showNotification('Partner message deleted successfully!', 'success');
                    loadPartnerMessages(); // Reload the table
                } else {
                    showNotification('Failed to delete message: ' + result.message, 'error');
                }
            } catch (error) {
                console.error('Delete partner message error:', error);
                showNotification('Error deleting message. Please try again.', 'error');
            }
        }
    );
}

// Delete Educator Message
async function deleteEducatorMessage(id) {
    showDeleteConfirmModal(
        'Are you sure you want to delete this educator message? This action cannot be undone.',
        async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${window.API_BASE_URL}/api/admin/contacts/educators.php?id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    showNotification('Educator message deleted successfully!', 'success');
                    loadEducatorMessages(); // Reload the table
                } else {
                    showNotification('Failed to delete message: ' + result.message, 'error');
                }
            } catch (error) {
                console.error('Delete educator message error:', error);
                showNotification('Error deleting message. Please try again.', 'error');
            }
        }
    );
}

// Mark Partner Message as Read
async function markPartnerAsRead(id) {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${window.API_BASE_URL}/api/admin/contacts/partners.php?id=${id}&action=status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'read' })
        });

        const result = await response.json();
        
        if (result.success) {
            showAdminNotification('Success', 'Message marked as read');
            loadPartnerMessages();
        } else {
            showAdminNotification('Error', result.message || 'Failed to update status');
        }
    } catch (error) {
        console.error('Error marking partner message as read:', error);
        showAdminNotification('Error', 'Failed to update message status');
    }
}

// Mark Educator Message as Read
async function markEducatorAsRead(id) {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${window.API_BASE_URL}/api/admin/contacts/educators.php?id=${id}&action=status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'read' })
        });

        const result = await response.json();
        
        if (result.success) {
            showAdminNotification('Success', 'Message marked as read');
            
            // Update UI directly without reloading
            const row = document.querySelector(`button[onclick="markEducatorAsRead(${id})"]`)?.closest('tr');
            if (row) {
                const statusCell = row.querySelector('.badge');
                if (statusCell) {
                    statusCell.textContent = 'Read';
                    statusCell.className = 'badge badge-read';
                }
                
                // Disable the tick button
                const tickButton = row.querySelector(`button[onclick="markEducatorAsRead(${id})"]`);
                if (tickButton) {
                    tickButton.disabled = true;
                    tickButton.style.opacity = '0.5';
                    tickButton.style.cursor = 'not-allowed';
                }
            }
        } else {
            showAdminNotification('Error', result.message || 'Failed to update status');
        }
    } catch (error) {
        console.error('Error marking educator message as read:', error);
        showAdminNotification('Error', 'Failed to update message status');
    }
}

// =========================================================================
// Expose functions to global scope for onclick handlers
// =========================================================================
window.showTab = showTab;
window.refreshUserData = refreshUserData;
window.showAddAdminModal = showAddAdminModal;
window.closeAddAdminModal = closeAddAdminModal;
window.showAddUserModal = showAddUserModal;
window.closeAddUserModal = closeAddUserModal;
window.closeEditUserModal = closeEditUserModal;
window.closeEditAdminModal = closeEditAdminModal;
window.showAddSchoolModal = showAddSchoolModal;
window.closeAddSchoolModal = closeAddSchoolModal;
window.closeEditSchoolModal = closeEditSchoolModal;
window.showAddSchoolPartnerModal = showAddSchoolPartnerModal;
window.closeAddSchoolPartnerModal = closeAddSchoolPartnerModal;
window.closeEditSchoolPartnerModal = closeEditSchoolPartnerModal;
window.refreshDebugData = refreshDebugData;
window.addSampleUser = addSampleUser;
window.clearAllData = clearAllData;
window.closeMessageViewModal = closeMessageViewModal;
window.deletePartnerMessage = deletePartnerMessage;
window.deleteEducatorMessage = deleteEducatorMessage;
window.markPartnerAsRead = markPartnerAsRead;
window.markEducatorAsRead = markEducatorAsRead;
window.viewPartnerMessage = viewPartnerMessage;
window.viewEducatorMessage = viewEducatorMessage;
window.closeDeleteConfirmModal = closeDeleteConfirmModal;
window.closeDeleteConfirm = closeDeleteConfirm;
window.confirmDelete = confirmDelete;
window.closeAdminNotification = closeAdminNotification;
window.closeConsultationDetails = closeConsultationDetails;
window.cancelConfirm = cancelConfirm;
window.confirmAction = confirmAction;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.editAdmin = editAdmin;
window.deleteAdmin = deleteAdmin;
window.editSchool = editSchool;
window.deleteSchool = deleteSchool;
window.editSchoolPartner = editSchoolPartner;
window.deleteSchoolPartner = deleteSchoolPartner;

// =========================================================================
// Debug Helper Functions - Available in Browser Console
// =========================================================================
window.debugTestUserAPI = async function() {
    console.log('=== Testing User API Connection ===');
    console.log('API Base URL:', window.API_BASE_URL);
    console.log('API Endpoint:', API_CONFIG.ENDPOINTS.ADMIN_USERS);
    console.log('Full URL:', `${window.API_BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}`);
    
    try {
        console.log('Calling api.getAllUsers()...');
        const response = await api.getAllUsers();
        console.log('Response received:', response);
        return response;
    } catch (error) {
        console.error('API call failed:', error);
        return { error: error.message, stack: error.stack };
    }
};

// Visual API Test Function (shows popup with results)
window.testUserApiDirect = async function() {
    // Show loading state
    updateRealtimeStatus('syncing', 'Testing API...');
    
    const startTime = Date.now();
    let diagnostics = {
        timestamp: new Date().toISOString(),
        testDuration: 0,
        apiConfig: {
            baseUrl: API_CONFIG?.BASE_URL || 'NOT FOUND',
            endpoint: API_CONFIG?.ENDPOINTS?.ADMIN_USERS || 'NOT FOUND',
            fullUrl: API_CONFIG ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}` : 'CANNOT CONSTRUCT'
        },
        apiObjectStatus: typeof api !== 'undefined' ? 'Available ✅' : 'NOT FOUND ❌',
        databaseConnection: 'Testing...',
        response: null,
        users: [],
        error: null
    };
    
    console.log('🧪 Starting comprehensive API test...');
    console.log('Diagnostics baseline:', diagnostics);
    
    try {
        // Test 1: Direct fetch to API endpoint
        console.log('Test 1: Direct fetch call...');
        const fetchUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}`;
        const fetchResponse = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        diagnostics.httpStatus = fetchResponse.status;
        diagnostics.httpStatusText = fetchResponse.statusText;
        
        const responseText = await fetchResponse.text();
        console.log('Raw API response:', responseText);
        
        try {
            const jsonResponse = JSON.parse(responseText);
            diagnostics.response = jsonResponse;
            diagnostics.databaseConnection = jsonResponse.success ? 'Connected ✅' : 'Failed ❌';
            
            // Extract users
            const users = jsonResponse.users || (jsonResponse.data && jsonResponse.data.users) || [];
            diagnostics.users = users;
            diagnostics.userCount = users.length;
            
            diagnostics.testDuration = Date.now() - startTime;
            
            // Show results in alert
            let resultMessage = `🧪 API TEST RESULTS\\n\\n`;
            resultMessage += `⏱️ Test Duration: ${diagnostics.testDuration}ms\\n`;
            resultMessage += `🌐 API URL: ${fetchUrl}\\n`;
            resultMessage += `📡 HTTP Status: ${diagnostics.httpStatus} ${diagnostics.httpStatusText}\\n`;
            resultMessage += `🔌 Database: ${diagnostics.databaseConnection}\\n`;
            resultMessage += `✅ Success: ${jsonResponse.success}\\n`;
            resultMessage += `📊 Users Found: ${diagnostics.userCount}\\n\\n`;
            
            if (diagnostics.userCount > 0) {
                resultMessage += `Sample User:\\n`;
                resultMessage += `- ID: ${users[0].id}\\n`;
                resultMessage += `- Username: ${users[0].username}\\n`;
                resultMessage += `- Email: ${users[0].email}\\n`;
                resultMessage += `- Phone: ${users[0].phone}\\n\\n`;
                resultMessage += `✅ API IS WORKING! If dashboard shows "No users", check browser console (F12) for detailed logs.`;
            } else {
                resultMessage += `⚠️ API returned success but 0 users.\\nCheck phpMyAdmin to verify users exist in database.`;
            }
            
            alert(resultMessage);
            console.log('✅ Full diagnostics:', JSON.stringify(diagnostics, null, 2));
            
            updateRealtimeStatus('connected', 'Test Complete', Date.now());
            
        } catch (jsonError) {
            diagnostics.error = `JSON Parse Error: ${jsonError.message}`;
            diagnostics.rawResponse = responseText;
            alert(`❌ API Response Error\\n\\nCould not parse JSON response.\\nRaw response: ${responseText.substring(0, 200)}...\\n\\nCheck browser console for details.`);
            console.error('JSON parse error:', jsonError);
            console.error('Raw response:', responseText);
            updateRealtimeStatus('error', 'Test Failed');
        }
        
    } catch (fetchError) {
        diagnostics.testDuration = Date.now() - startTime;
        diagnostics.error = `Network Error: ${fetchError.message}`;
        
        alert(`❌ NETWORK ERROR\\n\\n${fetchError.message}\\n\\nPossible causes:\\n- API endpoint not accessible\\n- CORS issue\\n- Database connection failed\\n\\nCheck browser console (F12) for full error details.`);
        console.error('❌ API Test Failed:', fetchError);
        console.error('Full diagnostics:', diagnostics);
        updateRealtimeStatus('error', 'Network Error');
    }
    
    // Also log to console for debugging
    console.log('🧪 Complete diagnostics object:', diagnostics);
    return diagnostics;
};

window.debugFetchUsers = async function() {
    console.log('=== Testing fetchUsersFromDatabase ===');
    const result = await fetchUsersFromDatabase(true);
    console.log('Result:', result);
    console.log('User source:', userSource);
    console.log('Cache length:', userListCache.length);
    return result;
};

window.debugInfo = function() {
    console.log('=== Debug Info ===');
    console.log('API available:', typeof api !== 'undefined');
    console.log('API_CONFIG available:', typeof API_CONFIG !== 'undefined');
    console.log('API Base URL:', window.API_BASE_URL);
    console.log('Current User Source:', userSource);
    console.log('Cached Users Count:', userListCache.length);
    console.log('Admin Token:', localStorage.getItem('adminToken') ? 'Present' : 'Missing');
    console.log('Current Admin:', localStorage.getItem('currentAdmin'));
    
    // Return the info as an object
    return {
        apiAvailable: typeof api !== 'undefined',
        apiConfigAvailable: typeof API_CONFIG !== 'undefined',
        apiBaseURL: window.API_BASE_URL,
        userSource: userSource,
        cachedUsersCount: userListCache.length,
        hasAdminToken: !!localStorage.getItem('adminToken'),
        currentAdmin: localStorage.getItem('currentAdmin')
    };
};

// Force load users right now
window.forceLoadUsers = async function() {
    console.log('=== Force Loading Users ===');
    try {
        console.log('Step 1: Fetching from database...');
        const users = await fetchUsersFromDatabase(true);
        console.log('Step 2: Users fetched:', users);
        console.log('Step 3: Calling loadUserManagement...');
        await loadUserManagement();
        console.log('Step 4: Complete!');
        return { success: true, userCount: users.length };
    } catch (error) {
        console.error('Force load failed:', error);
        return { success: false, error: error.message };
    }
};

// === DIAGNOSTIC PANEL FUNCTIONS ===

// Toggle diagnostic panel visibility
window.toggleDiagnostic = function() {
    const content = document.getElementById('diagnosticContent');
    const toggle = document.getElementById('diagnosticToggle');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▲';
        updateDiagnosticInfo();
    } else {
        content.style.display = 'none';
        toggle.textContent = '▼';
    }
};

// Update diagnostic info in panel
function updateDiagnosticInfo() {
    const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    document.getElementById('diagEnv').textContent = isProd ? 'Production' : 'Development';
    document.getElementById('diagBaseUrl').textContent = API_CONFIG ? API_CONFIG.BASE_URL : 'NOT LOADED';
    document.getElementById('diagEndpoint').textContent = API_CONFIG ? API_CONFIG.ENDPOINTS.ADMIN_USERS : 'NOT LOADED';
    document.getElementById('diagSource').textContent = userSource.toUpperCase() + (userSource === 'backend' ? ' ✅' : ' ⚠️');
    document.getElementById('diagCacheSize').textContent = userListCache.length + ' users';
    
    // Get last error from localStorage if any
    const lastError = localStorage.getItem('lastUserAPIError');
    document.getElementById('diagError').textContent = lastError || 'None';
}

// Show diagnostic panel with error
function showDiagnosticWithError(error) {
    const panel = document.getElementById('diagnosticPanel');
    panel.style.display = 'block';
    
    // Store error
    localStorage.setItem('lastUserAPIError', error);
    
    // Auto-expand
    document.getElementById('diagnosticContent').style.display = 'block';
    document.getElementById('diagnosticToggle').textContent = '▲';
    
    updateDiagnosticInfo();
}

// Run full diagnostic test
window.runFullDiagnostic = async function() {
    console.log('🔬 Running full diagnostic...');
    
    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: window.location.hostname,
        userAgent: navigator.userAgent,
        api: {
            available: typeof api !== 'undefined',
            configAvailable: typeof API_CONFIG !== 'undefined',
            baseUrl: API_CONFIG?.BASE_URL,
            endpoint: API_CONFIG?.ENDPOINTS?.ADMIN_USERS,
            fullUrl: API_CONFIG ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}` : null
        },
        state: {
            userSource: userSource,
            cacheSize: userListCache.length,
            hasAdminToken: !!localStorage.getItem('adminToken'),
            currentAdmin: localStorage.getItem('currentAdmin')
        },
        tests: {}
    };
    
    console.log('Diagnostics baseline:', diagnostics);
    
    // Test 1: API availability
    diagnostics.tests.apiAvailable = typeof api !== 'undefined' && typeof API_CONFIG !== 'undefined';
    
    // Test 2: Try fetching from database
    try {
        console.log('Test: Fetching users...');
        const users = await api.getAllUsers();
        diagnostics.tests.apiCallSuccess = true;
        diagnostics.tests.response = users;
        diagnostics.tests.userCount = users.users?.length || users.data?.users?.length || 0;
    } catch (error) {
        diagnostics.tests.apiCallSuccess = false;
        diagnostics.tests.error = error.message;
    }
    
    console.log('📊 Full diagnostics:', diagnostics);
    
    // Display results
    let message = `🔬 DIAGNOSTIC RESULTS\n\n`;
    message += `Environment: ${diagnostics.environment}\n`;
    message += `API Available: ${diagnostics.tests.apiAvailable ? '✅ YES' : '❌ NO'}\n`;
    message += `API Base URL: ${diagnostics.api.baseUrl}\n`;
    message += `User Source: ${diagnostics.state.userSource.toUpperCase()}\n`;
    message += `Cache Size: ${diagnostics.state.cacheSize} users\n\n`;
    
    if (diagnostics.tests.apiCallSuccess) {
        message += `✅ API CALL SUCCESSFUL!\n`;
        message += `Users in Database: ${diagnostics.tests.userCount}\n\n`;
        if (diagnostics.tests.userCount === 0) {
            message += `ℹ️  Database is connected but empty.\nNo users have registered yet.\n\n`;
        }
        message += `If dashboard still shows "Local Storage",\ntry clicking the Refresh button.`;
    } else {
        message += `❌ API CALL FAILED\n`;
        message += `Error: ${diagnostics.tests.error}\n\n`;
        message += `Check:\n`;
        message += `1. Is the API file uploaded to server?\n`;
        message += `2. Check browser console (F12) for details\n`;
        message += `3. Verify database credentials in db_connect.php`;
    }
    
    alert(message);
    
    // Update diagnostic panel
    updateDiagnosticInfo();
    
    return diagnostics;
};

// Auto-show diagnostic panel if using localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for data to load
    setTimeout(() => {
        if (userSource === 'local' && document.getElementById('diagnosticPanel')) {
            document.getElementById('diagnosticPanel').style.display = 'block';
            console.log('⚠️  Using localStorage - showing diagnostic panel');
        }
    }, 2000);
});
