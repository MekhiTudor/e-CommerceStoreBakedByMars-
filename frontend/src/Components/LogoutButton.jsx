import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button
      onClick={logout}
      className="bg-red-500 text-white py-2 px-4 rounded"
    >
      Logout
    </button>
  );
};
