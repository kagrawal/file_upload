-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 28, 2012 at 10:14 AM
-- Server version: 5.5.20
-- PHP Version: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nodeexercise`
--
CREATE DATABASE `nodeexercise` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `nodeexercise`;

-- --------------------------------------------------------

--
-- Table structure for table `uploadedfiles`
--

CREATE TABLE `uploadedfiles` (
  `fileid` int(10) NOT NULL AUTO_INCREMENT,
  `filename` text NOT NULL,
  `uploadedfilename` text NOT NULL,
  `wordcount` int(10) NOT NULL,
  `linecount` int(10) NOT NULL,
  `filetext` text NOT NULL,
  PRIMARY KEY (`fileid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
