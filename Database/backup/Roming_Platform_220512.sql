-- MariaDB dump 10.19  Distrib 10.5.15-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Roming_Platform
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
  `cpid` varchar(37) NOT NULL,
  `spid` varchar(3) NOT NULL,
  `csid` varchar(37) NOT NULL,
  `cpnm` varchar(50) NOT NULL,
  `use_time` varchar(24) NOT NULL,
  `open_yn` varchar(1) NOT NULL,
  `show_yn` varchar(1) NOT NULL,
  `spcsid` varchar(37) DEFAULT NULL,
  `spcpid` varchar(37) DEFAULT NULL,
  `charge_ucost1` varchar(10) NOT NULL,
  `charge_ucost2` varchar(10) DEFAULT NULL,
  `charge_ucost3` varchar(10) DEFAULT NULL,
  `use_yn` varchar(1) NOT NULL,
  `oper_st_ymd` varchar(8) NOT NULL,
  `oper_end_ymd` varchar(8) NOT NULL,
  `outlet_cnt` varchar(5) NOT NULL,
  `pnc_yn` varchar(1) DEFAULT NULL,
  `cpkw` varchar(5) NOT NULL,
  `charge_div` varchar(1) NOT NULL,
  `cp_tp` varchar(2) NOT NULL,
  `postcd` varchar(5) NOT NULL,
  `cs_div` varchar(1) NOT NULL,
  `outlet_div` varchar(1) NOT NULL,
  `conn_div` varchar(1) NOT NULL,
  `charge_kw` varchar(1) NOT NULL,
  `service_div` varchar(1) NOT NULL,
  `net_div` varchar(1) NOT NULL,
  `auth_div` varchar(1) NOT NULL,
  `compty_div` varchar(1) NOT NULL,
  `ami_cert` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cpid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_device`
--

LOCK TABLES `charge_device` WRITE;
/*!40000 ALTER TABLE `charge_device` DISABLE KEYS */;
/*!40000 ALTER TABLE `charge_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charge_device_reserv`
--

DROP TABLE IF EXISTS `charge_device_reserv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charge_device_reserv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cpid` varchar(37) NOT NULL,
  `provider_id` varchar(3) DEFAULT NULL,
  `reserv_st_date` varchar(14) DEFAULT NULL,
  `reserv_end_date` varchar(14) DEFAULT NULL,
  `cardno` varchar(16) DEFAULT NULL,
  `reserv_date` varchar(14) DEFAULT NULL,
  `reserv_id` varchar(16) DEFAULT NULL,
  `charge_yn` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cpid_FK` (`cpid`),
  CONSTRAINT `cpid_FK2` FOREIGN KEY (`cpid`) REFERENCES `charge_device` (`cpid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_device_reserv`
--

LOCK TABLES `charge_device_reserv` WRITE;
/*!40000 ALTER TABLE `charge_device_reserv` DISABLE KEYS */;
/*!40000 ALTER TABLE `charge_device_reserv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charge_device_status`
--

DROP TABLE IF EXISTS `charge_device_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charge_device_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cpid` varchar(37) NOT NULL,
  `outlet_id` varchar(3) NOT NULL,
  `status_cd` varchar(1) NOT NULL,
  `status_dtl_cd` varchar(2) NOT NULL,
  `update_time` varchar(14) NOT NULL,
  `charge_st_date` varchar(14) DEFAULT NULL,
  `charge_soc` varchar(5) DEFAULT NULL,
  `charge_type` varchar(1) DEFAULT NULL,
  `stop_yn` varchar(1) DEFAULT NULL,
  `stop_st_date` varchar(14) DEFAULT NULL,
  `stop_end_date` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cpid_FK` (`cpid`),
  CONSTRAINT `cpid_FK1` FOREIGN KEY (`cpid`) REFERENCES `charge_device` (`cpid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_device_status`
--

LOCK TABLES `charge_device_status` WRITE;
/*!40000 ALTER TABLE `charge_device_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `charge_device_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `charge_station`
--

DROP TABLE IF EXISTS `charge_station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charge_station` (
  `csid` varchar(37) NOT NULL,
  `spid` varchar(3) NOT NULL,
  `csnm` varchar(100) NOT NULL,
  `daddr` varchar(200) NOT NULL,
  `addr` varchar(200) DEFAULT NULL,
  `addr_dtl` varchar(50) DEFAULT NULL,
  `lat` varchar(12) NOT NULL,
  `longi` varchar(12) NOT NULL,
  `use_time` varchar(24) NOT NULL,
  `show_yn` varchar(1) NOT NULL,
  `spcsid` varchar(37) NOT NULL,
  `park_fee_yn` varchar(1) NOT NULL,
  `park_fee` varchar(30) NOT NULL,
  `spcall` varchar(15) NOT NULL,
  `member_yn` varchar(1) NOT NULL,
  `open_yn` varchar(1) NOT NULL,
  `use_yn` varchar(1) NOT NULL,
  `postcd` varchar(5) NOT NULL,
  `cs_div` varchar(1) NOT NULL,
  `sido` varchar(2) NOT NULL,
  `sigungu` varchar(3) NOT NULL,
  `oper_st_ymd` varchar(8) NOT NULL,
  `oper_end_ymd` varchar(8) NOT NULL,
  `update_time` varchar(14) NOT NULL,
  PRIMARY KEY (`csid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_station`
--

LOCK TABLES `charge_station` WRITE;
/*!40000 ALTER TABLE `charge_station` DISABLE KEYS */;
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

-- Dump completed on 2022-05-12 11:37:31
