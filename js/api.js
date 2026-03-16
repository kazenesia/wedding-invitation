// ===================================
// API FUNCTIONS
// Handle semua komunikasi dengan Google Apps Script
// ===================================

// ============================================
// 1. GET GUEST DATA BY SLUG
// ============================================
/**
 * Ambil data tamu berdasarkan slug dari URL
 * @param {string} slug - URL slug tamu (contoh: "john-doe")
 * @returns {Promise} - Promise dengan data tamu
 */
async function getGuestData(slug) {
    try {
        log('Fetching guest data for slug:', slug);
        
        const url = API_ENDPOINTS.getGuest(slug);
        
        const response = await fetch(url, {
            method: 'GET'
            // No custom headers allowed to bypass CORS preflight on Google Apps Script
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        log('Guest data received:', result);
        
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        } else {
            return {
                success: false,
                message: result.message || CONFIG.MESSAGES.error.guestNotFound
            };
        }
        
    } catch (error) {
        logError('Error fetching guest data:', error);
        return {
            success: false,
            message: CONFIG.MESSAGES.error.load,
            error: error.message
        };
    }
}

// ============================================
// 2. SUBMIT RSVP
// ============================================
/**
 * Submit konfirmasi kehadiran tamu
 * @param {Object} rsvpData - Data RSVP {slug, rsvp_status, jumlah_hadir}
 * @returns {Promise} - Promise dengan hasil submit
 */
async function submitRSVP(rsvpData) {
    try {
        log('Submitting RSVP:', rsvpData);
        
        // Validasi data
        if (!rsvpData.slug || !rsvpData.rsvp_status) {
            return {
                success: false,
                message: 'Data RSVP tidak lengkap'
            };
        }
        
        const url = API_ENDPOINTS.submitRSVP();
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Use text/plain to avoid CORS preflight
            },
            body: JSON.stringify({
                slug: rsvpData.slug,
                rsvp_status: rsvpData.rsvp_status,
                jumlah_hadir: rsvpData.jumlah_hadir || 0
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        log('RSVP submit result:', result);
        
        return result;
        
    } catch (error) {
        logError('Error submitting RSVP:', error);
        return {
            success: false,
            message: CONFIG.MESSAGES.error.rsvp,
            error: error.message
        };
    }
}

// ============================================
// 3. SUBMIT WISH/UCAPAN
// ============================================
/**
 * Submit ucapan dan doa dari tamu
 * @param {Object} wishData - Data ucapan {nama, ucapan}
 * @returns {Promise} - Promise dengan hasil submit
 */
async function submitWish(wishData) {
    try {
        log('Submitting wish:', wishData);
        
        // Validasi data
        const validation = validateForm({
            nama: wishData.nama,
            ucapan: wishData.ucapan
        });
        
        if (!validation.isValid) {
            return {
                success: false,
                message: validation.errors.join(', ')
            };
        }
        
        // Sanitize input
        const sanitizedData = {
            nama: sanitizeInput(wishData.nama.trim()),
            ucapan: sanitizeInput(wishData.ucapan.trim())
        };
        
        const url = API_ENDPOINTS.submitWish();
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Use text/plain to avoid CORS preflight
            },
            body: JSON.stringify(sanitizedData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        log('Wish submit result:', result);
        
        return result;
        
    } catch (error) {
        logError('Error submitting wish:', error);
        return {
            success: false,
            message: CONFIG.MESSAGES.error.wish,
            error: error.message
        };
    }
}

// ============================================
// 4. GET ALL WISHES
// ============================================
/**
 * Ambil semua ucapan dari tamu
 * @returns {Promise} - Promise dengan array ucapan
 */
async function getAllWishes() {
    try {
        log('Fetching all wishes...');
        
        const url = API_ENDPOINTS.getWishes();
        
        const response = await fetch(url, {
            method: 'GET'
            // No custom headers allowed to bypass CORS preflight on Google Apps Script
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        log('Wishes received:', result);
        
        if (result.success) {
            return {
                success: true,
                data: result.data || []
            };
        } else {
            return {
                success: false,
                message: result.message || 'Gagal memuat ucapan',
                data: []
            };
        }
        
    } catch (error) {
        logError('Error fetching wishes:', error);
        return {
            success: false,
            message: CONFIG.MESSAGES.error.load,
            data: [],
            error: error.message
        };
    }
}

// ============================================
// 5. RETRY MECHANISM (untuk handle network error)
// ============================================
/**
 * Retry function jika gagal
 * @param {Function} fn - Function yang akan di-retry
 * @param {number} retries - Jumlah retry (default: 3)
 * @param {number} delay - Delay antar retry dalam ms (default: 1000)
 */
async function retryRequest(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) {
            throw error;
        }
        
        log(`Request failed. Retrying... (${retries} attempts left)`);
        
        // Wait sebelum retry
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry dengan retries - 1
        return retryRequest(fn, retries - 1, delay);
    }
}

// ============================================
// 6. GET GUEST WITH RETRY
// ============================================
/**
 * Get guest data dengan retry mechanism
 */
async function getGuestDataWithRetry(slug, retries = 3) {
    return retryRequest(() => getGuestData(slug), retries);
}

// ============================================
// 7. BATCH OPERATIONS (untuk optimasi)
// ============================================
/**
 * Submit multiple wishes sekaligus (jika diperlukan)
 * Saat ini tidak digunakan, tapi siap jika butuh batch operation
 */
async function submitMultipleWishes(wishesArray) {
    try {
        const promises = wishesArray.map(wish => submitWish(wish));
        const results = await Promise.all(promises);
        
        const successCount = results.filter(r => r.success).length;
        
        return {
            success: successCount === wishesArray.length,
            successCount: successCount,
            totalCount: wishesArray.length,
            results: results
        };
        
    } catch (error) {
        logError('Error in batch submit:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ============================================
// 8. CHECK API HEALTH
// ============================================
/**
 * Check apakah API bisa diakses
 * Berguna untuk troubleshooting
 */
async function checkAPIHealth() {
    try {
        log('Checking API health...');
        
        // Try to get wishes (endpoint paling simple)
        const result = await getAllWishes();
        
        if (result.success) {
            log('API is healthy ?');
            return {
                success: true,
                message: 'API is working properly'
            };
        } else {
            log('API returned error');
            return {
                success: false,
                message: 'API returned error: ' + result.message
            };
        }
        
    } catch (error) {
        logError('API health check failed:', error);
        return {
            success: false,
            message: 'Cannot connect to API',
            error: error.message
        };
    }
}

// ============================================
// 9. CACHE MANAGEMENT (Simple caching)
// ============================================
const apiCache = {
    wishes: null,
    wishesTimestamp: null,
    guestData: {},
    
    // Cache duration (5 menit)
    cacheDuration: 5 * 60 * 1000,
    
    // Set cache
    set(key, value) {
        this[key] = value;
        this[`${key}Timestamp`] = Date.now();
    },
    
    // Get cache
    get(key) {
        const timestamp = this[`${key}Timestamp`];
        
        // Check if cache expired
        if (!timestamp || (Date.now() - timestamp) > this.cacheDuration) {
            return null;
        }
        
        return this[key];
    },
    
    // Clear cache
    clear(key) {
        if (key) {
            this[key] = null;
            this[`${key}Timestamp`] = null;
        } else {
            // Clear all
            this.wishes = null;
            this.wishesTimestamp = null;
            this.guestData = {};
        }
    }
};

// ============================================
// 10. GET WISHES WITH CACHE
// ============================================
/**
 * Get wishes dengan caching untuk performa lebih baik
 * @param {boolean} forceRefresh - Force refresh dari server
 */
async function getWishesWithCache(forceRefresh = false) {
    // Check cache dulu
    if (!forceRefresh) {
        const cached = apiCache.get('wishes');
        if (cached) {
            log('Returning cached wishes');
            return {
                success: true,
                data: cached,
                fromCache: true
            };
        }
    }
    
    // Fetch dari server
    const result = await getAllWishes();
    
    if (result.success) {
        // Save to cache
        apiCache.set('wishes', result.data);
    }
    
    return result;
}

// ============================================
// 11. PREFETCH DATA (Load data in background)
// ============================================
/**
 * Prefetch data di background untuk performa lebih baik
 */
function prefetchWishes() {
    // Load wishes di background
    getAllWishes().then(result => {
        if (result.success) {
            apiCache.set('wishes', result.data);
            log('Wishes prefetched successfully');
        }
    }).catch(error => {
        logError('Prefetch wishes failed:', error);
    });
}

// ============================================
// 12. QUEUE SYSTEM (untuk offline support - advanced)
// ============================================
/**
 * Queue untuk menyimpan request yang gagal
 * Bisa di-retry nanti saat koneksi kembali
 */
const requestQueue = {
    queue: [],
    
    add(type, data) {
        this.queue.push({
            type: type,
            data: data,
            timestamp: Date.now()
        });
        
        // Save to localStorage
        this.save();
    },
    
    save() {
        try {
            localStorage.setItem('wedding_request_queue', JSON.stringify(this.queue));
        } catch (error) {
            logError('Failed to save queue:', error);
        }
    },
    
    load() {
        try {
            const saved = localStorage.getItem('wedding_request_queue');
            if (saved) {
                this.queue = JSON.parse(saved);
            }
        } catch (error) {
            logError('Failed to load queue:', error);
        }
    },
    
    async process() {
        log('Processing queued requests...', this.queue.length);
        
        const results = [];
        
        for (const item of this.queue) {
            try {
                let result;
                
                if (item.type === 'rsvp') {
                    result = await submitRSVP(item.data);
                } else if (item.type === 'wish') {
                    result = await submitWish(item.data);
                }
                
                if (result && result.success) {
                    results.push({ success: true, item });
                } else {
                    results.push({ success: false, item });
                }
                
            } catch (error) {
                logError('Error processing queue item:', error);
                results.push({ success: false, item, error });
            }
        }
        
        // Remove successful items
        this.queue = this.queue.filter((item, index) => !results[index].success);
        this.save();
        
        return results;
    },
    
    clear() {
        this.queue = [];
        this.save();
    }
};

// Load queue saat init
requestQueue.load();

// ============================================
// 13. OFFLINE DETECTION
// ============================================
/**
 * Detect online/offline status
 */
let apiIsOnline = navigator.onLine;

window.addEventListener('online', () => {
    apiIsOnline = true;
    log('Connection restored');
    
    // Process queued requests
    requestQueue.process().then(results => {
        const successCount = results.filter(r => r.success).length;
        if (successCount > 0) {
            showNotification(`${successCount} data berhasil dikirim`, 'success');
        }
    });
});

window.addEventListener('offline', () => {
    apiIsOnline = false;
    log('Connection lost');
    showNotification('Koneksi internet terputus', 'error');
});

// ============================================
// 14. SUBMIT WITH QUEUE (auto queue if offline)
// ============================================
/**
 * Submit RSVP dengan auto-queue jika offline
 */
async function submitRSVPSafe(rsvpData) {
    if (!apiIsOnline) {
        requestQueue.add('rsvp', rsvpData);
        return {
            success: true,
            queued: true,
            message: 'Data akan dikirim saat koneksi kembali'
        };
    }
    
    const result = await submitRSVP(rsvpData);
    
    // Jika gagal karena network, queue
    if (!result.success && result.error) {
        requestQueue.add('rsvp', rsvpData);
        return {
            success: true,
            queued: true,
            message: 'Data akan dikirim saat koneksi kembali'
        };
    }
    
    return result;
}

/**
 * Submit Wish dengan auto-queue jika offline
 */
async function submitWishSafe(wishData) {
    if (!apiIsOnline) {
        requestQueue.add('wish', wishData);
        return {
            success: true,
            queued: true,
            message: 'Ucapan akan dikirim saat koneksi kembali'
        };
    }
    
    const result = await submitWish(wishData);
    
    // Jika gagal karena network, queue
    if (!result.success && result.error) {
        requestQueue.add('wish', wishData);
        return {
            success: true,
            queued: true,
            message: 'Ucapan akan dikirim saat koneksi kembali'
        };
    }
    
    return result;
}

// ============================================
// 15. ERROR HANDLER WRAPPER
// ============================================
/**
 * Wrapper untuk handle error secara konsisten
 */
function handleAPIError(error, context = '') {
    logError(`API Error in ${context}:`, error);
    
    // Determine error type
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        showNotification('Koneksi internet bermasalah. Silakan coba lagi.', 'error');
    } else if (error.message.includes('404')) {
        showNotification('Endpoint tidak ditemukan. Periksa konfigurasi API.', 'error');
    } else if (error.message.includes('500')) {
        showNotification('Server error. Silakan coba lagi nanti.', 'error');
    } else {
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
    
    return {
        success: false,
        error: error.message,
        context: context
    };
}

// ============================================
// EXPORT (untuk testing)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getGuestData,
        submitRSVP,
        submitWish,
        getAllWishes,
        getWishesWithCache,
        submitRSVPSafe,
        submitWishSafe,
        checkAPIHealth
    };
}
