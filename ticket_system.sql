-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 25, 2025 at 11:26 AM
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

--
-- Dumping data for table `Departments`
--

INSERT INTO `Departments` (`Id`, `Name`) VALUES
(1, 'IT Support'),
(2, 'Human Resources'),
(3, 'Operations'),
(4, 'Marketing'),
(5, 'Finance'),
(6, 'Security');

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

--
-- Dumping data for table `Remarks`
--

INSERT INTO `Remarks` (`Id`, `TicketId`, `UserId`, `Content`, `CreatedAt`) VALUES
(1, 1, 1, 'Unable to send or receive emails through Outlook', '2025-05-22 00:00:00'),
(2, 2, 2, 'New employee needs access to company systems', '2025-05-21 00:00:00'),
(3, 3, 3, 'Canon printer on 3rd floor is showing error codes', '2025-05-20 00:00:00'),
(4, 4, 4, 'Contact form submissions are not being received', '2025-05-19 00:00:00'),
(5, 5, 2, 'Error in salary calculations for April payroll', '2025-05-18 00:00:00'),
(6, 6, 3, 'Unable to connect to company VPN from home', '2025-05-17 00:00:00'),
(7, 7, 4, 'Adobe Creative Suite licenses expiring next month', '2025-05-16 00:00:00'),
(8, 8, 2, 'Automated backup process failed last night', '2025-05-15 00:00:00'),
(9, 9, 3, 'Unable to book conference rooms through the portal', '2025-05-14 00:00:00'),
(10, 10, 3, 'Cannot log into benefits portal to update information', '2025-05-13 00:00:00'),
(11, 11, 4, 'Lost security badge, need replacement', '2025-05-12 00:00:00'),
(12, 12, 2, 'Application server running slow during peak hours', '2025-05-11 00:00:00');

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

--
-- Dumping data for table `Tickets`
--

INSERT INTO `Tickets` (`Id`, `Title`, `Description`, `CreatedBy`, `AssignedTo`, `DepartmentId`, `Severity`, `Status`, `CreatedAt`) VALUES
(1, 'Email service is down', 'Unable to send or receive emails through Outlook', 1, 1, 1, 'High', 'New', '2025-05-22 00:00:00'),
(2, 'New user onboarding issue', 'New employee needs access to company systems\r\n', 2, 1, 2, 'Medium', 'InProgress', '2025-05-21 00:00:00'),
(3, 'Office printer not responding', 'Canon printer on 3rd floor is showing error codes', 3, 1, 3, 'Low', 'OnHold', '2025-05-20 00:00:00'),
(4, 'Website contact form broken', 'Contact form submissions are not being received', 4, 3, 4, 'Medium', 'Resolved', '2025-05-19 00:00:00'),
(5, 'Payroll processing error', 'Error in salary calculations for April payroll', 4, 3, 5, 'Critical', 'Closed', '2025-05-18 00:00:00'),
(6, 'VPN connection issues', 'Unable to connect to company VPN from home', 2, 1, 1, 'High', 'New', '2025-05-17 00:00:00'),
(7, 'Software license renewal', 'Adobe Creative Suite licenses expiring next month', 3, 2, 4, 'Medium', 'InProgress', '2025-05-16 00:00:00'),
(8, 'Database backup failure', 'Automated backup process failed last night', 4, 3, 1, 'Critical', 'New', '2025-05-15 00:00:00'),
(9, 'Conference room booking system', 'Unable to book conference rooms through the portal', 3, 2, 3, 'Low', 'OnHold', '2025-05-14 00:00:00'),
(10, 'Employee benefits portal access', 'Cannot log into benefits portal to update information', 3, 2, 2, 'Medium', 'Resolved', '2025-05-13 00:00:00'),
(11, 'Security badge replacement', 'Lost security badge, need replacement', 4, 3, 6, 'Low', 'New', '2025-05-12 00:00:00'),
(12, 'Server performance issues', 'Application server running slow during peak hours', 3, 2, 1, 'High', 'InProgress', '2025-05-11 00:00:00');

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
  `DepartmentId` int(11) NOT NULL,
  `Username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `DepartmentId`, `Username`) VALUES
(1, 'admin', 'admin@gmail.com', 'password', 'admin', 1, 'admin'),
(2, 'supervisor', 'supervisor@gmail.com', 'password', 'supervisor', 2, 'supervisor'),
(3, 'officer', 'officer@gmail.com', 'password', 'officer', 3, 'officer'),
(4, 'junior officer', 'juniorofficer@gmail.com', 'password', 'juniorofficer', 4, 'junior officer');

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
