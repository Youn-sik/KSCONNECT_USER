const express = require("express")
const router = express.Router()
const axios = require("axios")
const kepco_info = require("../../RomingInfo.json")

const header_json = {
    "Content-Type": "application/json"
}

const kepco_host = kepco_info.kepco_host
const kepco_port = parseInt(kepco_info.kepco_port)
const ver = kepco_info.ver
const spid = kepco_info.spid
const spkey = kepco_info.spkey
const basic_req_data = {
    "spkey": spkey
}

async function code_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/code/info`, JSON.stringify(req_data), header_json)
        .then(res=> {
            //응답결과(result) 코드내역
            let result = res.body.result //*응답결과(result) 내역 (ex: 응답결과(result) 내역 참조)
            let errcode = res.body.errcode //*에러코드
            let snd_cnt = res.body.snd_cnt //*등록요청 건수(등록/수정시)
            let nor_cnt = res.body.nor_cnt //*정상처리 건수
            let rcv_cnt = res.body.rcv_cnt //*요청수신 건수(조회시)
            let ins_cnt = res.body.ins_cnt //*신규등록 건수(등록/수정시)
            let upd_cnt = res.body.upd_cnt //*변경등록 건수(등록/수정시)
            let err_cnt = res.body.err_cnt //*에러처리 건수
            let datetime = res.body.datetime //*처리기준 일시
            let errlist = res.body.errlist //*에러내역 리스트(등록/수정 오류분 errtList)
            let resultmsg = res.body.resultmsg //*에러내용

            //처리 결과
            if(result == 0 || result == 1) {
                //응답데이터(List)
                let list = res.body.list //*충전기정보List (ex: )
                list.forEach(element, index => {
                    let cd_tp = element.cd_tp //*코드구분 (ex: CD900)
                    let cd_tp_nm = element.cd_tp_nm //*코드명 (ex: )
                    let cd = element.cd //*코드 (ex: )
                    let cd_item = element.cd_item //*코드내용 (ex: )
                    let cd_tp_up = element.cd_tp_up //연계상위코드코드 (ex: )
                    let cd_up = element.cd_up //연계상위코드 (ex: )
                    let use_yn = element.use_yn //*사용여부 (ex: Y(사용) N(미사용))

                    //처리 결과
                    if(result == 1) { //요청처리 일부 정상완료
                        console.error("====error====")
                        console.error("요청처리 일부 정상완료")
                        console.error("errcode: ", errcode)
                        if(errcode == 100) {
                            console.error("--시스템 오류--")
                            console.error("시스템 에러")
                        } else if(errcode == 200) {
                            console.error("--구문 오류--")
                            console.error("요청형식 오류, 필수항목 누락")
                        } else if(errcode == 300) {
                            console.error("--검증 오류--")
                            console.error("데이터 오류")
                        } else if(errcode == 400) {
                            console.error("--코드값 오류--")
                            console.error("코드정의 오류")
                        } else if(errcode == 500) {
                            console.error("--데이터형식 오류--")
                            console.error("데이터 형식/속성 오류")
                        } else if(errcode == 600) {
                            console.error("--데이터 없음--")
                            console.error("조회/처리 데이터 없음")
                        }
                        console.error("오류분 errlist 확인")
                        console.error("errlist: ", errlist)
                        console.error("=============")
                        //각 결과(list) 처리 로직

                        return({"result": false, "errStr": "요청처리 일부 정상완료"})
                    } else { //정상
                        if(errcode == "") { //처리결과 오류가 없는 경우(errcode = "")
                            //각 결과(list) 처리 로직
                            
                            return({"result": true})
                        } else if(errcode == 600) { //처리데이터가 없는 경우, 응답데이터가 없는 경우
                            //각 결과(list) 처리 로직
                            
                            return({"result": true})
                        } else { //알 수 없는 정상 상태
                            console.log("====error====")
                            console.log("알 수 없는 정상 상태")
                            console.error("errcode: ", errcode)
                            console.error("errlist: ", errlist)
                            console.log("=============")
                            return({"result": false, "errStr": "알 수 없는 정상 상태"})
                        }
                    }    
                });   
            } else if(result == 2) { //요청처리 전체 에러
                console.error("====error====")
                console.error("요청처리 전체 에러")
                console.error("errcode: ", errcode)
                if(errcode == 100) {
                    console.error("--시스템 오류--")
                    console.error("시스템 에러")
                } else if(errcode == 200) {
                    console.error("--구문 오류--")
                    console.error("요청형식 오류, 필수항목 누락")
                } else if(errcode == 300) {
                    console.error("--검증 오류--")
                    console.error("데이터 오류")
                } else if(errcode == 400) {
                    console.error("--코드값 오류--")
                    console.error("코드정의 오류")
                } else if(errcode == 500) {
                    console.error("--데이터형식 오류--")
                    console.error("데이터 형식/속성 오류")
                } else if(errcode == 600) {
                    console.error("--데이터 없음--")
                    console.error("조회/처리 데이터 없음")
                }
                console.error("=============")
                return({"result": false, "errStr": "요청처리 전체 에러"})
            } else { //알 수 없는 에러 result 코드
                console.error("====error====")
                console.error("알 수 없는 에러 코드")
                console.error("result: ", result)
                console.error("errcode: ", errcode)
                console.error("errlist: ", errlist)
                console.error("=============")
                return({"result": false, "errStr": "알 수 없는 에러 코드"})
            }  
        })
        .catch(err=> {
            console.error("[code_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}


router.get("/", (req, res)=> {
    console.log("ETC")
    res.send("ETC")
})

// 1. 로밍코드 정보 조회
router.post("/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let code = request.body.code //조회코드 (ex: CD900)

    let req_data = {
        "spkey": spkey,
        "code": code,
    }

    let result = await code_info(req_data)
    console.log(result)
})


module.exports = router




/*
//응답결과(result) 코드내역
let result = res.body.result //*응답결과(result) 내역 (ex: 응답결과(result) 내역 참조)
let errcode = res.body.errcode //*에러코드
let snd_cnt = res.body.snd_cnt //*등록요청 건수(등록/수정시)
let nor_cnt = res.body.nor_cnt //*정상처리 건수
let rcv_cnt = res.body.rcv_cnt //*요청수신 건수(조회시)
let ins_cnt = res.body.ins_cnt //*신규등록 건수(등록/수정시)
let upd_cnt = res.body.upd_cnt //*변경등록 건수(등록/수정시)
let err_cnt = res.body.err_cnt //*에러처리 건수
let datetime = res.body.datetime //*처리기준 일시
let errlist = res.body.errlist //*에러내역 리스트(등록/수정 오류분 errtList)
let resultmsg = res.body.resultmsg //*에러내용

//처리 결과
if(result == 0 || result == 1) {
    //응답데이터(List)
    let list = res.body.list //*충전기정보List (ex: )
    list.forEach(element, index => {
        //
        //응답데이터
        //

        //처리 결과
        if(result == 1) { //요청처리 일부 정상완료
            console.error("====error====")
            console.error("요청처리 일부 정상완료")
            console.error("errcode: ", errcode)
            if(errcode == 100) {
                console.error("--시스템 오류--")
                console.error("시스템 에러")
            } else if(errcode == 200) {
                console.error("--구문 오류--")
                console.error("요청형식 오류, 필수항목 누락")
            } else if(errcode == 300) {
                console.error("--검증 오류--")
                console.error("데이터 오류")
            } else if(errcode == 400) {
                console.error("--코드값 오류--")
                console.error("코드정의 오류")
            } else if(errcode == 500) {
                console.error("--데이터형식 오류--")
                console.error("데이터 형식/속성 오류")
            } else if(errcode == 600) {
                console.error("--데이터 없음--")
                console.error("조회/처리 데이터 없음")
            }
            console.error("오류분 errlist 확인")
            console.error("errlist: ", errlist)
            console.error("=============")
            //각 결과(list) 처리 로직

            response.json({"result": false, "errStr": "요청처리 일부 정상완료"})
        } else { //정상
            if(errcode == "") { //처리결과 오류가 없는 경우(errcode = "")
                //각 결과(list) 처리 로직
                
                response.json({"result": true})
            } else if(errcode == 600) { //처리데이터가 없는 경우, 응답데이터가 없는 경우
                //각 결과(list) 처리 로직
                
                response.json({"result": true})
            } else { //알 수 없는 정상 상태
                console.log("====error====")
                console.log("알 수 없는 정상 상태")
                console.error("errcode: ", errcode)
                console.error("errlist: ", errlist)
                console.log("=============")
                response.json({"result": false, "errStr": "알 수 없는 정상 상태"})
            }
        }    
    });   
} else if(result == 2) { //요청처리 전체 에러
    console.error("====error====")
    console.error("요청처리 전체 에러")
    console.error("errcode: ", errcode)
    if(errcode == 100) {
        console.error("--시스템 오류--")
        console.error("시스템 에러")
    } else if(errcode == 200) {
        console.error("--구문 오류--")
        console.error("요청형식 오류, 필수항목 누락")
    } else if(errcode == 300) {
        console.error("--검증 오류--")
        console.error("데이터 오류")
    } else if(errcode == 400) {
        console.error("--코드값 오류--")
        console.error("코드정의 오류")
    } else if(errcode == 500) {
        console.error("--데이터형식 오류--")
        console.error("데이터 형식/속성 오류")
    } else if(errcode == 600) {
        console.error("--데이터 없음--")
        console.error("조회/처리 데이터 없음")
    }
    console.error("=============")
    response.json({"result": false, "errStr": "요청처리 전체 에러"})
} else { //알 수 없는 에러 result 코드
    console.error("====error====")
    console.error("알 수 없는 에러 코드")
    console.error("result: ", result)
    console.error("errcode: ", errcode)
    console.error("errlist: ", errlist)
    console.error("=============")
    response.json({"result": false, "errStr": "알 수 없는 에러 코드"})
}    
*/  