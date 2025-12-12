import API from "./axios";

export const getPlayers = async (teamId) => {
  const url = teamId ? `/players?teamId=${teamId}` : "/players";
  return (await API.get(url)).data;
};

export const getPlayerByUser = async (userId) => {
  const res = await API.get(`/players/user/${userId}`);
  const data = res.data;
  return Array.isArray(data) ? data : data ? [data] : [];
};

export const createPlayer = async (player) => {
  const token = localStorage.getItem("token");

  return (
    await API.post("/players", player, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
};

export const updatePlayer = async (id, player) => {
  return (await API.put(`/players/${id}`, player)).data;
};

export const deletePlayer = async (id) => {
  return (await API.delete(`/players/${id}`)).data;
};
