const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

// router.get("/", async (request, response)=> {
//     if(request.session.user) {
//         console.log(request.session)
//         response.send({result: true, errStr: ""})
//     } else {
//         response.send({result: false, errStr:"세션이 존재하지 않습니다."})
//     }
// })
// router.get("/", async (request, response)=> {
//     try {
//         const decoded = request.decoded
//         console.log(decoded)
//         if(decoded)
//             response.send({result: true, errStr: ""})
//         else
//             throw new Error()
//     } catch(err) {
//         if(err.name == "TokenExpireError") {
//             response.status(400).send({result: false, errStr:"토큰이 만료되었습니다.."})
//         } else {
//             response.status(400).send({result: false, errStr:"유효하지 않은 토큰입니다."})
//         }
//     }
// })

router.get("/", async (request, response)=> {
    try {
        const decoded = jwt.verify(request.headers.authorization, "cho")
        if(decoded)
            response.send({result: true, errStr: ""})
        else
            throw new Error()
    } catch(err) {
        if(err.name == "TokenExpireError") {
            response.status(400).send({result: false, errStr:"토큰이 만료되었습니다."})
        } else {
            response.status(400).send({result: false, errStr:"유효하지 않은 토큰입니다."})
        }
    }
})

module.exports = router