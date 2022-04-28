const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
// const mysqlStore = require("express-mysql-session")(session)
const cors = require("cors")
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

// const mysqlStoreOption = {
//     host: kepco_info.mysql_host,
//     port: 3306,
//     user: kepco_info.mysql_user,
//     password: kepco_info.mysql_password,
//     databases: kepco_info.Service_Session
// }

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
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(
    session({
        // key: "login_session",
        secret: "cho",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: 1000*60*60
        }
        // store: sessionStore
  })
)

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

app.listen("4000", ()=> {
    console.log("[SERVER] > Backend application is listening on port: "+ 4000)
})
