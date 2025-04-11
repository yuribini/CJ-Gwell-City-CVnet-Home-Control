
var now_js_name = "tablet/tablet_home.js";
var finedustSlider; // 미세먼지 그래프 변수
var deviceId = "0";
var tokenId = "0";
var appVersion = '1.0';
var bDocumentLoaded= false;
var bTryAutoLogin = false;
var dong,ho;
var versionInfo = null, pluginPush = null , pluginCall = null,pluginVoice = null;
//for lock number button
var tempNumber='';
var numCnt=0;
var numValue = '';
//font size
var fontSizeSetting = false;
//모드제어 변경
var WEBSOCK_ADDRESS = null, wsClientGuard;
var guardJson_id, guardJson_dev, guardJson_remote_addr;
var nowHouseMode, preHouseMode;
var badgeinfo;
var isControlMode = false;
var swStatus = false;
var strAgent;
var isCctvDemo = false;
var isDemoMode = false;
var isShowRoomMode = false;
var site_name;
var site_lang,site_wlocation;
var btnSpan;
var bPhoneGap;

var wsClientWholeLight, wholeLightJson_id, wholeLightJson_dev, wholeLightJson_remote_addr,subscribedWholeLight;
var wholeLightSW = null; //일괄소등 스위치
var samsung_code = "";
var userId, complexName;
var isSettingBack=0;
var userInfo = {
	user_id : '',
	dong : '',
	ho : '',

};
var swiper;
(function() {
	strAgent = navigator.userAgent.toLowerCase();

    if(localStorage.getItem("config_autologin") != 1){
        sessionStorage.clear();
    }
    if(strAgent.match('site_se')){
        site_name = 'SE';
    }else if(strAgent.match('site_kolon')){
        site_name = 'KOLON';
    }else if(strAgent.match('site_lct')){
        site_name = 'LCT';
    }else if(strAgent.match('site_cv')){
        site_name = 'CV';
    }else if(strAgent.match('site_test')){
        site_name = 'CV';
    }else if(strAgent.match('site_raemian')){
        site_name = 'RAEMIAN';
    }else{
		site_name = 'CV';
	}
    console.log('strAgent :  ')

	if(strAgent.match('cordova_tablet') && strAgent.match('android'))
	{
		bPhoneGap = true;
		console.log(now_js_name + "... is phone gap...");

		var headTag = document.getElementsByTagName("head")[0];
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.onload = function() {
			console.log("loaded cordova javascript succeed : " + now_js_name);
			loadNativeInterfacePlugin();
		};
		newScript.src = '/resources/cvnet/scripts/common/cordova.js?ver=2017121301';
		headTag.appendChild(newScript);
		return;
	}

	if(strAgent.match('cordova_tablet') && strAgent.match('iphone'))
	{
		bPhoneGap = true;
		console.log(now_js_name + "... is phone gap...");
		var headTag = document.getElementsByTagName("head")[0];
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.onload = function() {
			//alert('loaded cordova javascript succeed');
			console.log("loaded cordova javascript succeed : " + now_js_name);
			loadNativeInterfacePlugin();
		};
		newScript.src = '/resources/cvnet/scripts/common/cordova_ios.js?ver=2017121301';
		headTag.appendChild(newScript);
		return;
	}
	console.log(now_js_name + "... is not phone gap...");
	bPhoneGap = false;
})();

function loadNativeInterfacePlugin()
{
	var headTag = document.getElementsByTagName("head")[0];
	var newScript = document.createElement('script');
	newScript.type = 'text/javascript';
	newScript.onload = function()
	{
		console.log("loaded cordova loadNativeInterfacePlugin : " + now_js_name);
		document.addEventListener("deviceready", onDeviceReady, false);
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
	};

	newScript.src = '/resources/cvnet/scripts/common/plugin_native_interface.js?ver=2020052702';
	headTag.appendChild(newScript);
	return;
}


/// Token ID 받는 콜백 함수 정의..
var funcGetTokenId = function onResult(_tokenId)
{
	console.log("onResult tokenId: " + _tokenId);
	tokenId = _tokenId;
};


/// 음성제어
var funcGetVoiceInfo = function onResult(_voiceInfo){
	console.log("onResult _voiceInfo: " + _voiceInfo);
	voiceControl(_voiceInfo);
}

function onDeviceReady()
{

	console.log("onDeviceReady(): " + now_js_name);
	if(typeof device === "undefined")
	{
		console.log('no phonegap');
	}
	else
	{
		var tempDeviceId = device.uuid;

		deviceId = tempDeviceId.replace(/\-/g,'');

		if(strAgent.match('cordova_tablet') && strAgent.match('android'))
		{   
			pluginPush = new PushPlugin();
			pluginPush.getToken(funcGetTokenId);

			pluginVoice = new VoiceControlPlugin();

		}else if(strAgent.match('cordova_tablet') && strAgent.match('iphone')){
			function success(token){
				tokenId = token;
			}
			function error(error){
				//alert(error);
			}
			FCMPlugin.getToken(success, error);
		}

		console.log("deviceId: " + deviceId);
		onDocumentReady();
		var configCreate = localStorage.getItem("config_create");
		if(configCreate != null && configCreate == 0){
			localStorage.setItem("config_create",1);
			onResume();
		}
	}
}

function onPause()
{
	console.log("-----------------onPause(): " + now_js_name);
	//alert('onPause');
	localStorage.setItem("config_create",0);
	connectGuard(guardJson_id, guardJson_dev);
}

function onResume(){
	//showMessage('onResume');
	localStorage.setItem("config_create",1);
	console.log("-----------------onResume(): " + now_js_name);
	existLockScreen(0);
	connectGuard(guardJson_id, guardJson_dev);
	//badgeinit();
}

$(document).ready(function()
{
	if(bPhoneGap == false)
	{
		onDocumentReady();
	}
});


function sendMsgToIframe(msg){
	
	var child=document.getElementById("mainFrame");
	if (child)
	{
		child.contentWindow.postMessage(msg,'*');
	}
}



function onDocumentReady()
{
	//이미지 동적 높이 설정
    getSiteInfo();
	setTimeout(function() { // 30분 단위로 반복 호출
		var documentHight = $( window ).height();
		$('#mainFrame').height(documentHight - 100);
	}, 200);


	if(bDocumentLoaded == true)
	{
		return;
	}

	console.log("on document ready..." + now_js_name);

	bDocumentLoaded = true;
	/// do something.......



	//날씨 지역정보 가져오기
    // getSiteWlocation();

	//웹소켓 정보 가져오기
	getWebsockAddress();

	//폰트 css 가져오기
	//setFontSizeCSS();

/*
	setInterval(function() { // 30분 단위로 반복 호출
		getWeatherInfo();
	}, 1800000);
*/
/************************************************************************
 *                       미세먼지 그래프 init
 ************************************************************************/
	finedustSlider = $('#finedust_volum').slider({
		tooltip:'hide',
		inDrag: false,
		enabled:false,
		over: false,
		formatter: function(value) {
			return ;
		}
	});

/************************************************************************
 *                        bind for active effect
 ************************************************************************/

	$('.tablet_btn_popup_modeControl_ok').bind('touchstart mousedown touchend mouseup', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('.tablet_btn_popup_modeControl_cancel').bind('touchstart mousedown touchend mouseup', function() {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.tablet_btn_popup_weather_cancel').bind('touchstart mousedown touchend mouseup', function() {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.number').bind('touchstart mousedown touchend mouseup', function(e) {
		e.preventDefault();
		$(this).toggleClass('num_active_effect');
	});

	$('.btn_deleteNum').bind('touchstart mousedown touchend mouseup', function(e) {
		e.preventDefault();
		$(this).toggleClass('btn_deleteNum_active_effect');
    });
    
    $('.btn_popup_innerhome_ok').bind('touchstart mousedown touchend mouseup', function(e) {
        $(this).toggleClass('btnMainColor_active');
    });

    $('.btn_popup_innerhome_cancel').bind('touchstart mousedown touchend mouseup', function(e) {
        $(this).toggleClass('btnGrayColor_active');
    });



	// number button event init
	for(var i =0; i <= 9; i++){
		$("#number"+i).bind("touchstart mousedown click", function(){
			btn_num($(this).html());
		});
	}
	$("#btn_delete").bind("touchstart mousedown click", function(){
		btn_delete();
	});
	
    window.addEventListener( 'message', receiveMsgFromIframe );
}

function receiveMsgFromIframe( e ) {
    console.log( 'close event from iframe ', e.data );
	if (isSettingBack==1){
		$('#mainFrame').show();
		$('#samsung').hide();
		$('#content_tab').hide();
		$("#mainFrame").attr("src", "setting.view");
	}else{
		$('#samsung').hide();
		$('#content_tab').hide();
		disconnect();
		$("#mainFrame").attr("src", "about:blank");
		$('#mainFrame').hide();
		badgeinit();
	}

}

/************************************************************************
 *                           Button Evnet
 ************************************************************************/

// 터치 또는 클릭시 Down evnet init
$(document).on('touchstart mousedown touchend mouseup', '.btn_group', function(event){
	console.log('touch');
	$(this).find( ".btn_shape" ).toggleClass('btn_hover');
});

// 모드 변경 팝업
$(document).on('click', '#btn_house_mode', function(){

	if(preHouseMode == 0){
		return;
	}

	$('#mode_goout_on').hide();
	$('#mode_inhouse_on').hide();
	$('#mode_sleep_on').hide();
	requestGuardStatus();
	$('#popup_modeControl').show();
	$('.modal').show();

    if(isDemoMode){
        $('#mode_goout_on').hide();
        $('#mode_inhouse_on').show();
        $('#mode_sleep_on').hide();
    }
});



$(document).on('click', '.tablet_btn_popup_modeControl_ok', function(){

	if(preHouseMode == undefined || preHouseMode == ''  || isNaN(preHouseMode) ){
		showMessage('댁내 월패드와 단지서버간 접속이 원활치 않습니다.');
		return;
	}

	if(preHouseMode == nowHouseMode){
		var str='';
		switch(nowHouseMode){
			case 1 : str = '현재 외출모드입니다.';
				break;
			case 2 : str = '현재 재실모드입니다.';
				break;
			case 3: str = '현재 취침모드입니다.';
				break;
		}
		showMessage(str);
		return;
	}

	isControlMode =true;
	existLockScreen(2);
	swStatus = true;

	$('#popup_modeControl').hide();
	$('.modal').hide();

});

$(document).on('click', '.tablet_btn_popup_modeControl_cancel', function(){
	isControlMode =false;
	tempHouseMode(preHouseMode);
	$('#popup_modeControl').hide();
	$('.modal').hide();
});

// 오늘의 날씨 팝업
$(document).on('click', '#btn_weather', function(){
	//gotoHome(); // 하위페이지에서 접근할때를 위해
	$('#popup_weather').show();
	$('.modal').show();
});

$(document).on('click', '.tablet_btn_popup_weather_cancel', function(){
	$('#popup_weather').hide();
	$('.modal').hide();
});

//음성
$(document).on('click', '#btn_mic_google', function(){

	var value = 0;
    if(site_lang == 'jp'){
        value= 1;
    }else if(site_lang == 'en'){
		value= 1;
	}else if(site_lang == 'ch'){
		value= 2;
	}

	pluginVoice.control(funcGetVoiceInfo,"control",value);

});
//음성
$(document).on('click', '#btn_mic_naver', function(){

    var value = 0;
    if(site_lang == 'jp'){
        value= 1;
    }else if(site_lang == 'en'){
        value= 2;
    }else if(site_lang == 'ch'){
        value= 3;
    }

    pluginVoice.control(funcGetVoiceInfo,"controln",value);

});

//귀가 모드 실행
$(document).on('click', '#btn_homeMode', function(){
    console.log(' popup_innerhome')
	$('#popup_innerhome').show();
	$('.modal').show();
});

$(document).on('click', '.btn_popup_innerhome_ok', function(){
	// 귀가 모드 실행
	$('#popup_innerhome').hide();
	$('.modal').hide();

	var mode_config = [
		localStorage.getItem("config_home_light_on"),
		localStorage.getItem("config_home_curtain_open"),
		localStorage.getItem("config_home_aircon_on"),
		localStorage.getItem("config_home_heating_on"),
	]
    console.log('귀가 모드 실행 : ', mode_config);
    console.log('귀가 모드 실행 config_home_light_on : ', mode_config[0]);
    console.log('귀가 모드 실행 config_home_curtain_open : ', mode_config[1]);
    console.log('귀가 모드 실행 config_home_aircon_on : ', mode_config[2]);
    console.log('귀가 모드 실행 config_home_heating_on : ', mode_config[3]);
	if(mode_config[0] == '1'){ // 조명
		sendVoiceData(JSON.stringify({
			type : 2,
			zone : 1,
			group : 0,
			control : 1
		}))
	}
	
	if(mode_config[1] == '1'){ // 커튼
		sendVoiceData(JSON.stringify({
			type : 3,
			zone : 0,
			group : 0,
			control : 1
		}))
    }
    
    if(mode_config[2] == '1'){ // 에어컨
		sendVoiceData(JSON.stringify({
            type:4,
            zone:1,
            onoff:1,
            running:1,
            operation:-1,
            setting_temp:-1,
            wind:-1,
            timer:-1
        }))

        sendVoiceData(JSON.stringify({
            type:4,
            zone:2,
            onoff:1,
            running:1,
            operation:-1,
            setting_temp:-1,
            wind:-1,
            timer:-1
        }))

    }
    
    if(mode_config[3] == '1'){ // 난방
		sendVoiceData(JSON.stringify({
			type : 6,
			zone : 1,
			group : 0,
			control : 1
		}))
	}
    
});

$(document).on('click', '.btn_popup_innerhome_cancel', function(){
	// 귀가 모드 실행
	$('#popup_innerhome').hide();
	$('.modal').hide();
});


//통화
$(document).on('click', '#btn_call', function(){
	//phoneCall();
	
		
	var to = localStorage.getItem('to');
	var from = localStorage.getItem('from');
	var caller = localStorage.getItem('caller');
	localStorage.setItem('callpush', 'n');
	//e.preventDefault();
	// https://cvnetrndsh01.uasis.com/cvnet/tablet/tablet_webrtc_call.view?from=01010101&to=01020102&caller=0&push=n;
	
	$("#mainFrame").attr("src", "webrtc_call.view?from=" + from + '&to=' + to + '&caller=0&push=p');
	$('#mainFrame').show();
	
	//$("#mainFrame").attr("src", "webrtc_call.view");
	//mainFrameShow();
	
});

//관리비
$(document).on('click', '#btn_maintCost', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "maint_cost.view");
});

//공지사항
$(document).on('click', '#btn_notice', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "notice_list.view");
});

//입차통보
$(document).on('click', '#btn_enterCar', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "enter_car.view");
});

//가스
$(document).on('click', '#btn_gas', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "gas.view");
});

//스마트 플러그
$(document).on('click', '#btn_smartPlug', function(){
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "smartplug.view");
});
//대기전력
$(document).on('click', '#btn_concent', function(){
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "concent.view");
});
//난방
$(document).on('click', '#btn_heating', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "heating.view");
});

//환기
$(document).on('click', '#btn_ventilator', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "ventilator.view");
});

//냉방
$(document).on('click', '#btn_aircon', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "aircon.view");
});

//커튼
$(document).on('click', '#btn_curtain', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "curtain.view");
});

//조명
$(document).on('click', '#btn_light', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "light.view");
});
//일괄소등
$(document).on('click', '#btn_wholeLight', function(e){
    $('#popup_wholeLight').show();
    $('.modal').show();
});

//비상리스트
$(document).on('click', '#btn_emergency', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "emergency_list.view");
});

//환기
$(document).on('click', '#btn_visitor', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "absence_visitor.view");
});

//cctv
$(document).on('click', '#btn_cctv', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "cctv.view");
});

//원격검침
$(document).on('click', '#btn_telemetering', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "telemetering.view");
});

//원격검침
$(document).on('click', '#btn_parcel', function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "parcel.view");
});

// 위치 조회
$(document).on('click', '#btn_location', function(){
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "location.view");
});

// 위치 조회
$(document).on('click', '#btn_enterRecord', function(){
    console.log('btn_enterRecord~!!')
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "enter_record.view");
});

// 전기차
$(document).on('click', '#btn_electricCar', function(){
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "electric_car.view");
});
// menu
$('#btn_menu').click(function(){
	var subsrc=document.getElementById('mainFrame').src;
	isSettingBack=0;
	if (subsrc.indexOf('webrtc_call.view')!=-1){
       sendMsgToIframe('close_call');
	   
	   
	}else{
		$("#mainFrame").attr("src", "about:blank");
	    $('#mainFrame').hide();
	}
    $('#samsung').hide();
    disconnect();
	badgeinit();
});

// menu
$('.btn_logo').click(function(){
 var subsrc=document.getElementById('mainFrame').src;
	isSettingBack=0;
	if (subsrc.indexOf('webrtc_call.view')!=-1){
       sendMsgToIframe('close_call');
	   
	   
	}else{
		$("#mainFrame").attr("src", "about:blank");
	    $('#mainFrame').hide();
	}


	$('#samsung').hide();

    disconnect();
	badgeinit();
});

// 데모 엘레베이터, 통화

$(document).on('click', '#btn_cctvdemo', function(){
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "demo/cctv.view");
})

$(document).on('click', '#btn_elevatordemo', function(){
    console.log('btn_elevatordemo touch');
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "demo/elevator.view");
})

$(document).on('click', '#btn_elevator', function(){
    console.log('btn_elevator touch');
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "elevator.view");
})

$(document).on('click', '#btn_vote', function(){
    console.log('btn_vote touch');
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "vote.view");
})


$(document).on('click', '#btn_calldemo', function(){
    console.log('btn_elevatordemo touch');
    $('#mainFrame').show();
    // $("#mainFrame").attr("src", "tablet_webrtc_call.view");
    localStorage.setItem('homecall', 'n'); // 1: on , 0 : off
	var to = localStorage.getItem('to');
	var from = localStorage.getItem('from');
	var caller = localStorage.getItem('caller');
   // $("#mainFrame").attr("src", "./mobile_webrtc_call.view?from=" + from + '&to=' + to + '&caller='+ caller);
   //webrtc_call.view?from=03079000&to=03070303&caller=6
   // caller - 1 : 현관통화, 2 : 공동현관, 5 : 세대, 8 : 세대, 6 : 경비실, 7 : 관리실
   $('#mainFrame').attr('src', './webrtc_call.view?from='+ from + '&to=' + to + '&caller=0')
    
})

$(document).on('click', '#btn_callWebRTC', function(){
    console.log('btn_callWebRTC touch');
    $('#mainFrame').show();
    // $("#mainFrame").attr("src", "tablet_webrtc_call.view");
    localStorage.setItem('callpush', 'n');
    localStorage.setItem('homecall', 'n'); // 1: on , 0 : off
	var to = localStorage.getItem('to');
	var from = localStorage.getItem('from');
	var caller = localStorage.getItem('caller');
   // $("#mainFrame").attr("src", "./mobile_webrtc_call.view?from=" + from + '&to=' + to + '&caller='+ caller);
   //webrtc_call.view?from=03079000&to=03070303&caller=6
   // caller - 1 : 현관통화, 2 : 공동현관, 5 : 세대, 8 : 세대, 6 : 경비실, 7 : 관리실
   $('#mainFrame').attr('src', './webrtc_call.view?from='+ from + '&to=' + to + '&caller=0')
    
})

$(document).on('click', '#btn_stplugin', function(){
    console.log('btn_stplugin touch');
    pluginCall = new CallPlugin();
    pluginCall.callSTplugin();
})



$(document).on('click', '#btn_doorlockdemo', function(){
    console.log('btn_doorlockdemo touch');
    let apt_url = window.location.host;
    let send_data = {
        "apt_url": apt_url,
        "dong": userInfo.dong,
        "ho": userInfo.ho,
        "userId": userId,
        "type": "CSHDOORLOCK",
        "id": "CSH10005801010101510000",
        "operation": {
            "control": "open"
        }
    };
    $.ajax({
        url: "https://test-lab.uasis.com:30020/control",
        type: "POST",
        contentType:"application/json; charset=utf-8",
        dataType : "json",
		data : JSON.stringify(send_data),
        crossDomain : true,
        success: function(data)
        {

            console.log("data:", data);
            if(data.result.status == '000'){

			}else{
				alert(data.result.message)
			}

        },
        error: function(xhr,status,error)
        {
            console.log("/tablet/mainmenu_info.do - code:"+xhr.status+"\n"+"error:"+error);
            // if(xhr.status == 401 || xhr.status == 0)
            // {
            //     autoLoginCheck("mainmenu_info.do");
            //     bRet = false;
            // }
        },

    });

})


// setting
$('#btn_setting').click(function(){
	var subsrc=document.getElementById('mainFrame').src;
	isSettingBack=1;
	if (subsrc.indexOf('webrtc_call.view')!=-1){
       sendMsgToIframe('close_call');
	   
	}else{
		$('#mainFrame').show();
		$('#samsung').hide();
		$("#mainFrame").attr("src", "setting.view");

	}

});

// 우리집 모니터링
$('.btn_dashboard').click(function(){
	$('#mainFrame').show();
	$("#mainFrame").attr("src", "dash.view");
});

// 삼성스마트 홈
$(document).on('click', '#btn_samsung', function(){

    //var samsung_code = $('#samsung_access_data').val();
    //localStorage.removeItem('samsung_code');
    //var code = localStorage.getItem("samsung_code");
    //if(isDemoMode) return;
    if(samsung_code != "" ){
        $(".samsung_smarthome").show();
        samsung_api_init();
        isContentPage = false;
    }else if(localStorage.getItem("samsung_code") != null) {
        var code = localStorage.getItem("samsung_code");
        samsung_code =  JSON.parse(code);
        getUser(samsung_code.client_id, samsung_code.access_token);
        $(".samsung_smarthome").show();
        isContentPage = false;
        //console.log('samsung_code : :: ',samsung_code)
    }else{
        localStorage.removeItem('samsung_code');
        $("#form_doc")[0].submit();
    }
    //mainFrameShow();	5180EEA9949F
});

// 일괄소등 변경 팝업 - 변경
$(document).on('click', '.btn_popup_wholeLight_ok', function(){
    controlWholeLight();
    $('#popup_wholeLight').hide();
    $('.modal').hide();
});

// 일괄소등 변경 팝업 - 취소
$(document).on('click', '.btn_popup_wholeLight_cancel', function(){
    $('#popup_wholeLight').hide();
    $('.modal').hide();
});


//모드 제어 변경
$('#mode_goout').click(function(){
	tempHouseMode(1);
});

$('#mode_inhouse').click(function(){
	tempHouseMode(2);
});

$('#mode_sleep').click(function(){
	tempHouseMode(3);
});





/************************************************************************
 *                             AJAX
 ************************************************************************/
//// 홈 메뉴 정보 얻는 함수....동기 방식...
function getMainMenuInfo(_site)
{
	// 비동기가 아닌 동기처리를 하여 메뉴정보를 얻어 메뉴 구성을 바꾼다.
	var bRet = false;
	console.log('_site : , ', _site)
	$.ajax({
		url: "mainmenu_info.do",
		type: "post",
		dataType: "json",
		cache: false,
		async: false,						// *** 동기방식으로 처리한다....메뉴 먼저 얻어야하므로....
		success: function(data)
		{
			if (data.result == 1) {
                console.log("_site:", _site);
				console.log("data:", data);
				console.log('site_lang : ', site_lang)
				// 메뉴 구성을 바꾸는 코드....
				// data.isCall, isLight, isGas ,...
				var output = '';
                var info;
                console.log('_site.indexOf(\'LCT\') : ', _site.indexOf('LCT'))
				try{
                    info = data[_site].mainmenu_tablet_info;
				}catch (e) {
                    getMainMenuInfo('LCT')
                }

				console.log('info : ', info)
				/*for (var i = 0; i < 19; i++) {
					$('.btn_group_space').html(getButtonDiv(info));


                }*/
                if(info !== undefined){
                    $('.btn_group_space').empty();
                    $('.btn_group_space').append(getButtonDiv(info));
                    $('.btn_group_space').append('<div class="swiper-pagination"></div>');
    
                    if(info.isDemoMode == 1){
                        isDemoMode = true;
                        $('.house_mode').html($.lang[site_lang]['mode_occupied']+' ON');
                    }else{
                        isDemoMode = false;
                    }
    
                    if(info.isShowRoomMode == 1){
                        isShowRoomMode = true;
                    }else{
                        isShowRoomMode = false;
                    }
    
                    if(info.isCctvDemo == 1){
                        isCctvDemo = true;
                    }else{
                        isCctvDemo = false;
                    }
    
                    //뱃지 정보 가져오기
                    //getBadgeInfo(3);
                    bRet = true;
                }
               
			}
			else // data.result: 0 or -1
			{
				console.log("Login Session Expired - no autologin info....code: " + data.result);
				autoLoginCheck("mainmenu_info.do");
			}

		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/mainmenu_info.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				autoLoginCheck("mainmenu_info.do");
				bRet = false;
			}
		},

	});

	/////////
	/// 동기 방식이므로 위의 아작스 응답 처리가 마무리 되어야 이 다음이 수행된다...
	return bRet;
}

//날씨 정보
function getWeatherInfoTemp(value){
    console.log(value.query);

    var jsonData = value.query.results.channel;
	var today_low_temp,
		today_high_temp;

	if(jsonData.item.forecast.length >= 1){
        today_low_temp = jsonData.item.forecast[0].low;
        today_high_temp = jsonData.item.forecast[0].high;
	}else{
        today_low_temp = jsonData.item.forecast.low;
        today_high_temp = jsonData.item.forecast.high;
	}

    var data = {
    	curr_temp:changeWeatherValue(jsonData.item.condition.temp),
        today_weather_icon:getWeatherIcon(jsonData.item.condition.text),
        today_weather_text:jsonData.item.condition.text,
        today_low_temp:changeWeatherValue(today_low_temp),
        today_high_temp:changeWeatherValue(today_high_temp)
	}

    console.log(data.curr_temp);  //현재 온도 (예:-5.5)
    $('.temperature').html(data.curr_temp+"°");
    $('.now_temperature').html(data.curr_temp+"°");

    $(".slider-handle").css({"background-image":"linear-gradient(to bottom, #ffffffff 0%, #ffffffff 100%)"});


    var icon_num = data.today_weather_icon;

    $(".weather").removeClass('weather_icon_1');
    $(".weather").removeClass('weather_icon_2');
    $(".weather").removeClass('weather_icon_3');
    $(".weather").removeClass('weather_icon_5');
    $(".weather").removeClass('weather_icon_6');
    $(".weather").removeClass('weather_icon_10');

    $(".weather_image").removeClass('w_image1');
    $(".weather_image").removeClass('w_image2');
    $(".weather_image").removeClass('w_image3');
    $(".weather_image").removeClass('w_image5');
    $(".weather_image").removeClass('w_image6');
    $(".weather_image").removeClass('w_image10');


    console.log('icon_num:',icon_num);
    $(".weather").addClass('weather_icon_'+icon_num);
    $(".weather_image").addClass('w_image'+icon_num);

    $('.detail_weather').html(data.today_weather_text);

    if(site_lang == 'en'){
        $('.detail_weather').html('Today');
    }

    if(site_lang == 'ch'){
        $('.detail_weather').html('今日');
    }

    $('.detail_temperature').html(data.today_low_temp+' ~ '+ data.today_high_temp+"°");

    $('.finedust_space').hide();
    $('.span_weather_sub').html(site_wlocation);

    $('.tablet_btn_popup_weather_cancel').css("margin-top","40px");
    $('#popup_weather').css("height","340px");
}

//섭씨 화씨 변환
function changeWeatherValue(value){
   return Math.round(100/(212-32) * (value - 32));
}
//일본 날씨 아이콘
function getWeatherIcon(value){
	var result = 0;
	console.log("value:",value);
	switch(value){
		case "Sunny" :
        case "Hot" :
        case "Mostly Sunny" :
			result = 1;
			break;
        case "Partly Cloudy" :
        case "Mostly Cloudy" :
            result = 2;
            break;
		case "Cloudy" :
            result = 3;
            break;
        case "Showers" :
		case "Freezing Rain" :
			result = 5;
			break;
        case "Snow Flurries" :
        case "Snow" :
        case "Blowing Snow" :
        case "Snow Showers" :
        case "Heavy Snow" :
            result = 6;
            break;
		case "Light Snow Showers " :
            result = 10;
			break;
	}
    return result;
}

function getWeatherInfo()
{
	$.ajax({
		url: "weather.do",
		type: "post",
		dataType: "json",
		cache: false,
		success: function(data){
            console.log('날씨  : ', data)
			if(data.result == 1){
				console.log(data.curr_temp);  //현재 온도 (예:-5.5)
				$('.temperature').html(data.curr_temp+"°");
				$('.now_temperature').html(data.curr_temp+"°");

				$(".slider-handle").css({"background-image":"linear-gradient(to bottom, #ffffffff 0%, #ffffffff 100%)"});

				//console.log(data.today_weather_icon);  //날씨 아이콘 (예: '00', '01' ,'02', .. '99')

				var icon_num = parseInt(data.today_weather_icon,10);

				if(isDemoMode){
					icon_num = 1;
				}

				$(".weather").addClass('weather_icon_'+icon_num);
				$(".weather_image").addClass('w_image'+icon_num);

				$('.detail_weather').html(translation(data.today_weather_text));

				if(site_lang == 'en'){
					$('.detail_weather').html('Today');
                }
                
                if(site_lang == 'ch'){
					$('.detail_weather').html('今日');
				}
				$('.detail_temperature').html(data.today_low_temp+' ~ '+ data.today_high_temp+"°");

				//console.log(data.dust);  // 미세먼지 0 ~ 99999
				var finedust_condition;

				if(data.dust <= 30){
					finedust_condition = $.lang[site_lang]['fd_good'];
					$(".finedust_condition").css({"color":"#02a8fd"});
				}else if(data.dust <= 80){
					finedust_condition = $.lang[site_lang]['fd_normal'];
					$(".finedust_condition").css({"color":"#9ecc61"});
				}else if(data.dust <= 150){
					finedust_condition = $.lang[site_lang]['fd_bad'];
					$(".finedust_condition").css({"color":"#ffb300"});
				}else{
					finedust_condition = $.lang[site_lang]['fd_vary_bad'];
					$(".finedust_condition").css({"color":"#ff0300"});
				}

				$('.finedust_value').html(data.dust+'㎍/㎥');
				$('.finedust_condition').html(finedust_condition);
				// 미세먼지 설정
				var dustValue = data.dust;
				if( dustValue > 200){
					dustValue= 200;
				}

				//alert(dustValue);
				finedustSlider.slider('setValue', dustValue);
				finedustSlider.off();
			}
			else // data.result: 0 or -1
			{
				console.log("Login Session Expired - no autologin info....code: " + data.result);
				autoLoginCheck("weather.do");
			}
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/weather.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired");
				autoLoginCheck("weather.do");
			}
		},
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	  });
}


// 계정 정보 로그아웃
function logout()
{
	$.ajax({
		url: "logout.do",
		type: "post",
		dataType: "json",
		cache: false,
		success: function(data)
		{
            localStorage.setItem("config_autologin",0);
            localStorage.setItem("config_autologin_id",'');
            localStorage.setItem("config_autologin_pw",'');
            localStorage.setItem("config_autologin_tokenId",'');
			toLoginPage();
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/logout.do - code:"+xhr.status+"\n"+"error:"+error);
			toLoginPage();
		}
	});
}

//소켓정보가져오기
function getWebsockAddress(){
	$.ajax({
		url: "device_info.do",
		type: "post",
		data: {"type":"0x12"},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			if(data.result == 1)
			{
				console.log("getWebsockAddress data : ",data.websock_address);
				WEBSOCK_ADDRESS = data.websock_address;
				guardJson_id = data.id;
				guardJson_dev = 0x41.toString();
				guardJson_remote_addr =	data.tcp_remote_addr;
				connectGuard(guardJson_id, guardJson_dev);
			}
			else
			{
				console.log("time out");
				autoLoginCheck("device_info.do");
			}

		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/device_info.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				autoLoginCheck("device_info.do");
			}
		},
		beforeSend: function(xhr){
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}

//통화
function phoneCall(){

	/*var config_call = localStorage.getItem("config_call");
	if(config_call == 0 || config_call == null ){
		return;
	}*/
    var href = location.href;
    var tempHref = href.substring(7,70);
    var tempAddr = tempHref.split('/');
    pluginCall.invokeSipApp(userId,tempAddr[1],'mobile');

	pluginCall.callSipApp();

}
//뱃지

//통화
function getBadgeInfo(number){
    console.log('getBadgeInfo : ', number)
	/* $.ajax({
		url: "badge_info.do",
		type: "post",
        dataType: "json",
        async : false,
		cache: false,
		success: function(data){
			if(data.result == 1)
			{
				console.log("badge_info data:",data);
				badgeinfo = data.badgeinfo;

				if(badgeinfo.notice == 1){
					$('#btn_notice').prepend( '<div class="badge">N</div>');
				}else if(badgeinfo.notice > 1){
					$('#btn_notice').prepend( '<div class="badge">'+badgeinfo.notice+'</div>');
				}

				if(badgeinfo.visitor == 1){
					$('#btn_visitor').prepend( '<div class="badge">N</div>');
				}else if(badgeinfo.visitor > 1){
					$('#btn_visitor').prepend( '<div class="badge">'+badgeinfo.visitor+'</div>');
				}

				if(badgeinfo.parcel == 1){
					$('#btn_parcel').prepend( '<div class="badge">N</div>');
				}else if(badgeinfo.parcel > 1){
					$('#btn_parcel').prepend( '<div class="badge">'+badgeinfo.parcel+'</div>');
				}
			}
			else
			{
				console.log("서버와의 접속이 끊겼습니다.");
				autoLoginCheck('badge_info.do');
			}
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/sip_info.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				autoLoginCheck('badge_info.do');
			}
		},
		beforeSend: function(xhr){
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	}); */
}


/************[잠금해제 사용여부 정보 가져오기]*************/
function existLockScreen(type)
{

	$.ajax({
		url: "exist_lockscreen_info.do",
		type: "post",
		data: {"deviceId":deviceId},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			if(data.result == 1)
			{
				console.log('setting_list.do data: ',data);
				//잠금해제번호 사용여부
				if(type == 0 && data.use == '1'){
					showLockScreen();
				}
				//제어시 사용
				if(type == 1 && data.use_control == '1'){
					showLockScreen();
				}
				//방범변경시 사용
				if(type == 2 && data.use_guard == '1'){
					showLockScreen();
				}else if(type == 2){
					controlGuardMode(nowHouseMode);
				}
			}else {
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("exist_lockscreen_info.do");
			}

		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/setting_list.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("exist_lockscreen_info.do");
			}
		},
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});

}




function checkLockPassword(pwd)
{

	if(deviceId == null || pwd == null || pwd.length <= 0)
	{
		return false;
	}

	$.ajax({
		url: "check_lockscreen.do",
		type: "post",
		data: {"deviceId":deviceId, "pwd":pwd},
		dataType: "json",
		cache: false,
		async:false,
		success: function(data)
		{

			if(data.result == 1)
			{
				if(data.check_pwd == 1)
				{
					$('#popup_lock').hide();
					if(isControlMode){
						controlGuardMode(nowHouseMode);
					}
					hideLockScreen();
				}
				else
				{
					btn_delete();
					$('#keypad_input').css({'letter-spacing':'0px'});
					$('#keypad_input').html('잠금해제번호가 틀립니다!');
					console.log("wrong password....code: " + data.result);
				}
			}
			else // data.result: 0 or -1
			{
				console.log("wrong password....code: " + data.result + "   deviceId: " + deviceId);
				autoLoginCheck("check_lockscreen.do");
			}
		},
		error:function(xhr,status,error)
		{
			console.log("tablet/check_lockscreen.do - code:"+xhr.status+"\n"+"error:"+error);
			autoLoginCheck("check_lockscreen.do");
		}
	});
}




/************[ 음성 제어 ]*************/
function voiceControl(voiceinfo){
    /*
        가스 - type : 1, zone : 1, group : 0
        난방 - type : 6, zone : 1, group : 0
        조명 - type : 2, zone : 1, group : 0

        에어컨 - type : 4, zone : 1, group :0
        커튼 - type : 3, zone : 1, group :0
        외출 - type : 99, zone : 1
        재실(귀가) - type : 99, zone : 2
    */
   console.log('voiceControl voiceinfo : ', voiceinfo)
   var voice_json = JSON.parse(voiceinfo)
   console.log('parseInt(voice_json.type) == 99 : ', parseInt(voice_json.type) == 99)
   console.log('parseInt(voice_json.type) == 1 : ', parseInt(voice_json.zone) == 1)
   console.log('외출 모드 : ', parseInt(voice_json.type) == 99 && parseInt(voice_json.zone) == 1)

   console.log('재실모드  : ', parseInt(voice_json.type) == 99 && parseInt(voice_json.zone) == 2)
   if(parseInt(voice_json.type) == 99 && parseInt(voice_json.zone) == 1){ // 외출 모드 : 1
        // 조명 + 커튼
        console.log('외출 모드 실행')
        sendVoiceData(JSON.stringify({
            type : 2,
            zone : 0,
            group : 0,
            control : 0
        }))
        sendVoiceData(JSON.stringify({
            type : 3,
            zone : 0,
            group : 0,
            control : 0
        }))


   }else if(parseInt(voice_json.type) == 99 && parseInt(voice_json.zone) == 2){ // 귀가 모드 : 2
        console.log('재실(귀가) 모드 실행')
        sendVoiceData(JSON.stringify({
            type : 2,
            zone : 1,
            group : 0,
            control : 1
        }))
        sendVoiceData(JSON.stringify({
            type : 3,
            zone : 0,
            group : 0,
            control : 1
        }))
        
    /* // 귀가 모드는 localstorage에서 확인 후 제어
        if(localStorage.getItem("config_home_light_on") == '1'){
            sendVoiceData({
                type : 2,
                zone : 1,
                group : 0,
                control : 1
            })
        }
        
        if(localStorage.getItem("config_home_curtain_open") == '1'){
            sendVoiceData({
                type : 3,
                localid : 0,
                control : 1
            })
        }
        
        if(localStorage.getItem("config_home_aircon_on") == '1'){
            sendVoiceData({
                type : 7,
                zone : 1,
                group : 0,
                control : 1
            })
        }
        
        if(localStorage.getItem("config_home_heating_on") == '1'){
            sendVoiceData({
                type : 6,
                zone : 1,
                group : 0,
                control : 1
            })
        } */
   }else if(parseInt(voiceinfo.type) == 99 && parseInt(voiceinfo.zone) == 3){ // 재실 모드 : 3
    // 귀가 모드는 localstorage에서 확인 후 제어

   }else{
       if(parseInt(voice_json.type) == 31){
           console.log('커튼 제어!!')
            voice_json.localid = voiceinfo.zone;
            voice_json.type = 3;
            sendVoiceData(JSON.stringify(voice_json));
       }else if(parseInt(voice_json.type) == 7){
        voice_json.type = 4;
        sendVoiceData(JSON.stringify({
            type : 4,
            zone : 1,
            onoff : voice_json.control,
			running: voice_json.control,
			operation : -1,
			setting_temp : -1,
            wind : -1,
			timer : -1,
        }))
        sendVoiceData(JSON.stringify({
            type : 4,
            zone : 2,
            onoff : voice_json.control,
			running: voice_json.control,
			operation : -1,
			setting_temp : -1,
            wind : -1,
			timer : -1,
        }))
       }else{
        console.log('---------- 제어 : ' , voiceinfo);
        if(parseInt(voice_json.type) == 31){
            voice_json.type = 3;
        }
        console.log('---------- 제어2 : ' , voiceinfo);
        sendVoiceData(voiceinfo);
       }
    
   }
	
   
}

function sendVoiceData(voiceinfo){
    
    console.log('sendVoiceData voiceinfo 7 : ', voiceinfo, ' / ', typeof voiceinfo)
    $.ajax({
        url: "voice_control.do",
        type: "post",
        data: {"voice_cmd": voiceinfo},
        dataType: "json",
        cache: false,
        success: function(data){
            console.log('data : ', data)
            if(data.result == 1){
                
            }else if(data.result == 0){
                console.log("Login Session Expired.... try AutoLogin...");
                // 자동로그인 체크..
                autoLoginCheck("voice_control.do");
            }else if(data.result == -1){
                //장비 음성 제어는 응답이 없으므로 타임아웃이 정상임
                console.log("time out");
            }
    
        },
        error: function(xhr,status,error)
        {
            alert("/tablet/voice_control.do - code:"+xhr.status+"\n"+"error:"+error);
            console.log("/tablet/voice_control.do - code:"+xhr.status+"\n"+"error:"+error);
            if(xhr.status == 401 || xhr.status == 0)
            {
                console.log("Login Session Expired.... try AutoLogin...");
                // 자동로그인 체크..
                autoLoginCheck("voice_control.do");
            }
        },
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
        }
    });
}

/// 자동 로그인 체크
function autoLoginCheck(_servletName)
{
	var ret = false;
	if(bTryAutoLogin == true)
	{
		bTryAutoLogin = false
		toLoginPage();
		return;
	}

	bTryAutoLogin = true;
    console.log('autoLoginCheck deviceId : ', deviceId)
    console.log('autoLoginCheck tokenId : ', tokenId)
	$.ajax({
		url: "auto_login_check.do",
		type: "post",
		data: {"name":_servletName, "deviceId":deviceId, "tokenId":tokenId},
		dataType: "json",
		cache: false,
		async: false,
		success: function(data)
		{
			//alert('data.result:'+data.result);
			
			if(data.result == 1)
			{
				ret = true;
				console.log("Auto Login Success: " + data.result);
				if(data.servlet_name == "weather.do")
				{
					getWeatherInfo();
				}
				else if(data.servlet_name == "mainmenu_info.do")
				{
					getMainMenuInfo();
				}
				else if(data.servlet_name == "device_info.do")
				{
					getWebsockAddress();
				}
				else if(data.servlet_name == "sip_info.do")
				{
					phoneCall();

				}else if(data.servlet_name == "badge_info.do")
				{
					getBadgeInfo(1);
				}
				else if(data.servlet_name == "check_lockscreen.do")
				{
					checkLockPassword(tempNumber);
				}
				else if(data.servlet_name == "exist_lockscreen_info.do")
				{
				 	existLockScreen(0);
					existLockScreen(2);
				}else if(data.servlet_name == 'voice_control.do'){
					// 자동로그인 성공 후 음성제어를 다시 호출 할 필요가 없음
				}

			}
			else // data.result: 0 or -1
			{
				console.log("Login Session Expired - no autologin info....code: " + data.result);
				toLoginPage();
			}
		},
		error:function(xhr,status,error)
		{
			console.log("tablet/auto_login_check.do - code:"+xhr.status+"\n"+"error:"+error);
			//if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired - no autologin info....");
				toLoginPage();
			}
		}
	});

	return ret;
}


/************************************************************************
 *                           Function
 ************************************************************************/

function toLoginPage(){
	//console.log('home에서 login.view');
	//location.href="login.view";
	
	$.ajax({
        url: "https://smartlife.uasis.com/clearcookie.do",
        type: "post",
        dataType: "json",
        cache: false,
        success: function(data){
			console.log('data : ', data)
			location.href="login.view";
        },
        error:function(xhr,status,error){
            showMessage("서버와 연결이 끊어졌습니다. [" + xhr.status + "]");
        }
    });
}

function gotoSite(value){
	$("#mainFrame").attr("src", value+".view");
}

function gotoHome(){
	$("#mainFrame").attr("src", "about:blank");
	$('#mainFrame').hide();
	badgeinit();
}

//number button event init
function showLockScreen(){
	$('#popup_lock').show();
	$('.modal').show();
	$('.notice_top').show();
}

function hideLockScreen(){
	$('#keypad_input').html('○○○○');
	$('#popup_lock').hide();
	$('.modal').hide();
	$('.notice_top').hide();
}

function setFontSizeCSS(){
	//폰트정보 가져오기
	var value = localStorage.getItem("config_fontsize");
	var d = new Date();
	var time = d.getTime();
	var normalFont = '/resources/cvnet/css/tablet/tablet_fontsize_normal.css?ver='+time;
	var large = '/resources/cvnet/css/tablet/tablet_fontsize_large.css?ver='+time;
	if(value == 0){
		$('head').append('<link id="normalFontcss" rel="stylesheet" href="'+normalFont+'" type="text/css" />');
	}else{
		$('head').append('<link id="largeFontcss" rel="stylesheet" href="'+large+'" type="text/css" />');
	}
}

function updateFontSizeCSS(value){
	var d = new Date();
	var time = d.getTime();
	var normalFont = '/resources/cvnet/css/tablet/tablet_fontsize_normal.css?ver='+time;
	var large = '/resources/cvnet/css/tablet/tablet_fontsize_large.css?ver='+time;
	if(value == 0){
		$('head').find("#largeFontcss").remove();
		$('head').append('<link id="normalFontcss" rel="stylesheet" href="'+normalFont+'" type="text/css" />');
	}else{
		$('head').find("#normalFontcss").remove();
		$('head').append('<link id="largeFontcss" rel="stylesheet" href="'+large+'" type="text/css" />');
	}
}

function btn_num(value){
	$('#keypad_input').css({'letter-spacing':'20px'});
	if(numCnt == 4){
		return;
	}

	tempNumber += value;
	//console.log(value);

	if(numCnt == 0){
		numValue = '●○○○';
	}else if(numCnt == 1){
		numValue = '●●○○';
	}else if(numCnt == 2){
		numValue = '●●●○';
	}else{
		numValue = '●●●●';
	}
	$('#keypad_input').html(numValue);

	numCnt++;

	//4자리 모두 입력하면...
	if(numCnt == 4){
		setTimeout(function(){
			console.log('tempNumber:',tempNumber);
			checkLockPassword(tempNumber);
			tempNumber='';
			numCnt=0;

		}, 500);
	}
	//console.log('tempNumber:',tempNumber);
}

function btn_delete(){
	$('#keypad_input').css({'letter-spacing':'20px'});
	if(numCnt > 0){
		numCnt--;
	}else{
		numCnt = 0;
	}
	if(numCnt == 0){
		value = '○○○○';
	}else if(numCnt == 1){
		value = '●○○○';
	}else if(numCnt == 2){
		value = '●●○○';
	}else if(numCnt == 3){
		value = '●●●○';
	}
	tempNumber = tempNumber.substring(0,numCnt);
	$('#keypad_input').html(value);
	//console.log('tempNumber',tempNumber);
}


//메인 메뉴버튼

function getButtonDiv(info){
	console.log('메인 메뉴 활성화 정보 : ', info)
	var output='';
    var totalCnt = 1;
    var infoCnt = 0;
    var cnt=1;
    var pageCnt = 15;
    console.log('site_name : ', site_name);
    if(info.isDemoMode == 1){
        pageCnt--;
    }
    if(site_name.indexOf('LCT') != -1){
        pageCnt = 15;
	}
    for(var key in info){
        if(info[key] == 1){
            infoCnt++;
        }
    }
    console.log('pageCntpageCntpageCntpageCntpageCnt : ', pageCnt);
    infoCnt = infoCnt - Number(info.isDemoMode);
    totalCnt = Math.ceil(infoCnt/pageCnt);
	
	// 페이지가 1건인 경우, 슬라이드 기능을 막음
	if(totalCnt == '1') { $('.btn_group_space').addClass('swiper-no-swiping') }
	
    output += '<div class="swiper-wrapper">';
    output += '<div class="swiper-slide"><div class="swiperCenter">';

   

    var test_flag = false;
	if(userId == 'guestm1') test_flag = true;

	if(userId == 'guestm2') test_flag = true;

	if(userId == 'guestt1') test_flag = true;

    if(info.isCallWebRTC == 1){
		try{
        pluginCall = new CallPlugin();
        pluginCall.enableWebRTC();
		}catch(ex){
			
		}
        output += '<div id="btn_call" class="btn_group">';
        output += '<div class="btn_style btn_call"></div>';
        //output += '<div class="btn_span">'+btnSpan[3]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_call"></div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

	

    if(info.isLight == 1){
        output += '<div id="btn_light" class="btn_group">';
        output += '<div class="btn_style btn_light"></div>';
        //output += '<div class="btn_span">'+btnSpan[12]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_light"></div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isWholeLight == 1){
        //일괄소등 정보 가져오기
        getWebsockAddressWholeLight();

        output += '<div id="btn_wholeLight" class="btn_group">';
        output += '<div class="btn_style btn_wholeLight_off"></div>';
        //output += '<div class="btn_span ">'+btnSpan[21]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_wholelight"></div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }


	if(info.isHeating == 1){
		output += '<div id="btn_heating" class="btn_group">';
		output += '<div class="btn_style btn_heating"></div>';
        //output += '<div class="btn_span">'+btnSpan[11]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_heating"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isAircon == 1){
		output += '<div id="btn_aircon" class="btn_group">';
		output += '<div class="btn_style btn_aircon"></div>';
        //output += '<div class="btn_span ">'+btnSpan[1]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_aircon"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isGas == 1){
		output += '<div id="btn_gas" class="btn_group">';
		output += '<div class="btn_style btn_gas"></div>';
        //output += '<div class="btn_span">'+btnSpan[10]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_gas"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}
    if(info.isSmartPlug == 1){
        output += '<div id="btn_smartPlug" class="btn_group">';
        output += '<div class="btn_style btn_smartPlug"></div>';
        output += '<div class="btn_span">'+btnSpan[22]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isConcent == 1){
        output += '<div id="btn_concent" class="btn_group">';
        output += '<div class="btn_style btn_concent"></div>';
        //output += '<div class="btn_span">'+btnSpan[23]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_standbypower"></div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

	if(info.isCurtain== 1){
		output += '<div id="btn_curtain" class="btn_group">';
		output += '<div class="btn_style btn_curtain"></div>';
        //output += '<div class="btn_span">'+btnSpan[5]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_curtain"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isVentilator == 1){
		output += '<div id="btn_ventilator" class="btn_group">';
		output += '<div class="btn_style btn_ventilator"></div>';
        //output += '<div class="btn_span">'+btnSpan[18]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_vent"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isDoorCamera== 1){
		output += '<div id="btn_doorCamera" class="btn_group">';
		output += '<div class="btn_style btn_doorCamera"></div>';
		output += '<div class="btn_span">'+btnSpan[6]+'</div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isMaintCost== 1){
		output += '<div id="btn_maintCost" class="btn_group">';
		output += '<div class="btn_style btn_maintCost"></div>';
        //output += '<div class="btn_span">'+btnSpan[14]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_maincost"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}
	if(info.isTelemetering == 1){
		output += '<div id="btn_telemetering" class="btn_group">';
		output += '<div class="btn_style btn_telemetering"></div>';
        //output += '<div class="btn_span">'+btnSpan[17]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_telemetering"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isNotice == 1){
		output += '<div id="btn_notice" class="btn_group">';
		output += '<div class="btn_style btn_notice"></div>';
        //output += '<div class="btn_span">'+btnSpan[15]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_notice"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isVisitor == 1){
		output += '<div id="btn_visitor" class="btn_group">';
		output += '<div class="btn_style btn_visitor"></div>';
        //output += '<div class="btn_span">'+btnSpan[19]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_visitor"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isCctv== 1){
		output += '<div id="btn_cctv" class="btn_group">';
		output += '<div class="btn_style btn_cctv"></div>';
        //output += '<div class="btn_span">'+btnSpan[4]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_cctv"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isParcel == 1){
		output += '<div id="btn_parcel" class="btn_group">';
		output += '<div class="btn_style btn_parcel"></div>';
        //output += '<div class="btn_span">'+btnSpan[16]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_parcel"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isElectricCar == 1){
		output += '<div id="btn_electricCar" class="btn_group">';
		output += '<div class="btn_style btn_electricCar"></div>';
        //output += '<div class="btn_span">'+btnSpan[24]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_electric"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

    if(info.isEnterCar== 1){
        output += '<div id="btn_enterCar" class="btn_group">';
        output += '<div class="btn_style btn_enterCar"></div>';
        //output += '<div class="btn_span">'+btnSpan[8]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_enterencecar"></div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

	if(info.isEmergency== 1){
		output += '<div id="btn_emergency" class="btn_group">';
		output += '<div class="btn_style btn_emergency"></div>';
        //output += '<div class="btn_span">'+btnSpan[7]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_emergency"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isAs== 1){
		output += '<div id="btn_as" class="btn_group">';
		output += '<div class="btn_style btn_as"></div>';
		output += '<div class="btn_span">'+btnSpan[2]+'</div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isEnterRecord == 1){
		output += '<div id="btn_enterRecord" class="btn_group">';
		output += '<div class="btn_style btn_enterRecord"></div>';
		output += '<div class="btn_span">'+btnSpan[9]+'</div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isLocation== 1){
		output += '<div id="btn_location" class="btn_group">';
		output += '<div class="btn_style btn_location"></div>';
        //output += '<div class="btn_span">'+btnSpan[13]+'</div>';
        output += '<div class="btn_span" data-langNum="home_menu_parkposition"></div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

	if(info.isSamsung== 1){
		output += '<div id="btn_samsung" class="btn_group">';
		output += '<div class="btn_style btn_samsung"></div>';
		output += '<div class="btn_span">'+btnSpan[20]+'</div>';
		output += '<div class="btn_shape"></div>';
		output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
	}

    if(info.isCctvDemo== 1){
        output += '<div id="btn_cctvdemo" class="btn_group">';
        output += '<div class="btn_style btn_cctv"></div>';
        output += '<div class="btn_span">'+btnSpan[4]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isElevatorDemo== 1){
        output += '<div id="btn_elevatordemo" class="btn_group">';
        output += '<div class="btn_style btn_elevator"></div>';
        output += '<div class="btn_span">'+btnSpan[25]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isElevator == 1){
        output += '<div id="btn_elevator" class="btn_group">';
        output += '<div class="btn_style btn_elevator"></div>';
        output += '<div class="btn_span">'+btnSpan[25]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isVote == 1){
        output += '<div id="btn_vote" class="btn_group">';
        output += '<div class="btn_style btn_vote"></div>';
        output += '<div class="btn_span">'+btnSpan[28]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isDoorLock == 1){
        output += '<div id="btn_doorlockdemo" class="btn_group">';
        output += '<div class="btn_style btn_doorlock"></div>';
        output += '<div class="btn_span">'+btnSpan[26]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    
    if(info.isSTplugin == 1){
        output += '<div id="btn_stplugin" class="btn_group">';
        output += '<div class="btn_style btn_stplugin"></div>';
        output += '<div class="btn_span">스마트싱스</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == pageCnt && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == pageCnt && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    output += '</div>';
	return output;
}


/*function getButtonDiv(info){
    var output='';

    var totalCnt = 1;
    var infoCnt = 0;
    var cnt=1;

    for(var key in info){
        if(info[key] == 1){
            infoCnt++;
        }
    }
    infoCnt = infoCnt - Number(info.isDemoMode);
    totalCnt = Math.ceil(infoCnt/6);

    output += '<div class="swiper-wrapper">';
    output += '<div class="swiper-slide"><div class="swiperCenter">';
    if(info.isCall == 1 && !strAgent.match('iphone')){
        output += '<div id="btn_call" class="btn_group">';
        output += '<div class="btn_style btn_call"></div>';
        output += '<div class="btn_span">'+btnSpan[3]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;

        pluginCall = new CallPlugin();
        if(bPhoneGap == true){
            /!*
			setTimeout(function(){
				var href = location.href;
				var tempHref = href.substring(7,70);
				var tempAddr = tempHref.split('/');
				pluginCall.invokeSipApp(userId,tempAddr[1],'mobile');
			}, 1000);
			*!/
        }

    }

    if(info.isLight == 1){
        output += '<div id="btn_light" class="btn_group">';
        output += '<div class="btn_style btn_light"></div>';
        output += '<div class="btn_span">'+btnSpan[12]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"> <div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }



    if(info.isWholeLight == 1){

        //일괄소등 정보 가져오기
        getWebsockAddressWholeLight();

        output += '<div id="btn_wholeLight" class="btn_group">';
        output += '<div class="btn_style btn_wholeLight_off"></div>';
        output += '<div class="btn_span">'+btnSpan[21]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"> <div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isHeating == 1){
        output += '<div id="btn_heating" class="btn_group">';
        output += '<div class="btn_style btn_heating"></div>';
        output += '<div class="btn_span">'+btnSpan[11]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isAircon == 1){

        output += '<div id="btn_aircon" class="btn_group">';
        output += '<div class="btn_style btn_aircon"></div>';
        output += '<div class="btn_span ">'+btnSpan[1]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isGas == 1){
        output += '<div id="btn_gas" class="btn_group">';
        output += '<div class="btn_style btn_gas"></div>';
        output += '<div class="btn_span">'+btnSpan[10]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isSmartPlug == 1){
        output += '<div id="btn_smartplug" class="btn_group">';
        output += '<div class="btn_style btn_smartplug"></div>';
        output += '<div class="btn_span">'+btnSpan[22]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isConcent == 1){
        output += '<div id="btn_concent" class="btn_group">';
        output += '<div class="btn_style btn_concent"></div>';
        output += '<div class="btn_span">'+btnSpan[23]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isVentilator == 1){
        output += '<div id="btn_ventilator" class="btn_group">';
        output += '<div class="btn_style btn_ventilator"></div>';
        output += '<div class="btn_span">'+btnSpan[18]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isCurtain== 1){
        output += '<div id="btn_curtain" class="btn_group">';
        output += '<div class="btn_style btn_curtain"></div>';
        output += '<div class="btn_span">'+btnSpan[5]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isMaintCost== 1){
        output += '<div id="btn_maintCost" class="btn_group">';
        output += '<div class="btn_style btn_maintCost"></div>';
        output += '<div class="btn_span">'+btnSpan[14]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isTelemetering == 1){
        output += '<div id="btn_telemetering" class="btn_group">';
        output += '<div class="btn_style btn_telemetering"></div>';
        output += '<div class="btn_span">'+btnSpan[17]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isNotice == 1){
        output += '<div id="btn_notice" class="btn_group badge_notice">';
        output += '<div class="btn_style btn_notice"></div>';
        output += '<div class="btn_span">'+btnSpan[15]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }


    if(info.isVisitor == 1){
        output += '<div id="btn_visitor" class="btn_group badge_visitor">';
        output += '<div class="btn_style btn_visitor"></div>';
        output += '<div class="btn_span">'+btnSpan[19]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isCctv== 1){
        output += '<div id="btn_cctv" class="btn_group">';
        output += '<div class="btn_style btn_cctv"></div>';
        output += '<div class="btn_span">'+btnSpan[4]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isDoorCamera== 1){
        output += '<div id="btn_doorCamera" class="btn_group">';
        output += '<div class="btn_style btn_doorCamera"></div>';
        output += '<div class="btn_span">'+btnSpan[6]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';

        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isParcel == 1){
        output += '<div id="btn_parcel" class="btn_group badge_parcel">';
        output += '<div class="btn_style btn_parcel"></div>';
        output += '<div class="btn_span">'+btnSpan[16]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isLocation== 1){
        output += '<div id="btn_location" class="btn_group">';
        output += '<div class="btn_style btn_location"></div>';
        output += '<div class="btn_span">'+btnSpan[13]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isEnterCar== 1){
        output += '<div id="btn_enterCar" class="btn_group">';
        output += '<div class="btn_style btn_enterCar"></div>';
        output += '<div class="btn_span">'+btnSpan[8]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isEnterRecord == 1){
        output += '<div id="btn_enterRecord" class="btn_group">';
        output += '<div class="btn_style btn_enterRecord"></div>';
        output += '<div class="btn_span">'+btnSpan[9]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
    }
    if(info.isEmergency== 1){
        output += '<div id="btn_emergency" class="btn_group">';
        output += '<div class="btn_style btn_emergency"></div>';
        output += '<div class="btn_span">'+btnSpan[7]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }
    if(info.isAs == 1){
        output += '<div id="btn_as" class="btn_group">';
        output += '<div class="btn_style btn_as"></div>';
        output += '<div class="btn_span">'+btnSpan[2]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }

    if(info.isSamsung == 1){
        output += '<div id="btn_samsung" class="btn_group">';
        output += '<div class="btn_style btn_samsung"></div>';
        output += '<div class="btn_span">'+btnSpan[20]+'</div>';
        output += '<div class="btn_shape"></div>';
        output += '</div>';
        if(cnt == 6 && totalCnt >= 1){
            output += '</div></div>';
            totalCnt--;
        }
        if(cnt == 6 && totalCnt >= 1){
            output += '<div class="swiper-slide"><div class="swiperCenter">';
            cnt=0;
        }
        cnt++;
    }


    output += '</div>';
    return output;
}*/
//접속..
function connectGuard(id, dev)
{
	if(wsClientGuard == null)
	{
		wsClientGuard = new vertx.EventBus(WEBSOCK_ADDRESS);

		wsClientGuard.onopen = function()
		{
			console.log('connected to server');

			wsClientGuard.login(id, 'cvnet', function(reply)
			{
				// reply : 로그인 결과 json
				console.log('reply 로그인결과',reply);
				if (reply.result == true && reply.id == id)
				{
					console.log('succeed login for guard');
					if(wsClientGuard)
					{
						wsClientGuard.registerHandler(dev, handler_guard);
						console.log('succeed register for guard');
						subscribedGuard =  true;

						requestGuardStatus();
					}
				}
				else
				{
					console.log('login failed - heating!');
				}
			});
		}

		wsClientGuard.onclose = function()
		{
			console.log('client guard close');
			wsClientGuard = null;
			subscribedGuard = false;
		}
	}
}


// 방범 상태 값 요청...
function requestGuardStatus()
{
	if(subscribedGuard == false)
	{
		console.log("subscribedGuard is false...");
		console.log('현재 화면 주소가 필요합니다.');
		return;
	}

	if(wsClientGuard != null && guardJson_dev != null)
	{
		var json = new Object();
		json.id = guardJson_id;
		json.remote_addr = guardJson_remote_addr;
		json.request= "status";
		console.log('json : ',json);
		wsClientGuard.publish(guardJson_dev, JSON.stringify(json), null);
	}
}


//모드 제어 변경
function controlGuardMode(_inout)
{


	if(wsClientGuard == null)
	{
		return;
	}

	if(subscribedGuard == false)
	{
		console.log('need subcribed guard address');
		return;
	}

	if(wsClientGuard != null &&
		guardJson_dev != null &&
		guardJson_remote_addr != null &&
		guardJson_id != null)
	{
		var json = new Object();
		json.id = guardJson_id;
		json.remote_addr = guardJson_remote_addr;
		json.request= "control";
		json.onoff= _inout.toString();			// 1: 외출, 2: 재실, 3:취침
		console.log('json : ',json);
		wsClientGuard.publish(guardJson_dev, JSON.stringify(json), null);

		//return setHouseMode(json.onoff);
	}
}


// 방범 상태 응답....
var handler_guard =  function(msg, replyTo)
{

    console.log('message', msg);
    if(wsClientGuard == null) return;
    var jsonObj = JSON.parse(msg);
    var onoff;

    if(jsonObj.status == 0){
        onoff=0;
        return;
    }else{
        onoff = jsonObj.status;
    }

    // 방범 상태 조회
    if(jsonObj.type == 'event'){
        preHouseMode = onoff;
        setHouseMode(onoff);
    }

    // 방범 제어 응답
    if(jsonObj.type == 'control') {
        if(jsonObj.status != 1) {
            if (jsonObj.status == 0xFF) {
                showMessage('모드 전환 실패'); // title : 모드변경 실패
            }else{
                showMessage('센서 상태를 확인해주십시오.'); // title : 모드변경 실패
            }
        }
    }
};

//모드제어 변경
function setHouseMode(value,status){

	if(value == 1){
		$('#mode_goout_on').show();
		$('#mode_inhouse_on').hide();
		$('#mode_sleep_on').hide();
		$('.house_mode').html($.lang[site_lang]['mode_vacant']+' ON');
		nowHouseMode=1;
	}else if(value == 2){
		$('#mode_goout_on').hide();
		$('#mode_inhouse_on').show();
		$('#mode_sleep_on').hide();
		$('.house_mode').html($.lang[site_lang]['mode_occupied']+' ON');
		nowHouseMode=2;
	}else if(value == 3){
		$('#mode_goout_on').hide();
		$('#mode_inhouse_on').hide();
		$('#mode_sleep_on').show();
		$('.house_mode').html($.lang[site_lang]['mode_sleep']+' ON');
		nowHouseMode=3;
	}else{
        showMessage('센서 상태를 확인해주십시오.'); // title : 모드변경 실패
	}


}

function tempHouseMode(value){

	if(value == 1){
		if(nowHouseMode ==  3 || preHouseMode == 3){
            showMessage('외출모드는 재실모드 상태로\n변경 후 적용됩니다.');
			return;
		}
		$('#mode_goout_on').show();
		$('#mode_inhouse_on').hide();
		$('#mode_sleep_on').hide();
		nowHouseMode=1;
	}else if(value == 2){
		$('#mode_goout_on').hide();
		$('#mode_inhouse_on').show();
		$('#mode_sleep_on').hide();
		nowHouseMode=2;
	}else{
		if(nowHouseMode == 1 || preHouseMode == 1){
            showMessage('취침모드는 재실모드 상태로\n변경 후 적용됩니다.');
			return;
		}
		$('#mode_goout_on').hide();
		$('#mode_inhouse_on').hide();
		$('#mode_sleep_on').show();
		nowHouseMode=3;
	}

}


function badgeinit(){
	$('.badge').remove();
	getBadgeInfo(2);
    //getMainMenuInfo(site_name.split('site_')[1]);
}




function showMessage(msg){
	if(bPhoneGap){
		navigator.notification.alert(
			msg, // message
			null, // callback
			'알림', // title
			'확인' // buttonName
		);

	}else{
		alert(msg);
	}
}

var callbackFunction = function(data) {
    getWeatherInfoTemp(data);
};

function getSiteWlocation(value){
	if(value === undefined || value === null){
        site_wlocation = localStorage.getItem("config_wlocation");
        if(site_wlocation == "undefined" || site_wlocation == undefined || site_wlocation == null){
            site_wlocation = 'Tokyo';
            localStorage.setItem("config_wlocation",'Tokyo');
        }
	}else{
		site_wlocation = value;
		localStorage.setItem("config_wlocation",value);
	}
    var headTag = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.onload = function() {};
    newScript.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+site_wlocation+"')&format=json&callback=callbackFunction";
    headTag.appendChild(newScript);
}

function getSiteInfo(){
	$.getJSON("/resources/cvnet/siteinfo/info.json?ver=2018031501", function(json) {
        site_lang = localStorage.getItem("config_lang");
        if(site_lang == "undefined" || site_lang == undefined) {
           site_lang = 'ko';
           localStorage.setItem("config_lang",'ko');
        }
        setLanguage(site_lang);
        btnSpan = $.lang[site_lang]['home_menu'];
        if(site_lang == 'en'){
            $('#btn_samsung .btn_span').css('margin-top','80px');
            $('#btn_enterCar .btn_span').css('margin-top','80px');
            $('#btn_maintCost .btn_span').css('margin-top','80px');
        }

        if(bPhoneGap == true){

            $('body').addClass('site_'+site_name);
            //메뉴정보 가져오기
			console.log('site_name : ', site_name)
            getMainMenuInfo(site_name);
            site_name = 'site_'+site_name;
        }else{
            console.log(json.site); // this will show the info it in firebug console
            site_name = 'site_'+json.site;
            //메뉴정보 가져오기
            getMainMenuInfo(json.site);
            $('body').addClass(site_name);
        }

		if(json.use_voiceControl == '1'){
			$('body').addClass('voiceControl');
		}

		if(json.use_dashboard == '1'){
			$('body').addClass('dashBoard');
		}



        if(json.use_samsung === "1"){
            var first_code_data = $('#samsung_access_data').val();
            var code = localStorage.getItem("samsung_code");

            if(code != null){
                first_code_data = "";
            }
            //localStorage.removeItem('samsung_code');
            if(first_code_data != "") {
                var data = JSON.parse(first_code_data);
                localStorage.setItem("samsung_code", (JSON.stringify(data)));
                samsung_code = data;

                if(checkUser() === 1){
                    updateToken(data);
                }else{
                    accessToken(data);
                }
                //getUser(samsung_code.client_id, samsung_code.access_token);
                $(".samsung_smarthome").show();
                isContentPage = false;
            }
        }
        getSettingInfo_Account();
        //날씨정보 가져오기
        getWeatherInfo();

		$('body').show();

        /************************************************************************
         *                     		  set swiper
         ************************************************************************/
        console.log('swiper 생성')
        swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationtouchendable: true,
            spaceBetween: 30,
            loop: true,
            shortSwipes : true,
            
            
        });
        setLanguage(site_lang);
	});
}

function translation(_val){
	if(isDemoMode){
		if(site_lang == 'en') return 'Clear';
		if(site_lang == 'ch') return '晴朗';
	}
	return _val;
}

var demo_id;
/** 계정 정보 얻기 **/
function getSettingInfo_Account()
{
    $.ajax({
        url: "setting_list.do",
        type: "post",
        data: {"key":"GR_ACCOUNT", "type":0x01},		//type 0 : 개별 항목 요청, 1: 그룹 요청
        dataType: "json",
        cache: false,
        async:false,
        success: function(data){
			  if(data.result == 0)
            {
                //console.log("Login Session Expired.... try AutoLogin...");

                // 자동로그인 체크..
				
                autoLoginCheck("setting_account.do");
            }
            else if(data.result == 1){
                demo_id = data.ACCOUNT_NAME;

                console.log('demo_id : ', demo_id)
                /*if(demo_id === undefined){
                   // 
                   document.cookie = "D05E3D93F09C56A222E7DF1684254211= ; domain=.uasis.com; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                   logout();
                   //toLoginPage();
                }*/  //demo id ????
				userId = data.id;
                complexName = data.COMPLEX_NAME;
                if(userId === 'guest'){
                    complexName = 'CVnet 테스트 사이트 #1';
					data.COMPLEX_NAME='CVnet 테스트 사이트 #1';
					data.DONGHO=data.dong+'-'+data.ho;
					data.ACCOUNT_NAME=userId;
				}
				console.log("data.hasOwnProperty('DONGHO') : ", data.hasOwnProperty('DONGHO'));
				if(!data.hasOwnProperty('DONGHO')){
					if(userId.toLowerCase() != 'guest')
					logout();
				}

                if(localStorage.getItem('callpush') == 'y' || localStorage.getItem('callpush') == 'p'){
                    $('#mainFrame').show();
					var to = localStorage.getItem('to');
					var from = localStorage.getItem('from');
					var caller = localStorage.getItem('caller');
					var mode = localStorage.getItem('mode');
					$("#mainFrame").attr("src", "./webrtc_call.view?from=" + from + '&to=' + to + '&caller=' + caller+'&push=p&mode='+mode);
					
					// $("#mainFrame").attr("src", "./webrtc_call.view?from=" + from + '&to=' + to + '&caller=' + caller+'&push=p');
					// 페이지 접근 시에는 caller 를 '0' 으로 세팅
					//$('#mainFrame').attr('src', './webrtc_call.view?from='+ from + '&to=' + to + '&caller=0&push=n')
				}
                
                console.log('getSettingInfo_Account data:',data);
            }
        },
        error: function(xhr,status,error)
        {
            console.log("/tablet/setting_list.do - code:"+xhr.status+"\n"+"error:"+error);
            if(xhr.status == 401 || xhr.status == 0)
            {
                console.log("Login Session Expired.... try AutoLogin...");
				autoLoginCheck("setting_account.do");
            }
        },
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
        }
    });
}




/*******************************************************
 일괄소등
 *******************************************************/



//일괄소등 정보 가져오기
function getWebsockAddressWholeLight(){
    $.ajax({
        url: "device_info.do",
        type: "post",
        data: {"type":"0x1A"},
        dataType: "json",
        cache: false,
        success: function(data)
        {
            if(data.result == 1)
            {
                //console.log("getWebsockAddressWholeLight data : ",data.websock_address);
                WEBSOCK_ADDRESS = data.websock_address;
                wholeLightJson_id = data.id;
                wholeLightJson_dev = data.dev;
                wholeLightJson_remote_addr =	data.tcp_remote_addr;
                connectWholeLight(wholeLightJson_id, wholeLightJson_dev);
            }
            else
            {
                //console.log("time out");
                autoLoginCheck("device_info.do");
            }

        },
        error: function(xhr,status,error)
        {
            //console.log("/tablet/device_info.do - code:"+xhr.status+"\n"+"error:"+error);
            if(xhr.status == 401 || xhr.status == 0)
            {
                //console.log("Login Session Expired.... try AutoLogin...");
                autoLoginCheck("device_info.do");
            }
        },
        beforeSend: function(xhr){
            xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
        }
    });
}


//일괄소등 접속..
function connectWholeLight(id, dev)
{
    if(wsClientWholeLight == null)
    {
        wsClientWholeLight = new vertx.EventBus(WEBSOCK_ADDRESS);
        wsClientWholeLight.onopen = function()
        {
            //console.log('connected to server');

            wsClientWholeLight.login(id, 'cvnet', function(reply)
            {
                // reply : 로그인 결과 json
                //console.log('reply 로그인결과',reply);
                if (reply.result == true && reply.id == id)
                {
                    //console.log('succeed login for guard');
                    if(wsClientWholeLight)
                    {
                        wsClientWholeLight.registerHandler(dev, handler_wholeLight);
                        //console.log('succeed register for guard');
                        subscribedWholeLight =  true;
                        requestWholeLightStatus();
                    }
                }
                else
                {
                    //console.log('login failed - heating!');
                }
            });
        }

        wsClientWholeLight.onclose = function()
        {
            //console.log('client wholeLight close');
            wsClientWholeLight = null;
            subscribedWholeLight = false;
        }
    }
}

// 일괄소등 상태 값 요청...
function requestWholeLightStatus()
{
    if(subscribedWholeLight == false)
    {
        //console.log("subscribedGuard is false...");
        //console.log('현재 화면 주소가 필요합니다.');
        return;
    }

    if(wsClientWholeLight != null && wholeLightJson_dev != null)
    {
        var json = new Object();
        json.id = wholeLightJson_id;
        json.remote_addr = wholeLightJson_remote_addr;
        json.request= "status";
        console.log('requestWholeLightStatus json : ',json);
        wsClientWholeLight.publish(wholeLightJson_dev, JSON.stringify(json), null);
    }
}


// 일괄소등 상태 응답
var handler_wholeLight = function(msg, replyTo)
{
    console.log('handler_wholeLight message', msg);
    if(wsClientWholeLight == null) return;
    var jsonObj = JSON.parse(msg);
    var onoff;


    onoff = jsonObj.onoff;


    // 방범 상태 조회

    wholeLightSW = (onoff === 1 ? true : false);
    wholeLight(wholeLightSW);

    console.log('wholeLightSW',wholeLightSW);

    // 방범 제어 응답
    if(jsonObj.type == 'control') {
        if(jsonObj.status != 1) {
            if (jsonObj.status == 0xFF) {
                showMessage('모드 전환 실패'); // title : 모드변경 실패
            }else{
                showMessage('센서 상태를 확인해주십시오.'); // title : 모드변경 실패
                //nowHouseMode = preHouseMode;
            }
        }
    }
};
//일괄소등 제어 변경
function controlWholeLight()
{
    if(wsClientWholeLight == null)
    {
        return;
    }

    if(subscribedWholeLight == false)
    {
        //console.log('need subcribed wholeLight address');
        return;
    }
    var _onoff = wholeLightSW === true ? '0' : '1';
    if(wsClientWholeLight != null &&
        wholeLightJson_dev != null &&
        wholeLightJson_remote_addr != null &&
        wholeLightJson_id != null)
    {
        var json = new Object();
        json.id = guardJson_id;
        json.remote_addr = wholeLightJson_remote_addr;
        json.request= "control";
        json.onoff= _onoff + ''; // 1: 외출, 2: 재실, 3:취침
        console.log('json : ',json);
        wsClientWholeLight.publish(wholeLightJson_dev, JSON.stringify(json), null);
        //return setHouseMode(json.onoff);
    }
}

function wholeLight(_onoff){
   /*  if(_onoff == 0){
        $('#btn_wholeLight .btn_style').removeClass('btn_wholeLight_off').addClass('btn_wholeLight_on');
        $('#popup_wholeLight .popup_mode_sub_span').html('"해제"');
    }else{
        $('#btn_wholeLight .btn_style').removeClass('btn_wholeLight_on').addClass('btn_wholeLight_off');
        $('#popup_wholeLight .popup_mode_sub_span').html('"설정"');
    } */
    if(_onoff == 0){
        $('#btn_wholeLight .btn_style').removeClass('btn_wholeLight_on').addClass('btn_wholeLight_off');
        $('#popup_wholeLight .popup_mode_sub_span').html('"OFF"');
    }else{
        $('#btn_wholeLight .btn_style').removeClass('btn_wholeLight_off').addClass('btn_wholeLight_on');
        $('#popup_wholeLight .popup_mode_sub_span').html('"ON"');
    }
}

function demofuncTest(){
	console.log('엘레베이터 호출')
    $('#mainFrame').show();
    $("#mainFrame").attr("src", "demo/elevator.view");
};
