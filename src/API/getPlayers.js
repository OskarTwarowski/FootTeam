import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5100/api",
  withCredentials: false,
});

export const getPlayers = async () => {
  const res = await axios.get(`http://localhost:5100/api/players`);
  console.log(res);
};
