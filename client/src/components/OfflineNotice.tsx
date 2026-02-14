import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { AlertCircle, Wifi, WifiOff, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function OfflineNotice() {
  const { isOnline, isSlowConnection, lastOnlineTime } = useOnlineStatus();
  const [showNotice, setShowNotice] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowNotice(true);
      setWasOffline(true);
      toast.error('Você está offline. Alguns recursos podem estar limitados.', {
        duration: 5000,
      });
    } else if (wasOffline && isOnline) {
      // Show reconnection notice
      setShowNotice(true);
      toast.success('Reconectado! Sincronizando dados...', {
        duration: 3000,
      });
      setWasOffline(false);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowNotice(false), 5000);
    }
  }, [isOnline, wasOffline]);

  if (!showNotice) {
    return null;
  }

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 flex items-center gap-3 shadow-lg animate-in slide-in-from-top">
        <WifiOff className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Modo Offline</p>
          <p className="text-sm text-red-100">
            Você está offline. Usando dados em cache. Reconecte para sincronizar.
          </p>
        </div>
      </div>
    );
  }

  if (isSlowConnection) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-600 text-white px-4 py-3 flex items-center gap-3 shadow-lg animate-in slide-in-from-top">
        <Zap className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Conexão Lenta</p>
          <p className="text-sm text-yellow-100">
            Sua conexão está lenta. Alguns recursos podem carregar mais devagar.
          </p>
        </div>
      </div>
    );
  }

  if (wasOffline && isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-3 flex items-center gap-3 shadow-lg animate-in slide-in-from-top">
        <Wifi className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Reconectado</p>
          <p className="text-sm text-green-100">
            Você está online novamente. Sincronizando dados...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
