import { Link } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white py-4 px-6 shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center w-full max-w-7xl mx-auto justify-between">
        {/* Left Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-[#573C27] hover:text-[#E34989] transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/flavors"
            className="text-[#573C27] hover:text-[#E34989] transition-colors font-medium"
          >
            Flavors
          </Link>
          <Link
            to="/purchase"
            className="text-[#573C27] hover:text-[#E34989] transition-colors font-medium"
          >
            Purchase
          </Link>
        </div>

        {/* Center Logo */}
        <div className="flex items-center space-x-4">
          <img
            className="h-20 w-20"
            src="http://127.0.0.1:8000/media/uploads/product/cookieIcon.png"
            alt="logo"
          />
          <h1
            className="text-4xl font-bold text-[#E34989]"
            style={{ fontFamily: "Bagel Fat One" }}
          >
            Baked-By-Mars
          </h1>
          <img
            className="h-20 w-20"
            src="http://127.0.0.1:8000/media/uploads/product/cookieIcon.png"
            alt="logo"
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-[#E34989] hover:text-[#FFADC6] transition-colors font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-[#573C27] hover:text-[#E34989] transition-colors"
            >
              <User className="h-6 w-6" />
            </Link>
          )}
          <Link
            to="/cart"
            className="text-[#573C27] hover:text-[#E34989] transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};
