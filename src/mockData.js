// src/mockData.js

//  FAKE USERS
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
export const FAKE_PROFILES = [
  {
    UserID: 2,
    PlayerID: 1,
    FirstName: "Krzysztof",
    LastName: "Pudzianowski",
    Phone: "987654321",
    TeamCode: "TEAM001",
    teamID: 1,
  },
  {
    UserID: 2,
    PlayerID: 3,
    FirstName: "Robert",
    LastName: "Lewandowski",
    Phone: "123123123",
    TeamCode: "TEAM001",
    teamID: 1,
  },
  {
    UserID: 2,
    PlayerID: 4,
    FirstName: "Piotr",
    LastName: "Nowak",
    Phone: "999888777",
    TeamCode: "TEAM001",
    teamID: 1,
  },
  {
    UserID: 3, // parent1
    PlayerID: 2,
    FirstName: "Maria",
    LastName: "Mostowiak",
    Phone: "555333222",
    TeamCode: "TEAM002",
    teamID: 2,
  },
];

export const FAKE_TEAMS = [
  {
    TeamID: 1,
    Name: "FC Warszawa",
    CoachID: FAKE_USERS.find((user) => user.Role === "Trener")?.UserID || null,
    TeamCode: "TEAM001",
  },
  {
    TeamID: 2,
    Name: "UKS Kraków",
    CoachID: 3, // rodzic1 jako coach tymczasowo
    TeamCode: "TEAM002",
  },
];

export const USERS_WITH_PROFILES = FAKE_USERS.map((u) => ({
  ...u,
  profile: FAKE_PROFILES.find((p) => p.UserID === u.id),
}));
export const DEFAULT_USER = FAKE_USERS[0];
