import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../Helpers/AddToCart";
import { updateCartItem } from "../Helpers/UpdateCart";
import { removeCartItem } from "../Helpers/RemoveFromCart";
import { AuthContext } from "../Context/AuthContext";

export const ShoppingCartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  //check auth

  // Function to get the CSRF token
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

  // Fetch Cart with CSRF token
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const csrfToken = await getCsrfToken(); // Fetch CSRF token
        const response = await fetch("http://127.0.0.1:8000/api/cart/", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
          headers: {
            "Content-Type": "application/json", // Add the content type if needed
            "X-CSRFToken": csrfToken, // Add CSRF token to the headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load cart");
        }

        const data = await response.json();
        setCart(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load cart", err);
        setError("Could not load cart.");
        setLoading(false);
      }
    };

    fetchCart(); // Fetch the cart after getting the CSRF token
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    await updateCartItem(itemId, newQuantity);
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  const handleRemoveItem = async (itemId) => {
    await removeCartItem(itemId);
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item.id !== itemId),
    }));
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;
  // if (!cart || cart.items.length === 0)
  //   return <h1>PUT SOMETHING IN YOUR CART! SOMETHING!</h1>;

  return (
    <div className="container mx-auto p-6">
      <p>{isAuthenticated ? "User is logged in" : "User is NOT logged in"}</p>
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-4"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.product.name}</h2>
              <p>${item.product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
              <button
                className="px-2 py-1 bg-gray-200 rounded-md"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button
                className="px-2 py-1 bg-gray-200 rounded-md"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <p className="font-bold">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
            <button
              className="ml-4 text-red-500"
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="text-right font-bold mt-4">
          Total: $
          {cart.items
            .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
            .toFixed(2)}
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        Continue to Checkout
      </button>
    </div>
  );
};
