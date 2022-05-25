const kepco_info = require("./RomingInfo.json")
const mqtt = require("mqtt")
const client = mqtt.connect({
    host: kepco_info.mqtt_host,
    port: kepco_info.port,
    protocol: "mqtt ",
    clientId: "cho",
    clean: true,
    keepalive: 60,
    reconnectioniPeriod: 5000,
    connectTimeout: 15000
})

client.on('error',function (err) {
    console.error(err)
})

module.exports = client;