const API_URL = "http://localhost:5000/api/orders";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getMyOrders = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch orders"
    );
  }

  return data;
};

export const getOrder = async (orderId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch order"
    );
  }

  return data;
};

export const cancelOrder = async (orderId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/${orderId}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to cancel order"
    );
  }

  return data;
};

export const createOrder = async (shippingAddress) => {
  const token = getToken();

  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shippingAddress,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create order"
    );
  }

  return data;
};