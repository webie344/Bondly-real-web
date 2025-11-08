// events.js - Universal button event handler
class ButtonEventsManager {
    constructor() {
        this.initialized = false;
        this.eventListeners = new Map();
        this.userReady = false;
        this.init();
    }

    async init() {
        if (this.initialized) return;
        
        // Wait for both DOM and user authentication
        await this.waitForUserAuth();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAllEventListeners());
        } else {
            this.setupAllEventListeners();
        }
        
        this.initialized = true;
    }

    async waitForUserAuth() {
        return new Promise((resolve) => {
            const checkUser = () => {
                if (window.currentUser && window.currentUser.uid) {
                    this.userReady = true;
                    resolve();
                } else if (window.auth) {
                    // Listen for auth state changes
                    window.auth.onAuthStateChanged((user) => {
                        if (user) {
                            this.userReady = true;
                            resolve();
                        }
                    });
                    
                    // Timeout fallback
                    setTimeout(() => {
                        if (!this.userReady) {
                            resolve(); // Continue anyway
                        }
                    }, 5000);
                } else {
                    // If no auth found, continue after short delay
                    setTimeout(() => {
                        resolve();
                    }, 2000);
                }
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkUser);
            } else {
                checkUser();
            }
        });
    }

    setupAllEventListeners() {
        this.setupProfileButtons();
        this.setupNavigationButtons();
        this.setupActionButtons();
        this.setupGlobalClickHandler();
        
        // Retry for dynamically loaded elements
        setTimeout(() => this.setupAllEventListeners(), 1000);
        setTimeout(() => this.setupAllEventListeners(), 3000);
    }

    setupProfileButtons() {
        const profileButtons = {
            'backToMingle': this.handleBackToMingle,
            'messageProfileBtn': this.handleMessageProfile,
            'likeProfileBtn': this.handleLikeProfile
        };

        Object.entries(profileButtons).forEach(([id, handler]) => {
            this.setupButton(id, handler.bind(this));
        });
    }

    setupNavigationButtons() {
        const navButtons = {
            'logoutBtn': this.handleLogout,
            'dashboardBtn': this.handleDashboard
        };

        Object.entries(navButtons).forEach(([id, handler]) => {
            this.setupButton(id, handler.bind(this));
        });
    }

    setupActionButtons() {
        // Add other action buttons as needed
        const actionButtons = {
            // Add more button IDs and handlers here
        };

        Object.entries(actionButtons).forEach(([id, handler]) => {
            this.setupButton(id, handler.bind(this));
        });
    }

    setupButton(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (!button) {
            return;
        }

        // Remove any existing listeners to prevent duplicates
        this.removeButtonListener(buttonId);

        // Add new listener
        const listener = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            handler(e, button);
        };

        button.addEventListener('click', listener);
        this.eventListeners.set(buttonId, { button, listener });
    }

    removeButtonListener(buttonId) {
        const existing = this.eventListeners.get(buttonId);
        if (existing) {
            existing.button.removeEventListener('click', existing.listener);
            this.eventListeners.delete(buttonId);
        }
    }

    setupGlobalClickHandler() {
        // Global fallback handler for any missed buttons
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const buttonId = button.id;
            if (!buttonId) return;

            // Handle buttons that might have been missed
            switch(buttonId) {
                case 'backToMingle':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleBackToMingle(e, button);
                    break;
                case 'messageProfileBtn':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleMessageProfile(e, button);
                    break;
                case 'likeProfileBtn':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleLikeProfile(e, button);
                    break;
                case 'logoutBtn':
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleLogout(e, button);
                    break;
            }
        }, true);
    }

    // Button Handlers
    handleBackToMingle(e, button) {
        window.location.href = 'mingle.html';
    }

    handleMessageProfile(e, button) {
        const urlParams = new URLSearchParams(window.location.search);
        const profileId = urlParams.get('id');
        
        if (profileId) {
            window.location.href = `chat.html?id=${profileId}`;
        } else {
            this.showNotification('Cannot message this profile', 'error');
        }
    }

    async handleLikeProfile(e, button) {
        // Get profile ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const profileId = urlParams.get('id');
        
        if (!profileId) {
            this.showNotification('Cannot like this profile', 'error');
            return;
        }

        // Check if user is logged in
        if (!window.currentUser) {
            this.showNotification('Please log in to like profiles', 'error');
            return;
        }

        try {
            // Show loading state
            this.setButtonLoading(button, true);

            // Use app.js functionality if available, otherwise use fallback
            if (typeof window.handleLikeProfile === 'function') {
                await window.handleLikeProfile(button);
            } else {
                await this.handleLikeProfileFallback(profileId, button);
            }

        } catch (error) {
            this.showNotification('Error liking profile', 'error');
            this.setButtonLoading(button, false);
        }
    }

    async handleLikeProfileFallback(profileId, button) {
        try {
            const { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const db = window.db;
            if (!db) {
                throw new Error('Database not available');
            }

            // Check if already liked
            const likedRef = collection(db, 'users', window.currentUser.uid, 'liked');
            const likedQuery = query(likedRef, where('userId', '==', profileId));
            const likedSnap = await getDocs(likedQuery);
            
            if (!likedSnap.empty) {
                this.showNotification('You already liked this profile!', 'info');
                this.setButtonLiked(button);
                return;
            }

            // Add to liked profiles
            await addDoc(collection(db, 'users', window.currentUser.uid, 'liked'), {
                userId: profileId,
                timestamp: serverTimestamp(),
                likedAt: new Date().toISOString()
            });
            
            // Increment like count for the profile
            const profileRef = doc(db, 'users', profileId);
            const profileSnap = await getDoc(profileRef);
            
            if (profileSnap.exists()) {
                const currentLikes = profileSnap.data().likes || 0;
                await updateDoc(profileRef, {
                    likes: currentLikes + 1,
                    updatedAt: serverTimestamp()
                });
                
                // Update the displayed like count
                const likeCountElement = document.getElementById('viewLikeCount');
                if (likeCountElement) {
                    likeCountElement.textContent = currentLikes + 1;
                }
            }
            
            // Update button state
            this.setButtonLiked(button);
            this.showNotification('Profile liked successfully!', 'success');
            
        } catch (error) {
            throw error;
        }
    }

    handleLogout(e, button) {
        if (typeof window.handleLogout === 'function') {
            window.handleLogout();
        } else {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'login.html';
            }
        }
    }

    handleDashboard(e, button) {
        window.location.href = 'dashboard.html';
    }

    // Utility Methods
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
        } else {
            button.innerHTML = '<i class="fas fa-heart"></i> Like';
            button.disabled = false;
        }
    }

    setButtonLiked(button) {
        button.innerHTML = '<i class="fas fa-heart"></i> Liked';
        button.classList.add('liked');
        button.disabled = true;
    }

    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Cleanup method
    destroy() {
        this.eventListeners.forEach(({ button, listener }, buttonId) => {
            button.removeEventListener('click', listener);
        });
        this.eventListeners.clear();
        this.initialized = false;
    }
}

// Initialize the event manager
const buttonEventsManager = new ButtonEventsManager();

// Make it globally available
window.buttonEventsManager = buttonEventsManager;

// Export for module usage
export default buttonEventsManager;