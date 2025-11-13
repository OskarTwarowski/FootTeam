import { FAKE_TEAMS } from "../mockData";
import { getProfiles } from "./ProfileService";

const STORAGE_TEAM = "Teams";

// --- Inicjalizacja danych ---
export function initializeTeams() {
  const stored = localStorage.getItem(STORAGE_TEAM);
  if (!stored) {
    localStorage.setItem(STORAGE_TEAM, JSON.stringify(FAKE_TEAMS));
  }
}

// --- Pobranie wszystkich drużyn ---
export function getTeams() {
  initializeTeams();
  return JSON.parse(localStorage.getItem(STORAGE_TEAM)) || [];
}

// --- Zapisz drużyny do localStorage ---
function saveTeams(teams) {
  localStorage.setItem(STORAGE_TEAM, JSON.stringify(teams));
  window.dispatchEvent(new Event("storage"));
}

// --- Znajdź drużynę po kodzie ---
export function findTeamByCode(teamCode) {
  if (!teamCode) return null;

  const teams = getTeams();
  return teams.find(
    (team) => team.TeamCode.toLowerCase() === teamCode.toLowerCase()
  );
}

// --- Znajdź zawodników przypisanych do drużyny ---
export function findPlayersInTeam(teamCode) {
  const teamPlayers = getProfiles();
  return teamPlayers.filter(
    (player) => player.TeamCode?.toLowerCase() === teamCode?.toLowerCase()
  );
}

// --- 🟢 Dodaj drużynę ---
export function addTeam({ Name, CoachID }) {
  const teams = getTeams();

  const newTeam = {
    TeamID: Date.now(),
    Name,
    TeamCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
  };

  teams.push(newTeam);
  saveTeams(teams);
  return newTeam;
}

// --- 🟡 Edytuj drużynę ---
export function updateTeam(updatedTeam) {
  const teams = getTeams();
  const index = teams.findIndex((t) => t.TeamID === updatedTeam.TeamID);
  if (index === -1) return null;

  teams[index] = { ...teams[index], ...updatedTeam };
  saveTeams(teams);
  return teams[index];
}

// --- 🔴 Usuń drużynę ---
export function removeTeam(teamID) {
  const teams = getTeams().filter((t) => t.TeamID !== teamID);
  saveTeams(teams);
}
