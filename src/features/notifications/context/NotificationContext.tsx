import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Notification } from '@/types';

// === Helpers ===

let _nextId = 1;
function nextId(): string {
  return `notif-${Date.now()}-${_nextId++}`;
}

const AUTO_REMOVE_MS = 5_000;
const MAX_NOTIFICATIONS = 50;

// === Types ===

export type AddNotificationPayload = Omit<Notification, 'id' | 'createdAt'>;

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (payload: AddNotificationPayload) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// === Context ===

const NotificationContext = createContext<NotificationContextValue | null>(null);

// === Provider ===

interface NotificationProviderProps {
  children: ReactNode;
  initial?: Notification[];
}

export function NotificationProvider({ children, initial = [] }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initial);

  const addNotification = useCallback((payload: AddNotificationPayload): void => {
    const notification: Notification = {
      ...payload,
      id: nextId(),
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, MAX_NOTIFICATIONS));
  }, []);

  const removeNotification = useCallback((id: string): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string): void => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback((): void => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback((): void => {
    setNotifications([]);
  }, []);

  /* Auto-remove unread notif after AUTO_REMOVE_MS */
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timers = timersRef.current;

    for (const n of notifications) {
      if (n.read) continue;

      const timer = setTimeout(() => {
        removeNotification(n.id);
        timers.delete(timer);
      }, AUTO_REMOVE_MS);

      timers.add(timer);
    }

    return () => {
      for (const t of timers) clearTimeout(t);
      timers.clear();
    };
  }, [notifications, removeNotification]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Annuncia nuove notifiche agli screen reader */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
        }}
      >
        {notifications.length > 0 && (
          <span key={notifications[0].id}>{notifications[0].title}</span>
        )}
      </div>
    </NotificationContext.Provider>
  );
}

// === Hook ===

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  return context;
}
