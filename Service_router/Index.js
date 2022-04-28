const express = require("express")
const router = express.Router()

router.get("/", async (request, response)=> {
    if(request.session.user) {
        console.log(request.session)
        response.send({result: true, errStr: ""})
    } else {
        response.send({result: false, errStr:"세션이 존재하지 않습니다."})
    }
})

module.exports = router