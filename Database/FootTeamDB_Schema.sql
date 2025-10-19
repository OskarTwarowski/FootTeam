
-- Tworzenie bazy danych
CREATE DATABASE IF NOT EXISTS FootTeamDB;
USE FootTeamDB;

-- Tabela użytkowników (rejestracja i logowanie)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Coach', 'Player', 'Parent') NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela zawodników
CREATE TABLE Players (
    PlayerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    BirthDate DATE,
    Position VARCHAR(50),
    Team VARCHAR(50),
    UserID INT,
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
    FOREIGN KEY (CoachID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Tabela przypisania zawodników do treningów
CREATE TABLE TrainingParticipants (
    TrainingID INT,
    PlayerID INT,
    PRIMARY KEY (TrainingID, PlayerID),
    FOREIGN KEY (TrainingID) REFERENCES Trainings(TrainingID) ON DELETE CASCADE,
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID) ON DELETE CASCADE
);

-- Tabela wydarzeń (kalendarz)
CREATE TABLE Events (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    EventDate DATETIME,
    Location VARCHAR(100),
    CreatedBy INT,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID) ON DELETE SET NULL
);
