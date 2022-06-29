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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-12 15:16:31
