import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Form, Link, useNavigate } from "react-router-dom";
import { NavBar } from "../Components/NavBar";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { getCsrfToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          password1: formData.password,
          password2: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-[1000px] min-w-[1700px] flex items-center justify-center bg-[#FDEED9] px-4 py-12">
        <div className="my-[100px] w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center">
            <img
              alt="Your Company"
              src="http://127.0.0.1:8000/media/uploads/product/cookieIcon.png"
              className="h-16 w-auto"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#573C27]">
              Create an account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#573C27]"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-[#A98360] px-4 py-3 text-[#573C27] placeholder:text-gray-400 focus:border-[#E34989] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#E34989] px-4 py-3 text-center font-semibold text-white shadow-sm hover:bg-[#FFADC6] focus:outline-none focus:ring-2 focus:ring-[#FFADC6] focus:ring-offset-2 transition-all duration-200"
            >
              Register
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {message && (
            <p className="text-green-500 text-center mt-2">{message}</p>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#E34989] hover:text-[#FFADC6] transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
