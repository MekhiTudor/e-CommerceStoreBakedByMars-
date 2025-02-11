export const removeCartItem = async (itemId) => {
  await fetch(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`, {
    method: "DELETE",
    credentials: "include",
  });
};
