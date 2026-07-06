import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Conti", href: "/accounts" },
  { label: "Investimenti", href: "/investments" },
  { label: "Polizze", href: "/policies" },
  { label: "Admin", href: "/admin" },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
