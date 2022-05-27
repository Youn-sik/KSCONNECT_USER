// const nats = require("nats")

// const kepco_info = require("./RomingInfo.json")

// const nc = nats.connect({ servers: kepco_info.nats_host+ ":" +kepco_info.nats_port }, ()=> {
// // const nc = nats.connect({ servers: "localhost:4333" }, ()=> {
//     console.log(`connected to ${nc.getServer()}`);

//     const sc = nats.StringCodec()
//     const jc = nats.JSONCodec()

//     // do something with the connection
//     console.log("GEHHEH")
    
//     // matching the subscription
//     const sub1 = nc.subscribe("user.info.*")
//     const sub2 = nc.subscribe("charge_point.info.*")
//     const sub3 = nc.subscribe("charge_point.status.*")
//     const sub4 = nc.subscribe("connector.info.*")
//     const sub5 = nc.subscribe("connector.status.*")

    
// })

// module.exports = nc

//-------------------------

// const nc = require("./nats_load")

// const sub1 = nc.subscribe("user.info.*")
// const sub2 = nc.subscribe("charge_point.info.*")
// const sub3 = nc.subscribe("charge_point.status.*")
// const sub4 = nc.subscribe("connector.info.*")
// const sub5 = nc.subscribe("connector.status.*")

// ---------------------

const nats = require("nats")

// console.log("HIHI")
(async ()=> {
    const nc = await nats.connect({ servers: "172.16.3.89:4222" })
    const sc = nats.StringCodec()
    const jc = nats.JSONCodec()

    console.log("HIHI")

    const sub1 = nc.subscribe("user.info.list", {
        callback: (_err, msg)=> {
            console.log(`${jc.decode(msg.data)}`)
        },
        max: 1,
    })

    // const sub1 = nc.subscribe("user.info.list", (_err, msg)=> {
            
    // })

    const pub1 = nc.publish("user.info.list", jc.encode({test: "test"}))

})();