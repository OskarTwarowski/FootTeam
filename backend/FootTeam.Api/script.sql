CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Users` (
    `UserID` int NOT NULL AUTO_INCREMENT,
    `Email` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `PasswordHash` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Role` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`UserID`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Teams` (
    `TeamID` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `CoachID` int NULL,
    `CoachUserID` int NULL,
    CONSTRAINT `PK_Teams` PRIMARY KEY (`TeamID`),
    CONSTRAINT `FK_Teams_Users_CoachID` FOREIGN KEY (`CoachID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL,
    CONSTRAINT `FK_Teams_Users_CoachUserID` FOREIGN KEY (`CoachUserID`) REFERENCES `Users` (`UserID`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Trainings` (
    `TrainingID` int NOT NULL AUTO_INCREMENT,
    `Title` varchar(100) CHARACTER SET utf8mb4 NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `Location` varchar(100) CHARACTER SET utf8mb4 NULL,
    `StartTime` datetime(6) NULL,
    `EndTime` datetime(6) NULL,
    `CoachID` int NULL,
    `CoachUserID` int NULL,
    CONSTRAINT `PK_Trainings` PRIMARY KEY (`TrainingID`),
    CONSTRAINT `FK_Trainings_Users_CoachID` FOREIGN KEY (`CoachID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL,
    CONSTRAINT `FK_Trainings_Users_CoachUserID` FOREIGN KEY (`CoachUserID`) REFERENCES `Users` (`UserID`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Notifications` (
    `NotificationID` int NOT NULL AUTO_INCREMENT,
    `Title` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Description` longtext CHARACTER SET utf8mb4 NULL,
    `StartTime` datetime(6) NOT NULL,
    `EndTime` datetime(6) NULL,
    `CreatedBy` int NOT NULL,
    `TeamID` int NULL,
    `CreatorUserID` int NULL,
    `TeamID1` int NULL,
    CONSTRAINT `PK_Notifications` PRIMARY KEY (`NotificationID`),
    CONSTRAINT `FK_Notifications_Teams_TeamID` FOREIGN KEY (`TeamID`) REFERENCES `Teams` (`TeamID`) ON DELETE SET NULL,
    CONSTRAINT `FK_Notifications_Teams_TeamID1` FOREIGN KEY (`TeamID1`) REFERENCES `Teams` (`TeamID`),
    CONSTRAINT `FK_Notifications_Users_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
    CONSTRAINT `FK_Notifications_Users_CreatorUserID` FOREIGN KEY (`CreatorUserID`) REFERENCES `Users` (`UserID`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Players` (
    `PlayerID` int NOT NULL AUTO_INCREMENT,
    `FirstName` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `LastName` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `BirthDate` datetime(6) NULL,
    `Position` varchar(50) CHARACTER SET utf8mb4 NULL,
    `TeamID` int NULL,
    `UserID` int NULL,
    `TeamID1` int NULL,
    `TrainingID` int NULL,
    CONSTRAINT `PK_Players` PRIMARY KEY (`PlayerID`),
    CONSTRAINT `FK_Players_Teams_TeamID` FOREIGN KEY (`TeamID`) REFERENCES `Teams` (`TeamID`) ON DELETE SET NULL,
    CONSTRAINT `FK_Players_Teams_TeamID1` FOREIGN KEY (`TeamID1`) REFERENCES `Teams` (`TeamID`),
    CONSTRAINT `FK_Players_Trainings_TrainingID` FOREIGN KEY (`TrainingID`) REFERENCES `Trainings` (`TrainingID`),
    CONSTRAINT `FK_Players_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `TrainingParticipants` (
    `TrainingID` int NOT NULL,
    `PlayerID` int NOT NULL,
    `TrainingID1` int NOT NULL,
    `PlayerID1` int NOT NULL,
    CONSTRAINT `PK_TrainingParticipants` PRIMARY KEY (`TrainingID`, `PlayerID`),
    CONSTRAINT `FK_TrainingParticipants_Players_PlayerID` FOREIGN KEY (`PlayerID`) REFERENCES `Players` (`PlayerID`) ON DELETE CASCADE,
    CONSTRAINT `FK_TrainingParticipants_Players_PlayerID1` FOREIGN KEY (`PlayerID1`) REFERENCES `Players` (`PlayerID`) ON DELETE CASCADE,
    CONSTRAINT `FK_TrainingParticipants_Trainings_TrainingID` FOREIGN KEY (`TrainingID`) REFERENCES `Trainings` (`TrainingID`) ON DELETE CASCADE,
    CONSTRAINT `FK_TrainingParticipants_Trainings_TrainingID1` FOREIGN KEY (`TrainingID1`) REFERENCES `Trainings` (`TrainingID`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Notifications_CreatedBy` ON `Notifications` (`CreatedBy`);

CREATE INDEX `IX_Notifications_CreatorUserID` ON `Notifications` (`CreatorUserID`);

CREATE INDEX `IX_Notifications_TeamID` ON `Notifications` (`TeamID`);

CREATE INDEX `IX_Notifications_TeamID1` ON `Notifications` (`TeamID1`);

CREATE INDEX `IX_Players_TeamID` ON `Players` (`TeamID`);

CREATE INDEX `IX_Players_TeamID1` ON `Players` (`TeamID1`);

CREATE INDEX `IX_Players_TrainingID` ON `Players` (`TrainingID`);

CREATE UNIQUE INDEX `IX_Players_UserID` ON `Players` (`UserID`);

CREATE INDEX `IX_Teams_CoachID` ON `Teams` (`CoachID`);

CREATE INDEX `IX_Teams_CoachUserID` ON `Teams` (`CoachUserID`);

CREATE INDEX `IX_TrainingParticipants_PlayerID` ON `TrainingParticipants` (`PlayerID`);

CREATE INDEX `IX_TrainingParticipants_PlayerID1` ON `TrainingParticipants` (`PlayerID1`);

CREATE INDEX `IX_TrainingParticipants_TrainingID1` ON `TrainingParticipants` (`TrainingID1`);

CREATE INDEX `IX_Trainings_CoachID` ON `Trainings` (`CoachID`);

CREATE INDEX `IX_Trainings_CoachUserID` ON `Trainings` (`CoachUserID`);

CREATE UNIQUE INDEX `IX_Users_Email` ON `Users` (`Email`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20251112164412_InitialCreate', '8.0.10');

COMMIT;

