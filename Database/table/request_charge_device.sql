-- MariaDB dump 10.19  Distrib 10.5.15-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Service_Platform
-- ------------------------------------------------------
-- Server version	10.5.15-MariaDB-1:10.5.15+maria~bionic

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `request_charge_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `request_charge_device` (
  `request_id` int(10) NOT NULL AUTO_INCREMENT,
  `device_id` int(10) DEFAULT NULL,
  `request_uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `sirial` varchar(50) NOT NULL,
  `charge_type` varchar(20) NOT NULL,
  `charge_way` varchar(60) NOT NULL,
  `available` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL CHECK (`status` in ('Y','N','F','I')),
  `device_number` int(20) NOT NULL,
  `request_time` datetime NOT NULL,
  `request_status` varchar(20) NOT NULL CHECK (`request_status` in ('C','U','D')),
  PRIMARY KEY (`request_id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N','F','I')),
  CONSTRAINT `CONSTRAINT_2` CHECK (`request_status` in ('C','U','D')),
  CONSTRAINT `company_manager_id_FK1` FOREIGN KEY (`request_uid`) REFERENCES `company_manager` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
