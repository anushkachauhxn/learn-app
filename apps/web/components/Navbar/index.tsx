import UserDropdown from "./UserDropdown";
import { usersService } from "../../services/usersService";
import styles from "./navbar.module.scss";
import Image from "next/image";

export default async function Navbar() {
  const userList = await usersService.getAllUsers();

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

      <UserDropdown
        userList={userList}
      />
    </nav>
  );
}
