'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

export const NotificationToast: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen to real-time notification logs
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification_logs',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newLog = payload.new;
          let data = { title: 'Notification', message: '' };
          try {
            data = typeof newLog.payload === 'string' ? JSON.parse(newLog.payload) : newLog.payload;
          } catch (e) {
            console.error('Failed to parse notification payload', e);
          }

          const notification: Notification = {
            id: newLog.id,
            title: data.title,
            message: data.message,
            type: 'info',
          };

          addNotification(notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addNotification = (notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notif.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-l-4 border-primary-500 p-4 flex gap-3 animate-slide-in"
        >
          <div className="flex-shrink-0">
            <Bell className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {notif.title}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {notif.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notif.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
