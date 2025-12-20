import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function NotificationToggle() {
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={isSubscribed ? unsubscribe : subscribe}
      className={`gap-2 ${isSubscribed ? 'text-green-500' : 'text-muted-foreground'}`}
    >
      {isSubscribed ? (
        <>
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">الإشعارات مفعّلة</span>
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          <span className="hidden sm:inline">تفعيل الإشعارات</span>
        </>
      )}
    </Button>
  );
}
