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

--
-- Table structure for table `charge_device`
--

DROP TABLE IF EXISTS `charge_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charge_device` (
  `device_id` int(10) NOT NULL AUTO_INCREMENT,
  `station_id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `sirial` varchar(50) NOT NULL,
  `charge_type` varchar(20) NOT NULL,
  `charge_way` varchar(60) NOT NULL,
  `available` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL CHECK (`status` in ('Y','N','F','I')),
  `last_state` datetime DEFAULT NULL,
  `device_number` int(20) NOT NULL,
  `reg_date` datetime NOT NULL,
  `up_date` datetime NOT NULL,
  `usage` int DEFAULT 0,
  PRIMARY KEY (`device_id`),
  KEY `station_id_FK` (`station_id`),
  CONSTRAINT `station_id_FK1` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N','F','I')),
  CONSTRAINT `CONSTRAINT_2` CHECK (`status` in ('Y','N','F','I'))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_device`
--

LOCK TABLES `charge_device` WRITE;
/*!40000 ALTER TABLE `charge_device` DISABLE KEYS */;
INSERT INTO `charge_device` VALUES (1,1,'현관 충전기 01번','KSF12345','완속','AC 완속','24시간','Y','2022-01-01 08:00:00',1,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(2,2,'현관 충전기 01번','KSC23456','완속','AC 완속','08:00~20:00','Y',NULL,1,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(3,2,'현관 충전기 02번','KSC34567','완속','AC 완속','08:00~20:00','N',NULL,2,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(4,1,'현관 충전기 02번','KSC45678','완속','AC 완속','24시간','F',NULL,2,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(5,1,'주차장 충전기 01번','KSC56789','완속','AC 완속','24시간','N',NULL,1,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(6,2,'주차장 충전기 01번','KSC7890','완속','AC 완속','08:00~20:00','Y',NULL,3,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(7,3,'주차장 충전기 01번','KSS1234','완속','AC 완속','08:00~20:00','Y',NULL,1,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(8,3,'주차장 충전기 02번','KSS1233','급속','DC 콤보','08:00~20:00','Y',NULL,2,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(9,4,'주차장 충전기 01번','KSS1244','완속','AC 완속','08:00~20:00','I',NULL,1,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(10,4,'주차장 충전기 02번','KSS1452','급속','DC 콤보','08:00~20:00','N',NULL,2,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(11,5,'현관 충전기 01번','KSA1234','급속','DC 콤보','08:00~20:00','N',NULL,1,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(12,5,'현관 충전기 02번','KSA2345','급속','DC 콤보','08:00~20:00','N',NULL,2,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(13,6,'현관 충전기 01번','KSE1234','완속','AC 완속','08:00~20:00','F',NULL,1,'2022-01-01 08:00:00','2022-01-01 08:00:00',''),(14,6,'현관 충전기 02번','KSE2345','완속','AC 완속','08:00~20:00','N',NULL,2,'2022-01-01 08:00:00','2022-01-01 08:00:00','');
/*!40000 ALTER TABLE `charge_device` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-24 13:37:04
