'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Info, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch existing notifications and subscribe to real-time
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notification_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data) {
          const formatted: Notification[] = data.map((n: any) => {
            let payload = { title: 'Notification', message: '' };
            try {
              payload = typeof n.payload === 'string' ? JSON.parse(n.payload) : (n.payload || {});
            } catch {}
            return {
              id: n.id,
              title: payload.title || 'Notification',
              message: payload.message || '',
              type: n.channel === 'warning' ? 'warning' : n.channel === 'success' ? 'success' : 'info',
              read: n.read || false,
              created_at: n.created_at,
            };
          });
          setNotifications(formatted);
          setUnreadCount(formatted.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification_logs',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          const newLog = payload.new as any;
          let data = { title: 'Notification', message: '' };
          try {
            data = typeof newLog.payload === 'string' ? JSON.parse(newLog.payload) : (newLog.payload || {});
          } catch {}

          const newNotification: Notification = {
            id: newLog.id,
            title: data.title || 'Notification',
            message: data.message || '',
            type: 'info',
            read: false,
            created_at: newLog.created_at,
          };

          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await supabase.from('notification_logs').update({ read: true }).eq('id', id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await supabase.from('notification_logs').update({ read: true }).eq('user_id', user.id).eq('read', false);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await supabase.from('notification_logs').delete().eq('id', id);
      const removed = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (removed && !removed.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-surface-container flex items-center justify-center text-gray-500 dark:text-dark-on-surface transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-dark-surface-container-low">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-white dark:bg-dark-surface-container-low rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-surface-variant/20 z-[100] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-dark-surface-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-container text-gray-400 hover:text-primary transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-container text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No Notifications</p>
                <p className="text-[10px] text-gray-400 mt-1">You're all caught up.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-50 dark:border-dark-surface-variant/10 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group ${
                    !notif.read ? 'bg-primary/[0.02]' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-[12px] font-bold leading-tight ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-400 hover:text-primary transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {notif.message && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      )}
                      <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                        {formatTime(notif.created_at)}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 dark:border-dark-surface-variant/20 bg-gray-50/50 dark:bg-white/[0.02]">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-[10px] font-black text-primary uppercase tracking-widest hover:underline py-1"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
