import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        setSubscription(existingSub);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({
          title: 'تم رفض الإذن',
          description: 'يرجى السماح بالإشعارات للحصول على تنبيهات الحجوزات الجديدة',
          variant: 'destructive',
        });
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(sub);
      setIsSubscribed(true);

      // Save subscription to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('site_settings').upsert({
          key: `push_subscription_${user.id}`,
          value: JSON.stringify(sub.toJSON()),
        }, { onConflict: 'key' });
      }

      toast({
        title: 'تم تفعيل الإشعارات',
        description: 'ستتلقى تنبيهات عند وصول حجوزات جديدة',
      });

      return true;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast({
        title: 'خطأ في تفعيل الإشعارات',
        description: 'حدث خطأ أثناء تفعيل الإشعارات',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const unsubscribe = useCallback(async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('site_settings').delete().eq('key', `push_subscription_${user.id}`);
        }

        toast({
          title: 'تم إلغاء الإشعارات',
          description: 'لن تتلقى تنبيهات بعد الآن',
        });
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  }, [subscription, toast]);

  // Show notification with sound
  const showNotification = useCallback(async (title: string, body: string) => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'new-booking',
        renotify: true,
        requireInteraction: true,
        silent: false, // This enables the default system sound
      } as NotificationOptions);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [isSupported]);

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    showNotification,
  };
}
