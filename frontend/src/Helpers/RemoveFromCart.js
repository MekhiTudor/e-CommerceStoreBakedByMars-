export const removeCartItem = async (itemId, csrfToken, getCsrfToken) => {
  try {
    // If CSRF token is not available, fetch a new one
    let token = csrfToken;
    if (!token) {
      console.log("CSRF token not provided, fetching a new one...");
      token = await getCsrfToken(); // Fallback to fetching a new CSRF token if not present
    }

    console.log("Using CSRF token for removal:", token);

    const response = await fetch(
      `http://127.0.0.1:8000/api/cart/remove/${itemId}/`,
      {
        method: "DELETE",
        headers: {
          "X-CSRFToken": token,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error removing cart item:", errorDetails);
      throw new Error(`Failed to remove item (status: ${response.status})`);
    }

    console.log("Item removed successfully");
    return await response.json();
  } catch (error) {
    console.error("Error in removeCartItem function:", error);
    throw error;
  }
};
