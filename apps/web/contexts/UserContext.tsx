"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <UserContext.Provider value={{
      selectedUserId,
      setSelectedUserId,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}