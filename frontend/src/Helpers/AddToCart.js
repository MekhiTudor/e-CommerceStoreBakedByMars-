export const addToCart = async (
  items,
  isAuthenticated,
  csrfToken,
  getCsrfToken
) => {
  console.log("addToCart called with parameters:", {
    items,
    isAuthenticated,
    csrfToken,
  });

  if (!isAuthenticated) {
    console.error("User is not authenticated");
    throw new Error("You must be logged in to add items to your cart");
  }

  try {
    // If CSRF token is not available, fetch a new one
    let token = csrfToken;
    if (!token) {
      console.log("CSRF token not provided, fetching a new one...");
      token = await getCsrfToken(); // Fallback to fetching a new CSRF token if not present
    }

    console.log("Using CSRF token:", token);

    const payloadItems = Array.isArray(items) ? items : [items];
    console.log("Payload items:", payloadItems[0]);
    console.log("what im sending back:", JSON.stringify(payloadItems[0]));
    const response = await fetch("http://127.0.0.1:8000/api/cart/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
      body: JSON.stringify(payloadItems),
      credentials: "include", // Include session cookies
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log();

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error response from /api/cart/add/:", errorDetails);
      throw new Error(`Failed to add to cart (status: ${response.status})`);
    }

    const data = await response.json();
    console.log("Successful add to cart response data:", data);
    return data;
  } catch (error) {
    console.error("Error in addToCart function:", error);
    throw error;
  }
};
