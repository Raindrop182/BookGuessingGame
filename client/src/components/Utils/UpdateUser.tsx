import { useUser } from "./UserContext";

export const useUpdateUser = () => {
  const { setUser } = useUser();
  const addBookGuess = async (bookId: number, numQuotes: number) => {
    await fetch("http://localhost:5000/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: bookId, numQuotes: numQuotes }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUser);
  };
  return { addBookGuess };
};
