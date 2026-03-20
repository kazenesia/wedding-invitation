// ===================================
// CONFIGURATION FILE
// Wedding Invitation - Black & White Theme
// ===================================

const CONFIG = {
    // ============================================
    // GOOGLE APPS SCRIPT WEB APP URL
    // ============================================
    // GANTI dengan Web App URL yang sudah di-deploy di Step 2
    API_URL: 'https://script.google.com/macros/s/AKfycbzcGJC0bA-zSCwW9gWwKvRP6HmpDLYs3LpSHLvg6n_ilMdcMYCZxgelthLI2QZVagcykQ/exec',
    
    // ============================================
    // WEDDING DATE
    // ============================================
    // Format: DD-MM-YYYY HH:MM:SS
    // Contoh: 23-02-2026 11:00:00 berarti 23 Februari 2026 jam 11:00:00
    WEDDING_DATE: '05-06-2026 08:00:00',
    
    // ============================================
    // COUPLE INFO
    // ============================================
    BRIDE: {
        name: 'Mella',                          // Nama pendek untuk script font
        fullName: 'Mella Anaya Rahmani',   // Nama lengkap
        parents: 'Bapak Moch. Andi Rahman & Ibu Ika Fatmawati',                  // Nama orang tua
        instagram: 'https://instagram.com/mella.anayaa',    // Instagram URL
        photo: 'assets/images/bride.webp'             // Path foto mempelai wanita
    },
    
    GROOM: {
        name: 'Bram',                          // Nama pendek untuk script font
        fullName: 'Bram Aji Saka Putra',     // Nama lengkap
        parents: 'Bapak Hadi Kuswanto & Almh. Ibu Watini',                  // Nama orang tua
        instagram: 'https://instagram.com/brama.ji__',    // Instagram URL
        photo: 'assets/images/groom.webp'             // Path foto mempelai pria
    },
    
    // Nama couple untuk tampilan (akan digabung)
    COUPLE_NAME: 'Mella & Bram',
    
    // ============================================
    // HERO SECTION
    // ============================================
    HERO: {
        quoteText: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu dapat ketenangan hati dan dijadikannya kasih sayang di antara kamu"',
        quoteSource: 'QS. Ar-Rum: 21',
        saveTheDate: 'Save The Date',
        dateDisplay: '05 . 06 . 2026'
    },
    
    // ============================================
    // JOURNEY OF LOVE SECTION
    // ============================================
    JOURNEY: {
        title: 'Our Journey of Love',
        stories: [
            {
                title: 'First Meet',
                year: 'July 2025',
                image: 'assets/images/firstmeet.webp',
                description: 'Pertemuan pertama kami terjadi di sebuah kafe kecil di sudut kota. Tak pernah terbayangkan bahwa secangkir kopi hangat akan menjadi awal dari cerita cinta yang indah ini.'
            },
            {
                title: 'The Proposal',
                year: 'December 2025',
                image: 'assets/images/proposal.webp',
                description: 'Di bawah langit berbintang, dengan suara ombak sebagai saksi, kami berjanji untuk saling mengasihi dan merawat hingga akhir hayat. Momen yang tak akan pernah terlupakan.'
            },
            {
                title: 'Building Dreams Together',
                year: '2026',
                image: 'assets/images/dream.webp',
                description: 'Kami terus membangun mimpi bersama, melewati setiap tantangan dengan cinta dan pengertian. Kini saatnya kami melangkah ke babak baru kehidupan sebagai suami istri.'
            }
        ]
    },
    
    // ============================================
    // EVENT DETAILS
    // ============================================
    AKAD: {
        title: 'Akad Nikah',
        icon: 'fa-ring',
        date: 'Jumat, 05 Juni 2026',
        time: '08.00 - 10.00 WIB',
        venue: 'Kediaman Mempelai Wanita',
        address: 'Dusun Mlaten Gg. II RT 01 RW 02 Karangrejo, Gempol, Pasuruan, Jawa Timur 67155',
        addressShort: 'Gempol, Pasuruan',
        mapsUrl: 'https://maps.app.goo.gl/JaqMAxvPNsGcAP7q7' // Ganti dengan koordinat real
    },
    
    RESEPSI: {
        title: 'Resepsi',
        icon: 'fa-glass-cheers',
        date: 'Minggu, 23 Februari 2026',
        time: '14.00 - 21.00 WIB',
        venue: 'Kediaman Mempelai Wanita',
        address: 'Dusun Mlaten Gg. II RT 01 RW 02 Karangrejo, Gempol, Pasuruan, Jawa Timur 67155',
        addressShort: 'Gempol, Pasuruan',
        mapsUrl: 'https://maps.app.goo.gl/JaqMAxvPNsGcAP7q7' // Ganti dengan koordinat real
    },
    
    // ============================================
    // COUNTDOWN SECTION
    // ============================================
    COUNTDOWN: {
        title: 'Counting The Days',
        labels: {
            days: 'Days',
            hours: 'Hours',
            minutes: 'Minutes',
            seconds: 'Seconds'
        }
    },
    
    // ============================================
    // GALLERY SECTION
    // ============================================
    GALLERY: {
        title: 'Gallery',
        openingQuote: '"Every love story is beautiful, but ours is my favorite"',
        closingQuote: '"Moments captured, memories cherished forever"',
        images: [
            'assets/images/gallery/1.webp',
            'assets/images/gallery/2.webp',
            'assets/images/gallery/3.webp',
            'assets/images/gallery/4.webp',
            'assets/images/gallery/5.webp',
            'assets/images/gallery/6.webp',
            'assets/images/gallery/7.webp',
            'assets/images/gallery/8.webp',
            'assets/images/gallery/9.webp',
            'assets/images/gallery/10.webp',
            'assets/images/gallery/11.webp',
            'assets/images/gallery/12.webp',
            'assets/images/gallery/13.webp',
            'assets/images/gallery/14.webp',
            'assets/images/gallery/15.webp'
        ]
    },
    
    // ============================================
    // RSVP SECTION
    // ============================================
    RSVP: {
        title: 'RSVP',
        subtitle: 'Kindly confirm your attendance',
        guestLabel: 'Dear',
        attendanceQuestion: 'Will you attend?',
        attendanceOptions: {
            yes: 'Yes',
            no: 'No'
        },
        guestCountLabel: 'Number of Guests',
        guestCountHint: 'Maximum 5 guests per invitation',
        submitButton: 'Confirm Attendance'
    },
    
    // ============================================
    // WISHES SECTION
    // ============================================
    WISHES: {
        title: 'Wishes & Prayers',
        subtitle: 'Leave your heartfelt wishes for the couple',
        formLabels: {
            name: 'Your Name',
            namePlaceholder: 'Enter your name',
            message: 'Your Wishes',
            messagePlaceholder: 'Write your wishes and prayers...',
            submitButton: 'Send Wishes'
        },
        loadingText: 'Loading wishes...',
        emptyText: 'Belum ada ucapan. Jadilah yang pertama!',
        errorText: 'Gagal memuat ucapan'
    },
    
    // ============================================
    // GIFT SECTION
    // ============================================
    GIFT: {
        title: 'Wedding Gift',
        subtitle: 'Your presence and prayers are the greatest gifts. However, if you wish to honor us with a gift, you may send it through:',
        banks: [
            {
                bankName: 'BANK BCA',
                accountName: 'Mella Anaya Rahmani',
                accountNumber: '4110920917',
                logo: null // Set null jika tidak pakai logo image
            },
            {
                bankName: 'BANK BNI',
                accountName: 'Bram Aji Saka Putra',
                accountNumber: '0834323230',
                logo: null
            }
        ],
        labels: {
            accountName: 'Account Name',
            accountNumber: 'Account Number',
            copyButton: 'Copy Number',
            copiedButton: 'Copied!'
        }
    },
    
    // ============================================
    // THANK YOU SECTION
    // ============================================
    THANKYOU: {
        title: 'Thank You',
        message: 'It is an honor and happiness for us if you are willing to attend and give your blessing to us. Your presence means the world to us.',
        closing: 'Wassalamualaikum Warahmatullahi Wabarakatuh',
        signature: 'With Love,',
        coupleName: 'Mella & Bram'
    },
    
    // ============================================
    // FOOTER
    // ============================================
    FOOTER: {
        madeWith: 'Made with',
        forCouple: 'for Mella & Bram',
        copyright: '© 2026 Wedding Invitation. All rights reserved.'
    },
    
    // ============================================
    // COVER/OPENING SECTION
    // ============================================
    COVER: {
        label: 'The Wedding of',
        coupleName: 'Mella & Bram',
        date: '05 . 06 . 2026',
        guestLabel: 'Dear',
        defaultGuestName: 'Tamu Undangan',
        openButton: 'Open Invitation'
    },
    
    // ============================================
    // IMAGES & ASSETS
    // ============================================
    IMAGES: {
        cover: 'assets/images/cover.jpg',          // Cover page background
        bride: 'assets/images/bride.jpg',          // Bride photo (full/portrait)
        groom: 'assets/images/groom.jpg',          // Groom photo (full/portrait)
        journey1: 'assets/images/journey1.jpg',    // Journey story 1
        journey2: 'assets/images/journey2.jpg',    // Journey story 2
        journey3: 'assets/images/journey3.jpg',    // Journey story 3
        gallery: [
            'assets/images/gallery/1.jpg',
            'assets/images/gallery/2.jpg',
            'assets/images/gallery/3.jpg',
            'assets/images/gallery/4.jpg',
            'assets/images/gallery/5.jpg',
            'assets/images/gallery/6.jpg'
        ]
    },
    
    // ============================================
    // MUSIC
    // ============================================
    MUSIC: {
        file: 'assets/audio/song.mp3',
        volume: 0.5,  // 0.0 - 1.0
        autoPlay: true
    },
    
    // ============================================
    // SETTINGS
    // ============================================
    SETTINGS: {
        // Auto play music saat buka undangan
        autoPlayMusic: true,
        
        // Volume musik (0.0 - 1.0)
        musicVolume: 0.5,
        
        // Maksimal jumlah tamu per undangan
        maxGuests: 5,
        
        // Tampilkan loading screen
        showLoading: true,
        
        // Durasi loading screen (ms)
        loadingDuration: 1500,
        
        // Animation delay (ms)
        animationDelay: 100,
        
        // AOS Animation settings
        aos: {
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            mirror: false
        }
    },
    
    // ============================================
    // MESSAGES (Notifications)
    // ============================================
    MESSAGES: {
        success: {
            rsvp: '✓ Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.',
            wish: '✓ Terima kasih atas ucapan dan doanya!',
            copy: '✓ Nomor rekening berhasil disalin!'
        },
        error: {
            rsvp: '✗ Maaf, terjadi kesalahan. Silakan coba lagi.',
            wish: '✗ Maaf, terjadi kesalahan. Silakan coba lagi.',
            load: '✗ Gagal memuat data. Silakan refresh halaman.',
            guestNotFound: 'Data tamu tidak ditemukan.',
            invalidUrl: 'URL tidak valid. Harap gunakan link yang dikirim via WhatsApp.',
            connection: 'Koneksi internet bermasalah. Silakan coba lagi.'
        },
        validation: {
            nameRequired: 'Nama harus diisi',
            messageRequired: 'Ucapan harus diisi',
            rsvpRequired: 'Pilih konfirmasi kehadiran',
            guestCountInvalid: 'Jumlah tamu tidak valid'
        },
        info: {
            queued: 'Data akan dikirim saat koneksi kembali',
            offline: 'Koneksi internet terputus',
            online: 'Koneksi kembali'
        }
    },
    
    // ============================================
    // SEO & META (untuk Open Graph)
    // ============================================
    META: {
        title: 'Undangan Pernikahan - Mella & Bram',
        description: 'Undangan Pernikahan Digital - Mella & Bram. 05 Juni 2026',
        keywords: 'undangan pernikahan, wedding invitation, digital invitation',
        author: 'Bride & Groom',
        ogImage: 'assets/images/cover.webp', // Image untuk preview di WhatsApp/FB
        url: 'https://theweddingof-mella-bram.vercel.app' // Base URL setelah deploy
    },
    
    // ============================================
    // SOCIAL MEDIA
    // ============================================
    SOCIAL: {
        instagram: {
            bride: 'https://instagram.com/mella.anayaa',
            groom: 'https://instagram.com/brama.ji__'
        },
        // Tambahkan social media lain jika perlu
        facebook: {
            bride: null,
            groom: null
        },
        twitter: {
            bride: null,
            groom: null
        }
    },
    
    // ============================================
    // ANALYTICS (Optional)
    // ============================================
    ANALYTICS: {
        enabled: false,
        googleAnalyticsId: null, // 'G-XXXXXXXXXX'
        facebookPixelId: null    // 'XXXXXXXXXXXXXXXXX'
    },
    
    // ============================================
    // FEATURE FLAGS
    // ============================================
    FEATURES: {
        showJourney: true,        // Show/hide Journey of Love section
        showGallery: true,        // Show/hide Gallery section
        showRSVP: true,           // Show/hide RSVP section
        showWishes: true,         // Show/hide Wishes section
        showGift: true,           // Show/hide Gift section
        showCountdown: true,      // Show/hide Countdown timer
        enableOfflineMode: true,  // Enable offline queue
        enableCache: true,        // Enable wishes caching
        showMusicPlayer: true     // Show/hide music player button
    },
    
    // ============================================
    // LANGUAGE SETTINGS
    // ============================================
    LANGUAGE: {
        default: 'id', // 'id' (Indonesia) or 'en' (English)
        
        // Untuk future: Multi-language support
        translations: {
            id: {
                saveTheDate: 'Save The Date',
                dear: 'Kepada Yth.',
                openInvitation: 'Buka Undangan'
            },
            en: {
                saveTheDate: 'Save The Date',
                dear: 'Dear',
                openInvitation: 'Open Invitation'
            }
        }
    }
};

// ===================================
// API ENDPOINTS
// ===================================
const API_ENDPOINTS = {
    getGuest: (slug) => `${CONFIG.API_URL}?action=getGuest&slug=${slug}`,
    getWishes: () => `${CONFIG.API_URL}?action=getWishes`,
    submitRSVP: () => `${CONFIG.API_URL}?action=submitRSVP`,
    submitWish: () => `${CONFIG.API_URL}?action=submitWish`
};

// ===================================
// HELPER FUNCTIONS FOR CONFIG
// ===================================

/**
 * Get config value by dot notation
 * Example: getConfig('BRIDE.name') returns 'Bride Name'
 */
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], CONFIG);
}

/**
 * Check if feature is enabled
 */
function isFeatureEnabled(feature) {
    return CONFIG.FEATURES[feature] === true;
}

/**
 * Get translation by key
 */
function getTranslation(key) {
    const lang = CONFIG.LANGUAGE.default;
    return CONFIG.LANGUAGE.translations[lang]?.[key] || key;
}

// ===================================
// VALIDATION
// ===================================

/**
 * Validate config on load
 */
function validateConfig() {
    const errors = [];
    
    // Check API URL
    if (!CONFIG.API_URL || CONFIG.API_URL.includes('AKfycby...')) {
        errors.push('⚠️ API_URL belum diset! Ganti dengan Web App URL dari Google Apps Script');
    }
    
    // Check wedding date format
    if (!CONFIG.WEDDING_DATE || !CONFIG.WEDDING_DATE.match(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/)) {
        errors.push('⚠️ WEDDING_DATE format salah! Harus: DD-MM-YYYY HH:MM:SS');
    }
    
    // Check couple names
    if (CONFIG.COUPLE_NAME === 'Mella & Bram') {
        console.warn('⚠️ Ganti COUPLE_NAME dengan nama pengantin yang sebenarnya');
    }
    
    // Log errors
    if (errors.length > 0) {
        console.error('=== CONFIG VALIDATION ERRORS ===');
        errors.forEach(err => console.error(err));
        console.error('================================');
    }
    
    return errors.length === 0;
}

// Run validation on load (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    validateConfig();
}

// ===================================
// EXPORT (untuk ES6 modules compatibility)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        API_ENDPOINTS,
        getConfig,
        isFeatureEnabled,
        getTranslation,
        validateConfig
    };
}

// ===================================
// LOG CONFIG LOADED
// ===================================
console.log('%c✓ Config loaded successfully', 'color: #10b981; font-weight: bold');
console.log('%cCouple:', 'color: #666', CONFIG.COUPLE_NAME);
console.log('%cWedding Date:', 'color: #666', CONFIG.WEDDING_DATE);
