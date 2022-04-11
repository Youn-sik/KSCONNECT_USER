const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const Index = require("./router/Index")
const Charging = require("./router/Charging/Charging")
const User = require("./router/User/User")
const Roming = require("./router/Roming/Roming")
const Calc = require("./router/Calc/Calc")
const Etc = require("./router/Etc/Etc")

const port = 4000
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
    console.log("Backend app is listening on port: ", port)
})

// 최소 연계 주기에 따라 서버에서 스스로 한전으로 req 보내도록 작업 필요 => FP 기반으로 작업