import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  googleid: string;
  avatarColor: string;
  booksGuessed: {
    bookId: number;
    bestNumQuotes: number;
    worstNumQuotes: number;
  }[];
  bookofthedayStats: {
    date: string;
    numQuotes: number;
    status: string;
  };
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
