const nats = require("nats")
const sc = nats.StringCodec()
const jc = nats.JSONCodec()

const nc = require("./nats_load")

module.exports = {


    async publish(path, obj) {
        let json = JSON.stringify(obj)
        await nc.publish(path, jc.encode(json))
    }

}
