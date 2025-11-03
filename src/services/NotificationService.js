import { mockNotifications } from "../mockData";

export function getNotifications(teamID) {
  return mockNotifications.filter(
    (n) => n.TeamID === null || n.TeamID === teamID
  );
}
export function getNotificationById(id) {
  return mockNotifications.find((n) => n.NotificationID === id);
}
export function addNotification(notification) {
  mockNotifications.push(notification);
}
