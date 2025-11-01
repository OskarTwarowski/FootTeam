import { FAKE_TEAMS } from "../mockData";

export function getTeams() {
  return FAKE_TEAMS;
}

export function findTeamByCode(teamCode) {
  if (!teamCode) return null;

  const teams = getTeams();
  return teams.find(
    (team) => team.TeamCode.toLowerCase() === teamCode.toLowerCase()
  );
}
