const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

router.post("/login", (request, response)=> {
    try {
        let id = request.body.id
        let password  = request.body.password
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
                        response.send({result: true, errStr: ""})
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
                    console.err("[SERVER] > 세션 삭제 중 에러 발생.")
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

module.exports = router