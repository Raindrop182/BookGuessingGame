import { useUser } from "./UserContext";
import { API_URL } from "./api";

export const useUpdateUser = () => {
  const {user, setUser } = useUser();

  const sendUpdate = async (payload: Record<string, any>) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Update failed");
      const updatedUser = await res.json();
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  const addBookGuess = async (bookId: number, numQuotes: number) => {
    sendUpdate({ booksGuessed: [{ bookId, numQuotes }] })
  };

  const addBODStat = async (status: string, numQuotes: number) => {
    sendUpdate({
        bookofthedayStats: {
          status: status,
          numQuotes: numQuotes,
          date: new Date().toDateString(),
        },
      })
  };

  const changeAvatarColor = (color: string) => {
    console.log("Updating new color ${color}")
    sendUpdate({ avatarColor: color })
  };

  return { addBookGuess, addBODStat, changeAvatarColor };
};
