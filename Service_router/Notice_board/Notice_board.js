const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from notice_board", (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "공지사항 목록을 가져오는 중 문제가 발생하였습니다.", notices: []})
            } else {
                let notices = []
                rows.forEach((element, _)=> {
                    notices.push(element)
                });

                response.send({result: true, errStr: "", notices: notices})
            }
        })
    } catch(err) {
        console.err(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다.", notices: []})
    }
})

router.post("/register", (request, response)=> {
    try {
        let title = request.body.title
        let context = request.body.context
        let date = moment().format('YYYY-MM-DD HH:mm:ss')

        const notice_obj = {
            title: title,
            context: context,
            date: date
        }

        mysqlConn.connectionService.query("insert into notice_board set ?", notice_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "공지사항 등록 중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })
    } catch(err) {
        console.err(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.put("/modify", (request, response)=> {
    try {
        let notice_id = request.body.notice_id
        let title = request.body.title
        let context = request.body.context
        let date = moment().format('YYYY-MM-DD HH:mm:ss') //등록일로 할거면 업데이트 시 갱신하여 저장하지 않기.

        const notice_obj = {
            title: title,
            context: context,
            date: date
        }

        mysqlConn.connectionService.query("update notice_board set ? where notice_id = ?", [notice_obj, notice_id], (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({reslut: false, errStr: "공지사항을 수정하는 중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })
    } catch(err) {
        console.err(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.delete("/delete", (request, response)=> {
    try {
        let notice_id = request.body.notice_id

        mysqlConn.connectionService.query("delete from notice_board where notice_id = ?", notice_id, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "공지사항 삭제 중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })
    } catch(err) {
        console.err(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

module.exports = router