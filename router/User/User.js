const express = require("express")
const router = express.Router()
const axios = require("axios")
const schedule = require("node-schedule")
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

const uid_info_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const uid_info_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await uid_info(basic_req_data)
    console.log(result)
})

const auth_info_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const auth_info_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await auth_info(basic_req_data)
    console.log(result)
})


// 1. 회원정보 조회
async function uid_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/uid/info`, JSON.stringify(req_data), header_json)
        .then(res=> {
            let spkey = res.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
            let list = res.body.list //*충전소정보 LIST (ex: )
            list.forEach(element, index => {
                let spid = element.spid //*회원사업자ID (ex: KPC, HEC)
                let cardno = element.cardno //*회원카드번호 (ex: 1010010000000000)
                let emaid = element.emaid //*차량회원번호 (ex: KRKEP8YKV7YZW06)
                let use_yn = element.use_yn //*사용가능여부 (ex: Y(로밍가능) N(로밍불가))
                let lost_yn = element.lost_yn //*카드분실 여부 (ex: Y(분실) N(미분실))
                let stop_yn = element.stop_yn //*카드사용 중지여부 (ex: Y(중지) N(미중지))
                let stop_st_date = element.stop_st_date //*카드사용 중지시작일시 (ex: 20200820135000)
                let stop_end_date = element.stop_end_date //*카드사용 중지종료일시 (ex: 20200820135000)
                let sp_reg_date = element.sp_reg_date //*회원사 등록일시 (ex: 20200820135000)
                let sp_upd_date = element.sp_upd_date //*회원사 변경일시 (ex: 20200820135000)
                let roaming_reg_date = element.roaming_reg_date //*로밍플랫폼 등록일시 (ex: 20200820135000)
                let roaming_upd_date = element.roaming_upd_date //*로밍플랫폼 변경일시 (ex: 20200820135000)
                let cert_pass = element.cert_pass //*회원카드 인증번호 (ex: 0000(숫자형 4자리))
                let issue_sp_cd = element.issue_sp_cd //*회원카드 발급사업자 (ex: )

                //각 결과(list) 처리 로직
                
                return({"result": true})
            })
        })
        .catch(err=> {
            console.error("[uid_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 2. 회원정보 등록/수정
async function uid_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/uid/update`, JSON.stringify(req_data), header_json)
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
            console.error("[uid_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 1. 회원인증 요청
async function auth_uid(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/auth/uid`, JSON.stringify(req_data), header_json)
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
                    let auth_id = element.auth_id //*인증요청ID (ex: KPC0000000000001)
                    let provider_id = element.provider_id //*회원가입 사업자ID (ex: KPC, HEC)
                    let cardno = element.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
                    let cert_pass = element.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
                    let emaid = element.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let auth_type = element.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
                    let csid = element.csid //*인증요청 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*인증요청 충전기ID (ex: KRKPC000000001)
                    let outlet_id = element.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
                    let auth_result = element.auth_result //*인증요청 확인결과 (ex: 코드참조)
                    let auth_result_date = element.auth_result_date //*인증결과응답일시 (ex: 20200822052634)
                    let auth_date = element.auth_date //*인증요청일시 (ex: 20200822052634)
                    let charge_ucost = element.charge_ucost //인증회원 충전단가 (ex: 255.70)
                    let charge_kwh = element.charge_kwh //인증회원 최대충전 가능량(kWh) (ex: 99999(기본) 1~99999)

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
            console.error("[auth_uid] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 2. QR인증 요청전송
async function auth_qr(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/auth/qr`, JSON.stringify(req_data), header_json)
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
                    let auth_id = element.auth_id //*인증요청ID (ex: KPC0000000000001)
                    let provider_id = element.provider_id //*회원가입 사업자ID (ex: KPC, HEC)
                    let cardno = element.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
                    let cert_pass = element.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
                    let emaid = element.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let auth_type = element.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
                    let csid = element.csid //*인증요청 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*인증요청 충전기ID (ex: KRKPC000000001)
                    let outlet_id = element.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
                    let auth_result = element.auth_result //*인증요청 확인결과 (ex: 코드참조)
                    let auth_result_date = element.auth_result_date //*인증결과응답일시 (ex: 20200822052634)
                    let auth_date = element.auth_date //*인증요청일시 (ex: 20200822052634)
                    let charge_ucost = element.charge_ucost //인증회원 충전단가 (ex: 255.70)
                    let charge_kwh = element.charge_kwh //인증회원 최대충전 가능량(kWh) (ex: 99999(기본) 1~99999)

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
            console.error("[auth_qr] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 3. QR인증 충전요청
async function auth_remote_qr(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/auth/remote/qr`, JSON.stringify(req_data), header_json)
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
                    let provider = element.provider //*회원가입 사업자ID (ex: KPC, HEC)
                    let auth_id = element.auth_id //*인증요청ID (ex: KPC0000000000001)
                    let cardno = element.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
                    let cert_pass = element.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
                    let emaid = element.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let auth_type = element.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
                    let csid = element.csid //*인증요청 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*인증요청 충전기ID (ex: KRKPC000000001)
                    let outlet_id = element.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
                    let auth_result = element.auth_result //*인증요청 확인결과 (ex: 코드참조)
                    let auth_result_date = element.auth_result_date //*인증결과응답일시 (ex: 20200822052634)
                    let auth_date = element.auth_date //*인증요청일시 (ex: 20200822052634)
                    let charge_ucost = element.charge_ucost //인증회원 충전단가 (ex: 255.70)
                    let charge_kwh = element.charge_kwh //인증회원 최대충전 가능량(kWh) (ex: 99999(기본) 1~99999)

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
            console.error("[auth_remote_qr] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 4. 회원인증 내역
async function auth_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/auth/info`, JSON.stringify(req_data), header_json)
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
                    let auth_id = element.auth_id //*인증요청ID (ex: KPC0000000000001)
                    let provider_id = element.provider_id //*로밍 사업자ID (ex: KPC, HEC)
                    let cardno = element.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
                    let cert_pass = element.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
                    let emaid = element.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let auth_type = element.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
                    let csid = element.csid //*인증요청 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*인증요청 충전기ID (ex: KRKPC000000001)
                    let outlet_id = element.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
                    let auth_result = element.auth_result //*인증요청 확인결과 (ex: 코드참조)
                    let auth_result_date = element.auth_result_date //*인증결과응답일시 (ex: 20200822052634)
                    let auth_date = element.auth_date //*인증요청일시 (ex: 20200822052634)
                    let charge_ucost = element.charge_ucost //인증회원 충전단가 (ex: 255.70)
                    let charge_kwh = element.charge_kwh //인증회원 최대충전 가능량(kWh) (ex: 99999(기본) 1~99999)
                    let issue_sp_cd = element.issue_sp_cd //*회원카드 발급사업자 (ex: )

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
            console.error("[auth_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 5.회원인증 결과 등록
async function auth_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/auth/update`, JSON.stringify(req_data), header_json)
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
            console.error("[auth_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

router.get("/", (req, res)=> {
    console.log("User")
    res.send("User")
})

// 1. 회원정보 조회
router.post("/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let cardno = request.body.cardno //조회 대상 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //조회 대상 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate = request.body.fromdate //변경시작일시 (ex: 20200820135000)
    let todate = request.body.todate //변경종료일시 (ex: 20200820135000)
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "cardno": cardno,
        "emaid": emaid,
        "selfex": selfex,
        "fromdate": fromdate,
        "todate": todate,
        "period": period,
    }

    let result = await uid_info(req_data)
    console.log(result)
})

// 2. 회원정보 등록/수정
router.post("/info/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*충전소정보 LIST (ex: )
    // let spid = request.body.spid //*회원사업자ID (ex: KPC, HEC)
    let cardno = request.body.cardno //*회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //*차량회원번호 (ex: KRKEP8YKV7YZW06)
    let use_yn = request.body.use_yn //*사용가능여부 (ex: Y(로밍가능) N(로밍불가))
    let lost_yn = request.body.lost_yn //*카드분실 여부 (ex: Y(분실) N(미분실))
    let stop_yn = request.body.stop_yn //*카드사용 중지여부 (ex: Y(중지) N(미중지))
    let stop_st_date = request.body.stop_st_date //*카드사용 중지시작일시 (ex: 20200820135000)
    let stop_end_date = request.body.stop_end_date //*카드사용 중지종료일시 (ex: 20200820135000)
    let sp_reg_date = request.body.sp_reg_date //*회원사 등록일시 (ex: 20200820135000)
    let sp_upd_date = request.body.sp_upd_date //*회원사 변경일시 (ex: 20200820135000)
    let cert_pass = request.body.cert_pass //*회원카드 인증번호 (ex: 0000(숫자형 4자리))
    let issue_sp_cd = request.body.issue_sp_cd //*회원카드 발급사업자 (ex: )

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "cardno": cardno,
            "emaid": emaid,
            "use_yn": use_yn,
            "lost_yn": lost_yn,
            "stop_yn": stop_yn,
            "stop_st_date": stop_st_date,
            "stop_end_date": stop_end_date,
            "sp_reg_date": sp_reg_date,
            "sp_upd_date": sp_upd_date,
            "cert_pass": cert_pass,
            "issue_sp_cd": issue_sp_cd,
        }
    }

    let result = await uid_update(req_data)
    console.log(result)
})

// 1. 회원인증 요청
router.post("/auth", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let cardno = request.body.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
    let cert_pass = request.body.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
    let emaid = request.body.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let auth_type = request.body.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
    let csid = request.body.csid //*인증요청 충전소ID (ex: KRKPC000000001)
    let cpid = request.body.cpid //*인증요청 충전기ID (ex: KRKPC000000001)
    let outlet_id = request.body.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
    let auth_date = request.body.auth_date //*인증요청일시 (ex: 20200822052634)

    let req_data = {
        "spkey": spkey,
        "cardno": cardno,
        "cert_pass": cert_pass,
        "emaid": emaid,
        "auth_type": auth_type,
        "csid": csid,
        "cpid": cpid,
        "outlet_id": outlet_id,
        "auth_date": auth_date,
    }

    let result = await auth_uid(req_data)
    console.log(result)
})

// 2. QR인증 요청전송
router.post("/qr_auth", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let cardno = request.body.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
    let cert_pass = request.body.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
    let emaid = request.body.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let auth_type = request.body.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
    let csid = request.body.csid //*인증요청 충전소ID (ex: KRKPC000000001)
    let cpid = request.body.cpid //*인증요청 충전기ID (ex: KRKPC000000001)
    let outlet_id = request.body.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
    let auth_date = request.body.auth_date //*인증요청일시 (ex: 20200822052634)

    let req_data = {
        "spkey": spkey,
        "cardno": cardno,
        "cert_pass": cert_pass,
        "emaid": emaid,
        "auth_type": auth_type,
        "csid": csid,
        "cpid": cpid,
        "outlet_id": outlet_id,
        "auth_date": auth_date,
    }

    let result = await auth_qr(req_data)
    console.log(result)
})

// 3. QR인증 충전요청
router.post("/qr_auth/charging", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let cardno = request.body.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
    let cert_pass = request.body.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
    let emaid = request.body.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let auth_type = request.body.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
    let csid = request.body.csid //*인증요청 충전소ID (ex: KRKPC000000001)
    let cpid = request.body.cpid //*인증요청 충전기ID (ex: KRKPC000000001)
    let outlet_id = request.body.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
    let auth_date = request.body.auth_date //*인증요청일시 (ex: 20200822052634)

    let req_data = {
        "spkey": spkey,
        "cardno": cardno,
        "cert_pass": cert_pass,
        "emaid": emaid,
        "auth_type": auth_type,
        "csid": csid,
        "cpid": cpid,
        "outlet_id": outlet_id,
        "auth_date": auth_date,
    }

    let result = await auth_remote_qr(req_data)
    console.log(result)
})

// 4. 회원인증 내역
router.post("/auth/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let cardno = request.body.cardno //조회 대상 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //조회 대상 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate = request.body.fromdate //이력조회시작일시 (ex: 20200820155000)
    let todate = request.body.todate //이력조회종료일시 (ex: 20200820155000)
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let auth_id = request.body.auth_id //회원인증 이력ID (ex: KPC0000000000001)
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: KPC0000000000001)
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: KPC0000000000001)
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //회원사 충전기ID (ex: )

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "cardno": cardno,
        "emaid": emaid,
        "selfex": selfex,
        "fromdate": fromdate,
        "todate": todate,
        "period": period,
        "auth_id": auth_id,
        "csid": csid,
        "cpid": cpid,
        "spcsid": spcsid,
        "spcpid": spcpid,
    }

    let result = await auth_info(req_data)
    console.log(result)
})

// 5.회원인증 결과 등록
router.post("/auth/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let auth_id = request.body.auth_id //*인증요청ID (ex: KEP0000000000001)
    let provider_id = request.body.provider_id //*로밍 사업자ID (ex: KEP, HEC)
    let cardno = request.body.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
    let cert_pass = request.body.cert_pass //*인증요청 회원카드 인증번호 (ex: 0000(숫자형 4자리))
    let emaid = request.body.emaid //*인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let auth_type = request.body.auth_type //*인증방법 (ex: 1(카드) 2(번호) 등)
    let csid = request.body.csid //*인증요청 충전소ID (ex: KRKEP000000001)
    let cpid = request.body.auth_id //*인증요청 충전기ID (ex: KRKEP000000001)
    let outlet_id = request.body.outlet_id //인증요청 충전기 아웃렛번호 (ex: 1(기본), 1~100범위)
    let auth_result = request.body.auth_result //*인증요청 확인결과 (ex: 코드참조)
    let auth_result_date = request.body.auth_result_date //*인증결과응답일시 (ex: 20200822052634)
    let auth_date = request.body.auth_date //*인증요청일시 (ex: 20200822052634)
    let charge_ucost = request.body.charge_ucost //인증회원 충전단가 (ex: 255.70)
    let charge_kwh = request.body.charge_kwh //인증회원 최대충전 가능량(kWh) (ex: 99999(기본) 1~99999)
    let issue_sp_cd = request.body.issue_sp_cd //*회원카드 발급사업자 (ex: )

    let req_data = {
        "spkey": spkey,
        "list": {
            "auth_id": auth_id,
            "provider_id": provider_id,
            "cardno": cardno,
            "cert_pass": cert_pass,
            "emaid": emaid,
            "auth_type": auth_type,
            "csid": csid,
            "cpid": cpid,
            "outlet_id": outlet_id,
            "auth_result": auth_result,
            "auth_result_date": auth_result_date,
            "auth_date": auth_date,
            "charge_ucost": charge_ucost,
            "charge_kwh": charge_kwh,
            "issue_sp_cd": issue_sp_cd,
        }
    }

    let result = await auth_update(req_data)
    console.log(result)
})

module.exports = router