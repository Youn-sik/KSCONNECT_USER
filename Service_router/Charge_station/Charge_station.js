const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get("/list", (request, response)=> {
    try {
        let search = request.query.search
        if(search) {
            // 검색하여
            mysqlConn.connectionService.query("select * from charge_station where address like ? or name like ?", ["%"+search+"%", "%"+search+"%"], (err, rows)=> {
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 정보를 검색하는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    let charge_station = []
                    rows.forEach((element, _)=> {
                        let charge_station_obj = {
                            station_id: element.station_id,
                            name: element.name,
                            status: element.status,
                            last_state: element.last_state,
                            address: element.address,
                            available: element.available,
                            park_fee: element.park_fee,
                            company_name: element.company_name,
                            company_number: element.company_number,
                            lat: element.lat,
                            longi: element.longi,
                            purpose: element.purpose
                        }
                        charge_station.push(charge_station_obj)
                    });
                    response.send({result: true, errStr: "", charge_stations: charge_station})
                }
            })
        } else {
            mysqlConn.connectionService.query("select station_id, charge_station.company_id, charge_station.name, status, last_state, purpose, " +
            "address, available, park_fee, company.name as company_name, company_number, lat, longi from charge_station inner join " +
            "company on charge_station.company_id = company.company_id", (err, rows)=> {
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 정보를 가져오는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    let charge_stations = []
                    rows.forEach((element, _)=> {
                        let charge_station_obj = {
                            station_id: element.station_id,
                            name: element.name,
                            status: element.status,
                            last_state: element.last_state,
                            address: element.address,
                            available: element.available,
                            park_fee: element.park_fee,
                            company_name: element.company_name,
                            company_number: element.company_number,
                            lat: element.lat,
                            longi: element.longi,
                            purpose: element.purpose
                        }
                        charge_stations.push(charge_station_obj)
                    })
                    response.send({result: true, errStr: "", charge_stations: charge_stations})
                }
            })
        }
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", charge_stations: []})
    }
})

router.post("/list", (request, response)=> {
    try {
        let status = request.body.status == undefined ? false : request.body.status
        let charge_way = request.body.charge_way == undefined ? false : request.body.charge_way
        let company = request.body.company == undefined ? false : request.body.company
        let charge_way_arr = []

        if(charge_way != false) {
            if(charge_way.includes("|")) { //여러개 일 때
                charge_way_arr = charge_way.split("|")

                if(charge_way_arr.length == 2) {//두개일 때
                    charge_way_arr.push(true)
                }
            } else { //한개일 때
                charge_way_arr.push(charge_way)
                charge_way_arr.push(true)
                charge_way_arr.push(true)
            }
        } else { //0개일 때
            charge_way_arr.push(false)
            charge_way_arr.push(false)
            charge_way_arr.push(false)
        }
        // console.log(charge_way_arr)

        mysqlConn.connectionService.query("select " +
        // "cd.device_id ,cd.name as cd_name, sirial, charge_type, charge_way, cd.available as cd_available, cd.status as cd_status, cd.last_state as cd_last_state, device_number, purpose, " +
        "cs.station_id, cs.name as cs_name, cs.status as cs_status, cs.last_state as cs_last_state, address, cs.available as cs_available, park_fee, pay_type, lat, longi, purpose, " +
        "c.name as c_name, company_number " +
        "from charge_device as cd " +
        "inner join charge_station as cs on cs.station_id = cd.station_id " +
        "inner join company as c on cs.company_id = c.company_id " +
        "where cd.status = ? and cd.charge_way in (?, ?, ?) and c.name = ? " +
        "group by cd.station_id"
        , [status, ...charge_way_arr, company], (err, rows)=> { 
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전소 목록을 가져오는중 문제가 발생하였습니다.", charge_stations: []})
            } else {
                // console.log(rows)
                let station_arr = []
                rows.forEach((element, _) => {
                    console.log(element)
                    let station_info = {
                            station_id: element.station_id,
                            name: element.cs_name,
                            status: element.cs_status,
                            last_state: element.cs_last_state,
                            address: element.address,
                            available: element.cs_available,
                            park_fee: element.park_fee,
                            pay_type: element.pay_type,
                            lat: element.lat,
                            longi: element.longi,
                            purpose: element.purpose,
                            company: element.c_name,
                            company_number: element.company_number,
                    }
                    station_arr.push(station_info)
                });
                // console.log(station_arr)
                response.send({result: true, errStr: "", charge_stations: station_arr})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", charge_stations: []})
    }
})

router.post("/list/search", (request, response)=> {
    try {
        let address = request.body.address == undefined ? false : request.body.address
        let charge_way = request.body.charge_way == undefined ? false : request.body.charge_way
        let charge_way_arr = []

        if(charge_way != false) {
            if(charge_way.includes("|")) { //여러개 일 때
                charge_way_arr = charge_way.split("|")

                if(charge_way_arr.length == 2) {//두개일 때
                    charge_way_arr.push(true)
                }
            } else { //한개일 때
                charge_way_arr.push(charge_way)
                charge_way_arr.push(true)
                charge_way_arr.push(true)
            }
        } else { //0개일 때
            charge_way_arr.push(false)
            charge_way_arr.push(false)
            charge_way_arr.push(false)
        }
        console.log(address, charge_way_arr)

        if(address == false) {
            mysqlConn.connectionService.query("select " +
            // "cd.device_id ,cd.name as cd_name, sirial, charge_type, charge_way, cd.available as cd_available, cd.status as cd_status, cd.last_state as cd_last_state, device_number, purpose, " +
            "cs.station_id, cs.name as cs_name, cs.status as cs_status, cs.last_state as cs_last_state, address, cs.available as cs_available, park_fee, pay_type, lat, longi, purpose, " +
            "c.name as c_name, company_number " +
            "from charge_device as cd " +
            "inner join charge_station as cs on cs.station_id = cd.station_id " +
            "inner join company as c on cs.company_id = c.company_id " +
            "where cd.charge_way in (?, ?, ?)" +
            "group by cd.station_id"
            , [ ...charge_way_arr], (err, rows)=> { 
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 목록을 가져오는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    console.log(rows)
                    let station_arr = []
                    rows.forEach((element, _) => {
                        console.log(element)
                        let station_info = {
                                station_id: element.station_id,
                                name: element.cs_name,
                                status: element.cs_status,
                                last_state: element.cs_last_state,
                                address: element.address,
                                available: element.cs_available,
                                park_fee: element.park_fee,
                                pay_type: element.pay_type,
                                lat: element.lat,
                                longi: element.longi,
                                purpose: element.purpose,
                                company: element.c_name,
                                company_number: element.company_number,
                        }
                        station_arr.push(station_info)
                    });
                    // console.log(station_arr)
                    response.send({result: true, errStr: "", charge_stations: station_arr})
                }
            })
        } else {
            mysqlConn.connectionService.query("select " +
            // "cd.device_id ,cd.name as cd_name, sirial, charge_type, charge_way, cd.available as cd_available, cd.status as cd_status, cd.last_state as cd_last_state, device_number, purpose, " +
            "cs.station_id, cs.name as cs_name, cs.status as cs_status, cs.last_state as cs_last_state, address, cs.available as cs_available, park_fee, pay_type, lat, longi, purpose, " +
            "c.name as c_name, company_number " +
            "from charge_device as cd " +
            "inner join charge_station as cs on cs.station_id = cd.station_id " +
            "inner join company as c on cs.company_id = c.company_id " +
            "where cs.address like ? and cd.charge_way in (?, ?, ?)" +
            "group by cd.station_id"
            , ["%"+address+"%",  ...charge_way_arr], (err, rows)=> { 
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 목록을 가져오는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    console.log(rows)
                    let station_arr = []
                    rows.forEach((element, _) => {
                        console.log(element)
                        let station_info = {
                                station_id: element.station_id,
                                name: element.cs_name,
                                status: element.cs_status,
                                last_state: element.cs_last_state,
                                address: element.address,
                                available: element.cs_available,
                                park_fee: element.park_fee,
                                pay_type: element.pay_type,
                                lat: element.lat,
                                longi: element.longi,
                                purpose: element.purpose,
                                company: element.c_name,
                                company_number: element.company_number,
                        }
                        station_arr.push(station_info)
                    });
                    // console.log(station_arr)
                    response.send({result: true, errStr: "", charge_stations: station_arr})
                }
            })
        }
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", charge_stations: []})
    }
})

router.post("/detail", (request, response)=> {
    try {
        let station_id = request.body.station_id
        mysqlConn.connectionService.query("select * " +
        "from charge_device "+
        // "inner join charge_staion on charge_device.station_id = charge_station.station_id " +
        "where station_id = ?", station_id, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전기 목록을 가져오는중 문제가 발생하였습니다.", charge_devices: []})
            } else {
                let charge_device_arr = []
                rows.forEach((element, _)=> {
                    let charge_device_obj = {
                        name: element.name,
                        sirial: element.sirial,
                        charge_type: element.charge_type,
                        charge_way: element.charge_way,
                        available: element.available,
                        status: element.status,
                        last_state: element.last_state,
                        device_number: element.device_number
                    }
                    charge_device_arr.push(charge_device_obj)
                })
                response.send({result: true, errStr: "", charge_devices: charge_device_arr})
            }
        })
    } catch(err) {
        console.error(err)
        response.send({result: false, errStr: "잘못된 형식 입니다.", charge_devices: []})
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
        let lat = request.body.lat
        let longi = request.body.longi
        let purpose = request.body.purpose

        const charge_station_obj = {
            company_id: company_id,
            name: name,
            status: status,
            address: address,
            available: available,
            park_fee: park_fee,
            pay_type: pay_type,
            lat: lat,
            longi: longi,
            purpose: purpose
        }

        mysqlConn.connectionService.query("insert into charge_station set ?", charge_station_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전소 등록중 문제가 발생하였습니다."})
            } else {
                // console.log(rows) 
                response.send({result: true, errStr: ""})

                // fn.charege_device_create(rows.insertId)
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

router.get("/charge_point/list", (request, response)=> {
    mysqlConn.connectionService.query("select station_id from charge_station", (err, rows)=> {
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 정보를 가져오는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    let charge_stations = []
                    rows.forEach((element, _)=> {
                        let charge_station_obj = {
                            station_id: element.station_id,
                        }
                        charge_stations.push(charge_station_obj)
                    })
                    response.send({charge_stations: charge_stations})
                }
            })
})

module.exports = router