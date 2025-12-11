import API from "./axios";

export const getNotifications = async (teamId) => {
  const url = teamId ? `/notifications?teamId=${teamId}` : "/notifications";
  return (await API.get(url)).data;
};

export const getNotificationsByCreator = async (userId) => {
  return (await API.get(`/notifications/user/${userId}`)).data;
};

export const createNotification = async (data) => {
  return (await API.post("/notifications", data)).data;
};

export const updateNotification = async (id, data) => {
  return (await API.put(`/notifications/${id}`, data)).data;
};

export const deleteNotification = async (id) => {
  await API.delete(`/notifications/${id}`);
  return id;
};
