DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `company_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `company_number` varchar(20) NOT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `charge_station`;
CREATE TABLE `charge_station` (
  `station_id` int(10) NOT NULL AUTO_INCREMENT,
  `company_id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL Check (status IN ('Y','N','F','I')),
  `last_state` datetime DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `available` varchar(50) NOT NULL,
  `park_fee` int(20) NOT NULL,
  `pay_type` varchar(20) NOT NULL,
  `lat` varchar(12) NOT NULL,
  `longi` varchar(12) NOT NULL,
  `purpose` varchar(20) NOT NULL Check (purpose IN ("public", "apartment", "company")),
  PRIMARY KEY (`station_id`),
  KEY `company_id_FK` (`company_id`),
  CONSTRAINT `company_id_FK1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_device`;
CREATE TABLE `charge_device` (
  `device_id` int(10) NOT NULL AUTO_INCREMENT,
  `station_id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `sirial` varchar(50) NOT NULL,
  `charge_type` varchar(20) NOT NULL,
  `charge_way` varchar(60) NOT NULL,
  `available` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL Check (status IN ('Y','N','F','I')),
  `last_state` datetime DEFAULT NULL,
  `device_number` int(20) NOT NULL,
  PRIMARY KEY (`device_id`),
  KEY `station_id_FK` (`station_id`),
  CONSTRAINT `station_id_FK1` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



DROP TABLE IF EXISTS `user`;
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
  `rfid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `point_record`;
CREATE TABLE `point_record` (
  `ponint_record_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `status` varchar(20) NOT NULL Check (status IN ('P', 'M')),
  `current_point` int(20) NOT NULL,
  `calculate_point` int(20) NOT NULL,
  `remain_point` int(20) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`ponint_record_id`),
  KEY `uid_FK` (`uid`),
  CONSTRAINT `uid_FK1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `product_id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `price` int(20) NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `product_record`;
CREATE TABLE `product_record` (
  `product_record_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `product_id` int(10) NOT NULL,
  `status` varchar(20) NOT NULL  Check (status IN ('Y', 'N')),
  `product_price` int(20) NOT NULL,
  `product_count` int(20) NOT NULL DEFAULT 1,
  `all_price` int(20) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`product_record_id`),
  KEY `uid_FK` (`uid`),
  KEY `product_id_FK` (`product_id`),
  CONSTRAINT `product_id_FK` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `uid_FK2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_record`;
CREATE TABLE `charge_record` (
  `charge_record_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `device_id` int(10) NOT NULL,
  `emaid` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL Check (status IN ('Y', 'N')),
  `car_model` varchar(80) NOT NULL,
  `car_number` varchar(50) NOT NULL,
  `pay_card_company` varchar(50) NOT NULL,
  `pay_card_number` varchar(50) NOT NULL,
  `pay_method` varchar(50) NOT NULL,
  `pay_status` varchar(50) NOT NULL Check (pay_status IN ('Y', 'N')),
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
  CONSTRAINT `uid_FK3` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_price`;
CREATE TABLE `charge_price` (
  `charge_price_id` int(10) NOT NULL AUTO_INCREMENT,
  `public` varchar(20) NOT NULL Check (public IN ('Y', 'N')),
  `season` varchar(20) NOT NULL Check (season IN ('S', 'W', "E")),
  `power` varchar(20) NOT NULL Check (power IN ('S', 'M', "L")),
  `kw100` varchar(20) NOT NULL Check (kw100 IN ('Y', 'N')),
  `price` float(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`charge_price_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `content_id` int(10) NOT NULL AUTO_INCREMENT,
  `usage` varchar(20) NOT NULL, -- FK Name
  `usage_id` int(10) NOT NULL, -- FK Index
  `content_url` varchar(255) NOT NULL,
  PRIMARY KEY (`content_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `notice_board`;
CREATE TABLE `notice_board` (
  `notice_id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `FAQ_board`;
CREATE TABLE `FAQ_board` (
  `FAQ_id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  PRIMARY KEY (`FAQ_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `inquiry_board`;
CREATE TABLE `inquiry_board` (
  `inquiry_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `type` varchar(50) NOT NULL Check (type IN ("normal", "charge", "user", "card", "discharge", "etc")),
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'N' Check (status IN ('Y', 'N', 'C')),
  PRIMARY KEY (`inquiry_id`),
  KEY `uid_FK` (`uid`),
  CONSTRAINT `uid_FK4` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `review_board`;
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
  CONSTRAINT `uid_FK5` FOREIGN KEY(`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `station_id_FK3` FOREIGN KEY(`station_id`) REFERENCES `charge_station` (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `report_board`;
CREATE TABLE `report_board` (
  `report_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `device_id` int(10) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'N' Check (status IN ('Y', 'N')),
  PRIMARY KEY (`report_id`),
  KEY `uid_FK` (`uid`),
  KEY `station_id_FK` (`station_id`),
  KEY `device_id_FK` (`device_id`),
  CONSTRAINT `device_id_FK2` FOREIGN KEY (`device_id`) REFERENCES `charge_device` (`device_id`),
  CONSTRAINT `station_id_FK4` FOREIGN KEY (`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `uid_FK6` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `company_user`;
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
  CONSTRAINT `company_id_FK2` FOREIGN KEY(`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;