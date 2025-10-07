-- phpMyAdmin SQL Dump
-- version 4.9.6
-- https://www.phpmyadmin.net/
--
-- Host: un0au5.myd.infomaniak.com
-- Erstellungszeit: 06. Okt 2025 um 14:06
-- Server-Version: 10.6.21-MariaDB-deb11-log
-- PHP-Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `un0au5_im_3`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Weather`
--

CREATE TABLE `Weather` (
  `id` int(11) UNSIGNED NOT NULL,
  `location_id` int(11) NOT NULL,
  `temperature` float NOT NULL,
  `humidity` float UNSIGNED NOT NULL,
  `rain` float UNSIGNED NOT NULL,
  `weather_code` varchar(200) NOT NULL,
  `windspeed` float UNSIGNED NOT NULL,
  `current_timecode` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `Weather`
--
ALTER TABLE `Weather`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `Weather`
--
ALTER TABLE `Weather`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
