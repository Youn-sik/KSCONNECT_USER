const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

router.post("/login", (request, response)=> {
    try {
        let id = request.body.id
        let password  = request.body.password
        mysqlConn.connectionService.query("select * from user where id = ?", id, (err, rows)=> {
            if(err) console.error(err)
            if(password === rows[0].password) {
                if(request.session.user) {
                    console.log(request.session)
                    response.send("세션이 존재하여 메인페이지로 이동")
                    // response.redirect("/app/dashboards/default")
                } else {
                    request.session.user = {
                        id: rows[0].id,
                        password: rows[0].password,
                        name: rows[0].name,
                        auth: true
                    }
                    console.log(request.session)
                    response.send("세션 생성 후 메인페이지로 이동")
                    // response.redirect("/app/dashboards/default")
                }
            } else {
                response.status(400).send({result: false, errStr: "존재하지 않는 계정입니다."})
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
                    return;
                }
                response.send("세션 파괴 완료 후 로그인 페이지로 이동")
                // response.redirect("/app/login_path")
            })
        } else {
            console.log(request.session)
            response.send("세션이 없습니다.")
            // response.redirect("/app/login_path")
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
        let address = request.body.address// ? request.body.address : null
        let car_model = request.body.car_model
        let car_number = request.body.car_number
        let payment_card_company = request.body.payment_card_company// ? request.body.payment_card_company : null
        let payment_card_number = request.body.payment_card_number// ? request.body.payment_card_number : null
        let membership_card_number = request.body.membership_card_number// ? request.body.membership_card_number : null
        let point = 0

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
            point: point
        }

        mysqlConn.connectionService.query("INSERT INTO user SET ?", sign_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "회원 가입 중 문제가 발생하였습니다."})
            }
            console.log(rows)
            response.send({result: true})
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

        for (const key in request.body) {
            update_obj[key] = request.body[key]
        }
        console.log(update_obj)

        mysqlConn.connectionService.query("UPDATE user SET ? where id = ?", [update_obj, request.session.user.id], (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "회원 정보 수정 중 문제가 발생하였습니다."})
            }
            console.log(rows)
            response.send({result: true})
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

module.exports = router