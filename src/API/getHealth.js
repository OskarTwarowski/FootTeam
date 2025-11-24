import { api } from "./getPlayers";

export const getHealth = async () => {
  try {
    const res = await api.get("/health");
    console.log("status", res.status);
    console.log("data", res.data);
    return res.data;
  } catch (err) {
    console.error("Error:", err);
  }
};
