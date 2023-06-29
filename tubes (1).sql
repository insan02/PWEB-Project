-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2023 at 01:26 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tubes`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `document_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`document_id`, `user_id`, `name`, `filename`, `description`, `created_at`, `updated_at`) VALUES
(22, 10, 'Surat Undangan ', 'Shift 1.pdf', 'Permintaan Ttd', '2023-06-26 00:55:07.128018', '2023-06-26 00:55:07.128018'),
(23, 11, 'Surat Peminjaman Gedung', 'Kelompok 8_Draft Paper.pdf', 'Permintaan Ttd', '2023-06-26 09:46:31.897572', '2023-06-26 09:46:31.897572'),
(24, 10, 'Surat Undangan', 'Modul-Pertemuan-11.pdf', 'Permintaan Ttd', '2023-06-26 10:32:41.744692', '2023-06-26 10:32:41.744692'),
(25, 9, 'Surat Peminjaman Ruangan', 'elnaggar2018.pdf', 'Permintaan Ttd', '2023-06-26 10:48:36.481082', '2023-06-26 10:48:36.481082');

-- --------------------------------------------------------

--
-- Table structure for table `signature`
--

CREATE TABLE `signature` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  `signed_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `signature`
--

INSERT INTO `signature` (`id`, `user_id`, `document_id`, `jabatan`, `status`, `signed_at`, `created_at`, `updated_at`) VALUES
(2, 10, 22, 'Rektor', '', '2023-06-26 00:55:07.133619', '2023-06-26 00:55:07.133619', '2023-06-26 00:55:07.133619'),
(3, 11, 23, 'Rektor', '', '2023-06-26 09:46:31.900628', '2023-06-26 09:46:31.900628', '2023-06-26 09:46:31.900628'),
(4, 10, 24, 'Dekan', '', '2023-06-26 10:32:41.760427', '2023-06-26 10:32:41.760427', '2023-06-26 10:32:41.760427'),
(5, 9, 25, 'Kajur', '', '2023-06-26 10:48:36.487645', '2023-06-26 10:48:36.487645', '2023-06-26 10:48:36.487645');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  `sign_img` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `active`, `sign_img`, `created_at`, `updated_at`) VALUES
(9, 'tes', 'tes@gmail.com', '$2a$10$2YIukeJURGVgO5ZMOYwXjuXoPzYPiKiPUqWYw2mcsKrZi4T1493Mq', 0, 'diagram sesudah dgn layanan.drawio (1).png', '2023-06-26 00:51:18.976565', '2023-06-26 00:51:18.976565'),
(10, 'coba', 'coba@gmail.com', '$2a$10$dJl7kwmQVU9N55jo0pkCOONi8g01VnvL8aMNVDkN2ewzSvKaGkMO6', 0, 'Untitled Diagram.drawio (5).png', '2023-06-26 00:52:57.613123', '2023-06-26 00:52:57.613123'),
(11, 'faiz', 'faiz@gmailcom', '$2a$10$17tzxykBOcR0Q0uvbfrGMOrSWF4z1ue0FIOtY9XDxDTDvR2pxQiAK', 0, 'Windows 10 (1920Ã1080).jpeg', '2023-06-26 09:42:13.757092', '2023-06-26 09:42:13.757092'),
(13, 'adminn', 'admin01@gmail.com', '$2a$10$76Da8ReYVxIfXE/0n5pw1ekkVzrOOWESAF.PbpOgTwDg8FxS6Ry7u', 0, 'Windows 10 (1920Ã1080).jpeg', '2023-06-26 10:26:37.584778', '2023-06-26 10:26:37.584778'),
(14, 'budi1', 'budi1@gmail.com', '$2a$10$v4tfGAKjHfOQNnImOwl4P.RQ7r4VsGovmkzSGrOqhuwgqysYk0wfe', 0, 'UAP Data Mining 2022.jpg', '2023-06-26 10:40:18.294104', '2023-06-26 10:40:18.294104');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `signature`
--
ALTER TABLE `signature`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `document_id` (`document_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `signature`
--
ALTER TABLE `signature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
