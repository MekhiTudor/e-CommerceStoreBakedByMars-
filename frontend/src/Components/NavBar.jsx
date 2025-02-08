import { Link } from "react-router-dom";
import { Search, User, ShoppingCart } from "lucide-react";

export const NavBar = () => {
  return (
    <header className="bg-white py-4 px-6 flex items-center justify-center shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center w-full max-w-5xl justify-between">
        {/* Left Navigation */}
        <div className="flex items-center gap-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            SHOP
          </button>
          <Link
            to="/"
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Home
          </Link>
          <Link
            to="/flavors"
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Flavors
          </Link>
          <Link
            to="/purchase"
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Purchase
          </Link>
          <Link
            to="/subscribe"
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Subscribe
          </Link>
        </div>

        {/* Center Logo */}
        <div className="text-center flex-grow">
          <h1
            className="text-4xl font-bold text-blue-600"
            style={{ fontFamily: "cursive" }}
          >
            Baked By Mars
          </h1>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Link
            to="/search"
            className="border border-gray-400 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Search className="h-5 w-5 text-gray-700" />
          </Link>
          <Link
            to="/login"
            className="border border-gray-400 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <User className="h-5 w-5 text-gray-700" />
          </Link>
          <Link
            to="/cart"
            className="border border-gray-400 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  );
};
