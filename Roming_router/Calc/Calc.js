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

const calc_info_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const calc_info_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await calc_info(basic_req_data)
    console.log(result)
})

const calc_update_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const calc_update_job = schedule.scheduleJob('0 0 0 */1 * *', async ()=> {
    let result = await calc_update(basic_req_data)
    console.log(result)
})

const calc_req_info_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const calc_req_info_job = schedule.scheduleJob('0 0 0 0 */1 *', async ()=> {
    let result = await calc_req_info(basic_req_data)
    console.log(result)
})

const calc_req_update_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const calc_req_update_job = schedule.scheduleJob('0 0 0 0 */1 *', async ()=> {
    let result = await calc_req_update(basic_req_data)
    console.log(result)
})

const calc_pay_info_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const calc_pay_info_job = schedule.scheduleJob('0 0 0 0 */1 *', async ()=> {
    let result = await calc_pay_info(basic_req_data)
    console.log(result)
})

const calc_pay_update_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const calc_pay_update_job = schedule.scheduleJob('0 0 0 0 */1 *', async ()=> {
    let result = await calc_pay_update(basic_req_data)
    console.log(result)
})


// 1. 로밍 정산대상 조회
async function calc_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/calc/info`, JSON.stringify(req_data), header_json)
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
                    let charge_id = element.charge_id //*로밍플랫폼 충전내역ID (ex: KPC0000000000001)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let spcsid = element.spcsid //*회원사 충전소ID (ex: )
                    let spcpid = element.spcpid //*회원사 충전기ID (ex: )
                    let outlet_id = element.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
                    let charge_st_date = element.charge_st_date //*충전시작일시 (ex: 20200820155000)
                    let charge_end_date = element.charge_end_date //*충전종료일시 (ex: 20200820155000)
                    let charge_kwh = element.charge_kwh //*충전량(합계/kWh) (ex: 25.50)
                    let charge_kwh1 = element.charge_kwh1 //*충전량(경부하/kWh) (ex: 25.50)
                    let charge_kwh2 = element.charge_kwh2 //*충전량(중간부하/kWh) (ex: 25.50)
                    let charge_kwh3 = element.charge_kwh3 //*충전량(최대부하/kWh) (ex: 25.50)
                    let cardno = element.cardno //*충전카드번호 (ex: 1010010101010101)
                    let emaid = element.emaid //차량회원번호 (ex: KRKEP8YKV7YZW06)
                    let charge_tp = element.charge_tp //충전방식 (ex: 1(완속) 2(급속))
                    let outlet_tp = element.outlet_tp //충전아웃렛구분 (ex: 코드참조)
                    let sp_ucost1 = element.sp_ucost1 //*회원사 정산단가(경부하) (ex: 255.70)
                    let sp_ucost2 = element.sp_ucost2 //*회원사 정산단가(중간부하) (ex: 255.70)
                    let sp_ucost3 = element.sp_ucost3 //*회원사 정산단가(최대부하) (ex: 255.70)
                    let charge_amt = element.charge_amt //*회원사 정산요금(합계) (ex: 1500)
                    let charge_amt1 = element.charge_amt1 //*회원사 정산요금(경부하) (ex: 800)
                    let charge_amt2 = element.charge_amt2 //*회원사 정산요금(중간부하) (ex: 200)
                    let charge_amt3 = element.charge_amt3 //*회원사 정산요금(최대부하) (ex: 500)
                    let roaming_fee = element.roaming_fee //*로밍플랫폼연계 수수료 (ex: 150)
                    let charge_reg_date = element.charge_reg_date //*충전내역 사업자 등록일시 (ex: 20200820155000)
                    let charge_upd_date = element.charge_upd_date //충전내역 사업자 변경일시 (ex: 20200820155000)
                    let roaming_reg_date = element.roaming_reg_date //*충전내역 로밍플랫폼 등록일시 (ex: 20200820155000)
                    let roaming_upd_date = element.roaming_upd_date //충전내역 로밍플랫폼 변경일시 (ex: 20200820155000)
                    let sp_charge_id = element.sp_charge_id //충전사업자 충전내역ID (ex: 충전사업자 내부관리ID)
                    let charge_send_date = element.charge_send_date //*충전내역 사업자 전송일시 (ex: 20200820155000)
                    let charge_recv_date = element.charge_recv_date //충전내역 전송결과 확인일시 (ex: 20200820155000)
                    let calc_send_date = element.calc_send_date //*정산내역 전송일시 (ex: )
                    let calc_recv_date = element.calc_recv_date //정산내역 수신일시 (ex: )
                    let calc_yn = element.calc_yn //*정산대상여부 (ex: )
                    let calc_end_yn = element.calc_end_yn //*정산확정여부 (ex: )
                    let calc_cfm_date = element.calc_cfm_date //정산 확정일시 (ex: )
                    let calc_ym = element.calc_ym //*정산년월 (ex: )
                    let calc_desc = element.calc_desc //정산(미정산) 사유 (ex: )

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
            console.error("[calc_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 2. 로밍 정산대상 등록/수정
async function calc_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/calc/update`, JSON.stringify(req_data), header_json)
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
                    let platform_spid = element.platform_spid //로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))
                    let charge_id = element.charge_id //로밍플랫폼 충전내역ID (ex: KPC0000000000001)
                    let calc_recv_rdate = element.calc_recv_rdate //정산대상 연계 등록일시 (ex: 20200820155000)
                    let calc_recv_udate = element.calc_recv_udate //정산대상 연계 변경일시 (ex: 20200820155000)
                    let calc_ym = element.calc_ym //정산대상 연월 (ex: 202008)
                    let calc_status_cd = element.calc_status_cd //정산진행상태 (ex: 코드참조)

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
            console.error("[calc_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 3. 로밍 청구내역 조회
async function calc_req_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/calc/req/info`, JSON.stringify(req_data), header_json)
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
                    let calc_req_ym = element.calc_req_ym //*정산청구년월 (ex: 202008)
                    let calc_st_date = element.calc_st_date //*정산시작일시 (ex: 20200801000000)
                    let calc_end_date = element.calc_end_date //*정산종료일시 (ex: 20200831235959)
                    let calc_end_yn = element.calc_end_yn //*정산종료여부 (ex: Y(종료) N(진행중))
                    let calc_tot_cnt = element.calc_tot_cnt //*정산건수(전체) (ex: 300)
                    let calc_proc_cnt = element.calc_proc_cnt //*정산건수(대상) (ex: 295)
                    let calc_hold_cnt = element.calc_hold_cnt //*정산건수(제외/보류) (ex: 5)
                    let calc_charge_kwh1 = element.calc_charge_kwh1 //*로밍 충전량(경부하/kWh) (ex: 200.5)
                    let calc_charge_kwh2 = element.calc_charge_kwh2 //*로밍 충전량(중간부하/kWh) (ex: 250.5)
                    let calc_charge_kwh3 = element.calc_charge_kwh3 //*로밍 충전량(최대부하/kWh) (ex: 360.5)
                    let calc_charge_kwh = element.calc_charge_kwh //*로밍 충전량(합계/kWh) (ex: 811.5)
                    let req_charge_amt1 = element.req_charge_amt1 //*로밍 정산요금(경부하) (ex: 2500)
                    let req_charge_amt2 = element.req_charge_amt2 //*로밍 정산요금(중간부하) (ex: 8500)
                    let req_charge_amt3 = element.req_charge_amt3 //*로밍 정산요금(최대부하) (ex: 3600)
                    let req_charge_amt = element.req_charge_amt //*로밍 정산요금(합계) (ex: 14600)
                    let req_charge_vos = element.req_charge_vos //*로밍 정산요금(공급가액) (ex: 13273)
                    let req_charge_vat = element.req_charge_vat //*로밍 정산요금(부가세) (ex: 1327)
                    let req_ymd = element.req_ymd //*청구일 (ex: 20200831)
                    let due_ymd = element.due_ymd //*납기일 (ex: 20200910)
                    let recp_amt = element.recp_amt //납부금액 (ex: )
                    let recp_yn = element.recp_yn //납부여부 (ex: )
                    let recp_ymd = element.recp_ymd //납부일자 (ex: )
                    let calc_status_cd = element.calc_status_cd //*정산상태코드 (ex: 코드참조)
                    let tax_issue_id = element.tax_issue_id //세금계산서발행ID (ex: 2020050842000013o0000001)

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
            console.error("[calc_req_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 4. 로밍 청구내역 등록/수정
async function calc_req_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/calc/req/update`, JSON.stringify(req_data), header_json)
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
                    let calc_req_ym = element.calc_req_ym //*정산청구년월 (ex: 202008)
                    let req_recv_rdate = element.req_recv_rdate //*청구내역 연계 등록일시 (ex: 20200820155000)
                    let req_recv_udate = element.req_recv_udate //*청구내역 연계 변경일시 (ex: 20200820155000)

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
            console.error("[calc_req_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 5. 로밍 결제내역 조회
async function calc_pay_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/calc/pay/info`, JSON.stringify(req_data), header_json)
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
                    let calc_req_ym = element.calc_req_ym //*정산청구년월 (ex: 202008)
                    let calc_st_date = element.calc_st_date //*정산시작일시 (ex: 20200801000000)
                    let calc_end_date = element.calc_end_date //*정산종료일시 (ex: 20200831235959)
                    let calc_end_yn = element.calc_end_yn //*정산종료여부 (ex: Y(종료) N(진행중))
                    let calc_tot_cnt = element.calc_tot_cnt //*정산건수(전체) (ex: 300)
                    let calc_proc_cnt = element.calc_proc_cnt //*정산건수(대상) (ex: 295)
                    let calc_hold_cnt = element.calc_hold_cnt //*정산건수(제외/보류) (ex: 5)
                    let calc_charge_kwh1 = element.calc_charge_kwh1 //*로밍 충전량(경부하/kWh) (ex: 200.5)
                    let calc_charge_kwh2 = element.calc_charge_kwh2 //*로밍 충전량(중간부하/kWh) (ex: 250.5)
                    let calc_charge_kwh3 = element.calc_charge_kwh3 //*로밍 충전량(최대부하/kWh) (ex: 360.5)
                    let calc_charge_kwh = element.calc_charge_kwh //*로밍 충전량(합계/kWh) (ex: 811.5)
                    let req_charge_amt1 = element.req_charge_amt1 //*로밍 정산요금(경부하) (ex: 2500)
                    let req_charge_amt2 = element.req_charge_amt2 //*로밍 정산요금(중간부하) (ex: 8500)
                    let req_charge_amt3 = element.req_charge_amt3 //*로밍 정산요금(최대부하) (ex: 3600)
                    let req_charge_amt = element.req_charge_amt //*로밍 정산요금(합계) (ex: 14600)
                    let req_charge_vos = element.req_charge_vos //*로밍 정산요금(공급가액) (ex: 13273)
                    let req_charge_vat = element.req_charge_vat //*로밍 정산요금(부가세) (ex: 1327)
                    let req_ymd = element.req_ymd //*청구일 (ex: 20200831)
                    let due_ymd = element.due_ymd //*납기일 (ex: 20200910)
                    let recp_amt = element.recp_amt //납부금액 (ex: 14600)
                    let recp_yn = element.recp_yn //납부여부 (ex: Y(납부) N(미납))
                    let recp_ymd = element.recp_ymd //납부일자 (ex: 20200910)

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
            console.error("[calc_pay_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 6. 로밍 결제내역 등록/수정
async function calc_pay_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/calc/pay/update`, JSON.stringify(req_data), header_json)
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
                    let calc_req_ym = element.calc_req_ym //*정산청구년월 (ex: 202008)
                    let req_charge_amt = element.req_charge_amt //*로밍 정산요금(합계) (ex: 14600)
                    let req_charge_vos = element.req_charge_vos //*로밍 정산요금(공급가액) (ex: 13273)
                    let req_charge_vat = element.req_charge_vat //*로밍 정산요금(부가세) (ex: 1327)
                    let pay_recv_rdate = element.pay_recv_rdate //*결제내역 연계 등록일시 (ex: 20200820155000)
                    let pay_recv_udate = element.pay_recv_udate //*결제내역 연계 변경일시 (ex: 20200820155000)

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
            console.error("[calc_pay_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 7. 로밍 계약내역 조회
async function cntr_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cntr/info`, JSON.stringify(req_data), header_json)
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
                    let cntr_reg_date = element.cntr_reg_date //*로밍계약 등록일시 (ex: 20200820135000)
                    let cntr_cfm_date = element.cntr_cfm_date //로밍계약 승인완료일시 (ex: 20200820135000)
                    let cntr_status_cd = element.cntr_status_cd //*로밍계약 진행단계 (ex: Y(완료) N(진행중))
                    let cntr_st_date = element.cntr_st_date //*로밍계약 시작일시 (ex: 20200820135000)
                    let cntr_end_date = element.cntr_end_date //*로밍계약 종료일시 (ex: 20200820135000)
                    let sp_calc_ucost = element.sp_calc_ucost //*회원사 충전기 정산단가 (ex: 360.20)
                    let sp_charge_ucost = element.sp_charge_ucost //*회원사 충전기 회원충전단가 (ex: 450.20)
                    let tsp_calc_ucost = element.tsp_calc_ucost //*계약사 충전기 정산단가 (ex: 360.20)
                    let tsp_charge_ucost = element.tsp_charge_ucost //*계약사 충전기 회원충전단가 (ex: 470.30)

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
            console.error("[cntr_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 8.로밍 계약내역 등록/수정
async function cntr_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cntr/update`, JSON.stringify(req_data), header_json)
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
            console.error("[cntr_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}


router.get("/", (req, res)=> {
    console.log("Calc")
    res.send("Calc")
})

// 1. 로밍 정산대상 조회
router.post("/user/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //*조회 회원사 (ex: HEC, CVC)
    let cardno = request.body.cardno //조회 대상 회원카드번호 (ex: 1010010000000000)
    let emaid = request.body.emaid //조회 대상 차량회원번호 (ex: KRKEP8YKV7YZW06)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate = request.body.fromdate //정산대상 조회시작일시 (ex: 20200820155000)
    let todate = request.body.todate //정산대상 조회종료일시 (ex: 20200820155000)
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: KPC0000000000001)
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: KPC0000000000001)
    let calc_ym = request.body.calc_ym //정산연월 (ex: 202008)
    let calc_yn = request.body.calc_yn //정산대상여부 (ex: 코드참조)
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
        "calc_ym": calc_ym,
        "calc_yn": calc_yn,
        "charge_id": charge_id,
        "platform_spid": platform_spid,
    }

    let result = await calc_info(req_data)
    console.log(result)
})

// 2. 로밍 정산대상 등록/수정
router.post("/user/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*정산대상정보 LIST (ex: )
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))
    let charge_id = request.body.charge_id //*로밍플랫폼 충전내역ID (ex: KPC0000000000001)
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
    let calc_reg_date = request.body.calc_reg_date //*정산내역 사업자 등록일시 (ex: 20200820155000)
    let calc_upd_date = request.body.calc_upd_date //*정산내역 사업자 변경일시 (ex: 20200820155000)
    let calc_ym = request.body.calc_ym //*정산대상 연월 (ex: 202008)
    let calc_status_cd = request.body.calc_status_cd //*정산진행상태 (ex: 코드참조)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "platform_spid": platform_spid,
            "charge_id": charge_id,
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
            "calc_reg_date": calc_reg_date,
            "calc_upd_date": calc_upd_date,
            "calc_ym": calc_ym,
            "calc_status_cd": calc_status_cd,   
        }
    }

    let result = await calc_update(req_data)
    console.log(result)
})

// 3. 로밍 청구내역 조회
router.post("/req/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let calc_ym = request.body.calc_ym //정산연월 (ex: 202008)
    let calc_end_yn = request.body.calc_end_yn //정산종료여부 (ex: Y(종료) N(진행중))
    let platform_spid = request.body.platform_spid //로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "selfex": selfex,
        "period": period,
        "calc_ym": calc_ym,
        "calc_end_yn": calc_end_yn,
        "platform_spid": platform_spid,
    }

    let result = await calc_req_info(req_data)
    console.log(result)
})

// 4. 로밍 청구내역 등록/수정
router.post("/req/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*청구내역정보 LIST (ex: )
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))
    let calc_req_ym = request.body.calc_req_ym //*정산청구년월 (ex: 202008)
    let calc_st_date = request.body.calc_st_date //*정산시작일시 (ex: 20200801000000)
    let calc_end_date = request.body.calc_end_date //*정산종료일시 (ex: 20200831235959)
    let calc_end_yn = request.body.calc_end_yn //*정산종료여부 (ex: Y(종료) N(진행중))
    let calc_tot_cnt = request.body.calc_tot_cnt //*정산건수(전체) (ex: 300)
    let calc_proc_cnt = request.body.calc_proc_cnt //*정산건수(대상) (ex: 295)
    let calc_hold_cnt = request.body.calc_hold_cnt //*정산건수(제외/보류) (ex: 5)
    let calc_charge_kwh1 = request.body.calc_charge_kwh1 //*로밍 충전량(경부하/kWh) (ex: 200.5)
    let calc_charge_kwh2 = request.body.calc_charge_kwh2 //*로밍 충전량(중간부하/kWh) (ex: 250.5)
    let calc_charge_kwh3 = request.body.calc_charge_kwh3 //*로밍 충전량(최대부하/kWh) (ex: 360.5)
    let calc_charge_kwh = request.body.calc_charge_kwh //*로밍 충전량(합계/kWh) (ex: 811.5)
    let req_charge_amt1 = request.body.req_charge_amt1 //*로밍 정산요금(경부하) (ex: 2500)
    let req_charge_amt2 = request.body.req_charge_amt2 //*로밍 정산요금(중간부하) (ex: 8500)
    let req_charge_amt3 = request.body.req_charge_amt3 //*로밍 정산요금(최대부하) (ex: 3600)
    let req_charge_amt = request.body.req_charge_amt //*로밍 정산요금(합계) (ex: 14600)
    let req_charge_vos = request.body.req_charge_vos //*로밍 정산요금(공급가액) (ex: 13273)
    let req_charge_vat = request.body.req_charge_vat //*로밍 정산요금(부가세) (ex: 1327)
    let req_ymd = request.body.req_ymd //*청구일 (ex: 20200831)
    let due_ymd = request.body.due_ymd //*납기일 (ex: 20200910)
    let calc_status_cd = request.body.calc_status_cd //*정산상태코드 (ex: 코드참조)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "platform_spid": platform_spid,
            "calc_req_ym": calc_req_ym,
            "calc_st_date": calc_st_date,
            "calc_end_date": calc_end_date,
            "calc_end_yn": calc_end_yn,
            "calc_tot_cnt": calc_tot_cnt,
            "calc_proc_cnt": calc_proc_cnt,
            "calc_hold_cnt": calc_hold_cnt,
            "calc_charge_kwh1": calc_charge_kwh1,
            "calc_charge_kwh2": calc_charge_kwh2,
            "calc_charge_kwh3": calc_charge_kwh3,
            "calc_charge_kwh": calc_charge_kwh,
            "req_charge_amt1": req_charge_amt1,
            "req_charge_amt2": req_charge_amt2,
            "req_charge_amt3": req_charge_amt3,
            "req_charge_amt": req_charge_amt,
            "req_charge_vos": req_charge_vos,
            "req_charge_vat": req_charge_vat,
            "req_ymd": req_ymd,
            "due_ymd": due_ymd,
            "calc_status_cd": calc_status_cd,
        }
    }

    let result = await calc_req_update(req_data)
    console.log(result)
})

// 5. 로밍 결제내역 조회
router.post("/pay/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //*조회 회원사 (ex: HEC, CVC)
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let fromdate = request.body.fromdate //결제내역 조회시작일시 (ex: 20200820155000)
    let todate = request.body.todate //결제내역 조회종료일시 (ex: 20200820155000)
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let calc_ym = request.body.calc_ym //정산연월 (ex: 202008)
    let calc_end_yn = request.body.calc_end_yn //정산종료여부 (ex: Y(종료) N(진행중))
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "selfex": selfex,
        "fromdate": fromdate,
        "todate": todate,
        "period": period,
        "calc_ym": calc_ym,
        "calc_end_yn": calc_end_yn,
        "platform_spid": platform_spid,
    }

    let result = await calc_pay_info(req_data)
    console.log(result)
})

// 6. 로밍 결제내역 등록/수정
router.post("/pay/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*결제내역정보 LIST (ex: )
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KPC, HEC)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KPC(한전) MEC(환경부))
    let calc_req_ym = request.body.calc_req_ym //*정산청구년월 (ex: 202008)
    let req_charge_amt = request.body.req_charge_amt //*로밍 정산요금(합계) (ex: 14600)
    let req_charge_vos = request.body.req_charge_vos //*로밍 정산요금(공급가액) (ex: 13273)
    let req_charge_vat = request.body.req_charge_vat //*로밍 정산요금(부가세) (ex: 1327)
    let req_ymd = request.body.req_ymd //*청구일 (ex: 20200831)
    let due_ymd = request.body.due_ymd //*납기일 (ex: 20200910)
    let recp_amt = request.body.recp_amt //납부금액 (ex: 14600)
    let recp_yn = request.body.recp_yn //납부여부 (ex: Y(납부) N(미납))
    let recp_ymd = request.body.recp_ymd //납부일자 (ex: 20200910)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "platform_spid": platform_spid,
            "calc_req_ym": calc_req_ym,
            "req_charge_amt": req_charge_amt,
            "req_charge_vos": req_charge_vos,
            "req_charge_vat": req_charge_vat,
            "req_ymd": req_ymd,
            "due_ymd": due_ymd,
            "recp_amt": recp_amt,
            "recp_yn": recp_yn,
            "recp_ymd": recp_ymd,   
        }
    }

    let result = await calc_pay_update(req_data)
    console.log(result)
})

// 7. 로밍 계약내역 조회
router.post("/cntr/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //*조회 회원사 (ex: HEC, CVC)
    let fromdate = request.body.fromdate //계약내역 조회시작일시 (ex: 20200820135000)
    let todate = request.body.todate //계약내역 조회종료일시 (ex: 20200820135000)
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "fromdate": fromdate,
        "todate": todate,
        "period": period,
    }

    let result = await cntr_info(req_data)
    console.log(result)
})

// 8.로밍 계약내역 등록/수정
router.post("/cntr/update", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let trade_spid = request.body.trade_spid //*충전거래 사업자ID (ex: KEP, HEC)
    let platform_spid = request.body.platform_spid //*로밍플랫폼 연계기관ID (ex: KEP(한전) MEC(환경부))
    let cntr_reg_date = request.body.cntr_reg_date //*로밍계약 등록일시 (ex: 20200820135000)
    let cntr_cfm_date = request.body.cntr_cfm_date //로밍계약 승인완료일시 (ex: 20200820135000)
    let cntr_status_cd = request.body.cntr_status_cd //*로밍계약 진행단계 (ex: Y(완료) N(진행중))
    let cntr_st_date = request.body.cntr_st_date //*로밍계약 시작일시 (ex: 20200820135000)
    let cntr_end_date = request.body.cntr_end_date //*로밍계약 종료일시 (ex: 20200820135000)
    let sp_calc_ucost = request.body.sp_calc_ucost //*회원사 충전기 정산단가 (ex: 360.20)
    let sp_charge_ucost = request.body.sp_charge_ucost //*회원사 충전기 회원충전단가 (ex: 450.20)
    let tsp_calc_ucost = request.body.tsp_calc_ucost //*계약사 충전기 정산단가 (ex: 360.20)
    let tsp_charge_ucost = request.body.tsp_charge_ucost //*계약사 충전기 회원충전단가 (ex: 470.30)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "trade_spid": trade_spid,
            "platform_spid": platform_spid,
            "cntr_reg_date": cntr_reg_date,
            "cntr_cfm_date": cntr_cfm_date,
            "cntr_status_cd": cntr_status_cd,
            "cntr_st_date": cntr_st_date,
            "cntr_end_date": cntr_end_date,
            "sp_calc_ucost": sp_calc_ucost,
            "sp_charge_ucost": sp_charge_ucost,
            "tsp_calc_ucost": tsp_calc_ucost,
            "tsp_charge_ucost": tsp_charge_ucost
        }
    }

    let result = await cntr_update(req_data)
    console.log(result)
})

module.exports = router