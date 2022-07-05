const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")
const axios = require("axios")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// 특일 정보 데이터 유효 연도(2024-06-07) 이후에는 재 신청하여 사용 필요.
async function get_holiday(now_time_arr) {
    let solYear = now_time_arr[0]
    let solMonth = now_time_arr[1]
    let ServiceKey = "jfBsg4lK63Nz%2BvKrJd%2F7GPg4cWhMRbHnuANvDhLau2jiR6iOPofuBQ8LaPSGiE5zVSwzki9tGrezxvZEac057A%3D%3D"
    let _type = "json"

    // 공휴일 데이터 GET
    return await axios.get(`http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${solYear}&solMonth=${solMonth}&_type=${_type}&ServiceKey=${ServiceKey}`)
    .then((res)=> {
        let result = res.data.response 
        if(result.header.resultCode != '00') {
            return null
        } else {
            let items = result.body.items.item
            let holidays = []
            if (items != undefined) {
                items.forEach(element=> {
                    holidays.push(element.locdate)
                })
            }
            return holidays
        }
    })
}

async function get_charge_price(public) {
// const get_charge_price = async(public)=> {
    try{
        if(public == 'public') { // 공용
            return new Promise((resolve, reject)=> {
                mysqlConn.connectionService.query("select * from charge_price where public = 'Y' and kw100 = 'N'", (err, rows)=> {
                    if(err) {
                        console.error(err)
                        resolve(null)
                    } else {
                        let price = rows[0].price
                        resolve(price)
                    }
                })
            })
        } else { // 비공용
            let now_time = moment().format('YYYY-MM-DD-HH-mm-ss') 

            // yoil = 0, 6 이 일요일 및 토요일 이다.
            let yoil = moment().format('e')
            let now_time_arr = now_time.split('-')
            let season
            let power

            // 공휴일 GET
            let date = await get_holiday(now_time_arr)

            // 비교 할 오늘 날짜
            let compare_date = now_time_arr[0] + now_time_arr[1] + now_time_arr[2]

            let holiday = 'N'
            // 공휴일 date + 일 및 겹치는 날짜는 제거해서 forEach 문 돌리기
            if (date.length != 0) {
                date.forEach(element=>  {
                    if((element == compare_date) || yoil == 0) {
                        holiday = 'Y'
                    }
                })
            }

            // 가격 조건 구하기
            if(holiday == 'Y') { // 공휴일 및 일요일
                power = 'S'
            } else {
                // 평일 또는 토요일
                if(now_time_arr[1] >= 6 && now_time_arr[1] <= 8) { // 여름 (season = S)
                    if(now_time_arr[3] == 9 || now_time_arr[3] == 12 || (now_time_arr[3] >= 17 && now_time_arr[3] < 23)) { // 중간 부하
                        power = 'M'
                    } else if((now_time_arr[3] >= 10 && now_time_arr[3] < 12) || (now_time_arr[3] >= 13 && now_time_arr[3] < 17)) { // 최대 부하
                        power = 'L'
                    } else { // 경 부하
                        power = 'S'
                    }
                    season = 'S'
                } else if((now_time_arr[1] >= 3 && now_time_arr[1] <= 5) || (now_time_arr[1] >= 9 && now_time_arr[1] <= 10)) { // 봄,가을 (season = E)
                    if(now_time_arr[3] == 9 || now_time_arr[3] == 12 || (now_time_arr[3] >= 17 && now_time_arr[3] < 23)) { // 중간 부하
                        power = 'M'
                    } else if((now_time_arr[3] >= 10 && now_time_arr[3] < 12) || (now_time_arr[3] >= 13 && now_time_arr[3] < 17)) { // 최대 부하
                        power = 'L'
                    } else { // 경 부하
                        power = 'S'
                    }
                    season = 'E'
                } else { //겨울 (season = W)
                    if(now_time_arr[3] == 9 || (now_time_arr[3] >= 12 && now_time_arr[3] < 17) || (now_time_arr[3] >= 20 && now_time_arr[3] < 22)) { // 중간 부하
                        power = 'M'
                    } else if((now_time_arr[3] >= 10 && now_time_arr[3] < 12) || (now_time_arr[3] >= 17 && now_time_arr[3] < 20) || now_time_arr[3] == 22) { // 최대 부하
                        power = 'L'
                    } else { // 경 부하
                        power = 'S'
                    }
                    season = 'W'
                }

                // 토요일(최대 부하만 중간 부하로 적용)
                if(yoil == 6 && power == 'L') {
                    power = 'M'
                }
            } 

            if(power == 'L') {
                return new Promise((resolve, reject)=> {
                    mysqlConn.connectionService.query("select * from charge_price where public = 'N' and kw100 = 'N' and season = ? and power = ? ", [season, power], (err, rows)=> {
                        if(err) {
                            console.error(err)
                            resolve(null)
                        } else {
                            let price = rows[0].price
                            resolve(price)
                        }
                    })
                })
            } else {
                return new Promise((resolve, reject)=> {
                    mysqlConn.connectionService.query("select * from charge_price where public = 'N' and season = ? and power = ? ", [season, power], (err, rows)=> {
                        if(err) {
                            console.error(err)
                            resolve(null)
                        } else {
                            let price = rows[0].price
                            resolve(price)
                        }
                    })
                })
            }
        }
    } catch(err) {
        console.error(err)
    }
}

router.get("/list", async(request, response)=> {
    try {
        let search = request.query.search
        if(search) {
            // 검색하여
            mysqlConn.connectionService.query("select station_id , cs.name as cs_name, status, last_state, address, available, park_fee, pay_type, lat, longi, purpose, "
            +"c.name as c_name, company_number from charge_station as cs inner join company as c on cs.company_id = c.company_id where address like ? or cs.name like ?", ["%"+search+"%", "%"+search+"%"], async(err, rows)=> {
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 정보를 검색하는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    let charge_station = []
                        for (const element of rows) {
                            let price = await get_charge_price(element.purpose)
                            let charge_station_obj = {
                                station_id: element.station_id,
                                name: element.cs_name,
                                status: element.status,
                                last_state: element.last_state,
                                address: element.address,
                                available: element.available,
                                park_fee: element.park_fee,
                                company_name: element.company_name,
                                company_number: element.company_number,
                                lat: element.lat,
                                longi: element.longi,
                                purpose: element.purpose,
                                company_name: element.c_name,
                                company_number: element.company_number,
                                charge_price: price
                            }
                            charge_station.push(charge_station_obj)
                        }

                        response.send({result: true, errStr: "", charge_stations: charge_station})
                }
            })
        } else {
            mysqlConn.connectionService.query("select station_id, charge_station.company_id, charge_station.name, status, last_state, purpose, " +
            "address, available, park_fee, company.name as company_name, company_number, lat, longi from charge_station inner join " +
            "company on charge_station.company_id = company.company_id", async(err, rows)=> {
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 정보를 가져오는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    let charge_stations = []
                    for (const element of rows) {
                        let price = await get_charge_price(element.purpose)
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
                            purpose: element.purpose,
                            charge_price: price
                        }
                        charge_stations.push(charge_station_obj)
                    }
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
        let company_arr = []

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

        if(company != false) {
            if(company.includes("|")) { //여러개 일 때
                company_arr = company.split("|")
            } else { //한개일 때
                company_arr.push(company)
            }
        } else { //0개일 때
            company_arr.push(false)
        }
        // console.log(company_arr)

        c_name_count = company_arr.length
        c_name_where_question = ""
        for (let i=0; i<c_name_count; i++) {
            if(c_name_count - 1 == i) c_name_where_question += "?"
            else c_name_where_question += "?,"
        }
        c_name_where_query = `c.name in (${c_name_where_question})`
        // console.log(c_name_where_query)

        mysqlConn.connectionService.query("select " +
        // "cd.device_id ,cd.name as cd_name, sirial, charge_type, charge_way, cd.available as cd_available, cd.status as cd_status, cd.last_state as cd_last_state, device_number, purpose, " +
        "cs.station_id, cs.name as cs_name, cs.status as cs_status, cs.last_state as cs_last_state, address, cs.available as cs_available, park_fee, pay_type, lat, longi, purpose, " +
        "c.name as c_name, company_number " +
        "from charge_device as cd " +
        "inner join charge_station as cs on cs.station_id = cd.station_id " +
        "inner join company as c on cs.company_id = c.company_id " +
        "where cd.status = ? and cd.charge_way in (?, ?, ?) and " + c_name_where_query + " " +
        "group by cd.station_id"
        , [status, ...charge_way_arr, ...company_arr], async(err, rows)=> { 
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전소 목록을 가져오는중 문제가 발생하였습니다.", charge_stations: []})
            } else {
                console.log(rows)
                let station_arr = []
                for (const element of rows) {
                    let price = await get_charge_price(element.purpose)
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
                            charge_price: price
                    }
                    station_arr.push(station_info)
                }
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
        // console.log(address, charge_way_arr)

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
            , [ ...charge_way_arr], async(err, rows)=> { 
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 목록을 가져오는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    // console.log(rows)
                    let station_arr = []
                    for (const element of rows) {
                        let price = await get_charge_price(element.purpose)
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
                            company_name: element.c_name,
                            company_number: element.company_number,
                            charge_price: price
                        }
                        station_arr.push(station_info)
                    }
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
            , ["%"+address+"%",  ...charge_way_arr], async(err, rows)=> { 
                if(err) {
                    console.error(err)
                    response.status(400).send({result: false, errStr: "충전소 목록을 가져오는중 문제가 발생하였습니다.", charge_stations: []})
                } else {
                    // console.log(rows)
                    let station_arr = []
                    for (const element of rows) {
                        let price = await get_charge_price(element.purpose)
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
                                company_name: element.c_name,
                                company_number: element.company_number,
                                charge_price: price
                        }
                        station_arr.push(station_info)
                    }
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

router.post("/charge_price", async (request, response)=> {
    console.log(request.body)
    mysqlConn.connectionService.query("select purpose from charge_station where station_id = ?", request.body.station_id, async (err, rows)=> {
        if(err) {
            console.error(err)
            response.status(400).send({result: false, errStr: "충전소 정보를 가져오는중 문제가 발생하였습니다.", charge_price: parseFloat(0)})
        } else {
            console.log(rows[0])
            let price = await get_charge_price(rows[0].purpose)
            response.send({result: true, errStr: "", charge_price: parseFloat(price)})
        }
    })
})

module.exports = router