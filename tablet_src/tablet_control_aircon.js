var now_js_name = "tablet/web_control_gas.js";
var bDocumentLoaded = false;
var bTryAutoLogin = false;
var WEBSOCK_ADDRESS = null;
var wsClient =  null;
var subscribed =  false;
var address = null;
var userId = null;
var remote_addr = null;
var bPhoneGap = false;
var tempYear;
var isLoading = true; // 스크롤 로드시 중복 로드 방지를 위한 변수
var tempMaintValue,tempListSelectNum; // 자동로그인시 ajax를 다시 호출하기 위한 변수
var pageNo=1;
var pageNoSW =true;
var notice_load_sw =true;
var currentBrightnessRatio = 0;		// 밝기 조정가능 조명의 현재 밝기값(백분율%) 0 ~ 100%
var currentairconOnOff = 0;
var aircon_onoff=[], aircon_currentValue =[], aircon_nowValue=[],aircon_wind=[],aircon_operation=[];
var switchOnoff_aircon;
var nowSelectNumber;
var aircononoff = true;
var getMessage=false;
var eventTimer;
var switchAllonoff='';
var tempMode_operation, tempMode_wind;

var aircon_onoff_demo=[0,0,0,0,0,0,0], aircon_currentValue_demo =[], aircon_nowValue_demo=[],aircon_wind_demo=[],aircon_operation_demo=[];
var Demo_DATA =[
	{
		number : "1",
		title:$.lang[parent.site_lang]['room1'],
		temp:"19",
		currentTemp:"24"
	},{
		number : "2",
		title:$.lang[parent.site_lang]['room2'],
		temp:"18",
		currentTemp:"25"
	},{
		number : "3",
		title:$.lang[parent.site_lang]['room3'],
		temp:"20",
		currentTemp:"25"
	},{
		number : "4",
		title:$.lang[parent.site_lang]['room4'],
		temp:"28",
		currentTemp:"24"
	},{
		number : "5",
		title:$.lang[parent.site_lang]['room5'],
		temp:"28",
		currentTemp:"24"
	},{
        number : "6",
        title:$.lang[parent.site_lang]['room7'],
        temp:"28",
        currentTemp:"24"
    }
];



$(document).ready(function()
{
	setLanguage(parent.site_lang);
	$('body').addClass(parent.site_name);

	$('body').show();
	//setFontSizeCSS();
	if(parent.isDemoMode){
		onDemoReady();
	}else{
		init();
	}

	checkBoxInit();

	$('#control_value').html($("#control_slider").val()+'°');

	$("#div-slider").change(function() {
		var slider_value = $("#control_slider").val();
		$('#aircon_value').html(slider_value+'°');
	});



	$('#btn_control_submit').bind('touchstart touchend mouseup mousedown', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('#btn_allOn').bind('touchstart touchend mouseup mousedown', function() {
		$(this).toggleClass('btnMainColor_active');
	});

	$('#btn_allOff').bind('touchstart touchend mouseup mousedown', function() {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.btn_cancel').bind('touchstart touchend mouseup mousedown', function() {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.control_mode_style').bind('touchstart touchend mouseup mousedown', function() {
		$(this).toggleClass('btn_control_mode_active');
	});



});



function reConnectaircon()
{
	if(wsClient == null){
		connect(userId, address, '');
	}
}




/************************************************************************
 *                             Button
 ************************************************************************/

$(document).on('touchend mouseup', '#btn_back', function(){
	parent.gotoHome();
	unInit();
});


//가스 잠금 버튼
$(document).on("touchend mouseup","#btn_valveoff",function(){
	control_close_gasvalve();
});

function unInit()
{
	setTimeout(function() {
		if(wsClient != null)
		{
			wsClient.close();
			wsClient=null;
			subscribed = false;
			console.log('close web socket');
		}
	}, 200);
}


// 전체 켜기
$(document).on("touchend mouseup","#btn_allOn",function(){
	if(parent.isDemoMode){
		aircon_onoff_demo=[1,1,1,1,1,1,1];
	}
	control_aircon_all(1, currentBrightnessRatio);		// on
});

// 전체 끄기..
$(document).on("touchend mouseup","#btn_allOff",function(){
    if(parent.isDemoMode){
        aircon_onoff_demo=[0,0,0,0,0,0,0];
    }

	control_aircon_all(0, currentBrightnessRatio);		// off
});



//디밍제어 탭 닫기
$(document).on("touchend mouseup","#btn_back_control",function(){
	$('.control_tab').hide();

	setSwitchStyle_aircon(currentairconOnOff);

	if(currentairconOnOff ==1){
		$('#switch').lcs_on();
		$("#control_slider").val(currentBrightnessRatio).slider( "refresh" );
		$("#control_slider").change();
	}else{
		$('#switch').lcs_off();
	}

});

//디밍
$(document).on("touchend mouseup","#btn_control_submit",function(){
	var value = Number($("#control_slider").val());
	control_aircon(value);
});


//디밍제어 플러스
$(document).on("mouseup","#btn_control_plus",function(){
	if(switchOnoff_aircon == 1){
		return;
	}
	var value = Number($("#control_slider").val());
	value += 1;
	if(value > 30){
		value = 30;
	}
	console.log('btn_control_minus : ' , value);
	$("#control_slider").val(value).slider( "refresh" );
	$("#control_slider").change();
});

//디밍제어 마이너스
$(document).on("mouseup","#btn_control_minus",function(){
	if(switchOnoff_aircon == 1){
		return;
	}
	var value = Number($("#control_slider").val());

	value -= 1;
	if(value < 0){
		value = 0;
	}
	console.log('btn_control_minus : ' , value);
	$("#control_slider").val(value).slider("refresh");
	$("#control_slider").change();
});


//popup mode
$(document).on("touchend click","#btn_control_mode1",function(){
	popup_mode1();
});

$(document).on("touchend click","#btn_control_mode2",function(){
	popup_mode2();
});

$(document).on("touchend click",".btn_cancel",function(){
	$(".popup_select").hide();
	$(".modal").hide();
});

/************************************************************************
 *                             web socket
 ************************************************************************/
function init()
{
	$.ajax({
		url: "device_info.do",
		type: "post",
		data: {"type":"0x17"},		// 0x17: 냉방
		dataType: "json",
		cache: false,
		success: function(data)
		{
			if(data.result == 0)
			{
				console.log("서버와의 접속이 끊겼습니다.");
				console.log("Login Session Expired.... try AutoLogin...");
				//location.href="login.view";
				// 자동로그인 체크..
				autoLoginCheck("device_info.do");
			}
			else
			{
				if(data.result == 1)
				{
					onReady(data);
				}
				else if(data.result == -1)
				{
					console.log("time out");
				}
			}
		},
		error: function(xhr,status,error)
		{
			console.log("/mobile/device_info.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				//location.href="login.view";

				// 자동로그인 체크..
				autoLoginCheck("device_info.do");
			}
		},
		beforeSend: function(xhr){
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}



// 상태 응답....
var handler =  function(msg, replyTo)
{
	console.log('message', msg);
	clearTimeout(eventTimer);
	getMessage = true;

	if(wsClient == null)return;

	var jsonObj = JSON.parse(msg);
	aircononoff=true;

	var status;
	if(jsonObj.status == 0x01)
	{
		status = '정상';
	}
	else if(jsonObj.status == 0xFF)
	{
		status = '통신단절';
		console.log(status);
		return;
	}
	else if(jsonObj.status == 0xFE)
	{
		status = '주소에러';
		console.log(status);
		return;
	}


/*
	for(var i=0; i<jsonObj.contents.length; i++) {
		var content = jsonObj.contents[i];
		console.log('content : ', content);

		aircon_onoff[content.number] = content.onoff;
		aircon_nowValue[content.number] = content.current_temp;
		currentairconOnOff = content.onoff;
		setSwitchStyle_aircon(content.onoff);

		$("#nowValue_" + content.number).html('<span>현재 </span>'+content.current_temp+'°');
		if(content.onoff == 1){
			$("#switch_aircon"+content.number).removeClass('switch_squear_off').addClass('switch_squear_on');
			$("#aircon_aircon"+content.number).removeClass('aircon_off').addClass('aircon_on');
			$("#aircon_aircon"+content.number).html(content.setting_temp+'°');
			aircon_currentValue[content.number] = content.setting_temp;
		}else {
			$("#switch_aircon"+content.number).removeClass('switch_squear_on').addClass('switch_squear_off');
			$("#aircon_aircon"+content.number).removeClass('aircon_on').addClass('aircon_off');
			$("#aircon_aircon"+content.number).html('OFF');
			aircon_currentValue[content.number] = content.setting_temp;
		}

	}
*/


	aircon_onoff[jsonObj.number] = jsonObj.onoff;
	aircon_nowValue[jsonObj.number] = jsonObj.current_temp;

	aircon_wind[jsonObj.number]=jsonObj.wind;
	aircon_operation[jsonObj.number]=jsonObj.operation;

	tempMode_wind = jsonObj.wind;
	tempMode_operation = jsonObj.operation;

	currentairconOnOff = jsonObj.onoff;
	setSwitchStyle_aircon(jsonObj.onoff);
	$("#nowValue_" + jsonObj.number).html(jsonObj.current_temp+'°');


	if(jsonObj.onoff == 1){
		$("#switch_aircon"+jsonObj.number).removeClass('switch_squear_off').addClass('switch_squear_on');
		$("#aircon_aircon"+jsonObj.number).removeClass('aircon_off').addClass('aircon_on');
		$("#aircon_aircon"+jsonObj.number).html(jsonObj.setting_temp+'°');
		aircon_currentValue[jsonObj.number] = jsonObj.setting_temp;
	}else {
		$("#switch_aircon"+jsonObj.number).removeClass('switch_squear_on').addClass('switch_squear_off');
		$("#aircon_aircon"+jsonObj.number).removeClass('aircon_on').addClass('aircon_off');
		$("#aircon_aircon"+jsonObj.number).html('OFF');
		aircon_currentValue[jsonObj.number] = jsonObj.setting_temp;
	}

	$("#btn_control_mode1 .mode_text").html(getTextOperation(jsonObj.operation));
	$("#btn_control_mode2 .mode_text").html(getTextWind(jsonObj.wind));

	if(jsonObj.onoff == 1){
		$('#aircon_value').html(jsonObj.setting_temp+'°');
		$("#aircon_slider").val(jsonObj.setting_temp).slider( "refresh" );
	}


	hideSpinner();
};

function onDemoReady(){
	var cnt = 0;
	var output='';

    output += '<div class="swiper-wrapper">';
	for (var i = 0; i < Demo_DATA.length; i++) {
		var content = Demo_DATA[i];
		if(content != undefined){

            if(cnt == 0){
                output += '<div class="swiper-slide">';
            }

			output += '<div id="switch_aircon' + content.number + '" class="style_switch_squear switch_squear_off" ontouchend="demo_control(\'' + content.title + '\',' + content.number + ')">';
			output += '	<div class="img_aircon_title">' + content.title + '</div>';
			output += '	<div id="aircon_aircon'+content.number+'" class="style_aircon_value aircon_off">OFF</div>';
			output += ' <div id="nowValue_'+content.number+'" class="nowairconValue"><span>'+ $.lang[parent.site_lang]["text_now"]+'</span> '+content.currentTemp+'°</div>';
			output += '</div>';

            if(cnt >= 4){
                output += '</div>';
                cnt=0;
            }else{
                cnt++;
            }
			aircon_nowValue_demo[Number(content.number)] = content.temp;
			aircon_currentValue_demo[Number(content.number)] = content.currentTemp;
		}
	}
    output += '</div>';

	$("#btn_control_mode1 .mode_text").html(getTextOperation(0)+' ≫');
	$("#btn_control_mode2 .mode_text").html(getTextWind(0)+' ≫');

	$('.btn_group_onoff').html(output);
    $('.btn_group_onoff').append('<div class="swiper-pagination"></div>');


    /******************[set swiper]******************/
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationonclickable: true,
        spaceBetween: 30
    });


}


function onReady(aircon_info) {


	console.log('aircon_info : ',aircon_info);
	var jsonObj = aircon_info;
	var cnt=0;
	var totalCnt = Math.ceil(jsonObj.contents.length/5);

	if(jsonObj != null && jsonObj.is_use == true && jsonObj.result == 1)
	{
		var output="";
		if(jsonObj.contents.length <= 5) {
			for (var i = 0; i < jsonObj.contents.length; i++) {
				var content = jsonObj.contents[i];
				output += '<div id="switch_aircon' + content.number + '" class="style_switch_squear switch_squear_off" ontouchend="control_aircon_control(\'' + content.title + '\',' + content.number + ')" onclick="control_aircon_control(\'' + content.title + '\',' + content.number + ')">';
				output += '	<div class="img_aircon_title">' +getTitleName(content.title) + '</div>';
				output += '	<div id="aircon_aircon'+content.number+'" class="style_aircon_value aircon_off">OFF</div>';
				output += ' <div id="nowValue_'+content.number+'" class="nowairconValue"><span>현재 </span> 0°</div>';
				output += '</div>';
			}
			$('.btn_group_onoff').html(output);
			$('.btn_group_onoff').addClass('centerAlign');
		}else{

			output += '<div class="swiper-wrapper">';
			for (var i = 0; i < jsonObj.contents.length; i++) {
                if(cnt == 0){
                    output += '<div class="swiper-slide">';
                }

                var content = jsonObj.contents[i];
				output += '<div id="switch_aircon' + content.number + '" class="style_switch_squear switch_squear_off" ontouchend="control_aircon_control(\'' + content.title + '\',' + content.number + ')" onclick="control_aircon_control(\'' + content.title + '\',' + content.number + ')">';
				output += '	<div class="img_aircon_title">' + getTitleName(content.title) + '</div>';
				output += '	<div id="aircon_aircon'+content.number+'" class="style_aircon_value aircon_off">OFF</div>';
				output += ' <div id="nowValue_'+content.number+'" class="nowairconValue"><span>현재 </span> 0°</div>';
				output += '</div>';

                if(cnt >= 4){
                    output += '</div>';
                    cnt=0;
                }else{
                    cnt++;
                }

			}
			output += '</div>';
			$('.btn_group_onoff').html(output);
			$('.btn_group_onoff').append('<div class="swiper-pagination"></div>');

			/******************[set swiper]******************/
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				slidesPerView: 1,
				paginationonclickable: true,
				spaceBetween: 30
			});
		}




		WEBSOCK_ADDRESS = jsonObj.websock_address;
		remote_addr = jsonObj.tcp_remote_addr;
		// 접속 시도..
		connect(jsonObj.id, jsonObj.dev, jsonObj.tcp_remote_addr);

	}
	else
	{
		console.log("서버와의 접속이 끊겼습니다.");
		parent.toLoginPage();
	}
};


// 접속..
function connect(id, dev, remote_addr)
{
	if(wsClient == null)
	{
		wsClient = new vertx.EventBus(WEBSOCK_ADDRESS);

		wsClient.onopen = function() {
			console.log('connected to server');

			wsClient.login(id, 'cvnet', function(reply) {		// reply : 로그인 결과 json
				console.log(reply);
				if (reply.result == true && reply.id == id)
				{
					console.log('succeed login');

					if(wsClient && !subscribed)
					{
						wsClient.registerHandler(dev, handler);
						console.log('succeed register');
						subscribed =  true;
						address = dev;
						userId = id;
						requestStatus();
					}
				}
				else
				{
					console.log('로그인 실패!');
				}
			});
		}

		wsClient.onclose = function() {
			console.log('close');
			wsClient = null;
			subscribed = false;
		}
	}

}

// 상태 값 요청...
function requestStatus()
{
	if(subscribed == false)
	{
		console.log('현재 화면 주소가 필요합니다.');
		return;
	}

	if(wsClient != null && address != null)
	{
		var json = new Object();
		json.id = userId;
		json.remote_addr = remote_addr;
		json.request= "status";

		wsClient.publish(address, JSON.stringify(json), null);
	}
}











/************************************************************************
 *                             AJAX
 ************************************************************************/

///// 자동로그인 시도.......
function autoLoginCheck(_servletName)
{
	if(bTryAutoLogin == true)
	{
		bTryAutoLogin = false;
		parent.toLoginPage();
		return;
	}

	bTryAutoLogin = true;

	$.ajax({
		url: "auto_login_check.do",
		type: "post",
		data: {"name":_servletName, "deviceId":parent.deviceId, "tokenId":parent.tokenId},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			if(data.result == 1) {
				console.log("Auto Login Success: " + data.result);
				if (data.servlet_name == "device_info.do") {
					init();
				}
				else {
					console.log("Login Session Expired - no autologin info....code: " + data.result);
					console.log(data.message);
					parent.toLoginPage();
				}
			}
		},
		error:function(xhr,status,error)
		{
			console.log("tablet/auto_login_check.do - code:"+xhr.status+"\n"+"error:"+error);
			//if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired - no autologin info....");
				parent.toLoginPage();
			}
		}
	});
}

/************************************************************************
 *                             function
 ************************************************************************/

function popup_mode1(){

	if(currentairconOnOff == 0) return;

	var output='';
	output += "<div id='mode1_list0' class='list' ontouchend='selectMode1(0)' onclick='selectMode1(0)'>"+$.lang[parent.site_lang]["text_setModeArray"][0]+"</div>";
	output += "<div id='mode1_list1' class='list' ontouchend='selectMode1(1)' onclick='selectMode1(1)'>"+$.lang[parent.site_lang]["text_setModeArray"][1]+"</div>";
	output += "<div id='mode1_list2' class='list' ontouchend='selectMode1(2)' onclick='selectMode1(2)'>"+$.lang[parent.site_lang]["text_setModeArray"][2]+"</div>";
	output += "<div id='mode1_list3' class='list' ontouchend='selectMode1(3) onclick='selectMode1(3)''>"+$.lang[parent.site_lang]["text_setModeArray"][3]+"</div>";
	/* output += "<div id='mode1_list4' class='list' ontouchend='selectMode1(4) onclick='selectMode1(4)''>"+$.lang[parent.site_lang]["text_setModeArray"][4]+"</div>"; */
	$('.select_title').html($.lang[parent.site_lang][66]);
	$('.select_space').html(output);
	$('.popup_select').show();
	$('.modal').show();
	$('#mode1_list'+aircon_operation[nowSelectNumber]).addClass('list_active');

	$('.list').bind('touchstart touchend mouseup mousedown', function() {
		$(this).toggleClass('popup_list_active');
	});


}

function popup_mode2(){

	if(currentairconOnOff == 0) return;

	var output='';
	output += "<div id='mode2_list0' class='list' ontouchend='selectMode2(0)' onclick='selectMode2(0)'>"+$.lang[parent.site_lang]["text_setWindArray"][0]+"</div>";
	output += "<div id='mode2_list1' class='list' ontouchend='selectMode2(1)' onclick='selectMode2(1)'>"+$.lang[parent.site_lang]["text_setWindArray"][1]+"</div>";
	output += "<div id='mode2_list2' class='list' ontouchend='selectMode2(2)' onclick='selectMode2(2)'>"+$.lang[parent.site_lang]["text_setWindArray"][2]+"</div>";
	output += "<div id='mode2_list3' class='list' ontouchend='selectMode2(3)' onclick='selectMode2(3)'>"+$.lang[parent.site_lang]["text_setWindArray"][3]+"</div>";
	$('.select_title').html($.lang[parent.site_lang]['text_setWind']);
	$('.select_space').html(output);
	$('.popup_select').show();
	$('.modal').show();
	$('#mode2_list'+aircon_wind[nowSelectNumber]).addClass('list_active');

	$('.list').bind('touchstart touchend mouseup mousedown', function() {
		$(this).toggleClass('popup_list_active');
	});
}

function selectMode1(_val){
	if(parent.isDemoMode){
		$("#btn_control_mode1 .mode_text").html(getTextOperation(_val)+" ≫");
		$('.popup_select').hide();
		$('.modal').hide();
		aircon_wind[nowSelectNumber]=_val;
		return;
	}
	if(aircon_operation[nowSelectNumber] == _val) return;
	showSpinner();
	if(wsClient == null)
	{
		return;
	}

	if(subscribed == false)
	{
		console.log('need subcribed address');
		return;
	}
	if(wsClient != null && address != null && remote_addr != null && userId != null)
	{
		var json = new Object();
			json.id = userId;
			json.remote_addr = remote_addr;
			json.number = nowSelectNumber.toString();
			json.request = "control";
			json.onoff = "1";
			json.operation = _val.toString();
			json.wind = aircon_wind[nowSelectNumber]+"";
			json.timer = "0";
			json.running = aircon_onoff[nowSelectNumber].toString();
			json.setting_temp = aircon_currentValue[nowSelectNumber]+"";
		wsClient.publish(address, JSON.stringify(json), null);
	}

	$("#btn_control_mode1 .mode_text").html(getTextOperation(_val)+" ≫");

	$('.popup_select').hide();
	$('.modal').hide();

}

function selectMode2(_val){

	if(parent.isDemoMode){
		$("#btn_control_mode2 .mode_text").html(getTextWind(_val)+" ≫");
		$('.popup_select').hide();
		$('.modal').hide();
		aircon_operation[nowSelectNumber]=_val;
		return;
	}


	if(aircon_wind[nowSelectNumber] == _val) return;
	showSpinner();
	if(wsClient == null)
	{
		return;
	}

	if(subscribed == false)
	{
		console.log('need subcribed address');
		return;
	}
	if(wsClient != null && address != null && remote_addr != null && userId != null)
	{
		var json = new Object();
			json.id = userId;
			json.remote_addr = remote_addr;
			json.number = nowSelectNumber.toString();
			json.request= "control";
			json.onoff = "1";
			json.operation =aircon_operation[nowSelectNumber]+"";
			json.wind = _val.toString();
			json.timer = "0";
			json.running = aircon_onoff[nowSelectNumber].toString();
			json.setting_temp = aircon_currentValue[nowSelectNumber]+"";
		wsClient.publish(address, JSON.stringify(json), null);
	}

	$("#btn_control_mode2 .mode_text").html(getTextWind(_val)+" ≫");

	$('.popup_select').hide();
	$('.modal').hide();

}

// 개별 냉방 제어....
function control_aircon(_value) {


	if(parent.isDemoMode){
		aircon_nowValue_demo[nowSelectNumber] = _value;
		$('#aircon_aircon'+nowSelectNumber).html(_value+"°");
		return;
	}
	
	if(wsClient == null)
	{
		return;
	}

	if(subscribed == false)
	{
		console.log('need subcribed address');
		return;
	}

	if(wsClient != null && address != null && remote_addr != null && userId != null)
	{
		var json = new Object();
		json.id = userId;
		json.remote_addr = remote_addr;
		json.number = nowSelectNumber.toString();
		json.request= "control";
		json.onoff = "1";
		json.operation =aircon_operation[nowSelectNumber]+"";
		json.wind=aircon_wind[nowSelectNumber]+"";
		json.timer="0";
		json.running= aircon_onoff[nowSelectNumber].toString();
		json.setting_temp = _value.toString();

		wsClient.publish(address, JSON.stringify(json), null);

	}


};


// 전체 냉방 제어
function control_aircon_all(_onoff) {
	if(parent.isDemoMode){
		for(var i =0; i < aircon_onoff_demo.length ; i++){
			if(_onoff==0){
				$("#switch_aircon"+i).removeClass('switch_squear_on').addClass('switch_squear_off');
				$("#aircon_aircon"+i).removeClass('aircon_on').addClass('aircon_off');
				$("#aircon_aircon"+i).html('OFF');
			}else{
				$("#switch_aircon"+i).removeClass('switch_squear_off').addClass('switch_squear_on');
				$("#aircon_aircon"+i).removeClass('aircon_off').addClass('aircon_on');
				$("#aircon_aircon"+i).html(aircon_currentValue_demo[i]+'°');
				$("#nowValue_"+i).html(aircon_nowValue_demo[i]+'°');
			}
		}
		return;
	}

	if(switchAllonoff === _onoff){
		return;
	}

	switchAllonoff = _onoff;


	for(var i =0; i < aircon_onoff.length ; i++){
		if(_onoff==0){
			$("#switch_aircon"+i).removeClass('switch_squear_on').addClass('switch_squear_off');
			$("#aircon_aircon"+i).removeClass('aircon_on').addClass('aircon_off');
			$("#aircon_aircon"+i).html('OFF');
		}else{
			$("#switch_aircon"+i).removeClass('switch_squear_off').addClass('switch_squear_on');
			$("#aircon_aircon"+i).removeClass('aircon_off').addClass('aircon_on');
			$("#aircon_aircon"+i).html(aircon_currentValue[i]+'°');
			$("#nowValue_"+i).html(aircon_nowValue[i]+'°');
		}
	}

	if(subscribed == false)
	{
		console.log('need subcribed address');
		return;
	}
	if(wsClient != null && address != null && remote_addr != null && userId != null)
	{
		for(var i=1; i <= aircon_onoff.length; i++){
			var json = new Object();
				json.id = userId;
				json.remote_addr = remote_addr;
				json.number = i.toString();
				json.request= "control";
				json.onoff = "1";
				json.operation =aircon_operation[i]+"";
				json.wind=aircon_wind[i]+"";
				json.timer="0";
				json.running= _onoff.toString();
				json.setting_temp = aircon_currentValue[i]+"";
			wsClient.publish(address, JSON.stringify(json), null);
		}
	}
};




// 냉방온도 onoff
function control_aircon_onoff(_number,_onoff)
{
	if(subscribed == false)
	{
		console.log('현재 화면 주소가 필요합니다.');
		console.log("subscribed is false...");
		return;
	}

	if(_number <= 0)
	{
		console.log("room number is 0 ...");
		return;
	}

	if(wsClient != null && address != null && remote_addr != null && userId != null)
	{
		var json = new Object();
			json.id = userId;
			json.remote_addr = remote_addr;
			json.number = _number.toString();
			json.request= "control";
			json.onoff = "0";
			json.operation =aircon_operation[_number]+"";
			json.wind=aircon_wind[_number]+"";
			json.timer="0";
			json.running= _onoff.toString();
			json.setting_temp = aircon_currentValue[_number]+"";
			wsClient.publish(address, JSON.stringify(json), null);
	}
}

function demo_control(title,number) {

	setSwitchStyle_aircon(aircon_onoff_demo[number]);
	nowSelectNumber = number;
	aircononoff=true;

	$('#aircon_now_value').html(aircon_currentValue_demo[number] + '°');
	if (aircon_currentValue[number] == 'OFF') {
		$('#aircon_value').html('OFF');
	} else {
		$('#aircon_value').html(aircon_nowValue_demo[number] + '°');
		$("#control_slider").val(Number(aircon_nowValue_demo[number])).slider("refresh");
	}


	setSwitchStyle_aircon(aircon_onoff_demo[number]);
	if (aircon_onoff_demo[number] == 1) {
		$('#switch').lcs_on();
	} else {
		$('#switch').lcs_off();
	}

	$("#btn_setting_mode1").html(getTextOperation(aircon_operation_demo[number]));
	$("#btn_setting_mode2").html(getTextWind(aircon_wind_demo[number]));

	$('#control_tab_title').html(getTitleName(title));
	$('.control_tab').show();

}

function control_aircon_control(title,number) {


	setSwitchStyle_aircon(aircon_onoff[number]);
	nowSelectNumber = number;

	if(aircon_nowValue[number]  == undefined){
		aircon_nowValue[number] = 0;
		aircononoff=false;
	}

	$('#aircon_now_value').html(aircon_nowValue[number] + '°');
	if (aircon_currentValue[number] == 'OFF') {
		$('#aircon_value').html('OFF');
	} else {
		$('#aircon_value').html(aircon_currentValue[number] + '°');
		$("#control_slider").val(aircon_currentValue[number]).slider("refresh");
	}


	setSwitchStyle_aircon(aircon_onoff[number]);
	if (aircon_onoff[number] == 1) {
		$('#switch').lcs_on();
	} else {
		$('#switch').lcs_off();
	}

	$("#btn_setting_mode1").html(getTextOperation(aircon_operation[number]));
	$("#btn_setting_mode2").html(getTextWind(aircon_wind[number]));
	$('#control_tab_title').html(getTitleName(title) + ' ' + $.lang[parent.site_lang]['text_aircon']);
	$('.control_tab').show();

}


/********************** checkbox init *************************/
function checkBoxInit(){
	$('#switch').lc_switch('ON','OFF');
	$('body').delegate('.lcs_check', 'lcs-statuschange', function() {
		switchOnoff_aircon = ($(this).is(':checked')) ? 0 : 1;
	});

	$(".switch_space .lcs_switch").bind("touchend click", function(){
		//console.log('잠금해제 스위치 클릭');
		
		if(parent.isDemoMode){
			if(!aircononoff){
				return;
			}

			if(switchOnoff_aircon == 0){
				currentairconOnOff = 0;
				aircon_onoff_demo[nowSelectNumber] = 0;
			}else if(switchOnoff_aircon == 1){
				currentairconOnOff = 1;
				aircon_onoff_demo[nowSelectNumber] = 1;
			}
			//control_aircon_onoff(nowSelectNumber,switchOnoff_aircon);
			setSwitchStyle_aircon2(switchOnoff_aircon);


			if(switchOnoff_aircon == 1){
				$("#switch_aircon"+nowSelectNumber).removeClass('switch_squear_off').addClass('switch_squear_on');
				$("#aircon_aircon"+nowSelectNumber).removeClass('aircon_off').addClass('aircon_on');
				$("#aircon_aircon"+nowSelectNumber).html(aircon_nowValue_demo[nowSelectNumber]+'°');
			}else {
				$("#switch_aircon"+nowSelectNumber).removeClass('switch_squear_on').addClass('switch_squear_off');
				$("#aircon_aircon"+nowSelectNumber).removeClass('aircon_on').addClass('aircon_off');
				$("#aircon_aircon"+nowSelectNumber).html('OFF');
			}

		}else{
			/* if(!aircononoff){
				return;
			} */

			if(switchOnoff_aircon == 0){
				aircon_onoff[nowSelectNumber] = 0;
			}else if(switchOnoff_aircon == 1){
				aircon_onoff[nowSelectNumber] = 1;
			}

			control_aircon_onoff(nowSelectNumber,switchOnoff_aircon);
			setSwitchStyle_aircon(switchOnoff_aircon);
		}
	});
}

function setSwitchStyle_aircon2(value){
	console.log('setSwitchStyle_aircon2 : ', value)
	if(value == 1){
		$('#btn_control_minus').removeClass('btn_control_minus_off').addClass('btn_control_minus_on');
		$('#btn_control_plus').removeClass('btn_control_plus_off').addClass('btn_control_plus_on');
		$('.ui-slider-bg').show();
		$('.ui-slider-handle').show();
		//$('#btn_control_submit').show();
		$('#btn_control_submit').css({'visibility': 'visible'});

		$('#aircon_value').removeClass('aircon_value_off').addClass('aircon_value_on');
		var slider_value = $("#control_slider").val();
		$('#aircon_value').html(slider_value+'°');
	}else{
		$('#btn_control_minus').removeClass('btn_control_minus_on').addClass('btn_control_minus_off');
		$('#btn_control_plus').removeClass('btn_control_plus_on').addClass('btn_control_plus_off');
		$('.ui-slider-bg').hide();
		$('.ui-slider-handle').hide();
		//$('#btn_control_submit').hide();
		$('#btn_control_submit').css({'visibility': 'hidden'});

		$('#aircon_value').html('OFF');
		$('#aircon_value').removeClass('aircon_value_on').addClass('aircon_value_off');
	}
}

function setSwitchStyle_aircon(value){

	if(value == 1){
		$('#switch').lcs_on();
		$('#btn_control_minus').removeClass('btn_control_minus_off').addClass('btn_control_minus_on');
		$('#btn_control_plus').removeClass('btn_control_plus_off').addClass('btn_control_plus_on');
		$('.ui-slider-bg').show();
		$('.ui-slider-handle').show();
		//$('#btn_control_submit').show();
		$('#btn_control_submit').css({'visibility': 'visible'});

		$('#aircon_value').removeClass('aircon_value_off').addClass('aircon_value_on');
		var slider_value = $("#control_slider").val();
		$('#aircon_value').html(slider_value+'°');
	}else{
		$('#switch').lcs_off();
		$('#btn_control_minus').removeClass('btn_control_minus_on').addClass('btn_control_minus_off');
		$('#btn_control_plus').removeClass('btn_control_plus_on').addClass('btn_control_plus_off');
		$('.ui-slider-bg').hide();
		$('.ui-slider-handle').hide();
		//$('#btn_control_submit').hide();
		$('#btn_control_submit').css({'visibility': 'hidden'});

		$('#aircon_value').html('OFF');
		$('#aircon_value').removeClass('aircon_value_on').addClass('aircon_value_off');
	}
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


function getTextWind(val){
	var result='';

	switch(val){
		case 0: result=$.lang[parent.site_lang]["text_setWindArray"][0];
			break;
		case 1: result=$.lang[parent.site_lang]["text_setWindArray"][1];
			break;
		case 2: result=$.lang[parent.site_lang]["text_setWindArray"][2];
			break;
		case 3: result=$.lang[parent.site_lang]["text_setWindArray"][3];
			break;
	}
	return result;
}


function getTextOperation(val){
	var result='';

	switch(val){
		case 0: result = $.lang[parent.site_lang]["text_setModeArray"][0];
			break;
		case 1: result= $.lang[parent.site_lang]["text_setModeArray"][1];
			break;
		case 2: result= $.lang[parent.site_lang]["text_setModeArray"][2];
			break;
		case 3: result= $.lang[parent.site_lang]["text_setModeArray"][3];
			break;
		/* case 4: result= $.lang[parent.site_lang]["text_setModeArray"][4];
			break; */
	}
	return result;
}

function showSpinner(){
	getMessage = false;
	eventTimer = setTimeout(function(){
		if(!getMessage){
			alert("응답이 없습니다");
			$("#btn_control_mode1 .mode_text").html(getTextOperation(tempMode_operation));
			$("#btn_control_mode2 .mode_text").html(getTextWind(tempMode_wind));
		}
	}, 5000);
}


function hideSpinner(){
	$('.spinner_space_sub').hide();
}