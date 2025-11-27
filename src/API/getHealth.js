import API from "./axios";

export const getHealth = async () => {
  try {
    const res = await API.get("/health");
    console.log("status", res.status);
    console.log("data", res.data);
    return res.data;
  } catch (err) {
    console.error("Error:", err);
  }
};
