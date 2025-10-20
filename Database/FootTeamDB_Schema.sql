
-- Tworzenie bazy danych
CREATE DATABASE IF NOT EXISTS FootTeamDB;
USE FootTeamDB;

-- Tabela użytkowników
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Coach', 'Player', 'Parent') NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela drużyn
CREATE TABLE Teams (
    TeamID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50),
    CoachID INT,
    FOREIGN KEY (CoachID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Tabela zawodników
CREATE TABLE Players (
    PlayerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    BirthDate DATE,
    Position VARCHAR(50),
    TeamID INT,
    UserID INT,
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID) ON DELETE SET NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Tabela treningów
CREATE TABLE Trainings (
    TrainingID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    Location VARCHAR(100),
    StartTime DATETIME,
    EndTime DATETIME,
    CoachID INT,
    TeamID INT,
    FOREIGN KEY (CoachID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID) ON DELETE SET NULL
);

-- Tabela przypisania zawodników do treningów
CREATE TABLE TrainingParticipants (
    TrainingID INT,
    PlayerID INT,
    PRIMARY KEY (TrainingID, PlayerID),
    FOREIGN KEY (TrainingID) REFERENCES Trainings(TrainingID) ON DELETE CASCADE,
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID) ON DELETE CASCADE
);

-- Tabela wydarzeń
CREATE TABLE Events (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    EventDate DATETIME,
    Location VARCHAR(100),
    CreatedBy INT,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID) ON DELETE SET NULL
);
