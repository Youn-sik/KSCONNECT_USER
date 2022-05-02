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

router.post("/register", (request, response)=> {
    try {
        let name = request.body.name
        let company_number = request.body.company_number

        const company_obj = {
            name: name,
            company_number: company_number
        }

        mysqlConn.connectionService.query("insert into company set ?", company_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: ""})
            } else {
                response.send({result: true, errStr: ""})
            }
        })

    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

router.put("/modify", (request, response)=> {
    try {

    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다."})
    }
})

module.exports = router