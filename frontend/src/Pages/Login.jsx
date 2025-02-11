import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Form, Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCsrfToken = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/csrf/", {
      credentials: "include", // Ensure cookies are sent
    });

    if (!response.ok) {
      throw new Error("Failed to fetch CSRF token");
    }

    const data = await response.json();
    console.log("CSRF Token:", data.csrfToken);
    return data.csrfToken;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = await getCsrfToken();
      console.log("CSRF Token Retrieved:", csrfToken);
      //console.log(JSON.stringify(formData));
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Include CSRF token
        },
        credentials: "include", // Include cookies for authentication

        body: JSON.stringify(formData),
      });
      console.log(response);
      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true); // Set global auth state to true
        navigate("/");
        console.log("Login successful:", data);
      } else {
        //console.error("Error:", data.error);
      }
    } catch (err) {
      console.error("Request failed:", err);
      //console.log();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mt-2">{message}</p>
        )}
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
