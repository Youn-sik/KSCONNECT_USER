const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from inquiry_board where uid = ?", request.decoded.uid , (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "1대1 문의사항 목록을 가져오는 중 문제가 발생하였습니다.", inquiries: []})
            } else {
                let inquiries = []
                rows.forEach((element, _)=> {
                    let inquiry_obj = {
                        inquiry_id: element.inquiry_id,
                        type: element.type,
                        title: element.title,
                        context: element.context,
                        date: element.date,
                        status: element.status
                    }
                    inquiries.push(inquiry_obj)
                });

                response.send({result: true, errStr: "", inquiries: inquiries})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다.", inquiries: []})
    }
})

router.post("/detail", (request, response)=> {
    try {
        let inquiry_id = request.body.inquiry_id
        mysqlConn.connectionService.query("select * from inquiry_board where inquiry_id = ?", inquiry_id , (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "1대1 문의사항 목록을 가져오는 중 문제가 발생하였습니다.", inquiry: {}})
            } else {
                if(rows[0].uid == request.decoded.uid) {
                    let inquiry = {
                        title: rows[0].title,
                        context: rows[0].context,
                        date: rows[0].date,
                        status: rows[0].status
                    }
                    response.send({result: true, errStr: "", inquiry: inquiry})
                } else {
                    response.send({result: false, errStr: "본인이 작성한 문의사항이 아닙니다."})
                }
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다.", inquiries: []})
    }
})


router.post("/register", (request, response)=> {
    try {
        let title = request.body.title
        let context = request.body.context
        let type = request.body.type
        let date = moment().format('YYYY-MM-DD HH:mm:ss')
        let uid = request.decoded.uid
        let status = 'N'

        if(!(type == "normal" || type == "charge" || type == "user" || type == "card" || type == "discharge" || type == "etc"))
            throw new Error("Unexpected value of type")
        else {
            const inquiry_obj = {
                uid: uid,
                type: type,
                title: title,
                context: context,
                date: date,
                status: status
            }
    
            mysqlConn.connectionService.query("insert into inquiry_board set ?", inquiry_obj, (err, rows)=> {
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "1대1 문의 등록 중 문제가 발생하였습니다."})
                } else {
                    response.send({result: true, errStr: ""})
                }
            })
        }
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.put("/modify", (request, response)=> {
    try {
        let inquiry_id = request.body.inquiry_id
        let title = request.body.title
        let context = request.body.context
        let type = request.body.type

        if(!(type == "normal" || type == "charge" || type == "user" || type == "card" || type == "discharge" || type == "etc"))
            throw new Error("Unexpected value of type")
        else {
            const inquiry_obj = {
                type: type,
                title: title,
                context: context,
            }
    
            mysqlConn.connectionService.query("update inquiry_board set ? where inquiry_id = ?", [inquiry_obj, inquiry_id], (err, rows)=> {
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "1대1 문의 수정 중 문제가 발생하였습니다."})
                } else {
                    response.send({result: true, errStr: ""})
                }
            })
        }
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.delete("/delete", (request, response)=> {
    try {
        let inquiry_id = request.body.inquiry_id

        mysqlConn.connectionService.query("delete from inquiry_board where inquiry_id = ?", inquiry_id, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "1대1 문의사항 삭제 중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

module.exports = router