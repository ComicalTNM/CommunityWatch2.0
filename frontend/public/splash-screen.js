// public/splash-screen.js
(function() {
    let splashScreen;
    let content;
    let timeoutId;

    function hideSplashScreen() {
        if (splashScreen && content) {
            splashScreen.style.opacity = '0';
            content.style.opacity = '1';

            // Remove splash screen from DOM after fade out
            setTimeout(function () {
                if (splashScreen.parentNode) {
                    splashScreen.parentNode.removeChild(splashScreen);
                }
            }, 500);
        }
    }

    function isRunningAsInstalledPWA() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }

    function initializeSplashScreen() {
        splashScreen = document.getElementById('splash-screen');
        content = document.getElementById('__next');

        if (!splashScreen || !content) {
            console.error('Splash screen or content elements not found');
            return;
        }

        if (isRunningAsInstalledPWA()) {
            // Show splash screen and hide content after a delay
            timeoutId = setTimeout(hideSplashScreen, 2000); // Adjust this delay as needed
        } else {
            // If not running as installed PWA, immediately hide splash screen and show content
            hideSplashScreen();
        }
    }

    // Try to initialize as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSplashScreen);
    } else {
        initializeSplashScreen();
    }

    // Fallback in case the splash screen is still visible after 3.5 seconds
    setTimeout(function() {
        if (splashScreen && splashScreen.style.opacity !== '0') {
            console.warn('Splash screen took too long to hide, forcing hide');
            hideSplashScreen();
        }
    }, 3500);

    // Clean up the timeout if the page is unloaded
    window.addEventListener('unload', function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });
})();