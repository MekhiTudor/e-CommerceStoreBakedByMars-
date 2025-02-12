import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../Helpers/AddToCart";
import { updateCartItem } from "../Helpers/UpdateCart";
import { removeCartItem } from "../Helpers/RemoveFromCart";
import { AuthContext } from "../Context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { NavBar } from "../Components/NavBar";

export const ShoppingCartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null); // Store CSRF token
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  // Load Stripe
  const stripePromise = loadStripe(
    "pk_test_51QrVsTLnkxbtY0aIsKHAzbt6WpSimAoNnSFxZy5UQXdhBihet3COMjwc2SPDDXZHUXRSHcWv6bsBRuGWNpPyW5to00KEuLiqhN"
  );

  // Function to get the CSRF token
  const getCsrfToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/csrf/", {
        credentials: "include", // Ensure cookies are sent
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();
      console.log("CSRF Token:", data.csrfToken);
      setCsrfToken(data.csrfToken); // Store CSRF token in state
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      return null;
    }
  };

  // Fetch Cart with CSRF token
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = await getCsrfToken(); // Fetch CSRF token
        const response = await fetch("http://127.0.0.1:8000/api/cart/", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
          headers: {
            "Content-Type": "application/json", // Add the content type if needed
            "X-CSRFToken": token, // Add CSRF token to the headers
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

  const handleCheckout = async () => {
    try {
      // Make sure the user is logged in
      if (!isAuthenticated) {
        return navigate("/login");
      }

      // Create the checkout session on the backend
      const response = await fetch(
        "http://127.0.0.1:8000/api/create-checkout-session/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            items: cart.items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { id } = await response.json();

      // Redirect to Stripe's checkout page
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error("Stripe checkout error:", error);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      console.log(productId);
      console.log(typeof productId);
      if (newQuantity < 1) {
        return handleRemoveItem(productId); // If quantity goes below 1, remove item
      }

      await updateCartItem(productId, newQuantity, csrfToken, getCsrfToken);

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId, csrfToken, getCsrfToken);

      // Fetch the updated cart from the backend
      const response = await fetch("http://127.0.0.1:8000/api/cart/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reload cart");
      }

      const updatedCart = await response.json();
      setCart(updatedCart); // Update state with fresh data from the backend
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        <p>{isAuthenticated ? "User is logged in" : "User is NOT logged in"}</p>
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {cart?.items?.map((item) => (
            <div
              key={item?.id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {item?.product_name || "Unnamed Product"}
                </h2>
                <p>${Number(item?.product_price).toFixed(2)}</p>
              </div>
              <div className="flex items-center">
                {/* <button
                className="px-2 py-1 bg-gray-200 rounded-md"
                onClick={() =>
                  handleQuantityChange(
                    item?.product_id,
                    (item?.quantity ?? 1) - 1
                  )
                }
              >
                -
              </button> */}
                <span className="mx-2">{item?.quantity ?? 0}</span>
                {/* <button
                className="px-2 py-1 bg-gray-200 rounded-md"
                onClick={() =>
                  handleQuantityChange(
                    item?.product_id,
                    (item?.quantity ?? 0) + 1
                  )
                }
              >
                +
              </button> */}
              </div>
              <p className="font-bold">
                $
                {(
                  (Number(item?.product_price) ?? 0) * (item?.quantity ?? 0)
                ).toFixed(2)}
              </p>
              <button
                className="ml-4 text-red-500"
                onClick={() => handleRemoveItem(item?.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right font-bold mt-4">
            Total: $
            {cart?.items
              ?.reduce(
                (acc, item) =>
                  acc +
                  (Number(item?.product_price) ?? 0) * (item?.quantity ?? 0),
                0
              )
              .toFixed(2)}
          </div>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCheckout}
        >
          Continue to Checkout
        </button>
      </div>
    </>
  );
};
