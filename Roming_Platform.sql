DROP TABLE IF EXISTS `charge_station`;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_device`;
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_device_status`;
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
  CONSTRAINT `cpid_FK` FOREIGN KEY(`cpid`) REFERENCES `charge_device` (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `charge_device_reserv`;
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
  CONSTRAINT `cpid_FK` FOREIGN KEY(`cpid`) REFERENCES `charge_device` (`cpid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;