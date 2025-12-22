import Image from "next/image";
import { headers } from "next/headers";
// components
import UserDropdown from "./UserDropdown";
// api imports
import { usersService } from "../../services/usersService";
// constants
import { NAV_ITEMS } from "../../constants";
// style imports
import styles from "./navbar.module.scss";

export default async function Navbar() {
  const headersList = await headers();
  const userList = await usersService.getAllUsers();
  const pathname = headersList.get("x-pathname") || "";

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className={styles.navbar}>
      <a className={styles.logo} href="/">
        <Image
          src="/logo.svg"
          alt="Learn App Logo"
          width={50}
          height={50}
        />
        <h1>Learn App</h1>
      </a>

      <ul className={styles.navList}>
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <UserDropdown
        userList={userList}
      />
    </nav>
  );
}
