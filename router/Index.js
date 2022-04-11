const express = require("express")
const router = express.Router()

router.get("/", (req, res)=> {
    console.log("Index")
    res.send("Index")
})


module.exports = router