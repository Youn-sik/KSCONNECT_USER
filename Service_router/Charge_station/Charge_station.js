const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select station_id, charge_station.company_id, charge_station.name, status, last_state, " +
        "address, available, park_fee, company.name as company_name, company_number from charge_station inner join " +
        "company on charge_station.company_id = company.company_id", (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전소 정보를 가져오는중 문제가 발생하였습니다.", charge_stations: []})
            } else {
                let charge_stations = []
                rows.forEach((element, _)=> {
                    let charge_station_obj = {
                        name: element.name,
                        status: element.status,
                        last_state: element.last_state,
                        address: element.address,
                        available: element.available,
                        park_fee: element.park_fee,
                        company_name: element.company_name,
                        company_number: element.company_number
                    }
                    charge_stations.push(charge_station_obj)
                })
                response.send({result: true, errStr: "", charge_stations: charge_stations})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", charge_stations: []})
    }
})

router.post("/register", (request, response)=> {
    try {
        let company_id = request.body.company_id
        let name = request.body.name
        let status = request.body.status
        let address = request.body.address
        let available = request.body.available
        let park_fee = request.body.park_fee
        let pay_type = request.body.pay_type

        const charge_station_obj = {
            company_id: company_id,
            name: name,
            status: status,
            address: address,
            available: available,
            park_fee: park_fee,
            pay_type: pay_type
        }

        mysqlConn.connectionService.query("insert into charge_station set ?", charge_station_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전소 등록중 문제가 발생하였습니다."})
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