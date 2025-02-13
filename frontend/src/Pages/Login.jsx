import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { NavBar } from "../Components/NavBar";

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
    try {
      const response = await fetch("http://127.0.0.1:8000/api/csrf/", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();

      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw new Error("Failed to fetch CSRF token");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    try {
      console.log(formData);
      const csrfToken = await getCsrfToken();
      console.log(await csrfToken);
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const data = await response.json();
      setIsAuthenticated(true);
      setMessage(data.message);
      navigate("/");
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-[1000px] min-w-[1700px] flex items-center justify-center bg-[#FDEED9] px-4 py-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center">
            <img
              alt="Your Company"
              src="http://127.0.0.1:8000/media/uploads/product/cookieIcon.png"
              className="h-16 w-auto"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#573C27]">
              Sign in to your account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#573C27]"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-[#E34989] hover:text-[#FFADC6] transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#E34989] px-4 py-3 text-center font-semibold text-white shadow-sm hover:bg-[#FFADC6] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] focus:ring-offset-2 transition-all duration-200"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#E34989] hover:text-[#FFADC6] transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
