// User Display Configuration - COMPLETE FIXED VERSION WITH CRISP ANIMATIONS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9uL_BX14Z6rRpgG4MT9Tca1opJl8EviQ",
    authDomain: "dating-connect.firebaseapp.com",
    projectId: "dating-connect",
    storageBucket: "dating-connect.appspot.com",
    messagingSenderId: "1062172180210",
    appId: "1:1062172180210:web:0c9b3c1578a5dbae58da6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('UserDisplay: Firebase initialized');

// Available wallpapers with direct image URLs
const AVAILABLE_WALLPAPERS = [
    {
        id: 'gradient_blue',
        name: 'Blue Gradient',
        url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=500&q=80',
        type: 'image',
        theme: 'blue'
    },
    {
        id: 'gradient_purple',
        name: 'Purple Gradient',
        url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&q=80',
        type: 'image',
        theme: 'purple'
    },
    {
        id: 'nature_forest',
        name: 'Forest',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=80',
        type: 'image',
        theme: 'green'
    },
    {
        id: 'beach_sunset',
        name: 'Beach Sunset',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
        type: 'image',
        theme: 'orange'
    },
    {
        id: 'mountain_peak',
        name: 'Mountain Peak',
        url: 'https://images.unsplash.com/photo-1464822759844-df37738d3fcb?w=500&q=80',
        type: 'image',
        theme: 'blue'
    },
    {
        id: 'city_lights',
        name: 'City Lights',
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80',
        type: 'image',
        theme: 'purple'
    },
    {
        id: 'abstract_art',
        name: 'Abstract Art',
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80',
        type: 'image',
        theme: 'multicolor'
    },
    {
        id: 'space_galaxy',
        name: 'Space Galaxy',
        url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80',
        type: 'image',
        theme: 'cosmic'
    },
    {
        id: 'water_drops',
        name: 'Water Drops',
        url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=500&q=80',
        type: 'image',
        theme: 'blue'
    },
    {
        id: 'fire_texture',
        name: 'Fire Texture',
        url: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=500&q=80',
        type: 'image',
        theme: 'fire'
    }
];

// Available animations - COMPLETE with all animations
const AVAILABLE_ANIMATIONS = [
    {
        id: 'fire_glow',
        name: 'Fire Glow',
        description: 'Warm fire glow covering entire background',
        type: 'animation',
        theme: 'fire'
    },
    {
        id: 'cosmic_energy',
        name: 'Cosmic Energy',
        description: 'Pulsating cosmic energy waves',
        type: 'animation',
        theme: 'cosmic'
    },
    {
        id: 'floating_hearts',
        name: 'Floating Hearts',
        description: 'Romantic floating hearts everywhere',
        type: 'animation',
        theme: 'romantic'
    },
    {
        id: 'neon_pulse',
        name: 'Neon Pulse',
        description: 'Vibrant neon color pulses',
        type: 'animation',
        theme: 'neon'
    },
    {
        id: 'starry_night',
        name: 'Starry Night',
        description: 'Twinkling stars in dark sky',
        type: 'animation',
        theme: 'starry'
    },
    {
        id: 'magic_sparkles',
        name: 'Magic Sparkles',
        description: 'Magical sparkling particles everywhere',
        type: 'animation',
        theme: 'magic'
    },
    {
        id: 'liquid_gold',
        name: 'Liquid Gold',
        description: 'Flowing golden liquid waves',
        type: 'animation',
        theme: 'gold'
    },
    {
        id: 'northern_lights',
        name: 'Northern Lights',
        description: 'Beautiful aurora color waves',
        type: 'animation',
        theme: 'aurora'
    },
    {
        id: 'digital_matrix',
        name: 'Digital Matrix',
        description: 'Futuristic digital rain effect',
        type: 'animation',
        theme: 'matrix'
    },
    {
        id: 'energy_field',
        name: 'Energy Field',
        description: 'Pulsating energy field background',
        type: 'animation',
        theme: 'energy'
    }
];

class UserDisplayManager {
    constructor(db, currentUser) {
        console.log('UserDisplayManager constructor called', { 
            db: !!db, 
            currentUser: !!currentUser,
            userId: currentUser?.uid 
        });
        this.db = db;
        this.currentUser = currentUser;
        this.currentDisplay = null;
        this.isApplying = false;
        this.initialized = false;
        this.activeAnimations = new Map();
        this.cleanupTimeout = null;
        
        this.initializeManager();
        this.injectCrispAnimationStyles();
    }

    // NEW: Inject styles to force crisp animations
    injectCrispAnimationStyles() {
        if (document.getElementById('crisp-animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'crisp-animation-styles';
        style.textContent = `
            /* Force animations to be crisp and clear */
            #profile-animation,
            #profile-animation canvas,
            #profile-animation div,
            .user-display-animation,
            .user-display-animation canvas,
            .user-display-animation div {
                image-rendering: -webkit-optimize-contrast !important;
                image-rendering: crisp-edges !important;
                image-rendering: pixelated !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                transform: translateZ(0) !important;
                backface-visibility: hidden !important;
                perspective: 1000 !important;
                will-change: transform !important;
            }

            /* Ensure canvas elements are high quality */
            #profile-animation canvas,
            .user-display-animation canvas {
                width: 100% !important;
                height: 100% !important;
                display: block !important;
            }

            /* Remove any blur effects that might be applied to animation containers */
            #profile-animation,
            .user-display-animation,
            [data-animation-id] {
                backdrop-filter: none !important;
                filter: none !important;
                -webkit-backdrop-filter: none !important;
                blur: none !important;
            }

            /* Make sure the animation container doesn't have any transforms that cause blur */
            #profile-animation * {
                transform: none !important;
            }

            /* High performance rendering for animations */
            #profile-animation,
            .user-display-animation {
                transform: translate3d(0, 0, 0) !important;
            }

            /* Fix for profile cards - ensure they don't blur the background */
            body.profile-page .profile-details,
            body.profile-page .profile-card,
            body.account-page .account-main,
            body.account-page .account-sidebar,
            body.mingle-page .profile-card {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 250, 0.95)) !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                filter: none !important;
                border: 1px solid rgba(255, 107, 157, 0.3) !important;
                box-shadow: 0 8px 32px rgba(255, 107, 157, 0.15) !important;
            }

            /* Ensure no parent elements are causing blur */
            .profile-view-container,
            .account-container,
            .mingle-container {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                filter: none !important;
            }

            /* High DPI display optimization */
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                #profile-animation canvas,
                .user-display-animation canvas {
                    image-rendering: -webkit-optimize-contrast !important;
                    image-rendering: crisp-edges !important;
                }
            }

            /* Animation styles for floating hearts */
            @keyframes floatHeartUp {
                0% {
                    transform: translateX(0) translateY(0) rotate(0deg) scale(0.8);
                    opacity: 0.7;
                }
                100% {
                    transform: translateX(var(--heart-translate-x, 0px)) translateY(-120vh) rotate(var(--heart-rotate, 0deg)) scale(1.2);
                    opacity: 0;
                }
            }

            /* Animation styles for magic sparkles */
            @keyframes sparkleTwinkle {
                0%, 100% { 
                    opacity: 0; 
                    transform: scale(0.5) rotate(0deg); 
                }
                50% { 
                    opacity: 1; 
                    transform: scale(1.2) rotate(180deg); 
                }
            }

            /* Preview animations */
            @keyframes floatHeartPreview {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(0.5);
                    opacity: 0;
                }
            }

            @keyframes sparklePreview {
                0%, 100% { 
                    opacity: 0; 
                    transform: scale(0.8); 
                }
                50% { 
                    opacity: 1; 
                    transform: scale(1.2); 
                }
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Injected crisp animation styles');
    }

    async initializeManager() {
        try {
            console.log('🔄 Initializing UserDisplayManager...');
            const settings = await this.loadUserDisplay();
            this.currentDisplay = settings;
            this.initialized = true;
            console.log('✅ UserDisplayManager initialized with settings:', settings);
            
            // Apply display immediately if on profile page
            if (this.isProfilePage()) {
                console.log('🎯 Profile page detected, applying display...');
                setTimeout(() => {
                    this.applyDisplayToProfile();
                }, 500);
            }
        } catch (error) {
            console.error('❌ Error initializing UserDisplayManager:', error);
            this.currentDisplay = this.getDefaultSettings();
            this.initialized = true;
        }
    }

    hasCustomDisplaySettings() {
        if (!this.currentDisplay) return false;
        
        const defaultSettings = this.getDefaultSettings();
        const hasCustomWallpaper = this.currentDisplay.wallpaper && 
                                 this.currentDisplay.wallpaper !== defaultSettings.wallpaper;
        const hasCustomAnimation = this.currentDisplay.animation && 
                                 this.currentDisplay.animation !== defaultSettings.animation;
        
        return hasCustomWallpaper || hasCustomAnimation;
    }

    isProfilePage() {
        return window.location.pathname.includes('profile.html') || 
               window.location.pathname.endsWith('profile.html') ||
               document.querySelector('.profile-view-container') !== null ||
               document.querySelector('.profile-details') !== null;
    }

    isAccountPage() {
        return window.location.pathname.includes('account.html') || 
               window.location.pathname.endsWith('account.html') ||
               document.querySelector('.account-settings') !== null;
    }

    async loadUserDisplay() {
        try {
            console.log('🔍 Loading display settings for user:', this.currentUser?.uid);
            
            if (!this.currentUser || !this.currentUser.uid) {
                console.error('❌ No current user found');
                return this.getDefaultSettings();
            }

            const userRef = doc(this.db, 'users', this.currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const displaySettings = userData.displaySettings;
                console.log('📄 User document exists. Display settings:', displaySettings);
                
                if (displaySettings && this.hasValidCustomSettings(displaySettings)) {
                    console.log('✅ Found custom display settings:', displaySettings);
                    return displaySettings;
                } else {
                    console.log('ℹ️ No custom display settings found, using defaults');
                    return this.getDefaultSettings();
                }
            } else {
                console.log('📝 No user document found, using default settings');
                return this.getDefaultSettings();
            }
        } catch (error) {
            console.error('❌ Error loading user display:', error);
            return this.getDefaultSettings();
        }
    }

    hasValidCustomSettings(settings) {
        if (!settings) return false;
        
        const defaultSettings = this.getDefaultSettings();
        const hasValidWallpaper = settings.wallpaper && 
                                settings.wallpaper !== defaultSettings.wallpaper &&
                                this.isValidWallpaper(settings.wallpaper);
        const hasValidAnimation = settings.animation && 
                                settings.animation !== defaultSettings.animation;
        
        return hasValidWallpaper || hasValidAnimation;
    }

    async loadUserDisplayForProfile(userId) {
        try {
            console.log('🔍 Loading display settings for profile user:', userId);
            
            if (!userId) {
                console.error('❌ No user ID provided');
                return this.getDefaultSettings();
            }

            if (userId === this.currentUser?.uid) {
                console.log('👤 Viewing own profile, using current settings');
                return this.currentDisplay || this.getDefaultSettings();
            }

            const userRef = doc(this.db, 'users', userId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const displaySettings = userData.displaySettings;
                
                if (displaySettings && this.hasValidCustomSettings(displaySettings)) {
                    console.log('✅ Found custom profile user display settings:', displaySettings);
                    return displaySettings;
                }
            }
            
            console.log('ℹ️ No custom display settings found for profile user, using defaults');
            return this.getDefaultSettings();
        } catch (error) {
            console.error('❌ Error loading profile user display:', error);
            return this.getDefaultSettings();
        }
    }

    isValidWallpaper(wallpaperId) {
        return AVAILABLE_WALLPAPERS.some(w => w.id === wallpaperId);
    }

    isValidAnimation(animationId) {
        return AVAILABLE_ANIMATIONS.some(a => a.id === animationId);
    }

    getDefaultSettings() {
        return {
            wallpaper: null,
            animation: null,
            customBackground: null
        };
    }

    async saveDisplaySettings(settings) {
        try {
            console.log('💾 Saving display settings:', settings);
            
            if (!this.currentUser || !this.currentUser.uid) {
                console.error('❌ No current user found');
                return false;
            }

            // Clear any pending cleanup
            if (this.cleanupTimeout) {
                clearTimeout(this.cleanupTimeout);
                this.cleanupTimeout = null;
            }

            // IMPORTANT: Clear both wallpaper and animation when switching types
            if (settings.wallpaper && settings.animation) {
                console.log('🔄 Switching from animation to wallpaper (or vice versa)');
                // If setting wallpaper, clear animation and vice versa
                if (settings.wallpaper && this.currentDisplay?.animation) {
                    settings.animation = null;
                } else if (settings.animation && this.currentDisplay?.wallpaper) {
                    settings.wallpaper = null;
                }
            }

            if (settings.wallpaper && !this.isValidWallpaper(settings.wallpaper)) {
                console.warn('⚠️ Invalid wallpaper ID, setting to null:', settings.wallpaper);
                settings.wallpaper = null;
            }

            if (settings.animation && !this.isValidAnimation(settings.animation)) {
                console.warn('⚠️ Invalid animation ID, setting to null:', settings.animation);
                settings.animation = null;
            }

            const userRef = doc(this.db, 'users', this.currentUser.uid);
            
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: this.currentUser.email,
                    createdAt: serverTimestamp(),
                    displaySettings: settings
                });
            } else {
                await updateDoc(userRef, {
                    displaySettings: settings,
                    updatedAt: serverTimestamp()
                });
            }
            
            this.currentDisplay = settings;
            console.log('✅ Display settings saved successfully');
            
            // Apply new settings to profile page if we're on it
            if (this.isProfilePage()) {
                console.log('🎯 Applying new settings to current profile page...');
                setTimeout(() => {
                    this.applyDisplayToProfile();
                }, 100);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error saving display settings:', error);
            return false;
        }
    }

    applyDisplayToProfile() {
        if (this.isApplying) {
            console.log('⚠️ Display application already in progress, skipping...');
            return;
        }
        
        this.isApplying = true;
        console.log('🎨 === APPLYING DISPLAY TO PROFILE ===');
        console.log('Current display settings:', this.currentDisplay);
        
        try {
            // Clear everything first
            this.removeExistingAnimations();

            // Small delay to ensure cleanup is complete
            setTimeout(() => {
                // Apply wallpaper OR animation (not both)
                if (this.currentDisplay?.wallpaper && this.isValidWallpaper(this.currentDisplay.wallpaper)) {
                    console.log('🖼️ Applying custom wallpaper:', this.currentDisplay.wallpaper);
                    this.applyWallpaper(this.currentDisplay.wallpaper);
                } else if (this.currentDisplay?.animation && this.isValidAnimation(this.currentDisplay.animation)) {
                    console.log('✨ Applying custom animation:', this.currentDisplay.animation);
                    this.applyAnimation(this.currentDisplay.animation);
                } else {
                    console.log('🎨 No custom display, using default theme');
                }

                console.log('✅ === DISPLAY APPLY COMPLETE ===');
                this.isApplying = false;
            }, 50);
            
        } catch (error) {
            console.error('❌ Error applying display:', error);
            this.isApplying = false;
        }
    }

    // Enhanced profile card styling with themed effects
    styleProfileCardForWallpaper(wallpaperId) {
        const profileCards = document.querySelectorAll('.profile-card, .profile-container, .user-profile, .profile-view-container, .profile-details');
        const wallpaper = AVAILABLE_WALLPAPERS.find(w => w.id === wallpaperId);
        
        if (!wallpaper) return;

        const theme = wallpaper.theme;
        let cardStyle = '';

        switch(theme) {
            case 'blue':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(100, 150, 255, 0.15), rgba(70, 130, 255, 0.1)) !important;
                    border: 1px solid rgba(100, 150, 255, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(70, 130, 255, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'purple':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(180, 100, 255, 0.15), rgba(150, 70, 255, 0.1)) !important;
                    border: 1px solid rgba(180, 100, 255, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(150, 70, 255, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'green':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(100, 220, 150, 0.15), rgba(70, 200, 120, 0.1)) !important;
                    border: 1px solid rgba(100, 220, 150, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(70, 200, 120, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'orange':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(255, 180, 100, 0.15), rgba(255, 150, 70, 0.1)) !important;
                    border: 1px solid rgba(255, 180, 100, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(255, 150, 70, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'fire':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(255, 100, 50, 0.15), rgba(255, 70, 30, 0.1)) !important;
                    border: 1px solid rgba(255, 100, 50, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(255, 70, 30, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'cosmic':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(100, 70, 255, 0.15), rgba(70, 50, 220, 0.1)) !important;
                    border: 1px solid rgba(100, 70, 255, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(70, 50, 220, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            default:
                cardStyle = `
                    background: rgba(255, 255, 255, 0.12) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
        }

        profileCards.forEach(card => {
            card.style.cssText += `
                ${cardStyle}
                border-radius: 20px !important;
                position: relative !important;
                z-index: 10 !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            `;
        });
    }

    styleProfileCardForAnimation(animationId) {
        const profileCards = document.querySelectorAll('.profile-card, .profile-container, .user-profile, .profile-view-container, .profile-details');
        const animation = AVAILABLE_ANIMATIONS.find(a => a.id === animationId);
        
        if (!animation) return;

        const theme = animation.theme;
        let cardStyle = '';

        switch(theme) {
            case 'fire':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(255, 100, 50, 0.18), rgba(255, 70, 30, 0.12)) !important;
                    border: 1px solid rgba(255, 100, 50, 0.4) !important;
                    box-shadow: 
                        0 8px 32px rgba(255, 70, 30, 0.2),
                        0 0 20px rgba(255, 100, 50, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                `;
                break;
            case 'cosmic':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(100, 70, 255, 0.18), rgba(70, 50, 220, 0.12)) !important;
                    border: 1px solid rgba(100, 70, 255, 0.4) !important;
                    box-shadow: 
                        0 8px 32px rgba(70, 50, 220, 0.2),
                        0 0 20px rgba(100, 70, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                `;
                break;
            case 'romantic':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(255, 105, 180, 0.18), rgba(255, 70, 150, 0.12)) !important;
                    border: 1px solid rgba(255, 105, 180, 0.4) !important;
                    box-shadow: 
                        0 8px 32px rgba(255, 70, 150, 0.2),
                        0 0 20px rgba(255, 105, 180, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                `;
                break;
            case 'neon':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(0, 200, 200, 0.1)) !important;
                    border: 1px solid rgba(0, 255, 255, 0.4) !important;
                    box-shadow: 
                        0 8px 32px rgba(0, 255, 255, 0.2),
                        0 0 20px rgba(0, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                `;
                break;
            case 'starry':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(100, 150, 255, 0.15), rgba(70, 120, 220, 0.1)) !important;
                    border: 1px solid rgba(100, 150, 255, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(70, 120, 220, 0.15),
                        0 0 15px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'magic':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 200, 0, 0.1)) !important;
                    border: 1px solid rgba(255, 215, 0, 0.4) !important;
                    box-shadow: 
                        0 8px 32px rgba(255, 215, 0, 0.2),
                        0 0 20px rgba(255, 215, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                `;
                break;
            case 'gold':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.18), rgba(218, 165, 32, 0.12)) !important;
                    border: 1px solid rgba(255, 215, 0, 0.4) !important;
                    box-shadow: 
                        0 8px 32px rgba(218, 165, 32, 0.2),
                        0 0 20px rgba(255, 215, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                `;
                break;
            case 'aurora':
                cardStyle = `
                    background: linear-gradient(135deg, 
                        rgba(100, 255, 200, 0.12),
                        rgba(100, 200, 255, 0.1),
                        rgba(200, 100, 255, 0.08)
                    ) !important;
                    border: 1px solid rgba(100, 255, 200, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(100, 200, 255, 0.15),
                        0 0 15px rgba(200, 100, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'matrix':
                cardStyle = `
                    background: linear-gradient(135deg, rgba(0, 255, 0, 0.12), rgba(0, 200, 0, 0.08)) !important;
                    border: 1px solid rgba(0, 255, 0, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(0, 255, 0, 0.15),
                        0 0 10px rgba(0, 255, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            case 'energy':
                cardStyle = `
                    background: linear-gradient(135deg, 
                        rgba(255, 100, 100, 0.12),
                        rgba(100, 255, 100, 0.1),
                        rgba(100, 100, 255, 0.08)
                    ) !important;
                    border: 1px solid rgba(255, 100, 100, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(100, 255, 100, 0.15),
                        0 0 15px rgba(100, 100, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
                break;
            default:
                cardStyle = `
                    background: rgba(255, 255, 255, 0.15) !important;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                `;
        }

        profileCards.forEach(card => {
            card.style.cssText += `
                ${cardStyle}
                border-radius: 20px !important;
                position: relative !important;
                z-index: 10 !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            `;
        });
    }

    // Preview function for account page - ONLY in preview container
    previewDisplay(settings, previewContainerId = 'displayPreview') {
        console.log('👀 Previewing display settings:', settings);
        
        const previewContainer = document.getElementById(previewContainerId);
        if (!previewContainer) {
            console.error('❌ Preview container not found:', previewContainerId);
            return;
        }
        
        // Clear only the preview container, not the entire page
        this.clearPreviewContainer(previewContainerId);
        
        // Small delay to ensure cleanup is complete
        setTimeout(() => {
            if (settings.wallpaper && this.isValidWallpaper(settings.wallpaper)) {
                console.log('🖼️ Previewing wallpaper:', settings.wallpaper);
                this.applyWallpaperPreview(settings.wallpaper, previewContainerId);
            } else if (settings.animation && this.isValidAnimation(settings.animation)) {
                console.log('✨ Previewing animation:', settings.animation);
                this.applyAnimationPreview(settings.animation, previewContainerId);
            } else {
                console.log('🎨 No display settings to preview');
                this.showNoSelectionMessage(previewContainerId);
            }
        }, 50);
    }

    clearPreviewContainer(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            // Remove only preview-specific elements
            const previewElements = container.querySelectorAll('.preview-wallpaper, .preview-animation, .no-selection');
            previewElements.forEach(element => {
                if (element.parentNode) {
                    element.remove();
                }
            });
            
            // Clear any animation classes and styles
            container.className = 'preview-container';
            container.style.backgroundImage = 'none';
            container.style.backgroundColor = '';
            container.style.backgroundSize = '';
            container.style.backgroundPosition = '';
        }
    }

    applyWallpaperPreview(wallpaperId, containerId) {
        console.log('🎨 Applying wallpaper preview:', wallpaperId);
        const wallpaper = AVAILABLE_WALLPAPERS.find(w => w.id === wallpaperId);
        if (!wallpaper) {
            console.error('❌ Wallpaper not found:', wallpaperId);
            return;
        }

        const container = document.getElementById(containerId);
        if (container) {
            container.style.backgroundImage = `url('${wallpaper.url}')`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
            container.style.backgroundColor = 'transparent';
            
            // Add fade-in effect
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.3s ease-in-out';
            setTimeout(() => {
                container.style.opacity = '1';
            }, 10);
        }
    }

    applyAnimationPreview(animationId, containerId) {
        console.log('✨ Applying animation preview:', animationId);
        const animation = AVAILABLE_ANIMATIONS.find(a => a.id === animationId);
        if (!animation) {
            console.error('❌ Animation not found:', animationId);
            return;
        }

        const container = document.getElementById(containerId);
        if (container) {
            // Add animation-specific class for preview styling
            container.classList.add(`${animationId}-preview`);
            
            // Add fade-in effect
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.3s ease-in-out';
            setTimeout(() => {
                container.style.opacity = '1';
            }, 10);
            
            // For some animations, we might want to add additional preview elements
            this.createAnimationPreviewElements(animationId, container);
        }
    }

    createAnimationPreviewElements(animationId, container) {
        // Add simple preview elements for animations
        switch(animationId) {
            case 'floating_hearts':
                this.addFloatingHeartsPreview(container);
                break;
            case 'magic_sparkles':
                this.addMagicSparklesPreview(container);
                break;
            // Add more animation previews as needed
        }
    }

    addFloatingHeartsPreview(container) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💖';
                heart.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    left: ${20 + i * 30}%;
                    top: 80%;
                    animation: floatHeartPreview 3s ease-in forwards;
                    pointer-events: none;
                `;
                container.appendChild(heart);

                setTimeout(() => {
                    if (heart.parentNode) heart.remove();
                }, 3000);
            }, i * 500);
        }
    }

    addMagicSparklesPreview(container) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.cssText = `
                    position: absolute;
                    font-size: 16px;
                    left: ${10 + i * 20}%;
                    top: ${20 + i * 15}%;
                    animation: sparklePreview 2s ease-in-out infinite;
                    pointer-events: none;
                `;
                container.appendChild(sparkle);
            }, i * 400);
        }
    }

    showNoSelectionMessage(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const message = document.createElement('div');
            message.className = 'no-selection';
            message.textContent = 'Select a wallpaper or animation to see preview';
            container.appendChild(message);
            
            // Add fade-in effect
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.3s ease-in-out';
            setTimeout(() => {
                message.style.opacity = '1';
            }, 10);
        }
    }

    async applyDisplayToUserProfile(userId) {
        if (this.isApplying) {
            console.log('⚠️ Display application already in progress, skipping...');
            return;
        }
        
        this.isApplying = true;
        console.log('🎨 === APPLYING DISPLAY TO USER PROFILE ===', userId);
        
        try {
            const profileSettings = await this.loadUserDisplayForProfile(userId);
            console.log('📋 Profile user settings:', profileSettings);

            // Clear everything first
            this.removeExistingAnimations();

            // Apply after cleanup
            setTimeout(() => {
                // Apply wallpaper OR animation (not both)
                if (profileSettings.wallpaper && this.isValidWallpaper(profileSettings.wallpaper)) {
                    console.log('🖼️ Applying profile wallpaper:', profileSettings.wallpaper);
                    this.applyWallpaper(profileSettings.wallpaper);
                } else if (profileSettings.animation && this.isValidAnimation(profileSettings.animation)) {
                    console.log('✨ Applying profile animation:', profileSettings.animation);
                    this.applyAnimation(profileSettings.animation);
                } else {
                    console.log('🎨 No custom display for profile user');
                }

                console.log('✅ === USER PROFILE DISPLAY APPLY COMPLETE ===');
                this.isApplying = false;
            }, 50);
            
        } catch (error) {
            console.error('❌ Error applying user profile display:', error);
            this.isApplying = false;
        }
    }

    applyWallpaper(wallpaperId) {
        console.log('🎨 Applying wallpaper:', wallpaperId);
        const wallpaper = AVAILABLE_WALLPAPERS.find(w => w.id === wallpaperId);
        if (!wallpaper) {
            console.error('❌ Wallpaper not found:', wallpaperId);
            return;
        }

        const wallpaperElement = document.createElement('div');
        wallpaperElement.id = 'profile-wallpaper';
        wallpaperElement.className = 'user-display-wallpaper';
        wallpaperElement.setAttribute('data-wallpaper-id', wallpaperId);
        wallpaperElement.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background-image: url('${wallpaper.url}') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            z-index: -10000 !important;
            opacity: 0.9 !important;
            pointer-events: none !important;
        `;

        if (document.body) {
            document.body.appendChild(wallpaperElement);
            console.log('✅ Wallpaper applied:', wallpaper.name);
            
            // Add themed profile card styling
            this.styleProfileCardForWallpaper(wallpaperId);
        }
    }

    applyAnimation(animationId) {
        console.log('✨ Applying animation:', animationId);
        const animation = AVAILABLE_ANIMATIONS.find(a => a.id === animationId);
        if (!animation) {
            console.error('❌ Animation not found:', animationId);
            return;
        }

        const animationContainer = document.createElement('div');
        animationContainer.id = 'profile-animation';
        animationContainer.className = 'user-display-animation';
        animationContainer.setAttribute('data-animation-id', animationId);
        // FIXED: Remove blur and ensure crisp rendering
        animationContainer.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            pointer-events: none !important;
            z-index: -9999 !important;
            overflow: hidden !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            filter: none !important;
            transform: translate3d(0, 0, 0) !important;
        `;

        if (document.body) {
            document.body.appendChild(animationContainer);
            
            try {
                this.createSpecificAnimation(animationId, animationContainer);
                console.log('✅ Animation applied:', animation.name);
                
                // Add themed profile card styling for animations
                this.styleProfileCardForAnimation(animationId);
            } catch (error) {
                console.error('❌ Error creating animation:', error);
                if (animationContainer.parentNode) {
                    animationContainer.remove();
                }
            }
        }
    }

    createSpecificAnimation(animationId, container) {
        console.log('🎬 Creating specific animation:', animationId);
        
        if (!this.activeAnimations) {
            this.activeAnimations = new Map();
        }
        
        let stopAnimation = () => {};
        
        switch(animationId) {
            case 'fire_glow':
                stopAnimation = this.createFireGlowAnimation(container);
                break;
            case 'cosmic_energy':
                stopAnimation = this.createCosmicEnergyAnimation(container);
                break;
            case 'floating_hearts':
                stopAnimation = this.createFloatingHeartsAnimation(container);
                break;
            case 'neon_pulse':
                stopAnimation = this.createNeonPulseAnimation(container);
                break;
            case 'starry_night':
                stopAnimation = this.createStarryNightAnimation(container);
                break;
            case 'magic_sparkles':
                stopAnimation = this.createMagicSparklesAnimation(container);
                break;
            case 'liquid_gold':
                stopAnimation = this.createLiquidGoldAnimation(container);
                break;
            case 'northern_lights':
                stopAnimation = this.createNorthernLightsAnimation(container);
                break;
            case 'digital_matrix':
                stopAnimation = this.createDigitalMatrixAnimation(container);
                break;
            case 'energy_field':
                stopAnimation = this.createEnergyFieldAnimation(container);
                break;
            default:
                console.warn('⚠️ Unknown animation:', animationId);
        }
        
        this.activeAnimations.set(animationId, { container, stopAnimation });
    }

    createFireGlowAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            // Set high resolution for crisp rendering
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            // FIXED: Force crisp canvas rendering
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
                image-rendering: pixelated;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            // Force high quality rendering
            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.oImageSmoothingEnabled = false;
            
            const particles = [];
            const particleCount = 150;
            let animationId;

            // Scale for high DPI
            ctx.scale(pixelRatio, pixelRatio);

            // Create fire particles
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * (container.clientWidth || window.innerWidth),
                    y: (container.clientHeight || window.innerHeight) + Math.random() * 100,
                    size: 10 + Math.random() * 20,
                    speed: 1 + Math.random() * 3,
                    sway: Math.random() * 2 - 1,
                    hue: 15 + Math.random() * 20,
                    alpha: 0.3 + Math.random() * 0.4
                });
            }

            function animate() {
                if (!canvas.parentNode) return;
                
                const width = container.clientWidth || window.innerWidth;
                const height = container.clientHeight || window.innerHeight;
                
                // Create fiery gradient background - CLEAR without blur
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, 'rgba(255, 50, 0, 0.3)');
                gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
                gradient.addColorStop(1, 'rgba(255, 150, 0, 0.1)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.y -= particle.speed;
                    particle.x += particle.sway * 0.5;
                    particle.alpha *= 0.99;
                    
                    if (particle.y < -50 || particle.alpha < 0.05) {
                        particle.y = height + Math.random() * 100;
                        particle.x = Math.random() * width;
                        particle.alpha = 0.3 + Math.random() * 0.4;
                    }
                    
                    const gradient = ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size
                    );
                    gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${particle.alpha})`);
                    gradient.addColorStop(1, `hsla(${particle.hue + 10}, 100%, 40%, 0)`);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        } catch (error) {
            console.error('❌ Error in fire glow animation:', error);
            return () => {};
        }
    }

    createCosmicEnergyAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.scale(pixelRatio, pixelRatio);
            
            let time = 0;
            let animationId;

            function animate() {
                if (!canvas.parentNode) return;
                
                const width = container.clientWidth || window.innerWidth;
                const height = container.clientHeight || window.innerHeight;
                
                time += 0.02;
                
                // Cosmic background - CLEAR without blur
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, 'rgba(10, 0, 30, 0.9)');
                gradient.addColorStop(1, 'rgba(30, 0, 50, 0.9)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                
                // Pulsing energy waves
                for (let i = 0; i < 5; i++) {
                    const pulse = (Math.sin(time + i) + 1) * 0.5;
                    const radius = (width / 3) * pulse;
                    
                    const gradient = ctx.createRadialGradient(
                        width / 2, height / 2, 0,
                        width / 2, height / 2, radius
                    );
                    gradient.addColorStop(0, `hsla(${200 + i * 30}, 100%, 60%, ${0.3 * pulse})`);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Energy particles
                for (let i = 0; i < 50; i++) {
                    const angle = time * 0.5 + i * 0.1;
                    const distance = 50 + Math.sin(time + i) * 30;
                    const x = width / 2 + Math.cos(angle) * distance;
                    const y = height / 2 + Math.sin(angle) * distance;
                    
                    ctx.fillStyle = `hsla(${240 + Math.sin(time + i) * 60}, 100%, 70%, 0.8)`;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        } catch (error) {
            console.error('❌ Error in cosmic energy animation:', error);
            return () => {};
        }
    }

    createFloatingHeartsAnimation(container) {
        try {
            const hearts = [];
            const heartCount = 20;
            let intervalId;

            function createHeart() {
                const heart = document.createElement('div');
                heart.innerHTML = '💖';
                const translateX = (Math.random() * 100 - 50);
                const rotate = Math.random() * 360;
                
                heart.style.cssText = `
                    position: absolute;
                    font-size: ${20 + Math.random() * 25}px;
                    left: ${Math.random() * 100}%;
                    top: 110%;
                    opacity: ${0.3 + Math.random() * 0.6};
                    animation: floatHeartUp ${8 + Math.random() * 8}s linear forwards;
                    pointer-events: none;
                    z-index: 1;
                    filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
                    --heart-translate-x: ${translateX}px;
                    --heart-rotate: ${rotate}deg;
                `;

                container.appendChild(heart);
                hearts.push(heart);

                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                        hearts.splice(hearts.indexOf(heart), 1);
                    }
                }, 16000);
            }

            // Create initial hearts
            for (let i = 0; i < heartCount; i++) {
                setTimeout(createHeart, i * 300);
            }

            // Continue creating hearts
            intervalId = setInterval(createHeart, 500);
            
            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Remove all hearts
                hearts.forEach(heart => {
                    if (heart.parentNode) heart.remove();
                });
                hearts.length = 0;
            };
        } catch (error) {
            console.error('❌ Error in floating hearts animation:', error);
            return () => {};
        }
    }

    createNeonPulseAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.scale(pixelRatio, pixelRatio);
            
            let time = 0;
            let animationId;

            function animate() {
                if (!canvas.parentNode) return;
                
                const width = container.clientWidth || window.innerWidth;
                const height = container.clientHeight || window.innerHeight;
                
                time += 0.03;
                
                // Dark background
                ctx.fillStyle = 'rgba(0, 0, 10, 0.9)';
                ctx.fillRect(0, 0, width, height);
                
                // Neon grid
                const gridSize = 50;
                const pulse = (Math.sin(time) + 1) * 0.5;
                
                for (let x = 0; x < width; x += gridSize) {
                    for (let y = 0; y < height; y += gridSize) {
                        const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
                        const intensity = (Math.sin(time + dist * 0.01) + 1) * 0.5;
                        
                        ctx.strokeStyle = `hsla(${200 + intensity * 160}, 100%, 60%, ${0.3 + intensity * 0.4})`;
                        ctx.lineWidth = 1 + intensity * 2;
                        ctx.beginPath();
                        ctx.arc(x, y, 5 + intensity * 10, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
                
                // Pulsing center
                const centerGradient = ctx.createRadialGradient(
                    width/2, height/2, 0,
                    width/2, height/2, 200
                );
                centerGradient.addColorStop(0, `hsla(${300 + Math.sin(time) * 60}, 100%, 70%, ${0.3 * pulse})`);
                centerGradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = centerGradient;
                ctx.beginPath();
                ctx.arc(width/2, height/2, 200, 0, Math.PI * 2);
                ctx.fill();
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        } catch (error) {
            console.error('❌ Error in neon pulse animation:', error);
            return () => {};
        }
    }

    createStarryNightAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.scale(pixelRatio, pixelRatio);
            
            const stars = [];
            const starCount = 200;
            let animationId;

            // Create stars
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * (container.clientWidth || window.innerWidth),
                    y: Math.random() * (container.clientHeight || window.innerHeight),
                    size: Math.random() * 2,
                    brightness: Math.random() * 0.8 + 0.2,
                    speed: 0.1 + Math.random() * 0.3,
                    twinkleSpeed: Math.random() * 0.05
                });
            }

            let time = 0;

            function animate() {
                if (!canvas.parentNode) return;
                
                const width = container.clientWidth || window.innerWidth;
                const height = container.clientHeight || window.innerHeight;
                
                time += 0.016;
                
                // Dark blue background
                ctx.fillStyle = 'rgba(5, 5, 20, 0.95)';
                ctx.fillRect(0, 0, width, height);
                
                // Draw stars
                stars.forEach(star => {
                    const twinkle = (Math.sin(time * star.twinkleSpeed) + 1) * 0.5;
                    const currentBrightness = star.brightness * (0.5 + twinkle * 0.5);
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${currentBrightness})`;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Shooting stars occasionally
                    if (Math.random() < 0.0005) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${currentBrightness})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(star.x - 50, star.y + 20);
                        ctx.stroke();
                    }
                });
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        } catch (error) {
            console.error('❌ Error in starry night animation:', error);
            return () => {};
        }
    }

    createMagicSparklesAnimation(container) {
        try {
            const sparkles = [];
            const sparkleCount = 30;
            let intervalId;

            function createSparkle() {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.cssText = `
                    position: absolute;
                    font-size: ${15 + Math.random() * 20}px;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    opacity: 0;
                    animation: sparkleTwinkle ${2 + Math.random() * 3}s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 1;
                    filter: drop-shadow(0 0 8px gold);
                `;

                container.appendChild(sparkle);
                sparkles.push(sparkle);

                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.remove();
                        sparkles.splice(sparkles.indexOf(sparkle), 1);
                    }
                }, 5000);
            }

            // Create initial sparkles
            for (let i = 0; i < sparkleCount; i++) {
                setTimeout(createSparkle, i * 200);
            }

            // Continue creating sparkles
            intervalId = setInterval(createSparkle, 300);
            
            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Remove all sparkles
                sparkles.forEach(sparkle => {
                    if (sparkle.parentNode) sparkle.remove();
                });
                sparkles.length = 0;
            };
        } catch (error) {
            console.error('❌ Error in magic sparkles animation:', error);
            return () => {};
        }
    }

    createLiquidGoldAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.scale(pixelRatio, pixelRatio);
            
            let time = 0;
            let animationId;

            function animate() {
                if (!canvas.parentNode) return;
                
                const width = container.clientWidth || window.innerWidth;
                const height = container.clientHeight || window.innerHeight;
                
                time += 0.02;
                
                // Golden background
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, 'rgba(50, 30, 0, 0.3)');
                gradient.addColorStop(0.5, 'rgba(100, 70, 0, 0.2)');
                gradient.addColorStop(1, 'rgba(150, 100, 0, 0.3)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                
                // Liquid gold waves
                for (let i = 0; i < 3; i++) {
                    const waveGradient = ctx.createLinearGradient(0, 0, 0, height);
                    waveGradient.addColorStop(0, `hsla(${45 + i * 5}, 100%, 50%, 0.3)`);
                    waveGradient.addColorStop(0.5, `hsla(${50 + i * 5}, 100%, 60%, 0.4)`);
                    waveGradient.addColorStop(1, `hsla(${55 + i * 5}, 100%, 40%, 0.2)`);
                    
                    ctx.fillStyle = waveGradient;
                    ctx.beginPath();
                    
                    const baseY = 100 + i * 80;
                    const amplitude = 30 + Math.sin(time + i) * 20;
                    
                    ctx.moveTo(0, baseY + Math.sin(time + i) * amplitude);
                    
                    for (let x = 0; x < width; x += 5) {
                        const y = baseY + 
                                 Math.sin(x * 0.01 + time + i) * amplitude +
                                 Math.cos(x * 0.008 + time * 1.3 + i) * amplitude * 0.7;
                        ctx.lineTo(x, y);
                    }
                    
                    ctx.lineTo(width, height);
                    ctx.lineTo(0, height);
                    ctx.closePath();
                    ctx.fill();
                }
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        } catch (error) {
            console.error('❌ Error in liquid gold animation:', error);
            return () => {};
        }
    }

    createNorthernLightsAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.scale(pixelRatio, pixelRatio);
            
            let time = 0;
            let animationId;

            function animate() {
                if (!canvas.parentNode) return;
                
                const width = container.clientWidth || window.innerWidth;
                const height = container.clientHeight || window.innerHeight;
                
                time += 0.005;
                
                // Dark background
                ctx.fillStyle = 'rgba(5, 10, 20, 0.9)';
                ctx.fillRect(0, 0, width, height);
                
                // Aurora layers
                for (let i = 0; i < 4; i++) {
                    const gradient = ctx.createLinearGradient(0, 0, 0, height);
                    const hue = 160 + i * 20 + Math.sin(time + i) * 30;
                    
                    gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
                    gradient.addColorStop(0.3, `hsla(${hue}, 90%, 70%, 0.3)`);
                    gradient.addColorStop(0.7, `hsla(${hue + 10}, 100%, 60%, 0.2)`);
                    gradient.addColorStop(1, `hsla(${hue + 20}, 80%, 50%, 0)`);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    
                    const baseY = 80 + i * 40;
                    const amplitude = 40 + Math.sin(time * 0.5 + i) * 30;
                    
                    ctx.moveTo(0, baseY + Math.sin(time + i) * amplitude);
                    
                    for (let x = 0; x < width; x += 5) {
                        const y = baseY + 
                                 Math.sin(x * 0.008 + time + i) * amplitude +
                                 Math.cos(x * 0.006 + time * 1.5 + i) * amplitude * 0.8;
                        ctx.lineTo(x, y);
                    }
                    
                    ctx.lineTo(width, height);
                    ctx.lineTo(0, height);
                    ctx.closePath();
                    ctx.fill();
                }
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        } catch (error) {
            console.error('❌ Error in northern lights animation:', error);
            return () => {};
        }
    }

    createDigitalMatrixAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.scale(pixelRatio, pixelRatio);
            
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            const columns = Math.floor(width / 20);
            const drops = Array(columns).fill(1);
            let intervalId;

            function draw() {
                if (!canvas.parentNode) return;
                
                // Semi-transparent black for trail effect
                ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
                ctx.fillRect(0, 0, width, height);
                
                ctx.fillStyle = '#0f0';
                ctx.font = '15px monospace';
                
                drops.forEach((y, index) => {
                    const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                    const x = index * 20;
                    
                    ctx.fillText(text, x, y * 20);
                    
                    if (y * 20 > height && Math.random() > 0.975) {
                        drops[index] = 0;
                    }
                    
                    drops[index]++;
                });
            }

            intervalId = setInterval(draw, 50);
            
            return () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };
        } catch (error) {
            console.error('❌ Error in digital matrix animation:', error);
            return () => {};
        }
    }

    createEnergyFieldAnimation(container) {
        try {
            const canvas = document.createElement('canvas');
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = (container.clientWidth || window.innerWidth) * pixelRatio;
            canvas.height = (container.clientHeight || window.innerHeight) * pixelRatio;
            
            canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            `;
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.scale(pixelRatio, pixelRatio);
            
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            const orbs = [];
            let time = 0;
            let animationId;

            for (let i = 0; i < 4; i++) {
                orbs.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: 40 + Math.random() * 60,
                    speed: 0.3 + Math.random() * 0.4,
                    hue: Math.random() * 360
                });
            }

            function animate() {
                if (!canvas.parentNode) return;
                
                time += 0.02;
                
                // Energy field background
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, 'rgba(0, 20, 40, 0.8)');
                gradient.addColorStop(1, 'rgba(20, 0, 40, 0.8)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                
                orbs.forEach(orb => {
                    orb.x += Math.cos(time * orb.speed) * 1.5;
                    orb.y += Math.sin(time * orb.speed) * 1.5;
                    
                    if (orb.x < 0) orb.x = width;
                    if (orb.x > width) orb.x = 0;
                    if (orb.y < 0) orb.y = height;
                    if (orb.y > height) orb.y = 0;
                    
                    const pulse = Math.sin(time * 2) * 0.2 + 0.8;
                    const currentRadius = orb.radius * pulse;
                    
                    const gradient = ctx.createRadialGradient(
                        orb.x, orb.y, 0,
                        orb.x, orb.y, currentRadius
                    );
                    gradient.addColorStop(0, `hsla(${orb.hue}, 100%, 70%, 0.8)`);
                    gradient.addColorStop(0.7, `hsla(${orb.hue}, 100%, 60%, 0.3)`);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
            
            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            };
        } catch (error) {
            console.error('❌ Error in energy field animation:', error);
            return () => {};
        }
    }

    removeExistingAnimations() {
        console.log('🗑️ Removing all existing display elements...');
        
        // Stop all running animations first
        if (this.activeAnimations) {
            this.activeAnimations.forEach(({ stopAnimation }) => {
                if (typeof stopAnimation === 'function') {
                    stopAnimation();
                }
            });
            this.activeAnimations.clear();
        }
        
        const elementsToRemove = [
            'profile-animation',
            'profile-wallpaper',
            'custom-background',
            'user-display-wallpaper',
            'user-display-animation'
        ];
        
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
                console.log(`🗑️ Removed by ID: ${id}`);
            }
        });
        
        const classSelectors = ['.user-display-wallpaper', '.user-display-animation', '[data-wallpaper-id]', '[data-animation-id]'];
        classSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.parentNode) {
                    element.remove();
                    console.log(`🗑️ Removed by selector: ${selector}`);
                }
            });
        });
        
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            if (canvas.parentNode && (canvas.style.position === 'fixed' || canvas.style.position === 'absolute')) {
                canvas.remove();
                console.log('🗑️ Removed animation canvas');
            }
        });
        
        // Reset profile card styling
        const profileCards = document.querySelectorAll('.profile-card, .profile-container, .user-profile, .profile-view-container, .profile-details');
        profileCards.forEach(card => {
            card.style.cssText += `
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
            `;
        });
        
        console.log('✅ Cleanup complete');
    }

    getAvailableWallpapers() {
        return AVAILABLE_WALLPAPERS;
    }

    getAvailableAnimations() {
        return AVAILABLE_ANIMATIONS;
    }
}

// Global user display manager instance
let userDisplayManager = null;

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('UserDisplay: DOM loaded, initializing...');
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('UserDisplay: User authenticated', user.uid);
            userDisplayManager = new UserDisplayManager(db, user);
            window.userDisplayManager = userDisplayManager;
            
            // Apply display based on current page
            setTimeout(() => {
                if (window.location.pathname.includes('profile.html') || 
                    document.querySelector('.profile-view-container')) {
                    console.log('UserDisplay: Profile page detected');
                    
                    const urlParams = new URLSearchParams(window.location.search);
                    const profileUserId = urlParams.get('id');
                    
                    if (profileUserId && profileUserId !== user.uid) {
                        console.log('👥 Viewing other user profile:', profileUserId);
                        userDisplayManager.applyDisplayToUserProfile(profileUserId);
                    } else {
                        console.log('👤 Viewing own profile');
                        userDisplayManager.applyDisplayToProfile();
                    }
                }
            }, 1000);
        } else {
            console.log('UserDisplay: No user authenticated');
            userDisplayManager = null;
        }
    });
});

// Export for use in other modules
export { UserDisplayManager, userDisplayManager, AVAILABLE_WALLPAPERS, AVAILABLE_ANIMATIONS };

// Global function for manual triggering
window.applyUserDisplay = function() {
    if (window.userDisplayManager) {
        console.log('🌍 GLOBAL: Manual display application triggered');
        window.userDisplayManager.applyDisplayToProfile();
    } else {
        console.log('🌍 GLOBAL: userDisplayManager not available');
    }
};

// Global function to apply display for specific user
window.applyDisplayForUser = function(userId) {
    if (window.userDisplayManager) {
        console.log('🌍 GLOBAL: Applying display for user:', userId);
        window.userDisplayManager.applyDisplayToUserProfile(userId);
    } else {
        console.log('🌍 GLOBAL: userDisplayManager not available');
    }
};

// Global function for previewing display in account page
window.previewUserDisplay = function(settings, containerId = 'displayPreview') {
    if (window.userDisplayManager) {
        console.log('🌍 GLOBAL: Previewing display settings in container:', containerId);
        window.userDisplayManager.previewDisplay(settings, containerId);
    } else {
        console.log('🌍 GLOBAL: userDisplayManager not available for preview');
    }
};