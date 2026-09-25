const API_URL = "http://localhost:5000/api/cart";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getCart = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch cart"
    );
  }

  return data;
};

export const addToCart = async (
  productId,
  quantity = 1
) => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add product to cart"
    );
  }

  return data;
};

export const mergeGuestCart = async (items) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/merge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to merge guest cart"
    );
  }

  return data;
};