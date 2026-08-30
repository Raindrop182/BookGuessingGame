import { useUser } from "./UserContext";
import { API_URL } from "./api";

export const useUpdateUser = () => {
  const { setUser } = useUser();
  const addBookGuess = async (bookId: number, numQuotes: number) => {
    await fetch(`${API_URL}/api/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booksGuessed: [{ bookId, numQuotes }] }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUser);
  };
  const addBODStat = async (status: string, numQuotes: number) => {
    await fetch(`${API_URL}/api/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookofthedayStats: {
          status: status,
          numQuotes: numQuotes,
          date: new Date().toDateString(),
        },
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUser);
  };
  const changeAvatarColor = (color: string) => {
    setUser((prev) => (prev ? { ...prev, avatarColor: color } : null));

    fetch(`${API_URL}/api/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarColor: color }),
      credentials: "include",
    }).catch(() => console.error("Failed to update avatar color"));
  };
  return { addBookGuess, addBODStat, changeAvatarColor };
};
