const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from company", (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "운영사 정보를 가져오는중 문제가 발생하였습니다.", companies: []})
            } else {
                let companies = []
                rows.forEach((element, _) => {
                    companies.push(element)
                });
            
                response.send({result: true, errStr: "", companies: companies})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", companies: []})
    }
})

module.exports = router