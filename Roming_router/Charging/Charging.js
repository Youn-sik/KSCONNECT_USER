const express = require("express")
const router = express.Router()
const axios = require("axios")
const schedule = require("node-schedule")
const kepco_info = require("../../RomingInfo.json")
const mysqlConn = require("../../database_conn")

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

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

const cs_info_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const cs_info_job = schedule.scheduleJob('0 0 0 */1 * *', ()=> {
    let result = await cs_info(basic_req_data)
    console.log(result)

    // let testObj = {
    //     name: "쿨사인",
    //     company_number: "02-8055-8055",
    // }
    // mysqlConn.connectionService.query("INSERT INTO company SET ?", testObj, async (err, rows) {
    //     if(err) console.error(err)
    //     console.log(rows)
    // });

    // let testObj = {
    //     company_id: 1,
    //     name: "제 1주차장 현관 앞 충전소",
    //     status: "Y",
    //     last_state: moment().format('YYYY-MM-DD HH:mm:ss'),
    //     address: "서울특별시 구로구 디지털로27바길 27",
    //     available: "24시간",
    //     park_fee: "500",
    //     contect_number: "02-8055-8055",
    //     pay_type: "신용카드"
    // }
    // mysqlConn.connectionService.query("INSERT INTO charge_station SET ?", testObj, async (err, rows) {
    //     if(err) console.error(err)
    //     console.log(rows)
    // });
})

const cp_info_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
// const cp_info_job = schedule.scheduleJob('0 0 0 */1 * *', ()=> {
    let result = await cp_info(basic_req_data)
    console.log(result)
})

const cp_status_job = schedule.scheduleJob('0 */1 * * * *', async ()=> {
    let result = await cp_status(basic_req_data)
    console.log(result)
})


// 1. 충전소 정보 조회
async function cs_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cs/info`, JSON.stringify(req_data), header_json)
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
                list.forEach((element, _) => {
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let csnm = element.csnm //*충전소명 (ex: 한전본사 남측주차장(공용))
                    let daddr = element.daddr //*충전소 주소(도로명) (ex: 전라남도 나주시 전력로 55)
                    let addr = element.addr //충전소 주소(지번) (ex: 전라남도 나주시 빛가람동 120)
                    let addr_dtl = element.addr_dtl //상세 위치(지번) (ex: 본사내 남측 주차장)
                    let lat = element.lat //*위도(WGS84 좌표계) (ex: 35.0252349)
                    let longi = element.longi //*경도(WGS84 좌표계) (ex: 126.7829640)
                    let use_time = element.use_time //*이용가능시간 (ex: 24시간, 09시~18시)
                    let show_yn = element.show_yn //*GIS 상태/위치표시여부 (ex: Y(표시) N(미표시))
                    let spcsid = element.spcsid //*충전사업자 충전소ID (ex: 000293)
                    let park_fee_yn = element.park_fee_yn //*주차비 무료여부 (ex: Y(유료) N(무료))
                    let park_fee = element.park_fee //*주차비 요금정보 (ex: 500원/30분, 충전시 무료)
                    let spcall = element.spcall //*충전기 문의 연락처 (ex: 1899-2100)
                    let member_yn = element.member_yn //*회원전용 충전여부 (ex: Y(회원전용) N(공용))
                    let open_yn = element.open_yn //*공용(개방)충전소 여부 (ex: Y(개방) N(미개방))
                    let use_yn = element.use_yn //*충전소 운영여부 (ex: Y(운영) N(미운영-철거))
                    let postcd = element.postcd //*우편번호 (ex: 58322)
                    let cs_div = element.cs_div //*충전소운영 유형 (ex: 코드참조)
                    let sido = element.sido //*지역코드(법정동 시도 2자리) (ex: 코드참조)
                    let sigungu = element.sigungu //*시군구코드 (ex: 코드참조)
                    let oper_st_ymd = element.oper_st_ymd //*서비스운영 시작일자 (ex: 20200820)
                    let oper_end_ymd = element.oper_end_ymd //*서비스운영 종료일자 (ex: 99991231)

                    // let process_data = element;
                    // process_data.update_time = moment().format('YYYY-MM-DD HH:mm:ss');

                    // mysqlConn.connectionRoming.query("INSERT INTO charge_station SET ?", process_data, function(err, rows) {
                    //     if(err) console.error(err)
                    //     console.log(rows)
                    // });

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
            console.error("[cs_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 2. 충전기 정보 조회
async function cp_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cp/info`, JSON.stringify(req_data), header_json)
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
                    list.forEach((element, _) => {
                        let spid = element.spid //*회원사ID (ex: KPC, HEC)
                        let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                        let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                        let csnm = element.csnm //*충전기명 (ex: 급속01)
                        let use_time = element.use_time //*이용가능시간 (ex: 24시간, 09시~18시)
                        let open_yn = element.open_yn //*공용(개방)충전기 여부 (ex: Y(개방) N(미개방))
                        let show_yn = element.show_yn //*GIS 상태/위치표시여부 (ex: Y(표시) N(미표시))
                        let spcsid = element.spcsid //충전사업자 충전소ID (ex: )
                        let spcpid = element.spcpid //회원사 충전기ID (ex: )
                        let charge_ucost1 = element.charge_ucost1 //*충전기 충전단가(경부하/원) (ex: 255.7)
                        let charge_ucost2 = element.charge_ucost2 //충전기 충전단가(중간부하/원) (ex: 255.7)
                        let charge_ucost3 = element.charge_ucost3 //충전기 충전단가(최대부하/원) (ex: 255.7)
                        let use_yn = element.use_yn //*충전기 운영여부 (ex: Y(운영) N(미운영-철거))
                        let oper_st_ymd = element.oper_st_ymd //*서비스운영 시작일자 (ex: 20200820)
                        let oper_end_ymd = element.oper_end_ymd //*서비스운영 종료일자 (ex: 99991231)
                        let outlet_cnt = element.outlet_cnt //*동시충전가능 아웃렛수 (ex: 1(기본), 1~100범위)
                        let pnc_yn = element.pnc_yn //PnC충전가능 여부 (ex: Y(PnC지원) N(PnC미지원))
                        let cpkw = element.cpkw //*충전기 용량 (ex: 7.7(완속) 50(급속), 100)
                        let charge_div = element.charge_div //*충전기구분 (ex: 1(완속) 2(급속) 3(초급속))
                        let cp_tp = element.cp.tp //*충전기유형 (ex: 코드참조)
                        let postcd = element.postcd //*우편번호 (ex: 코드참조)
                        let cs_div = element.cs_div //*충전소 운영 유형 (ex: 코드참조)
                        let outlet_div = element.outlet_div //*아웃렛 유형 (ex: 코드참조)
                        let conn_div = element.conn_div //*연결방식 유형 (ex: 코드참조)
                        let charge_kw = element.charge_kw //*충전용량 (ex: 코드참조)
                        let service_div = element.service_div //*서비스 유형 (ex: 코드참조)
                        let net_div = element.net_div //*통신방식 유형 (ex: 코드참조)
                        let auth_div = element.auth_div //*인증 및 과금 유형 (ex: 코드참조)
                        let compty_div = element.compty_div //*로밍플랫폼 호환성 (ex: 코드참조)
                        let ami_cert = element.ami_cert //계량기 인증번호 (ex: )

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
                console.error("[cp_info] Request Error: "+ err)
                return({"result": false, "errStr": "Request Failed"})
            })
    return result
}

// 3. 충전기 상태 조회
async function cp_status(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cp/status`, JSON.stringify(req_data), header_json)
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
                    list.forEach((element, _) => {
                        let spid = res.body.spid //*회원사ID (ex: KPC, HEC)
                        let csid = res.body.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                        let cpid = res.body.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                        let outlet_id = res.body.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
                        let status_cd = res.body.status_cd //*충전기 상태 코드 (ex: 코드참조)
                        let status_dtl_cd = res.body.status_dtl_cd //*충전기 상태 상세코드 (ex: 코드참조)
                        let update_time = res.body.update_time //*상태 갱신 시각 (ex: 20200820213000)
                        let show_yn = res.body.show_yn //*GIS 상태/위치표시여부 (ex: Y(표시) N(미표시))
                        let open_yn = res.body.open_yn //*충전기 개방여부 (ex: Y(개방) N(미개방))
                        let spcsid = res.body.spcsid //*충전사업자 충전소ID (ex: )
                        let spcpid = res.body.spcpid //*충전사업자 충전기ID (ex: )
                        let charge_st_date = res.body.charge_st_date //충전시작일시 (ex: 20200820213000)
                        let charge_soc = res.body.charge_soc //충전진행 SOC값 (ex: 80.5)
                        let charge_type = res.body.charge_type //충전커넥터 타입 (ex: 코드참조)
                        let stop_yn = res.body.stop_yn //이용중지여부(기본:Y) (ex: Y(중지) N(이용가능))
                        let stop_st_date = res.body.stop_st_date //이용중지 시작일시 (ex: 20200820100000)
                        let stop_end_date = res.body.stop_end_date //이용중지 종료일시 (ex: 20200820100000)

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
                console.error("[cp_status] Request Error: "+ err)
                return({"result": false, "errStr": "Request Failed"})
            })
    return result
}

// 4. 충전기ID 매핑정보 조회
async function cp_idinfo(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cp/idinfo`, JSON.stringify(req_data), header_json)
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
                list.forEach((element, _) => {
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let spcsid = element.spcsid //*충전사업자 충전소ID (ex: )
                    let spcpid = element.spcpid //*충전사업자 충전기ID (ex: )
                    let postcd = element.postcd //*우편번호 (ex: 코드참조)
                    let cs_div = element.cs_div //*충전소 운영 유형 (ex: 코드참조)
                    let outlet_div = element.outlet_div //*아웃렛 유형 (ex: 코드참조)
                    let conn_div = element.conn_div //*연결방식 유형 (ex: 코드참조)
                    let charge_kw = element.charge_kw //*충전용량 (ex: 코드참조)
                    let service_div = element.service_div //*서비스 유형 (ex: 코드참조)
                    let net_div = element.net_div //*통신방식 유형 (ex: 코드참조)
                    let auth_div = element.auth_div //*인증 및 과금 유형 (ex: 코드참조)
                    let compty_div = element.compty_div //*로밍플랫폼 호환성 (ex: 코드참조)

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
            console.error("[cp_idinfo] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 5. 충전소 정보 등록/수정
async function cs_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cs/update`, JSON.stringify(req_data), header_json)
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
                list.forEach((element, _) => {
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let spcsid = element.spcsid //*충전사업자 충전소ID (ex: 000293

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
            console.error("[cs_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })    
    return result
}

// 6. 충전기 정보 등록/수정
async function cp_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cp/update`, JSON.stringify(req_data), header_json)
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
                list.forEach((element, _) => {
                    let spid = element.spid //*회원사ID (ex: KPC, HEC)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let spcsid = element.spcsid //회원사 충전소ID (ex: )
                    let spcpid = element.spcpid //회원사 충전기ID (ex: )

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
            console.error("[cs_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 7. 충전기 상태정보 등록/수정
async function cp_status_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/cp/status/update`, JSON.stringify(req_data), header_json)
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
                list.forEach((element, _) => {
                    
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
            console.error("[cp_status_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 8. 충전기 예약정보 조회
async function reserv_info(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/reserv/info`, JSON.stringify(req_data), header_json)
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
                list.forEach((element, _) => {
                    let spid = element.spidv //*회원사ID (ex: KPC, HEC)
                    let csid = element.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
                    let cpid = element.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
                    let spcsid = element.spcsid //*충전사업자 충전소ID (ex: )
                    let spcpid = element.spcpid //*충전사업자 충전기ID (ex: )
                    let outlet_id = element.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
                    let provider_id = element.provider_id //*예약회원 회원사 (ex: KPC, HEC)
                    let reserv_st_date = element.reserv_st_date //*예약시작일시 (ex: )
                    let reserv_end_date = element.reserv_end_date //*예약종료일시 (ex: )
                    let cardno = element.cardno //*예약회원 카드번호 (ex: )
                    let reserv_date = element.reserv_date //*예약일시 (ex: )
                    let reserv_id = element.reserv_id //*로밍플랫폼 예약번호 (ex: )
                    let charge_yn = element.charge_yn //*예약충전 진행(완료) 여부 (ex: N(예약) Y(충전))

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
            console.error("[reserv_info] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}

// 9. 충전기 예약정보 등록/수정
async function reserv_update(data) {
    let req_data = data
    let result = await axios.post(`${kepco_host}:${kepco_port}/evapi/v${ver}/${spid}/reserv/update`, JSON.stringify(req_data), header_json)
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
                list.forEach((element, _) => {
                        let spid = element.spid //회원사ID (ex: KPC, HEC)
                        let csid = element.csid //로밍플랫폼 충전소ID (ex: KRKPC000000001)
                        let cpid = element.cpid //로밍플랫폼 충전기ID (ex: KRKPC000000001)
                        let spcsid = element.spcsid //충전사업자 충전소ID (ex: )
                        let spcpid = element.spcpid //충전사업자 충전기ID (ex: )
                        let outlet_id = element.outlet_id //충전기 아웃렛ID (ex: 1(기본), 1~100범위)
                        let provider_id = element.provider_id //예약회원 회원사 (ex: KPC, HEC)
                        let reserv_st_date = element.reserv_st_date //예약시작일시 (ex: )
                        let reserv_end_date = element.reserv_end_date //예약종료일시 (ex: )
                        let cardno = element.cardno //예약회원 카드번호 (ex: )
                        let reserv_date = element.reserv_date //예약일시 (ex: )
                        let reserv_id = element.reserv_id //로밍플랫폼 예약번호 (ex: )
                        let charge_yn = element.charge_yn //예약충전 진행(완료) 여부 (ex: N(예약) Y(충전))

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
            console.error("[reserv_update] Request Error: "+ err)
            return({"result": false, "errStr": "Request Failed"})
        })
    return result
}


router.get("/", (req, res)=> {
    console.log("Charging")
    res.send("Charging")
})

// 1. 충전소 정보 조회
router.post("/station/info", async (request, response)=> {
    // let ver = request.body.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.body.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: )
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let udate = request.body.udate //기준일시 이후 갱신된 정보 조회 (ex: ))
    let sido = request.body.sido //지역코드(법정동 시도 2자리) (ex: )
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let open_yn = request.body.open_yn //공개 충전기만 조회 여부 (ex: Y(공개), N(전체))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "csid": csid,
        "spcsid": spcsid,
        "selfex": selfex,
        "udate": udate,
        "sido": sido,
        "period": period,
        "open_yn": open_yn,
    }

    let result = await cs_info(req_data)
    console.log(result)
    // if(result.result) {
    //     response.json({"result": false, "errStr": "요청처리 일부 정상완료"})
    //     response.json({"result": true})
    //     response.json({"result": false, "errStr": "알 수 없는 정상 상태"})
    //     response.json({"result": false, "errStr": "요청처리 전체 에러"})
    //     response.json({"result": false, "errStr": "알 수 없는 에러 코드"})
    //     response.json({"result": false, "errStr": "Request Failed"})
    // }
})

// 2. 충전기 정보 조회
router.post("/device/info", async (request, response)=> {
    // let ver = request.body.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.body.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: )
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: )
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //회원사 충전기ID (ex: )
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let udate = request.body.udate //기준일시 이후 갱신된 정보 조회 (ex: 30, 60, all(전체))
    let sido = request.body.sido //지역코드(법정동 시도 2자리) (ex: )
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let open_yn = request.body.open_yn //공개 충전기만 조회 여부 (ex: Y(공개), N(전체))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "csid": csid,
        "cpid": cpid,
        "spcsid": spcsid,
        "spcpid": spcpid,
        "selfex": selfex,
        "udate": udate,
        "sido": sido,
        "period": period,
        "open_yn": open_yn,
    }

    let result = await cp_info(req_data)
    console.log(result)
})

// 3. 충전기 상태 조회
router.post("/device/status", async (request, response)=> {
    // let ver = request.body.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: )
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: )
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //회원사 충전기ID (ex: )
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let udate = request.body.udate //기준일시 이후 갱신된 정보 조회 (ex: )
    let sido = request.body.sido //지역코드(법정동 시도 2자리) (ex: )
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))
    let open_yn = request.body.open_yn //공개 충전기만 조회 여부 (ex: Y(공개), N(전체))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "csid": csid,
        "cpid": cpid,
        "spcsid": spcsid,
        "spcpid": spcpid,
        "selfex": selfex,
        "udate": udate,
        "sido": sido,
        "period": period,
        "open_yn": open_yn,
    }

    let result = await cp_status(req_data)
    console.log(result)
})

// 4. 충전기ID 매핑정보 조회
router.post("/device/id_info", async (request, response)=> {
    // let ver = request.body.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: )
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: )
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //회원사 충전기ID (ex: )
    let udate = request.body.udate //기준일시 이후 갱신된 정보 조회 (ex: )
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let period = request.body.period //최근 갱신시간(분) (ex: 30, 60, all(전체))

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "csid": csid,
        "cpid": cpid,
        "spcsid": spcsid,
        "spcpid": spcpid,
        "udate": udate,
        "selfex": selfex,
        "period": period,
    }

    let result = await cp_idinfo(req_data)
    console.log(result)
})

// 5. 충전소 정보 등록/수정
router.post("/station/info/update", async (request, response)=> {
    // let ver = request.body.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.body.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*충전소정보 LIST (ex: )
    // let spid = request.body.spid //*회원사 ID (ex: KPC, HEC)
    let csid = request.body.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
    let csnm = request.body.csnm //*충전소명 (ex: 한전본사 남측주차장(공용))
    let daddr = request.body.daddr //*충전소 주소(도로명) (ex: 전라남도 나주시 전력로 55)
    let addr = request.body.addr //충전소 주소(지번) (ex: 전라남도 나주시 빛가람동 120)
    let addr_dtl = request.body.addr_dtl //상세 위치(지번) (ex: 본사내 남측 주차장)
    let lat = request.body.lat //*위도(WGS84 좌표계) (ex: 35.0252349)
    let longi = request.body.longi //*경도(WGS84 좌표계) (ex: 126.7829640)
    let use_time = request.body.use_time //*이용가능시간 (ex: 24시간, 09시~18시)
    let show_yn = request.body.show_yn //*GIS 상태/위치표시여부 (ex: Y(표시) N(미표시))
    let spcsid = request.body.spcsid //*충전사업자 충전소ID (ex: 000293)
    let park_fee_yn = request.body.park_fee_yn //*주차비 무료여부 (ex: Y(유료) N(무료))
    let park_fee = request.body.park_fee //*주차비 요금정보 (ex: 500원/30분, 충전시 무료)
    let spcall = request.body.spcall //*충전기 문의 연락처 (ex: 1899-2100)
    let member_yn = request.body.member_yn //*회원전용 충전여부 (ex: Y(회원전용) N(공용))
    let open_yn = request.body.open_yn //*공용(개방)충전소 여부 (ex: Y(개방) N(미개방))
    let use_yn = request.body.use_yn //*충전소 운영여부 (ex: Y(운영) N(미운영-철거))
    let postcd = request.body.postcd //*우편번호 (ex: 58322)
    let cs_div = request.body.cs_div //*충전소운영 유형 (ex: 코드참조)
    let sido = request.body.sido //*지역코드(법정동 시도 2자리) (ex: 코드참조)
    let sigungu = request.body.sigungu //*시군구코드 (ex: 코드참조)
    let oper_st_ymd = request.body.oper_st_ymd //*서비스운영 시작일자 (ex: 20200820)
    let oper_end_ymd = request.body.oper_end_ymd //*서비스운영 종료일자 (ex: 99991231)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "csid": csid,
            "csnm": csnm,
            "daddr": daddr,
            "addr": addr,
            "addr_dtl": addr_dtl,
            "lat": lat,
            "longi": longi,
            "use_time": use_time,
            "show_yn": show_yn,
            "spcsid": spcsid,
            "park_fee_yn": park_fee_yn,
            "park_fee": park_fee,
            "spcall": spcall,
            "member_yn": member_yn,
            "open_yn": open_yn,
            "use_yn": use_yn,
            "postcd": postcd,
            "cs_div": cs_div,
            "sido": sido,
            "sigungu": sigungu,
            "oper_st_ymd": oper_st_ymd,
            "oper_end_ymd": oper_end_ymd,    
        }
    }

    let result = await cs_update(req_data)
    console.log(result)
})

// 6. 충전기 정보 등록/수정
router.post("/device/info/update", async (request, response)=> {
    // let ver = request.body.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.body.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*충전소정보 LIST (ex: )
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)
    let csid = request.body.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
    let cpid = request.body.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
    let cpnm = request.body.cpnm //*충전기명 (ex: 급속01)
    let use_time = request.body.use_time //*이용가능시간 (ex: 24시간, 09시~18시)
    let open_yn = request.body.open_yn //*공용(개방)충전기 여부 (ex: Y(개방) N(미개방))
    let show_yn = request.body.show_yn //*GIS 상태/위치표시여부 (ex: Y(표시) N(미표시))
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //회원사 충전기ID (ex: )
    let charge_ucost1 = request.body.charge_ucost1 //*충전기 충전단가(경부하/원) (ex: 255.7)
    let charge_ucost2 = request.body.charge_ucost2 //충전기 충전단가(중간부하/원) (ex: 255.7)
    let charge_ucost3 = request.body.charge_ucost3 //충전기 충전단가(최대부하/원) (ex: 255.7)
    let use_yn = request.body.use_yn //*충전기 운영여부 (ex: Y(운영) N(미운영-철거))
    let oper_st_ymd = request.body.oper_st_ymd //*서비스운영 시작일자 (ex: 20200820)
    let oper_end_ymd = request.body.oper_end_ymd //*서비스운영 종료일자 (ex: 99991231)
    let outlet_cnt = request.body.outlet_cnt //*동시충전가능 아웃렛수 (ex: 1(기본), 1~100범위)
    let pnc_yn = request.body.pnc_yn //PnC충전가능 여부 (ex: Y(PnC지원) N(PnC미지원))
    let cpkw = request.body.cpkw //*충전기 용량 (ex: 7.7(완속) 50(급속), 100)
    let charge_div = request.body.charge_div //*충전기구분 (ex: 1(완속) 2(급속) 3(초급속))
    let cp_tp = request.body.cp_tp //*충전기유형 (ex: 코드참조)
    let postcd = request.body.postcd //*우편번호 (ex: 코드참조)
    let cs_div = request.body.cs_div //*충전소 운영 유형 (ex: 코드참조)
    let outlet_div = request.body.outlet_div //*아웃렛 유형 (ex: 코드참조)
    let conn_div = request.body.conn_div //*연결방식 유형 (ex: 코드참조)
    let charge_kw = request.body.charge_kw //*충전용량 (ex: 코드참조)
    let service_div = request.body.service_div //*서비스 유형 (ex: 코드참조)
    let net_div = request.body.net_div //*통신방식 유형 (ex: 코드참조)
    let auth_div = request.body.auth_div //*인증 및 과금 유형 (ex: 코드참조)
    let compty_div = request.body.compty_div //*로밍플랫폼 호환성 (ex: 코드참조)
    let ami_cert = request.body.ami_cert //계량기 인증번호 (ex: )

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "csid": csid,
            "cpid": cpid,
            "cpnm": cpnm,
            "use_time": use_time,
            "open_yn": open_yn,
            "show_yn": show_yn,
            "spcsid": spcsid,
            "spcpid": spcpid,
            "charge_ucost1": charge_ucost1,
            "charge_ucost2": charge_ucost2,
            "charge_ucost3": charge_ucost3,
            "use_yn": use_yn,
            "oper_st_ymd": oper_st_ymd,
            "oper_end_ymd": oper_end_ymd,
            "outlet_cnt": outlet_cnt,
            "pnc_yn": pnc_yn,
            "cpkw": cpkw,
            "charge_div": charge_div,
            "cp_tp": cp_tp,
            "postcd": postcd,
            "cs_div": cs_div,
            "outlet_div": outlet_div,
            "conn_div": conn_div,
            "charge_kw": charge_kw,
            "service_div": service_div,
            "net_div": net_div,
            "auth_div": auth_div,
            "compty_div": compty_div,
            "ami_cert": ami_cert,
        }
    }

    let result = await cp_update(req_data)
    console.log(result)
})

// 7. 충전기 상태정보 등록/수정
router.post("/device/status/update", async (request, response)=> {
    // let ver = request.body.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.body.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*충전소정보 LIST (ex: )
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)
    let csid = request.body.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
    let cpid = request.body.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
    let outlet_id = request.body.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
    let status_cd = request.body.status_cd //*충전기 상태 코드 (ex: 코드참조)
    let status_dtl_cd = request.body.status_dtl_cd //*충전기 상태 상세코드 (ex: 코드참조)
    let update_time = request.body.update_time //*상태 갱신 시각 (ex: 20200820213000)
    let show_yn = request.body.show_yn //*GIS 상태/위치표시여부 (ex: Y(표시) N(미표시))
    let open_yn = request.body.open_yn //*충전기 개방여부 (ex: Y(개방) N(미개방))
    let spcsid = request.body.spcsid //*충전사업자 충전소ID (ex: )
    let spcpid = request.body.spcpid //*충전사업자 충전기ID (ex: )
    let charge_st_date = request.body.charge_st_date //충전시작일시 (ex: 20200820213000)
    let charge_soc = request.body.charge_soc //충전진행 SOC값 (ex: 80.5)
    let charge_type = request.body.charge_type //충전커넥터 타입 (ex: 코드참조)
    let stop_yn = request.body.stop_yn //이용중지여부(기본:Y) (ex: Y(중지) N(이용가능))
    let stop_st_date = request.body.stop_st_date //이용중지 시작일시 (ex: 20200820100000)
    let stop_end_date = request.body.stop_end_date //이용중지 종료일시 (ex: 20200825175000)

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "csid": csid,
            "cpid": cpid,
            "outlet_id": outlet_id,
            "status_cd": status_cd,
            "status_dtl_cd": status_dtl_cd,
            "update_time": update_time,
            "show_yn": show_yn,
            "open_yn": open_yn,
            "spcsid": spcsid,
            "spcpid": spcpid,
            "charge_st_date": charge_st_date,
            "charge_soc": charge_soc,
            "charge_type": charge_type,
            "stop_yn": stop_yn,
            "stop_st_date": stop_st_date,
            "stop_end_date": stop_end_date,
        }
    }

    let result = await cp_status_update(req_data)
    console.log(result)
})

// 8. 충전기 예약정보 조회
router.post("/device/reserv/info", async (request, response)=> {
    // let ver = request.ver //*프로토콜 버전 (ex: v100)
    // let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    // let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    let provider_id = request.body.provider_id //조회 회원사 (ex: HEC, CVC)
    let csid = request.body.csid //로밍플랫폼 충전소ID (ex: )
    let cpid = request.body.cpid //로밍플랫폼 충전기ID (ex: )
    let spcsid = request.body.spcsid //회원사 충전소ID (ex: )
    let spcpid = request.body.spcpid //회원사 충전기ID (ex: )
    let selfex = request.body.selfex //spid와 동일사업자 정보 제외 (ex: Y(제외), N(포함))
    let cardno = request.body.cardno //예약 회원카드 번호 (ex: 1010010101010101)
    let fromdate = request.body.fromdate //예약시작일시 (ex: 20200820135000)
    let todate = request.body.todate //예약종료일시 (ex: 20200820135000)

    let req_data = {
        "spkey": spkey,
        "provider_id": provider_id,
        "csid": csid,
        "cpid": cpid,
        "spcsid": spcsid,
        "spcpid": spcpid,
        "selfex": selfex,
        "cardno": cardno,
        "fromdate": fromdate,
        "todate": todate,
    }

    let result = await reserv_info(req_data)
    console.log(result)
})

// 9. 충전기 예약정보 등록/수정
router.post("/device/reserv/update", async (request, response)=> {
    let ver = request.ver //*프로토콜 버전 (ex: v100)
    let spid = request.spid //*회원사 ID (ex: KPC, HEC)

    let spkey = request.body.spkey //*회원사 연계키 (ex: KRKPCxx..xx)
    // let list = request.body.list //*충전소정보 LIST (ex: )
    // let spid = request.body.spid //*회원사ID (ex: KPC, HEC)
    let csid = request.body.csid //*로밍플랫폼 충전소ID (ex: KRKPC000000001)
    let cpid = request.body.cpid //*로밍플랫폼 충전기ID (ex: KRKPC000000001)
    let spcsid = request.body.spcsid //*충전사업자 충전소ID (ex: )
    let spcpid = request.body.spcpid //*충전사업자 충전기ID (ex: )
    let outlet_id = request.body.outlet_id //*충전기 아웃렛ID (ex: 1(기본), 1~100범위)
    let provider_id = request.body.provider_id //*예약회원 회원사 (ex: KPC, HEC)
    let reserv_st_date = request.body.reserv_st_date //*예약시작일시 (ex: )
    let reserv_end_date = request.body.reserv_end_date //*예약종료일시 (ex: )
    let cardno = request.body.cardno //*예약회원 카드번호 (ex: )
    let reserv_date = request.body.reserv_date //*예약일시 (ex: )

    let req_data = {
        "spkey": spkey,
        "list": {
            "spid": spid,
            "csid": csid,
            "cpid": cpid,
            "spcsid": spcsid,
            "spcpid": spcpid,
            "outlet_id": outlet_id,
            "provider_id": provider_id,
            "reserv_st_date": reserv_st_date,
            "reserv_end_date": reserv_end_date,
            "cardno": cardno,
            "reserv_date": reserv_date,
        }
    }

    let result = await reserv_update(req_data)
    console.log(result)
})

module.exports = router