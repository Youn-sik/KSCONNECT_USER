const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")
const jwt = require("jsonwebtoken")

const kepco_info = require("../../RomingInfo.json")
const { default: axios } = require("axios")
const { connectionRoming } = require("../../database_conn")
const MongoClient = require("mongodb").MongoClient
let MongoDB
MongoClient.connect(kepco_info.mongodb_host + ":" + kepco_info.mongodb_port + "/ocppdb", (err, client1)=> {
    if(err) return console.error(err)
    console.log("[MONGODB] > 'ocppdb' Database Connected")
    MongoDB = client1.db("Admin_Service")
})

router.post("/login", (request, response)=> {
    try {
        let id = request.body.id
        let password  = request.body.password
        
        console.log(request.body)
        mysqlConn.connectionService.query("select * from user where id = ?", id, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "로그인 중 데이터베이스 에러가 발생하였습니다.", user_info: {}, token: ""})
            } else {
                if(rows.length == 0) {
                    response.status(400).send({result: false, errStr: "존재하지 않는 계정입니다."})
                }else if(password === rows[0].password) {
                    const uid = rows[0].uid
                    const token = jwt.sign({
                        uid
                    }, "cho", {
                        expiresIn: "12h"
                    })
                    const user_info = {
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
                    response.send({result: true, errStr: "", user_info: user_info, token: token})
                } else {
                    response.status(400).send({result: false, errStr: "존재하지 않는 계정입니다."})
                }
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.get("/logout", (request, response)=> {
    try {
        response.send({result: true, errStr: ""})
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.post("/signup", (request, response)=> {
    try {
        let id = request.body.id
        let password = request.body.password
        let name = request.body.name
        let email = request.body.email
        let mobile = request.body.mobile
        let address = request.body.address
        let car_model = request.body.car_model
        let car_number = request.body.car_number
        let payment_card_company = request.body.payment_card_company
        let payment_card_number = request.body.payment_card_number
        let membership_card_number = request.body.membership_card_number

        const sign_obj = {
            id: id,
            password: password,
            name: name,
            email: email,
            mobile: mobile,
            address: address,
            car_model: car_model,
            car_number: car_number,
            payment_card_company: payment_card_company,
            payment_card_number: payment_card_number,
            membership_card_number: membership_card_number,
        }

        mysqlConn.connectionService.query("INSERT INTO user SET ?", sign_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "회원 가입 중 문제가 발생하였습니다."})
            } else {
                // console.log(rows)
                // console.log(rows.insertId)
                response.send({result: true, errStr: ""})
            }
        });
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.put("/edit", (request, response)=> {
    try {
        // /*
        // 변경 할 데이터만 받기
        const update_obj = {}

        for (const key in request.body) update_obj[key] = request.body[key]
        
        mysqlConn.connectionService.query("UPDATE user SET ? where uid = ?", [update_obj, request.decoded.uid], (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "회원 정보 수정 중 문제가 발생하였습니다."})
            } else {
                // console.log(rows)
                response.send({result: true, errStr: ""})
                
                // fn.user_info_update(request.decoded.uid)
            }
        });
        // */

        /*
        // 변경 할 데이터 및 기존 데이터 모두 받기
        let id = request.body.id
        let password = request.body.password
        let name = request.body.name
        let email = request.body.email
        let mobile = request.body.mobile
        let address = request.body.address
        let car_model = request.body.car_model
        let car_number = request.body.car_number
        let payment_card_company = request.body.payment_card_company
        let payment_card_number = request.body.payment_card_number
        let membership_card_number = request.body.membership_card_number

        const update_obj = {
            id: id,
            password: password,
            name: name,
            email: email,
            mobile: mobile,
            address: address,
            car_model: car_model,
            car_number: car_number,
            payment_card_company: payment_card_company,
            payment_card_number: payment_card_number,
            membership_card_number: membership_card_number
        }

        mysqlConn.connectionService.query("UPDATE user SET ? where id = ?", [update_obj, request.decoded.id], (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "회원 정보 수정 중 문제가 발생하였습니다."})
            }
            console.log(rows)
            response.send({result: true})
        });
        */

    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.get("/info", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from user where uid = ?", request.decoded.uid, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "회원 정보를 가져오는중 문제가 발생하였습니다.", user_info: {}})
            } else {
                const user_info = {
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
                }
                response.send({result: true, errStr: "", user_info: user_info})
            }
        })
    } catch(err) {
        console.error(err)
        response.send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.get("/point_record", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from point_record inner join user on point_record.uid = user.uid where user.uid = ?", request.decoded.uid, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "상품 구매 내역 조회중 문제가 발생하였습니다.", product_record: []})
            } else {
                console.log(rows)
                let point_record = []
                let iter = 1
                rows.forEach((element, _) => {
                    // 쪼인한 데이터를 여기서 오프젝트로 정리해서 배열로 푸시
                    let point_record_obj = {
                        index: iter,
                        name: element.name,
                        status: element.status,
                        current_point: element.current_point,
                        calculate_point: element.calculate_point,
                        remain_point: element.remain_point,
                        date: element.date,
                    }
                    point_record.push(point_record_obj)
                    iter++
                });
                response.send({result: true, errStr: "", point_record: point_record})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.get("/charge_record", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select charge_record_id, charge_record.uid, charge_record.station_id, charge_record.device_id, " +
        "emaid, charge_record.status, pay_method, pay_status, charge_record.car_model, charge_record.car_number, charge_record.pay_card_company, " +
        "charge_record.pay_card_number, charge_st_date, charge_end_date, charge_kwh, charge_kwh1, charge_kwh2, charge_kwh3, charge_amt, " +
        "charge_amt1, charge_amt2, charge_amt3, sp_ucost1, sp_ucost2, sp_ucost3, charge_record.charge_type, charge_record.charge_way, " +
        "user.id as user_id, user.name as user_name, user.point as user_point, "+
        "charge_station.name as charge_station_name, charge_station.address as charge_station_address, " +
        "charge_device.name as charge_device_name, charge_device.device_number as charge_device_device_number "+
        "from charge_record inner join user on charge_record.uid = user.uid " +
        "inner join charge_station on charge_record.station_id = charge_station.station_id inner join charge_device " +
        "on charge_record.device_id = charge_device.device_id where charge_record.uid = ?", request.decoded.uid, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전 내역 조회중 문제가 발생하였습니다.", charge_records: []})
            } else {
                // console.log(rows)
                let charge_records = []
                rows.forEach((element, _) => {
                    let charge_record_obj = {
                        charge_record_id: element.charge_record_id,
                        uid: element.uid,
                        station_id: element.station_id,
                        device_id: element.device_id,
                        emaid: element.emaid,
                        status: element.status,
                        pay_method: element.pay_method,
                        pay_status: element.pay_status,
                        car_model: element.car_model,
                        car_number: element.car_number,
                        pay_card_company: element.pay_card_company,
                        pay_card_number: element.pay_card_number,
                        charge_st_date: element.charge_st_date,
                        charge_end_date: element.charge_end_date,
                        charge_kwh: element.charge_kwh,
                        charge_kwh1: element.charge_kwh1,
                        charge_kwh2: element.charge_kwh2,
                        charge_kwh3: element.charge_kwh3,
                        charge_amt: element.charge_amt,
                        charge_amt1: element.charge_amt1,
                        charge_amt2: element.charge_amt2,
                        charge_amt3: element.charge_amt3,
                        sp_ucost1: element.sp_ucost1,
                        sp_ucost2: element.sp_ucost2,
                        sp_ucost3: element.sp_ucost3,
                        charge_type: element.charge_type,
                        charge_way: element.charge_way,
                        user_info: {
                            user_id: element.user_id,
                            user_name: element.user_name,
                            user_point: element.user_point
                        },
                        charge_station_info: {
                            charge_station_name: element.charge_station_name,
                            charge_station_address: element.charge_station_address
                        },
                        charge_device_info: {
                            charge_device_name: element.charge_device_name,
                            charge_device_device_number: element.charge_device_device_number
                        }
                    }
                    charge_records.push(charge_record_obj)
                });
                response.send({result: true, errStr: "", charge_records: charge_records})
            }
        })


    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.get("/charge_status", (request, response)=> {
    try {
        // console.log(request.decoded.uid)
        let uid = request.decoded.uid
        mysqlConn.connectionService.query("select * from user where uid = ?", uid, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "사용자 조회중 문제가 발생하였습니다.", charge_records: []})
            } else {
                // console.log(rows[0])
                let rfid = rows[0].rfid
                let pay_type = rows[0].pay_type

                // 충전 상태 확인
                let uidStr = uid.toString()
                axios.post("http://" + kepco_info.admin_service_host + ":" + kepco_info.admin_service_port + "/NAuth/check_charge_status", {uid: uidStr}).then((res)=> {
                    if(res.data.result == "false") {
                        response.status(400).send({result:false, errStr: "현재 충전중이 아닙니다."})
                        return
                    }
                    
                    let transaction = res.data.transaction
                    let station_id = transaction.Transaction.chargepointid
                    let device_id = transaction.Transaction.payload.connectorid
                    let startTimestamp = transaction.StartTimestamp
                    let transaction_id = transaction.Transaction.transactionid
                    // console.log(transaction)
                    
                    Promise.all([
                        new Promise((resolve, reject)=> {
                            // 충전소 정보 확인
                            mysqlConn.connectionService.query("select * from charge_station where station_id = ?", station_id, (err, rows)=> {
                                if (err) {
                                    console.error(err)
                                    response.status(400).send({result: false, errStr: "충전소 조회중 문제가 발생하였습니다."})
                                    reject()
                                }
                                let charge_station_info = rows[0]
                                
                                resolve(charge_station_info)
                            })
                        }), 
                        
                        new Promise((resolve, reject)=> {
                            // 메타 벨류 값 확인
                            axios.post("http://" + kepco_info.admin_service_host + ":" + kepco_info.admin_service_port + "/NAuth/get_meter_value", {tid: transaction_id}).then((res)=> {
                                if(res.data.result == "false") {
                                    response.status(400).send({result:false, errStr: "Meter Value 값 조회중 문제가 발생하였습니다."})
                                    reject()
                                }

                                let totMeterValue = res.data.metervalue
                                let meterValue = totMeterValue.MeterValues.payload.metervalue[0].sampledvalue[1].value
                                // console.log(totMeterValue)
                                // console.log(meterValue)

                                // 사용 금액 확인 **가격이 넘어가는 시간에는 어떻게 ? - 수정 필요
                                // 수정 필요
                                axios.post("http://localhost:4000/charge_station/charge_price", {station_id: station_id}).then((res)=> {
                                    if(res.data.result != true){
                                        response.status(400).send({result:false, errStr: "Charge price 값 조회중 문제가 발생하였습니다."})
                                        reject()
                                    }

                                    let charge_price = res.data.charge_price
                                    let totPayment = charge_price * meterValue
                                    let send_data = {
                                        meterValue: meterValue,
                                        payment: totPayment,
                                        startTime: startTimestamp
                                    }
                                    resolve(send_data)
                                })

                            }).catch((err)=> {
                                console.error(err)
                                response.status(400).send({result:false, errStr: "Admin Service API 사용중 문제가 발생하였습니다."})
                                reject()
                            })
                        })
                    ]).then(result => { 
                        let send_data = {
                            charge_station_name: result[0].name,
                            payment_way: result[0].pay_type,
                            charge_kwh: result[1].meterValue,
                            startTime: result[1].startTime,
                            charge_amount: result[1].payment
                        }
                        // console.log(send_data)
                        response.send({result: true, errStr: "", value: send_data})
                    }).catch(()=> {
                        return
                    });
                    
                }).catch(err => {
                    console.error(err)
                    response.status(400).send({result:false, errStr: "Admin Service API 사용중 문제가 발생하였습니다."})
                })
            }
        })

    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.get("/list", (request, response)=> {
    mysqlConn.connectionService.query("select rfid from user", (err, rows)=> {
        if(err) {
            console.error(err)
            response.status(400).send({result: false, errStr: "rfid 정보를 가져오는중 문제가 발생하였습니다.", charge_stations: []})
        } else {
            let charge_stations = []
            rows.forEach((element, _)=> {
                let charge_station_obj = {
                    idTag: element.rfid,
                }
                charge_stations.push(charge_station_obj)
            })
            response.send({user_idTags: charge_stations})
        }
    })
})

router.post("/info/check", (request, response)=> {
    // console.log(request.body)
    let car_number = request.body.car_number
    let id = request.body.id

    if(car_number) {
        mysqlConn.connectionService.query("select rfid from user where car_number = ?", car_number, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "rfid 정보를 가져오는중 문제가 발생하였습니다.", charge_stations: []})
            } else {
                if(rows.length == 0) {
                    response.send({result: false, errStr: "등록되지 않은 사용자 입니다."})
                } else {
                    response.send({result: true, errStr: "", rfid: rows[0].rfid})
                }
            }
        })
    } else if(id) {
        mysqlConn.connectionService.query("select rfid from user where id = ?", id, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "rfid 정보를 가져오는중 문제가 발생하였습니다.", charge_stations: []})
            } else {
                if(rows.length == 0) {
                    response.send({result: false, errStr: "등록되지 않은 사용자 입니다."})
                } else {
                    response.send({result: true, errStr: "", rfid: rows[0].rfid})
                }
            }
        })
    } else {
        response.send({result: false, errStr: "올바르지 않은 형식입니다."})
    }
})

router.get("/auth", (request, response)=> {
    const token = request.headers.authorization

    if(!token) {
        return response.status(400).send({result: false, errStr: "토큰이 존재하지 않습니다."})
    } else if(token == undefined) {
        return response.status(400).send({result: false, errStr: "토큰이 존재하지 않습니다."})
    } else {
        const vertify = new Promise(
            (resolve, reject) => {
                console.log(token)
                jwt.verify(token, "cho", (err, decoded) => {
                    if(err) reject(err)
                    resolve(decoded)
                })
            }
        )
    
        const onError = (err) => {
            console.log(err)
            if(err.name == "TokenExpireError") {
                response.status(400).send({result: false, errStr:"토큰이 만료되었습니다."})
            } else {
                response.status(400).send({result: false, errStr:"유효하지 않은 토큰입니다."})
            }
        }
    
        vertify.then((decoded)=>{
            request.decoded = decoded
            return response.status(200).send({result: true, errStr: ""})
        }).catch(onError)
    }
})

router.post("/membership_card_request_submit", (request, response)=> {
    try{
        // console.log(request.body)
        if(!request.body) {
            response.status(400).send({"result":"false", "errStr": "필수 파라메터가 누락되었습니다."})
            return
        } else {
            if(request.body.reqData.request_value == "permitted") {
                let obj = {
                    request_uid: request.body.reqData.request_uid,
                    membership_card_number: request.body.membershipCardNumber,
                    request_way: request.body.reqData.request_way,
                    request_status: "발급",
                    request_time: request.body.timestamp,
                    request_reason: request.body.reqData.request_reason,
                    address: request.body.reqData.Request_address
                }

                mysqlConn.connectionService.query("insert into user_membership_card set ?", obj, (err, rows)=> {
                    if(err) {
                        console.error(err)
                        response.status(400).send({"result":"false", "errStr": "DB 쿼리중 문제가 발생하였습니다."})
                        return
                    } 
                    mysqlConn.connectionService.query("update user set membership_card_number = ? where uid = ?", [request.body.membershipCardNumber, request.body.reqData.request_uid], (err, rows)=> {
                        if(err) {
                            console.error(err)
                            response.status(400).send({"result":"false", "errStr": "DB 쿼리중 문제가 발생하였습니다."})
                            return
                        }
                        response.status(200).send({"result":"true", "errStr":""})
                    })
                })
            } else {
                // 거부 당한 메시지
            }
        }
    } catch(err){
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.get("/alert_list", (request, response)=> {
    try{
        let uid = request.decoded.uid
        axios.post("http://"+kepco_info.admin_service_host + ":" + kepco_info.admin_service_port + "/NAuth/alert_list", {uid: uid.toString()})
        .then((res)=> {
            // console.log(res.data)
            response.status(200).send({result: true, errStr:"", alert_list: res.data.alert_list})
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

module.exports = router