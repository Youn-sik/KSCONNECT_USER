const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

router.post("/login", (request, response)=> {
    try {
        let id = request.body.id
        let password  = request.body.password
        console.log(request.body)
        mysqlConn.connectionService.query("select * from user where id = ?", id, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "로그인 중 데이터베이스 에러가 발생하였습니다."})
            } else {
                if(password === rows[0].password) {
                    if(request.session.user) {
                        console.log(request.session)
                        response.status(400).send({result: true, errStr: ""})
                    } else {
                        request.session.user = {
                            uid: rows[0].uid,
                            id: rows[0].id,
                            password: rows[0].password,
                            name: rows[0].name,
                            auth: true
                        }
                        console.log(request.session)

                        // console.log(rows[0])
                        user_info = {
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
                            point: rows[0].point
                        }
                        // console.log(request.session.id)
                        request.session.save(()=> {
                            response.send({result: true, errStr: "", user_info: user_info, session_id: request.session.id})
                        })
                    }
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
        if(request.session.user) {
            console.log(request.session)
            request.session.destroy(err=> {
                if(err) {
                    console.error("[SERVER] > 세션 삭제 중 에러 발생.")
                    response.status(400).send({result: false, errStr: "로그아웃 중 세션 에러가 발생하였습니다."})
                }
                response.send({result: true, errStr: ""})
            })
        } else {
            console.log(request.session)
            response.send({result: false, errStr: "세션이 없습니다."})
        }
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
                console.log(rows)
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
        
        mysqlConn.connectionService.query("UPDATE user SET ? where uid = ?", [update_obj, request.session.user.uid], (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "회원 정보 수정 중 문제가 발생하였습니다."})
            } else {
                console.log(rows)
                response.send({result: true, errStr: ""})
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

        mysqlConn.connectionService.query("UPDATE user SET ? where id = ?", [update_obj, request.session.user.id], (err, rows)=> {
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

router.get("/point_record", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from point_record inner join user on point_record.uid = user.uid where user.uid = ?", request.session.user.uid, (err, rows)=> {
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
        "on charge_record.device_id = charge_device.device_id where charge_record.uid = ?", request.session.user.uid, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전 내역 조회중 문제가 발생하였습니다.", charge_records: []})
            } else {
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

module.exports = router