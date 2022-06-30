const express = require("express")
const router = express.Router()

const admin = require('firebase-admin')
let serAccount = require('../../chargeapp-5f4b7-firebase-adminsdk-rn9az-056ba1c017.json')
admin.initializeApp({
  credential: admin.credential.cert(serAccount),
})

async function fcm_push(title) {
    let testDeviceToken = "f4SqPfrHTRqiqh3hTRR7Qs:APA91bHK2rnkgDBNkDFwEAhmborlTuxcSs6gpbELpb0ln_tcIMHa6lsSpud1w03X5m6aZgnv2ZAUpzoEO_yrS81tV6Lpb2dRB7sxJyn3y2PCdYYhf_ksfYjRpOnsU_-N5h2JpPkLoBj1"
    
    const message = {
        data: {
            data: "TESTDATA"
        },
        notification: {
            title: title
        },
        token: testDeviceToken
    }
    await admin.messaging().send(message)
    .then(async (res)=> {
        console.log(res)
        return true
    })
    .catch(async (err)=> {
        console.error(err)
        return false
    })
}

router.post("/push", async (request, response)=> {
    try {
        let tmp = await fcm_push(request.body.title)
        // console.log(tmp)
        // if(tmp){
        //     response.send({"result":"true"})
        // } else {
        //     response.send({"result":"false"})
        // }
        response.send({"result":"true"})
    } catch(err) {
        console.error(err)
        response.status(400).send({"result": "false", "errStr":"잘못된 형식 입니다."})
    }
})


module.exports = router