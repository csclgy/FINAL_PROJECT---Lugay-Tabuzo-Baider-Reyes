-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 09, 2025 at 08:03 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ticket_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `Departments`
--

CREATE TABLE `Departments` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Remarks`
--

CREATE TABLE `Remarks` (
  `Id` int(11) NOT NULL,
  `TicketId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Content` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Tickets`
--

CREATE TABLE `Tickets` (
  `Id` int(11) NOT NULL,
  `Title` varchar(150) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `CreatedBy` int(11) NOT NULL,
  `AssignedTo` int(11) DEFAULT NULL,
  `DepartmentId` int(11) NOT NULL,
  `Severity` varchar(50) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Email` varchar(150) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `DepartmentId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Departments`
--
ALTER TABLE `Departments`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Remarks`
--
ALTER TABLE `Remarks`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `TicketId` (`TicketId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `Tickets`
--
ALTER TABLE `Tickets`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `CreatedBy` (`CreatedBy`),
  ADD KEY `AssignedTo` (`AssignedTo`),
  ADD KEY `DepartmentId` (`DepartmentId`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `DepartmentId` (`DepartmentId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Remarks`
--
ALTER TABLE `Remarks`
  ADD CONSTRAINT `remarks_ibfk_1` FOREIGN KEY (`TicketId`) REFERENCES `Tickets` (`Id`),
  ADD CONSTRAINT `remarks_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`);

--
-- Constraints for table `Tickets`
--
ALTER TABLE `Tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`Id`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`AssignedTo`) REFERENCES `Users` (`Id`),
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`);

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
