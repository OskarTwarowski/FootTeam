import { FAKE_TEAMS } from "../mockData";
import { getProfiles } from "./ProfileService";

const STORAGE_TEAM = "Teams";

export function initializeTeams() {
  const stored = localStorage.getItem(STORAGE_TEAM);
  if (!stored) {
    localStorage.setItem(STORAGE_TEAM, JSON.stringify(FAKE_TEAMS));
  }
}

export function getTeams() {
  initializeTeams();
  return JSON.parse(localStorage.getItem(STORAGE_TEAM)) || [];
}

export function findTeamByCode(teamCode) {
  if (!teamCode) return null;

  const teams = getTeams();
  return teams.find(
    (team) => team.TeamCode.toLowerCase() === teamCode.toLowerCase()
  );
}
export function findPlayersInTeam(teamCode) {
  const teamPlayers = getProfiles();
  return teamPlayers.filter(
    (player) => player.TeamCode.toLowerCase() === teamCode.toLowerCase()
  );
}
