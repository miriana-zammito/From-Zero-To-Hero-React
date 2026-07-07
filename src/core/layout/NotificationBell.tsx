import { useCallback, useEffect, useRef, useState } from "react";
import { useNotifications } from "@/features/notifications";
import styles from "./NotificationBell.module.css";

/* ── Mock loader ── */

function loadNotifications(userId: string, signal: AbortSignal) {
  return new Promise<Array<{ title: string; message: string }>>(
    (resolve, reject) => {
      const timer = setTimeout(() => {
        if (signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        resolve([
          { title: "Bonifico ricevuto", message: "€ 1.500,00 da Mario Rossi" },
          {
            title: "Scadenza imminente",
            message: "Bolletta ENEL in scadenza il 10/07",
          },
          {
            title: "Movimento sospetto",
            message: "Tentativo di accesso da nuovo dispositivo",
          },
        ]);
      }, 400);

      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    },
  );
}

/* ── Componente ── */

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  /* Carica notifiche mock all'avvio */
  useEffect(() => {
    const ac = new AbortController();

    loadNotifications(userId, ac.signal)
      .then((items) => {
        for (const item of items) {
          addNotification({ ...item, userId, read: false });
        }
      })
      .catch(() => {});

    return () => ac.abort();
    // Esegui solo al mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /* Chiudi dropdown al click fuori */
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onDocClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isOpen]);

  /* Callback campanella */
  const handleBellClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.round(diff / 60_000);
    if (min < 60) return `${min}m fa`;
    const h = Math.round(min / 60);
    return `${h}h fa`;
  };

  return (
    <div className={styles.wrapper} ref={bellRef}>
      <button
        type="button"
        className={styles.bell}
        onClick={handleBellClick}
        aria-label={`Notifiche${unreadCount > 0 ? `, ${unreadCount} non lette` : ""}`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span
            className={styles.badge}
            aria-label={`${unreadCount} notifiche non lette`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu" aria-label="Elenco notifiche">
          <p className={styles.dropdownTitle}>Notifiche</p>

          {notifications.length === 0 && (
            <p className={styles.empty}>Nessuna notifica</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`${styles.item} ${n.read ? styles.itemRead : styles.itemUnread}`}
              role="menuitem"
              onClick={() => markAsRead(n.id)}
              onKeyDown={() => {}}
            >
              <p className={styles.itemTitle}>{n.title}</p>
              <p className={styles.itemMessage}>{n.message}</p>
              <span className={styles.itemTime}>{timeAgo(n.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
