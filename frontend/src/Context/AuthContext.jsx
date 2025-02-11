import React, { createContext, useState, useEffect, useContext } from "react";

// Assuming you already have AuthContext and auth-related logic
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);

  // Fetch CSRF Token and store it in context
  const getCsrfToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/csrf/", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();
      setCsrfToken(data.csrfToken); // Store the CSRF token in context
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw new Error("Failed to fetch CSRF token");
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    // Example logic to check if the user is authenticated
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
      value={{ isAuthenticated, csrfToken, getCsrfToken, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
