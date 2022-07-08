const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
// const session = require("express-session")
// const fileStore = require("session-file-store")(session)
const cors = require("cors")
const schedule = require("node-schedule")

const axios = require("axios")
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const jwtAuth = require("./Service_router/middlewares/jwtAuth")

const kepco_info = require("./RomingInfo.json")

const mysqlConn = require("./database_conn")

const Roming_Charging = require("./Roming_router/Charging/Charging")
const Roming_User = require("./Roming_router/User/User")
const Roming_Roming = require("./Roming_router/Roming/Roming")
const Roming_Calc = require("./Roming_router/Calc/Calc")
const Roming_Etc = require("./Roming_router/Etc/Etc")

const Index = require("./Service_router/Index")
const Service_User = require("./Service_router/User/User")
const Service_Product = require("./Service_router/Product/Product")
const Service_Charge_Price = require("./Service_router/Charge_price/Charge_price")
const Service_Company = require("./Service_router/Company/Company")
const Service_Charge_Station = require("./Service_router/Charge_station/Charge_station")
const Service_Charge_Device = require("./Service_router/Charge_device/Charge_device")
const Service_Notice_Board = require("./Service_router/Notice_board/Notice_board")
const Service_FAQ_Board = require("./Service_router/FAQ_board/FAQ_board")
const Service_Inquiry_Board = require("./Service_router/Inquiry_Board/Inquiry_Board")
const Payment = require("./Service_router/Payment/Payment")
const Fcm_Push = require("./Service_router/Fcm_Push/Fcm_Push")
const { request } = require("https")

// const mysqlStoreOption = {
//     host: kepco_info.mysql_host,
//     port: 3306,
//     user: kepco_info.mysql_user,
//     password: kepco_info.mysql_password,
//     databases: kepco_info.Service_Session
// }

const getHoliday = schedule.scheduleJob('0 0 0 1 */1 *', async ()=> {
    let now_time = moment().format('YYYY-MM-DD-HH-mm-ss') 
    let now_time_arr = now_time.split('-')
    globalThis.holiday = await get_holiday(now_time_arr)
})

mysqlConn.connectionService.connect(err=> {
    if(err) {
        console.error("[MYSQL] > 'Service_Platform' Database Connection Error")
        console.error(err)
    }
    console.log("[MYSQL] > 'Service_Platform' Database Conneted")
})

mysqlConn.connectionRoming.connect(err=> {
    if(err) { 
    console.error("[MYSQL] > 'Roming_Platform' Database Connection Error")
    console.error(err)
    }
    console.log("[MYSQL] > 'Roming_Platform' Database Conneted")
})

mysqlConn.connectionService.on('error', err=> {
    console.log(err.message)
    if(err.code == 'PROTOCOL_CONNECTION_LOST'){
        mysqlConn.connectionService.connect(err=> {
            if(err) { 
                console.error("[MYSQL] > 'connectionService' Database Connection Error")
                console.error(err)
            }
                console.log("[MYSQL] > 'connectionService' Database Conneted")    
        }) 
    } else throw err;
});

mysqlConn.connectionRoming.on('error', err=> {
    console.log(err.message)
    if(err.code == 'PROTOCOL_CONNECTION_LOST'){
        mysqlConn.connectionRoming.connect(err=> {
            if(err) { 
                console.error("[MYSQL] > 'Roming_Platform' Database Connection Error")
                console.error(err)
            }
                console.log("[MYSQL] > 'Roming_Platform' Database Conneted")    
        }) 
    } else throw err;
});

// setInterval(function () {
//     mysqlConn.connectionService.query('SELECT 1');   
//     mysqlConn.connectionRoming.query('SELECT 1');   
// }, 5000);

// const sessionStore = new mysqlStore(mysqlStoreOption);

app.use(cors({origin: true, credentials: true}))
// app.use(cors({origin: "http://172.16.135.135:3000", credentials: true}))
app.use(cookieParser())
// app.use(
//     session({
//         // key: "login_session",
//         // httpOnly: true,
//         // httpOnly: false,
//         secret: "cho",
//         resave: false,
//         saveUninitialized: true,
//         // cookie: {
//         //     // httpOnly: true,
//         //     httpOnly: false,
//         //     expires: 1000*60*60,
//         //     sameSite: "none"
//         // },
//         // store: new fileStore()
//   })
// )
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(jwtAuth)

// app.use("/evapi/charging", Roming_Charging)
// app.use("/evapi/user", Roming_User)
// app.use("/evapi/roming", Roming_Roming)
// app.use("/evapi/calc", Roming_Calc)
// app.use("/evapi/code", Roming_Etc)

app.use("/", Index)
app.use("/user", Service_User)
app.use("/product", Service_Product)
app.use("/charge_price", Service_Charge_Price)
app.use("/company", Service_Company)
app.use("/charge_station", Service_Charge_Station)
app.use("/charge_device", Service_Charge_Device)
app.use("/notice_board", Service_Notice_Board)
app.use("/FAQ_board", Service_FAQ_Board)
app.use("/inquiry_board", Service_Inquiry_Board)
app.use("/payment", Payment)
app.use("/fcm", Fcm_Push)    

app.listen("4000", ()=> {
    console.log("[SERVER] > Backend application is listening on port: "+ 4000)
})

mysqlConn.connectionService.query("select * from charge_price", async (err, rows)=> {
    if(err) {
        console.error(err)
        return
    }
    globalThis.G_chargePrice = rows

    let now_time = moment().format('YYYY-MM-DD-HH-mm-ss') 
    let now_time_arr = now_time.split('-')
    globalThis.holiday = await get_holiday(now_time_arr)
})


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