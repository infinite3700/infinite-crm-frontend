import { useEffect } from 'react';

const PWAInstallPrompt = () => {
  useEffect(() => {
    let deferredPrompt;

    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show install button or banner (you can customize this)
      showInstallPromotion();
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      // Hide the install promotion
      hideInstallPromotion();
      deferredPrompt = null;
    };

    const showInstallPromotion = () => {
      // Create and show install prompt
      const installBanner = document.createElement('div');
      installBanner.id = 'pwa-install-banner';
      installBanner.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 16px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L19.2 9L13.09 15.74L12 22L10.91 15.74L4.8 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            <span style="font-size: 14px; font-weight: 500;">
              Install Infinite CRM for quick access
            </span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="pwa-install-btn" style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            ">Install</button>
            <button id="pwa-dismiss-btn" style="
              background: transparent;
              border: none;
              color: white;
              font-size: 18px;
              cursor: pointer;
              padding: 4px;
              opacity: 0.7;
              transition: opacity 0.2s;
            ">&times;</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(installBanner);

      // Add event listeners
      document.getElementById('pwa-install-btn').addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`PWA: User response to the install prompt: ${outcome}`);
          deferredPrompt = null;
          hideInstallPromotion();
        }
      });

      document.getElementById('pwa-dismiss-btn').addEventListener('click', hideInstallPromotion);
    };

    const hideInstallPromotion = () => {
      const banner = document.getElementById('pwa-install-banner');
      if (banner) {
        banner.remove();
      }
    };

    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone || 
                       document.referrer.includes('android-app://');

    if (!isInstalled) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('PWA: Service Worker registered successfully:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  showUpdateAvailable();
                }
              });
            });
          })
          .catch(() => {
            // Service Worker registration failed
          });
      });
    }

    const showUpdateAvailable = () => {
      // Show update notification
      const updateBanner = document.createElement('div');
      updateBanner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 16px;
          right: 16px;
          background: #10b981;
          color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          max-width: 300px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="margin-bottom: 8px; font-weight: 500; font-size: 14px;">
            New version available!
          </div>
          <div style="margin-bottom: 12px; font-size: 12px; opacity: 0.9;">
            Refresh to get the latest features and improvements.
          </div>
          <button onclick="window.location.reload()" style="
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-right: 8px;
          ">Refresh</button>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: transparent;
            border: none;
            color: white;
            font-size: 12px;
            cursor: pointer;
            opacity: 0.7;
          ">Later</button>
        </div>
      `;
      document.body.appendChild(updateBanner);
    };

    // Cleanup
    return () => {
      if (!isInstalled) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
      hideInstallPromotion();
    };
  }, []);

  return null;
};

export default PWAInstallPrompt;