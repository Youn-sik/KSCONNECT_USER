const jwt = require('jsonwebtoken')

function jwtAuth(request, response, next) {
    const nonAuthPath = ["/", "/user/login", "/user/signup", "/user/info/check", "/fcm/push", "/payment/billingkey", "/payment/pay", "/charge_station/charge_price"]
    if(nonAuthPath.includes(request.path)) {
        return next()
    } 

    const token = request.headers.authorization

    if(!token) {
        return response.status(400).send({result: false, errStr: "토큰이 존재하지 않습니다."})
    }

    const vertify = new Promise(
        (resolve, reject) => {
            jwt.verify(token, "cho", (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    const onError = (err) => {
        if(err.name == "TokenExpireError") {
            response.status(400).send({result: false, errStr:"토큰이 만료되었습니다."})
        } else {
            response.status(400).send({result: false, errStr:"유효하지 않은 토큰입니다."})
        }
    }

    vertify.then((decoded)=>{
        request.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = jwtAuth