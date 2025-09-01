import { useState, useEffect } from 'react';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineAlert) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <Alert variant="destructive" className="bg-destructive/90 backdrop-blur-sm border-destructive">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>You're currently offline. Some features may not work.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOfflineAlert(false)}
            className="ml-2"
          >
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};