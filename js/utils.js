// ===================================
// UTILITY FUNCTIONS
// Helper functions untuk berbagai keperluan
// ===================================

// ============================================
// 1. PARSE URL PARAMETER
// ============================================
/**
 * Ambil parameter dari URL
 * Contoh: website.com/?to=john-doe
 * getUrlParameter('to') akan return 'john-doe'
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// ============================================
// 2. PARSE WEDDING DATE (DD-MM-YYYY HH:MM:SS)
// ============================================
/**
 * Convert string DD-MM-YYYY HH:MM:SS ke Date object
 * Input: "23-02-2026 11:00:00"
 * Output: Date object
 */
function parseWeddingDate(dateString) {
    // Split tanggal dan waktu
    const [datePart, timePart] = dateString.split(' ');
    
    // Split DD-MM-YYYY
    const [day, month, year] = datePart.split('-').map(Number);
    
    // Split HH:MM:SS
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
    // Buat Date object (month - 1 karena JavaScript month dimulai dari 0)
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

// ============================================
// 3. FORMAT TANGGAL INDONESIA
// ============================================
/**
 * Format Date object ke format Indonesia
 * Output: "Minggu, 23 Februari 2026"
 */
function formatDateIndonesia(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${monthName} ${year}`;
}

// ============================================
// 4. FORMAT WAKTU
// ============================================
/**
 * Format Date object ke format waktu
 * Output: "11:00 WIB"
 */
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes} WIB`;
}

// ============================================
// 5. FORMAT TIMESTAMP UCAPAN
// ============================================
/**
 * Format timestamp untuk ucapan (relative time)
 * Output: "2 jam yang lalu" atau "23 Jan 2026"
 */
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Konversi ke detik, menit, jam, hari
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    // Relative time (jika < 7 hari)
    if (days < 1) {
        if (hours < 1) {
            if (minutes < 1) return 'Just now';
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (days < 7) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Absolute time (jika >= 7 hari)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// ============================================
// 6. COUNTDOWN CALCULATOR
// ============================================
/**
 * Hitung countdown ke wedding date
 * Returns: { days, hours, minutes, seconds }
 */
function calculateCountdown(weddingDate) {
    const now = new Date().getTime();
    const wedding = weddingDate.getTime();
    const distance = wedding - now;
    
    // Jika sudah lewat
    if (distance < 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isPast: true
        };
    }
    
    // Hitung
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        isPast: false
    };
}

// ============================================
// 7. COPY TO CLIPBOARD
// ============================================
/**
 * Copy text ke clipboard
 * Digunakan untuk copy nomor rekening
 */
function copyToClipboard(text, buttonId = null) {
    // Metode 1: Modern API (lebih reliable)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification(CONFIG.MESSAGES.success.copy, 'success');
                
                // Update button text
                if (buttonId) {
                    updateCopyButtonText(buttonId, true);
                }
            })
            .catch(err => {
                console.error('Gagal copy:', err);
                // Fallback ke metode 2
                fallbackCopy(text, buttonId);
            });
    } else {
        // Fallback untuk browser lama
        fallbackCopy(text, buttonId);
    }
}

/**
 * Fallback copy method untuk browser lama
 */
function fallbackCopy(text, buttonId) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showNotification(CONFIG.MESSAGES.success.copy, 'success');
        
        if (buttonId) {
            updateCopyButtonText(buttonId, true);
        }
    } catch (err) {
        console.error('Gagal copy:', err);
        showNotification('Failed to copy. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textarea);
}

/**
 * Update text button setelah copy
 */
function updateCopyButtonText(buttonId, copied) {
    const button = document.getElementById(`${buttonId}-btn`);
    if (!button) return;
    
    if (copied) {
        button.innerHTML = `<i class="fas fa-check" style="margin-right:6px;"></i>${CONFIG.GIFT.labels.copiedButton || 'Copied!'}`;
        
        // Reset setelah 3 detik
        setTimeout(() => {
            button.innerHTML = `<i class="fas fa-copy" style="margin-right:6px;"></i>${CONFIG.GIFT.labels.copyButton || 'Copy Number'}`;
        }, 3000);
    }
}

// ============================================
// 8. SHOW NOTIFICATION (TOAST)
// ============================================
/**
 * Tampilkan notifikasi toast
 * type: 'success' | 'error' | 'info'
 */
function showNotification(message, type = 'info') {
    // Hapus toast sebelumnya jika ada
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Buat toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas ${getToastIcon(type)} text-xl"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove setelah 4 detik
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Get icon untuk toast berdasarkan type
 */
function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

// ============================================
// 9. SMOOTH SCROLL
// ============================================
/**
 * Smooth scroll ke section tertentu
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ============================================
// 10. VALIDATE FORM
// ============================================
/**
 * Validasi form input
 */
function validateForm(formData) {
    const errors = [];
    
    // Validasi nama
    if (!formData.nama || formData.nama.trim() === '') {
        errors.push(CONFIG.MESSAGES.validation.nameRequired);
    }
    
    // Validasi ucapan/message
    if (formData.ucapan && !formData.ucapan.trim()) {
        errors.push(CONFIG.MESSAGES.validation.messageRequired);
    }
    
    // Validasi RSVP status
    if (formData.rsvp_status !== undefined && !formData.rsvp_status) {
        errors.push(CONFIG.MESSAGES.validation.rsvpRequired);
    }
    
    // Validasi jumlah tamu
    if (formData.jumlah_hadir !== undefined) {
        const count = parseInt(formData.jumlah_hadir);
        if (isNaN(count) || count < 0 || count > CONFIG.SETTINGS.maxGuests) {
            errors.push(CONFIG.MESSAGES.validation.guestCountInvalid);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ============================================
// 11. SANITIZE INPUT
// ============================================
/**
 * Bersihkan input dari karakter berbahaya
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove HTML tags
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ============================================
// 12. GENERATE SLUG FROM NAME
// ============================================
/**
 * Generate slug dari nama
 * "John Doe" -> "john-doe"
 */
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces dengan -
        .replace(/[^\w\-]+/g, '')       // Remove karakter non-alphanumeric
        .replace(/\-\-+/g, '-')         // Replace multiple - dengan single -
        .replace(/^-+/, '')             // Trim - dari awal
        .replace(/-+$/, '');            // Trim - dari akhir
}

// ============================================
// 13. TRUNCATE TEXT
// ============================================
/**
 * Potong text jika terlalu panjang
 */
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ============================================
// 14. DEBOUNCE FUNCTION
// ============================================
/**
 * Debounce untuk optimize performance
 * Berguna untuk event yang sering trigger (scroll, resize, dll)
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// 15. CHECK IF MOBILE
// ============================================
/**
 * Check apakah device mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ============================================
// 16. FORMAT NUMBER WITH SEPARATOR
// ============================================
/**
 * Format angka dengan separator
 * 1234567890 -> "1.234.567.890"
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ============================================
// 17. ESCAPE HTML
// ============================================
/**
 * Escape HTML untuk prevent XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// 18. LOADING STATE HANDLER
// ============================================
/**
 * Show/hide loading state pada button
 */
function setButtonLoading(buttonElement, isLoading, originalText = 'Submit') {
    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Please wait...
        `;
    } else {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalText;
    }
}

// ============================================
// 19. ADD CSS ANIMATION
// ============================================
/**
 * Tambahkan animation class ke element
 */
function addAnimation(element, animationClass, callback) {
    element.classList.add(animationClass);
    
    element.addEventListener('animationend', function handler() {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', handler);
        if (callback) callback();
    });
}

// ============================================
// 20. PRELOAD IMAGE
// ============================================
/**
 * Preload image untuk prevent flickering
 */
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

// ============================================
// 21. PRELOAD MULTIPLE IMAGES
// ============================================
/**
 * Preload multiple images sekaligus
 */
async function preloadImages(urls) {
    try {
        const promises = urls.map(url => preloadImage(url));
        await Promise.all(promises);
        log('All images preloaded successfully');
        return true;
    } catch (error) {
        logError('Error preloading images:', error);
        return false;
    }
}

// ============================================
// 22. SHUFFLE ARRAY
// ============================================
/**
 * Shuffle array (random order)
 * Berguna untuk randomize gallery
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ============================================
// 23. GET GREETING BY TIME
// ============================================
/**
 * Get greeting berdasarkan waktu
 * Pagi/Siang/Sore/Malam
 */
function getGreeting() {
    const hour = new Date().getHours();
    
    if (hour < 10) return 'Good Morning';
    if (hour < 15) return 'Good Afternoon';
    if (hour < 18) return 'Good Evening';
    return 'Good Night';
}

// ============================================
// 24. GET INITIALS FROM NAME
// ============================================
/**
 * Get initials dari nama untuk avatar
 * "John Doe" -> "JD"
 */
function getInitials(name) {
    if (!name) return '?';
    
    const parts = name.trim().split(' ');
    
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ============================================
// 25. LAZY LOAD IMAGES
// ============================================
/**
 * Setup lazy loading untuk images
 */
function setupLazyLoad() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        log('Lazy load initialized');
    }
}

// ============================================
// 26. CHECK ONLINE STATUS
// ============================================
/**
 * Check apakah online atau offline
 */
function isOnline() {
    return navigator.onLine;
}

// ============================================
// 27. DETECT TOUCH DEVICE
// ============================================
/**
 * Detect apakah device support touch
 */
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// ============================================
// 28. GET BROWSER INFO
// ============================================
/**
 * Get browser name dan version
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (ua.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        browserVersion = ua.match(/Firefox\/([0-9.]+)/)[1];
    } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
        browserName = 'Chrome';
        browserVersion = ua.match(/Chrome\/([0-9.]+)/)[1];
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        browserName = 'Safari';
        browserVersion = ua.match(/Version\/([0-9.]+)/)[1];
    } else if (ua.indexOf('Edg') > -1) {
        browserName = 'Edge';
        browserVersion = ua.match(/Edg\/([0-9.]+)/)[1];
    }
    
    return { name: browserName, version: browserVersion };
}

// ============================================
// CONSOLE LOG HELPER (Development only)
// ============================================
function log(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`%c[Wedding App] ${message}`, 'color: #10b981', data || '');
    }
}

function logError(message, error = null) {
    console.error(`%c[Wedding App Error] ${message}`, 'color: #ef4444', error || '');
}

function logWarning(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn(`%c[Wedding App Warning] ${message}`, 'color: #f59e0b', data || '');
    }
}

// ============================================
// EXPORT untuk testing (opsional)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUrlParameter,
        parseWeddingDate,
        formatDateIndonesia,
        formatTime,
        formatTimestamp,
        calculateCountdown,
        copyToClipboard,
        showNotification,
        smoothScrollTo,
        validateForm,
        sanitizeInput,
        generateSlug,
        escapeHtml,
        getInitials,
        isOnline,
        isMobile,
        isTouchDevice
    };
}