import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center fixed w-full top-0">
      <div className="text-xl font-bold">Brand</div>
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="hover:text-gray-600">
            Home
          </Link>
        </li>
        <li>
          <Link to="/flavors" className="hover:text-gray-600">
            Flavors
          </Link>
        </li>
        <li>
          <Link to="/purchase" className="hover:text-gray-600">
            Purchase
          </Link>
        </li>
      </ul>
      <div className="flex space-x-4">
        <button className="border px-4 py-1 rounded">
          <Link to="/login">Login / Register</Link>
        </button>
        <button className="border px-4 py-1 rounded">
          <Link to="/cart">🛒</Link>
        </button>
      </div>
    </nav>
  );
};
