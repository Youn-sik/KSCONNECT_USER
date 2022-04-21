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

const charge_static_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const charge_static_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await charge_static(basic_req_data)
    console.log(result)
})

const charge_static_detail_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const charge_static_detail_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await charge_static_detail(basic_req_data)
    console.log(result)
})

const charge_static_update_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const charge_static_update_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await charge_static_update(basic_req_data)
    console.log(result)
})

const charge_static_detail_update_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const charge_static_detail_update_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await charge_static_detail_update(basic_req_data)
    console.log(result)
})


// 1. 로밍 충전내역 조회
async function charge_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/info`, JSON.stringify(req_data), header_json)
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
                    let spid = element.spid //회원사ID (ex: KPC, HEC)
                    let trade_spid = element.trade_spid //충전거래 사업자ID (ex: KPC, HEC)
                    let charge_id = element.charge_id //로밍플랫폼 충전내역ID (ex: KPC0000000000001)
                    let csid = element.csid //로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let spcsid = element.spcsid //회원사 충전소ID (ex: )
                    let spcpid = element.spcpid //회원사 충전기ID (ex: )
                    let outlet_id = element.outlet_id //충전기 아웃렛ID (ex: 1(기본), 1~100범위)
                    let charge_st_date = element.charge_st_date //충전시작시각 (ex: 20200820155000)
                    let charge_end_date = element.charge_end_date //충전완료시각 (ex: 20200820155000)
                    let charge_kwh = element.charge_kwh //충전량(합계/kWh) (ex: 25.50)
                    let charge_kwh1 = element.charge_kwh1 //충전량(경부하/kWh) (ex: 25.50)
                    let charge_kwh2 = element.charge_kwh2 //충전량(중간부하/kWh) (ex: 25.50)
                    let charge_kwh3 = element.charge_kwh3 //충전량(최대부하/kWh) (ex: 25.50)
                    let cardno = element.cardno //충전카드번호 (ex: 1010010101010101)
                    let emaid = element.emaid //차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let charge_tp = element.charge_tp //충전방식 (ex: 1(완속) 2(급속))
                    let outlet_tp = element.outlet_tp //충전아웃렛구분 (ex: 코드참조)
                    let sp_ucost1 = element.sp_ucost1 //회원사 정산단가(경부하) (ex: 255.70)
                    let sp_ucost2 = element.sp_ucost2 //회원사 정산단가(중간부하) (ex: 255.70)
                    let sp_ucost3 = element.sp_ucost3 //회원사 정산단가(최대부하) (ex: 255.70)
                    let charge_amt = element.charge_amt //회원사 정산요금(합계) (ex: 1500)
                    let charge_amt1 = element.charge_amt1 //회원사 정산요금(경부하) (ex: 800)
                    let charge_amt2 = element.charge_amt2 //회원사 정산요금(중간부하) (ex: 200)
                    let charge_amt3 = element.charge_amt3 //회원사 정산요금(최대부하) (ex: 500)
                    let roaming_fee = element.roaming_fee //로밍플랫폼연계 수수료 (ex: 150)
                    let charge_reg_date = element.charge_reg_date //충전내역 사업자 등록일시 (ex: 20200820155000)
                    let charge_upd_date = element.charge_upd_date //충전내역 사업자 변경일시 (ex: 20200820155000)
                    let roaming_reg_date = element.roaming_reg_date //충전내역 로밍플랫폼 등록일시 (ex: 20200820155000)
                    let roaming_upd_date = element.roaming_upd_date //충전내역 로밍플랫폼 변경일시 (ex: 20200820155000)
                    let sp_charge_id = element.sp_charge_id //충전사업자 충전내역ID (ex: 충전사업자 내부관리ID)
                    let auth_id = element.auth_id //인증요청ID (ex: KPC0000000000001)
                    let charge_send_date = element.charge_send_date //충전내역 사업자 전송일시 (ex: 20200820155000)
                    let charge_recv_date = element.charge_recv_date //충전내역 전송결과 확인일시 (ex: 20200820155000)
                    let platform_spid = element.platform_spid //로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))

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
            console.error("[charge_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 2. 로밍회원 충전진행 상태
async function charge_status(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/status`, JSON.stringify(req_data), header_json)
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
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let trade_spid = element.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
                    let cardno = element.cardno //*회원카드번호 (ex: 1010010000000000)
                    let emaid = element.emaid //차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let status_cd = element.status_cd //*충전기 상태코드 (ex: 코드참조)
                    let status_dtl_cd = element.status_dtl_cd //*충전기 상태 상세코드 (ex: 코드참조)
                    let status_date = element.status_date //*충전기 상태변경 일시 (ex: 20200820155000)
                    let spcsid = element.spcsid //충전사업자 충전소ID (ex: )
                    let spcpid = element.spcpid //충전사업자 충전기ID (ex: )
                    let charge_st_date = element.charge_st_date //*충전시작일시 (ex: 20200820155000)
                    let charge_soc = element.charge_soc //충전진행SOC값 (ex: 85.00)
                    let charge_tp = element.charge_tp //충전방식 (ex: 1(완속) 2(급속))
                    let outlet_tp = element.outlet_tp //충전커넥터타입 (ex: 코드참조)
                    let charge_kwh = element.charge_kwh //*충전진행충전량(kWh) (ex: 25.50)
                    let charge_amt = element.charge_amt //충전진행요금(원) (ex: 1500)
                    let outlet_id = element.outlet_id //*충전진행 아웃렛ID (ex: 1)

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
            console.error("[charge_status] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 3.로밍회원 충전진행 상태 등록
async function charge_status_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/status/update`, JSON.stringify(req_data), header_json)
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
            console.error("[charge_status_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 4. 로밍 충전내역 등록/수정
async function charge_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/update`, JSON.stringify(req_data), header_json)
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
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let trade_spid = element.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
                    let sp_charge_id = element.sp_charge_id //*충전사업자 충전내역ID (ex: 충전사업자 내부관리ID)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let spcsid = element.spcsid //*회원사 충전소ID (ex: )
                    let spcpid = element.spcpid //*회원사 충전기ID (ex: )
                    let outlet_id = element.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
                    let charge_st_date = element.charge_st_date //*충전시작시각 (ex: 20200820155000)
                    let charge_end_date = element.charge_end_date //*충전완료시각 (ex: 20200820155000)
                    let cardno = element.cardno //*충전카드번호 (ex: 1010010101010101)
                    let emaid = element.emaid //차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let platform_spid = element.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))
                    let charge_id = element.charge_id //*로밍플랫폼 충전내역ID (ex: KPC0000000000001)
                    let charge_recv_rdate = element.charge_recv_rdate //*충전내역 연계 등록일시 (ex: 20200820155000)
                    let charge_recv_udate = element.charge_recv_udate //*충전내역 연계 변경일시 (ex: 20200820155000)

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
            console.error("[charge_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 5. 로밍 충전 통계 조회
async function charge_static(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/static`, JSON.stringify(req_data), header_json)
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
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let trade_spid = element.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
                    let platform_spid = element.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))
                    let charge_ymd = element.charge_ymd //*충전일자 (ex: 20200827)
                    let charge_cnt = element.charge_cnt //*충전건수(건) (ex: 25)
                    let charge_kwh = element.charge_kwh //*충전량(kWh) (ex: 845.85)
                    let charge_amt = element.charge_amt //*충전요금(원) (ex: 248530)
                    let reg_date = element.reg_date //*충전통계 생성일시 (ex: 20200820155000)
                    let upd_date = element.upd_date //*충전통계 변경일시 (ex: 20200820155000)

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
            console.error("[charge_static] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 6. 로밍 충전 통계내역 조회
async function charge_static_detail(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/static/detail`, JSON.stringify(req_data), header_json)
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
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let trade_spid = element.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
                    let platform_spid = element.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))
                    let charge_ymd = element.charge_ymd //*충전통계일자 (ex: 20200827)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let outlet_id = element.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
                    let spcsid = element.spcsid //충전사업자 충전소ID (ex: )
                    let spcpid = element.spcpid //충전사업자 충전기ID (ex: )
                    let charge_cnt = element.charge_cnt //*충전건수(건) (ex: 25)
                    let charge_kwh = element.charge_kwh //*충전량(kWh) (ex: 845.85)
                    let charge_amt = element.charge_amt //*충전요금(원) (ex: 248530)
                    let reg_date = element.reg_date //*충전통계 생성일시 (ex: 20200820155000)
                    let upd_date = element.upd_date //*충전통계 변경일시 (ex: 20200820155000)

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
            console.error("[charge_static_detail] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 7. 로밍 충전 통계 등록
async function charge_static_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/static/update`, JSON.stringify(req_data), header_json)
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
            console.error("[charge_static_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 8. 로밍 충전 통계내역 등록
async function charge_static_detail_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/charge/static/detail/update`, JSON.stringify(req_data), header_json)
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
            console.error("[charge_static_detail_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}


router.get("/", (req, res)=> {
    console.log("Roming")
    res.send("Roming")
})

// 1. 로밍 충전내역 조회
router.post("/charging/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //*조회 회원사 (ex: HEC, CVC)
    let cardno = request.body.cardno //조회 대상 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //조회 대상 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate = request.body.fromdate //충전내역 조회시작일시 (ex: 20200820155000)
    let todate = request.body.todate //충전내역 조회종료일시 (ex: 20200820155000)
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: KPC0000000000001)
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: KPC0000000000001)
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //회원사 충전기ID(ex: )
    let auth_id = request.body.auth_id //회원인증 이력ID (ex: KPC0000000000001)
    let charge_id = request.body.charge_id //로밍플랫폼 충전내역ID (ex: KPC0000000000001)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "cardno": cardno,
        "emaid": emaid,
        "selfex": selfex,
        "fromdate": fromdate,
        "todate": todate,
        "period": period,
        "csid": csid,
        "cpid": cpid,
        "spcsid": spcsid,
        "spcpid": spcpid,
        "auth_id": auth_id,
        "charge_id": charge_id,
        "platform_spid": platform_spid,
    }

    let result = await charge_info(req_data)
    console.log(result)
})

// 2. 로밍회원 충전진행 상태
router.post("/charging/status", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //*조회 회원사 (ex: HEC, CVC)
    let cardno = request.body.cardno //*조회 대상 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //조회 대상 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let selfex= request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate= request.body.fromdate //충전내역 조회시작일시 (ex: 20200820155000)
    let todate= request.body.todate //충전내역 조회종료일시 (ex: 20200820155000)
    let period= request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let csid= request.body.csid //로밍플랫폼 충전소ID (ex: KPC0000000000001)
    let cpid= request.body.cpid //로밍플랫폼 충전기ID (ex: KPC0000000000001)
    let spcsid= request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid= request.body.spcpid //회원사 충전기ID (ex: )
    let auth_id= request.body.auth_id //회원인증 이력ID (ex: KPC0000000000001)

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "cardno": cardno,
        "emaid": emaid,
        "selfex": selfex,
        "fromdate": fromdate,
        "todate": todate,
        "period": period,
        "csid": csid,
        "cpid": cpid,
        "spcsid": spcsid,
        "spcpid": spcpid,
        "auth_id": auth_id,
    }

    let result = await charge_status(req_data)
    console.log(result)
})

// 3.로밍회원 충전진행 상태 등록
router.post("/charging/status/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KEP, HEC)
    let cardno = request.body.cardno //*인증요청 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //인증요청 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let csid = request.body.csid //*인증요청 충전소ID (ex: KRKEP000000001)
    let cpid = request.body.auth_id //*인증요청 충전기ID (ex: KRKEP000000001)
    let status_cd = request.body.status_cd //*충전기 상태코드 (ex: 코드참조)
    let status_dtl_cd = request.body.status_dtl_cd //*충전기 상태 상세코드 (ex: 코드참조)
    let status_date = request.body.status_date //*충전기 상태변경 일시 (ex: 20200820155000)
    let spcsid = request.body.spcsid //충전사업자 충전소ID (ex: )
    let spcpid = request.body.spcpid //충전사업자 충전기ID (ex: )
    let charge_st_date = request.body.charge_st_date //*충전시작일시 (ex: 20200820155000)
    let charge_soc = request.body.charge_soc //충전진행SOC값 (ex: 85.00)
    let charge_tp = request.body.charge_tp //충전방식 (ex: 1(완속) 2(급속))
    let outlet_tp = request.body.outlet_tp //충전커넥터타입 (ex: 코드참조)
    let charge_kwh = request.body.charge_kwh //*충전진행충전량(kWh) (ex: 25.50)
    let charge_amt = request.body.charge_amt //충전진행요금(원) (ex: 1500)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "cardno": cardno,
            "emaid": emaid,
            "csid": csid,
            "cpid": cpid,
            "status_cd": status_cd,
            "status_dtl_cd": status_dtl_cd,
            "status_date": status_date,
            "spcsid": spcsid,
            "spcpid": spcpid,
            "charge_st_date": charge_st_date,
            "charge_soc": charge_soc,
            "charge_tp": charge_tp,
            "outlet_tp": outlet_tp,
            "charge_kwh": charge_kwh,
            "charge_amt": charge_amt,
        }
    }

    let result = await charge_status_update(req_data)
    console.log(result)
})

// 4. 로밍 충전내역 등록/수정
router.post("/charging/info/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*충전내역 등록정보 LIST (ex: )
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
    let sp_charge_id = request.body.sp_charge_id //*충전사업자 충전내역ID (ex: 충전사업자 내부관리ID)
    let csid = request.body.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
    let cpid = request.body.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
    let spcsid = request.body.spcsid //*회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //*회원사 충전기ID (ex: )
    let outlet_id = request.body.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
    let charge_st_date = request.body.charge_st_date //*충전시작시각 (ex: 20200820155000)
    let charge_end_date = request.body.charge_end_date //*충전완료시각 (ex: 20200820155000)
    let charge_kwh = request.body.charge_kwh //*충전량(합계/kWh) (ex: 25.50)
    let charge_kwh1 = request.body.charge_kwh1 //충전량(경부하/kWh) (ex: 25.50)
    let charge_kwh2 = request.body.charge_kwh2 //충전량(중간부하/kWh) (ex: 25.50)
    let charge_kwh3 = request.body.charge_kwh3 //충전량(최대부하/kWh) (ex: 25.50)
    let cardno = request.body.cardno //*충전카드번호 (ex: 1010010101010101)
    let emaid = request.body.emaid //차량회원번호 (ex: KRKEP8YKV7YZW06)
    let charge_tp = request.body.charge_tp //충전방식 (ex: 1(완속) 2(급속))
    let outlet_tp = request.body.outlet_tp //충전아웃렛구분 (ex: 코드참조)
    let roaming_ucost1 = request.body.roaming_ucost1 //*회원사 정산단가(경부하) (ex: 255.70)
    let roaming_ucost2 = request.body.roaming_ucost2 //*회원사 정산단가(중간부하) (ex: 255.70)
    let roaming_ucost3 = request.body.roaming_ucost3 //*회원사 정산단가(최대부하) (ex: 255.70)
    let charge_amt = request.body.charge_amt //*회원사 정산요금(합계) (ex: 1500)
    let charge_amt1 = request.body.charge_amt1 //회원사 정산요금(경부하) (ex: 800)
    let charge_amt2 = request.body.charge_amt2 //회원사 정산요금(중간부하) (ex: 200)
    let charge_amt3 = request.body.charge_amt3 //회원사 정산요금(최대부하) (ex: 500)
    let charge_reg_date = request.body.charge_reg_date //*충전내역 사업자 등록일시 (ex: 20200820155000)
    let charge_upd_date = request.body.charge_upd_date //*충전내역 사업자 변경일시 (ex: 20200820155000)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "sp_charge_id": sp_charge_id,
            "csid": csid,
            "cpid": cpid,
            "spcsid": spcsid,
            "spcpid": spcpid,
            "outlet_id": outlet_id,
            "charge_st_date": charge_st_date,
            "charge_end_date": charge_end_date,
            "charge_kwh": charge_kwh,
            "charge_kwh1": charge_kwh1,
            "charge_kwh2": charge_kwh2,
            "charge_kwh3": charge_kwh3,
            "cardno": cardno,
            "emaid": emaid,
            "charge_tp": charge_tp,
            "outlet_tp": outlet_tp,
            "roaming_ucost1": roaming_ucost1,
            "roaming_ucost2": roaming_ucost2,
            "roaming_ucost3": roaming_ucost3,
            "charge_amt": charge_amt,
            "charge_amt1": charge_amt1,
            "charge_amt2": charge_amt2,
            "charge_amt3": charge_amt3,
            "charge_reg_date": charge_reg_date,
            "charge_upd_date": charge_upd_date,
            "platform_spid": platform_spid,
        }
    }

    let result = await charge_update(req_data)
    console.log(result)
})

// 5. 로밍 충전 통계 조회
router.post("/charging/static/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //*조회 회원사 (ex: HEC, CVC)
    let cardno = request.body.cardno //*조회 대상 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //조회 대상 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate = request.body.fromdate //충전내역 조회시작일시 (ex: 20200820155000)
    let todate = request.body.todate //충전내역 조회종료일시 (ex: 20200820155000)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "cardno": cardno,
        "emaid": emaid,
        "selfex": selfex,
        "fromdate": fromdate,
        "todate": todate,
        "platform_spid": platform_spid,
    }

    let result = await charge_static(req_data)
    console.log(result)
})

// 6. 로밍 충전 통계내역 조회
router.post("/charging/static/info/history", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //*조회 회원사 (ex: HEC, CVC)
    let cardno = request.body.cardno //*조회 대상 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //조회 대상 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate = request.body.fromdate //충전내역 조회시작일시 (ex: 20200820155000)
    let todate = request.body.todate //충전내역 조회종료일시 (ex: 20200820155000)
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: KPC0000000000001)
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: KPC0000000000001)

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "cardno": cardno,
        "emaid": emaid,
        "selfex": selfex,
        "fromdate": fromdate,
        "todate": todate,
        "csid": csid,
        "cpid": cpid,
    }

    let result = await charge_static_detail(req_data)
    console.log(result)
})

// 7. 로밍 충전 통계 등록
router.post("/charging/static/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KEP, HEC)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KEP(한전) MEC(환경부))
    let charge_ymd = request.body.charge_ymd //*충전일자 (ex: 20200827)
    let charge_cnt = request.body.charge_cnt //*충전건수(건) (ex: 25)
    let charge_kwh = request.body.charge_kwh //*충전량(kWh) (ex: 845.85)
    let charge_amt = request.body.charge_amt //*충전요금(원) (ex: 248530)
    let reg_date = request.body.reg_date //*충전통계 생성일시 (ex: 20200820155000)
    let upd_date = request.body.upd_date //*충전통계 변경일시 (ex: 20200820155000)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "platform_spid": platform_spid,
            "charge_ymd": charge_ymd,
            "charge_cnt": charge_cnt,
            "charge_kwh": charge_kwh,
            "charge_amt": charge_amt,
            "reg_date": reg_date,
            "upd_date": upd_date,
        }
    }

    let result = await charge_static_update(req_data)
    console.log(result)
})

// 8. 로밍 충전 통계내역 등록
router.post("/charging/static/detail/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KEP, HEC)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KEP(한전) MEC(환경부))
    let charge_ymd = request.body.charge_ymd //*충전일자 (ex: 20200827)
    let csid = request.body.csid //*로밍플랫폼 충전소ID (ex: KRKEP000000001)
    let cpid = request.body.cpid //*로밍플랫폼 충전기ID (ex: KRKEP000000001)
    let outlet_id = request.body.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
    let spcsid = request.body.spcsid //충전사업자 충전소ID (ex: )
    let spcpid = request. body.spcpid //충전사업자 충전기ID (ex: )
    let charge_cnt = request.body.charge_cnt //*충전건수(건) (ex: 25)
    let charge_kwh = request.body.charge_kwh //*충전량(kWh) (ex: 845.85)
    let charge_amt = request.body.charge_amt //*충전요금(원) (ex: 248530)
    let reg_date = request.body.reg_date //*충전통계 생성일시 (ex: 20200820155000)
    let upd_date = request.body.upd_date //*충전통계 변경일시 (ex: 20200820155000)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "platform_spid": platform_spid,
            "charge_ymd": charge_ymd,
            "csid": csid,
            "cpid": cpid,
            "outlet_id": outlet_id,
            "spcsid": spcsid,
            "spcpid": spcpid,
            "charge_cnt": charge_cnt,
            "charge_kwh": charge_kwh,
            "charge_amt": charge_amt,
            "reg_date": reg_date,
            "upd_date": upd_date,
        }
    }

    let result = await charge_static_detail_update(req_data)
    console.log(result)
})

module.exports = router