export const updateCartItem = async (itemId, newQuantity) => {
  await fetch(`http://127.0.0.1:8000/api/cart/update/${itemId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity: newQuantity }),
  });
};
