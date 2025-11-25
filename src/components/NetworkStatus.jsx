import { useState, useEffect } from 'react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      
      // Show reconnected message briefly
      const reconnectedBanner = document.createElement('div');
      reconnectedBanner.innerHTML = `
        <div style="
          position: fixed;
          top: 16px;
          right: 16px;
          background: #10b981;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideInRight 0.3s ease-out;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back online
        </div>
        <style>
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `;
      document.body.appendChild(reconnectedBanner);
      
      setTimeout(() => {
        reconnectedBanner.remove();
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show the offline banner when actually offline
  if (isOnline || !showOfflineMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#f59e0b',
      color: 'white',
      padding: '12px 16px',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      You're offline. Some features may be limited.
    </div>
  );
};

export default NetworkStatus;