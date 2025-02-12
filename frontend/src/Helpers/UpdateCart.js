export const updateCartItem = async (
  itemId,
  newQuantity,
  csrfToken,
  getCsrfToken
) => {
  try {
    // If CSRF token is not available, fetch a new one
    let token = csrfToken;
    if (!token) {
      console.log("CSRF token not provided, fetching a new one...");
      token = await getCsrfToken(); // Fallback to fetching a new CSRF token if not present
    }

    console.log("Using CSRF token for updating cart:", token);

    const response = await fetch(
      `http://127.0.0.1:8000/api/cart/update/${itemId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": token,
        },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error updating cart item:", errorDetails);
      throw new Error(`Failed to update item (status: ${response.status})`);
    }

    console.log("Cart item updated successfully");
    return await response.json();
  } catch (error) {
    console.error("Error in updateCartItem function:", error);
    throw error;
  }
};
