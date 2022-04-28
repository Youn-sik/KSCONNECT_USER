const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from product", (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "상품 정보를 가져오는중 문제가 발생하였습니다.", products: []})
            }

            let products = []
            rows.forEach((element, _) => {
                products.push(element)
            });
        
            response.send({result: true, errStr: "", products: products})
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", products: []})
    }
})

router.post("/create", (request, response)=> {
    try {
        let title = request.body.title
        let context = request.body.context
        let price = request.body.price

        const product_obj = {
            title: title,
            context: context,
            price: price
        }

        mysqlConn.connectionService.query("insert into product set ?", product_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "상품 등록중 문제가 발생하였습니다."})
            }

            console.log(rows)
            response.send({result: true, errStr: ""})
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.post("/buy", (request, response)=> {
    try {
        let uid = request.session.user.uid
        // 결재 정보?
        let product_id = request.body.product_id
        let product_price = request.body.product_price
        let product_count = request.body.product_count
        let date = moment().format('YYYY-MM-DD HH:mm:ss')
        let all_price = product_price*product_count
        // 결재 status 값 가져와야 함 => 트랙잭션에 결제도 포함(결재 후 DB 작업 또는 DB 작업과 비동기로 처리 후 결제 완료되면 transaction accecpt)

        const product_buy_obj = {
            uid: uid,
            product_id: product_id,
            status: 'Y',
            product_price: product_price,
            product_count: product_count,
            all_price: all_price,
            date: date
        }

        mysqlConn.connectionService.beginTransaction(err=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "상품 구매중 트랜잭션 에러가 발생하였습니다."})
            }

            Promise.all([
                new Promise((resolve, reject)=> {
                    // 구매 내역 등록
                    mysqlConn.connectionService.query("insert into product_record set ?", product_buy_obj, (error, product_record_insert_rows)=> {
                        if(error) {
                            console.error(error)
                            reject()
                        } else {
                            resolve()
                        }
                    })
                }),
                new Promise((resolve, reject)=> {
                    // 포인트 내역 추가를 위한 사용자 정보 조회
                    mysqlConn.connectionService.query("select * from user where uid = ?", request.session.user.uid, (error, user_rows)=> {
                        if(error) {
                            console.error(error)
                            reject()
                        } else {
                            const remain_point = user_rows[0].point + all_price
                            const point_record_obj = {
                                uid: uid,
                                status: 'P',
                                current_point: user_rows[0].point,
                                calculate_point: all_price,
                                remain_point: remain_point,
                                date: date
                            }
    
                            // 포인트 내역 추가
                            mysqlConn.connectionService.query("insert into point_record set ?", point_record_obj, (error, user_insert_rows)=> {
                                if(error) {
                                    console.error(error)
                                    reject()
                                } else {
                                    // 포인트 갱신
                                    mysqlConn.connectionService.query("update user set point = ? where uid = ?", [remain_point, request.session.user.uid], (error, user_update_rows)=> {
                                        if(error) {
                                            console.error(error)
                                            reject()
                                        } else {
                                            resolve()
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            ]).then(()=> {
                mysqlConn.connectionService.commit()
                response.send({result: true, errStr: ""})
            }).catch(err=> {
                mysqlConn.connectionService.rollback()
                response.status(400).send({result: false, errStr: "상품 구매중 에러가 발생하였습니다."})
            })
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.get("/record", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from product_record inner join user on product_record.uid = user.uid "+
        "inner join product on product.product_id = product_record.product_id where user.uid = ?", request.session.user.uid, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "상품 구매 내역 조회중 문제가 발생하였습니다.", product_record: []})
            }

            console.log(rows)
            let product_record = []
            rows.forEach((element, _) => {
                // 쪼인한 데이터를 여기서 오프젝트로 정리해서 배열로 푸시
                let product_record_obj = {
                    name: element.name,
                    payment_card_company: element.payment_card_company,
                    payment_card_number: element.payment_card_number,
                    membership_card_number: element.membership_card_number,
                    product_title: element.title,
                    product_context: element.context,
                    product_price: element.product_price,
                    product_count: element.product_count,
                    status: element.status,
                }
                product_record.push(product_record_obj)
            });
            response.send({result: true, errStr: "", product_record: product_record})
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

module.exports = router