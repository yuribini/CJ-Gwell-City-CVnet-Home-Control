// 언어팩 선언.
$.lang = {};
/*
case '거실' : result = 1 ;
            break;
        case '안방' : result = 2 ;
            break;
        case '침실1' : result = 3 ;
            break;
        case '침실2' : result = 4 ;
            break;
        case '가족실' : result = 5 ;
            break;
        case '서재' : result = 6 ;
            break;
        case '주방' : result = 7 ;
            break;
        case '식당' : result = 8 ;
            break;
        case '가사도우미' : result = 9 ;
            break;
        case '드레스룸' : result = 10 ;
            break;
        case '가족실' : result = 11 ;
*/
$.lang.ko = {
    room1: '거실',
    room2: '안방',
    room3: '침실1',
    room4: '침실2',
    room5: '가족실',
    room6: '서재',
    room7: '주방',
    room8: '식당',
    room9: '가사도우미',
    room10: '드레스룸',
    room11: '가족실',
    room12: '복도',
    id: '아이디 입력',
    pw: '비밀번호 입력',
    pw_check: '비밀번호 확인',
    auto_login: '자동 로그인',
    login: '로그인',
    search: '찾기',
    find_title_id: '아이디 찾기',
    find_title_pw: '패스워드 찾기',
    input_dong: '동 입력',
    input_ho: '호 입력',
    access_key: '인증키 입력',
    find_btn_id: '아이디 찾기',
    find_btn_pw: '패스워드 찾기',
    to_login_page: '로그인화면으로',
    info_access: '인증키는 거실<span>‘월패드‘의</span><br><span>‘설정‘화면</span>에서 확인가능합니다.',
    info_getpw: '패스워드 발급시 <span>기존 패스워드는 삭제</span>되며<br>로그인 후, 변경하시기 바랍니다.',
    get_temp_pw: '임시 패스워드 발급',
    login16: '검색된 아이디',
    btn_ok: '확인',
    info_get_temp_pw: '회원님의 임시 패스워드는<br><span class="tempPassword"></span>입니다',
    home_menu_light : '조명',
    home_menu_wholelight : '일괄소등',
    home_menu_heating : '난방',
    home_menu_aircon : '냉방',
    home_menu_gas : '가스',
    home_menu_standbypower : '대기전력',
    home_menu_curtain : '커튼',
    home_menu_vent : '환기',
    home_menu_maincost : '관리비',
    home_menu_telemetering : '원격검침',
    home_menu_notice : '공지사항',
    home_menu_visitor : '방문자 확인',
    home_menu_cctv : 'CCTV',
    home_menu_parcel : '택배',
    home_menu_electric : '전기차',
    home_menu_enterencecar : '입차통보',
    home_menu_emergency : '비상리스트',
    home_menu_parkposition : '주차위치',
    home_menu_call : '통화',
    home_menu_callbell : '통화벨 설정',
    home_menu_callbell_on : '통화벨로 알림',
    home_menu_callbell_off : '메시지로 알림',
	home_menu_booking_car: '방문차량등록',
	home_menu_power_plant: '주민참여<br/>발전소',

    home_menu: ['','냉방','A/S','통화','CCTV','커튼','현관카메라','비상리스트','입차통보','출입기록','가스','난방','조명','주차위치','관리비','공지사항','택배','원격검침','환기','방문자 확인','삼성 스마트홈','일괄소등','스마트플러그','대기전력','전기차', '엘리베이터', '도어락', 'EMS', '주민투표'],
    text_wholeLight_control : '일괄소등 제어',
    text_wholeLight_notice : '일괄소등을 <span class="popup_mode_sub_span">"설정"</span><br>하시겠습니까?',
    control_mode: 'Mode Control',
    mode_vacant: '외출',
    mode_occupied: '재실',
    mode_sleep: '취침',
    mode_notice : '로 변경 하시겠습니까?',
    mode_mode_vacant_notice : '<span class="popup_mode_sub_span">"외출 모드"</span><p data-langNum="mode_notice" style="margin-top:0px;">' + '로 변경 하시겠습니까?' +'</p></div>',
    mode_mode_occupied_notice : '<span class="popup_mode_sub_span">"재실 모드"</span><p data-langNum="mode_notice" style="margin-top:0px;">' + '로 변경 하시겠습니까?' +'</p></div>',
    mode_mode_sleep_notice : '<span class="popup_mode_sub_span">"취침 모드"</span><p data-langNum="mode_notice" style="margin-top:0px;">' + '로 변경 하시겠습니까?' +'</p></div>',
    submit: '적용',
    text_execution: '실행',
    cancel: '취소',
    today_weather: '오늘의 날씨',
    now_temp: '현재기온',
    fd_normal: '미세먼지 보통',
    fd_good: '미세먼지 좋음',
    fd_bad: '미세먼지 나쁨',
    fd_vary_bad: '미세먼지 매우나쁨',
    telemegtering: '우리집 모니터링',
    now_value: '현재',
    setting_value: '설정',
    text_vacant: '외출',
    text_gas: '가스',
    text_setting: '환경설정',
    text_account_info: '계정 정보',
    text_app_info: '앱 정보',
    text_push_alrim: '푸쉬 알림 설정',
    text_use_call: '통화 사용 여부',
    text_logout_change_pw: '로그아웃,패스워드 변경',
    text_logout: '로그아웃',
    text_change_pw: '패스워드 변경',
    text_complex:'단지',
    text_dong: '동',
    text_ho: '호',
    text_dongAndHo:'동호수',
    text_id: '아이디',
    text_notice_account_info: '스마트 디바이스 1대당 1개의<br>계정으로만 로그인할 수 있습니다.<br><br>로그아웃하시면 로그인 화면으로<br>전환됩니다.<br>',
   
    now_version: '현재버전',
    text_look : '보기',
    terms: '이용약관 보기',
    privacy: '개인정보취급방침 보기',
    text_change_guard_mode: '방범모드 변경 시',
    text_enterance_car: '입차 통보 시',
    text_notive_or_parcel: '신규공지/택배가 있을 시',
    switch_on: 'ON',
    switch_off: 'OFF',
    btn_change: '변경',
    text_concent_title:'대기전력',
    text_smartPlug_title:'스마트플러그',
    text_light: '조명',
    text_heating: '난방',
    text_dimming: '디밍',
    text_setTemp: '설정 온도',
    text_nowTemp: '현재 온도',
    text_now: '현재',
    text_tempSubmit: '설정온도 적용하기',
    text_aircon: '냉방',
    text_setMode: '운전모드 설정',
    text_setModeArray: ['냉방','제습','송풍','자동','난방'],
    text_setWind: '풍량 설정',
    text_setWindArray1 : '약풍',
    text_setWindArray2 : '중풍',
    text_setWindArray3 : '강풍',
    text_setWindArray4 : '자동',
    text_setWindArray : ['약풍', '중풍', '강풍', '자동'],
    text_gasClose: '가스밸브가 닫혀 있습니다!',
    text_gasOpen: '가스밸브가 열려 있습니다!',
    text_gasNotice: '안전상의 이유로 <span class="orange_text">가스밸브 잠금 기능만 제공</span>하고 있습니다.',
    text_curtain: '커튼',
    text_curtainNotice: '조금만 열려 있어도<span class="mainColorFont">"OPEN"</span>으로<br>표시됩니다',
    text_ventilator: '환기',
    text_kitchen_interlock : '주방 연동',
    text_bathroom_interlock : '거실 연동',
    text_maintcost: '관리비',
    text_year: '년',
    text_month: '월',
    text_won: '원',
    text_maintcost1: '세대관리비',
    text_maintcost2: '일반관리비',
    text_electCharges: '전기요금',
    text_waterCharges: '수도요금',
    text_heatingCharges: '난방요금',
    text_etc: '기타',
    text_compareLastMonth: '전월대비',
    text_telemetering: '원격검침',
    text_elect: '전기',
    text_water: '수도',
    text_hotWater: '온수',
    text_telemeteringNotice: '※ 각 항목의 원격검침 값은 누적된 총 사용량을 의미합니다.',
    text_notice: '공지사항',
    text_visitor: '방문자 확인',
    text_cctvName1: '세대현관',
    text_cctvName2: '놀이터',
    text_cctvName3: '정문',
    text_cctvName4: '후문',
    text_cctvName5: '지하 주차장',
    text_cctvName6: '단지 정문',
    text_cctvNotice: '3G/LTE 환경에서는 <span>과다한 데이터 요금</span>이<br> 청구될 수 있으니 주의하시기 바랍니다.',
    text_callNotice: "3G/LTE 환경에서는 <br><span>과다한 데이터 요금</span>이<br> 청구될 수 있으니 주의하시기 바랍니다.",
    text_parcel: '택배',
    text_parcel_arrive : '택배도착',
    text_parcel_reception : '고객수령',
    text_enterCar: '입차통보',
    text_today: '오늘',
    text_emergency: '비상리스트',
    text_emergency_gas: '가스 누출 감지',
    text_emergency_emer: '비상 상황 발생',
    text_emergency_in: '침입 상황 발생',
    text_emergency_fire_escape: '피난사다리 상황 발생',
    text_emergency_aid: '구급 상황 발생',
    text_emergency_fire: '화재 발생',
    text_emergency_safe: '금고 경보 발생',
    text_emergency_crime: '방범',
    text_emergency_alarm : '경보 발생',
    location: '주차위치',
    text_doorloack : '도어락',
    text_homemode_setting : '귀가 모드 설정',
    text_homemode : '귀가모드',
    text_homemode_exec : '귀가모드 실행',
    text_homemode_popup : '<span class="popup_mode_sub_span">귀가모드</span>를<br> 실행 하시겠습니까?',

    text_elec_car : '전기차',

    text_charging_status : '충전상태',
    text_history_check : '이력조회',
    text_charger_status : '충전기현황',
    text_charge_start_time : '충전 시작시간',
    text_charge_power_volume : '충전 전력량',
    text_estimated_charging_rate : '예상 충전 요금',
    text_current_status : '현재 상태',

    text_charge_date : '충전일',
    text_charger_name : '충전기명',
    text_estimated_rate : '예상 요금',

    text_remaining_time : '잔여시간',

    text_charging_possible : '충전 가눙',
    text_charging_standby : '충전 대기',
    text_charging : '충전 중',
    text_charging_err : '고장 / 오류',

    text_network_err : '통신 에러',
    prev : '&#10094;이전 목록',
    next : '다음 목록 &#10095;',

    text_light_on : '조명ON',
    text_aircon_on : '냉방ON',
    text_curtain_on : '커튼Open',
    text_heating_on : '난방ON',
    text_homemode_info : '냉/난방 ON 동시 설정은 불가 합니다.<br>귀가 모드 실행시, 거실의 디바이스만<br>ON(또는 Open) 됩니다.',

};

$.lang.kr = {
    room1: '거실',
    room2: '안방',
    room3: '침실1',
    room4: '침실2',
    room5: '가족실',
    room6: '서재',
    room7: '주방',
    room8: '식당',
    room9: '가사도우미',
    room10: '드레스룸',
    room11: '가족실',
    room12: '복도',
    id: '아이디 입력',
    pw: '비밀번호 입력',
    pw_check: '비밀번호 확인',
    auto_login: '자동 로그인',
    login: '로그인',
    search: '찾기',
    find_title_id: '아이디 찾기',
    find_title_pw: '패스워드 찾기',
    input_dong: '동 입력',
    input_ho: '호 입력',
    access_key: '인증키 입력',
    find_btn_id: '아이디 찾기',
    find_btn_pw: '패스워드 찾기',
    to_login_page: '로그인화면으로',
    info_access: '인증키는 거실<span>‘월패드‘의</span><br><span>‘설정‘화면</span>에서 확인가능합니다.',
    info_getpw: '패스워드 발급시 <span>기존 패스워드는 삭제</span>되며<br>로그인 후, 변경하시기 바랍니다.',
    get_temp_pw: '임시 패스워드 발급',
    login16: '검색된 아이디',
    btn_ok: '확인',
    info_get_temp_pw: '회원님의 임시 패스워드는<br><span class="tempPassword"></span>입니다',
    home_menu_light : '조명',
    home_menu_wholelight : '일괄소등',
    home_menu_heating : '난방',
    home_menu_aircon : '냉방',
    home_menu_gas : '가스',
    home_menu_standbypower : '대기전력',
    home_menu_curtain : '커튼',
    home_menu_vent : '환기',
    home_menu_maincost : '관리비',
    home_menu_telemetering : '원격검침',
    home_menu_notice : '공지사항',
    home_menu_visitor : '방문자 확인',
    home_menu_cctv : 'CCTV',
    home_menu_parcel : '택배',
    home_menu_electric : '전기차',
    home_menu_enterencecar : '입차통보',
    home_menu_emergency : '비상리스트',
    home_menu_parkposition : '주차위치',
    home_menu_call : '통화',
    home_menu_callbell : '통화벨 설정',
    home_menu_callbell_on : '통화벨로 알림',
    home_menu_callbell_off : '메시지로 알림',

    home_menu: ['','냉방','A/S','통화','CCTV','커튼','현관카메라','비상리스트','입차통보','출입기록','가스','난방','조명','주차위치','관리비','공지사항','택배','원격검침','환기','방문자 확인','삼성 스마트홈','일괄소등','스마트플러그','대기전력','전기차', '엘리베이터', '도어락', 'EMS'],
    text_wholeLight_control : '일괄소등 제어',
    text_wholeLight_notice : '일괄소등을 <span class="popup_mode_sub_span">"설정"</span><br>하시겠습니까?',
    control_mode: 'Mode Control',
    mode_vacant: '외출',
    mode_occupied: '재실',
    mode_sleep: '취침',
    mode_notice : '로 변경 하시겠습니까?',
    mode_mode_vacant_notice : '<span class="popup_mode_sub_span">"외출 모드"</span><p data-langNum="mode_notice" style="margin-top:0px;">' + '로 변경 하시겠습니까?' +'</p></div>',
    mode_mode_occupied_notice : '<span class="popup_mode_sub_span">"재실 모드"</span><p data-langNum="mode_notice" style="margin-top:0px;">' + '로 변경 하시겠습니까?' +'</p></div>',
    mode_mode_sleep_notice : '<span class="popup_mode_sub_span">"취침 모드"</span><p data-langNum="mode_notice" style="margin-top:0px;">' + '로 변경 하시겠습니까?' +'</p></div>',
    submit: '적용',
    text_execution: '실행',
    cancel: '취소',
    today_weather: '오늘의 날씨',
    now_temp: '현재기온',
    fd_normal: '미세먼지 보통',
    fd_good: '미세먼지 좋음',
    fd_bad: '미세먼지 나쁨',
    fd_vary_bad: '미세먼지 매우나쁨',
    telemegtering: '우리집 모니터링',
    now_value: '현재',
    setting_value: '설정',
    text_vacant: '외출',
    text_gas: '가스',
    text_setting: '환경설정',
    text_account_info: '계정 정보',
    text_app_info: '앱 정보',
    text_push_alrim: '푸쉬 알림 설정',
    text_use_call: '통화 사용 여부',
    text_logout_change_pw: '로그아웃,패스워드 변경',
    text_logout: '로그아웃',
    text_change_pw: '패스워드 변경',
    text_complex:'단지',
    text_dong: '동',
    text_ho: '호',
    text_dongAndHo:'동호수',
    text_id: '아이디',
    text_notice_account_info: '스마트 디바이스 1대당 1개의<br>계정으로만 로그인할 수 있습니다.<br><br>로그아웃하시면 로그인 화면으로<br>전환됩니다.<br>',
   
    now_version: '현재버전',
    text_look : '보기',
    terms: '이용약관 보기',
    privacy: '개인정보취급방침 보기',
    text_change_guard_mode: '방범모드 변경 시',
    text_enterance_car: '입차 통보 시',
    text_notive_or_parcel: '신규공지/택배가 있을 시',
    switch_on: 'ON',
    switch_off: 'OFF',
    btn_change: '변경',
    text_concent_title:'대기전력',
    text_smartPlug_title:'스마트플러그',
    text_light: '조명',
    text_heating: '난방',
    text_dimming: '디밍',
    text_setTemp: '설정 온도',
    text_nowTemp: '현재 온도',
    text_now: '현재',
    text_tempSubmit: '설정온도 적용하기',
    text_aircon: '냉방',
    text_setMode: '운전모드 설정',
    text_setModeArray: ['냉방','제습','송풍','자동','난방'],
    text_setWind: '풍량 설정',
    text_setWindArray1 : '약풍',
    text_setWindArray2 : '중풍',
    text_setWindArray3 : '강풍',
    text_setWindArray4 : '자동',
    text_setWindArray : ['약풍', '중풍', '강풍', '자동'],
    text_gasClose: '가스밸브가 닫혀 있습니다!',
    text_gasOpen: '가스밸브가 열려 있습니다!',
    text_gasNotice: '안전상의 이유로 <span class="orange_text">가스밸브 잠금 기능만 제공</span>하고 있습니다.',
    text_curtain: '커튼',
    text_curtainNotice: '조금만 열려 있어도<span class="mainColorFont">"OPEN"</span>으로<br>표시됩니다',
    text_ventilator: '환기',
    text_kitchen_interlock : '주방 연동',
    text_bathroom_interlock : '거실 연동',
    text_maintcost: '관리비',
    text_year: '년',
    text_month: '월',
    text_won: '원',
    text_maintcost1: '세대관리비',
    text_maintcost2: '일반관리비',
    text_electCharges: '전기요금',
    text_waterCharges: '수도요금',
    text_heatingCharges: '난방요금',
    text_etc: '기타',
    text_compareLastMonth: '전월대비',
    text_telemetering: '원격검침',
    text_elect: '전기',
    text_water: '수도',
    text_hotWater: '온수',
    text_telemeteringNotice: '※ 각 항목의 원격검침 값은 누적된 총 사용량을 의미합니다.',
    text_notice: '공지사항',
    text_visitor: '방문자 확인',
    text_cctvName1: '세대현관',
    text_cctvName2: '놀이터',
    text_cctvName3: '정문',
    text_cctvName4: '후문',
    text_cctvName5: '지하 주차장',
    text_cctvName6: '단지 정문',
    text_cctvNotice: '3G/LTE 환경에서는 <span>과다한 데이터 요금</span>이<br> 청구될 수 있으니 주의하시기 바랍니다.',
    text_callNotice: "3G/LTE 환경에서는 <br><span>과다한 데이터 요금</span>이<br> 청구될 수 있으니 주의하시기 바랍니다.",
    text_parcel: '택배',
    text_parcel_arrive : '택배도착',
    text_parcel_reception : '고객수령',
    text_enterCar: '입차통보',
    text_today: '오늘',
    text_emergency: '비상리스트',
    text_emergency_gas: '가스 누출 감지',
    text_emergency_emer: '비상 상황 발생',
    text_emergency_in: '침입 상황 발생',
    text_emergency_fire_escape: '피난사다리 상황 발생',
    text_emergency_aid: '구급 상황 발생',
    text_emergency_fire: '화재 발생',
    text_emergency_safe: '금고 경보 발생',
    text_emergency_crime: '방범',
    text_emergency_alarm : '경보 발생',
    location: '주차위치',
    text_doorloack : '도어락',
    text_homemode_setting : '귀가 모드 설정',
    text_homemode : '귀가모드',
    text_homemode_exec : '귀가모드 실행',
    text_homemode_popup : '<span class="popup_mode_sub_span">귀가모드</span>를<br> 실행 하시겠습니까?',

    text_elec_car : '전기차',

    text_charging_status : '충전상태',
    text_history_check : '이력조회',
    text_charger_status : '충전기현황',
    text_charge_start_time : '충전 시작시간',
    text_charge_power_volume : '충전 전력량',
    text_estimated_charging_rate : '예상 충전 요금',
    text_current_status : '현재 상태',

    text_charge_date : '충전일',
    text_charger_name : '충전기명',
    text_estimated_rate : '예상 요금',

    text_remaining_time : '잔여시간',

    text_charging_possible : '충전 가눙',
    text_charging_standby : '충전 대기',
    text_charging : '충전 중',
    text_charging_err : '고장 / 오류',

    text_network_err : '통신 에러',
    prev : '&#10094;이전 목록',
    next : '다음 목록 &#10095;',

    text_light_on : '조명ON',
    text_aircon_on : '냉방ON',
    text_curtain_on : '커튼Open',
    text_heating_on : '난방ON',
    text_homemode_info : '냉/난방 ON 동시 설정은 불가 합니다.<br>귀가 모드 실행시, 거실의 디바이스만<br>ON(또는 Open) 됩니다.',

};
$.lang.en = {
    room1: 'Living',
    room2: 'Main',
    room3: 'Bed1',
    room4: 'Bed2',
    room5: 'Family',
    room6: 'Library',
    room7: 'Kitchen',
    room8: 'Restaurant',
    room9: 'Housework',
    room10: 'DressRoom',
    room11: 'FamilyRoom',
    room12: 'Hallway',
    id: 'ID',
    pw: 'Password',
    pw_check: 'Re-enter password',
    auto_login: 'Auto Login',
    login: 'Login',
    search: 'Search',
    find_title_id: 'Forgot your ID?',
    find_title_pw: 'Forgot your PW?',
    input_dong: 'DONG',
    input_ho: 'HO',
    access_key: 'Access #',
    find_btn_id: 'Find ID',
    find_btn_pw: 'Find Password',
    to_login_page: 'Back',
    info_access: 'Access # can be found <br>on the <span>‘Settings’</span> screen<br>in the Living Room <span>‘Wallpad‘</span>',
    info_getpw: 'Your <span>password will be deleted</span><br>when issuing your password,<br>After logging in change the password',
    get_temp_pw: 'Get the Temporarily Password',
    login16: 'Find ID',
    btn_ok: 'OK',
    info_get_temp_pw: 'Your Temporarily<br>Password is <span class="tempPassword"></span>',
    home_menu_light : 'Light',
    home_menu_wholelight : 'Whole Light',
    home_menu_heating : 'Heating',
    home_menu_aircon : 'Aircon',
    home_menu_gas : 'Gas',
    home_menu_standbypower : 'Standby<br>Power',
    home_menu_curtain : 'Curtain',
    home_menu_vent : 'Ventilator',
    home_menu_maincost : 'Maintenance<br>Cost',
    home_menu_telemetering : 'Telemetering',
    home_menu_notice : 'Notice',
    home_menu_visitor : 'Visitor',
    home_menu_cctv : 'CCTV',
    home_menu_parcel : 'Parcel',
    home_menu_electric : 'Electric<br>Car',
    home_menu_enterencecar : 'Enterence<br>Car',
    home_menu_emergency : 'Emergency',
    home_menu_parkposition : 'Park<br>Position',
    home_menu_call : 'Telephone',
    home_menu_callbell : 'Call Bell',
    home_menu_callbell_on : 'Notify by Call Bell',
    home_menu_callbell_off : 'Notify Me by Message',
    
    
    
    home_menu: ['','Aircon','A/S','Telephone','CCTV','Curtain','Camera','Emergency','Enterence<br>Car','출입기록','Gas','Heating','Light','Park<br>Position','Maintenance<br>Cost','Notice','Parcel','Telemetering','Ventilator','Visitor','Samsung<br>Smarthome','Whole Light','Smart Plug','Standby<br>Power','Electric<br>Car', 'Door Lock', 'Vote'],
    text_wholeLight_control : 'Whole Light Control',
    text_wholeLight_notice : 'Do you want to <span class="popup_mode_sub_span">"set"</span> Whole Light?',
    control_mode: 'Control Mode',
    mode_vacant: 'Vacant',
    mode_occupied: 'Occupied',
    mode_sleep: 'Sleep',
    mode_notice : 'Would you like to change to',
    submit: 'Submit',
    text_execution: 'Execution',
    cancel: 'Cancel',
    today_weather: 'Today Weather',
    now_temp: 'Now Temp.',
    fd_normal: 'Fine Dust<br>Normal',
    fd_good: 'Fine Dust<br>Good',
    fd_bad: 'Fine Dust<br>Bad',
    fd_vary_bad: 'Fine Dust<br>Vary Bad',
    telemegtering: 'Monitering our house',
    now_value: 'Now',
    setting_value: 'Set',
    text_vacant: 'Vacant',
    text_gas: 'Gas',
    text_setting: 'Setting',
    text_account_info: 'Account Info',
    text_app_info: 'App Info',
    text_push_alrim: 'Push Notification',
    text_use_call: 'Telephone',
    text_logout_change_pw: 'Logout, Change PW',
    text_logout: 'Logout',
    text_change_pw: 'Change Password',
    text_complex:'complex',
    text_dong: 'Dong',
    text_ho: 'Ho',
    text_dongAndHo:'Dong & Ho',
    text_id: 'ID',
    text_notice_account_info: 'You can login to only one account<br>per one of the smart devices.<br><br>When you logout,<br>the login page will be displayed.<br>',
    now_version: 'Now Version',
    text_look : 'View',
    terms: 'Terms',
    privacy: 'Privacy',
    text_change_guard_mode: 'Change guard mode',
    text_enterance_car: 'Enterance car',
    text_notive_or_parcel: 'Notice or Parcel',
    switch_on: 'ON',
    switch_off: 'OFF',
    btn_change: 'Change',
    text_concent_title:'Standby Power',
    text_smartPlug_title:'Smart Plug',
    text_light: 'Light',
    text_heating: 'Heating',
    text_dimming: 'Dimming',
    text_setTemp: 'Set Temp',
    text_nowTemp: 'Current<br>Temp',
    text_now: 'Current',
    text_tempSubmit: 'Setup',
    text_aircon: 'Aircon',
    text_setMode: 'Set Mode',
    text_setModeArray: ['Cool','Dry','Fan','Auto','Heat'],
    text_setWind: 'Wind Speed',
    text_setWindArray1 : 'Low',
    text_setWindArray2 : 'Medium',
    text_setWindArray3 : 'High',
    text_setWindArray4 : 'Auto',
    text_setWindArray : ['Low', 'Medium', 'High', 'Auto'],
    text_gasClose: 'Gas Valve Closed!',
    text_gasOpen: 'Gas Valve Open!',
    text_gasNotice: 'Only <span>"Close" function is provided</span> for your secure.',
    text_curtain: 'Control Curtains',
    text_curtainNotice: 'Show <span>Open</span>, even thought<br> it is slightly open',
    text_ventilator: 'Control Ventilator',
    text_kitchen_interlock : 'Kitchen Interlock',
    text_bathroom_interlock : 'Bathroom Interlock',
    text_maintcost: 'Maintenance Cost',
    text_year: ' ',
    text_month: ' ',
    text_won: 'won',
    text_maintcost1: 'Utility fee for residence',
    text_maintcost2: 'Utility fee for compex',
    text_electCharges: 'Electric Charges',
    text_waterCharges: 'Water Charges',
    text_heatingCharges: 'Heating Charges',
    text_etc: 'etc.',
    text_compareLastMonth: 'Compared to the previous month',
    text_telemetering: 'Telemetering',
    text_elect: 'Electric',
    text_water: 'Water',
    text_hotWater: 'Hot Water',
    text_telemeteringNotice: '※ Telemetering values for each item refer to cumulative total usage.',
    text_notice: 'Notice',
    text_visitor: 'Visitor',
    text_cctvName1: 'Porch',
    text_cctvName2: 'Playground',
    text_cctvName3: 'Main Gate',
    text_cctvName4: 'Back Gate',
    text_cctvNotice: 'Be careful that<span> expensive data charges</span><br>can be in 3G/LTE environments.',
    text_parcel: 'Parcel',
    text_parcel_arrive : 'Parcel Arrive',
    text_parcel_reception : 'Customer Reception',
    text_enterCar: 'Enterance Car',
    text_today: 'Today',
    text_emergency: 'Emergency List',
    text_emergency_gas: 'Gas leak detection',
    text_emergency_emer: 'Occurrence of an emergency',
    text_emergency_in: 'Outbreak of invasion',
    text_emergency_fire_escape: 'Occurrence of Evacuation Ladder',
    text_emergency_aid: 'Occurrence of first aid',
    text_emergency_fire: 'Occurrence of rire',
    text_emergency_safe: 'Occurrence of safe alarm',
    text_emergency_crime: 'a crime of defense',
    text_emergency_alarm : 'Occurrence of',

    location: 'Park Position',
    text_doorloack : 'doorlock',
    text_homemode_setting : 'Set HomeMode',
    text_homemode : 'HomeMode',
    text_homemode_exec : 'Execute<br>HomeMode',
    text_homemode_popup : 'Do you want to run<br/><span class="popup_mode_sub_span">Home Mode</span>?',
    text_elec_car : 'Electric Car',
    text_charging_status : 'Charging status',
    text_history_check : 'History Check',
    text_charger_status : 'Charger status',
    text_charge_start_time : 'Charge start time',
    text_charge_power_volume : 'Charge power volume',
    text_estimated_charging_rate : 'Estimated charging rate',
    text_current_status : 'Current status',

    text_charge_date : 'Charge date',
    text_charger_name : 'Charger name',
    text_estimated_rate : 'Estimated rate',

    text_remaining_time : 'Remaining time',

    text_charging_possible : 'Charging Possible',
    text_charging_standby : 'Charging Standby',
    text_charging : 'Charging',
    text_charging_err : 'Trouble/Error',

    text_network_err : 'Network Error',

    prev : '&#10094; Prev',
    next : 'Next &#10095;',

    text_light_on : 'Light ON',
    text_aircon_on : 'Aircon ON',
    text_curtain_on : 'Curtain Open',
    text_heating_on : 'Heating ON',
    text_homemode_info : 'Simultaneous setting of cooling and heating ON is not possible.<br>When in home mode, only devices in the living room are turned on (or open)',
    
};

$.lang.ch = {
    room1: '起居室',
    room2: '主卧室',
    room3: '寝室1',
    room4: '寝室2',
    room5: '家庭间',
    room6: '书房',
    room7: '厨房',
    room8: '饭厅',
    room9: '管家',
    room10: '更衣室',
    room11: '家庭房',
    room12 : '门厅',
    id: '输入ID',
    pw: '输入密码',
    pw_check: '密码确认',
    auto_login: '自动登录',
    login: '登录',
    search: '查找',
    find_title_id: '找回ID',
    find_title_pw: '查找密码',
    input_dong: '栋',
    input_ho: '号',
    access_key: '认证码',
    find_btn_id: '找回ID',
    find_btn_pw: '查找密码',
    to_login_page: '向登录画面移动',
    info_access: '认证码可在起居室<span>‘Wall Pad‘的</span><br><span>‘设定‘</span>画面确认。',
    info_getpw: '<span>发放密码时原有的密码将被删除,</span><br>登录后请变更。',
    get_temp_pw: '发放临时密码 ',
    login16: '检索的ID',
    btn_ok: '确认',
    info_get_temp_pw: '会员的临时密码为<br><span class="tempPassword"></span>。',

    home_menu_light : '照明',
    home_menu_wholelight : '整体熄灯开关',
    home_menu_heating : '供暖',
    home_menu_aircon : '冷气',
    home_menu_gas : '煤气',
    home_menu_standbypower : '备用权',
    home_menu_curtain : '窗帘',
    home_menu_vent : '通风',
    home_menu_maincost : '管理费',
    home_menu_telemetering : '计量器',
    home_menu_notice : '通知事项',
    home_menu_visitor : '来访者视频',
    home_menu_cctv : 'CCTV',
    home_menu_parcel : '快递',
    home_menu_electric : 'Electric<br>Car',
    home_menu_enterencecar : '入车通知',
    home_menu_emergency : '紧急清单',
    home_menu_parkposition : '停车位',
    home_menu_call : '电话',
    home_menu_callbell : '电话铃',
    home_menu_callbell_on : '打电话给贝尔通知',
    home_menu_callbell_off : '通过消息通知我',

    home_menu: [
        '',
        '冷气','A/S','电话','CCTV','窗帘',
        '현관카메라','紧急清单','入车通知','출입기록','煤气',
        '供暖','照明','停车位','管理费','通知事项',
        '快递','计量器','通风','来访者视频','三星智能家居',
        '整体熄灯开关','Smart Plug','Standby<br>Power','Electric<br>Car', '投票'],
    text_wholeLight_control : '整体熄灯开关 遥控', // 일괄소등 제어
    text_wholeLight_notice : '您要 <span class="popup_mode_sub_span">"放"</span> 整体熄灯开关?',
    control_mode: 'Control Mode',
    mode_vacant: '外出中',
    mode_occupied: '在家中',
    mode_sleep: '睡眠模式',
   
    submit: '适用',
    text_execution: '执行',
    cancel: '取消',
    today_weather: '今天的天气',
    now_temp: '当前气温',
    fd_normal: '细尘',
    fd_good: '微尘好',
    fd_bad: '微尘不好',
    fd_vary_bad: '微尘非常不好',
    telemegtering: '监控我家',
    now_value: '当前',
    setting_value: '设置',
    text_vacant: '外出',
    text_gas: '煤气',
    text_setting: 'Setting',
    text_account_info: '账户信息',
    text_app_info: '应用程序 信息',
    text_push_alrim: 'PUSH提示设定',
    text_use_call: '电话',
    text_logout_change_pw: '退出,变更密码',
    text_logout: '退出',
    text_change_pw: '变更密码',
    text_complex:'complex',
    text_dong: '栋',
    text_ho: '号',
    text_dongAndHo:'栋 & 号',
    text_id: 'ID',
    text_notice_account_info: '每台智能设备只能以1个账户登录。<br><br>如果你退出当前用户, 画面将会转换为登录画面 ',
    now_version: '当前版本',
    text_look : '查看',
    terms: '查看利用条款',
    privacy: '隐私政策',
    text_change_guard_mode: '外出(防范)模式时的自',
    text_enterance_car: '入车通知',
    text_notive_or_parcel: '新公告 / 有快递时',
    switch_on: 'ON',
    switch_off: 'OFF',
    btn_change: '变更',
    text_concent_title:'Standby Power',
    text_smartPlug_title:'Smart Plug',
    text_light: '照明',
    text_heating: '供暖',
    text_dimming: '调光',
    text_setTemp: '设定温度',
    text_nowTemp: '当前温度',
    text_now: '当前',
    text_tempSubmit: '适用设定温度',
    text_aircon: '冷气',
    text_setMode: '运转模式设定',
    text_setModeArray: ['制冷','除湿','送风','自动','取暖'],
    text_setWind: '风量设定',
    text_setWindArray1 : '微风',
    text_setWindArray2 : '中风',
    text_setWindArray3 : '强风',
    text_setWindArray4 : '自动',
    text_setWindArray: ['微风','中风','强风','自动'],
    text_gasClose: '煤气阀关闭!',
    text_gasOpen: '煤气阀打开!',
    text_gasNotice: '因安全上的原因, <span class="orange_text">只提供煤气阀锁定功能。</span>',
    text_curtain: '窗帘控制',
    text_curtainNotice: '只要稍微打开就会显示<span class="mainColorFont">"Open"。</span>',
    text_ventilator: '换气控制',
    text_kitchen_interlock : '厨房连锁',
    text_bathroom_interlock : '浴室联锁',
    text_maintcost: '管理费',
    text_year: '年',
    text_month: '月',
    text_won: '元',
    text_maintcost1: '住户管理费',
    text_maintcost2: '一般管理费',
    text_electCharges: '电费',
    text_waterCharges: '水费',
    text_heatingCharges: '暖气费',
    text_etc: '其他',
    text_compareLastMonth: '对比上个月',
    text_telemetering: '计量器',
    text_elect: '电气',
    text_water: '自来水',
    text_hotWater: '热水',
    text_telemeteringNotice: '各项目的远程抄表值表示累计的总使用量。',
    text_notice: '通知事项',
    text_visitor: '来访者视频',
    text_cctvName1: '住户玄关',
    text_cctvName2: '游乐场',
    text_cctvName3: '正门',
    text_cctvName4: '后门',
    text_cctvNotice: '3G/LTE<span>环境下可能会产生过多的数据费用,</span><br> 敬请留意。',
    text_parcel: '快递',
    text_parcel_arrive : '快递到达',
    text_parcel_reception : '顾客领取',
    text_enterCar: '入车通知',
    text_today: '今日',
    text_emergency: '紧急清单',
    text_emergency_gas: '煤气泄漏感应',
    text_emergency_emer: '发生紧急情况',
    text_emergency_in: '发生侵入情况',
    text_emergency_fire_escape: '发生避难梯情况',
    text_emergency_aid: '发生急救情况',
    text_emergency_fire: '发生火灾',
    text_emergency_safe: '发生保险箱警报',
    text_emergency_crime: '防范',
    text_emergency_alarm : '警报发生',

    location: '停车位',
    text_doorloack : '门锁',
    text_homemode_setting : '家庭模式设定',
    text_homemode : '家庭模式',
    text_homemode_exec : '运行家庭模式',
    text_homemode_popup : '您要运行<br/><span class="popup_mode_sub_span">家庭模式</span>吗?',
    text_elec_car : '电动车',
    text_charging_status : '充电状态',
    text_history_check : '履历查询',
    text_charger_status : '填充期现况',

    text_charge_start_time : '充电开始时间',
    text_charge_power_volume : '充电电量',
    text_estimated_charging_rate : '预期充值费',
    text_current_status : '现况',

    text_charge_date : '充电日',
    text_charger_name : '充电器名',
    text_estimated_rate : '预计费用',

    text_remaining_time : '剩余时间',

    text_charging_possible : '可充电',
    text_charging_standby : '充电待机',
    text_charging : '充电中',
    text_charging_err : '故障/错误',

    text_network_err : '网络精英',

    prev : '&#10094; 上一个清单',
    next : '下一个清单 &#10095;',
    text_light_on : '照明 ON',
    text_aircon_on : '冷气 ON',
    text_curtain_on : '窗帘控制 Open',
    text_heating_on : '供暖 ON',
    text_homemode_info : '不能同时设置冷却和加热.<br>当您回家时，只有客厅中的设备被打开（或打开)',

};

/**
 * setLanguage
 * use $.lang[currentLanguage][languageNumber]
 */

function setLanguage(currentLanguage) {
    console.log('setLanguage', arguments);
    console.log('currentLanguage', currentLanguage);
    if(currentLanguage == undefined || currentLanguage == 'kr'){
        currentLanguage = 'ko'
    }

    $('[data-langNum]').each(function() {
        var $this = $(this);
        $this.html($.lang[currentLanguage][$this.data('langnum')]);
    });
}


/**
 * getTitleCode
 * use getTitleCode(Title_String)
 */
function getTitleCode(_title){
    var result;
    switch(_title){
        case '거실' : result = 1 ;
            break;
        case '안방' : result = 2 ;
            break;
        case '침실1' : result = 3 ;
            break;
        case '침실2' : result = 4 ;
            break;
        case '가족실' : result = 5 ;
            break;
        case '서재' : result = 6 ;
            break;
        case '주방' : result = 7 ;
            break;
        case '식당' : result = 8 ;
            break;
        case '가사도우미' : result = 9 ;
            break;
        case '드레스룸' : result = 10 ;
            break;
        case '가족실' : result = 11 ;
            break;
        case '복도' : result = 12 ;
            break;
    }
    return 'room'+result;
}

function getTitleName(title){
    console.log('title : ', title)
    var result;
    var title_arr = title.split('-');
    console.log('title_arr : ', title_arr)
    switch(title_arr[0]){
        case '거실' : result = 1 ;
            break;
        case '안방' : result = 2 ;
            break;
        case '침실1' : result = 3 ;
            break;
        case '침실2' : result = 4 ;
            break;
        case '가족실' : result = 5 ;
            break;
        case '서재' : result = 6 ;
            break;
        case '주방' : result = 7 ;
            break;
        case '식당' : result = 8 ;
            break;
        case '가사도우미' : result = 9 ;
            break;
        case '드레스룸' : result = 10 ;
            break;
        case '가족실' : result = 11 ;
            break;
        case '복도' : result = 12 ;
            break;
    }
    var number = title_arr[1] === undefined ? '' : '-' + title_arr[1];
    var result = $.lang[parent.site_lang]['room'+result] + number;
    console.log('getTitleName result : ', result);
    if(result == undefined) result = title;

    if(result == 'undefined') result = title

    return result;
}


function getEmergency(title){
    let title_text = '';
    let result = '';
    var regExp = /[0-9]/;
    var number = '';
    if(regExp.test(title)){
        title_text = title.substring(0,2);
        number = title.substring(2,4);
    }else{
        title_text = title;
    }
    switch(title_text){
        case '가스' :  result =  $.lang[parent.site_lang]['text_emergency_gas']
            break;
        case '비상' : result =  $.lang[parent.site_lang]['text_emergency_emer']
            ;
            break;
        case '침입' :result =  $.lang[parent.site_lang]['text_emergency_in']
            break;
        case '피난사다리' :result =  $.lang[parent.site_lang]['text_emergency_fire_escape']
            break;
        case '구급' :  result =  $.lang[parent.site_lang]['text_emergency_aid']
            break;
        case '화재' :  result =  $.lang[parent.site_lang]['text_emergency_fire']
            break;
        case '금고' :  result =  $.lang[parent.site_lang]['text_emergency_safe']
            break;
        case '방범' : result = parent.site_lang != 'en' ?   $.lang[parent.site_lang]['text_emergency_crime'] + number + $.lang[parent.site_lang]['text_emergency_alarm'] : $.lang[parent.site_lang]['text_emergency_alarm'] + $.lang[parent.site_lang]['text_emergency_crime'] + number
            break;
    }
    console.log('result : ', result);
    if(result == undefined || result == 'undefined') result = title;
    return result;
}

function getParcel(title){
    switch(title){
        case '택배도착' :  result =  $.lang[parent.site_lang]['text_parcel_arrive']
            break;
        case '고객수령' : result =  $.lang[parent.site_lang]['text_parcel_reception']
            ;
            break;
    }
    console.log('result : ', result);
    if(result == undefined || result == 'undefined') result = title;
    return result;
}