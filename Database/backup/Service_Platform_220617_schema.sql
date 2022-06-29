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
-- Table structure for table `FAQ_board`
--

DROP TABLE IF EXISTS `FAQ_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FAQ_board` (
  `FAQ_id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  PRIMARY KEY (`FAQ_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  PRIMARY KEY (`device_id`),
  KEY `station_id_FK` (`station_id`),
  CONSTRAINT `station_id_FK1` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N','F','I')),
  CONSTRAINT `CONSTRAINT_2` CHECK (`status` in ('Y','N','F','I'))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `charge_price`
--

DROP TABLE IF EXISTS `charge_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charge_price` (
  `charge_price_id` int(10) NOT NULL AUTO_INCREMENT,
  `public` varchar(20) NOT NULL,
  `season` varchar(20) NOT NULL,
  `power` varchar(20) NOT NULL,
  `kw100` varchar(20) NOT NULL,
  `price` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`charge_price_id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`public` in ('Y','N')),
  CONSTRAINT `CONSTRAINT_2` CHECK (`season` in ('S','W','E','Z')),
  CONSTRAINT `CONSTRAINT_3` CHECK (`power` in ('S','M','L','Z')),
  CONSTRAINT `CONSTRAINT_4` CHECK (`kw100` in ('Y','N','Z'))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `charge_record`
--

DROP TABLE IF EXISTS `charge_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `charge_record` (
  `charge_record_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `device_id` int(10) NOT NULL,
  `emaid` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `car_model` varchar(80) NOT NULL,
  `car_number` varchar(50) NOT NULL,
  `pay_card_company` varchar(50) NOT NULL,
  `pay_card_number` varchar(50) NOT NULL,
  `pay_method` varchar(50) NOT NULL,
  `pay_status` varchar(50) NOT NULL,
  `charge_st_date` datetime NOT NULL,
  `charge_end_date` datetime NOT NULL,
  `charge_kwh` varchar(20) NOT NULL,
  `charge_kwh1` varchar(20) NOT NULL,
  `charge_kwh2` varchar(20) NOT NULL,
  `charge_kwh3` varchar(20) NOT NULL,
  `charge_amt` varchar(20) NOT NULL,
  `charge_amt1` varchar(20) NOT NULL,
  `charge_amt2` varchar(20) NOT NULL,
  `charge_amt3` varchar(20) NOT NULL,
  `sp_ucost1` varchar(20) NOT NULL,
  `sp_ucost2` varchar(20) NOT NULL,
  `sp_ucost3` varchar(20) NOT NULL,
  `charge_type` varchar(20) NOT NULL,
  `charge_way` varchar(50) NOT NULL,
  PRIMARY KEY (`charge_record_id`),
  KEY `uid_FK` (`uid`),
  KEY `station_id_FK` (`station_id`),
  KEY `device_id_FK` (`device_id`),
  CONSTRAINT `device_id_FK1` FOREIGN KEY (`device_id`) REFERENCES `charge_device` (`device_id`),
  CONSTRAINT `station_id_FK2` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `uid_FK3` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N')),
  CONSTRAINT `CONSTRAINT_2` CHECK (`pay_status` in ('Y','N'))
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `company_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `company_number` varchar(20) NOT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `company_user`
--

DROP TABLE IF EXISTS `company_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_user` (
  `cuid` int(10) NOT NULL AUTO_INCREMENT,
  `company_id` int(10) NOT NULL,
  `level` int(10) NOT NULL,
  `id` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  PRIMARY KEY (`cuid`),
  KEY `company_id_FK` (`company_id`),
  CONSTRAINT `company_id_FK2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content` (
  `content_id` int(10) NOT NULL AUTO_INCREMENT,
  `usage` varchar(20) NOT NULL,
  `usage_id` int(10) NOT NULL,
  `content_url` varchar(255) NOT NULL,
  PRIMARY KEY (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inquiry_board`
--

DROP TABLE IF EXISTS `inquiry_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inquiry_board` (
  `inquiry_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`inquiry_id`),
  KEY `uid_FK` (`uid`),
  CONSTRAINT `uid_FK4` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `CONSTRAINT_2` CHECK (`type` in ('normal','charge','user','card','discharge','etc')),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('N','Y','C'))
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notice_board`
--

DROP TABLE IF EXISTS `notice_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notice_board` (
  `notice_id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `point_record`
--

DROP TABLE IF EXISTS `point_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `point_record` (
  `ponint_record_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `status` varchar(20) NOT NULL,
  `current_point` int(20) NOT NULL,
  `calculate_point` int(20) NOT NULL,
  `remain_point` int(20) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`ponint_record_id`),
  KEY `uid_FK` (`uid`),
  CONSTRAINT `uid_FK1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('P','M'))
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `product_id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `price` int(20) NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_record`
--

DROP TABLE IF EXISTS `product_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_record` (
  `product_record_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `product_id` int(10) NOT NULL,
  `status` varchar(20) NOT NULL,
  `product_price` int(20) NOT NULL,
  `product_count` int(20) NOT NULL DEFAULT 1,
  `date` datetime NOT NULL,
  `all_price` int(20) NOT NULL,
  PRIMARY KEY (`product_record_id`),
  KEY `uid_FK` (`uid`),
  KEY `product_id_FK` (`product_id`),
  CONSTRAINT `product_id_FK` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `uid_FK2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N'))
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report_board`
--

DROP TABLE IF EXISTS `report_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_board` (
  `report_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `device_id` int(10) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`report_id`),
  KEY `uid_FK` (`uid`),
  KEY `station_id_FK` (`station_id`),
  KEY `device_id_FK` (`device_id`),
  CONSTRAINT `device_id_FK2` FOREIGN KEY (`device_id`) REFERENCES `charge_device` (`device_id`),
  CONSTRAINT `station_id_FK4` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `uid_FK6` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `review_board`
--

DROP TABLE IF EXISTS `review_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review_board` (
  `review_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `star` int(10) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `uid_FK` (`uid`),
  KEY `station_id_FK` (`station_id`),
  CONSTRAINT `station_id_FK3` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `uid_FK5` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `car_model` varchar(80) NOT NULL,
  `car_number` varchar(50) NOT NULL,
  `payment_card_company` varchar(50) DEFAULT NULL,
  `payment_card_number` varchar(50) DEFAULT NULL,
  `membership_card_number` varchar(50) DEFAULT NULL,
  `point` int(255) NOT NULL DEFAULT 0,
  `rfid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-17 17:42:11
