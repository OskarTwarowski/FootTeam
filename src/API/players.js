import API from "./axios";

export const getPlayers = async (teamId) => {
  const url = teamId ? `/players?teamId=${teamId}` : "/players";
  return (await API.get(url)).data;
};

export const getPlayerByUser = async (userId) => {
  return (await API.get(`/players/user/${userId}`)).data;
};

export const createPlayer = async (player) => {
  return (await API.post("/players", player)).data;
};

export const updatePlayer = async (id, player) => {
  return (await API.put(`/players/${id}`, player)).data;
};

export const deletePlayer = async (id) => {
  return (await API.delete(`/players/${id}`)).data;
};
