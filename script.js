// Curupira: o Guardião da Floresta Sangrenta - Main JavaScript

// Wait for DOM to load completely
document.addEventListener('DOMContentLoaded', function() {
    console.log('Curupira site loaded... beware');
    
    // Global Variables
    const state = {
        soundEnabled: false,
        currentTheme: 'dark',
        galleryIndex: 0,
        activeTab: 'images',
        jumpscareTimeout: null,
        jumpscareChance: 0.03, // 3% chance per action
        lastInteraction: Date.now()
    };
    
    // DOM Elements
    const loadingScreen = document.getElementById('loading-screen');
    const customCursor = document.getElementById('custom-cursor');
    const cursorTrail = document.getElementById('cursor-trail');
    const soundToggle = document.getElementById('toggle-sound');
    const soundIndicator = document.querySelector('.sound-indicator');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIndicator = document.querySelector('.theme-indicator');
    const mainNav = document.getElementById('main-nav');
    const typewriterEl = document.getElementById('typewriter');
    const gallerySlider = document.querySelector('.gallery-slider');
    const summonButton = document.getElementById('summon-button');
    const summonOverlay = document.getElementById('summon-overlay');
    const jumpscareCt = document.getElementById('jumpscare-container');
    const jumpscareImg = document.getElementById('jumpscare-image');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.querySelector('.form-message');
    const downloadButtons = document.querySelectorAll('.download-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    const galleryNav = document.querySelectorAll('.gallery-nav');
    
    // Audio Elements (creating them via JavaScript since we can't include MP3 files)
    const audioElements = {
        ambient: new Audio(),
        hover: new Audio(),
        click: new Audio(),
        jumpscare: new Audio(),
        typing: new Audio()
    };
    
    // Set audio properties
    audioElements.ambient.loop = true;
    audioElements.ambient.volume = 0.3;
    
    // URLs for sound effects (would be local files in a real implementation)
    const audioSources = {
        ambient: 'https://www.soundjay.com/ambient/sounds/forest-ambient-1.mp3',
        hover: 'https://www.soundjay.com/button/sounds/button-26.mp3',
        click: 'https://www.soundjay.com/button/sounds/button-14.mp3',
        jumpscare: 'https://www.soundjay.com/human/sounds/scream-01.mp3',
        typing: 'https://www.soundjay.com/mechanical/sounds/typewriter-1.mp3'
    };
    
    // Initialize the site
    initSite();
    
    function initSite() {
        // Loading screen
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 1000);
        }, 2000);
        
        // Initialize custom cursor
        initCustomCursor();
        
        // Initialize scroll events
        initScrollEvents();
        
        // Initialize sound controls
        initSoundControls();
        
        // Initialize theme switcher
        initThemeSwitcher();
        
        // Initialize typewriter effect
        initTypewriter();
        
        // Initialize gallery
        initGallery();
        
        // Initialize form
        initContactForm();
        
        // Initialize navigation
        initNavigation();
        
        // Initialize jumpscare system
        initJumpscare();
        
        // Initialize idle detection
        initIdleDetection();
        
        // Enable interaction monitoring
        monitorUserInteraction();
    }
    
    // Custom Cursor Functions
    function initCustomCursor() {
        document.body.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) { // Only show custom cursor on larger screens
                customCursor.style.display = 'block';
                cursorTrail.style.display = 'block';
                
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
                
                // Delayed cursor trail effect
                setTimeout(() => {
                    cursorTrail.style.left = e.clientX + 'px';
                    cursorTrail.style.top = e.clientY + 'px';
                }, 50);
            }
        });
        
        // Hide cursor when leaving the window
        document.body.addEventListener('mouseleave', () => {
            customCursor.style.display = 'none';
            cursorTrail.style.display = 'none';
        });
    }
    
    // Scroll Events
    function initScrollEvents() {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            
            // Add class to navigation when scrolled
            if (scrollPos > 50) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
            
            // Parallax effect for sections with background images
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                const speed = 0.3;
                const yPos = -(scrollPos * speed);
                if (section.id !== 'hero') { // Don't apply to hero as it has video
                    section.style.backgroundPosition = `50% ${yPos}px`;
                }
            });
        });
    }
    
    // Sound Controls
    function initSoundControls() {
        soundToggle.addEventListener('click', toggleSound);
        
        // Preload audio files
        for (const key in audioSources) {
            if (audioElements[key]) {
                audioElements[key].src = audioSources[key];
                audioElements[key].preload = 'auto';
            }
        }
        
        // Add sound effects to interactive elements
        const soundElements = document.querySelectorAll('[data-sound]');
        soundElements.forEach(el => {
            const soundType = el.getAttribute('data-sound');
            
            if (soundType === 'hover') {
                el.addEventListener('mouseenter', () => playSound('hover'));
            } else if (soundType === 'click') {
                el.addEventListener('click', () => playSound('click'));
            }
        });
    }
    
    function toggleSound() {
        state.soundEnabled = !state.soundEnabled;
        
        soundIndicator.textContent = state.soundEnabled ? 'Sons Ativos' : 'Ativar Sons';
        
        if (state.soundEnabled) {
            audioElements.ambient.play();
        } else {
            audioElements.ambient.pause();
        }
    }
    
    function playSound(type) {
        if (state.soundEnabled && audioElements[type]) {
            // Clone the audio to allow overlapping sounds
            const sound = audioElements[type].cloneNode();
            sound.play();
            
            // Garbage collection for older browsers
            sound.addEventListener('ended', function() {
                sound.remove();
            });
        }
    }
    
    // Theme Switcher
    function initThemeSwitcher() {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    function toggleTheme() {
        const body = document.body;
        
        if (state.currentTheme === 'dark') {
            body.classList.remove('dark-theme');
            body.classList.add('infernal-theme');
            state.currentTheme = 'infernal';
            themeIndicator.textContent = 'Tema Sombrio';
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('infernal-theme');
            body.classList.add('dark-theme');
            state.currentTheme = 'dark';
            themeIndicator.textContent = 'Tema Infernal';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // Trigger a jumpscare with lower probability when changing theme
        if (Math.random() < 0.15) { // 15% chance
            triggerJumpscare('mild');
        }
    }
    
    // Typewriter Effect
    function initTypewriter() {
        if (!typewriterEl) return;
        
        const text = typewriterEl.textContent;
        typewriterEl.textContent = '';
        let i = 0;
        let isTyping = false;
        
        // Start typewriter when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    isTyping = true;
                    typeNextChar();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(typewriterEl);
        
        function typeNextChar() {
            if (i < text.length) {
                typewriterEl.textContent += text.charAt(i);
                i++;
                
                if (state.soundEnabled && i % 3 === 0) { // Play typing sound every few characters
                    playSound('typing');
                }
                
                // Randomize typing speed for more realistic effect
                const speed = Math.random() * (150 - 50) + 50;
                setTimeout(typeNextChar, speed);
            }
        }
    }
    
    // Gallery Functions
    function initGallery() {
        updateGallery();
        
        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                switchTab(tab);
            });
        });
        
        // Gallery navigation
        galleryNav.forEach(nav => {
            nav.addEventListener('click', () => {
                if (nav.classList.contains('prev')) {
                    navigateGallery('prev');
                } else {
                    navigateGallery('next');
                }
            });
        });
    }
    
    function switchTab(tab) {
        state.activeTab = tab;
        
        // Update active tab button
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tab) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update content visibility
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            if (content.id === `${tab}-content`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }
    
    function navigateGallery(direction) {
        const slides = document.querySelectorAll('.gallery-slide');
        
        if (direction === 'prev') {
            state.galleryIndex = (state.galleryIndex - 1 + slides.length) % slides.length;
        } else {
            state.galleryIndex = (state.galleryIndex + 1) % slides.length;
        }
        
        updateGallery();
        
        // Small chance of triggering jumpscare when navigating gallery
        if (Math.random() < state.jumpscareChance) {
            triggerJumpscare('mild');
        }
    }
    
    function updateGallery() {
        const slideWidth = document.querySelector('.gallery-slide').offsetWidth;
        gallerySlider.style.transform = `translateX(-${state.galleryIndex * slideWidth}px)`;
    }
    
    // Contact Form
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            
            // Show success message
            formMessage.classList.remove('hidden');
            formMessage.classList.add('visible');
            
            // Trigger mild jumpscare
            triggerJumpscare('mild');
        });
    }
    
    // Navigation
    function initNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Initialize summon button
        if (summonButton) {
            summonButton.addEventListener('click', triggerSummon);
        }
    }
    
    function triggerSummon() {
        playSound('jumpscare');
        
        summonOverlay.classList.add('active');
        
        setTimeout(() => {
            const audio = new Audio();
            audio.src = audioSources.jumpscare;
            if (state.soundEnabled) audio.play();
            
            setTimeout(() => {
                summonOverlay.classList.remove('active');
            }, 4000);
        }, 1000);
    }
    
    // Jumpscare System
    function initJumpscare() {
        // Add jumpscare triggers to elements with data-jumpscare attribute
        const jumpscareElements = document.querySelectorAll('[data-jumpscare]');
        jumpscareElements.forEach(el => {
            const intensity = el.getAttribute('data-jumpscare');
            
            el.addEventListener('click', () => {
                triggerJumpscare(intensity);
            });
        });
        
        // Easter egg triggers
        const easterEggs = document.querySelectorAll('.easter-egg, [data-trigger="hidden"]');
        easterEggs.forEach(egg => {
            egg.addEventListener('click', () => {
                triggerJumpscare('wild');
            });
        });
        
        // Random jumpscare when download buttons are hovered
        downloadButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (Math.random() < 0.2) { // 20% chance
                    triggerJumpscare('mild');
                }
            });
        });
    }
    
    function triggerJumpscare(intensity = 'mild') {
        // Don't trigger jumpscares if sounds are disabled
        if (!state.soundEnabled) return;
        
        // Set different jumpscare images based on intensity
        const jumpscareImages = {
            mild: 'https://i.pinimg.com/originals/7a/4f/fd/7a4ffd51a6b5503e3490c570cdac61d5.jpg',
            medium: 'https://tinyurl.com/2p8s9a5z',
            wild: 'https://comicvine.gamespot.com/a/uploads/scale_medium/11/117763/3279195-sacizinho.jpg'
        };
        
        jumpscareImg.src = jumpscareImages[intensity] || jumpscareImages.mild;
        
        // Play jumpscare sound
        playSound('jumpscare');
        
        // Show jumpscare
        jumpscareCt.classList.add('active');
        
        // Duration based on intensity
        let duration = intensity === 'wild' ? 800 : 400;
        
        // Hide jumpscare after duration
        setTimeout(() => {
            jumpscareCt.classList.remove('active');
        }, duration);
        
        // Screen shake effect
        if (intensity === 'wild') {
            document.body.classList.add('shake');
            setTimeout(() => {
                document.body.classList.remove('shake');
            }, 1000);
        }
    }
    
    // Idle Detection
    function initIdleDetection() {
        const idleTime = 30000; // 30 seconds
        
        setInterval(() => {
            const now = Date.now();
            if (now - state.lastInteraction > idleTime) {
                // User has been idle, increase jumpscare chance
                state.jumpscareChance = 0.15; // 15% chance
                
                // Show creepy message
                showIdleMessage();
            }
        }, 10000);
    }
    
    function showIdleMessage() {
        const messages = [
            "Ele está observando você agora...",
            "Sente os olhos nas suas costas?",
            "Não se afaste da tela...",
            "Olhe para trás...",
            "Algo se aproxima..."
        ];
        
        // Create and show message
        const message = document.createElement('div');
        message.classList.add('idle-message');
        message.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }
    
    // Monitor User Interaction
    function monitorUserInteraction() {
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                state.lastInteraction = Date.now();
                state.jumpscareChance = 0.03; // Reset to normal
            });
        });
        
        // Random jumpscare chances throughout the session
        setInterval(() => {
            if (Math.random() < 0.01 && state.soundEnabled) { // 1% chance every 30 seconds
                triggerJumpscare(Math.random() < 0.3 ? 'wild' : 'mild');
            }
        }, 30000);
    }
    
    // Add CSS animation for shake effect
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .idle-message {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(30px);
            background-color: rgba(10, 10, 10, 0.8);
            color: var(--current-blood);
            padding: 15px 30px;
            border-radius: 5px;
            border-left: 3px solid var(--current-blood);
            font-family: 'Eater', cursive;
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 1000;
        }
        
        .idle-message.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;
    
    document.head.appendChild(shakeStyle);
});