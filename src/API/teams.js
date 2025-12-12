import API from "./axios";

export const getTeams = async () => {
  return (await API.get("/teams")).data;
};

export const getTeamById = async (id) => {
  return (await API.get(`/teams/${id}`)).data;
};

export const getTeamPlayers = async (teamId) => {
  return (await API.get(`/teams/players/${teamId}`)).data;
};

export const createTeam = async (team) => {
  return (await API.post("/teams", team)).data;
};

export const updateTeam = async (id, data) => {
  return (await API.put(`/teams/${id}`, data)).data;
};

export const deleteTeam = async (id) => {
  return (await API.delete(`/teams/${id}`)).data;
};
