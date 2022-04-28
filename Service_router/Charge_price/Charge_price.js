const express = require("express")
const router = express.Router()
const mysqlConn = require("../../database_conn")

// 가격 정보 등록 및 수정 기능을 경로따서 만들기 - 등록 시 이미 존재하면 추가 안되도록 해야 할 텐데 제약 조건을 어떻게 할지 ?

router.post("/register", (request, response)=> {
    try {
        let public = request.body.public
        let season = request.body.season
        let power = request.body.power
        let kw100 = request.body.kw100
        let price = request.body.price

        const charge_price_obj = {
            public: public,
            season: season,
            power: power,
            kw100: kw100,
            price: price
        }

        mysqlConn.connectionService.query("insert into charge_price set ?", charge_price_obj, (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전 비용 등록중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })

    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.put("/modify", (request, response)=> {
    try {
        let public = request.body.public
        let season = request.body.season
        let power = request.body.power
        let kw100 = request.body.kw100
        let price = request.body.price

        const charge_price_arr = [public,season,power,kw100]

        mysqlConn.connectionService.query("update charge_price set price = ? WHERE public = ? AND season = ? AND power = ? AND kw100 = ?",
        [price, ...charge_price_arr], (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전 가격 정보를 갱신하는중 문제가 발생하였습니다."})
            } else {
                response.send({result: true, errStr: ""})
            }
        })

    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr: "잘못된 형식 입니다."})
    }
})

router.get("/list", (request, response)=> {
    try {
        mysqlConn.connectionService.query("select * from charge_price", (err, rows)=> {
            if(err) {
                console.error(err)
                response.status(400).send({result: false, errStr: "충전 가격 정보를 가져오는중 문제가 발생하였습니다.", charge_prices: []})
            } else {
                let charge_prices = []
                rows.forEach((element, _) => {
                    charge_prices.push(element)
                });
            
                response.send({result: true, errStr: "", charge_prices: charge_prices})
            }
        })
    } catch(err) {
        console.error(err)
        response.status(400).send({result: false, errStr:"잘못된 형식 입니다.", charge_prices: []})
    }
})

module.exports = router