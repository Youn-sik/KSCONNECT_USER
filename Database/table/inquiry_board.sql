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
  `reply` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`inquiry_id`),
  KEY `uid_FK` (`uid`),
  CONSTRAINT `uid_FK4` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `CONSTRAINT_2` CHECK (`type` in ('normal','charge','user','card','discharge','etc')),
  CONSTRAINT `CONSTRAINT_1` CHECK (`status` in ('N','Y','C'))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_board`
--

LOCK TABLES `inquiry_board` WRITE;
/*!40000 ALTER TABLE `inquiry_board` DISABLE KEYS */;
INSERT INTO `inquiry_board` VALUES (1,1,'etc','1대1 문의사항 제목','1대1 문의사항 본문','','2022-05-09 10:49:18','C'),(3,1,'etc','1대1 문의사항 제목','1대1 문의사항 본문','','2022-05-09 10:49:35','N'),(5,3,'etc','1대1 문의사항 제목','1대1 문의사항 본문','','2022-05-09 10:50:10','N'),(6,3,'etc','1대1 문의사항 제목','1대1 문의사항 본문','','2022-05-09 10:50:10','N'),(7,3,'etc','1대1 문의사항 제목','1대1 문의사항 본문','','2022-05-09 10:50:11','N'),(8,9,'normal','일반 문의 제목1','일반 문의 본문1','','2022-05-10 17:47:28','N'),(9,9,'charge','충전 문의 제목1','충전 문의 본문1','','2022-05-10 17:47:52','N'),(10,9,'card','카드 문의 제목1','카드 문의 본문1','','2022-05-10 17:48:12','N'),(11,9,'etc','기타 문의 제목1','기타 문의 본문1','','2022-05-10 17:48:26','N');

/*!40000 ALTER TABLE `inquiry_board` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-23 11:44:30
