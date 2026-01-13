CREATE DATABASE IF NOT EXISTS FootTeamDB;
USE FootTeamDB;

CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` enum('Admin','Coach','Parent') NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
);

CREATE TABLE `Teams` (
  `TeamID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `CoachID` int DEFAULT NULL,
  `TeamCode` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`TeamID`),
  UNIQUE KEY `uq_teams_teamcode` (`TeamCode`),
  KEY `CoachID` (`CoachID`),
  CONSTRAINT `Teams_ibfk_1` FOREIGN KEY (`CoachID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL
);

CREATE TABLE `Players` (
  `PlayerID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `TeamID` int DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  `TeamCode` varchar(32) DEFAULT NULL,
  `Phone` int DEFAULT NULL,
  `ROLE` enum('Player','Coach','Parent') DEFAULT NULL,
  PRIMARY KEY (`PlayerID`),
  KEY `TeamID` (`TeamID`),
  KEY `UserID` (`UserID`),
  KEY `idx_players_teamcode` (`TeamCode`),
  CONSTRAINT `fk_players_teamcode` FOREIGN KEY (`TeamCode`) REFERENCES `Teams` (`TeamCode`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`TeamID`) REFERENCES `Teams` (`TeamID`) ON DELETE SET NULL,
  CONSTRAINT `Players_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL
);

CREATE TABLE `Trainings` (
  `TrainingID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) DEFAULT NULL,
  `Description` text,
  `StartTime` datetime DEFAULT NULL,
  `EndTime` datetime DEFAULT NULL,
  `CoachID` int DEFAULT NULL,
  `TeamID` int DEFAULT NULL,
  PRIMARY KEY (`TrainingID`),
  KEY `CoachID` (`CoachID`),
  KEY `TeamID` (`TeamID`),
  CONSTRAINT `Trainings_ibfk_1` FOREIGN KEY (`CoachID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `Trainings_ibfk_2` FOREIGN KEY (`TeamID`) REFERENCES `Teams` (`TeamID`) ON DELETE SET NULL
);

CREATE TABLE `Notifications` (
  `NotificationID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) DEFAULT NULL,
  `Description` text,
  `StartTime` datetime DEFAULT NULL,
  `EndTime` datetime DEFAULT NULL,
  `CreatedBy` int DEFAULT NULL,
  `TeamID` int DEFAULT NULL,
  PRIMARY KEY (`NotificationID`),
  KEY `CreatedBy` (`CreatedBy`),
  KEY `TeamID` (`TeamID`),
  CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `Notifications_ibfk_2` FOREIGN KEY (`TeamID`) REFERENCES `Teams` (`TeamID`) ON DELETE SET NULL
);
