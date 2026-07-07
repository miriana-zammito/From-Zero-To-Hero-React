import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/" },
  { label: "Conti", to: "/accounts" },
  { label: "Investimenti", to: "/investments" },
  { label: "Polizze", to: "/policies" },
  { label: "Insurance", to: "/insurance" },
  { label: "Admin", to: "/admin" },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className={styles.link}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
