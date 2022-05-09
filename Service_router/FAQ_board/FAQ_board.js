const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from FAQ_board", (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "FAQ 목록을 가져오는 중 문제가 발생하였습니다.", FAQs: []})
            } else {
                let FAQs = []
                rows.forEach((element, _)=> {
                    FAQs.push(element)
                });

                response.send({result: true, errStr: "", FAQs: FAQs})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다.", FAQs: []})
    }
})

router.post("/register", (request, response)=> {
    try {
        let title = request.body.title
        let context = request.body.context

        const FAQ_obj = {
            title: title,
            context: context
        }

        mysqlConn.connectionService.query("insert into FAQ_board set ?", FAQ_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "FAQ 등록 중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.put("/modify", (request, response)=> {
    try {
        let FAQ_id = request.body.FAQ_id
        let title = request.body.title
        let context = request.body.context

        const FAQ_obj = {
            title: title,
            context: context
        }

        mysqlConn.connectionService.query("update FAQ_board set ? where FAQ_id = ?", [FAQ_obj, FAQ_id], (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({reslut: false, errStr: "FAQ을 수정하는 중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.delete("/delete", (request, response)=> {
    try {
        let FAQ_id = request.body.FAQ_id

        mysqlConn.connectionService.query("delete from FAQ_board where FAQ_id = ?", FAQ_id, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "FAQ 삭제 중 문제가 발생하였습니다."})
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