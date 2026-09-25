const API_URL = "http://localhost:5000/api/users";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getProfile = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load profile");
  }

  return data;
};

export const updateProfile = async (userId, userData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};

export const deleteProfile = async (userId) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete account");
  }

  return data;
};