import API from "./axios";

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (email, password, role) => {
  const res = await API.post("/auth/register", { email, password, role });
  return res.data;
};
