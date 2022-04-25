const express = require("express")
const router = express.Router()

router.get("/", async (request, response)=> {
    if(request.session.user) {
        console.log(request.session)
        response.send("세션이 존재하여 메인 페이지로 이동")
        // response.redirect("/app/dashboards/default")
    } else {
        response.send("세션이 존재하지 않아 로그인 페이지로 이동")
        // response.redirect("/app/login_path")
    }
})

module.exports = router