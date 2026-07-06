import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>🏦 LipariBank</h1>
      <span className={styles.user}>Mario Rossi</span>
    </header>
  );
}
