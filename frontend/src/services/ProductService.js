const API_URL = "http://localhost:5000/api/products";

export const getProducts = async (search = "", category = "") => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (category) {
    params.append("category", category);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}${queryString ? `?${queryString}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.products;
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();

  return data.product;
};