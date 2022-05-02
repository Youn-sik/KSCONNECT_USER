const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select device_id,charge_device.station_id, charge_station.company_id, charge_device.name as device_name, " +
        "sirial as device_sirial, charge_type, charge_way, charge_device.available as device_available, charge_device.status as device_status, " +
        "charge_device.last_state as device_last_state, device_number, charge_station.name as station_name, charge_station.status as station_status, " +
        "charge_station.last_state as station_last_state, charge_station.address as station_address, charge_station.available as station_available, " +
        "park_fee, pay_type, company.name as company_name, company_number  from charge_device inner join charge_station " +
        "on charge_device.station_id = charge_station.station_id inner join company on charge_station.company_id = company.company_id", (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전기 정보를 가져오는중 문제가 발생하였습니다.", charge_devices: []})
            } else {
                let charge_devices = []
                rows.forEach((element, _)=> {
                    let charge_station_obj = {
                        device_id: element.device_id,
                        station_id: element.station_id,
                        company_id: element.company_id,
                        device_name: element.device_name,
                        device_sirial: element.device_sirial,
                        charge_type: element.charge_type,
                        charge_way: element.charge_way,
                        device_available: element.device_available,
                        device_status: element.device_status,
                        device_last_state: element.last_state,
                        device_number: element.device_number,
                        station_info: {
                            station_name: element.stations_name,
                            station_status: element.station_status,
                            station_last_state: element.station_last_state,
                            station_address: element.station_address,
                            station_available: element.station_available,
                            park_fee: element.park_fee,
                            pay_type: element.pay_type,
                            company_name: element.company_name,
                            company_number: element.company_number
                        }
                    }
                    charge_devices.push(charge_station_obj)
                })
                response.send({result: true, errStr: "", charge_devices: charge_devices})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", charge_devices: []})
    }
})

router.post("/register", (request, response)=> {
    try {
        let station_id = request.body.station_id
        let name = request.body.name
        let sirial = request.body.sirial
        let charge_type = request.body.charge_type
        let charge_way = request.body.charge_way
        let available = request.body.available
        let status = request.body.status
        let device_number = request.body.device_number

        const charge_device_obj = {
            station_id: station_id,
            name: name,
            sirial: sirial,
            charge_type: charge_type,
            charge_way: charge_way,
            available: available,
            status: status,
            device_number: device_number
        }

        mysqlConn.connectionService.query("insert into charge_device set ?", charge_device_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전기 등록중 문제가 발생하였습니다."})
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