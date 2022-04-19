DROP TABLE IF EXISTS `charge_station`;
CREATE TABLE `charge_station` (
  `station_id` int(10) NOT NULL AUTO_INCREASE,
  `company_id` int(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `last_state` datetime DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `available` varchar(50) NOT NULL,
  `park_fee` int(20) NOT NULL,
  `contect_number` varchar(20) NOT NULL,
  `pay_type` varchar(20) NOT NULL,
  PRIMARY KEY (`station_id`),
  KEY `company_id_FK` (`company_id`),
  CONSTRAINT `company_id_FK` FOREIGN KEY(`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_device`;
CREATE TABLE `charge_device` (
  `device_id` int(10) NOT NULL AUTO_INCREASE,
  `station_id` int(10) DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `sirial` varchar(50) NOT NULL,
  `charge_type` varchar(20) NOT NULL,
  `charge_way` varchar(60) NOT NULL,
  `available` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  `last_state` datetime DEFAULT NULL,
  `device_number` int(20) NOT NULL,
  PRIMARY KEY (`device_id`),
  KEY `station_id_FK` (`station_id`),
  CONSTRAINT `station_id_FK` FOREIGN KEY(`station_id`) REFERENCES `charge_station` (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `company_id` int(10) NOT NULL AUTO_INCREASE,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(10) NOT NULL AUTO_INCREASE,
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
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `point_record`;
CREATE TABLE `point_record` (
`ponint_record_id` int(10) NOT NULL AUTO_INCREASE,
`uid` int(10) NOT NULL,
`status` varchar(20) NOT NULL,
`current_point` int(20) NOT NULL,
`calculate_point` int(20) NOT NULL,
`remain_point` int(20) NOT NULL,
`date` datetime NOT NULL,
  PRIMARY KEY (`ponint_record_id`),
  KEY `uid_FK` (`uid`),
  CONSTRAINT `uid_FK` FOREIGN KEY(`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `product_id` int(10) NOT NULL AUTO_INCREASE,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `price` int(20) NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `product_record`;
CREATE TABLE `product_record` (
  `product_record_id` int(10) NOT NULL AUTO_INCREASE,
  `uid` int(10) NOT NULL,
  `product_id` int(10) NOT NULL,
  `status` varchar(20) NOT NULL,
  `price` int(20) NOT NULL,
  `product_count` int(20) NOT NULL DEFAULT 1,
  `date` datetime NOT NULL,
  PRIMARY KEY (`product_record_id`),
  KEY `uid_FK` (`uid`),
  KEY `product_id_FK` (`product_id`),
  CONSTRAINT `uid_FK` FOREIGN KEY(`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `product_id_FK` FOREIGN KEY(`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_record`;
CREATE TABLE `charge_record` (
  `product_record_id` int(10) NOT NULL AUTO_INCREASE,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `device_id` int(10) NOT NULL,
  `used_amount` int(20) NOT NULL,
  `charge_amount` int(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `pay_method` varchar(50) NOT NULL,
  `pay_status` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`product_record_id`),
  KEY `uid_FK` (`uid`),
  KEY `station_id_FK` (`station_id`),
  KEY `device_id_FK` (`device_id`),
  CONSTRAINT `uid_FK` FOREIGN KEY(`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `station_id_FK` FOREIGN KEY(`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `device_id_FK` FOREIGN KEY(`device_id`) REFERENCES `charge_device` (`device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_price`;
CREATE TABLE `charge_price` (
  `charge_price_id` int(10) NOT NULL AUTO_INCREASE,
  `public` varchar(20) NOT NULL,
  `season` varchar(20) NOT NULL,
  `load` varchar(20) NOT NULL,
  `kw100` varchar(20) NOT NULL,
  PRIMARY KEY (`charge_price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `content_id` int(10) NOT NULL AUTO_INCREASE,
  `usage` varchar(20) NOT NULL, -- FK Name
  `usage_id` int(10) NOT NULL, -- FK Index
  `content_url` varchar(255) NOT NULL,
  PRIMARY KEY (`content_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `notice_board`;
CREATE TABLE `notice_board` (
  `notice_id` int(10) NOT NULL AUTO_INCREASE,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `FAQ_board`;
CREATE TABLE `FAQ_board` (
  `FAQ_id` int(10) NOT NULL AUTO_INCREASE,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  PRIMARY KEY (`FAQ_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `inquiry_board`;
CREATE TABLE `inquiry_board` (
  `inquiry_id` int(10) NOT NULL AUTO_INCREASE,
  `uid` int(10) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT "",
  PRIMARY KEY (`inquiry_id`),
  KEY `uid_FK` (`uid`),
  CONSTRAINT `uid_FK` FOREIGN KEY(`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `review_board`;
CREATE TABLE `review_board` (
  `review_id` int(10) NOT NULL AUTO_INCREASE,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `star` int(10) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `uid_FK` (`uid`),
  KEY `station_id_FK` (`station_id`),
  CONSTRAINT `uid_FK` FOREIGN KEY(`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `station_id_FK` FOREIGN KEY(`station_id`) REFERENCES `charge_station` (`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `report_board`;
CREATE TABLE `report_board` (
  `report_id` int(10) NOT NULL AUTO_INCREASE,
  `uid` int(10) NOT NULL,
  `station_id` int(10) NOT NULL,
  `device_id` int(10) NOT NULL,
  `context` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT "",
  PRIMARY KEY (`report_id`),
  KEY `uid_FK` (`uid`),
  KEY `station_id_FK` (`station_id`),
  KEY `device_id_FK` (`device_id`),
  CONSTRAINT `uid_FK` FOREIGN KEY(`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `station_id_FK` FOREIGN KEY(`station_id`) REFERENCES `charge_station` (`station_id`),
  CONSTRAINT `device_id_FK` FOREIGN KEY(`device_id`) REFERENCES `charge_device` (`device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;