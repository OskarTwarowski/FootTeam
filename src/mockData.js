// src/mockData.js

// 🧍‍♂️ FAKE USERS (odwzorowanie tabeli Users z bazy)
export const FAKE_USERS = [
  {
    UserID: 1,
    Username: "admin",
    Email: "admin@example.com",
    PasswordHash: "ass123",
    Role: "Admin",
    CreatedAt: "2025-01-01T12:00:00Z",
  },
  {
    UserID: 2,
    Username: "trener1",
    Email: "coach@example.com",
    PasswordHash: "coach123",
    Role: "Trener",
    CreatedAt: "2025-02-10T09:30:00Z",
  },
  {
    UserID: 3,
    Username: "rodzic1",
    Email: "parent@example.com",
    PasswordHash: "parent123",
    Role: "Parent",
    CreatedAt: "2025-03-15T17:45:00Z",
  },
];
export const DEFAULT_USER = FAKE_USERS[0];
