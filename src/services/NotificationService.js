import { mockNotifications } from "../mockData";

const STORAGE_KEY = "notifications";

function initializeNotifications() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotifications));
  }
}

export function getNotifications(teamID) {
  initializeNotifications();
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (teamID === null) {
    // tylko globalne profil nie jest połączony z teamem
    return data.filter((n) => n.TeamID === null);
  }

  return data.filter((n) => n.TeamID === null || n.TeamID === teamID);
}

export function addNotification(notification) {
  initializeNotifications();
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  data.push(notification);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function removeNotification(id) {
  initializeNotifications();
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const updated = data.filter((n) => n.NotificationID !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
