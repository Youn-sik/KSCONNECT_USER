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
-- Table structure for table `charge_station`
--

DROP TABLE IF EXISTS `charge_station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charge_station` (
  `station_id` int(10) NOT NULL AUTO_INCREMENT,
  `company_id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL CHECK (`status` in ('Y','N','F','I')),
  `last_state` datetime DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `address_detail` varchar(255) DEFAULT '',
  `available` varchar(50) NOT NULL,
  `park_fee` int(20) NOT NULL,
  `pay_type` varchar(20) NOT NULL,
  `lat` varchar(12) NOT NULL,
  `longi` varchar(12) NOT NULL,
  `purpose` varchar(20) NOT NULL,
  `guide` varchar(50) NOT NULL,
  `reg_date` datetime NOT NULL,
  `up_date` datetime NOT NULL,
  PRIMARY KEY (`station_id`),
  KEY `company_id_FK` (`company_id`),
  CONSTRAINT `company_id_FK1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N','F','I'))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_station`
--

LOCK TABLES `charge_station` WRITE;
/*!40000 ALTER TABLE `charge_station` DISABLE KEYS */;
INSERT INTO `charge_station` VALUES (1,1,'????????? ??? 1????????? ?????? ??? ?????????','Y','2022-01-01 08:00:00','??????????????? ????????? ????????????27?????? 27','','24??????',500,'????????????','37.484528','126.892417','company','????????? ??????','2022-01-01 08:00:00','2022-01-01 08:00:00'),(2,1,'????????? ??? 2????????? ?????? ??? ?????????','Y',NULL,'??????????????? ????????? ????????????27?????? 27','','08:00~20:00',300,'????????????','37.484720','126.892600','company','????????? ??????','2022-01-01 08:00:00','2022-01-01 08:00:00'),(3,2,'????????? ?????? 1??? ?????????','Y',NULL,'????????? ????????? ????????? ?????????35?????? 8','','08:00~20:00',1000,'????????????','37.430466','127.135928','public','????????? ??????','2022-01-01 08:00:00','2022-01-01 08:00:00'),(4,2,'????????? ?????? 2??? ?????????','I',NULL,'????????? ????????? ????????? ?????????35?????? 8','','08:00~20:00',1000,'????????????','37.430560','127.135087','public','????????? ??????','2022-01-01 08:00:00','2022-01-01 08:00:00'),(5,1,'?????????????????????','N',NULL,'??????????????? ????????? ????????????27??? 76 ?????????????????????','','08:00~20:00',500,'????????????','37.485138','126.890649','public','????????? ??????','2022-01-01 08:00:00','2022-01-01 08:00:00'),(6,1,'???????????? ?????? ??? ?????????','F',NULL,'??????????????? ????????? ???????????? 273','','08:00~20:00',1000,'????????????','37.483852','126.893970','company','????????? ??????','2022-01-01 08:00:00','2022-01-01 08:00:00'),(9,2,'test','N',NULL,'test','','08:00~20:00',0,'????????????','37.484631','126.892514','public','test','2022-01-01 08:00:00','2022-01-01 08:00:00');
/*!40000 ALTER TABLE `charge_station` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-21 17:49:39
