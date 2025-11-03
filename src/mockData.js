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
    Role: "Rodzic",
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
    TeamID: 1,
    Role: "Trener",
  },
  {
    UserID: 2,
    PlayerID: 3,
    FirstName: "Robert",
    LastName: "Lewandowski",
    Phone: "123123123",
    TeamCode: "TEAM001",
    TeamID: 1,
  },
  {
    UserID: 2,
    PlayerID: 4,
    FirstName: "Piotr",
    LastName: "Nowak",
    Phone: "999888777",
    TeamCode: "TEAM001",
    TeamID: 1,
  },
  {
    UserID: 3, // parent1
    PlayerID: 2,
    FirstName: "Maria",
    LastName: "Mostowiak",
    Phone: "555333222",
    TeamCode: "TEAM002",
    TeamID: 2,
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

export const DEFAULT_USER = FAKE_USERS[0];

export const FAKE_EVENTS = [
  {
    TrainingID: 1,
    Title: "Trening techniczny - drużyna A",
    Description: "Ćwiczenie podań i dryblingu na hali.",
    StartTime: "2025-11-20T17:00:00",
    EndTime: "2025-11-20T18:30:00",
    CoachID: "user-coach-001",
    TeamID: 1,
  },
  {
    TrainingID: 2,
    Title: "Mecz sparingowy z drużyną B",
    Description: "Zbiórka o 18:30, mecz o 19:00.",
    StartTime: "2025-11-22T19:00:00",
    EndTime: "2025-11-22T20:30:00",
    CoachID: "user-coach-001",
    TeamID: 1,
  },
  {
    TrainingID: 3,
    Title: "Trening kondycyjny - drużyna B",
    Description: "Biegi interwałowe i rozciąganie.",
    StartTime: "2025-11-23T18:00:00",
    EndTime: "2025-11-23T19:15:00",
    CoachID: "user-coach-002",
    TeamID: 2,
  },
];
export const mockNotifications = [
  {
    NotificationID: 1,
    Title: "Nowy trening!",
    Description: "Trening przeniesiony na środę 18:00.",
    StartTime: "2025-10-30T08:00:00",
    EndTime: "2025-11-02T22:00:00",
    CreatedBy: 3, // trener
    TeamID: 1,
  },
  {
    NotificationID: 2,
    Title: "Aktualizacja systemu",
    Description: "Wersja 2.0 już dostępna 🚀",
    StartTime: "2025-10-28T00:00:00",
    EndTime: "2025-11-30T23:59:59",
    CreatedBy: 1, // admin
    TeamID: null, // globalne
  },
];
