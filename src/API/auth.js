import API from "./axios";

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (email, password, role) => {
  const res = await API.post("/auth/register", { email, password, role });
  return res.data;
};

export const changeEmail = async (newEmail) => {
  const token = localStorage.getItem("token");
  return API.put(
    "/auth/change-email",
    { newEmail },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem("token");
  return API.put(
    "/auth/change-password",
    { oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
