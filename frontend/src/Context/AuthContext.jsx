import React, { createContext, useState, useEffect, useContext } from "react";

// Assuming you already have AuthContext and auth-related logic
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);

  const getCsrfToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/csrf/", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();
      setCsrfToken(data.csrfToken);
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw new Error("Failed to fetch CSRF token");
    }
  };

  const logout = async () => {
    try {
      let token = await getCsrfToken();
      console.log(token);
      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": token, // Include CSRF token if needed
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      setIsAuthenticated(false); // Update state to reflect the user is logged out
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/check-auth/", {
        credentials: "include",
      });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        csrfToken,
        getCsrfToken,
        setIsAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
