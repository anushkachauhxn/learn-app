"use client";
import { useEffect } from "react";
import { User } from "../../services/usersService";
import { useUserContext } from "../../contexts/UserContext";
import styles from "./navbar.module.scss";

const UserDropdown = (
  { userList } : { userList: User[] }
) => {
  const { selectedUserId, setSelectedUserId } = useUserContext();

  useEffect(() => {
    if (userList && userList.length > 0 && !selectedUserId) {
      setSelectedUserId((userList[0] as any).id || null);
    }
  }, [userList, selectedUserId, setSelectedUserId]);

  return (
    <div>
      <select
        id="user"
        name="user"
        className={styles.userDropdown}
        value={selectedUserId || ""}
        onChange={(e) => {
          setSelectedUserId(parseInt(e.target.value));
        }}
      >
        {userList?.map((user: User) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserDropdown