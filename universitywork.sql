-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 13. 20:07
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `universitywork`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `children_parent`
--

CREATE TABLE `children_parent` (
  `child_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `children_parent`
--

INSERT INTO `children_parent` (`child_id`, `parent_id`) VALUES
(1, 5),
(1, 45),
(2, 5),
(2, 45),
(59, 5),
(59, 45);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `class`
--

CREATE TABLE `class` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `year` int(11) DEFAULT NULL,
  `marking` char(1) DEFAULT NULL,
  `name` varchar(10) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `class`
--

INSERT INTO `class` (`id`, `year`, `marking`, `name`, `teacher_id`) VALUES
(00001, 1, 'A', '1A', NULL),
(00002, 1, 'B', '1B', NULL),
(00003, 2, 'A', '2A', NULL),
(00004, 3, 'A', '3A', NULL),
(00005, 4, 'A', '4A', NULL),
(00006, 5, 'A', '5A', NULL),
(00007, 6, 'A', '6A', NULL),
(00008, 7, 'A', '7A', 8),
(00009, 7, 'B', '7B', NULL),
(00010, 8, 'A', '8A', 3),
(00061, 8, 'B', '8B', NULL),
(00065, 2, 'B', '2B', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `finalgrades`
--

CREATE TABLE `finalgrades` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `subjectname` varchar(50) DEFAULT NULL,
  `grade1` int(11) DEFAULT NULL,
  `grade2` int(11) DEFAULT NULL,
  `exam` int(11) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `finalgrades`
--

INSERT INTO `finalgrades` (`id`, `subjectname`, `grade1`, `grade2`, `exam`, `grade`, `student_id`) VALUES
(00001, 'Matematika', 5, NULL, NULL, NULL, 1),
(00002, 'Matematika', NULL, NULL, NULL, NULL, 3),
(00003, 'Matematika', 3, NULL, NULL, NULL, 2),
(00004, 'Matematika', NULL, NULL, NULL, NULL, 6),
(00005, 'Matematika', NULL, NULL, NULL, NULL, 7),
(00006, 'Matematika', NULL, NULL, NULL, NULL, 8),
(00007, 'Matematika', NULL, NULL, NULL, NULL, 9),
(00008, 'Matematika', NULL, NULL, NULL, NULL, 10),
(00009, 'Matematika', NULL, NULL, NULL, NULL, 11),
(00010, 'Matematika', NULL, NULL, NULL, NULL, 12),
(00012, 'Matematika', NULL, NULL, NULL, NULL, 14),
(00014, 'Matematika', NULL, NULL, NULL, NULL, 16),
(00015, 'Matematika', NULL, NULL, NULL, NULL, 17),
(00016, 'Matematika', NULL, NULL, NULL, NULL, 18),
(00017, 'Matematika', NULL, NULL, NULL, NULL, 19),
(00018, 'Matematika', NULL, NULL, NULL, NULL, 20),
(00019, 'Matematika', NULL, NULL, NULL, NULL, 21),
(00020, 'Matematika', NULL, NULL, NULL, NULL, 22),
(00021, 'Matematika', NULL, NULL, NULL, NULL, 23),
(00022, 'Informatika', NULL, NULL, NULL, NULL, 23),
(00023, 'Informatika', NULL, NULL, NULL, NULL, 21),
(00024, 'Informatika', NULL, NULL, NULL, NULL, 22),
(00025, 'Informatika', NULL, NULL, NULL, NULL, 18),
(00026, 'Informatika', NULL, NULL, NULL, NULL, 19),
(00027, 'Informatika', NULL, NULL, NULL, NULL, 20),
(00028, 'Informatika', NULL, NULL, NULL, NULL, 16),
(00029, 'Informatika', NULL, NULL, NULL, NULL, 17),
(00030, 'Informatika', NULL, NULL, NULL, NULL, 14),
(00032, 'Informatika', NULL, NULL, NULL, NULL, 12),
(00034, 'Informatika', NULL, NULL, NULL, NULL, 10),
(00035, 'Informatika', NULL, NULL, NULL, NULL, 11),
(00036, 'Informatika', NULL, NULL, NULL, NULL, 6),
(00037, 'Informatika', NULL, NULL, NULL, NULL, 7),
(00038, 'Informatika', NULL, NULL, NULL, NULL, 8),
(00039, 'Informatika', NULL, NULL, NULL, NULL, 9),
(00040, 'Informatika', NULL, NULL, NULL, NULL, 1),
(00041, 'Informatika', NULL, NULL, NULL, NULL, 3),
(00042, 'Informatika', NULL, NULL, NULL, NULL, 2),
(00043, 'Matematika', NULL, NULL, NULL, NULL, 57),
(00044, 'Informatika', NULL, NULL, NULL, NULL, 57),
(00047, 'Matematika', NULL, NULL, NULL, NULL, 59),
(00048, 'Informatika', NULL, NULL, NULL, NULL, 59),
(00049, 'Angol', NULL, NULL, NULL, NULL, 3),
(00050, 'Angol', NULL, NULL, NULL, NULL, 18),
(00051, 'Angol', NULL, NULL, NULL, NULL, 19),
(00052, 'Angol', NULL, NULL, NULL, NULL, 20),
(00053, 'Kémia', NULL, NULL, NULL, NULL, 3),
(00054, 'Kémia', NULL, NULL, NULL, NULL, 1),
(00055, 'Kémia', NULL, NULL, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `grades1`
--

CREATE TABLE `grades1` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `subjectname` varchar(50) DEFAULT NULL,
  `modulgrades1` varchar(100) DEFAULT NULL,
  `module1` int(11) DEFAULT NULL,
  `modulgrades2` varchar(100) DEFAULT NULL,
  `module2` int(11) DEFAULT NULL,
  `modulgrades3` varchar(100) DEFAULT NULL,
  `module3` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `grades1`
--

INSERT INTO `grades1` (`id`, `subjectname`, `modulgrades1`, `module1`, `modulgrades2`, `module2`, `modulgrades3`, `module3`, `semester`, `student_id`) VALUES
(00001, 'Matematika', '5 5 4 5', 5, '5 4 4', 4, '4 5 5 5 5 5 5 5 3', 5, 5, 1),
(00002, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00003, 'Matematika', '3 3 4', 3, '4 4 3', 4, '3 3 4', 3, 3, 2),
(00004, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6),
(00005, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7),
(00006, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8),
(00007, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9),
(00008, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10),
(00009, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11),
(00010, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12),
(00012, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14),
(00014, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 16),
(00015, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 17),
(00016, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18),
(00017, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 19),
(00018, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20),
(00019, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 21),
(00020, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 22),
(00021, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 23),
(00022, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 23),
(00023, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 21),
(00024, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 22),
(00025, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18),
(00026, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 19),
(00027, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20),
(00028, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 16),
(00029, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 17),
(00030, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14),
(00032, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12),
(00034, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10),
(00035, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11),
(00036, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6),
(00037, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7),
(00038, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8),
(00039, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9),
(00040, 'Informatika', '4 5', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(00041, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00042, 'Informatika', '5 3', NULL, NULL, NULL, NULL, NULL, NULL, 2),
(00043, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 57),
(00044, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 57),
(00047, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 59),
(00048, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 59),
(00049, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00050, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18),
(00051, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 19),
(00052, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20),
(00053, 'Kémia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00054, 'Kémia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(00055, 'Kémia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `grades2`
--

CREATE TABLE `grades2` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `subjectname` varchar(50) DEFAULT NULL,
  `modulgrades1` varchar(100) DEFAULT NULL,
  `module1` int(11) DEFAULT NULL,
  `modulgrades2` varchar(100) DEFAULT NULL,
  `module2` int(11) DEFAULT NULL,
  `modulgrades3` varchar(100) DEFAULT NULL,
  `module3` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `grades2`
--

INSERT INTO `grades2` (`id`, `subjectname`, `modulgrades1`, `module1`, `modulgrades2`, `module2`, `modulgrades3`, `module3`, `semester`, `student_id`) VALUES
(00001, 'Matematika', '', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(00002, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00003, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2),
(00004, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6),
(00005, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7),
(00006, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8),
(00007, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9),
(00008, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10),
(00009, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11),
(00010, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12),
(00012, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14),
(00014, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 16),
(00015, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 17),
(00016, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18),
(00017, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 19),
(00018, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20),
(00019, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 21),
(00020, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 22),
(00021, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 23),
(00022, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 23),
(00023, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 21),
(00024, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 22),
(00025, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18),
(00026, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 19),
(00027, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20),
(00028, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 16),
(00029, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 17),
(00030, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14),
(00032, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12),
(00034, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10),
(00035, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11),
(00036, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6),
(00037, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7),
(00038, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8),
(00039, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9),
(00040, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(00041, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00042, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2),
(00043, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 57),
(00044, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 57),
(00047, 'Matematika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 59),
(00048, 'Informatika', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 59),
(00049, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00050, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18),
(00051, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 19),
(00052, 'Angol', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20),
(00053, 'Kémia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3),
(00054, 'Kémia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(00055, 'Kémia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `student`
--

CREATE TABLE `student` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `name` varchar(50) NOT NULL,
  `birth` date NOT NULL CHECK (`birth` > 1900 / 1 / 1),
  `address` varchar(100) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `student`
--

INSERT INTO `student` (`id`, `name`, `birth`, `address`, `class_id`, `info`) VALUES
(00001, 'Gipsz Jakab', '2008-03-13', 'Hajdúböszörmény', 61, 'Default. Honnan ismerős ez név? ???'),
(00002, 'Gipsz István', '2008-03-11', 'Debrecen', 61, ''),
(00003, 'Belovics István', '2007-12-07', 'Debrecen', 10, ''),
(00006, 'Fehér István', '2009-03-12', 'Hajdúszoboszló', 8, ''),
(00007, 'Nagy Tibor', '2009-04-12', 'Debrecen', 8, ''),
(00008, 'Fekete Gergely', '2009-05-07', 'Hajdúsámson', 9, ''),
(00009, 'Katona Alexandra', '2009-05-07', 'Hajdúsámson', 9, ''),
(00010, 'Katona Patrik', '2010-04-19', 'Debrecen', 7, ''),
(00011, 'Módos Dávid', '2010-05-20', 'Téglás', 7, ''),
(00012, 'Kiss Árpád', '2011-06-20', 'Téglás', 6, ''),
(00014, 'Nagy János', '2012-03-20', 'Téglás', 5, ''),
(00016, 'Rácz Patrik', '2013-02-21', 'Hajdúszoboszló', 4, ''),
(00017, 'Westerburg István', '2013-02-21', 'Hajdúszoboszló', 4, ''),
(00018, 'Szoboszlai Norbert', '2014-01-21', 'Hajdúszoboszló', 3, ''),
(00019, 'Hováth Zoltán', '2014-01-21', 'Debrecen', 3, ''),
(00020, 'Hováth Krisztofer', '2014-03-21', 'Debrecen', 3, ''),
(00021, 'Vajda Gábor', '2015-03-21', 'Debrecen', 1, ''),
(00022, 'Kiss Ádám', '2015-03-11', 'Debrecen', 1, ''),
(00023, 'Komáromi Ádám', '2015-05-12', 'Debrecen', 2, ''),
(00057, 'Nagy István', '2015-02-18', 'Debrecen', 2, ''),
(00059, 'Gipsz Sándor', '2008-03-15', 'Hajdúböszörmény', NULL, '');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subject`
--

CREATE TABLE `subject` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `subject`
--

INSERT INTO `subject` (`id`, `name`) VALUES
(00008, 'Angol'),
(00004, 'Biológia'),
(00003, 'Informatika'),
(00005, 'Irodalom'),
(00002, 'Kémia'),
(00001, 'Matematika');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `teacherregistry`
--

CREATE TABLE `teacherregistry` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `teacherregistry`
--

INSERT INTO `teacherregistry` (`id`, `teacher_id`, `subject_id`, `class_id`) VALUES
(00001, 3, 1, 10),
(00003, 3, 1, 8),
(00004, 3, 1, 9),
(00005, 3, 1, 7),
(00006, 3, 1, 6),
(00007, 3, 1, 5),
(00008, 3, 1, 4),
(00010, 3, 1, 1),
(00011, 3, 1, 2),
(00015, 7, 3, 4),
(00016, 7, 3, 5),
(00017, 7, 3, 6),
(00018, 7, 3, 7),
(00019, 7, 3, 8),
(00020, 7, 3, 9),
(00021, 7, 3, 10),
(00028, 4, 2, 10),
(00029, 4, 2, 61),
(00030, 3, 1, 61),
(00031, 7, 3, 3),
(00032, 7, 3, 61);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int(5) UNSIGNED ZEROFILL NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(50) NOT NULL,
  `birth` date NOT NULL CHECK (`birth` > 1900 / 1 / 1),
  `password` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` smallint(6) DEFAULT NULL CHECK (`role` < 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `firstname`, `lastname`, `name`, `email`, `birth`, `password`, `created_at`, `role`) VALUES
(00001, 'Árpád', 'Szabó', 'szaboarpad', 'arpadszabo1965@gmail.com', '1965-08-24', '$2a$10$DNUud/4Rszue6eob1mUbm.BuOxoRnqnp.iwO3DA.m..lHjeC7qjVG', '2025-01-09 17:42:24', 4),
(00002, 'János', 'Nagy', 'nagyjanos', 'nagyjanos@gmail.com', '1990-08-24', '$2a$10$7TrbfmvGgry6caR/FYXmueGm9SpLfXtarNhjUxkYppCHDPzCDtF.6', '2025-01-09 17:44:54', 2),
(00003, 'Dezső', 'Pallay', 'pallaydezső', 'pallay@gmail.com', '1990-08-24', '$2a$10$bhb87BUc1oQOQNYmnyzatu6ogBUTajbSbROR.JeVyBYbaI9WW3tl.', '2025-01-09 17:45:18', 3),
(00004, 'Tibor', 'Szajkó', 'szajkótibor', 'szajko1950@gmail.com', '1950-01-24', '$2a$10$zYSYQQAX4TqKLSrWPnFe/.GkhWauYK/WSeY2FlUjMOZzvpf875sH.', '2025-01-09 17:46:04', 2),
(00005, 'Árpád', 'Gipsz', 'gipszarpad', 'arpadgipsz@gmail.com', '1978-05-13', '$2a$10$/BPYiZKpwdHhN/rOE2jvpuuvrrp3uIahghjMnTDs2TkGfOrqfqcqS', '2025-01-09 17:47:52', 1),
(00006, 'Márta', 'Riskó', 'riskomarta', 'riskomarta@gmail.com', '1966-06-16', '$2a$10$10Fi/TXBA0PzSVQzf/HxeuRvVfqOC0SE8DsXKmXXmlr0EtsyYSBt2', '2025-01-09 17:49:03', 2),
(00007, 'Géza', 'Jakab', 'jakabgeza', 'jakabgeza@gmail.com', '1995-06-16', '$2a$10$cI6daQfdS3JOOR60ZJwPv.VeUOb3Z2UBBSXBLwYvzK.lO/FOTm9Z.', '2025-01-09 17:50:39', 2),
(00008, 'Anikó', 'Nagy', 'nagyaniko', 'nagyaniko@gmail.com', '1992-08-21', '$2a$10$Et1NekG5Ottm1oj3.rj5cOhqbXMKgmYHPP4.Deb0xdfs.I2H/Q90O', '2025-01-09 17:51:58', 3),
(00009, 'Éva', 'Kálmán', 'kalmaneva', 'kalmaneva@gmail.com', '1964-12-10', '$2a$10$.nshzgKfiZsZeMK3Rpxcp.OU4ouYOfYL4Xy3EvVBgUoEIFgH19Vri', '2025-01-09 17:53:17', 2),
(00044, 'Viktor', 'Hapak', 'viktorhapak', 'viktor.hapak@gmail.com', '2002-05-13', '$2a$10$82trgi9Vidq8cJsVM8U5ueGYCWqLQ3bNw4GgLCDYMDApzZuv63EDm', '2025-03-30 08:29:02', 4),
(00045, 'Anikó', 'Gipsz', 'gipszaniko', 'gipszaniko@gmail.com', '1970-09-23', '$2a$10$YpscLIQLhuvLwPxRAO8SSecY7laiHiXmn.H/9CqfjAo3EyztHwziO', '2025-03-22 12:34:24', 1),
(00046, 'Éva', 'Panykó', 'panykoeva', 'panykoeva@gmail.com', '1971-05-19', '$2a$10$LiRB9BPQmCVGHp6Jf/iz3edOQOjaSIbcEQHSYAhmPti8F26bxvQXi', '2025-03-22 12:39:12', 0),
(00047, 'Péter', 'Gipsz', 'gipszpeti', 'gipszpeter@gmail.com', '1972-05-17', '$2a$10$rLKMFTTnCAag6SmYntO7E.vS0S0ybjJpm4gU9ZcLfbQgqpsCEZ4zK', '2025-03-22 13:38:58', 0);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `children_parent`
--
ALTER TABLE `children_parent`
  ADD PRIMARY KEY (`child_id`,`parent_id`);

--
-- A tábla indexei `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `finalgrades`
--
ALTER TABLE `finalgrades`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `grades1`
--
ALTER TABLE `grades1`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `grades2`
--
ALTER TABLE `grades2`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `teacherregistry`
--
ALTER TABLE `teacherregistry`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `class`
--
ALTER TABLE `class`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT a táblához `finalgrades`
--
ALTER TABLE `finalgrades`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT a táblához `grades1`
--
ALTER TABLE `grades1`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT a táblához `grades2`
--
ALTER TABLE `grades2`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT a táblához `student`
--
ALTER TABLE `student`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT a táblához `subject`
--
ALTER TABLE `subject`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `teacherregistry`
--
ALTER TABLE `teacherregistry`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(5) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE image (
                       id VARCHAR(36) NOT NULL,
                       signature VARCHAR(255) NOT NULL,
                       filename VARCHAR(255) NOT NULL,
                       extension VARCHAR(50) NOT NULL,
                       data LONGBLOB,
                       class_id INT(5) UNSIGNED NULL, -- Changed from INT to match your class table

                       CONSTRAINT pk_image PRIMARY KEY (id),
                       CONSTRAINT uk_image_signature UNIQUE (signature),
                       CONSTRAINT fk_image_class
                           FOREIGN KEY (class_id)
                               REFERENCES `class`(id)
                               ON DELETE SET NULL
                               ON UPDATE CASCADE
);

ALTER TABLE image
    ADD CONSTRAINT uk_name_extension UNIQUE(filename, extension),
    ADD CONSTRAINT chk_extension CHECK (extension IN ('.png', '.jpg', '.jpeg', '.webp', '.gif'));
