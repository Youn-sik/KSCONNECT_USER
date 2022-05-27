
const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const test_client_key = "test_ck_Lex6BJGQOVDZ0462YXq8W4w2zNbg"
const test_secret_key = "test_sk_GKNbdOvk5rknlq6YqkzVn07xlzmj"
const encoded_test_secret_key = Buffer.from(test_secret_key, "utf8").toString('base64');

const http = require("https");

router.post("/billingkey", (request, response)=> {

    let cardNumber = request.body.cardNumber
    let cardExpirationYear = request.body.cardExpirationYear
    let cardExpirationMonth = request.body.cardExpirationMonth
    let cardPassword = request.body.cardPassword

    const options = {
        "method": "POST",
        "hostname": "api.tosspayments.com",
        "port": null,
        "path": "/v1/billing/authorizations/card",
        "headers": {
            "Authorization": "Basic "+encoded_test_secret_key+"Og==",
            "Content-Type": "application/json"
        }
    };
        
    const req = http.request(options, function (res) {
        // console.log(res)
        const chunks = [];
        
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        res.on("end", function () {
                const body = Buffer.concat(chunks);
                let result = JSON.parse(body)
                // console.log(result)
                response.send({billingKey: result.billingKey})
        });
    });
        
    req.write(JSON.stringify({
        // cardNumber: '5327501015763628',
        // cardExpirationYear: '27',
        // cardExpirationMonth: '01',
        // cardPassword: '05',
        cardNumber: cardNumber,
        cardExpirationYear: cardExpirationYear,
        cardExpirationMonth: cardExpirationMonth,
        cardPassword: cardPassword,
        customerIdentityNumber: '881212',
        customerKey: 'wUIoVT7H4zmmF2tR8tvCK'
    }));
    
    
    req.end();

})

// function get_billingkey() {
//     const options = {
//         "method": "POST",
//         "hostname": "api.tosspayments.com",
//         "port": null,
//         "path": "/v1/billing/authorizations/card",
//         "headers": {
//             "Authorization": "Basic "+encoded_test_secret_key+"Og==",
//             "Content-Type": "application/json"
//         }
//     };
        
//     const req = http.request(options, function (res) {
//         // console.log(res)
//         const chunks = [];
        
//         res.on("data", function (chunk) {
//             chunks.push(chunk);
//         });
        
//         res.on("end", function () {
//                 const body = Buffer.concat(chunks);
//                 let result = JSON.parse(body)
//                 console.log(result)
//             });
//     });
        
//     req.write(JSON.stringify({
//         cardNumber: '5327501015763628',
//         cardExpirationYear: '27',
//         cardExpirationMonth: '01',
//         cardPassword: '05',
//         customerIdentityNumber: '881212',
//         customerKey: 'wUIoVT7H4zmmF2tR8tvCK'
//     }));
    
//     req.end();
// }


router.post("/pay", (request, response)=> {

    // const billingkey = "Ggy_qdogXB0sfVYLGt5J1z4h-MZdEJmyerJrxPf2yUI="
    const billingkey = request.body.billingKey
    
    const options = {
        "method": "POST",
        "hostname": "api.tosspayments.com",
        "port": null,
        "path": "/v1/billing/"+billingkey,
        "headers": {
            "Authorization": "Basic "+encoded_test_secret_key+"Og==",
            "Content-Type": "application/json"
        }
    };
      
    const req = http.request(options, function (res) {
        const chunks = [];
        
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        res.on("end", function () {
            
            const body = Buffer.concat(chunks);
            let result = JSON.parse(body)
            // console.log(result);

            if(result.code != undefined) {
                response.send({code:result.code, message: result.message})
            } else {
                response.send({orderId: result.orderId, method: result.method, totalAmount: result.totalAmount, card: result.card})
            }
        });
    });
      
    req.write(JSON.stringify({
        customerKey: 'wUIoVT7H4zmmF2tR8tvCK',
        amount: request.body.amount,
        orderId: request.body.orderID,
        orderName: request.body.orderName
    }));

    req.end();

})


// function accecpt_payment() {
//     // const billingkey = "hvefNeU-TMdiibfZ9NnODH6Tgyk-cZjm3ihfq9k5jik="
//     const billingkey = "Ggy_qdogXB0sfVYLGt5J1z4h-MZdEJmyerJrxPf2yUI="
    
//     const options = {
//         "method": "POST",
//         "hostname": "api.tosspayments.com",
//         "port": null,
//         "path": "/v1/billing/"+billingkey,
//         "headers": {
//           "Authorization": "Basic dGVzdF9za19HS05iZE92azVya25scTZZcWt6Vm4wN3hsem1qOg==",
//           "Content-Type": "application/json"
//         }
//       };
      
//       const req = http.request(options, function (res) {
//         const chunks = [];
      
//         res.on("data", function (chunk) {
//           chunks.push(chunk);
//         });
      
//         res.on("end", function () {
//             const body = Buffer.concat(chunks);
//             console.log(body.toString());
//         });
//       });
      
//       req.write(JSON.stringify({
//         customerKey: 'wUIoVT7H4zmmF2tR8tvCK',
//         amount: 15000,
//         orderId: '1',
//         orderName: '전기차 충전 요금 납부'
//       }));
//       req.end();
// }

// function get_record_payment() {
//     const options = {
//         "method": "GET",
//         "hostname": "api.tosspayments.com",
//         "port": null,
//         // "path": "/v1/payments/orders/YT4Kr6BacKK4skG7KAJc4", //order id 로 조회
//         "path": "/v1/payments/qjvX2KBP9QADpexMgkW36g0aLmGd9VGbR5ozO06yLYlaEJ7d", //payment key 로 조회
//         "headers": {
//           "Authorization": "Basic dGVzdF9za19HS05iZE92azVya25scTZZcWt6Vm4wN3hsem1qOg=="
//         }
//       };
      
//       const req = http.request(options, function (res) {
//         const chunks = [];
      
//         res.on("data", function (chunk) {
//           chunks.push(chunk);
//         });
      
//         res.on("end", function () {
//           const body = Buffer.concat(chunks);
//           console.log(body.toString());
//         });
//       });
      
//       req.end();
// }

router.get("/record", (request, response)=> {

    let startDate = request.query.startDate

    const options = {
        "method": "GET",
        "hostname": "api.tosspayments.com",
        "port": null,
        // "path": "/v1/transactions?startDate=2022-01-01T00:00:00.000&endDate=2022-01-10T23:59:59.999",
        "path": "/v1/transactions?startDate=" + startDate + "&endDate=" + moment().format("YYYY-MM-DDTHH:mm:ss") + ".999",
        
        "headers": {
          "Authorization": "Basic dGVzdF9za19HS05iZE92azVya25scTZZcWt6Vm4wN3hsem1qOg=="
        }
    };
      
    const req = http.request(options, function (res) {
        const chunks = [];
      
        res.on("data", function (chunk) {
            chunks.push(chunk);   
        });
      
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            let result = JSON.parse(body)

            console.log(result);

            if(result.code != undefined) {
                response.send({code:result.code, message: result.message})
            } else {
                let record_arr = []
                result.forEach(element => {
                    let record_obj = {
                        orderId: element.orderId, 
                        method: element.method, 
                        amount: element.amount, 
                        transactionAt: element.transactionAt
                    }
                    record_arr.push(record_obj)
                });
                response.send({records: record_arr})
            }
            
        });
    });
      
      req.end();

})
    


// function get_record_deal() {
//     const options = {
//         "method": "GET",
//         "hostname": "api.tosspayments.com",
//         "port": null,
//         // "path": "/v1/transactions?startDate=2022-01-01T00:00:00.000&endDate=2022-01-10T23:59:59.999",
//         "path": "/v1/transactions?startDate=2022-05-01T00:00:00.000&endDate=" + moment().format("YYYY-MM-DDTHH:mm:ss") + ".999",
        
//         "headers": {
//           "Authorization": "Basic dGVzdF9za19HS05iZE92azVya25scTZZcWt6Vm4wN3hsem1qOg=="
//         }
//       };
      
//       const req = http.request(options, function (res) {
//         const chunks = [];
      
//         res.on("data", function (chunk) {
//           chunks.push(chunk);
//         });
      
//         res.on("end", function () {
//           const body = Buffer.concat(chunks);
//           console.log(body.toString());
//         });
//       });
      
//       req.end();
// }

// get_billingkey() // 키 발급
// accecpt_payment() // 결제
// get_record_payment() // about single data
// get_record_deal() // about multiple data

module.exports = router