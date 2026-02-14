import { useState, useEffect } from 'react';

export type OnlineStatus = {
  isOnline: boolean;
  isSlowConnection: boolean;
  lastOnlineTime: Date | null;
};

export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial online time
    if (isOnline) {
      setLastOnlineTime(new Date());
    }

    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
      setIsSlowConnection(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Check for slow connection
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          setIsSlowConnection(effectiveType === 'slow-2g' || effectiveType === '2g');
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', checkConnection);
      checkConnection();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', checkConnection);
      }
    };
  }, []);

  return {
    isOnline,
    isSlowConnection,
    lastOnlineTime,
  };
}
