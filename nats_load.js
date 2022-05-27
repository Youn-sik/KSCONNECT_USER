const nats = require("nats")

const kepco_info = require("./RomingInfo.json")

const nc = nats.connect({ servers: kepco_info.nats_host+ ":" +kepco_info.nats_port })

module.exports = nc
