import API from "./axios";

/**
 * Pobiera graczy (opcjonalnie po teamId)
 */
export const getPlayers = async (teamId) => {
  const url = teamId ? `/players?teamId=${teamId}` : "/players";
  const res = await API.get(url);
  return res.data;
};

/**
 * Pobiera profile gracza po userId
 * (na razie zostawiamy, żeby nic nie zepsuć)
 */
export const getPlayerByUser = async (userId) => {
  const res = await API.get(`/players/user/${userId}`);
  const data = res.data;
  return Array.isArray(data) ? data : data ? [data] : [];
};

/**
 * Tworzy nowy profil gracza
 */
export const createPlayer = async (player) => {
  const res = await API.post("/players", player);
  return res.data;
};

/**
 * Aktualizuje profil gracza
 */
export const updatePlayer = async (id, player) => {
  const res = await API.put(`/players/${id}`, player);
  return res.data;
};

/**
 * Usuwa profil gracza
 */
export const deletePlayer = async (id) => {
  await API.delete(`/players/${id}`);
};
