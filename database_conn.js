const kepco_info = require("./RomingInfo.json")
const mysql = require("mysql")
const connServicePlatform = {
    "host": kepco_info.mysql_host,
    "user": kepco_info.mysql_user,
    "password": kepco_info.mysql_password,
    "database": kepco_info.Service_Platform
}
const connRomingPlatform = {
    "host": kepco_info.mysql_host,
    "user": kepco_info.mysql_user,
    "password": kepco_info.mysql_password,
    "database": kepco_info.Roming_Platform
}

const connectionService = mysql.createConnection(connServicePlatform)
const connectionRoming = mysql.createConnection(connRomingPlatform)

const connectionObject = {
    "connectionService": connectionService,
    "connectionRoming": connectionRoming
}

module.exports = connectionObject