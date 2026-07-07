import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Investimenti", to: "/investments" },
  { label: "Polizze", to: "/policies" },
  { label: "Insurance", to: "/insurance" },
  { label: "Admin", to: "/admin/users" },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
