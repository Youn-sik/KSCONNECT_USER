const moment = require('moment');
const client = require("./mqtt_load")
const fn = require("./mqtt_fuction")

client.on('connect', function(test) {
    console.log('MQTT connected.');
    client.subscribe([
        '/alert/charge/start/+',
        '/alert/charge/end/+',
        '/alert/pay/end/+',
    ], (error, result) => {
        if (error) {
            console.erorr('MQTT subscribe error.');
        } else {
            console.log('MQTT subscribed.');
            client.publish('/alert/charge/start/',JSON.stringify({"test": "test"}));
        }
    });
});


client.on('message', async function(topic, message) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ' ' + topic);
    try {
        let context = message.toString();
        let json = JSON.parse(context);
        console.log(json)

        if (topic === '/alert/charge/start') {
            
        }

        if (topic === '/alert/charge/end/') {
            
        }

        if (topic === '/alert/pay/end/') {
            
        }
    } catch(err) {
        console.error(err)
    }
})