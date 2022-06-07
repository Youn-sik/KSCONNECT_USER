const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const fn = require("./mqtt_fuction")


app.use(cors({origin: true, credentials: true}))
app.use(cookieParser())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


let tmp1 = '{"device_id": "1","rfid": "aa01010493e3ae4993ff","timestamp": "2022-01-01T00:00:00"}'

let tmp = '{"transactionId": "347174","device_id": "connectorId","rfid": "aa01010493e3ae4993ff", "timestamp": "2022-01-01T08:00:00"}'

                

app.get("/charge/start", (req,res)=> {
    console.log("AAA")
    fn.transaction_start(JSON.parse(tmp1))
    res.send({"result": "OK"})
})
app.get("/charge/end", (req,res)=> {
    console.log("AAA")
    fn.transaction_stop(JSON.parse(tmp))
    res.send({"result": "OK"})
})


app.listen("6000", ()=> {
    console.log("[SERVER] > Mqtt test application is listening on port: "+ 6000)
})

module.exports = app;