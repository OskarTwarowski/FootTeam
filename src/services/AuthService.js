const STORAGE_KEY = "Users";

// pobiera dane
export function getUsers() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return Array.isArray(stored) ? stored : [stored];
}
// zapisuje i odświeza
export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event("storage"));
}
// dodaje uzytkownika
export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}
// edytuje
export function updateUser(updatedUser) {
  const users = getUsers().map((u) =>
    u.Email === updatedUser.Email ? updatedUser : u
  );
  saveUsers(users);
}

//usuwa
export function removeUser(email) {
  const users = getUsers().filter((u) => u.Email !== email);
  saveUsers(users);
}

export function findUserByCredentials(email, password) {
  const users = getUsers();
  return users.find((u) => u.Email === email && u.PasswordHash === password);
}
