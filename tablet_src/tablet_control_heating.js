var now_js_name = "tablet/tablet_control_gas.js";
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
var isFirstLoad = true;
var currentBrightnessRatio = 0;		// 밝기 조정가능 조명의 현재 밝기값(백분율%) 0 ~ 100%
var currentHeatingOnOff = 0;
var heating_onoff=[], heating_currentValue =[], heating_nowValue=[];
var switchOnoff_heating;
var nowSelectNumber;
var heatingonoff = true;

var heating_onoff_demo=[0,0,0,0,0,0,0], heating_currentValue_demo =[], heating_nowValue_demo=[],heating_wind_demo=[],heating_operation_demo=[];
var Demo_DATA =[];

$(document).ready(function()
{
	setLanguage(parent.site_lang);
	$('body').addClass(parent.site_name);
	//setFontSizeCSS();

    if(parent.isDemoMode){
        onDemoReady();
    }else{
        init();
    }

	checkBoxInit();

	$('#control_value').html($("#control_slider").val()+'°');

	$("#div-slider").change(function() {
		//if(heating_onoff[nowSelectNumber] == 1) {
			var slider_value = $("#control_slider").val();
			$('#heating_value').html(slider_value+'°');
		//}
	});

	$('.switch_squear_off').bind('touchstart touchend  mouseup mousedown', function() {
		$(this).toggleClass('switch_squear_off_active');
	});

	$('.switch_squear_on').bind('touchstart touchend  mouseup mousedown', function() {
		$(this).toggleClass('switch_squear_on_active');
	});

	$('#btn_control_submit').bind('touchstart touchend  mouseup mousedown', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('#btn_allOn').bind('touchstart touchend  mouseup mousedown', function() {
		$(this).toggleClass('btnMainColor_active');
	});
	$('#btn_allOff').bind('touchstart touchend  mouseup mousedown', function() {
		$(this).toggleClass('btnGrayColor_active');
	});



});



function reConnectheating()
{
	if(wsClient == null){
		connect(userId, address, '');
	}
}




/************************************************************************
 *                             Button
 ************************************************************************/

$(document).on('click', '#btn_back', function(){
	parent.gotoHome();
	unInit();
});


//가스 잠금 버튼
$(document).on("click","#btn_valveoff",function(){
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
$(document).on("click","#btn_allOn",function(){
    if(parent.isDemoMode){
        heating_onoff_demo=[1,1,1,1,1,1,1];
    }
	control_heating_all(1, currentBrightnessRatio);		// on
});

// 전체 끄기..
$(document).on("click","#btn_allOff",function(){
    if(parent.isDemoMode){
        heating_onoff_demo=[0,0,0,0,0,0,0];
    }
	control_heating_all(0, currentBrightnessRatio);		// off
});

//디밍제어 탭 닫기
$(document).on("click","#btn_back_control",function(){
	$('.control_tab').hide();

	setSwitchStyle_heating(currentHeatingOnOff);

	if(currentHeatingOnOff ==1){
		$('#switch').lcs_on();
		$("#control_slider").val(currentBrightnessRatio).slider( "refresh" );
		$("#control_slider").change();
	}else{
		$('#switch').lcs_off();
	}

});

//디밍
$(document).on("click","#btn_control_submit",function(){
	var value = Number($("#control_slider").val());
	control_heating(value);
});


//디밍제어 플러스
$(document).on("click","#btn_heating_plus",function(){
	if(heating_onoff[nowSelectNumber]  == 0){
		return;
	}
	var value = Number($("#control_slider").val());
	value += 1;
	if(value > 40){
		value = 40;
	}
	$("#control_slider").val(value).slider( "refresh" );
	$("#control_slider").change();
});

//디밍제어 마이너스
$(document).on("click","#btn_heating_minus",function(){
	if(heating_onoff[nowSelectNumber]  == 0){
		return;
	}
	var value = Number($("#control_slider").val());
	value -= 1;
	if(value < 0){
		value = 0;
	}
	$("#control_slider").val(value).slider("refresh");
	$("#control_slider").change();
});


/************************************************************************
 *                             web socket
 ************************************************************************/
function init()
{
	$.ajax({
		url: "device_info.do",
		type: "post",
		data: {"type":"0x16"},		// 0x16: 난방
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
					console.log('data: ',data);
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
	$('#content').show();

	if(wsClient == null)return;

	var jsonObj = JSON.parse(msg);
	heatingonoff=true;

	var status;
	console.log('jsonObj.status : ', jsonObj.status == 0x01)
	console.log('jsonObj.status : ', jsonObj.status == 0xFF)
	console.log('jsonObj.status : ', jsonObj.status == 0xFE)
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


	for(var i=0; i < jsonObj.contents.length; i++) {
		var content = jsonObj.contents[i];
		console.log('content : ', content);

		heating_onoff[content.number] = content.onoff;
		heating_nowValue[content.number] = content.current_temp;
		currentHeatingOnOff = content.onoff;
		//setSwitchStyle_heating(content.onoff);

		$("#nowValue_" + content.number).html('<span>'+$.lang[parent.site_lang]["text_now"]+' </span>'+content.current_temp+'°');
		if(content.onoff == 1){
			$("#switch_heating"+content.number).removeClass('switch_squear_off').addClass('switch_squear_on');
			$("#heating_heating"+content.number).removeClass('heating_off').addClass('heating_on');
			$("#heating_heating"+content.number).html(content.setting_temp+'°');
			heating_currentValue[content.number] = content.setting_temp;

            if(parent.site_lang == 'en'){
                $("#heating_heating"+content.number).css('font-size','50px');
            }

		}else {
			$("#switch_heating"+content.number).removeClass('switch_squear_on').addClass('switch_squear_off');
			$("#heating_heating"+content.number).removeClass('heating_on').addClass('heating_off');
			$("#heating_heating"+content.number).html($.lang[parent.site_lang]['text_vacant']);
			heating_currentValue[content.number] = content.setting_temp;
            if(parent.site_lang == 'en'){
                $("#heating_heating"+content.number).css('font-size','40px');
            }

		}

		if(content.number == nowSelectNumber && content.onoff == 1){
			var cValue = content.setting_temp;
            $('#heating_value').html(cValue !== undefined ? cValue + '°' : '');
			$("#control_slider").val((cValue !== undefined ? cValue : 0)).slider("refresh");
		}

	}
};


function onReady(heating_info) {
	var jsonObj = heating_info;
	var cnt=0;
	var totalCnt = Math.ceil(jsonObj.contents.length/5);

	if(jsonObj != null && jsonObj.is_use == true && jsonObj.result == 1)
	{
		var output="";
		if(jsonObj.contents.length <= 5) {
			for (var i = 0; i < jsonObj.contents.length; i++) {
				var content = jsonObj.contents[i];
                console.log('content : ', content);
				//if(content.title !== '거실') {
                    /*output += '<div id="switch_heating' + content.number + '" class="style_switch_squear switch_squear_off" onclick="control_heating_control(\'' + $.lang[parent.site_lang][getTitleCode(content.title)] + '\',' + content.number + ')">';*/
                    output += '<div id="switch_heating' + content.number + '" class="style_switch_squear switch_squear_off" onclick="control_heating_control(\'' + content.title + '\',' + content.number + ')">';
                    output += '	<div class="img_heating_title">' + content.title + '</div>';
                    //output += '	<div class="img_heating_title">' + $.lang[parent.site_lang][getTitleCode(content.title)] + '</div>';
                    output += '	<div id="heating_heating' + content.number + '" class="style_heating_value heating_off">OFF</div>';
                    output += ' <div id="nowValue_' + content.number + '" class="nowHeatingValue"><span>' + $.lang[parent.site_lang]["text_now"] + ' </span> 0°</div>';
                    output += '</div>';
                //}
			}
			setTimeout(function(){
                $('.btn_group_onoff').html(output);
                $('.btn_group_onoff').addClass('centerAlign');
                $('body').show();
                $('.btn_group_onoff').css({'margin-left': '-40px'});

                $('#content').show();
			}, 100)

		}else{

			output += '<div class="swiper-wrapper">';
			for (var i = 0; i < jsonObj.contents.length; i++) {
                if(cnt == 0){
                    output += '<div class="swiper-slide">';
                }

				var content = jsonObj.contents[i];
				output += '<div id="switch_heating' + content.number + '" class="style_switch_squear switch_squear_off"  onclick="control_heating_control(\'' + $.lang[parent.site_lang][getTitleCode(content.title)] + '\',' + content.number + ')">';
				//output += '	<div class="img_heating_title">' + $.lang[parent.site_lang][getTitleCode(content.title)] + '</div>';
				output += '	<div class="img_heating_title">' + content.title + '</div>';
				output += '	<div id="heating_heating'+content.number+'" class="style_heating_value heating_off">OFF</div>';
				output += ' <div id="nowValue_'+content.number+'" class="nowHeatingValue"><span>'+$.lang[parent.site_lang]["text_now"]+' </span> 0°</div>';
				output += '</div>';

                if(cnt >= 4){
                    output += '</div>';
                    cnt=0;
                }else{
                    cnt++;
                }
			}
			output += '</div>';
			$('body').show();
			$('#content').show();

			$('.btn_group_onoff').html(output);
			$('.btn_group_onoff').append('<div class="swiper-pagination"></div>');

			/******************[set swiper]******************/
			var swiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				slidesPerView: 1,
				paginationClickable: true,
				spaceBetween: 30
			});

		}

		if(parent.isDemoMode){
			$('#content').show();
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
						setTimeout(function(){
							requestStatus();
						}, 200)
						
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


// 개별 난방 제어....
function control_heating(value) {

    if(parent.isDemoMode){
        heating_nowValue_demo[nowSelectNumber] = value;
        $('#heating_heating'+nowSelectNumber).html(value+"°");
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
		json.request= "control";
		json.number= nowSelectNumber.toString();		// 1~ 48
		json.onoff= heating_onoff[nowSelectNumber].toString();			// 1: 켜기, 0: 끄기
		json.temp= value.toString();	// 0 ~ 10
		wsClient.publish(address, JSON.stringify(json), null);
	}
};


// 전체 조명 제어
function control_heating_all(_onoff, _brightnessRatio) {

    if(parent.isDemoMode){
        for(var i =0; i < heating_onoff_demo.length ; i++){
            if(_onoff==0){
                $("#switch_heating"+i).removeClass('switch_squear_on').addClass('switch_squear_off');
                $("#heating_heating"+i).removeClass('heating_on').addClass('heating_off');
                $("#heating_heating"+i).html($.lang[parent.site_lang]['text_vacant']);
            }else{
                $("#switch_heating"+i).removeClass('switch_squear_off').addClass('switch_squear_on');
                $("#heating_heating"+i).removeClass('heating_off').addClass('heating_on');
                $("#heating_heating"+i).html(heating_currentValue_demo[i]+'°');
                $("#nowValue_"+i).html(heating_nowValue_demo[i]+'°');
            }
        }
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
		json.request= "control_all";
		json.onoff = _onoff.toString();
		wsClient.publish(address, JSON.stringify(json), null);
	}
};




// 난방온도 onoff
function control_heating_onoff(_number)
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
		json.request= "control";
		json.number= _number.toString();
		json.onoff = heating_onoff[_number].toString();
		json.temp = heating_currentValue[_number]+"";
		wsClient.publish(address, JSON.stringify(json), null);
	}
}


function control_heating_control(title,number) {

	console.log('title : ', title)
	setSwitchStyle_heating(heating_onoff[number]);

	if(heating_nowValue[number] == undefined){
		heating_nowValue[number] = 0;
		heatingonoff=false;
	}

	nowSelectNumber = number;

	$('#heating_now_value').html(heating_nowValue[number] + '°');
	if (heating_onoff[number] == 0) {
		$('#heating_value').html($.lang[parent.site_lang]['text_vacant']);
	} else {
		$('#heating_value').html(heating_currentValue[number] + '°');
		$("#control_slider").val(heating_currentValue[number]).slider("refresh");
	}
	//$('#control_tab_title').html(title);
	$('#control_tab_title').html($.lang[parent.site_lang][getTitleCode(title)]);
	$('.control_tab').show();

}


/********************** checkbox init *************************/
function checkBoxInit(){
	$('#switch').lc_switch('ON','OFF');
	$('body').delegate('.lcs_check', 'lcs-statuschange', function() {
		switchOnoff_heating = ($(this).is(':checked')) ? 0 : 1;
	});

	$(".switch_space .lcs_switch").bind("touchend click", function(){
	console.log('잠금해제 스위치 클릭');
        if(parent.isDemoMode){
            if(!heatingonoff){
                return;
            }

            if(switchOnoff_heating == 0){
                currentheatingOnOff = 0;
                heating_onoff_demo[nowSelectNumber] = 0;
            }else if(switchOnoff_heating == 1){
                currentheatingOnOff = 1;
                heating_onoff_demo[nowSelectNumber] = 1;
            }
            //control_heating_onoff(nowSelectNumber,switchOnoff_heating);
            setSwitchStyle_heating2(switchOnoff_heating);

            if(switchOnoff_heating == 1){
                $("#switch_heating"+nowSelectNumber).removeClass('switch_squear_off').addClass('switch_squear_on');
                $("#heating_heating"+nowSelectNumber).removeClass('heating_off').addClass('heating_on');
                $("#heating_heating"+nowSelectNumber).html(heating_nowValue_demo[nowSelectNumber]+'°');
            }else {
                $("#switch_heating"+nowSelectNumber).removeClass('switch_squear_on').addClass('switch_squear_off');
                $("#heating_heating"+nowSelectNumber).removeClass('heating_on').addClass('heating_off');
                $("#heating_heating"+nowSelectNumber).html($.lang[parent.site_lang]['text_vacant']);
            }

        }else {
		console.log('heatingonoff :' , heatingonoff);
		console.log('switchOnoff_heating :' , switchOnoff_heating);

            /* if (!heatingonoff) {
                return;
            } */

            if (switchOnoff_heating == 0) {
                heating_onoff[nowSelectNumber] = 0;
            } else if (switchOnoff_heating == 1) {
                heating_onoff[nowSelectNumber] = 1;
            }

            control_heating_onoff(nowSelectNumber);
            setSwitchStyle_heating(heating_onoff[nowSelectNumber]);

        }
	});
}




function setSwitchStyle_heating(value){
	if(value == 1){
		$('#switch').lcs_on();
		$('#btn_heating_minus').removeClass('btn_control_minus_off').addClass('btn_control_minus_on');
		$('#btn_heating_plus').removeClass('btn_control_plus_off').addClass('btn_control_plus_on');
		$('.ui-slider-bg').show();
		$('.ui-slider-handle').show();
		//$('#btn_control_submit').show();
		$('#btn_control_submit').css({'visibility': 'visible'});

		$('#heating_value').removeClass('heating_value_off').addClass('heating_value_on');
		var slider_value = $("#control_slider").val();
		$('#heating_value').html(slider_value+'°');
	}else{
		$('#switch').lcs_off();
		$('#btn_heating_minus').removeClass('btn_control_minus_on').addClass('btn_control_minus_off');
		$('#btn_heating_plus').removeClass('btn_control_plus_on').addClass('btn_control_plus_off');
		$('.ui-slider-bg').hide();
		$('.ui-slider-handle').hide();
		//$('#btn_control_submit').hide();
		$('#btn_control_submit').css({'visibility': 'hidden'});

		$('#heating_value').html($.lang[parent.site_lang]['text_vacant']);
		$('#heating_value').removeClass('heating_value_on').addClass('heating_value_off');
	}
}


function setSwitchStyle_heating2(value){
	console.log('setSwitchStyle_heating2 value : ', value)
	if(value == 1){
		$('#switch').lcs_off();
		$('#btn_heating_minus').removeClass('btn_control_minus_off').addClass('btn_control_minus_on');
		$('#btn_heating_plus').removeClass('btn_control_plus_off').addClass('btn_control_plus_on');
		$('.ui-slider-bg').show();
		$('.ui-slider-handle').show();
		//$('#btn_control_submit').show();
		$('#btn_control_submit').css({'visibility': 'visible'});

		$('#heating_value').removeClass('heating_value_off').addClass('heating_value_on');
		var slider_value = $("#control_slider").val();
		$('#heating_value').html(slider_value+'°');
	}else{
		$('#switch').lcs_on();
		$('#btn_heating_minus').removeClass('btn_control_minus_on').addClass('btn_control_minus_off');
		$('#btn_heating_plus').removeClass('btn_control_plus_on').addClass('btn_control_plus_off');
		$('.ui-slider-bg').hide();
		$('.ui-slider-handle').hide();
		//$('#btn_control_submit').hide();
		$('#btn_control_submit').css({'visibility': 'hidden'});

		$('#heating_value').html($.lang[parent.site_lang]['text_vacant']);
		$('#heating_value').removeClass('heating_value_on').addClass('heating_value_off');
	}
}

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
            output += '<div id="switch_heating' + content.number + '" class="style_switch_squear switch_squear_off" onclick="demo_control(\'' + content.title + '\',' + content.number + ')">';
            output += '	<div class="img_heating_title">' + content.title + '</div>';
            output += '	<div id="heating_heating'+content.number+'" class="style_heating_value heating_off">'+$.lang[parent.site_lang]["text_vacant"]+'</div>';
            output += ' <div id="nowValue_'+content.number+'" class="nowHeatingValue"><span>'+$.lang[parent.site_lang]["text_now"]+' </span> '+content.currentTemp+'°</div>';
            output += '</div>';
            if(cnt >= 4){
                output += '</div>';
                cnt=0;
            }else{
                cnt++;
            }
            heating_nowValue_demo[Number(content.number)] = content.temp;
            heating_currentValue_demo[Number(content.number)] = content.currentTemp;
        }
    }
    output += '</div>';
	console.log('demo??')
    $("#btn_control_mode1 .mode_text").html(getTextOperation(0)+' ≫');
    $("#btn_control_mode2 .mode_text").html(getTextWind(0)+' ≫');

    $('.btn_group_onoff').html(output);
    $('.btn_group_onoff').append('<div class="swiper-pagination"></div>');

    $('body').show();
    $('#content').show();

    /******************[set swiper]******************/
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30
    });
}

function demo_control(title,number) {

    setSwitchStyle_heating(heating_onoff_demo[number]);
    nowSelectNumber = number;
    heatingonoff=true;

    $('#heating_now_value').html(heating_currentValue_demo[number] + '°');
    if (heating_currentValue[number] == 'OFF') {
        $('#heating_value').html($.lang[parent.site_lang]['text_vacant']);
    } else {
        $('#heating_value').html(heating_nowValue_demo[number] + '°');
        $("#control_slider").val(Number(heating_nowValue_demo[number])).slider("refresh");
    }


    setSwitchStyle_heating(heating_onoff_demo[number]);
    if (heating_onoff_demo[number] == 1) {
        $('#switch').lcs_on();
    } else {
        $('#switch').lcs_off();
    }

    $("#btn_setting_mode1").html(getTextOperation(heating_operation_demo[number]));
    $("#btn_setting_mode2").html(getTextWind(heating_wind_demo[number]));

    $('#control_tab_title').html($.lang[parent.site_lang][getTitleCode(title)]);
    $('.control_tab').show();

}

function getTextWind(val){
    var result='';

    switch(val){
        case 0: result=$.lang[parent.site_lang]['text_setWindArray'][0];
            break;
        case 1: result=$.lang[parent.site_lang]['text_setWindArray'][1];
            break;
        case 2: result=$.lang[parent.site_lang]['text_setWindArray'][2];
            break;
        case 3: result=$.lang[parent.site_lang]['text_setWindArray'][3];
            break;
    }
    return result;
}


function getTextOperation(val){
    var result='';

    switch(val){
        case 0: result = $.lang[parent.site_lang]['text_setModeArray'][0];
            break;
        case 1: result= $.lang[parent.site_lang]['text_setModeArray'][1];
            break;
        case 2: result= $.lang[parent.site_lang]['text_setModeArray'][2];
            break;
        case 3: result= $.lang[parent.site_lang]['text_setModeArray'][3];
            break;
        case 4: result= $.lang[parent.site_lang]['text_setModeArray'][4];
            break;
    }
    return result;
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
