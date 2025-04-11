

var checkbox = [0,0];
var checkbox_control = [0,0,0,0,0,0,0,0];
var ctr_mode = 1;
var isContentPage = false,nowPopupOpen=false;
var nowItem='',nowItemID='',nowKey='',nowControlMode;
var switchOnoff;
var deviceItemData;
var setting_alram = '<div id="btn_setting_mode_alram" class="btn_space_mode_style">'+
					'<div class="icon_mode_alram"></div>'+
					'<div class="setting_title">알람 설정</div>'+
					'<div  class="setting_btn_on btn_setting_style mainColorFont">설정 ≫</div>'+
					'</div>';

var setting_robot = '<div id="btn_setting_mode_robot" class="btn_space_mode_style">'+
					'<div class="icon_mode_robot"></div>'+
					'<div class="setting_title">청소 모드</div>'+
					'<div  class="setting_btn_on btn_setting_style mainColorFont">설정 ≫</div>'+
					'</div>';

var setting_aircon_mode = '<div id="btn_setting_mode_aircon_mode" class="btn_space_mode_style">'+
					'<div class="icon_mode_aircon_mode"></div>'+
					'<div class="setting_title">운전 모드</div>'+
					'<div  class="setting_btn_on btn_setting_style mainColorFont">설정 ≫</div>'+
					'</div>';

var setting_aircon_wind ='<div id="btn_setting_mode_aircon_wind" class="btn_space_mode_style">'+
					'<div class="icon_mode_aircon_wind"></div>'+
					'<div class="setting_title">바람 세기</div>'+
					'<div  class="setting_btn_on btn_setting_style mainColorFont">설정 ≫</div>'+
					'</div>';

var setting_air_purifier_wind ='<div id="btn_setting_mode_air_purifier_wind" class="btn_space_mode_style">'+
					'<div class="icon_mode_aircon_wind"></div>'+
					'<div class="setting_title">바람 세기</div>'+
					'<div  class="setting_btn_on btn_setting_style mainColorFont">설정 ≫</div>'+
					'</div>';

$("#btn_back").on("click", function(){
    $('#samsung').hide();
    disconnect();
});

$(".modal").on("click", function(){
    spinner_hide();
});


//소켓 클릭 이벤트
$( "#connect" ).click(function() { connect(); });
$( "#disconnect" ).click(function() { disconnect(); });
$( "#send" ).click(function() { sendName(); });


var jsoncallback = function(data){
	console.log(data);
};

$('#postCORS').click( function() {
	test();
	return;
	var json = {key:'all', code:'cvnet', data:'json'};
	var url = 'https://cvnetrndsh02.uasis.com:7713/getUserList';
	postCORS(url, JSON.stringify(json), function(data){
		console.log(data);
	});

	/*
	 $.ajax({
	 url:url,
	 data:JSON.stringify({key:'all', code:'cvnet', data:'json'}),
	 dataType: "json",
	 type : "post",
	 contentType : "application/json; charset=UTF-8",
	 success: function( data, textStatus, jqXHR )
	 {
	 alert('성공 - ' + data);
	 },
	 error: function( jqXHR, textStatus, errorThrown )
	 {
	 alert("조회 중 에러가 발생하였습니다.");
	 }
	 });
	 */
});

function test() {
	var data = {
		'key': 'all',
		'code': 'cvnet',
		'data': 'json'
		};

	$.ajax({
		url: 'https://cvnetrndsh02.uasis.com:7713/getUserList',
		type: "POST",
		data:JSON.stringify(data),
		contentType: 'application/json',
		success: function (data) {
			console.log("getUserList data : ", data);
		},
		error: function (xhr, status, error) {
			console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
			console.log("리스트 호출 에러!!!");
		}
	});
}

$('#getCORS_JSON').click( function() {
	getCORS('http://172.16.101.93:9000/list/json',null,function(data){
		console.log(data);
	});
});


/*
$.ajax({
	url: 'saveSimulationCaseHistory.do', // 요청 할 주소
	//async: false, // false 일 경우 동기 요청으로 변경
	type: 'POST', // GET, PUT
	cache: false,
	data:  {
		uuid : '5250179D-39F7-41D3-BDE8-000000000SIM',
		type : 'Dishwasher',
		description: 'My Dishwasher',
		caseHistoryName : caseHistoryName,
		connected : connected,
		'status' : jsonData,
		'Device' : jsonStatus,
	}, // 전송할 데이터
	dataType: 'json', // xml, json, script, html
	success: function(data) {
		if(data != null) {
			// Do somothing when data is not null
			snapshotCallback(data);
			$("#printJson").val("");
			$('.snapshot-val-default').val('Dishwasher_'+data.simulationCaseNowDate+'_'+data.simulationCaseListNextCount);
			$("#historyNameStr").val("");
		}
	}
});
*/

$('.checkbox_list').bind('touchend', function() {
    set_checkbox(this);
});

function samsung_control_dishwasher(_id,_type){
    nowItem = _type;
    $('#content_tab').show();
    $('.content_space_sub').html(
        '<div class="sub_group">'+
        '<div class="content_image_style dishwasher_main"></div>'+
        '<div id="washer" class="notice_content_space ctr_off">'+
        '<div class="notice_content">---</div>'+
        '<div class="timer_space">'+
        '<div class="timer_title">남은 시간</div>'+
        '<div class="timer">--:--:--</div>'+
        '</div>'+
        '</div></div>'+
        '<div class="content_btn_space_smart">' +
        '<div class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_operation(-1,1,\''+_id+'\',0)">동 작</div>'+
        '<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',0)">취 소</div>'+
        '</div>'

    );

    var output ='';
        output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
        output +='<div class="checkbox" data-icon-num="checkbox"></div>';
        output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
        output +='</div>';
        output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
        output +='<div class="checkbox" data-icon-num="checkbox"></div>';
        output +='<div id="checkbox_span2" class="checkbox_span">세탁 완료시</div>';
        output +='</div>';

    setAlrimPopup(output);
    $('#popup_alram').css('height','260px');
    $('.content_mode_space').html(setting_alram);
    isContentPage = true;

    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);
            if (deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].Configuration.remoteControlEnabled == false || deviceItemData[key].connected == false) {
                $('.notice_content').html('--');
                $('#washer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#washer .timer').html('--:--:--');
                countdown_stop('main');
                spinner_hide();
                return;
            }
           var remainingTime = (deviceItemData[key].Operation.remainingTime != undefined) ? deviceItemData[key].Operation.remainingTime : '00:00:00';

           if(deviceItemData[key].Operation.state == 'Pause'){
                $('#washer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#washer .timer').html(remainingTime);
                countdown_stop('main');
            }else if(deviceItemData[key].Operation.state == 'Ready') {
               $('#washer').removeClass('ctr_on').addClass('ctr_off');
               $('.btn_popup_ctr_on ').html('동작');
               $('#washer .timer').html('00:00:00');
               countdown_stop('main');
           }else if(deviceItemData[key].Operation.state == 'Run'){
                $('#washer').removeClass('ctr_off').addClass('ctr_on');
                $('.btn_popup_ctr_on ').html('일시정지');
                var minSec = getMinSec(remainingTime);
                countdown('#washer .timer', minSec ,'main');
            }
			$('.notice_content').html(getTextDishwasherMode(deviceItemData[key].Operation.state));
            init_btn_active_style(key);
        }

    }

}

function samsung_control_washer_dual(_id,_type){
    nowItem = _type;

    $('#content_tab').show();
    $('.content_btn_space').hide();
    $('.content_space_sub').html(
        '<div class="sub_group">'+
        '<div class="content_image_style washer_dual_main"></div>'+
        '<div id="washer_main" class="notice_content_space ctr_off">'+
        '<div class="notice_content">---</div>'+
        '<div class="timer_space">'+
        '<div class="timer_title">남은 시간</div>'+
        '<div class="timer">--:--:--</div>'+
        '</div></div>' +
		'</div>'+

		'<div class="content_btn_space_smart">' +
        '<div id="btn_control_main" class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_operation(-1,1,\''+_id+'\',0)">동 작</div>'+
        '<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',0)">취 소</div>'+
		'</div>'+

		'<div class="sub_group">'+
		'<div class="content_image_style washer_dual_sub"></div>'+
		'<div id="washer_sub" class="notice_content_space ctr_off">'+
		'<div class="notice_content">---</div>'+
		'<div class="timer_space">'+
		'<div class="timer_title">남은 시간</div>'+
		'<div class="timer">--:--:--</div>'+
		'</div></div>' +
		'</div>'+
		'<div class="content_btn_space_smart">' +
		'<div id="btn_control_sub" class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_operation(-1,1,\''+_id+'\',1)">동 작</div>'+
		'<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',1)">취 소</div>'+
		'</div>'

    );

    var output ='';
    output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
    output +='<div class="checkbox" data-icon-num="checkbox"></div>';
    output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
    output +='</div>';
    output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
    output +='<div class="checkbox" data-icon-num="checkbox"></div>';
    output +='<div id="checkbox_span2" class="checkbox_span">세탁 완료시</div>';
    output +='</div>';
    setAlrimPopup(output);

    $('#popup_alram').css('height','260px');
    $('.content_mode_space').html(setting_alram);
    isContentPage = true;

	console.log('#####deviceItemData:',deviceItemData);

    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){

            nowKey = key;

            setConnCondition(deviceItemData[key]);
            if (deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].Configuration.remoteControlEnabled == false || deviceItemData[key].connected == false) {
                $('#washer_main .notice_content').html('--');
                $('#washer_sub .notice_content').html('--');
                $('#washer_main').removeClass('ctr_on').addClass('ctr_off');
                $('#washer_sub').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_control_main ').html('동작');
                $('.btn_control_sub ').html('동작');
                $('#washer_main .timer').html('--:--:--');
                $('#washer_sub .timer').html('--:--:--');
                countdown_stop('main');
                countdown_stop('sub');
                spinner_hide();
                return;
            }
			var remainingTime_main = (deviceItemData[key].Operation.remainingTime != undefined) ? deviceItemData[key].Operation.remainingTime : '00:00:00';

			if(deviceItemData[key].Operation.state == 'Run'){
				notice_content = '세탁 중';
				$('#washer_main').removeClass('ctr_off').addClass('ctr_on');
				$('#btn_control_main ').html('일시정지');
				var minSec = getMinSec(remainingTime_main);
				countdown('#washer_main .timer', minSec,'main');

			}else if(deviceItemData[key].Operation.state == 'Pause'){
				notice_content = '일시정지';
				$('#washer_main').removeClass('ctr_on').addClass('ctr_off');
				$('#btn_control_main ').html('동작');

				$('#washer_main .timer').html(remainingTime_main);
				countdown_stop('main');
			}else if(deviceItemData[key].Operation.state == 'Ready'){
				notice_content = 'OFF';
				$('#washer_main').removeClass('ctr_on').addClass('ctr_off');
				$('#btn_control_main ').html('동작');
				$('#washer_main .timer').html('00:00:00');
				countdown_stop('main');
			}

			$('#washer_main .notice_content').html(notice_content);

			if(deviceItemData[key].SubDevices != undefined){

                var remainingTime_sub = (deviceItemData[key].SubDevices[0].Operation.remainingTime != undefined) ? deviceItemData[key].SubDevices[0].Operation.remainingTime : '00:00:00';

                if(deviceItemData[key].SubDevices[0].Operation.state == 'Run'){
                    notice_content = '세탁 중';
                    $('#washer_sub').removeClass('ctr_off').addClass('ctr_on');
                    $('#btn_control_sub ').html('일시정지');
                    var minSec = getMinSec(remainingTime_sub);
                    countdown('#washer_sub .timer', minSec,'sub');
                }else if(deviceItemData[key].SubDevices[0].Operation.state == 'Pause'){
                    notice_content = '일시정지';
                    $('#washer_sub').removeClass('ctr_on').addClass('ctr_off');
                    $('#btn_control_sub ').html('동작');

                    $('#washer_sub .timer').html(remainingTime_sub);
                    countdown_stop('sub');
                }else if(deviceItemData[key].SubDevices[0].Operation.state == 'Ready'){
                    notice_content = 'OFF';
                    $('#washer_sub').removeClass('ctr_on').addClass('ctr_off');
                    $('#btn_control_sub ').html('동작');
                    $('#washer_sub .timer').html('00:00:00');
                    countdown_stop('sub');
                }
                $('#washer_sub .notice_content').html(notice_content);
			}
            init_btn_active_style(key);
        }
    }
}

function samsung_control_washer(_id,_type){
    nowItem = _type;

	$('#content_tab').show();
    $('.content_btn_space').hide();
	$('.content_space_sub').html(
		'<div class="sub_group">'+
		'<div class="content_image_style washer"></div>'+
		'<div id="washer" class="notice_content_space ctr_off">'+
			'<div class="notice_content">---</div>'+
			'<div class="timer_space">'+
			'<div class="timer_title">남은 시간</div>'+
			'<div class="timer">--:--:--</div>'+
		'</div>'+
		'</div></div>'+

        '<div class="content_btn_space_smart">' +
        '<div class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_operation(-1,1,\''+_id+'\',0)">동 작</div>'+
        '<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',0)">취 소</div>'+
        '</div>'
	);

	var output ='';
		output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
		output +='<div class="checkbox" data-icon-num="checkbox"></div>';
		output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
		output +='</div>';
		output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
		output +='<div class="checkbox" data-icon-num="checkbox"></div>';
		output +='<div id="checkbox_span2" class="checkbox_span">세탁 완료시</div>';
		output +='</div>';
	setAlrimPopup(output);

	$('#popup_alram').css('height','260px');
	$('.content_mode_space').html(setting_alram);
	isContentPage = true;

    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id) {
            nowKey = key;
            setConnCondition(deviceItemData[key]);

            if (deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].Configuration.remoteControlEnabled == false  || deviceItemData[key].connected == false) {
                $('.notice_content').html('--');
                $('#washer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#washer .timer').html('--:--:--');
                countdown_stop('main');
                spinner_hide();
                return;
            }
            var remainingTime = (deviceItemData[key].Operation.remainingTime != undefined) ? deviceItemData[key].Operation.remainingTime : '00:00:00';
            if (deviceItemData[key].Operation.state == 'Run') {
                notice_content = '세탁 중';
                $('#washer').removeClass('ctr_off').addClass('ctr_on');
                $('.btn_popup_ctr_on ').html('일시정지');
                var minSec = getMinSec(remainingTime);
                countdown('#washer .timer', minSec, 'main');
            } else if (deviceItemData[key].Operation.state == 'Pause') {
                notice_content = '일시정지';
                $('#washer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#washer .timer').html(remainingTime);
                countdown_stop('main');
            } else if (deviceItemData[key].Operation.state == 'Ready') {
                notice_content = 'OFF';
                $('#washer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#washer .timer').html('00:00:00');
                countdown_stop('main');
            }

            $('.notice_content').html(notice_content);
            init_btn_active_style(key);
        }
    }
}

function samsung_control_dryer_dual(_id,_type){
    nowItem = _type;
    $('#content_tab').show();
    $('.content_btn_space').hide();
    $('.content_space_sub').html(
        '<div class="sub_group">'+
        '<div class="content_image_style dryer_dual_main"></div>'+
        '<div id="dryer_main" class="notice_content_space ctr_off">'+
        '<div class="notice_content">---</div>'+
        '<div class="timer_space">'+
        '<div class="timer_title">남은 시간</div>'+
        '<div class="timer">--:--:--</div>'+
        '</div>'+
        '</div></div>'+
		'<div class="content_btn_space_smart">' +
        '<div id="btn_control_main" class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_operation(-1,1,\''+_id+'\',0)">동 작</div>'+
        '<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',0)">취 소</div>'+
		'</div>'+

		'<div class="sub_group">'+
		'<div class="content_image_style dryer_dual_sub"></div>'+
		'<div id="dryer_sub" class="notice_content_space ctr_off">'+
		'<div class="notice_content">---</div>'+
		'<div class="timer_space">'+
		'<div class="timer_title">남은 시간</div>'+
		'<div class="timer">--:--:--</div>'+
		'</div>'+
		'</div></div>'+
		'<div class="content_btn_space_smart">' +
		'<div id="btn_control_sub" class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_operation(-1,1,\''+_id+'\',1)">동 작</div>'+
		'<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',1)">취 소</div>'+
		'</div>'
    );

    var output ='';
		output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
		output +='<div class="checkbox" data-icon-num="checkbox"></div>';
		output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
		output +='</div>';
		output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
		output +='<div class="checkbox" data-icon-num="checkbox"></div>';
		output +='<div id="checkbox_span2" class="checkbox_span">건조 완료시</div>';
		output +='</div>';
    setAlrimPopup(output);

    $('#popup_alram').css('height','260px');
    $('.content_mode_space').html(setting_alram);
    isContentPage = true;

    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);
            if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].Configuration.remoteControlEnabled == false || deviceItemData[key].connected == false){
                $('#dryer_main').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_control_main ').html('동작');
                $('#dryer_main .timer').html('--:--:--');
                $('#dryer_sub').removeClass('ctr_on').addClass('ctr_off');
                $('#btn_control_sub ').html('동작');
                $('#dryer_sub .timer').html('--:--:--');
                countdown_stop('main');
                countdown_stop('sub');
                $('#dryer_main .notice_content').html('--');
                $('#dryer_sub .notice_content').html('--');
                spinner_hide();
                return;
            }
            var remainingTime_main = (deviceItemData[key].Operation.remainingTime != undefined) ? deviceItemData[key].Operation.remainingTime : '00:00:00';

            if(deviceItemData[key].Operation.state == 'Run'){
                notice_content = '건조중';
                $('#dryer_main').removeClass('ctr_off').addClass('ctr_on');
                $('#btn_control_main ').html('일시정지');
                var minSec = getMinSec(remainingTime_main);
                countdown('#dryer_main .timer', minSec ,'main');
            }else if(deviceItemData[key].Operation.state == 'Pause'){
                notice_content = '일시정지';
                $('#dryer_main').removeClass('ctr_on').addClass('ctr_off');
                $('#btn_control_main ').html('동작');
                $('#dryer_main .timer').html(remainingTime_main);
                countdown_stop('main');
            }else if(deviceItemData[key].Operation.state == 'Ready'){
                notice_content = 'OFF';
                $('#dryer_main').removeClass('ctr_on').addClass('ctr_off');
                $('#btn_control_main ').html('동작');
                $('#dryer_main .timer').html('00:00:00');
                countdown_stop('main');
            }
            $('#dryer_main .notice_content').html(notice_content);


            if(deviceItemData[key].SubDevices != undefined){
                var remainingTime_sub = (deviceItemData[key].SubDevices[0].Operation.remainingTime != undefined) ? deviceItemData[key].SubDevices[0].Operation.remainingTime : '00:00:00';
                if(deviceItemData[key].SubDevices[0].Operation.state == 'Run'){
                    notice_content = '건조중';
                    $('#dryer_sub').removeClass('ctr_off').addClass('ctr_on');
                    $('#btn_control_sub').html('일시정지');
                    var minSec = getMinSec(remainingTime_sub);
                    countdown('#dryer_sub .timer', minSec,'sub');
                }else if(deviceItemData[key].SubDevices[0].Operation.state == 'Pause'){
                    notice_content = '일시정지';
                    $('#dryer_sub').removeClass('ctr_on').addClass('ctr_off');
                    $('#btn_control_sub ').html('동작');

                    $('#dryer_sub .timer').html(remainingTime_sub);
                    countdown_stop('sub');
                }else if(deviceItemData[key].SubDevices[0].Operation.state == 'Ready'){
                    notice_content = 'OFF';
                    $('#dryer_sub').removeClass('ctr_on').addClass('ctr_off');
                    $('#btn_control_sub ').html('동작');
                    $('#dryer_sub .timer').html('00:00:00');
                    countdown_stop('sub');
                }
                $('#dryer_sub .notice_content').html(notice_content);

            }
            init_btn_active_style(key);

        }

    }
}

function samsung_control_dryer(_id,_type){
    nowItem = _type;
	$('#content_tab').show();
    $('.content_btn_space').hide();
	$('.content_space_sub').html(
		'<div class="sub_group">'+
		'<div class="content_image_style dryer"></div>'+
		'<div id="dryer" class="notice_content_space ctr_off">'+
		'<div class="notice_content">---</div>'+
		'<div class="timer_space">'+
		'<div class="timer_title">남은 시간</div>'+
		'<div class="timer">--:--:--</div>'+
		'</div>'+
		'</div></div>'+
        '<div class="content_btn_space_smart">' +
        '<div class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_operation(-1,1,\''+_id+'\',0)">동 작</div>'+
        '<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',0)">취 소</div>'+
        '</div>'
	);

	var output ='';
	output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
	output +='<div class="checkbox" data-icon-num="checkbox"></div>';
	output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
	output +='</div>';
	output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
	output +='<div class="checkbox" data-icon-num="checkbox"></div>';
	output +='<div id="checkbox_span2" class="checkbox_span">건조 완료시</div>';
	output +='</div>';
	setAlrimPopup(output);

	$('#popup_alram').css('height','260px');
	$('.content_mode_space').html(setting_alram);
	isContentPage = true;

    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);
            if (deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].Configuration.remoteControlEnabled == false || deviceItemData[key].connected == false) {
                $('#dryer .notice_content').html('--');
                $('#dryer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#dryer .timer').html('--:--:--');
                countdown_stop('main');
                spinner_hide();
                return;
            }

            var remainingTime = (deviceItemData[key].Operation.remainingTime != undefined) ? deviceItemData[key].Operation.remainingTime : '00:00:00';
            if(deviceItemData[key].Operation.state == 'Run'){
                notice_content = '건조중';
                $('#dryer').removeClass('ctr_off').addClass('ctr_on');
                $('.btn_popup_ctr_on ').html('일시정지');
                var minSec = getMinSec(remainingTime);
                countdown('#dryer .timer', minSec ,'main');
            }else if(deviceItemData[key].Operation.state == 'Pause'){
                notice_content = '일시정지';
                $('#dryer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#dryer .timer').html(remainingTime);
                countdown_stop('main');
            }else if(deviceItemData[key].Operation.state == 'Ready'){
                notice_content = 'OFF';
                $('#dryer').removeClass('ctr_on').addClass('ctr_off');
                $('.btn_popup_ctr_on ').html('동작');
                $('#dryer .timer').html('00:00:00');
                countdown_stop('main');
            }

            init_btn_active_style(key);
            $('#dryer .notice_content').html(notice_content);


        }

    }
}

function samsung_control_oven(_id,_type){

    nowItem = _type;
	$('#content_tab').show();
    $('.content_btn_space').hide();
	$('.content_btn_space').html('');

	$('.content_space_sub').html(
		'<div class="sub_group">'+
			'<div class="content_image_style oven">Main</div>'+
			'<div id="btn_oven_stop_main" class="btn_oven_stop btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',0)">가열 중지</div>'+
			'<div id="oven_main" class="notice_content_space ctr_off">'+
				'<div class="notice_content">---</div>'+
				'<div class="timer_space">'+
				'<div class="timer_title">남은 시간</div>'+
				'<div class="timer">--:--:--</div>'+
				'<div class="set_temp">설정온도 <span>--</span></div>'+
				'</div>'+
			'</div>' +
		'</div>'+
	'<div class="sub_group" style="margin-bottom: 20px;">'+
	'<div class="content_image_style oven">Sub</div>'+
	'<div id="btn_oven_stop_sub" class="btn_oven_stop btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',1)">가열 중지</div>'+
	'<div id="oven_sub" class="notice_content_space ctr_off">'+
	'<div class="notice_content">---</div>'+
	'<div class="timer_space">'+
	'<div class="timer_title">남은 시간</div>'+
	'<div class="timer">--:--:--</div>'+
	'<div class="set_temp">설정온도 <span>--</span></div>'+
	'</div>'+
	'</div>' +
	'</div>'
	);

	var output ='';
        output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
        output +='<div class="checkbox" data-icon-num="checkbox"></div>';
        output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
        output +='</div>';
        output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
        output +='<div class="checkbox" data-icon-num="checkbox"></div>';
        output +='<div id="checkbox_span2" class="checkbox_span">조리 완료시</div>';
        output +='</div>';
	setAlrimPopup(output);

	$('#popup_alram').css('height','260px');
	$('.content_mode_space').html(setting_alram);

	isContentPage = true;
    countdown_stop('sub');
    countdown_stop('main');
    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey=key;
            setConnCondition(deviceItemData[key]);
            if (deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) {
                $('#oven_main .notice_content').html('--');
                $('#oven_sub .notice_content').html('--');
                $('#oven_main').removeClass('ctr_on').addClass('ctr_off');
                $('#oven_sub').removeClass('ctr_on').addClass('ctr_off');
                $('#btn_oven_stop_main').hide();
                $('#btn_oven_stop_sub').hide();
                $('#oven_main .timer').html('--:--:--');
                $('#oven_sub .timer').html('--:--:--');
                countdown_stop('main');
                countdown_stop('sub');
                spinner_hide();
                return;
            }

            var remainingTime = (deviceItemData[key].Operation.remainingTime != undefined) ? deviceItemData[key].Operation.remainingTime : '00:00:00';
            var minSec = getMinSec(remainingTime);
            if(deviceItemData[key].Operation.state == 'Run'){
                $('#oven_main').removeClass('ctr_off').addClass('ctr_on');
                $('#btn_oven_stop_main').show();
                countdown('#oven_main .timer', minSec ,'main');

            }else if(deviceItemData[key].Operation.state == 'Ready'){
                countdown_stop('main');
                $('#oven_main .timer').html('00:00:00');
                $('#oven_main').removeClass('ctr_on').addClass('ctr_off');
                $('#btn_oven_stop_main').hide();

            }
            $('#oven_main .set_temp span').html(deviceItemData[key].Temperatures[0].desired+'℃');
            $('#oven_main .notice_content').html(getTextOven(deviceItemData[key].Operation.state));

            if(deviceItemData[key].SubDevices != undefined){
                var remainingTime_sub = (deviceItemData[key].SubDevices[0].Operation.remainingTime != undefined) ? deviceItemData[key].SubDevices[0].Operation.remainingTime : '00:00:00';
                var minSec = getMinSec(remainingTime_sub);
                if(deviceItemData[key].SubDevices[0].Operation.state == 'Run'){
                    countdown('#oven_sub .timer', minSec ,'sub');
                    $('#oven_sub').removeClass('ctr_off').addClass('ctr_on');
                    $('#btn_oven_stop_sub').show();
                }else if(deviceItemData[key].SubDevices[0].Operation.state == 'Ready'){
                    countdown_stop('sub');
                    $('#oven_sub .timer').html('00:00:00');
                    $('#oven_sub').removeClass('ctr_on').addClass('ctr_off');
                    $('#btn_oven_stop_sub').hide();
                }
                $('#oven_sub .set_temp span').html(deviceItemData[key].SubDevices[0].Temperatures[0].desired+'℃');
                $('#oven_sub .notice_content').html(getTextOven(deviceItemData[key].SubDevices[0].Operation.state));
            }
            init_btn_active_style(key);
        }
    }
}


function samsung_control_gas(_id,_type){
    nowItem = _type;
	$('#content_tab').show();
    $('.content_btn_space').hide();
	$('.content_btn_space').html('');

	$('.content_space_sub').html(
		'<div class="sub_group">'+
		'<div class="content_image_style gas_main"></div>'+
		'<div id="btn_gas_stop_main" class="btn_oven_stop btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',0)">가열 중지</div>'+
		'<div id="gas_main" class="notice_content_space ctr_off">'+
		'<div class="notice_content">---</div>'+
		'<div class="timer_space">'+
		'<div class="timer_title">남은 시간</div>'+
		'<div class="timer">--:--:--</div>'+
		'<div class="set_temp">설정온도 <span>--</span></div>'+
		'</div>'+
		'</div>' +
		'</div>'+
		'<div class="sub_group" style="margin-bottom: 20px;">'+
		'<div class="content_image_style gas_sub"></div>'+
		'<div id="btn_gas_stop_sub" class="btn_oven_stop btnStyle btnSubColor" onclick="item_control_operation(-1,0,\''+_id+'\',1)">가열 중지</div>'+
		'<div id="gas_sub" class="notice_content_space ctr_off">'+
		'<div class="notice_content">---</div>'+
		'<div class="timer_space">'+
		'<div class="timer_title">남은 시간</div>'+
		'<div class="timer">--:--:--</div>'+
		'<div class="set_temp">설정온도 <span>--</span></div>'+
		'</div>'+
		'</div>' +
		'</div>'
	);

	var output ='';
	output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
	output +='<div class="checkbox" data-icon-num="checkbox"></div>';
	output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
	output +='</div>';
	output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
	output +='<div class="checkbox" data-icon-num="checkbox"></div>';
	output +='<div id="checkbox_span2" class="checkbox_span">조리 완료시</div>';
	output +='</div>';
	setAlrimPopup(output);

	$('#popup_alram').css('height','260px');
	$('.content_mode_space').html(setting_alram);
	isContentPage = true;

    countdown_stop('sub');
    countdown_stop('main');
    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);
            if (deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) {
                $('#gas_main .notice_content').html('--');
                $('#gas_sub .notice_content').html('--');
                $('#gas_main .set_temp span').html('--');
                $('#gas_sub .set_temp span').html('--');
                $('#gas_main .timer').html('--:--:--');
                $('#gas_sub .timer').html('--:--:--');
                $('#gas_main').removeClass('ctr_on').addClass('ctr_off');
                $('#gas_sub').removeClass('ctr_on').addClass('ctr_off');
                $('#btn_gas_stop_main').hide();
                $('#btn_gas_stop_sub').hide();

                countdown_stop('main');
                countdown_stop('sub');
                spinner_hide();
                return;
            }
            var remainingTime = (deviceItemData[key].Operation.remainingTime != undefined) ? deviceItemData[key].Operation.remainingTime : '00:00:00';
            var minSec = getMinSec(remainingTime);
            if(deviceItemData[key].Operation.state == 'Run'){
                $('#gas_main').removeClass('ctr_off').addClass('ctr_on');
                $('#btn_gas_stop_main').show();
                countdown('#gas_main .timer', minSec ,'main');
            }else if(deviceItemData[key].Operation.state == 'Ready'){
                countdown_stop('main');
                $('#gas_main .timer').html('00:00:00');
                $('#gas_main').removeClass('ctr_on').addClass('ctr_off');
                $('#btn_gas_stop_main').hide();
            }
            $('#gas_main .set_temp span').html(deviceItemData[key].Temperatures[0].desired+'℃');
            $('#gas_main .notice_content').html(getTextOven(deviceItemData[key].Operation.state));

            if(deviceItemData[key].SubDevices != undefined){

                var remainingTime_sub = (deviceItemData[key].SubDevices[0].Operation.remainingTime != undefined) ? deviceItemData[key].SubDevices[0].Operation.remainingTime : '00:00:00';
                var minSec = getMinSec(remainingTime_sub);
                if(deviceItemData[key].SubDevices[0].Operation.state == 'Run'){
                    countdown('#gas_sub .timer', minSec ,'sub');
                    $('#gas_sub').removeClass('ctr_off').addClass('ctr_on');
                    $('#btn_gas_stop_sub').show();
                }else if(deviceItemData[key].SubDevices[0].Operation.state == 'Ready'){
                    countdown_stop('sub');
                    $('#gas_sub .timer').html('00:00:00');
                    $('#gas_sub').removeClass('ctr_on').addClass('ctr_off');
                    $('#btn_gas_stop_sub').hide();
                }
                $('#gas_sub .set_temp span').html(deviceItemData[key].SubDevices[0].Temperatures[0].desired+'℃');
                $('#gas_sub .notice_content').html(getTextOven(deviceItemData[key].SubDevices[0].Operation.state));

            }

            init_btn_active_style(key);

        }

    }

}

function samsung_control_robot(_id,_type){
	nowItem = 'Robot_Cleaner';
    nowControlMode = 'mode';
    nowItemID = _id;

	$('#content_tab').show();
	$('.content_btn_space').hide();

	$('.content_btn_space').html('');
	$('.content_space_sub').html(
		'<div class="sub_group">'+
		'<div id="robot" class="notice_content_space ctr_off">'+
		'<div class="condition con_on"></div>'+
        '<div class="content_image_style robot"></div>'+
		'<div class="robot_btn_space">'+
        '<div class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_mode(\''+_id+'\',1)">청소 시작</div>'+
        '<div class="btn_popup_ctr_off btnStyle btnSubColor" onclick="item_control_mode(\''+_id+'\',0)">청소 중지</div>'+

        '</div>'+
		'</div></div>'
	);

	$('.content_mode_space').html(setting_robot+setting_alram);
	isContentPage = true;

    for(var key in deviceItemData) {

        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);
            if (deviceItemData[key].connected == false) {
                $('.condition').html('--');
                $('.condition').removeClass('con_on').addClass('con_off');
                $('.robot_btn_space').hide();
                spinner_hide();
                return;
            }


            $('.condition').html(getTextRobotMode(deviceItemData[key].Mode.modes));
            init_btn_active_style(key);

            var tempMode = deviceItemData[key].Mode.modes;
            for(var key2 in tempMode) {
                if( tempMode[key2] == 'Control_Cleaning' || tempMode[key2] == 'Cleaning_Auto' || tempMode[key2] == 'Cleaning_Repeat' || tempMode[key2] == 'Control_After' || tempMode[key2] == 'Control_Point'){
                    $('.condition').removeClass('con_off').addClass('con_on');
                    $('.btn_popup_ctr_off').show();
                    $('.btn_popup_ctr_on').hide();
                }else if(tempMode[key2] == 'Control_Homing' || tempMode[key2] =='Control_Charging'){
                    $('.condition').removeClass('con_on').addClass('con_off');
                    $('.btn_popup_ctr_off').hide();
                    $('.btn_popup_ctr_on').show();
                    return;
                }else{
                    $('.condition').removeClass('con_off').addClass('con_on');
                    $('.btn_popup_ctr_off').show();
                    $('.btn_popup_ctr_on').hide();
                }
            }

            $('#btn_setting_mode_robot .setting_btn_on').html(getTextRobotCleaningMode(deviceItemData[key].Mode.modes)+' ≫');
        }
    }

}





function samsung_control_refrigerator(_id,_type){
    nowItem = _type;
	$('#content_tab').show();
    $('.content_btn_space').hide();
	$('.content_btn_space').html('');
	$('.content_space_sub').html(
		'<div class="sub_group" style="height:400px">'+
		'<div class="content_image_style refrigerator"></div>'+
		'<div id="refrigerator" class="notice_content_space ctr_off">'+
			'<div id="Freezer"  class="notice_content">' +
				'<div class="title">냉동실</div>' +
				'<div class="value value_on">-18℃</div>' +
				'<div class="notice_group">' +
					'<div class="notice_door notice_style door_off">문상태</div>' +
					'<div class="space"></div>' +
					'<div class="notice_mode notice_style control_mode_off">냉동모드</div>' +
				'</div>' +
                '<div class="btn_refrigerator_space"></div>'+
                '<div id="btn_Freezer" class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_fridge(\''+_id+'\',1)">급속 냉동</div>'+
			'</div>'+
			'<div id="Fridge" class="notice_content">' +
				'<div class="title">냉장실</div>' +
				'<div class="value value_on">-4℃</div>' +
				'<div class="notice_group">' +
					'<div class="notice_door notice_style door_off">문상태</div>' +
					'<div class="space"></div>' +
					'<div class="notice_mode notice_style control_mode_off">급속냉장</div>' +
				'</div>' +
                '<div class="btn_refrigerator_space"></div>'+
                '<div id="btn_Fridge" class="btn_popup_ctr_on btnStyle btnMainColor" onclick="item_control_fridge(\''+_id+'\',0)">급속 냉장</div>'+
			'</div>'+
		'</div></div>'
	);

	var output = '';
	var mode_washer_alrim_title =['냉동실 문열림 시','냉동실 고온시','냉동실 필터 교체 알람','냉동실 이상 진단시','냉장실 문열림 시','냉장실 고온시','냉장실 필터 교체 알람','냉장실 이상 진단시'];

	for(var i = 0; i < 8; i++){
		output += '<div id="lang_checkbox_'+i+'" class="checkbox_list ckeckbox_off">';
		output += '<div class="checkbox" data-icon-num="checkbox"></div>';
		output += '<div id="checkbox_span'+i+'" class="checkbox_span">'+mode_washer_alrim_title[i]+'</div>';
		output += '</div>';
	}
	setAlrimPopup(output);

	$('#popup_alram').css('height','525px');
	$('.checkbox_list').css('margin-left','40px');
	$('.content_mode_space').html(setting_alram);
	isContentPage = true;

    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);
            if (deviceItemData[key].connected == false) {
                $('#Freezer .value').html('--');
                $('#Fridge .value').html('--');
                $('#Freezer .value').removeClass('value_on').addClass('value_off');
                $('#Fridge .value').removeClass('value_on').addClass('value_off');
                $('#Freezer .notice_door').html('문상태');
                $('#Freezer .notice_door').removeClass('door_on').addClass('door_off');
                $('#Fridge .notice_door').html('문상태');
                $('#Fridge .notice_door').removeClass('door_on').addClass('door_off');
                $('#Freezer .notice_mode').html('냉동모드');
                $('#Freezer .notice_mode').removeClass('control_mode_on').addClass('control_mode_off');
                $('#Fridge .notice_mode').html('냉장모드');
                $('#Fridge .notice_mode').removeClass('control_mode_on').addClass('control_mode_off');
                $('.robot_btn_space').hide();
                spinner_hide();
                return;
            }

            //냉동실 온도
            $('#Freezer .value').html(deviceItemData[key].Temperatures[0].desired+'℃');
            //냉장실 온도
            $('#Fridge .value').html(deviceItemData[key].Temperatures[1].desired+'℃');

            //console.log(deviceItemData[key].Wind.speedLevel);
			if(deviceItemData[key].Doors[0].openState == 'Close'){
                $('#Freezer .notice_door').html('문닫힘');
                $('#Freezer .notice_door').removeClass('door_on').addClass('door_off');
			}else if(deviceItemData[key].Doors[0].openState == 'Open'){
                $('#Freezer .notice_door').html('문열림');
                $('#Freezer .notice_door').removeClass('door_off').addClass('door_on');
			}else{
                $('#Freezer .notice_door').html('문상태');
                $('#Freezer .notice_door').removeClass('door_on').addClass('door_off');
			}

            if(deviceItemData[key].Doors[1].openState == 'Close'){
                $('#Fridge .notice_door').html('문닫힘');
                $('#Fridge .notice_door').removeClass('door_on').addClass('door_off');
            }else if(deviceItemData[key].Doors[1].openState == 'Open'){
                $('#Fridge .notice_door').html('문열림');
                $('#Fridge .notice_door').removeClass('door_off').addClass('door_on');
            }else{
                $('#Fridge .notice_door').html('문상태');
                $('#Fridge .notice_door').removeClass('door_on').addClass('door_off');
            }

            if(deviceItemData[key].Fridge.rapidFreezing == 'On'){
                $('#Freezer .notice_mode').html('급속냉동');
                $('#Freezer .notice_mode').removeClass('control_mode_off').addClass('control_mode_on');
                $('#btn_Freezer').html('냉동모드');

            }else if(deviceItemData[key].Doors[0].openState == 'Off'){
                $('#Freezer .notice_mode').html('급속냉동');
                $('#Freezer .notice_mode').removeClass('control_mode_on').addClass('control_mode_off');
            }else{
                $('#Freezer .notice_mode').html('냉동모드');
                $('#Freezer .notice_mode').removeClass('control_mode_on').addClass('control_mode_off');
                $('#btn_Freezer').html('급속냉동');
            }

            if(deviceItemData[key].Fridge.rapidFridge == 'On'){
                $('#Fridge .notice_mode').html('급속냉장');
                $('#Fridge .notice_mode').removeClass('control_mode_off').addClass('control_mode_on');
                $('#btn_Fridge').html('냉장모드');
            }else if(deviceItemData[key].Doors[0].openState == 'Off'){
                $('#Fridge .notice_mode').html('급속냉장');
                $('#Fridge .notice_mode').removeClass('control_mode_on').addClass('control_mode_off');
            }else{
                $('#Fridge .notice_mode').html('냉장모드');
                $('#Fridge .notice_mode').removeClass('control_mode_on').addClass('control_mode_off');
                $('#btn_Fridge').html('급속냉장');
            }


            init_btn_active_style(key);
        }

    }





}

function samsung_control_airclener(_id,_type){
	nowItem = _type;
    nowItemID = _id;
	$('#content_tab').show();
	$('.content_btn_space').show();
	$('.content_btn_space').html(
		'<div class="switch_space">'+
		'<input id="switch" type="checkbox" name="check-1" value="1" class="lcs_check" autocomplete="OFF" />'+
		'</div>'
	);

	$('.content_space_sub').html(
		'<div class="sub_group">'+
		'<div class="content_image_style airclener"></div>'+
		'<div id="airclener" class="notice_content_space ctr_off">'+
		'<div class="condition con_on">' +
		'<div class="con_group1">' +
			'<div class="dust_value_group">' +
				'<div class="dust_title">미세먼지</div>' +
				'<div class="dust_value mainColorFont">0㎍/㎥</div>' +
			'</div>' +
			'<div class="dust_value_icon_group">' +
				'<div class="dust_icon_value">' +
					'<div id="dust_level1" class="value_level" ></div>' +
					'<div id="dust_level2" class="value_level"></div>' +
					'<div id="dust_level3" class="value_level"></div>' +
					'<div id="dust_level4" class="value_level"></div>' +
					'<div id="dust_level5" class="value_level"></div>' +
				'</div>' +
				'<div class="dust_icon_group">' +
					'<div class="dust_icon level1"></div>' +
					'<div class="dust_icon level2"></div>' +
					'<div class="dust_icon level3"></div>' +
					'<div class="dust_icon level4"></div>' +
					'<div class="dust_icon level5"></div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="con_group2">' +
		'<div class="dust_value_group">' +
		'<div class="dust_title">초미세먼지</div>' +
		'<div class="dust_value mainColorFont">0㎍/㎥</div>' +
		'</div>' +
		'<div class="dust_value_icon_group">' +
		'<div class="dust_icon_value">' +
		'<div id="dust_level1" class="value_level" ></div>' +
		'<div id="dust_level2" class="value_level" ></div>' +
		'<div id="dust_level3" class="value_level"></div>' +
		'<div id="dust_level4" class="value_level"></div>' +
		'<div id="dust_level5" class="value_level" ></div>' +
		'</div>' +
		'<div class="dust_icon_group">' +
		'<div class="dust_icon level1"></div>' +
		'<div class="dust_icon level2"></div>' +
		'<div class="dust_icon level3"></div>' +
		'<div class="dust_icon level4"></div>' +
		'<div class="dust_icon level5"></div>' +
		'</div>' +
		'</div>' +
		'</div>' +

		'</div>'+
		'</div></div>'

	);


	$('.checkbox_list').css('margin-left','60px');
    var output ='';
    output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
    output +='<div class="checkbox" data-icon-num="checkbox"></div>';
    output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
    output +='</div>';
    setAlrimPopup(output);
    switchBoxInit();
	$('.content_mode_space').html(setting_air_purifier_wind+setting_alram);
	isContentPage = true;


    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);

            if(!deviceItemData[key].connected){
                $('.con_group1 .dust_value').html('--㎍/㎥');
                $('.con_group2 .dust_value').html('--㎍/㎥');
                $('#btn_setting_mode_air_purifier_wind .setting_btn_on').html('설정 ≫');
                $('.switch_space').hide();
                spinner_hide();
                return;
            }else{
                $('.switch_space').show();
            }

            if(deviceItemData[key].Operation.power == 'On'){
                $('input').lcs_on();
            }else{
                $('input').lcs_off();
            }

            //미세먼지
            $('.con_group1 .dust_value').html(deviceItemData[key].Sensors[0].values[0]+'㎍/㎥');
            $('.con_group1 #dust_level'+deviceItemData[key].Sensors[0].values[1]).attr('data-icon-num',"checkbox");
            //초미세먼지
            $('.con_group2 .dust_value').html(deviceItemData[key].Sensors[1].values[0]+'㎍/㎥');
            $('.con_group2 #dust_level'+deviceItemData[key].Sensors[1].values[1]).attr('data-icon-num',"checkbox");
            setTabletIcon();
            //console.log(deviceItemData[key].Wind.speedLevel);
            $('#btn_setting_mode_air_purifier_wind .setting_btn_on').html(getTextWind(deviceItemData[key].Wind.speedLevel)+' ≫');
            init_btn_active_style(key);
        }

    }




}

function samsung_control_aircon_main(_id,_type){
    nowItem = _type;
    nowItemID = _id;
	$('#content_tab').show();
	$('.content_btn_space').show();
	$('.content_btn_space').html(
		'<div class="switch_space">'+
		'<input id="switch" type="checkbox" name="check-1" value="1" class="lcs_check" autocomplete="OFF" />'+
		'</div>'
	);

	$('.content_space_sub').html(
		'<div class="sub_group">'+
		'<div class="content_image_style aircon_main"></div>'+
		'<div id="aircon_main" class="notice_content_space ctr_off">'+
		'<div class="condition con_off">' +
			'<div class="con_group1">' +
				'<div class="con_title">현재온도</div>' +
				'<div class="now_temp mainColorFont">0°</div>' +
			'</div>' +
			'<div class="con_group2">' +
				'<div class="con_title">설정온도</div>' +
				'<div class="control_group">' +
					'<div class="btn_minus" data-icon-num="minus"></div>'+
					'<div class="set_temp">0°</div>'+
					'<div class="btn_plus" data-icon-num="plus"></div>'+
				'</div>' +
				'<div class="btn_set_temp btnStyle btnSubColor" onclick="item_control_Temperatures(\''+_id+'\');">설정온도 적용</div>'+
			'</div>' +
		'</div>'+
		'</div></div>'

	);
	switchBoxInit();

	$('.content_mode_space').html(setting_aircon_mode+setting_aircon_wind+setting_alram);
	isContentPage = true;


    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            setConnCondition(deviceItemData[key]);
            nowKey = key;
            if(deviceItemData[key].connected){
                $('.switch_space').show();
            }else{
                $('.switch_space').hide();
                $('.btn_set_temp').hide();
                $('.now_temp').html('--');
                $('.set_temp').html('--');
                $('.condition').removeClass('con_on').addClass('con_off');
                $('#btn_setting_mode_aircon_mode .setting_btn_on').html('설정 ≫');
                $('#btn_setting_mode_aircon_wind .setting_btn_on').html('설정 ≫');
                spinner_hide();
                return;
            }




            if(deviceItemData[key].Operation.power == 'On'){
                $('input').lcs_on();
                $('.condition').removeClass('con_off').addClass('con_on');
            }else{
                $('input').lcs_off();
                $('.condition').removeClass('con_on').addClass('con_off');
            }


            $('.now_temp').html(deviceItemData[key].Temperatures[0].current+'°');
            $('.set_temp').html(deviceItemData[key].Temperatures[0].desired+'°');

            var tempMode = getTextAirconMode(deviceItemData[key].Mode.modes[0]);
            var tempWind = getTextWind(deviceItemData[key].Wind.speedLevel);

            if (tempMode == '자동'){
                tempWind = '자동풍';
                deviceItemData[key].Wind.speedLevel = 0;
            }
            $('#btn_setting_mode_aircon_mode .setting_btn_on').html(tempMode+' ≫');
            $('#btn_setting_mode_aircon_wind .setting_btn_on').html(tempWind+' ≫');


            init_btn_active_style(key);
            setTabletIcon();


        }

    }




}



function samsung_control_aircon_sub(_id,_type){
    nowItem = _type;
    nowItemID = _id;

	$('#content_tab').show();
	$('.content_btn_space').show();
	$('.content_btn_space').html(
		'<div class="switch_space">'+
		'<input id="switch" type="checkbox" name="check-1" value="1" class="lcs_check" autocomplete="OFF" />'+
		'</div>'
	);

	$('.content_space_sub').html(
		'<div class="content_image_style aircon_sub"></div>'+
		'<div id="aircon_sub" class="notice_content_space ctr_off">'+
		'<div class="condition con_off">' +
		'<div class="con_group1">' +
		'<div class="con_title">현재온도</div>' +
		'<div class="now_temp mainColorFont">26°</div>' +
		'</div>' +
		'<div class="con_group2">' +
		'<div class="con_title">설정온도</div>' +
		'<div class="control_group">' +
		'<div class="btn_minus" data-icon-num="minus"></div>'+
		'<div class="set_temp">22°</div>'+
		'<div class="btn_plus" data-icon-num="plus"></div>'+
		'</div>' +
		'<div class="btn_set_temp btnStyle btnSubColor" onclick="item_control_Temperatures(\''+_id+'\');">설정온도 적용</div>'+
		'</div>' +
		'</div>'+
		'</div>'
	);
	switchBoxInit();

	$('.content_mode_space').html(setting_aircon_mode+setting_aircon_wind+setting_alram);


	isContentPage = true;


    for(var key in deviceItemData) {
        var notice_content='';
        if(deviceItemData[key].id == _id){
            nowKey = key;
            setConnCondition(deviceItemData[key]);

            if(deviceItemData[key].connected){
                $('.switch_space').show();
            }else{
                $('.switch_space').hide();
                $('.now_temp').html('--');
                $('.set_temp').html('--');
                $('.condition').removeClass('con_on').addClass('con_off');
                $('#btn_setting_mode_aircon_mode .setting_btn_on').html('설정 ≫');
                $('#btn_setting_mode_aircon_wind .setting_btn_on').html('설정 ≫');
                spinner_hide();
                return;
            }

            if(deviceItemData[key].Operation.power == 'On'){
                $('input').lcs_on();
                $('.condition').removeClass('con_off').addClass('con_on');
            }else{
                $('input').lcs_off();
                $('.condition').removeClass('con_on').addClass('con_off');
            }

           $('.now_temp').html(deviceItemData[key].Temperatures[0].current+'°');
           $('.set_temp').html(deviceItemData[key].Temperatures[0].desired+'°');

			var tempMode = getTextAirconMode(deviceItemData[key].Mode.modes[0]);
			var tempWind = getTextWind(deviceItemData[key].Wind.speedLevel);

			if (tempMode == '자동'){
                tempWind = '자동풍';
                deviceItemData[key].Wind.speedLevel = 0;
			}
            $('#btn_setting_mode_aircon_mode .setting_btn_on').html(tempMode+' ≫');
            $('#btn_setting_mode_aircon_wind .setting_btn_on').html(tempWind+' ≫');

            init_btn_active_style(key);
            setTabletIcon();
        }

    }

}





function set_ctr(){
	var _val = 1;

	if(_val == 1){
		$('.notice_content_space').removeClass('ctr_off').addClass('ctr_on');
		$('.notice_content').html('세탁중');
		$('.timer').html('00:24:25');
		$('.btn_popup_ctr_on').html('일시정지');
	}else if( _val == 2){
		$('.notice_content_space').removeClass('ctr_on').addClass('ctr_off');
		$('.notice_content').html('탈수중');
		$('.timer').html('00:24:25');
		$('.btn_popup_ctr_on').html('동작');
	}else{
		$('.notice_content_space').removeClass('ctr_on').addClass('ctr_off');
		$('.notice_content').html('---');
		$('.timer').html('--:--:--');
		$('.content_btn_space').hide();
	}

}



/************************************************************************
 *                             AJAX Function
 ************************************************************************/
var client_id, access_token;

function accessToken(_data) {
	_data['cv_userId'] = userId;
    _data['scope'] = '3RD_PARTY';
    _data['close'] = 'true';
    _data['closedAction'] = 'signInSuccess';
    _data['apt_name'] = complexName;

    var mSec = new Date().getTime();
	console.log('accessToken_data:',_data);
	$.ajax({
		url: 'https://cvnetrndsh02.uasis.com/apiservice/user',
		type: "POST",
		data:JSON.stringify(_data),
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/user',
            'x-hit-msec':mSec
        },
		contentType: 'application/json',
		success: function (data) {
			console.log("accessToken result : ", data);
			if(data.status == 600){
                getUser(_data.client_id,_data.access_token);
                client_id = _data.client_id;
                access_token = _data.access_token;
			}else{

            }

		},
		error: function (xhr, status, error) {
			console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
			console.log("리스트 호출 에러!!!");
            spinner_hide();
		}
	});
}

function updateToken(_data) {
    _data['cv_userId'] = userId;
    _data['scope'] = '3RD_PARTY';
    _data['close'] = 'true';
    _data['closedAction'] = 'signInSuccess';
    var mSec = new Date().getTime();

    console.log(_data);
    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/user',
        type: "PUT",
        data:JSON.stringify(_data),
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/user',
            'x-hit-msec':mSec
        },
        contentType: 'application/json',
        success: function (data) {
            console.log("updateToken result : ", data);
            if(data.status == 600){
                getUser(_data.client_id,_data.access_token);
                client_id = _data.client_id;
                access_token = _data.access_token;
                //getDevices();

            }
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            spinner_hide();
        }
    });
}


function checkUser() {
    var mSec = new Date().getTime();
    var result = '0';
    var data = {
        'cv_userId':userId,
        'apt_name':complexName
    };

    console.log('data:',data);
    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/checkuser',
        type: "POST",
        data:JSON.stringify(data),
        async: false,
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/user',
            'x-hit-service-id':samsung_code.client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        contentType: 'application/json',
        success: function (data) {
            console.log("checkUser result : ", data);
            //0 중복조회없음, 1 중복
            result = data.data;
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            spinner_hide();
        }
    });

    return result;
}

function getUser(_client_id , _access_token) {
    // header에 X-HIT-Service-Id(client_id),
    // X-HIT-User-Cid (cvnet_id)
    // X-HIT-mSec (timestamp long)
/*
    getAjaxUser('https://cvnetrndsh02.uasis.com/apiservice/user',_client_id , _access_token,function(data){
    	console.log('getUser result ',data);
	});
	return;*/
    var mSec = new Date().getTime();
    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/user',
        type: "GET",
        contentType: 'application/json',
        headers: {
        	'x-hit-version':'v1',
			'x-hit-api-key':'/apiservice/user',
            'x-hit-service-id':samsung_code.client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },/*
        beforeSend: function(xhr){
            xhr.setRequestHeader('x-hit-version', 'v1');
            xhr.setRequestHeader('x-hit-api-key', '/apiservice/user');
            xhr.setRequestHeader('x-hit-user-token',_access_token);
            xhr.setRequestHeader('x-hit-service-id',_client_id);
            xhr.setRequestHeader('x-hit-user-cid', userId);
            xhr.setRequestHeader('x-hit-msec', mSec);
        },*/
        success: function (data) {
            console.log("getUser result : ", data);
            samsung_api_init();

			//getDevices(_client_id,_access_token);
           // getDevicesItem(_client_id,_access_token,'C630B81B-729B-4948-A21D-000000000SIM');
        },
        error: function (xhr, status, error) {
            showMessage('접속 에러');
            //location.reload();
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);

        }
    });
}


function getDevicesItem(_client_id,_access_token,device_id) {
    // header에 X-HIT-Service-Id(client_id),
    // X-HIT-User-Cid (cvnet_id)
    // X-HIT-mSec (timestamp long)

    spinner_show();
    _client_id = client_id;
    _access_token = access_token;
    device_id = 'C630B81B-729B-4948-A21D-000000000SIM';

    var mSec = new Date().getTime();
    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+device_id,
        type: "GET",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/devices',
            'x-hit-user-token':'',
            'x-hit-service-id':_client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        contentType: 'application/json',
        success: function (data) {
            console.log("getDevicesItem result : ", data);

        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            spinner_hide();
        }
    });
}

function getDevices() {
    spinner_show();
    // header에 X-HIT-Service-Id(client_id),
    // X-HIT-User-Cid (cvnet_id)
    // X-HIT-mSec (timestamp long)
    
    var _client_id = samsung_code.client_id;
    var _access_token = samsung_code.access_token;

    console.log('userId:',userId);

    var mSec = new Date().getTime();
    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/devices',
        type: "GET",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/devices',
            'x-hit-user-token':_access_token,
            'x-hit-service-id':_client_id,
            'x-hit-user-id':userId,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        contentType: 'application/json',
        success: function (data) {
            console.log("getDevices result : ", data);

            if(data.status == 605 || data.status == 401){
                localStorage.removeItem('samsung_code');
                $("#form_doc")[0].submit();
            }else{
                setSamsungListDiv(data);
			}

        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            spinner_hide();
        }
    });
}


function getDeviceItem(_id){

    // header에 X-HIT-Service-Id(client_id),
    // X-HIT-User-Cid (cvnet_id)
    // X-HIT-mSec (timestamp long)
    
    var _client_id = samsung_code.client_id;
    var _access_token = samsung_code.access_token;

    //console.log('client_id:',_client_id);
    var mSec = new Date().getTime();
    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id,
        type: "GET",
        async: false,
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/devices/'+_id,
            'x-hit-user-token':_access_token,
            'x-hit-service-id':_client_id,
            'x-hit-user-id':userId,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        contentType: 'application/json',
        success: function (data) {
            //console.log("###########getDeviceItem result : ", data);
            if(Number(data.status) >= 600 && Number(data.status) <= 605 ){
               // spinner_hide();
            }

            if(data != null){
                for(var key in deviceItemData) {
                    var notice_content='';
                    if(deviceItemData[key].id == data.Device.id){
                        deviceItemData[key] = data.Device;
                    }
                }
			}

            spinner_hide();

        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            spinner_hide();
        }
    });
}




/******************************************[ Item Control ]*********************************************/

function item_control_house_mode(_id,type,nowKey){


    if(deviceItemData[nowKey].type == 'Robot_Cleaner'){

        if(deviceItemData[nowKey].connected == false) return;

    }else{
        if(deviceItemData[nowKey].Configuration){
            if(deviceItemData[nowKey].Operation.power == 'Off' || deviceItemData[nowKey].Configuration.remoteControlEnabled == false) return;
        }

    }
   // spinner_show();
    var jsonData;
    if(nowControlMode == 'wind'){

        if(deviceItemData[nowKey].Wind == undefined){
            spinner_hide();
            return;
        }

        jsonData = {"Wind":{"speedLevel":Number(deviceItemData[nowKey].Wind.speedLevel)}};
    }else{
        if(deviceItemData[nowKey].type == 'Robot_Cleaner' && type == 0){
            jsonData = {"Mode":{"modes":['Control_Homing']}};
        }else if(deviceItemData[nowKey].type == 'Robot_Cleaner' && type == 1){
            jsonData = {"Mode":{"modes":['Cleaning_Auto']}};
        }
        else{
            if(deviceItemData[nowKey].Mode === undefined) {

                spinner_hide();
                return;
            }
            jsonData = {"Mode":{"modes":[deviceItemData[nowKey].Mode.modes[0]]}};
        }


    }
    console.log('nowControlMode:',nowControlMode);
    var _client_id = samsung_code.client_id;
    var _access_token = samsung_code.access_token;
    var mSec = new Date().getTime();
    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/'+nowControlMode,
        type: "PUT",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/devices/'+_id+'/'+nowControlMode,
            'x-hit-user-token':_access_token,
            'x-hit-service-id':_client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        success: function (data) {
            console.log("item_control_operation result : ", data);
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            showMessage("응답 에러");
            spinner_hide();
        }
    });
}

function item_control_mode(_id,type){


    if(deviceItemData[nowKey].type == 'Robot_Cleaner'){

        if(deviceItemData[nowKey].connected == false) return;

    }else{
        if(deviceItemData[nowKey].Configuration){
            if(deviceItemData[nowKey].Operation.power == 'Off' || deviceItemData[nowKey].Configuration.remoteControlEnabled == false) return;
        }

    }
    spinner_show();
    var jsonData;
    if(nowControlMode == 'wind'){

        if(deviceItemData[nowKey].Wind == undefined){
            spinner_hide();
            return;
        }

        jsonData = {"Wind":{"speedLevel":Number(deviceItemData[nowKey].Wind.speedLevel)}};
    }else{
        if(deviceItemData[nowKey].type == 'Robot_Cleaner' && type == 0){
            jsonData = {"Mode":{"modes":['Control_Homing']}};
        }else if(deviceItemData[nowKey].type == 'Robot_Cleaner' && type == 1){
            jsonData = {"Mode":{"modes":['Cleaning_Auto']}};
        }else{
            if(deviceItemData[nowKey].Mode === undefined){

                spinner_hide();
                return;
            }
            jsonData = {"Mode":{"modes":[deviceItemData[nowKey].Mode.modes[0]]}};
        }


    }

    
    var _client_id = samsung_code.client_id;
    var _access_token = samsung_code.access_token;
    var mSec = new Date().getTime();

    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/'+nowControlMode,
        type: "PUT",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/devices/'+_id+'/'+nowControlMode,
            'x-hit-user-token':_access_token,
            'x-hit-service-id':_client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        success: function (data) {
            console.log("item_control_operation result : ", data);
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            showMessage("응답 에러");
            spinner_hide();
        }
    });
}

function item_control_operation_mode(power,state,_id,tag,nowKey){

    if(deviceItemData[nowKey].Configuration){
        if(deviceItemData[nowKey].Operation.power == 'Off' || deviceItemData[nowKey].Configuration.remoteControlEnabled == false) return;
    }

    var jsonData;
    var url = 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/operation',
        apiKey = '/apiservice/devices/'+_id+'/operation';
    if(state != -1) {
        if(tag == 0){
            if (state == 0) {

                if(deviceItemData[nowKey].Operation.state == 'Ready'){
                    return;
                }else{
                    state = 'Ready';
                }

            } else if (state > 0) {
                if (deviceItemData[nowKey].Operation.state == 'Run') {
                    state = 'Pause';
                } else {
                    state = 'Run';
                }
            }
        }

        if(tag == 1){
            // jsonData = {"SubDevices":[{"subId":"1","Operation":{"state":state}}]};
            //jsonData ={"SubDevices":[{"Operation":{"state":state}}]};

            if (state == 0) {

                if(deviceItemData[nowKey].SubDevices[0].Operation.state == 'Ready'){
                    spinner_hide();
                    return;
                }else{
                    state = 'Ready';
                }

            } else if (state > 0) {

                if (deviceItemData[nowKey].SubDevices[0].Operation.state == 'Run') {
                    state = 'Pause';
                } else {
                    state = 'Run';
                }
            }

            jsonData = {"Operation":{"state":state}};

            url = 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/1/operation';
            apiKey = '/apiservice/devices/'+_id+'/1/operation';
        }else{
            jsonData = {"Operation":{"state":state}};
        }
    }

    if(power != -1){

        if(power == 1){
            power = 'On';
        }else{
            power = 'Off';
        }

        if(tag == 1){
            //jsonData = {"SubDevices":[{"subId":"1","Operation":{"power":power}}]};
            //jsonData ={"SubDevices":[{"Operation":{"power":power}}]};
            url = 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/1/operation';
            apiKey = '/apiservice/devices/'+_id+'/1/operation';
        }
        jsonData = {"Operation":{"power":power}};
    }

    var mSec = new Date().getTime();

    $.ajax({
        url: url,
        type: "PUT",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':apiKey,
            'x-hit-user-token':samsung_code.access_token,
            'x-hit-service-id':samsung_code.client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        success: function (data) {
            console.log("item_control_operation result : ", data);
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            showMessage("응답 에러");
            spinner_hide();
        }
    });

}

function item_control_operation(power,state,_id,tag){

    if(nowItem == 'Air_Purifier' || nowItem == 'Air_Conditioner' || nowItem == 'Dryer' || nowItem == 'Dishwasher' || nowItem == 'Washer'){
        if(deviceItemData[nowKey].connected == false) return;
    }else{
        if(deviceItemData[nowKey].Configuration){
            if(deviceItemData[nowKey].Operation.power == 'Off' || deviceItemData[nowKey].Configuration.remoteControlEnabled == false) return;
        }
    }


    spinner_show();
    var jsonData;
    var url = 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/operation',
    	apiKey = '/apiservice/devices/'+_id+'/operation';
    if(state != -1) {
        if(tag == 0){
            if (state == 0) {

                if(deviceItemData[nowKey].Operation.state == 'Ready'){
                    spinner_hide();
                    return;
                }else{
                    state = 'Ready';
                }

            } else if (state > 0) {
                if (deviceItemData[nowKey].Operation.state == 'Run') {
                    state = 'Pause';
                } else {
                    state = 'Run';
                }
            }
        }

        if(tag == 1){
           // jsonData = {"SubDevices":[{"subId":"1","Operation":{"state":state}}]};
            //jsonData ={"SubDevices":[{"Operation":{"state":state}}]};

            if (state == 0) {

                if(deviceItemData[nowKey].SubDevices[0].Operation.state == 'Ready'){
                    spinner_hide();
                    return;
                }else{
                    state = 'Ready';
                }

            } else if (state > 0) {

                if (deviceItemData[nowKey].SubDevices[0].Operation.state == 'Run') {
                    state = 'Pause';
                } else {
                    state = 'Run';
                }
            }



            jsonData = {"Operation":{"state":state}};



            url = 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/1/operation';
            apiKey = '/apiservice/devices/'+_id+'/1/operation';
		}else{
            jsonData = {"Operation":{"state":state}};
		}
    }

    if(power != -1){

        if(power == 1){
            power = 'On';
        }else{
            power = 'Off';
        }

        if(tag == 1){
            //jsonData = {"SubDevices":[{"subId":"1","Operation":{"power":power}}]};
            //jsonData ={"SubDevices":[{"Operation":{"power":power}}]};
            url = 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/1/operation';
            apiKey = '/apiservice/devices/'+_id+'/1/operation';
        }
        jsonData = {"Operation":{"power":power}};


    }




    
    var mSec = new Date().getTime();

    $.ajax({
        url: url,
        type: "PUT",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':apiKey,
            'x-hit-user-token':samsung_code.access_token,
            'x-hit-service-id':samsung_code.client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        success: function (data) {
            console.log("item_control_operation result : ", data);
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            showMessage("응답 에러");
            spinner_hide();
        }
    });

}


function item_control_fridge(_id,tag){
    if(deviceItemData[nowKey].connected == false) return;

    spinner_show();

    var mSec = new Date().getTime();
    var jsonData;
    if(tag === 1){
        var tempValue = deviceItemData[nowKey].Fridge.rapidFreezing === "On" ? "Off" : "On";
        jsonData = {
            "Fridge":{
            "rapidFridge":deviceItemData[nowKey].Fridge.rapidFridge,
            "rapidFreezing":tempValue
            }
        };
    }else{
        var tempValue = deviceItemData[nowKey].Fridge.rapidFridge === "On" ? "Off" : "On";
        jsonData = {
            "Fridge":{
                "rapidFridge":tempValue,
                "rapidFreezing":deviceItemData[nowKey].Fridge.rapidFreezing
            }
        };
    }
    console.log('jsonData::',jsonData);

    $.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/fridge',
        type: "PUT",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/devices/'+_id+'/temperatures',
            'x-hit-user-token':samsung_code.access_token,
            'x-hit-service-id':samsung_code.client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        success: function (data) {
            console.log("item_control_Temperatures result : ", data);
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            showMessage("응답 에러");
            spinner_hide();
        }
    });

}



function item_control_Temperatures(_id){
    if(deviceItemData[nowKey].Operation.power == 'Off' || deviceItemData[nowKey].connected == false) return;

    spinner_show();
    
    var mSec = new Date().getTime();

    var temp = Number($('.set_temp').html().replace('°',''));



    var jsonData = {"Temperatures" : [{ "id":"0", "desired":temp}]};

	$.ajax({
        url: 'https://cvnetrndsh02.uasis.com/apiservice/devices/'+_id+'/temperatures',
        type: "PUT",
        headers: {
            'x-hit-version':'v1',
            'x-hit-api-key':'/apiservice/devices/'+_id+'/temperatures',
            'x-hit-user-token':samsung_code.access_token,
            'x-hit-service-id':samsung_code.client_id,
            'x-hit-user-cid':userId,
            'x-hit-msec':mSec
        },
        data: JSON.stringify(jsonData),
        contentType: 'application/json',
        success: function (data) {
            console.log("item_control_Temperatures result : ", data);
        },
        error: function (xhr, status, error) {
            console.log("code:" + status.status + "\n" + "message:" + xhr.responseText + "\n" + "error:" + error);
            console.log("리스트 호출 에러!!!");
            showMessage("응답 에러");
            spinner_hide();
        }
    });

}



/************************************************************************
 *                             web socket
 ************************************************************************/
var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('https://test-api.uasis.com/ssh-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);



        console.log('Connected: ' + frame);
        stompClient.subscribe('/sub/event', function (event) {
            if(nowPopupOpen) return;
            console.log('device-type: ' + event['headers']["x-hit-device-type"]);
            //var deviceType = event['headers']["x-hit-device-type"];
            var jsonData = JSON.parse(event.body).Notification.Events[0];
            var deviceType = JSON.parse(event.body).Device_Type;
            console.log('socket event json data: ', JSON.parse(event.body));

            $('#popup_alram').hide();
            $('.samsung_modal').hide();

            for(var key in deviceItemData) {

                if(deviceItemData[key].id == jsonData.id){

					//듀얼 또는 서브 아이템
                    if(jsonData.subId == '1') {
                        if (jsonData.resource == "Operation") {
                            if (jsonData.Operation.remainingTime !== undefined) {
                                deviceItemData[key].SubDevices[0].Operation.remainingTime = jsonData.Operation.remainingTime;
                            }
                            if (jsonData.Operation.progress !== undefined) {
                                deviceItemData[key].SubDevices[0].Operation.progress = jsonData.Operation.progress;
                            }
                            if (jsonData.Operation.state !== undefined) {
                                deviceItemData[key].SubDevices[0].Operation.state = jsonData.Operation.state;
                            }
                            if (jsonData.Operation.power !== undefined) {
                                deviceItemData[key].SubDevices[0].Operation.power = jsonData.Operation.power;
                            }

                        }else if(jsonData.resource == "Device"){
                            if(jsonData.Configuration.connected !== undefined){
                                deviceItemData[key].SubDevices[0].connected = jsonData.Device.connected;
                            }
                        }else if(jsonData.resource == "Sensors"){

                            if(jsonData.Sensors[0].values !== undefined){
                                if(jsonData.Sensors[0].id == '0'){
                                    //미세먼지
                                    deviceItemData[key].SubDevices[0].Sensors[0].values[0] = jsonData.Sensors[0].values[0];
                                    deviceItemData[key].SubDevices[0].Sensors[0].values[1] = jsonData.Sensors[0].values[1];
                                }else{
                                    //초미세먼지
                                    deviceItemData[key].SubDevices[0].Sensors[1].values[0] = jsonData.Sensors[0].values[0];
                                    deviceItemData[key].SubDevices[0].Sensors[1].values[1] = jsonData.Sensors[0].values[1];
                                }
                            }
                        }else if(jsonData.resource == "Temperatures"){

                            if(jsonData.Temperatures[0].current !== undefined){
                                //현재온도
                                deviceItemData[key].SubDevices[0].Temperatures[0].current= jsonData.Temperatures[0].current;
                            }

                            if(jsonData.Temperatures[0].desired !== undefined){
                                //설정온도
                                deviceItemData[key].SubDevices[0].Temperatures[0].desired= jsonData.Temperatures[0].desired;
                            }
                        }else if(jsonData.resource == "Mode") {

                            if (jsonData.Mode.modes[0] !== undefined) {
                                //운전모드
                                deviceItemData[key].SubDevices[0].Mode.modes = jsonData.Mode.modes;
                            }

                        }else if(jsonData.resource == "Wind"){
                            //바람세기
                            deviceItemData[key].SubDevices[0].Wind.speedLevel = jsonData.Wind.speedLevel;
                        }
                    }else{
					//메인 아이템
                        if(jsonData.resource == "Operation") {
                            if(jsonData.Operation.remainingTime !== undefined){
                                deviceItemData[key].Operation.remainingTime = jsonData.Operation.remainingTime;
                            }
                            if(jsonData.Operation.progress !== undefined){
                                deviceItemData[key].Operation.progress = jsonData.Operation.progress;
                            }
                            if(jsonData.Operation.state !== undefined){
                                deviceItemData[key].Operation.state = jsonData.Operation.state;
                            }
                            if(jsonData.Operation.power !== undefined){
                                deviceItemData[key].Operation.power = jsonData.Operation.power;
                            }

                        }else if(jsonData.resource == "Device"){
                            if(jsonData.Device.connected !== undefined){
                                deviceItemData[key].connected = jsonData.Device.connected;
                            }
                        }else if(jsonData.resource == "Configuration"){
                            if (jsonData.Configuration.remoteControlEnabled !== undefined) {
                                deviceItemData[key].Configuration.remoteControlEnabled = jsonData.Configuration.remoteControlEnabled;
                            }

                        }else if(jsonData.resource == "Sensors"){

                            if(jsonData.Sensors[0].values !== undefined){
                                if(jsonData.Sensors[0].id == '0'){
                                    //미세먼지
                                    deviceItemData[key].Sensors[0].values[0] = jsonData.Sensors[0].values[0];
                                    deviceItemData[key].Sensors[0].values[1] = jsonData.Sensors[0].values[1];
                                }else{
                                    //초미세먼지
                                    deviceItemData[key].Sensors[1].values[0] = jsonData.Sensors[0].values[0];
                                    deviceItemData[key].Sensors[1].values[1] = jsonData.Sensors[0].values[1];
                                }
                            }
                        }else if(jsonData.resource == "Temperatures"){

                        	if(deviceType == 'Refrigerator'){
                        		if(jsonData.Temperatures[0].id == "0"){
                                    deviceItemData[key].Temperatures[0].desired= jsonData.Temperatures[0].desired;
								}else{
                                    deviceItemData[key].Temperatures[1].desired= jsonData.Temperatures[0].desired;
								}

							}else{
                                if(jsonData.Temperatures[0].current !== undefined){
                                    //현재온도
                                    deviceItemData[key].Temperatures[0].current= jsonData.Temperatures[0].current;
                                }

                                if(jsonData.Temperatures[0].desired !== undefined){
                                    //설정온도
                                    deviceItemData[key].Temperatures[0].desired= jsonData.Temperatures[0].desired;
                                }
							}

                        }else if(jsonData.resource == "Mode") {

                            if (jsonData.Mode.modes[0] !== undefined) {
                                //운전모드
								deviceItemData[key].Mode.modes = jsonData.Mode.modes;
                            }

                        } else if(jsonData.resource == "Wind"){
                            //바람세기
                            deviceItemData[key].Wind.speedLevel = jsonData.Wind.speedLevel;
                        }else if(jsonData.resource == "Doors"){
                        	if( jsonData.Doors[0].id == "0"){
                                deviceItemData[key].Doors[0].openState = jsonData.Doors[0].openState;
							}else{
                                deviceItemData[key].Doors[1].openState = jsonData.Doors[0].openState;
							}
						}else if(jsonData.resource == "Fridge"){
                        	if(jsonData.Fridge !== undefined){
                                deviceItemData[key].Fridge = jsonData.Fridge;
							}
                        }
					}


                    if(deviceType == "Air_Purifier"){
					}

					if(nowItem == deviceType){
                    	samsung_control(deviceType,key);
                    }
					/*
					switch(jsonData.type){
						case "Air_Purifier" :
                            samsung_control_airclener(jsonData.id);
							break;
                        case "Robot_Cleaner" :
                            samsung_control_robot(jsonData.id);
                            break;
                        case "Air_Conditioner" :
                        	if(jsonData.deviceSubType == "FAC"){
                                samsung_control_aircon_main(jsonData.id);
							}else{
                                samsung_control_aircon_sub(jsonData.id);
							}
                            break;
                        case "Washer" :
                            samsung_control_washer(jsonData.id);
                            break;
                        case "Refrigerator" :
                            samsung_control_refrigerator(jsonData.id);
                            break;
                        case "Oven" :
                            if(jsonData.deviceSubType == "Range"){
                                samsung_control_gas(jsonData.id);
                            }else{
                                samsung_control_oven(jsonData.id);
							}
                            break;
                        case "Dryer" :
                            samsung_control_dryer(jsonData.id);
                            break;
					}
					*/

                    console.log('deviceItemData[key]: ',deviceItemData[key]);
                }

            }


            console.log('deviceItemData: ',deviceItemData);
            spinner_hide();


        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/ssh/hello", {}, JSON.stringify({'name': $("#name").val()}));
}


function sendControlWasher(){
    stompClient.send("/ssh/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
   $( "#connect" ).click(function() { connect(); });
   $( "#disconnect" ).click(function() { disconnect(); });
   $( "#send" ).click(function() { sendName(); });
});


/************************************************************************
 *                             function
 ************************************************************************/

function set_checkbox(_this){
    var index = _this.id.substr(14,1);

    if(checkbox[index]){
        $(_this).removeClass('ckeckbox_on').addClass('ckeckbox_off');
        checkbox[index] = 0;
    }else{
        $(_this).removeClass('ckeckbox_off').addClass('ckeckbox_on');
        checkbox[index] = 1;
    }
}


function set_checkbox_control(_this){
    var index = _this.id.substr(14,1);

    if(nowControlMode == 'wind'){
        deviceItemData[nowKey].Wind.speedLevel = index;
	}else if(nowControlMode == 'mode'){
        deviceItemData[nowKey].Mode.modes[0] = getTextMode(index);
	}

    if(nowItem == 'Robot_Cleaner'){
        deviceItemData[nowKey].Mode.modes[0] = getTextModeRobot(index);
    }

    checkbox_control = [0,0,0,0,0,0,0];
    $('.checkbox_list').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    if(checkbox_control[index]){
        $(_this).removeClass('ckeckbox_on').addClass('ckeckbox_off');
        checkbox_control[index] = 0;
    }else{
        $(_this).removeClass('ckeckbox_off').addClass('ckeckbox_on');
        checkbox_control[index] = 1;
    }

}

function setControlPopup(output){
    $('.checkbox_space').html(output);
    $('.checkbox_list').bind('touchend', function() {
        set_checkbox_control(this);
    });
    setTabletIcon();
}

function setAlrimPopup(output){
    $('.checkbox_space').html(output);
    $('.checkbox_list').bind('touchend', function() {
        set_checkbox(this);
    });
    setTabletIcon();
}



function init_btn_active_style(key){

    $('.btn_popup_ctr_on').bind('touchstart touchend', function(e) {
        //e.preventDefault();
        $(this).toggleClass('btnMainColor_active');
    });

    $('.btn_popup_ctr_off').bind('touchstart touchend', function(e) {
        //e.preventDefault();
        $(this).toggleClass('btnSubColor_active');
    });

    $('.btn_set_temp').bind('touchstart touchend', function(e) {
        //e.preventDefault();
        $(this).toggleClass('btnSubColor_active');
    });

    $('.btn_oven_stop').bind('touchstart touchend', function(e) {
        //e.preventDefault();
        $(this).toggleClass('btnSubColor_active');
    });

    $('.btn_samsung_popup_mode_ok').unbind('touchstart touchend').bind('touchstart touchend', function(e) {
        e.preventDefault();
        $(this).toggleClass('btnMainColor_active');
    });

    $('.btn_samsung_popup_mode_cancel').unbind('touchstart touchend').bind('touchstart touchend', function(e) {
        e.preventDefault();
        $(this).toggleClass('btnGrayColor_active');
    });


    $('.list').unbind('touchend').bind('touchend', function() {
        $('#content_tab').animate({scrollTop:0},10);
    });


    $('.btnStyle').bind('touchend', function(e) {
        //e.preventDefault();
        $(this).removeClass('btnMainColor_active');
        $(this).removeClass('btnSubColor_active');
        $(this).removeClass('btnGrayColor_active');
    });



    init_btn_click_event(key);

}


function init_btn_click_event(key){
    $('.btn_samsung_popup_mode_cancel').bind('touchend', function() {
        $('.samsung_modal').hide();
        $('#popup_alram').hide();
        checkbox = [0,0];
        $('.checkbox_list').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    });

    $('#btn_setting_mode_alram').bind('touchend', function() {
        //if(deviceItemData[key].Operation.power == 'Off') return;

        $('#popup_alram').show();
        $('.samsung_modal').show();
        $('.popup_mode_title').html('알람 설정');


        if(nowItem == 'Robot_Cleaner' || nowItem == 'Air_Purifier'){
            var output='';
            $('#popup_alram').css('height','260px');
            output += '<div id="lang_checkbox_0" class="checkbox_list ckeckbox_off">';
            output += '<div class="checkbox" data-icon-num="checkbox"></div>';
            output += '<div id="checkbox_span0" class="checkbox_span">에러 발생시</div>';
            output += '</div>';
            setAlrimPopup(output);
        }

        if(nowItem == 'Air_Conditioner'){
            var output ='';
            $('#popup_alram').css('height','260px');
            output +='<div id="lang_checkbox_1" class="checkbox_list ckeckbox_off">';
            output +='<div class="checkbox" data-icon-num="checkbox"></div>';
            output +='<div id="checkbox_span1" class="checkbox_span">에러 발생시</div>';
            output +='</div>';
            output +='<div id="lang_checkbox_2" class="checkbox_list ckeckbox_off">';
            output +='<div class="checkbox" data-icon-num="checkbox"></div>';
            output +='<div id="checkbox_span2" class="checkbox_span">필터 교체 필요시</div>';
            output +='</div>';
            setAlrimPopup(output);
            $('.checkbox_list').css('margin-left','60px');
        }
    });

    $('#btn_setting_mode_robot').bind('touchend', function() {
        if(deviceItemData[key].connected == false) return;
        if(deviceItemData[key].Mode.modes[3] == 'Control_Homing') return;
        nowControlMode = 'mode';
        $('#popup_alram').show();
        $('.samsung_modal').show();
        $('.popup_mode_title').html('청소 모드');

        $('#popup_alram').css('height','330px');
        var title =['터보 모드','일반 모드','정음 모드'];
        var output = '';
        for(var i = 0; i < 3; i++){
            output += '<div id="lang_checkbox_'+i+'" class="checkbox_list ckeckbox_off">';
            output += '<div class="checkbox" data-icon-num="checkbox"></div>';
            output += '<div id="checkbox_span'+i+'" class="checkbox_span">'+title[i]+'</div>';
            output += '</div>';
        }
        setControlPopup(output);

        if(nowItem =='Robot_Cleaner'){
            //$('.checkbox_list').removeClass('ckeckbox_on').addClass('ckeckbox_off');
            //checkbox_control[deviceItemData[key].Mode.modes[4]] = 1;
            var mode = deviceItemData[key].Mode.modes;
            $('#lang_checkbox_'+getTextRobotModeIndex(mode)).removeClass('ckeckbox_off').addClass('ckeckbox_on');
        }

    });

    $('#btn_setting_mode_air_purifier_wind').bind('touchend', function() {
        if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) return;
        nowPopupOpen = true;
        nowControlMode = 'wind';

        $('#popup_alram').show();
        $('.samsung_modal').show();
        $('.popup_mode_title').html('바람 세기');

        $('#popup_alram').css('height','420px');
        var title =['자동풍','취침','미풍','약풍','강풍'];
        var output = '';

        for(var i = 0; i < 5; i++){
            output += '<div id="lang_checkbox_'+i+'" class="checkbox_list ckeckbox_off">';
            output += '<div class="checkbox" data-icon-num="checkbox"></div>';
            output += '<div id="checkbox_span'+i+'" class="checkbox_span">'+title[i]+'</div>';
            output += '</div>';
        }

        setControlPopup(output);

        if(nowItem =='Air_Purifier' ){
            //$('.checkbox_list').removeClass('ckeckbox_on').addClass('ckeckbox_off');
            checkbox_control[deviceItemData[key].Wind.speedLevel] = 1;
            var wind = deviceItemData[key].Wind.speedLevel;
            $('#lang_checkbox_'+wind).removeClass('ckeckbox_off').addClass('ckeckbox_on');
        }

        $('.checkbox_list').css('margin-left','100px');
    });

    $('#btn_setting_mode_aircon_wind').bind('touchend', function() {
       // if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].Configuration.remoteControlEnabled == false) return;

        if(deviceItemData[key].Operation.power == 'Off') return;
        if(deviceItemData[nowKey].Mode.modes[0] == 'Auto') return;

        nowControlMode = 'wind';

        $('#popup_alram').show();
        $('.samsung_modal').show();
        $('.popup_mode_title').html('바람 세기');


        var title;
        if(deviceItemData[nowKey].deviceSubType == 'FAC'){
            $('#popup_alram').css('height','360px');
            title =['자동풍','null','약풍','강풍','터보풍'];
		}else{
            $('#popup_alram').css('height','420px');
            title =['자동풍','미풍','약풍','강풍','터보풍'];
		}


        var output = '';
        for(var i = 0; i < title.length; i++){
        	if(title[i] != 'null'){
				output += '<div id="lang_checkbox_'+i+'" class="checkbox_list ckeckbox_off">';
				output += '<div class="checkbox" data-icon-num="checkbox"></div>';
				output += '<div id="checkbox_span'+i+'" class="checkbox_span">'+title[i]+'</div>';
				output += '</div>';
            }
        }

        setControlPopup(output);

		if(nowItem =='Air_Conditioner' ){
		   //$('.checkbox_list').removeClass('ckeckbox_on').addClass('ckeckbox_off');
			checkbox_control[deviceItemData[key].Wind.speedLevel] = 1;
			var wind = deviceItemData[key].Wind.speedLevel;
			$('#lang_checkbox_'+wind).removeClass('ckeckbox_off').addClass('ckeckbox_on');
        }

        $('.checkbox_list').css('margin-left','90px');
    });

    $('#btn_setting_mode_aircon_mode').bind('touchend', function() {
        if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) return;

        nowControlMode = 'mode';

        $('#popup_alram').show();
        $('.samsung_modal').show();
        $('.popup_mode_title').html('운전 모드');

        $('#popup_alram').css('height','360px');
        var title =['자동','냉방','제습','송풍'];
        var output = '';
        for(var i = 0; i < 4; i++){
            output += '<div id="lang_checkbox_'+i+'" class="checkbox_list ckeckbox_off">';
            output += '<div class="checkbox" data-icon-num="checkbox"></div>';
            output += '<div id="checkbox_span'+i+'" class="checkbox_span">'+title[i]+'</div>';
            output += '</div>';
        }
        setControlPopup(output);

        if(nowItem =='Air_Conditioner'){
            //$('.checkbox_list').removeClass('ckeckbox_on').addClass('ckeckbox_off');
            checkbox_control[getNumberMode(deviceItemData[key].Mode.modes[0])] = 1;
            var mode = deviceItemData[key].Mode.modes[0];
            $('#lang_checkbox_'+getNumberMode(mode)).removeClass('ckeckbox_off').addClass('ckeckbox_on');
        }
        $('.checkbox_list').css('margin-left','100px');
    });

    $('#btn_samsung_popup_mode_robot_ok').unbind('touchend').bind('touchend', function(e) {
        if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) return;
        item_control_mode(nowItemID);
    });


    $('.btn_samsung_popup_mode_ok').unbind('touchend').bind('touchend', function(e) {
        nowPopupOpen = false;
        if(nowItem === "Robot_Cleaner"){
            if(deviceItemData[key].connected == false) return;
        }else{
            if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) return;
        }

        item_control_mode(nowItemID);
    });

    $('.btn_plus').unbind('touchend').bind('touchend', function(e) {
        if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) return;
        var value = Number($(".set_temp").html().replace('°',' '));
        value += 1;
        if(value > 30){value = 30;}
        $('.set_temp').html(value+'°');
    });

    $('.btn_minus').unbind('touchend').bind('touchend', function(e) {
        if(deviceItemData[key].Operation.power == 'Off' || deviceItemData[key].connected == false) return;
        var value = Number($(".set_temp").html().replace('°',' '));
        if(value < 19){return}
        value -= 1;
        $('.set_temp').html(value+'°');
    });

    $('.btnStyle').removeClass('btnMainColor_active');
    $('.btnStyle').removeClass('btnSubColor_active');
    $('.btnStyle').removeClass('btnGrayColor_active');

}

/********************** switchbox init *************************/
function switchBoxInit(){
    $('input').lc_switch('ON','OFF');
    $('body').delegate('.lcs_check', 'lcs-statuschange', function() {
        switchOnoff = ($(this).is(':checked')) ? 1 : 0;
        //console.log('스위치:',switchOnoff);
    });

    $(".lcs_switch").bind("touchend", function(){
        console.log('스위치 클릭');

        setTimeout(function(){
            switch(nowItem){
                case "Air_Purifier":
                case "Air_Conditioner":
                    item_control_operation(switchOnoff,-1,nowItemID,0);
                    break;

            }
        },300);




    });
}

function samsung_api_init(){
	getDevices();
	connect();
}

function spinner_show(){
	$('.spinner_space_sub').show();
    $('.modal').show();
}

function spinner_hide(){
    $('.spinner_space_sub').hide();
    $('.modal').hide();
    $('.popup_style')

}

function setSamsungListDiv(data){

	var output = '';
	var first_type = '';
	var first_i='';
    deviceItemData = data.Devices;

    console.log('##data:', data);

    if(data.Devices !== undefined){
        for (var i = 0; i < data.Devices.length; i++)
        {
            var contents = data.Devices[i];
            if( i == 0){
                first_i = i;
                first_type = contents.type;
            }
            output += '<li class="list" id="list_'+contents.type+'" onclick="samsung_control(\''+contents.type+'\','+i+');">';
            output += '   <div class="content_title_group">';
            output += '    <div class="'+getImageClassName(contents)+'"></div>';
            output += '   <div class="main_list_title fontsize_main_list_title">'+contents.name+'</div>';
            output += '   <div class="icon_next" data-icon-num="next"></div>';
            output += '   <div class="list_conn_span list_off"></div>';
            output += '</div>';
            output += '</li>';
        }
        $('#content > ul').html(output);

        samsung_control(first_type,first_i);
        setTabletIcon();
    }else{
        showMessage('등록 된 삼성 스마트홈 가전이 없습니다.');
    }
    spinner_hide();
    $('.list').bind('click', function() {
     //   spinner_show();
    });
}

function getImageClassName(contents){
	var result = contents.type;
	if(contents.type == 'Air_Conditioner') {
        result =  contents.deviceSubType == 'FAC' ? 'Aircon_main' : 'Aircon_sub';
    }

    if(contents.type == 'Oven') {
        result =  contents.deviceSubType == 'Range' ? 'Gas' : 'Oven';
    }

    if(contents.type == 'Washer') {
        result =  contents.deviceSubType == 'Dual_Wash' ? 'Washer_dual' : 'Washer';
    }


	return 'list_icon_'+result;
}

function setConnCondition(data){

	if(data.connected){
        $('#conn').removeClass('conn_off').addClass('conn_on');
        $('.condition_conn').html('Connected');
	}else{
        $('#conn').removeClass('conn_on').addClass('conn_off');
        $('.condition_conn').html('Disconnected');
	}
    $('#smart_conn').hide();

	for (var key in data.resources){

        if(data.resources[key] == 'Device'){

            if(data.Device.connected){
                $('#conn').removeClass('conn_off').addClass('conn_on');
                $('.condition_conn').html('Connected');
            }else{
                $('#conn').removeClass('conn_on').addClass('conn_off');
                $('.condition_conn').html('Disconnected');
            }

        }else if(data.resources[key] == 'Configuration'){
			$('#smart_conn').show();
			if(data.Configuration.remoteControlEnabled){
				$('#smart_conn').removeClass('smart_off').addClass('smart_on');
				$('.onoff_span').html('ON');
			}else if(!data.Configuration.remoteControlEnabled){
				$('#smart_conn').removeClass('smart_on').addClass('smart_off');
				$('.onoff_span').html('OFF');
			}
        }

    }

}

function samsung_control(type,i){
    spinner_show();

    isContentPage = false;
    countdown_stop('main');
    countdown_stop('sub');
    nowItem ='';

	var data = deviceItemData[i];

    //$('#content_tab').animate({scrollTop:0},100);

	if(!isContentPage){
        getDeviceItem(data.id);
	}

	$('.list').removeClass('list_samsung_active');
	$('#list_'+type).addClass('list_samsung_active');

    //setConnCondition(data);
	switch(type){
        case 'Air_Purifier' :
            samsung_control_airclener(data.id,type);
			break;
        case 'Robot_Cleaner' :
            samsung_control_robot(data.id,type);
			break;
        case 'Washer' :

        	if(data.deviceSubType == 'Dual_Wash'){
                samsung_control_washer_dual(data.id,type);
			}else{
                samsung_control_washer(data.id,type);
			}
			break;
        case 'Refrigerator' :
            samsung_control_refrigerator(data.id,type);
			break;
        case 'Dryer' :
        	if(data.deviceSubType == 'Dual_Dry') {
                samsung_control_dryer_dual(data.id, type);
            }else{
                samsung_control_dryer(data.id, type);
			}
			break;
		case 'Air_Conditioner' :
			if(data.deviceSubType == 'FAC'){
                samsung_control_aircon_main(data.id,type);
			}else{
                samsung_control_aircon_sub(data.id,type);
			}
			break;
        case 'Oven' :
            if(data.deviceSubType == 'Range'){
                samsung_control_gas(data.id,type);
            }else{
                samsung_control_oven(data.id,type);
            }
			break;
        case 'Dishwasher' :
            samsung_control_dishwasher(data.id,type);
            break;
	}


}



/******************************************[ Timer ]*********************************************/
var countTimer_main,countTimer_sub,delayTime;

function countdown(_$id, minsec, tag)
{
    var minutes = minsec.minutes,
        seconds = minsec.seconds;
    var endTime, hours, mins, msLeft, time;

    function twoDigits(n){
        return (n <= 9 ? "0" + n : n);
    }

    delayTime = new Date().getTime();

    if(tag == 'main') {
        function updateTimer_main() {
            msLeft = endTime - (+new Date);
            if (msLeft < 1000) {
                $(_$id).html("00:00:00");
            } else {
                time = new Date(msLeft);
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                $(_$id).html((hours ? twoDigits(hours) + ':' + twoDigits(mins) : '00:' + twoDigits(mins)) + ':' + twoDigits(time.getUTCSeconds()));
				countTimer_main = setTimeout(updateTimer_main, time.getUTCMilliseconds() + 500);
            }
        }

        endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
        updateTimer_main();
    }else{
        function updateTimer_sub() {
            msLeft = endTime - (+new Date);
            if (msLeft < 1000) {
                $(_$id).html("00:00:00");
            } else {
                time = new Date(msLeft);
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                $(_$id).html((hours ? twoDigits(hours) + ':' + twoDigits(mins) : '00:' + twoDigits(mins)) + ':' + twoDigits(time.getUTCSeconds()));
                countTimer_sub = setTimeout(updateTimer_sub, time.getUTCMilliseconds() + 500);
            }
        }
        endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
        updateTimer_sub();
    }
}

function countdown_stop(tag){
    if(tag == 'main'){
        if((new Date().getTime() - delayTime) > 1200){
            if(countTimer_main === null) return;
            clearTimeout(countTimer_main);
            countTimer_main = null;
        }
    }else{
        if((new Date().getTime() - delayTime) > 1200){
            if(countTimer_sub === null) return;
            clearTimeout(countTimer_sub);
            countTimer_sub = null;
        }
    }

}

function getMinSec(t_data){
    var time = t_data.split(':');
    var hh = Number(time[0]);
    var mm = Number(time[1]);
    var ss = Number(time[2]);
    var minutes = (hh * 60)+mm;
    var seconds = ss;
    return {
        minutes : (hh * 60)+mm,
        seconds : ss
    }
}

function getTextWind(val){
    var result='';

    switch(val){
        case 0: result='자동풍';
            break;
        case 1:
        	if(nowItem == 'Air_Purifier'){
                result='취침';
			}else{
                result='미풍';
			}
            break;
        case 2: result='미풍';
            break;
        case 3: result='약풍';
            break;
        case 4: result='강풍';
            break;
		default: result='설정';
            break;
    }
    return result;
}

function getTextAirconMode(val){
    var result='';

    switch(val){
        case 'Auto': result='자동';
            break;
        case 'Cool': result='냉방';
            break;
        case 'Dry': result='제습';
            break;
        case 'Wind': result='송풍';
            break;
        default: result='설정';
            break;
    }
    return result;
}

function getTextMode(val) {
    var result = '';
    switch (Number(val)) {
        case 0:
            result = 'Auto';
            break;
        case 1:
            result = 'Cool';
            break;
        case 2:
            result = 'Dry';
            break;
        case 3:
            result = 'Wind';
            break;
        default:
            result = '';
            break;
    }
    return result;
}

function getTextModeRobot(val) {
    var result = '';
    switch (Number(val)) {
        case 0:
            result = 'Turbo_On';
            break;
        case 1:
            result = 'Turbo_Off';
            break;
        case 2:
            result = 'Turbo_Silence';
            break;
    }
    return result;
}
function getNumberMode(val) {
    var result = '';
    switch (val) {
        case 'Auto':
            result = 0;
            break;
        case 'Cool':
            result = 1;
            break;
        case 'Dry':
            result = 2;
            break;
        case 'Wind':
            result = 3;
            break;
    }
    return result;
}


function getTextDishwasherMode(_mode){

    switch(_mode){
        case 'Finish':
            return '종료중';
            break;
        case 'Delaywash':
            return '예약 행정중';
            break;
        case 'Predrain':
            return '선배수중';
            break;
        case 'Prewash':
            return '예비세척중';
            break;
        case 'Wash':
            return '세척중';
            break;
        case 'Rinse':
            return '헹굼중';
            break;
        case 'Drying':
            return '건조중';
            break;
        case 'Ready':
            return 'OFF';
            break;
        case 'Pause':
            return '일시정지';
            break;
        case 'Run':
            return '건조중';
            break;
        default:
            return '---';
            break;

    }
}


function getTextOven(_mode){

    switch(_mode){
        case 'Run':
            return '가열중';
            break;
        case 'Ready':
            return 'OFF';
            break;
        default:
            return '---';
            break;
    }
}



function getTextRobotMode(_mode) {
    for(var key in _mode) {
		switch (_mode[key]) {
			case 'Control_Cleaning':
				return '청소중';
				break;
			case 'Control_Idle':
				return '대기중';
				break;
			case 'Control_Alarm':
				return '알람발생';
				break;
			case 'Control_Charging':
				return '충전중';
				break;
			case 'Control_PowerOff':
				return '전원 OFF';
				break;
			case 'Control_Reserve':
				return '예약 됨';
				break;
			case 'Control_Point':
				return '포인트 클리닝';
				break;
			case 'Control_After':
				return '충전 복귀 중';
				break;
			case 'Control_Pause':
				return '일시 정지';
				break;
            case 'Control_Homing':
                return '정지';
                break;

		}
    }
}


function getTextRobotCleaningMode(_mode) {
    for(var key in _mode) {
        switch (_mode[key]) {
            case 'Turbo_On':
                return '터보';
                break;
            case 'Turbo_Off':
                return '일반';
                break;
            case 'Turbo_Silence':
                return '정음';
                break;
            default :
                return '설정';
        }
    }
}

function getTextRobotModeIndex(_mode) {
    for(var key in _mode) {
        switch (_mode[key]) {
            case 'Turbo_On':
                return 0;
                break;
            case 'Turbo_Off':
                return 1;
                break;
            case 'Turbo_Silence':
                return 2;
                break;
        }
    }
}

function getTextWasherMode(_mode){

    switch(_mode){
        case 'Finish':
            return '종료중';
            break;
        case 'Delaywash':
            return '예약 행정중';
            break;
        case 'Weightsensing':
            return '무게감지중';
            break;
        case 'Prewash':
            return '예비세탁중';
            break;
        case 'Wash':
            return '세탁중';
            break;
        case 'Rinse':
            return '헹굼중';
            break;
        case 'Spin':
            return '탈수중';
            break;
        case 'Drying':
            return '건조중';
            break;
        case 'Cooling':
            return '냉각중';
            break;
        case 'Wrinkleprevent':
            return '구김방지중';
            break;
        case 'Airwash':
            return '에어워시중';
            break;
        default:
            return '---';
            break;
    }
}