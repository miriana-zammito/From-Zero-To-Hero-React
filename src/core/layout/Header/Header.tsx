import { useAuth, useTheme } from "@/store";
import NotificationBell from "../NotificationBell";
import styles from "./Header.module.css";

export default function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = () => {
    login("mario@lipari.it", "password");
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>🏦 LipariBank</h1>
      <div className={styles.right}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Tema chiaro" : "Tema scuro"}
          type="button"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <NotificationBell userId="user-1" />
        {isAuthenticated ? (
          <>
            <span className={styles.user}>{user?.name}</span>
            <button
              className={styles.logoutBtn}
              onClick={logout}
              type="button"
              aria-label="Logout"
            >
              Esci
            </button>
          </>
        ) : (
          <button
            className={styles.loginBtn}
            onClick={handleLogin}
            type="button"
          >
            Accedi
          </button>
        )}
      </div>
    </header>
  );
}
