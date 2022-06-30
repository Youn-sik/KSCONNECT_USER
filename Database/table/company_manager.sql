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
-- Table structure for table `company_manager`
--

DROP TABLE IF EXISTS `company_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_manager` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `id` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `zip_no` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `car_model` varchar(80) DEFAULT NULL,
  `car_number` varchar(50) DEFAULT NULL,
  `payment_card_company` varchar(50) DEFAULT NULL,
  `payment_card_number` varchar(50) DEFAULT NULL,
  `pay_type` varchar(50) DEFAULT NULL,
  `registration` varchar(100) DEFAULT NULL,
  `certificate` varchar(100) DEFAULT NULL,
  `warrant` varchar(100) DEFAULT NULL,
  `copyid` varchar(100) DEFAULT NULL,
  `cal_name` varchar(50) DEFAULT NULL,
  `cal_email` varchar(50) DEFAULT NULL,
  `cal_mobile` varchar(50) DEFAULT NULL,
  `cal_tel` varchar(50) DEFAULT NULL,
  `cal_fax` varchar(50) DEFAULT NULL,
  `sms_status` varchar(20) DEFAULT NULL,
  `email_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_manager`
--

LOCK TABLES `company_manager` WRITE;
/*!40000 ALTER TABLE `company_manager` DISABLE KEYS */;
INSERT INTO `company_manager` VALUES (14,'yxesboy','1','ryu','yxesboy@naver.com','010-9561-0258',NULL,'서울특별시 구로구 디지털로27바길 27','아이오닉6','1','국민은행','1234-1234-1114-1114','즉시결제','','','','','ryu1','ryu1@koolsign.net','010-1111-1111','010-2222-2222','03-03330-0333','0','1'),(15,'test','12345','test','123@naver.com','010-9561',NULL,'서울특별시 구로구 디지털로27바길 27','아이오닉6','1','국민은행','1234-1234-1114-1114','즉시결제',NULL,NULL,NULL,NULL,'ryu1','ryu1@koolsign.net','010-1111-1111','010-2222-2222','03-03330-0333','0','1'),(16,'ryu','r','r',NULL,'r',NULL,'r','r','r','r','r','immediate',NULL,NULL,NULL,NULL,'r','r@naver.com','r','r','r','Y','Y'),(17,'kool','12345','쿨사인',NULL,'010-1234-5678',NULL,'서울특별시 구로구 디지털로27바길 30','현대 아이오닉5','77모 7777','신한카드','123-456','post',NULL,NULL,NULL,NULL,'김민수','minsoo@koolsign.net','010-1234-5678','010-1234-5678','010-1234-5678','N','N'),(18,'koolsign','12345','쿨사인',NULL,'010-1234-5678',NULL,'서울특별시 구로구 디지털로27바길 30','현대 아이오닉5','77모 7777','신한카드','123-456','immediate',NULL,NULL,NULL,NULL,'김민수','minsoo@koolsign.net','010-1234-5678','010-1234-5678','010-1234-5678','Y','Y'),(19,'cho','12345','조가',NULL,'010-1234-5678',NULL,'서울특별시 동작구 양녕로 10번길 1','현대 아이오닉5','77모 7777','신한카드','123-456','post',NULL,NULL,NULL,NULL,'조윤식','yscho20@koolsign.net','010-1234-5678','010-1234-5678','010-1234-5678','N','N');
/*!40000 ALTER TABLE `company_manager` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-30 14:06:03
