import NotificationBell from "../NotificationBell";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>🏦 LipariBank</h1>
      <div className={styles.right}>
        <NotificationBell userId="user-1" />
        <span className={styles.user}>Mario Rossi</span>
      </div>
    </header>
  );
}
