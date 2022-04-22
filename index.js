const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const mysqlConn = require("./database_conn")

const Index = require("./router/Index")
const Charging = require("./router/Charging/Charging")
const User = require("./router/User/User")
const Roming = require("./router/Roming/Roming")
const Calc = require("./router/Calc/Calc")
const Etc = require("./router/Etc/Etc")

mysqlConn.connectionService.connect(err=> {
    if(err) console.error(err)
    console.log("[MYSQL] > 'Service_Platform' Database Conneted")
})

mysqlConn.connectionRoming.connect(err=> {
    if(err) console.error(err)
    console.log("[MYSQL] > 'Roming_Platform' Database Conneted")
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use("/", Index)
// app.use("/evapi", Index)
app.use("/evapi/charging", Charging)
app.use("/evapi/user", User)
app.use("/evapi/roming", Roming)
app.use("/evapi/calc", Calc)
app.use("/evapi/code", Etc)

app.listen("4000", ()=> {
    console.log("Backend app is listening on port: ", 4000)
})
