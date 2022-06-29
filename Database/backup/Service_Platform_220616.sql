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
-- Dumping data for table `FAQ_board`
--

LOCK TABLES `FAQ_board` WRITE;
/*!40000 ALTER TABLE `FAQ_board` DISABLE KEYS */;
INSERT INTO `FAQ_board` VALUES (1,'FAQ 사항 테스트 입니다.','FAQ 사항 테스트 내용 데이터 입니다.'),(2,'FAQ 사항 테스트 입니다111.','FAQ 사항 테스트 내용 데이터 입니다.');
/*!40000 ALTER TABLE `FAQ_board` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`device_id`),
  KEY `station_id_FK` (`station_id`),
  CONSTRAINT `station_id_FK1` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N','F','I')),
  CONSTRAINT `CONSTRAINT_2` CHECK (`status` in ('Y','N','F','I'))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_device`
--

LOCK TABLES `charge_device` WRITE;
/*!40000 ALTER TABLE `charge_device` DISABLE KEYS */;
INSERT INTO `charge_device` VALUES (1,1,'현관 충전기 01번','KSF12345','완속','AC 완속','24시간','Y','2022-01-01 08:00:00',1),(2,2,'현관 충전기 01번','KSC23456','완속','AC 완속','08:00~20:00','Y',NULL,1),(3,2,'현관 충전기 02번','KSC34567','완속','AC 완속','08:00~20:00','N',NULL,2),(4,1,'현관 충전기 02번','KSC45678','완속','AC 완속','24시간','F',NULL,2),(5,1,'주차장 충전기 01번','KSC56789','완속','AC 완속','24시간','N',NULL,1),(6,2,'주차장 충전기 01번','KSC7890','완속','AC 완속','08:00~20:00','Y',NULL,3),(7,3,'주차장 충전기 01번','KSS1234','완속','AC 완속','08:00~20:00','Y',NULL,1),(8,3,'주차장 충전기 02번','KSS1233','급속','DC 콤보','08:00~20:00','Y',NULL,2),(9,4,'주차장 충전기 01번','KSS1244','완속','AC 완속','08:00~20:00','I',NULL,1),(10,4,'주차장 충전기 02번','KSS1452','급속','DC 콤보','08:00~20:00','N',NULL,2),(11,5,'현관 충전기 01번','KSA1234','급속','DC 콤보','08:00~20:00','N',NULL,1),(12,5,'현관 충전기 02번','KSA2345','급속','DC 콤보','08:00~20:00','N',NULL,2),(13,6,'현관 충전기 01번','KSE1234','완속','AC 완속','08:00~20:00','F',NULL,1),(14,6,'현관 충전기 02번','KSE2345','완속','AC 완속','08:00~20:00','N',NULL,2);
/*!40000 ALTER TABLE `charge_device` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `charge_price`
--

LOCK TABLES `charge_price` WRITE;
/*!40000 ALTER TABLE `charge_price` DISABLE KEYS */;
INSERT INTO `charge_price` VALUES (1,'Y','Z','Z','N',292.9),(2,'Y','Z','Z','Y',309.1),(3,'N','S','S','Z',204.6),(4,'N','S','M','Z',257),(5,'N','S','L','N',266.3),(6,'N','S','L','Y',281),(7,'N','E','S','Z',187.1),(8,'N','E','M','Z',196.6),(9,'N','E','L','N',200.6),(10,'N','E','L','Y',200.6),(11,'N','W','S','Z',218.5),(12,'N','W','M','Z',240.9),(13,'N','W','L','N',266.3),(14,'N','W','L','Y',281);
/*!40000 ALTER TABLE `charge_price` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `charge_record`
--

LOCK TABLES `charge_record` WRITE;
/*!40000 ALTER TABLE `charge_record` DISABLE KEYS */;
INSERT INTO `charge_record` VALUES (1,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','00바 0000','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 18:16:44','2022-05-30 18:17:24','7','7','0','0','2044.7000000000003','2044.7000000000003','0','0','292.1','292.1','292.1','완속','AC 완속'),(2,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','00바 0000','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 18:21:09','2022-05-30 18:21:21','2','2','0','0','584.2','584.2','0','0','292.1','292.1','292.1','완속','AC 완속'),(3,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 10:22:06','2022-05-31 11:13:23','211','211','0','0','61633.100000000006','61633.100000000006','0','0','292.1','292.1','292.1','완속','AC 완속'),(4,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 11:13:21','2022-05-30 11:13:46','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속'),(5,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 11:17:53','2022-05-31 11:23:42','112','112','0','0','32715.200000000004','32715.200000000004','0','0','292.1','292.1','292.1','완속','AC 완속'),(6,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 11:13:21','2022-05-30 11:13:46','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속'),(7,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 11:13:21','2022-05-30 11:13:46','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속'),(8,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 11:13:21','2022-05-30 11:13:46','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속'),(9,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 11:13:21','2022-05-30 11:13:46','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속'),(10,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 11:13:21','2022-05-30 11:13:46','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속'),(11,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 11:54:03','2022-05-31 11:55:25','102','102','0','0','29794.2','29794.2','0','0','292.1','292.1','292.1','완속','AC 완속'),(12,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 13:19:32','2022-05-31 13:21:24','4','4','0','0','1168.4','1168.4','0','0','292.1','292.1','292.1','완속','AC 완속'),(13,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 13:33:55','2022-05-31 13:36:21','5','5','0','0','1460.5','1460.5','0','0','292.1','292.1','292.1','완속','AC 완속'),(14,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 14:28:47','2022-05-31 14:30:31','3','3','0','0','876.3000000000001','876.3000000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(15,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 14:33:32','2022-05-31 14:59:53','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(16,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:00:54','2022-05-31 15:00:56','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(17,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:02:06','2022-05-31 15:02:08','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(18,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:04:51','2022-05-31 15:04:53','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(19,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:21:40','2022-05-31 15:27:44','12','12','0','0','3505.2000000000003','3505.2000000000003','0','0','292.1','292.1','292.1','완속','AC 완속'),(20,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:30:19','2022-05-31 15:31:19','1','1','0','0','292.1','292.1','0','0','292.1','292.1','292.1','완속','AC 완속'),(21,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:33:57','2022-05-31 15:35:10','2','2','0','0','584.2','584.2','0','0','292.1','292.1','292.1','완속','AC 완속'),(22,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:36:32','2022-05-31 15:41:15','10','10','0','0','2921','2921','0','0','292.1','292.1','292.1','완속','AC 완속'),(23,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 15:42:27','2022-05-31 15:51:09','18','18','0','0','5257.8','5257.8','0','0','292.1','292.1','292.1','완속','AC 완속'),(24,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 16:38:18','2022-05-31 16:38:45','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(25,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-31 16:56:57','2022-05-31 16:59:32','5','5','0','0','1460.5','1460.5','0','0','292.1','292.1','292.1','완속','AC 완속'),(26,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 08:51:33','2022-06-02 08:51:35','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(27,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 08:54:47','2022-06-02 08:54:48','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(28,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:02:36','2022-06-02 09:02:38','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(29,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:04:57','2022-06-02 09:09:26','9','9','0','0','2628.9','2628.9','0','0','292.1','292.1','292.1','완속','AC 완속'),(30,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:11:43','2022-06-02 09:11:44','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(31,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:15:35','2022-06-02 09:15:36','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(32,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:18:34','2022-06-02 09:18:36','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(33,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:21:31','2022-06-02 09:21:32','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(34,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:24:51','2022-06-02 09:26:25','3','3','0','0','876.3000000000001','876.3000000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(35,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 09:26:51','2022-06-02 09:30:47','8','8','0','0','2336.8','2336.8','0','0','292.1','292.1','292.1','완속','AC 완속'),(36,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 10:10:49','2022-06-02 10:11:58','2','2','0','0','584.2','584.2','0','0','292.1','292.1','292.1','완속','AC 완속'),(37,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 10:59:43','2022-06-02 11:00:16','1','1','0','0','292.1','292.1','0','0','292.1','292.1','292.1','완속','AC 완속'),(38,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 11:36:47','2022-06-02 11:39:22','5','5','0','0','1460.5','1460.5','0','0','292.1','292.1','292.1','완속','AC 완속'),(39,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 11:54:42','2022-06-02 11:54:50','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(40,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 11:55:29','2022-06-02 11:55:33','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(41,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 11:55:59','2022-06-02 12:04:17','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(42,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 13:23:32','2022-06-02 13:25:58','5','5','0','0','1460.5','1460.5','0','0','292.1','292.1','292.1','완속','AC 완속'),(43,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 13:29:05','2022-06-02 13:30:39','3','3','0','0','876.3000000000001','876.3000000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(44,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 13:31:14','2022-06-02 13:31:28','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(45,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 13:38:25','2022-06-02 14:00:41','48','48','0','0','14020.800000000001','14020.800000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(46,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 14:03:35','2022-06-02 14:05:33','4','4','0','0','1168.4','1168.4','0','0','292.1','292.1','292.1','완속','AC 완속'),(47,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 14:07:51','2022-06-02 14:09:28','3','3','0','0','876.3000000000001','876.3000000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(48,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 14:10:36','2022-06-02 14:12:04','3','3','0','0','876.3000000000001','876.3000000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(49,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 14:14:43','2022-06-02 14:16:41','4','4','0','0','1168.4','1168.4','0','0','292.1','292.1','292.1','완속','AC 완속'),(50,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 14:17:31','2022-06-02 14:20:29','6','6','0','0','1752.6000000000001','1752.6000000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(51,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 14:42:57','2022-06-02 15:02:33','42','42','0','0','12268.2','12268.2','0','0','292.1','292.1','292.1','완속','AC 완속'),(52,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 15:12:06','2022-06-02 15:29:34','126','126','0','0','36804.600000000006','36804.600000000006','0','0','292.1','292.1','292.1','완속','AC 완속'),(53,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 15:44:11','2022-06-02 15:48:56','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속'),(54,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 15:52:38','2022-06-02 15:52:41','0','0','0','0','0','0','0','0','292.1','292.1','292.1','완속','AC 완속'),(55,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 16:34:03','2022-06-02 16:42:06','35','35','0','0','10223.5','10223.5','0','0','292.1','292.1','292.1','완속','AC 완속'),(56,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 16:45:54','2022-06-02 16:46:48','3','3','0','0','876.3000000000001','876.3000000000001','0','0','292.1','292.1','292.1','완속','AC 완속'),(57,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-06-02 16:47:18','2022-06-02 17:18:29','136','136','0','0','39725.600000000006','39725.600000000006','0','0','292.1','292.1','292.1','완속','AC 완속'),(58,1,1,1,'aa01010493e3ae4993ff','N','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','신용카드','Y','2022-05-30 11:13:21','2022-05-30 11:13:46','20','20','0','0','5842','5842','0','0','292.1','292.1','292.1','완속','AC 완속');
/*!40000 ALTER TABLE `charge_record` ENABLE KEYS */;
UNLOCK TABLES;

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
  `available` varchar(50) NOT NULL,
  `park_fee` int(20) NOT NULL,
  `pay_type` varchar(20) NOT NULL,
  `lat` varchar(12) NOT NULL,
  `longi` varchar(12) NOT NULL,
  `purpose` varchar(20) NOT NULL,
  PRIMARY KEY (`station_id`),
  KEY `company_id_FK` (`company_id`),
  CONSTRAINT `company_id_FK1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('Y','N','F','I'))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charge_station`
--

LOCK TABLES `charge_station` WRITE;
/*!40000 ALTER TABLE `charge_station` DISABLE KEYS */;
INSERT INTO `charge_station` VALUES (1,1,'쿨사인 제 1주차장 현관 앞 충전소','Y','2022-01-01 08:00:00','서울특별시 구로구 디지털로27바길 27','24시간',500,'신용카드','37.484528','126.892417','company'),(2,1,'쿨사인 제 2주차장 현관 앞 충전소','Y',NULL,'서울특별시 구로구 디지털로27바길 27','08:00~20:00',300,'신용카드','37.484720','126.892600','company'),(3,2,'조가네 지하 1층 주차장','Y',NULL,'경기도 성남시 중원구 제일로35번길 8','08:00~20:00',1000,'신용카드','37.430466','127.135928','public'),(4,2,'조가네 지하 2층 주차장','I',NULL,'경기도 성남시 중원구 제일로35번길 8','08:00~20:00',1000,'신용카드','37.430560','127.135087','public'),(5,1,'구로남초등학교','N',NULL,'서울특별시 구로구 디지털로27길 76 구로남초등학교','08:00~20:00',500,'신용카드','37.485138','126.890649','public'),(6,1,'국민은행 현관 앞 충전소','F',NULL,'서울특별시 구로구 디지털로 273','08:00~20:00',1000,'신용카드','37.483852','126.893970','company');
/*!40000 ALTER TABLE `charge_station` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'쿨사인','02-8055-8055'),(2,'조가','02-822-8454');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `company_user`
--

LOCK TABLES `company_user` WRITE;
/*!40000 ALTER TABLE `company_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_user` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `inquiry_board`
--

LOCK TABLES `inquiry_board` WRITE;
/*!40000 ALTER TABLE `inquiry_board` DISABLE KEYS */;
INSERT INTO `inquiry_board` VALUES (1,1,'etc','1대1 문의사항 제목','1대1 문의사항 본문','2022-05-09 10:49:18','C'),(3,1,'etc','1대1 문의사항 제목','1대1 문의사항 본문','2022-05-09 10:49:35','N'),(5,3,'etc','1대1 문의사항 제목','1대1 문의사항 본문','2022-05-09 10:50:10','N'),(6,3,'etc','1대1 문의사항 제목','1대1 문의사항 본문','2022-05-09 10:50:10','N'),(7,3,'etc','1대1 문의사항 제목','1대1 문의사항 본문','2022-05-09 10:50:11','N'),(8,9,'normal','일반 문의 제목1','일반 문의 본문1','2022-05-10 17:47:28','N'),(9,9,'charge','충전 문의 제목1','충전 문의 본문1','2022-05-10 17:47:52','N'),(10,9,'card','카드 문의 제목1','카드 문의 본문1','2022-05-10 17:48:12','N'),(11,9,'etc','기타 문의 제목1','기타 문의 본문1','2022-05-10 17:48:26','N'),(14,11,'normal','1대1 문의사항 제목','1대1 문의사항 본문','2022-05-16 10:54:59','N'),(15,11,'card','dddd','dddd','2022-05-16 11:27:34','N'),(18,9,'charge','test 제목','test 내용','2022-05-23 14:30:57','N'),(19,9,'user','hello','내용내용','2022-05-23 16:05:49','N'),(26,1,'card','문의 테스트입니다다다다다','테스트로 문의드립니다\n문의문의\nㅇㅇㅇ ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ','2022-05-31 09:13:29','N');
/*!40000 ALTER TABLE `inquiry_board` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `notice_board`
--

LOCK TABLES `notice_board` WRITE;
/*!40000 ALTER TABLE `notice_board` DISABLE KEYS */;
INSERT INTO `notice_board` VALUES (1,'공지사항 테스트','이 내용은 공지사항 기능 테스트를 위한 글 입니다.','2022-05-02 16:41:01');
/*!40000 ALTER TABLE `notice_board` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `point_record`
--

LOCK TABLES `point_record` WRITE;
/*!40000 ALTER TABLE `point_record` DISABLE KEYS */;
INSERT INTO `point_record` VALUES (14,1,'P',0,30000,30000,'2022-04-28 10:17:18'),(15,1,'P',30000,210000,240000,'2022-04-28 10:17:38'),(16,2,'P',0,100000,100000,'2022-04-28 10:18:00'),(17,1,'P',240000,100000,340000,'2022-05-10 17:42:25'),(18,11,'P',0,300000,300000,'2022-05-13 16:12:10'),(19,11,'P',300000,140000,440000,'2022-05-13 16:46:21'),(20,11,'P',440000,70000,510000,'2022-05-13 16:47:15'),(21,11,'P',510000,50000,560000,'2022-05-13 16:48:59'),(22,11,'P',560000,70000,630000,'2022-05-13 16:49:19'),(23,11,'P',630000,50000,680000,'2022-05-13 16:49:50'),(24,11,'P',680000,50000,730000,'2022-05-13 16:50:15'),(25,11,'P',730000,30000,760000,'2022-05-13 16:52:18'),(26,10,'P',0,500000,500000,'2022-05-24 11:46:09');
/*!40000 ALTER TABLE `point_record` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'3만원권 멤버십 선불상품','본 상품의 유효기간은 구매일로부터 1년입니다. 유효기간 이후 잔액은 소멸처리 됩니다.',30000),(2,'5만원권 멤버십 선불상품','본 상품의 유효기간은 구매일로부터 1년입니다. 유효기간 이후 잔액은 소멸처리 됩니다.',50000),(3,'7만원권 멤버십 선불상품','본 상품의 유효기간은 구매일로부터 1년입니다. 유효기간 이후 잔액은 소멸처리 됩니다.',70000),(4,'10만원권 멤버십 선불상품','본 상품의 유효기간은 구매일로부터 1년입니다. 유효기간 이후 잔액은 소멸처리 됩니다.',100000);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `product_record`
--

LOCK TABLES `product_record` WRITE;
/*!40000 ALTER TABLE `product_record` DISABLE KEYS */;
INSERT INTO `product_record` VALUES (23,1,1,'Y',30000,1,'2022-04-28 10:17:18',30000),(24,1,3,'Y',70000,3,'2022-04-28 10:17:38',210000),(25,2,2,'Y',50000,2,'2022-04-28 10:18:00',100000),(26,1,2,'Y',50000,2,'2022-05-10 17:42:25',100000),(27,11,4,'Y',100000,3,'2022-05-13 16:12:10',300000),(28,11,3,'Y',70000,2,'2022-05-13 16:46:21',140000),(29,11,3,'Y',70000,1,'2022-05-13 16:47:15',70000),(30,11,2,'Y',50000,1,'2022-05-13 16:48:59',50000),(31,11,3,'Y',70000,1,'2022-05-13 16:49:19',70000),(32,11,2,'Y',50000,1,'2022-05-13 16:49:50',50000),(33,11,2,'Y',50000,1,'2022-05-13 16:50:15',50000),(34,11,1,'Y',30000,1,'2022-05-13 16:52:18',30000),(35,10,4,'Y',100000,5,'2022-05-24 11:46:09',500000);
/*!40000 ALTER TABLE `product_record` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `report_board`
--

LOCK TABLES `report_board` WRITE;
/*!40000 ALTER TABLE `report_board` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_board` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `review_board`
--

LOCK TABLES `review_board` WRITE;
/*!40000 ALTER TABLE `review_board` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_board` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'cho','12345','조윤식','yscho20@koolsign.net','010-3288-6714','서울특별시 구로구 디지털로27바길 27','현대 아이오닉 5','37도 6702','토스뱅크','5327501015763628','0000000000000000',340000,'aa01010493e3ae4993ff'),(2,'cho0','12345','정복순','yscho11@koolsign.net','010-1111-1111','서울특별시 구로구 디지털로27바길 27','현대 아이오닉 5','11바 1111',NULL,NULL,NULL,100000,'aa01010493e3ae4993f0'),(3,'cho1','12345','김복돌','yscho30@koolsign.net','010-0000-0000','서울특별시 구로구 디지털로27바길 27','현대 아이오닉 5','22바 2222',NULL,NULL,NULL,0,'aa01010493e3ae4993f1'),(4,'cho2','12345','김복돌','yscho00@koolsign.net','010-0000-0000','서울특별시 구로구 디지털로27바길 27','현대 아이오닉 5','00바 0000',NULL,NULL,NULL,0,'aa01010493e3ae4993f2'),(9,'soo','12345','이수경','test@naver.com','010-1234-5678','서울특별시 구로구','ev6','12모 1234','기업은행','0000000000000000','0000000000000000',0,'aa01010493e3ae4993f3'),(10,'ddd','dddd','ddd','dddd@koolsign.net','010-0000-0000','','현대 아이오닉5','11바 1111','하나은행','0000000000000000','0000000000000000',500000,'aa01010493e3ae4993f4'),(11,'ccc','cccc','cccc','cccc@cccc','01011112222','','3','123c 1111','','','',760000,'aa01010493e3ae4993f5'),(12,'ccc','cccc','cccc','ccc@cccc','01011112222','','2','ccccccccc','','','',0,'aa01010493e3ae4993f6'),(13,'ccc','cccc','cccc','ccc@cccc','01011112222','','1','ccccccccc','','','',0,'aa01010493e3ae4993f7'),(14,'aa','aa','aa','yscho00@koolsign.net','010-0000-0000','서울특별시 구로구 디지털로27바길 27','현대 아이오닉 5','00바 0000',NULL,NULL,NULL,0,'aa01010493e3ae4993f8'),(15,'koolsign','koolsign','쿨사인','koolsign@koolsign.net','010-9876-5432','','GV60','123나 4567','','','',0,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-16 17:42:15
