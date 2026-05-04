const API = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
};

export const getProfile = async () => {
  const res = await fetch(`${API}/profile`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const getCertifications = async () => {
  const res = await fetch(`${API}/certifications`);
  if (!res.ok) throw new Error("Failed to fetch certifications");
  return res.json();
};

export const getServices = async () => {
  const res = await fetch(`${API}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

export const getBlog = async () => {
  const res = await fetch(`${API}/blog`);
  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
};

export const sendContact = async (formData) => {
  const res = await fetch(`${API}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to send message");
  return data;
};
