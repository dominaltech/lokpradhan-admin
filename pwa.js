(function () {
    'use strict';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Admin SW registered'))
                .catch(err => console.log('Admin SW failed', err));
        });
    }

    let deferredPrompt;
    const installBtn = document.getElementById('adminInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Show the install button
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
            // Hide the button
            installBtn.style.display = 'none';
        });
    }

    window.addEventListener('appinstalled', (evt) => {
        console.log('Admin app installed');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });

    // Check if already standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
        if (installBtn) installBtn.style.display = 'none';
    }
})();
