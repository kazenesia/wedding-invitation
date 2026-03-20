// ===================================
// MAIN APPLICATION LOGIC
// Wedding Invitation Main Controller
// Black & White Theme
// ===================================

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentGuest = null;
let weddingDate = null;
let countdownInterval = null;
let musicPlayer = null;
let isInvitationOpened = false;

// ============================================
// 1. INIT APPLICATION
// ============================================
/**
 * Initialize aplikasi saat page load
 */
document.addEventListener('DOMContentLoaded', async function() {
    log('Application initializing...');
    
    try {
        // Parse wedding date
        weddingDate = parseWeddingDate(CONFIG.WEDDING_DATE);
        log('Wedding date:', weddingDate);
        
        // Init music player
        initMusicPlayer();
        
        // Init AOS animation
        initAnimations();
        
        // Preload critical images (optional)
        if (CONFIG.SETTINGS.showLoading) {
            preloadCriticalImages();
        }
        
        // Init event listeners (including Lightbox)
        initEventListeners();
        
        // Load guest data dari URL
        await loadGuestData();
        
        // Load wishes if feature enabled
        if (isFeatureEnabled('showWishes')) {
            await loadWishes();
        }
        
        // Setup lazy load for gallery images
        setupLazyLoad();
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Prefetch wishes in background
        if (isFeatureEnabled('showWishes')) {
            setTimeout(() => {
                prefetchWishes();
            }, 2000);
        }
        
        log('Application initialized successfully ✓');
        
    } catch (error) {
        logError('Initialization error:', error);
        hideLoadingScreen();
        showNotification('An error occurred while loading the page', 'error');
    }
});

// ============================================
// 2. PRELOAD CRITICAL IMAGES
// ============================================
async function preloadCriticalImages() {
    const criticalImages = [
        CONFIG.IMAGES.cover,
        CONFIG.IMAGES.bride,
        CONFIG.IMAGES.groom
    ];
    
    await preloadImages(criticalImages);
}

// ============================================
// 3. HIDE LOADING SCREEN
// ============================================
function hideLoadingScreen() {
    const loading = document.getElementById('loading');
    
    setTimeout(() => {
        if (loading) {
            loading.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
    }, CONFIG.SETTINGS.loadingDuration);
}

// ============================================
// 4. INIT ANIMATIONS
// ============================================
function initAnimations() {
    // Init AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init(CONFIG.SETTINGS.aos);
        log('AOS initialized');
    } else {
        logWarning('AOS library not found');
    }
}

// ============================================
// 5. LOAD GUEST DATA
// ============================================
async function loadGuestData() {
    // Get slug dari URL parameter
    const slug = getUrlParameter('to');
    
    if (!slug) {
        log('No guest slug in URL, using default');
        const defaultName = CONFIG.COVER.defaultGuestName;
        updateGuestDisplay(defaultName, null);
        return;
    }
    
    log('Loading guest data for slug:', slug);
    
    try {
        const result = await getGuestData(slug);
        
        if (result.success && result.data) {
            currentGuest = result.data;
            log('Guest data loaded:', currentGuest);
            
            // Update display
            updateGuestDisplay(currentGuest.nama, currentGuest);
            
            // Refresh AOS for kinetic text
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
        } else {
            log('Guest not found, using default');
            const defaultName = CONFIG.COVER.defaultGuestName;
            updateGuestDisplay(defaultName, null);
            showNotification('Guest data not found. Using default name.', 'info');
        }
        
    } catch (error) {
        logError('Error loading guest data:', error);
        const defaultName = CONFIG.COVER.defaultGuestName;
        updateGuestDisplay(defaultName, null);
    }
}

// ============================================
// 6. UPDATE GUEST DISPLAY
// ============================================
function updateGuestDisplay(guestName, guestData) {
    // Update di cover section
    const coverGuestName = document.getElementById('guest-name');
    if (coverGuestName) {
        coverGuestName.textContent = guestName;
    }
    
    // Update di RSVP section
    const rsvpGuestName = document.getElementById('rsvp-guest-name');
    if (rsvpGuestName) {
        rsvpGuestName.textContent = guestName;
    }
    
    // Jika ada data RSVP sebelumnya, tampilkan status
    if (guestData && guestData.rsvp_status) {
        displayPreviousRSVP(guestData);
    }

    // Refresh AOS for updated text if needed
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// ============================================
// 7. DISPLAY PREVIOUS RSVP (jika sudah submit)
// ============================================
function displayPreviousRSVP(guestData) {
    if (!isFeatureEnabled('showRSVP')) return;
    
    const rsvpForm = document.getElementById('rsvp-form');
    if (!rsvpForm) return;
    
    // Tambahkan info bahwa tamu sudah RSVP
    const existingInfo = document.getElementById('previous-rsvp-info');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    const infoDiv = document.createElement('div');
    infoDiv.id = 'previous-rsvp-info';
    infoDiv.className = 'bg-white/10 backdrop-blur-sm border border-white/30 p-5 mb-6';
    infoDiv.innerHTML = `
        <div class="flex items-start gap-3 text-white">
            <i class="fas fa-info-circle text-xl mt-1"></i>
            <div>
                <p class="font-semibold mb-2">Previous Confirmation:</p>
                <p class="text-white/90">Status: <strong>${guestData.rsvp_status}</strong></p>
                ${guestData.jumlah_hadir > 0 ? `<p class="text-white/90">Guests: <strong>${guestData.jumlah_hadir} person(s)</strong></p>` : ''}
                <p class="text-white/70 text-sm mt-3">You can update your confirmation below.</p>
            </div>
        </div>
    `;
    
    rsvpForm.insertBefore(infoDiv, rsvpForm.firstChild);
}

// ============================================
// 8. INIT EVENT LISTENERS
// ============================================
function initEventListeners() {
    log('Initializing event listeners...');
    
    // RSVP Form
    if (isFeatureEnabled('showRSVP')) {
        const rsvpForm = document.getElementById('rsvp-form');
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', handleRSVPSubmit);
            
            // Show/hide attendance count based on selection
            const rsvpRadios = rsvpForm.querySelectorAll('input[name="rsvp_status"]');
            rsvpRadios.forEach(radio => {
                radio.addEventListener('change', handleRSVPStatusChange);
            });
        }
    }
    
    // Wish Form
    if (isFeatureEnabled('showWishes')) {
        const wishForm = document.getElementById('wish-form');
        if (wishForm) {
            wishForm.addEventListener('submit', handleWishSubmit);
        }
    }
    
    // Music toggle
    if (isFeatureEnabled('showMusicPlayer')) {
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
        }
    }
    
    // Gallery Lightbox
    initLightbox();
    
    log('Event listeners initialized ✓');
}

// ============================================
// 9. OPEN INVITATION
// ============================================
function openInvitation() {
    log('Opening invitation...');
    
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const musicToggle = document.getElementById('music-toggle');
    
    // Hide cover
    if (cover) {
        cover.style.transition = 'all 1s ease-in-out';
        cover.style.transform = 'translateY(-100%)';
        cover.style.opacity = '0';
        setTimeout(() => {
            cover.style.display = 'none';
        }, 1000);
    }
    
    // Show main content
    if (mainContent) {
        mainContent.classList.remove('hidden');
        
        // Smooth scroll to hero with slight delay for dramatic effect
        setTimeout(() => {
            smoothScrollTo('hero');
        }, 1200);
    }
    
    // Show music toggle
    if (musicToggle && isFeatureEnabled('showMusicPlayer')) {
        musicToggle.classList.remove('hidden');
    }
    // Play music (trigger on user interaction)
    if (CONFIG.SETTINGS.autoPlayMusic) {
        playMusic();
    }
    
    // Trigger Confetti
    triggerConfetti();
    
    // Start countdown
    if (isFeatureEnabled('showCountdown')) {
        startCountdown();
    }
    
    // Refresh AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    isInvitationOpened = true;
    log('Invitation opened ✓');
}

// ============================================
// 10. MUSIC PLAYER
// ============================================
function initMusicPlayer() {
    musicPlayer = document.getElementById('background-music');
    
    if (musicPlayer) {
        musicPlayer.volume = CONFIG.MUSIC.volume;
        log('Music player initialized');
    } else {
        logWarning('Music player element not found');
    }
}

function playMusic() {
    if (musicPlayer) {
        musicPlayer.play().then(() => {
            log('Music playing');
            updateMusicIcon(true);
            localStorage.setItem('wedding_music_state', 'playing');
        }).catch(error => {
            logError('Error playing music:', error);
            // Auto play sering di-block browser, ini normal
            logWarning('Music autoplay blocked by browser. User need to click play.');
        });
    }
}

function pauseMusic() {
    if (musicPlayer) {
        musicPlayer.pause();
        log('Music paused');
        updateMusicIcon(false);
        localStorage.setItem('wedding_music_state', 'muted');
    }
}

function toggleMusic() {
    if (musicPlayer) {
        if (musicPlayer.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    }
}

function updateMusicIcon(isPlaying) {
    const musicIcon = document.getElementById('music-icon');
    const musicToggle = document.getElementById('music-toggle');
    
    if (musicIcon) {
        if (isPlaying) {
            musicIcon.className = 'fas fa-volume-high';
            if (musicToggle) {
                musicToggle.classList.add('playing');
            }
        } else {
            musicIcon.className = 'fas fa-volume-xmark';
            if (musicToggle) {
                musicToggle.classList.remove('playing');
            }
        }
    }
}

// ============================================
// 11. COUNTDOWN TIMER
// ============================================
function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Update immediately
    updateCountdown();
    
    // Then update every second
    countdownInterval = setInterval(updateCountdown, 1000);
    
    log('Countdown started');
}

function updateCountdown() {
    const countdown = calculateCountdown(weddingDate);
    
    // Update display
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(countdown.days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(countdown.hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(countdown.minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(countdown.seconds).padStart(2, '0');
    
    // Jika sudah lewat
    if (countdown.isPast) {
        clearInterval(countdownInterval);
        log('Wedding date has passed');
        
        // Optional: Update text
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
    }
}

// ============================================
// 12. HANDLE RSVP STATUS CHANGE
// ============================================
function handleRSVPStatusChange(event) {
    const status = event.target.value;
    const attendanceContainer = document.getElementById('attendance-count-container');
    const attendanceInput = document.getElementById('attendance-count');
    
    if (status === 'Hadir') {
        // Show attendance count
        if (attendanceContainer) {
            attendanceContainer.classList.remove('hidden');
        }
        if (attendanceInput) {
            attendanceInput.required = true;
            attendanceInput.value = 1; // Set default to 1
        }
    } else {
        // Hide attendance count
        if (attendanceContainer) {
            attendanceContainer.classList.add('hidden');
        }
        if (attendanceInput) {
            attendanceInput.required = false;
            attendanceInput.value = 0;
        }
    }
}

// ============================================
// 13. HANDLE RSVP SUBMIT
// ============================================
async function handleRSVPSubmit(event) {
    event.preventDefault();
    
    log('Submitting RSVP...');
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Get form data
    const formData = new FormData(form);
    const rsvpStatus = formData.get('rsvp_status');
    const attendanceCountInput = document.getElementById('attendance-count');
    const attendanceCount = attendanceCountInput ? attendanceCountInput.value : 0;
    
    // Validation
    if (!rsvpStatus) {
        showNotification(CONFIG.MESSAGES.validation.rsvpRequired, 'error');
        // Add visual shake effect 
        const radioGroup = form.querySelector('.grid');
        if (radioGroup) {
            radioGroup.classList.add('shake-error');
            setTimeout(() => radioGroup.classList.remove('shake-error'), 600);
        }
        return;
    }
    
    // Get guest slug
    const slug = getUrlParameter('to') || 'default';
    
    if (!currentGuest && slug === 'default') {
        showNotification(CONFIG.MESSAGES.error.invalidUrl, 'error');
        return;
    }
    
    // Prepare data
    const rsvpData = {
        slug: currentGuest ? currentGuest.slug : slug,
        rsvp_status: rsvpStatus,
        jumlah_hadir: rsvpStatus === 'Hadir' ? parseInt(attendanceCount) : 0
    };
    
    // Show loading
    setButtonLoading(submitButton, true);
    
    try {
        // Submit RSVP
        const result = await submitRSVPSafe(rsvpData);
        
        if (result.success) {
            if (result.queued) {
                showNotification(result.message, 'info');
            } else {
                showNotification(CONFIG.MESSAGES.success.rsvp, 'success');
            }
            
            // Update current guest data
            if (currentGuest) {
                currentGuest.rsvp_status = rsvpStatus;
                currentGuest.jumlah_hadir = rsvpData.jumlah_hadir;
                displayPreviousRSVP(currentGuest);
            }
            
            // Scroll to thank you section
            setTimeout(() => {
                smoothScrollTo('thankyou');
            }, 1500);
            
        } else {
            showNotification(result.message || CONFIG.MESSAGES.error.rsvp, 'error');
        }
        
    } catch (error) {
        logError('RSVP submit error:', error);
        showNotification(CONFIG.MESSAGES.error.rsvp, 'error');
    } finally {
        setButtonLoading(submitButton, false, originalButtonText);
    }
}

// ============================================
// 14. HANDLE WISH SUBMIT
// ============================================
async function handleWishSubmit(event) {
    event.preventDefault();
    
    log('Submitting wish...');
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Get form data
    const nameInput = document.getElementById('wish-name');
    const messageInput = document.getElementById('wish-message');
    
    const wishData = {
        nama: nameInput.value.trim(),
        ucapan: messageInput.value.trim()
    };
    
    // Validation
    const validation = validateForm({
        nama: wishData.nama,
        ucapan: wishData.ucapan
    });
    
    if (!validation.isValid) {
        showNotification(validation.errors.join(', '), 'error');
        
        // Add visual shake effect to invalid fields
        if (!wishData.nama && nameInput) {
            nameInput.classList.add('shake-error');
            setTimeout(() => nameInput.classList.remove('shake-error'), 600);
        }
        if (!wishData.ucapan && messageInput) {
            messageInput.classList.add('shake-error');
            setTimeout(() => messageInput.classList.remove('shake-error'), 600);
        }
        return;
    }
    
    // Show loading
    setButtonLoading(submitButton, true);
    
    try {
        // Submit wish
        const result = await submitWishSafe(wishData);
        
        if (result.success) {
            if (result.queued) {
                showNotification(result.message, 'info');
            } else {
                showNotification(CONFIG.MESSAGES.success.wish, 'success');
            }
            
            // Clear form
            form.reset();
            
            // Reload wishes
            await loadWishes();
            
            // Scroll to wishes container
            setTimeout(() => {
                smoothScrollTo('wishes-container');
            }, 500);
            
        } else {
            showNotification(result.message || CONFIG.MESSAGES.error.wish, 'error');
        }
        
    } catch (error) {
        logError('Wish submit error:', error);
        showNotification(CONFIG.MESSAGES.error.wish, 'error');
    } finally {
        setButtonLoading(submitButton, false, originalButtonText);
    }
}

// ============================================
// 15. LOAD WISHES
// ============================================
async function loadWishes() {
    if (!isFeatureEnabled('showWishes')) return;
    
    log('Loading wishes...');
    
    const wishesContainer = document.getElementById('wishes-container');
    
    if (!wishesContainer) return;
    
    // Show loading
    wishesContainer.innerHTML = `
        <div class="text-center text-white/60 py-8">
            <i class="fas fa-spinner fa-spin text-2xl"></i>
            <p class="mt-2 tracking-wide">${CONFIG.WISHES.loadingText}</p>
        </div>
    `;
    
    try {
        const result = await getWishesWithCache();
        
        if (result.success && result.data.length > 0) {
            displayWishes(result.data);
        } else {
            wishesContainer.innerHTML = `
                <div class="text-center text-white/60 py-8">
                    <i class="fas fa-comment-slash text-4xl mb-3 text-white/30"></i>
                    <p>${CONFIG.WISHES.emptyText}</p>
                </div>
            `;
        }
        
    } catch (error) {
        logError('Error loading wishes:', error);
        wishesContainer.innerHTML = `
            <div class="text-center text-red-400 py-8">
                <i class="fas fa-exclamation-triangle text-2xl"></i>
                <p class="mt-2">${CONFIG.WISHES.errorText}</p>
            </div>
        `;
    } finally {
        // Refresh AOS to detect new elements inside container if any
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}

// ============================================
// 16. DISPLAY WISHES
// ============================================
function displayWishes(wishes) {
    const wishesContainer = document.getElementById('wishes-container');
    
    if (!wishesContainer) return;
    
    wishesContainer.innerHTML = '';
    
    wishes.forEach((wish, index) => {
        const wishCard = createWishCard(wish, index);
        wishesContainer.appendChild(wishCard);
    });
    
    // Refresh AOS to start animations for new cards
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    log(`Displayed ${wishes.length} wishes`);
}

// ============================================
// 17. CREATE WISH CARD
// ============================================
function createWishCard(wish, index) {
    const card = document.createElement('div');
    card.className = 'wish-card bg-white/10 backdrop-blur-sm border border-white/20 p-6';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', Math.min(index * 50, 500));
    
    const timestamp = formatTimestamp(wish.timestamp);
    
    card.innerHTML = `
        <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 font-semibold">
                ${getInitials(wish.nama)}
            </div>
            <div class="flex-1">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="font-semibold text-white">${escapeHtml(wish.nama)}</h4>
                    <span class="text-xs text-white/50">${timestamp}</span>
                </div>
                <p class="text-white/90 leading-relaxed">${escapeHtml(wish.ucapan)}</p>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// 18. CLEANUP ON PAGE UNLOAD
// ============================================
window.addEventListener('beforeunload', function() {
    // Stop countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Pause music
    if (musicPlayer) {
        musicPlayer.pause();
    }
    
    log('Cleanup completed');
});

// ============================================
// 19. HANDLE VISIBILITY CHANGE (pause music when tab inactive)
// ============================================
document.addEventListener('visibilitychange', function() {
    if (!isFeatureEnabled('showMusicPlayer')) return;
    
    if (document.hidden) {
        // Tab is hidden
        if (musicPlayer && !musicPlayer.paused) {
            musicPlayer.pause();
            log('Music paused (tab hidden)');
        }
    } else {
        // Tab is visible
        const audioState = localStorage.getItem('wedding_music_state');
        // Only resume if invitation is opened, we have autoplay enabled, AND user hasn't muted it
        if (isInvitationOpened && musicPlayer && musicPlayer.paused && CONFIG.SETTINGS.autoPlayMusic && audioState !== 'muted') {
            musicPlayer.play().catch(error => {
                logError('Error resuming music:', error);
            });
            log('Music resumed (tab visible)');
        }
    }
});

// ============================================
// 20. KEYBOARD SHORTCUTS (untuk development)
// ============================================
document.addEventListener('keydown', function(event) {
    // Ctrl+Shift+D = Toggle debug mode
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        const debugInfo = {
            currentGuest: currentGuest,
            weddingDate: weddingDate,
            isOnline: navigator.onLine,
            musicPlaying: musicPlayer ? !musicPlayer.paused : false,
            featuresEnabled: CONFIG.FEATURES,
            browserInfo: getBrowserInfo()
        };
        console.log('%c=== DEBUG INFO ===', 'color: #3b82f6; font-size: 16px; font-weight: bold');
        console.table(debugInfo);
        console.log('%c==================', 'color: #3b82f6; font-size: 16px; font-weight: bold');
    }
    
    // Ctrl+Shift+M = Toggle music
    if (event.ctrlKey && event.shiftKey && event.key === 'M') {
        toggleMusic();
    }
    
    // Ctrl+Shift+R = Reload wishes
    if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        if (isFeatureEnabled('showWishes')) {
            loadWishes();
            showNotification('Wishes reloaded', 'info');
        }
    }
});

// ============================================
// 21. HANDLE NETWORK STATUS CHANGES
// ============================================
window.addEventListener('online', function() {
    log('Connection restored');
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    log('Connection lost');
    showNotification(CONFIG.MESSAGES.info.offline, 'error');
});

// ============================================
// 22. DETECT BROWSER COMPATIBILITY
// ============================================
function checkBrowserCompatibility() {
    const browserInfo = getBrowserInfo();
    log('Browser detected:', browserInfo);
    
    // Check critical features
    const features = {
        fetch: typeof fetch !== 'undefined',
        Promise: typeof Promise !== 'undefined',
        localStorage: typeof localStorage !== 'undefined',
        IntersectionObserver: 'IntersectionObserver' in window
    };
    
    const unsupported = Object.keys(features).filter(key => !features[key]);
    
    if (unsupported.length > 0) {
        logWarning('Unsupported features:', unsupported);
        showNotification('Your browser may not support all features. Please update to the latest version.', 'info');
    }
    
    return unsupported.length === 0;
}

// ============================================
// 23. PERFORMANCE MONITORING (Optional)
// ============================================
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        log('Performance Metrics:');
        log('- Page Load Time:', pageLoadTime + 'ms');
        log('- DOM Ready Time:', domReadyTime + 'ms');
        
        // Log slow loading
        if (pageLoadTime > 5000) {
            logWarning('Page loaded slowly (>5s). Consider optimizing images.');
        }
    }
});

// ============================================
// 24. ERROR BOUNDARY
// ============================================
window.addEventListener('error', function(event) {
    logError('Global error caught:', event.error);
    
    // Don't show error notification for resource loading errors
    if (event.message.includes('Failed to load') || event.message.includes('Script error')) {
        return;
    }
    
    // Show generic error message
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    logError('Unhandled promise rejection:', event.reason);
});

// ============================================
// 25. SERVICE WORKER REGISTRATION (Optional - for PWA)
// ============================================
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    // Uncomment to enable service worker (for offline support)
    /*
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            log('ServiceWorker registered:', registration.scope);
        }).catch(function(error) {
            logError('ServiceWorker registration failed:', error);
        });
    });
    */
}

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// (untuk bisa dipanggil dari HTML)
// ============================================
window.openInvitation = openInvitation;
window.copyToClipboard = copyToClipboard;
window.toggleMusic = toggleMusic;

// Expose untuk debugging (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.__wedding__ = {
        currentGuest,
        weddingDate,
        config: CONFIG,
        reloadWishes: loadWishes,
        checkCompatibility: checkBrowserCompatibility
    };
}

// ============================================
// 26. LIGHTBOX GALLERY
// ============================================
let galleryImages = [];
let currentImageIndex = 0;

/**
 * Initialize Lightbox for gallery
 */
function initLightbox() {
    log('Initializing Lightbox...');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (!lightbox || !lightboxImg) {
        logWarning('Lightbox elements not found');
        return;
    }
    
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-image img');
    galleryImages = Array.from(galleryItems).map(img => ({
        src: img.src,
        alt: img.getAttribute('alt') || 'Wedding Gallery'
    }));
    
    log(`Lightbox: Found ${galleryImages.length} images`);
    
    // Add click event to each gallery item
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    // Close events
    if (closeBtn) {
        closeBtn.onclick = () => { 
            lightbox.style.display = 'none'; 
            document.body.style.overflow = 'auto'; // Re-enable scroll
        };
    }
    
    lightbox.onclick = (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    // Navigation events
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            changeImage(-1);
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            changeImage(1);
        };
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            changeImage(1); // Swipe left -> Next
        }
        if (touchEndX > touchStartX + 50) {
            changeImage(-1); // Swipe right -> Prev
        }
    }
}

/**
 * Open Lightbox with specific image index
 */
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (index < 0 || index >= galleryImages.length) return;
    
    currentImageIndex = index;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable scroll
    
    updateLightboxButtons();
    log('Lightbox opened for image:', currentImageIndex);
}

/**
 * Change Lightbox image (prev/next)
 */
function changeImage(step) {
    const lightboxImg = document.getElementById('lightbox-img');
    const newIndex = currentImageIndex + step;
    
    // Check boundaries (prevent looping)
    if (newIndex < 0 || newIndex >= galleryImages.length) {
        return;
    }
    
    currentImageIndex = newIndex;
    
    // Smooth transition
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = galleryImages[currentImageIndex].src;
        lightboxImg.style.opacity = '1';
        updateLightboxButtons();
    }, 200);
}

/**
 * Update visibility of prev/next buttons based on current image index
 */
function updateLightboxButtons() {
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (prevBtn) {
        prevBtn.style.display = (currentImageIndex === 0) ? 'none' : 'block';
    }
    
    if (nextBtn) {
        nextBtn.style.display = (currentImageIndex === galleryImages.length - 1) ? 'none' : 'block';
    }
}

// ============================================
// LOG INIT COMPLETE
// ============================================
log('%cmain.js loaded successfully ✓', 'color: #10b981; font-weight: bold');

// Run browser compatibility check
checkBrowserCompatibility();

// ============================================
// 23. ADVANCED ANIMATIONS: PARTICLES, TILT, CONFETTI
// ============================================

function initAdvancedAnimations() {
    initParticles();
    initTilt();
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 30;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 15 + 5;
            this.speed = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.type = Math.random() > 0.5 ? 'heart' : 'circle';
        }
        
        update() {
            this.y -= this.speed;
            if (this.y < -20) {
                this.reset();
            }
        }
        
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#ffffff';
            
            if (this.type === 'heart') {
                this.drawHeart(this.x, this.y, this.size);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        drawHeart(x, y, size) {
            ctx.beginPath();
            ctx.moveTo(x, y + size / 4);
            ctx.quadraticCurveTo(x, y, x + size / 4, y);
            ctx.quadraticCurveTo(x + size / 2, y, x + size / 2, y + size / 4);
            ctx.quadraticCurveTo(x + size / 2, y + size / 2, x, y + size * 0.75);
            ctx.quadraticCurveTo(x - size / 2, y + size / 2, x - size / 2, y + size / 4);
            ctx.quadraticCurveTo(x - size / 2, y, x - size / 4, y);
            ctx.quadraticCurveTo(x, y, x, y + size / 4);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}

// Call advanced initializers
document.addEventListener('DOMContentLoaded', () => {
    initAdvancedAnimations();
});
