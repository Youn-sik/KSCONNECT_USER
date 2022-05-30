var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const kepco_info = require("./RomingInfo.json")
const mysqlConn = require("./database_conn")
const client = require("./mqtt_load")
const MongoClient = require("mongodb").MongoClient
let MongoDB
const axios = require("axios")

MongoClient.connect(kepco_info.mongodb_host + ":" + kepco_info.mongodb_port + "/ocppdb", (err, client1)=> {
    if(err) return console.error(err)
    console.log("[MONGODB] > 'ocppdb' Database Connected")
    MongoDB = client1.db("ocppdb")
})

mysqlConn.connectionService.connect(err=> {
    if(err) {
        console.error("[MYSQL] > 'Service_Platform' Database Connection Error")
        console.error(err)
    }
    console.log("[MYSQL] > 'Service_Platform' Database Conneted")
})

mysqlConn.connectionRoming.connect(err=> {
    if(err) { 
    console.error("[MYSQL] > 'Roming_Platform' Database Connection Error")
    console.error(err)
    }
    console.log("[MYSQL] > 'Roming_Platform' Database Conneted")
})

mysqlConn.connectionService.on('error', err=> {
    console.log(err.message)
    if(err.code == 'PROTOCOL_CONNECTION_LOST'){
        mysqlConn.connectionService.connect(err=> {
            if(err) { 
                console.error("[MYSQL] > 'connectionService' Database Connection Error")
                console.error(err)
            }
                console.log("[MYSQL] > 'connectionService' Database Conneted")    
        }) 
    } else throw err;
});

mysqlConn.connectionRoming.on('error', err=> {
    console.log(err.message)
    if(err.code == 'PROTOCOL_CONNECTION_LOST'){
        mysqlConn.connectionRoming.connect(err=> {
            if(err) { 
                console.error("[MYSQL] > 'Roming_Platform' Database Connection Error")
                console.error(err)
            }
                console.log("[MYSQL] > 'Roming_Platform' Database Conneted")    
        }) 
    } else throw err;
});

module.exports = {

    async user_info_list() {
        
    },

    async user_info_registerd(uid) {
        
    },

    async user_info_update(uid) {
        
    },

    async user_info_delete(uid) {
        
    },

    async charege_device_create(uid) {
        
    },

    async transaction_start(info) {
        new Promise((resolve, reject)=> {

                mysqlConn.connectionService.query("update charge_device set status = 'N' where device_id = ?", info.device_id, (err, rows)=> {
                    if(err) {
                        console.error(err)
                        reject(err)
                    } else {
                        resolve()
                    }
                })
        }).then(()=> {
            Promise.all([
                new Promise((resolve, reject)=> {
                    mysqlConn.connectionService.query("select * from user where rfid = ?", info.rfid, (err, rows)=> {
                        if(err) {
                            console.error(err)
                            reject()
                        } else {
                            // console.log(rows[0])
                            let user_info_tmp = {
                                uid: rows[0].uid,
                                id: rows[0].id,
                                name: rows[0].name,
                                email: rows[0].email,
                                mobile: rows[0].mobile,
                                address: rows[0].address,
                                car_model: rows[0].car_model,
                                car_number: rows[0].car_number,
                                payment_card_company: rows[0].payment_card_company,
                                payment_card_number: rows[0].payment_card_number,
                                membership_card_number: rows[0].membership_card_number,
                                point: rows[0].point,
                                rfid: rows[0].rfid
                            }
                            resolve(user_info_tmp)
                        }
                    })
                }),
                new Promise((resolve, reject)=> {
                    mysqlConn.connectionService.query("select cs.name as cs_name, cs.address as cs_addredd, cs.lat as cs_lat, cs.longi as cs_longi, "+
                    "cd.name as cd_name, cd.device_number as cd_device_number " +
                    "from charge_device as cd inner join charge_station as cs on cs.station_id = cd.station_id where cd.device_id = ?", info.device_id, (err, rows)=> {
                        if(err) {
                            console.error(err)
                            reject()
                        } else {
                            // console.log(rows[0])
                            let charge_info_tmp = {
                                charge_staion: {
                                    name: rows[0].cs_name,
                                    address: rows[0].cs_address,
                                    lat: rows[0].cs_lat,
                                    longi: rows[0].cs_longi
                                },
                                charge_device: {
                                    name: rows[0].cd_name,
                                    device_number: rows[0].cd_device_number
                                }
                            }
                            resolve(charge_info_tmp)
                        }
                    })
                }),
            ]).then((values)=> {
                // console.log(values)
    
                let send_data = {
                    user_info: values[0],
                    charge_info: values[1],
                    timestamp: info.timestamp
                }
    
                // console.log(JSON.stringify(send_data))
        
                client.publish("/alert/charge/start/" + values[0].uid, JSON.stringify(send_data))
    
            }).catch(err=> {
                console.error(err)
            })
    
        }).catch(err=> {
            console.error(err)
        })
        
    },

    async transaction_stop(info) {
        let mongo_obj = {}

        new Promise((resolve, reject)=> {
            MongoDB.collection("transactions").find({"transactionId" : parseInt(info.transactionId)}).toArray(async (err, result)=> {
                if(err) {
                    console.error(err)
                    reject(err)
                }
                // console.log(result)

                let amount = await (result[0].meterStop - result[0].meterStart)
                let rfid = await (result[0].idTag)
                let device_id = await (result[0].connectorId)
                let startTime = await (result[0].startTime)
                let stopTime = await (result[0].stopTime)

                mongo_obj = {
                    amount: amount,
                    rfid: rfid,
                    device_id: device_id,
                    startTime: startTime,
                    stopTime: stopTime
                }
                resolve(mongo_obj)
            })
        }).then((mongo_obj)=> {
            console.log(mongo_obj)
            Promise.all([
                new Promise((resolve, reject)=> {
                    mysqlConn.connectionService.query("select * from user where rfid = ?", info.rfid, (err, rows)=> {
                        if(err) {
                            console.error(err)
                            reject()
                        } else if(rows == []) {
                            console.error("없는 rfid 값 입니다.")
                            reject()
                        } else {
                            // console.log(rows)
                            let user_info_tmp = {
                                uid: rows[0].uid,
                                id: rows[0].id,
                                name: rows[0].name,
                                email: rows[0].email,
                                mobile: rows[0].mobile,
                                address: rows[0].address,
                                car_model: rows[0].car_model,
                                car_number: rows[0].car_number,
                                payment_card_company: rows[0].payment_card_company,
                                payment_card_number: rows[0].payment_card_number,
                                membership_card_number: rows[0].membership_card_number,
                                point: rows[0].point,
                                rfid: rows[0].rfid
                            }
                            resolve(user_info_tmp)
                        }
                    })
                }),
                new Promise((resolve, reject)=> {
                    mysqlConn.connectionService.query("select cs.name as cs_name, cs.address as cs_addredd, cs.lat as cs_lat, cs.longi as cs_longi, "+
                    "cd.name as cd_name, cd.device_number as cd_device_number " +
                    "from charge_device as cd inner join charge_station as cs on cs.station_id = cd.station_id where cd.device_id = ?", mongo_obj.device_id, (err, rows)=> {
                        if(err) {
                            console.error(err)
                            reject()
                        } else {
                            // console.log(rows[0])
                            let charge_info_tmp = {
                                charge_staion: {
                                    name: rows[0].cs_name,
                                    address: rows[0].cs_address,
                                    lat: rows[0].cs_lat,
                                    longi: rows[0].cs_longi
                                },
                                charge_device: {
                                    name: rows[0].cd_name,
                                    device_number: rows[0].cd_device_number
                                }
                            }
                            resolve(charge_info_tmp)
                        }
                    })
                }),
            ]).then((values)=> {
                // console.log(values)
    
                let send_data = {
                    user_info: values[0],
                    charge_info: values[1],
                    timestamp: info.timestamp
                }
    
                // console.log(JSON.stringify(send_data))
        
                client.publish("/alert/charge/end/" + values[0].uid, JSON.stringify(send_data))



                // 결제 req
                axios.post("http://172.16.38.157:4000/user/login", {
                    id: "cho",
                    password: "12345"
                }).then((re)=> {
                    let token = re.data.token
                    // console.log(token)

                    
                    axios.post("http://172.16.38.157:4000/payment/billingkey", {
                        cardNumber: "5327501015763628",
                        cardExpirationYear: "27",
                        cardExpirationMonth: "01",
                        cardPassword: "05"

                        // cardNumber: "9490942909837164",
                        // cardExpirationYear: "27",
                        // cardExpirationMonth: "10",
                        // cardPassword: "05"
                    },{
                        headers: {
                            "authorization": token
                        }
                    }).then((res)=> {
                        if(res.code == undefined) { // 에러가 없다면
                            let billingKey = res.data.billingKey
                            console.log(billingKey)

                            let totalAmount = mongo_obj.amount * 292.1 // mysql에서 현재 가격 갖고 와야함
                            
                            axios.post("http://172.16.38.157:4000/payment/pay", {
                                "billingKey": billingKey,
                                "amount": totalAmount, //Meter Value 계산해서 넣기
                                // "amount": 10000, //Meter Value 계산해서 넣기
                                "orderID": Math.random().toString(36).substr(2, 5),
                                "orderName": "전기차 충전 요금 정산"
                            },{
                                headers: {
                                    "authorization": token
                                }
                            }).then((response)=> { // 에러가 없다면
                                if(response.code == undefined) {
                                    let send_data = response.data
                                    console.log(send_data)
                                    client.publish("/alert/pay/end/" + values[0].uid, JSON.stringify({send_data})) // topic uid 수정 필요

                                } else { // 에러가 있다면 
                                    console.error(response)
                                }
                            }).catch((err)=> {
                                console.error(err)
                            })
                        } else { // 에러가 있다면 
                            console.error(res)
                        }
                    }).catch((err)=> {
                        console.error(err)
                    })
                }).catch((err)=> {
                    console.error(err)
                })
    
            }).catch(err=> {
                console.error(err)
            })
        }).catch((err)=> {
            console.error(err)
        })
    },

}