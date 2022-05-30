const moment = require('moment');
const client = require("./mqtt_load")
const fn = require("./mqtt_fuction")
const test_api = require("./mqtt_test")

client.on('connect', ()=> {
    console.log('MQTT connected.');
    client.subscribe([
        '/alert/charge/start/+',
        '/alert/charge/end/+',
        '/alert/pay/end/+',

        '/ack/service',
        '/ack/csms',

        '/user/registered',
        'reply/users/registered',
        'request/chargepoint/registered',
        'chargepoint/connected',
        'chargepoint/disconnected',
        'request/chargepoint/connected',
        'reply/chargepoint/connected',
        'connector/status',
        'transaction/started',
        'transaction/finished',
        'reservation/terminated',
        'meter/value'
    ], (error, result) => {
        if (error) {
            console.erorr('MQTT subscribe error.');
        } else {
            console.log('MQTT subscribed.');

            setTimeout(()=> {
                // start transaction test
                let tmp1 = '{"device_id": "1","rfid": "aa01010493e3ae4993ff","timestamp": "2022-01-01T00:00:00", "meterStart": "0"}'
                fn.transaction_start(JSON.parse(tmp1))
            }, 5000)

            setTimeout(()=> {
                // end transaction test
                let tmp = '{"transactionId": "347174", "rfid": "aa01010493e3ae4993ff", "timestamp": "2022-01-01T08:00:00", "meterEnd": "100"}'
                fn.transaction_stop(JSON.parse(tmp))
            }, 10000)
        }
    });
});

client.on('disconnect', ()=> {
    console.log('MQTT disconnected')
})
client.on('close', ()=> {
    console.log('MQTT closeed')
})
client.on('error', (err)=> {
    console.error('MQTT errored')
    console.error(err)
})

client.on('message', async function(topic, message) {
    console.log("-----")
    console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' ' + topic);
    try {
        let context = message.toString();
        let json = JSON.parse(context);
        console.log(json)
        console.log("-----")

        if(topic === '/ack/service') {
            console.log("ackserviceackserviceackserviceackservice")
            client.publish('/ack/csms',JSON.stringify({"status": "ok"}));
            // fn.user_info_list()
        }



        if(topic === '/alert/charge/start') {
            
        }

        if(topic === '/alert/charge/end/') {
            
        }

        if(topic === '/alert/pay/end/') {
            
        }



        if(topic === '/user/registered') {
            
        }

        if(topic === 'reply/users/registered') {
            
        }

        if(topic === 'request/chargepoint/registered') {
            
        }



        if(topic === 'chargepoint/connected') {
            
        }

        if(topic === 'chargepoint/disconnected') {
            
        }

        if(topic === 'request/chargepoint/connected') {
            
        }

        if(topic === 'reply/chargepoint/connected') {
            
        }

        if(topic === 'connector/status') {
            
        }

        if(topic === 'transaction/started') {

            // let info = {
            //     device_id: json.connectorId,
            //     rfid: json.idTag,
            //     timestamp: json.timestamp
            // }
            let info =
            {
                'transactionId': json.transactionId,
                'device_id': json.connectorId,
                'rfid': json.idTag,
                'meterStart': json.meterStart,
                'timestamp': json.startTime,
                'station_id': json.chargePointId,
                'status': json.status
            }
            fn.transaction_start(info)
        }

        if(topic === 'transaction/finished') {
            let info =
            {
                'transactionId': json.transactionId,
                'device_id': json.connectorId,
                'rfid': json.idTag,
                'meterStop': json.meterStop,
                'timestamp': json.stopTime,
                'status': json.status
            }
            fn.transaction_stop(info)
        }

        if(topic === 'reservation/terminated') {
            
        }

        if(topic === 'meter/value') {
            
        }

       
    } catch(err) {
        console.error(err)
    }
})