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
var isFirstLoad = true;
var currentBrightnessRatio = [];		// 밝기 조정가능 조명의 현재 밝기값(백분율%) 0 ~ 100%
var currentDimmingLightOnOff = 0;
var light_onoff=[];
var lightonoff = true;
var nowDimmingNum;
var light_onoff_demo =[];
var nowZone;
var subSwiper;
var Demo_DATA_A =[
    {
        number : "1",
		zone:"1",
        dimming:0,
        title :$.lang[parent.site_lang]['room1']
    },{
        number : "2",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "3",
        zone:"1",
        dimming : 0 ,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "4",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "5",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "6",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "1",
        zone:"2",
        dimming:0,
        title : $.lang[parent.site_lang]['room2']
    },{
        number : "2",
        zone:"2",
        dimming:0,
        title : $.lang[parent.site_lang]['room2']
    },{
        number : "3",
        zone:"2",
        dimming:0,
        title : $.lang[parent.site_lang]['room2']
    },{
        number : "1",
        zone:"3",
        dimming:0,
        title : $.lang[parent.site_lang]['room3']
    },{
        number : "1",
        zone:"4",
        dimming:0,
        title : $.lang[parent.site_lang]['room4']
    },{
        number : "1",
        zone:"5",
        dimming:0,
        title : $.lang[parent.site_lang]['room5']
    },{
        number : "1",
        zone:"6",
        dimming:0,
        title : $.lang[parent.site_lang]['room6']
    }
];
var lightInfoJson;
var Demo_DATA_B =[
    {
        number : "1",
        zone:"1",
        dimming:0,
        title :$.lang[parent.site_lang]['room1']
    },{
        number : "2",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "3",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "4",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "5",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    }
    ,{
        number : "6",
        zone:"1",
        dimming:0,
        title : $.lang[parent.site_lang]['room1']
    },{
        number : "1",
        zone:"2",
        dimming:0,
        title : $.lang[parent.site_lang]['room2']
    },{
        number : "2",
        zone:"2",
        dimming:0,
        title : $.lang[parent.site_lang]['room2']
    },{
        number : "3",
        zone:"2",
        dimming:0,
        title : $.lang[parent.site_lang]['room2']
    },{
        number : "4",
        zone:"2",
        dimming:0,
        title : $.lang[parent.site_lang]['room2']
    },{
        number : "1",
        zone:"3",
        dimming:0,
        title : $.lang[parent.site_lang]['room3']
    },{
        number : "1",
        zone:"4",
        dimming:0,
        title : $.lang[parent.site_lang]['room4']
    },{
        number : "1",
        zone:"5",
        dimming:0,
        title : $.lang[parent.site_lang]['room5']
    }
];

$(document).ready(function()
{
	setLanguage(parent.site_lang);
	$('body').addClass(parent.site_name);
	// console.log('parent.site_name : ', parent.site_name)
    // console.log('parent.parent.isDemoMode : ', parent.isDemoMode)
	//setFontSizeCSS();
    if(parent.isDemoMode){
        onDemoReady();
    }else{
        init();
    }
	
    // setTabletIcon();
	
	$('#dimming_value').html($("#dimming_slider").val()+'단계');

	$("#div-slider").change(function(){
		if(light_onoff[nowDimmingNum] == 1) {
			var slider_value = $("#dimming_slider").val();
			$('#dimming_value').html('<div class="span_group"><div class="value_span mainColorFont">'+slider_value+'</div><div class="flag_span mainColorFont">단계</div></div>');
		}
	});
	
	checkBoxInit();
			
	$('.switch_squear_off').bind('touchstart touchend', function() {
		$(this).toggleClass('switch_squear_off_active');
	});

	$('.switch_squear_on').bind('touchstart touchend', function() {
		$(this).toggleClass('switch_squear_on_active');
	});

	$('#btn_dimming_submit').bind('touchstart touchend', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('#btn_allOn').bind('touchstart touchend', function() {
		$(this).toggleClass('btnMainColor_active');
	});
	$('#btn_allOff').bind('touchstart touchend', function() {
		$(this).toggleClass('btnGrayColor_active');
	});

    $('#btn_zoneAllOn').bind('touchstart touchend', function() {
        $(this).toggleClass('btnMainColor_active');
    });

    $('#btn_zoneAllOff').bind('touchstart touchend', function() {
        $(this).toggleClass('btnGrayColor_active');
    });

});


function reConnectLight()
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

$(document).on('click', '#btn_close', function(){
        $('.main_content').show();
        $('.sub_content').hide();
        $('.modal').hide();
});

$(document).on('click', '.modal', function(){
    $('.main_content').show();
    $('.sub_content').hide();
    $('.modal').hide();
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

// 전체 존 켜기
$(document).on("click","#btn_zoneAllOn",function(){
    if(parent.isDemoMode) {
        for(var i = 0; i < light_onoff_demo.length; i++){
        	if(i == nowZone){
                for(var j = 0; j < light_onoff_demo[i].length; j++){
                    light_onoff_demo[i][j]=1;
                }
			}
        }
    }
    control_light_zoneAll(1); // on
    //setLightCondition(nowZone);
});

// 전체 존 끄기
$(document).on("click","#btn_zoneAllOff",function(){
    if(parent.isDemoMode) {
        for(var i = 0; i < light_onoff_demo.length; i++){
            if(i == nowZone) {
                for (var j = 0; j < light_onoff_demo[i].length; j++) {
                    light_onoff_demo[i][j] = 0;
                }
            }

        }
    }
   // setLightCondition(nowZone);
    control_light_zoneAll(0); // on
});

// 전체 켜기
$(document).on("click","#btn_allOn",function(){
    if(parent.isDemoMode) {
        for(var i = 0; i < light_onoff_demo.length; i++){
            for(var j = 0; j < light_onoff_demo[i].length; j++){
                light_onoff_demo[i][j]=1;
            }

        }
    }
    control_light_all(1); // on
});

// 전체 끄기..
$(document).on("click","#btn_allOff",function(){
    if(parent.isDemoMode) {
        for(var i = 0; i < light_onoff_demo.length; i++){
            for(var j = 0; j < light_onoff_demo[i].length; j++){
                light_onoff_demo[i][j]=0;
            }

        }
    }
	control_light_all(0); // off
});

//디밍제어 탭 닫기
$(document).on("click","#btn_back_dimming",function(){

	$('.dimming_tab').hide();

	setSwitchStyle_dimming(currentDimmingLightOnOff);
	if(currentDimmingLightOnOff ==1){
		$('#switch').lcs_on();
		$("#dimming_slider").val(currentBrightnessRatio[nowDimmingNum]).slider( "refresh" );
		$("#dimming_slider").change();
	}else{
		$('#switch').lcs_off();

	}

});

//디밍
$(document).on("click","#btn_dimming_submit",function(){
	var value = Number($("#dimming_slider").val());
	control_dimming(nowDimmingNum,value);
});

//디밍제어 플러스
$(document).on("click","#btn_dimming_plus",function(){
	if(light_onoff[nowDimmingNum] == 0){
		return;
	}
	var value = Number($("#dimming_slider").val());
	value += 1;
	if(value > 10){
		value = 10;
	}
	console.log(value);
	$("#dimming_slider").val(value).slider( "refresh" );
	$("#dimming_slider").change();
});

//디밍제어 마이너스
$(document).on("click","#btn_dimming_minus",function(){
	if(light_onoff[nowDimmingNum] == 0){
		return;
	}
	var value = Number($("#dimming_slider").val());

	value -= 1;
	if(value < 0){
		value = 0;
	}

	$("#dimming_slider").val(value).slider("refresh");
	$("#dimming_slider").change();
});


/************************************************************************
 *                             LCT
 ************************************************************************/
var lctOnReady = function(light_info){
    lightInfoJson = light_info;
    var jsonObj = light_info;
    var cnt = 0;
    var output='';
    var output="";
    var Demo_DATA;
    var swZone = 1,zoneLength=1;
    var Demo_DATA_Length=[];
    var cnt=1;
    var lastZone = 2;

    // if(parent.demo_id == 'lct10102'){
    //     Demo_DATA = Demo_DATA_A;
    // }else{
    //     Demo_DATA = Demo_DATA_B;
    // }

    Demo_DATA = light_info.contents;
    console.log('Demo_DATA : ', Demo_DATA)
    /**************** 존별 조명상태 2차원 배열 선언 ****************/
    for(var i = 0; i < Demo_DATA.length; i++) {
        var light = Demo_DATA[i];
        if(Number(light.number) === 1){
            cnt=1;
        }
        console.log('light : ', light)
        Demo_DATA_Length[Number(light.zone)-1] = cnt++;
    }
    for(var i = 0; i < Demo_DATA_Length.length;i++){
        light_onoff[i] = [];
    }
    console.log('light_onoff : ', light_onoff)
    if(Demo_DATA_Length.length  <= 6) {
        for (var i = 0; i < Demo_DATA.length; i++){
            var light = Demo_DATA[i];
            light.zone = parseInt(light.zone);

            light_onoff[Number(light.zone)-1][Number(light.number)-1] = 0;
            if(swZone === light.zone){
                output += '<div id="switch_light' + (light.zone) + '" class="style_switch_squear switch_squear_off" onclick="lctZoneLight(' + light.zone + ',\'' + light.title + '\')">';
                output += '	<div class="img_light_title">' + light.title + '</div>';
                output += '	<div id="icon_light' + (light.zone-1) + '" class="img_light light_off"></div>';
                output += '</div>';
                swZone++;
            }
        }
        $('#btn_group_onoff').html(output);
        $('#btn_group_onoff').addClass('btn_group_onoff_1');
        $('body').show();
        $('#content').show();



    }else{
        output += '<div class="swiper-wrapper">';
        for (var i = 0; i < Demo_DATA.length; i++)
        {
            var light = Demo_DATA[i];
            if(light.zone == undefined){
                light.zone = 1;
            }
            light_onoff[Number(light.zone)-1][Number(light.number)-1] = 0;
            console.log('swZone : ', swZone , ' / ' , light.zone)
            if(swZone === Number(light.zone)){
                if(cnt == 0){
                    output += '<div class="swiper-slide">';
                }
                output += '<div id="switch_light' + light.zone + '" class="style_switch_squear switch_squear_off" onclick="lctZoneLight(' + light.zone + ',\'' + light.title + '\')">';
                //output += '	<div class="img_light_title">'+$.lang[parent.site_lang][getTitleCode(light.title)]+'</div>';
                output += '	<div class="img_light_title">' + light.title + '</div>';
                output += '	<div id="icon_light' + light.zone + '" class="img_light light_off"></div>';
                output += '</div>';
                if (cnt >= 6) {
                    output += '</div>';
                    cnt = 0;
                } else {
                    cnt++;
                }
                swZone++;
            }
        }
        output += '</div>';

        $('#btn_group_onoff').hide();
        $('#btn_group_onoff').addClass('btn_group_onoff_2');
        $('#btn_group_onoff').html(output);
        $('#btn_group_onoff').append('<div class="swiper-pagination"></div>');
        $('body').show();
        $('#content').show();

        setTimeout(function(){
            $('#btn_group_onoff').show();
            /******************[set swiper]******************/
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 30
            });
        },300);
    }

    WEBSOCK_ADDRESS = jsonObj.websock_address;
    remote_addr = jsonObj.tcp_remote_addr;
    // 접속 시도..
    connect(jsonObj.id, jsonObj.dev, jsonObj.tcp_remote_addr);
}




/************************************************************************
 *                             web socket
 ************************************************************************/
function init()
{
	$.ajax({
		url: "device_info.do",
		type: "post",
		data: {"type":"0x12"},		// 0x12: 조명
		dataType: "json",
		cache: false,
		success: function(data) {
			console.log('data:',data);
			if(data.result == 0) {
				console.log("서버와의 접속이 끊겼습니다.");
				console.log("Login Session Expired.... try AutoLogin...");
				//location.href="login.view";

				// 자동로그인 체크..
				autoLoginCheck("device_info.do");
			}else{
				if(data.result == 1){
					onReady(data);
				}else if(data.result == -1){
					console.log("time out");
				}
			}
		},
		error: function(xhr,status,error) {
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

	//if(isFirstLoad && dimming_cnt > 5){
	$('#content').show();

	if(wsClient == null)return;

	var jsonObj = JSON.parse(msg);
	lightonoff=true;

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
    var light_id = jsonObj.zone + '-' + jsonObj.number;

	light_onoff[light_id] = jsonObj.onoff;

	if(jsonObj.number <= dimming_cnt)
	{
		//setSwitchStyle_dimming(jsonObj.onoff);
		
		var tempBrightness = jsonObj.brightness;
		if(tempBrightness > 10){
			tempBrightness = 10;
		}
		currentBrightnessRatio[light_id] = tempBrightness;

		if(jsonObj.onoff == 1){
			$("#dimming_slider").val(currentBrightnessRatio[light_id]).slider( "refresh" );
			$("#dimming_slider").change();
		}

		currentDimmingLightOnOff = jsonObj.onoff;

		if(jsonObj.onoff == 1 ){
			$("#switch_light"+light_id).removeClass('switch_squear_off').addClass('switch_squear_on');
			$("#light_dimming"+light_id).removeClass('dimming_off').addClass('dimming_on');
			// $("#light_dimming"+light_id).html('<div class="span_group"><div class="value_span mainColorFont">'+currentBrightnessRatio[jsonObj.number]+'</div><div class="flag_span mainColorFont">단계</div></div>');
			$("#light_dimming"+light_id).html('<div class="span_group"><div class="value_span mainColorFont">'+jsonObj.brightness+'</div><div class="flag_span mainColorFont">단계</div></div>');
		}else if (jsonObj.onoff == 0){
			$("#switch_light"+light_id).removeClass('switch_squear_on').addClass('switch_squear_off');
			$("#light_dimming"+light_id).removeClass('dimming_on').addClass('dimming_off');
			$("#light_dimming"+light_id).html('꺼짐');
		}
	}else{
		if(jsonObj.onoff == 1){
			$("#switch_light"+light_id).removeClass('switch_squear_off').addClass('switch_squear_on');
			$("#icon_light"+light_id).removeClass('light_off').addClass('light_on');
		}else {
			$("#switch_light"+light_id).removeClass('switch_squear_on').addClass('switch_squear_off');
			$("#icon_light"+light_id).removeClass('light_on').addClass('light_off');
		}
	}


};
var dimming_cnt = 0;


function onReady(light_info) {
	var jsonObj = light_info;
	var cnt=0;
	console.log('jsonObj: ',jsonObj);
    console.log('parent.site_name: ',parent.site_name);
    if(parent.site_name == 'site_LCT'){
        lctOnReady(jsonObj);
        console.log('lctOnReady')
    }else{
        if(jsonObj != null && jsonObj.is_use == true && jsonObj.result == 1)
        {
            var output="";
            if(jsonObj.contents.length <= 5) {
                for (var i = 0; i < jsonObj.contents.length; i++){
                    var light = jsonObj.contents[i];
                    if(light.zone == undefined){
                        light.zone = 1;
                    }
                    var light_id = light.zone + '-' + light.number;

                    if (light.dimming == 1) {
                        // output += '<div id="switch_light' + light_id+ '" class="style_switch_squear switch_squear_off" onclick="control_light_dimming(\'' + $.lang[parent.site_lang][getTitleCode(light.title)] + '\',' + light.number + ')">';
						output += '<div id="switch_light' + light_id+ '" class="style_switch_squear switch_squear_off" onclick="control_light_dimming(\'' + $.lang[parent.site_lang][getTitleCode(light.title)] + '\',' + light.number + ')">';
                        output += '	<div class="img_light_title">' + light.title + ' 디밍</div>';
                        output += '	<div id="light_dimming' + light_id + '" class="style_dimming_value dimming_off">꺼짐</div>';
                        output += '</div>';
                        dimming_cnt++;
                    }else{
                        output += '<div id="switch_light' + light_id + '" class="style_switch_squear switch_squear_off" onclick="control_light(\'' + light_id +'\',-1)">';
                        output += '	<div class="img_light_title">' + light.title + '</div>';
                        output += '	<div id="icon_light' + light_id + '" class="img_light light_off"></div>';
                        output += '</div>';
                    }
                }
                $('#btn_group_onoff').html(output);
                $('#btn_group_onoff').addClass('btn_group_onoff_1');
                $('#content').show();
                $('body').show();
            }else{
                output += '<div class="swiper-wrapper">';
                for (var i = 0; i < jsonObj.contents.length; i++)
                {
                    if(cnt == 0){
                        output += '<div class="swiper-slide">';
                    }

                    var light = jsonObj.contents[i];

                    if(light.zone == undefined){
                        light.zone = 1;
                    }

                    var light_id = light.zone + '-' + light.number;

                    if(light.dimming == 1){
                        // output += '<div id="switch_light'+light_id+'" class="style_switch_squear switch_squear_off" onclick="control_light_dimming(\''+ light.title +'\','+light_id+')">';
						output += '<div id="switch_light'+light_id+'" class="style_switch_squear switch_squear_off" onclick="control_light_dimming(\''+ light.title +'\',\''+light_id+'\')">';
                        //output += '<div class="img_light_title">'+$.lang[parent.site_lang][getTitleCode(light.title)]+' 디밍</div>';
                        output += '	<div class="img_light_title">'+light.title+' 디밍</div>';
                        output += '<div id="light_dimming'+light_id+'" class="style_dimming_value dimming_off">꺼짐</div>';
                        output += '</div>';
                        if(cnt >= 4){
                            output += '</div>';
                            cnt=0;
                        }else{
                            cnt++;
                        }
                        dimming_cnt++;
                    }else{
                        output += '<div id="switch_light'+light_id+'" class="style_switch_squear switch_squear_off" onclick="control_light(\'' + light_id + '\',-1)">';
                        //output += '	<div class="img_light_title">'+$.lang[parent.site_lang][getTitleCode(light.title)]+'</div>';
                        output += '	<div class="img_light_title">'+light.title+'</div>';
                        output += '	<div id="icon_light'+light_id+'" class="img_light light_off"></div>';
                        output += '</div>';
                        if(cnt >= 4){
                            output += '</div>';
                            cnt=0;
                        }else{
                            cnt++;
                        }
                    }
                }
                output += '</div>';
                $('#content').show();
                $('body').show();
                $('#btn_group_onoff').addClass('btn_group_onoff_2');
                $('#btn_group_onoff').html(output);
                $('#btn_group_onoff').append('<div class="swiper-pagination"></div>');

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

// 개별 조명 제어....
function control_light(_rnum, _brightnessRatio) {
    console.log('control_light : ', _rnum)
    var _roomnum = _rnum;
    var rnumValue = _roomnum.split("-");
    var onoff;
    console.log('wsClient : ', wsClient)
	if(wsClient == null){
		return;
	}
    console.log('light_onoff : ', light_onoff)
	if(light_onoff[_roomnum] == 1){
		light_onoff[_roomnum] = 0;
	}else if(light_onoff[_roomnum] == 0){
		light_onoff[_roomnum] = 1;
	}

	if(subscribed == false){
		console.log('need subcribed address');
		return;
	}

	if(wsClient != null && address != null && remote_addr != null && userId != null) {
		if(_brightnessRatio == -1){
			_brightnessRatio = 0; //Modified by jhchoi. 2016-06-23
		}
        var brightValue = _brightnessRatio;
        var json = {
            id : userId,
            remote_addr : remote_addr,
            request : "control",
            number : rnumValue[1].toString(),  // 1~ 48
            onoff : light_onoff[_roomnum].toString(), // 1: 켜기, 0: 끄기
            brightness : brightValue.toString(), // 0 ~ 10
            zone : rnumValue[0].toString(),
        };
        console.log('send Json : ', json)
      /*  json.id = userId;
        json.remote_addr = remote_addr;
        json.request= "control";
        json.number= rnumValue[1]+'';		                // 1~ 48
        json.onoff= light_onoff[_roomnum]+'';			// 1: 켜기, 0: 끄기
        json.brightness= brightValue+'';	            // 0 ~ 10
        json.zone = rnumValue[0]+''; */
        wsClient.publish(address, JSON.stringify(json), null);
	}
};

// 개별 조명 제어....
function control_dimming(_roomnum,_value) {
	var onoff;
	if(wsClient == null){
		return;
	}

	if(subscribed == false){
		console.log('need subcribed address');
		return;
	}

	if(wsClient != null && address != null && remote_addr != null && userId != null) {
		var json = new Object();
		var brightValue = _value;
        var rnum = _roomnum.split('-');
		console.log('light_onoff[_roomnum] :',light_onoff[_roomnum]);
		json.id = userId;
		json.remote_addr = remote_addr;
		json.request= "control";
		json.number= rnum[1]+'';		// 1~ 48
		json.onoff= light_onoff[_roomnum]+'';			// 1: 켜기, 0: 끄기
		json.brightness= brightValue+'';	// 0 ~ 10
		json.zone = rnum[0]+'';
		wsClient.publish(address, JSON.stringify(json), null);
	}
};

// 전체 조명 제어
function control_light_all(_onoff) {
    if(parent.isDemoMode){
        var length = Object.size(light_onoff_demo);
        for (key in light_onoff_demo){
            if(_onoff == 0){
                $("#switch_light"+key).removeClass('switch_squear_on').addClass('switch_squear_off');
                $("#icon_light"+key).removeClass('light_on').addClass('light_off');
            }else{
                $("#switch_light"+key).removeClass('switch_squear_off').addClass('switch_squear_on');
                $("#icon_light"+key).removeClass('light_off').addClass('light_on');
            }
        }
        return;
    }


	if(subscribed == false){
		console.log('need subcribed address');
		return;
	}

	if(wsClient != null && address != null && remote_addr != null && userId != null){
        var json = {
            id : userId,
            remote_addr : remote_addr,
            request : "control_all",
            onoff : _onoff.toString(),
            brightness : '0',
            zone : '0'
        }
        console.log('allonoff : ', _onoff)
		/* json.id = userId;
		json.remote_addr = remote_addr;
		json.request= "control_all";
		json.onoff= _onoff+'';			// 1: 켜기, 0: 끄기
		json.brightness = "0";	//Modified by jhchoi. 2016-06-23
		json.zone = "0"; */
		wsClient.publish(address, JSON.stringify(json), null);
	}
};

// 전체 존 조명 제어
function control_light_zoneAll(_onoff) {

    if(parent.isDemoMode){
        var length = Object.size(light_onoff_demo);
        for (key in light_onoff_demo){
            if(_onoff == 0){
                $("#switch_light"+key).removeClass('switch_squear_on').addClass('switch_squear_off');
                $("#icon_light"+key).removeClass('light_on').addClass('light_off');
            }else{
                $("#switch_light"+key).removeClass('switch_squear_off').addClass('switch_squear_on');
                $("#icon_light"+key).removeClass('light_off').addClass('light_on');
            }
        }
        return;
    }

    if(subscribed == false){
        console.log('need subcribed address');
        return;
    }

    if(wsClient != null && address != null && remote_addr != null && userId != null) {
        var json = new Object();
        json.id = userId;
        json.remote_addr = remote_addr;
        json.request= "control_all";
        json.onoff= _onoff+'';			// 1: 켜기, 0: 끄기
        json.brightness = "0";	//Modified by jhchoi. 2016-06-23
        json.zone = "0";
        wsClient.publish(address, JSON.stringify(json), null);
    }
};
function control_light_dimming(title,number){
	setSwitchStyle_dimming(light_onoff[number]);

	if(light_onoff[number] == undefined){
		lightonoff = false;
	}

	nowDimmingNum = number;

	$("#dimming_slider").val(currentBrightnessRatio[nowDimmingNum]).slider( "refresh" );
	$("#dimming_slider").change();
	
	$('#dimming_tab_title').html(title+' 디밍');
	$('.dimming_tab').show();
	
	// 버튼 이벤트 바인딩 이슈로 추가해준 로직
	$(".switch_space .lcs_switch").bind("touchend", function(){
		//console.log('잠금해제 스위치 클릭');
		if(!lightonoff){
			return;
		}
		console.log('nowDimmingNum:',nowDimmingNum);
		if(switchOnoff_dimming == 0){
			light_onoff[nowDimmingNum] = 0;
		}else if(switchOnoff_dimming == 1){
			light_onoff[nowDimmingNum] = 1;
		}

		control_dimming(nowDimmingNum,currentBrightnessRatio[nowDimmingNum]);
		//setSwitchStyle_dimming(light_onoff[nowDimmingNum]);
	});
}

var switchOnoff_dimming, gasonoff=true;
/********************** checkbox init *************************/
function checkBoxInit(){
    $('#switch').lc_switch('ON','OFF');
    $('body').delegate('.lcs_check', 'lcs-statuschange', function() {
        switchOnoff_dimming = ($(this).is(':checked')) ? 0 : 1;
        //console.log('스위치:',switchOnoff_dimming);
    });
	
	$(".switch_space .lcs_switch").bind("touchend", function(){
		//console.log('잠금해제 스위치 클릭');
		if(!lightonoff){
			return;
		}
		console.log('nowDimmingNum:',nowDimmingNum);
		if(switchOnoff_dimming == 0){
			light_onoff[nowDimmingNum] = 0;
		}else if(switchOnoff_dimming == 1){
			light_onoff[nowDimmingNum] = 1;
		}

		control_dimming(nowDimmingNum,currentBrightnessRatio[nowDimmingNum]);
		//setSwitchStyle_dimming(light_onoff[nowDimmingNum]);
	});
}

function setSwitchStyle_dimming(value){
	console.log('setSwitchStyle_dimming:',value);
	if(value == 1){
		$('#switch').lcs_on();
		$('#btn_dimming_minus').removeClass('btn_dimming_minus_off').addClass('btn_dimming_minus_on');
		$('#btn_dimming_plus').removeClass('btn_dimming_plus_off').addClass('btn_dimming_plus_on');
		$('.ui-slider-bg').show();
		$('.ui-slider-handle').show();
		$('#btn_dimming_submit').show();
		$('#dimming_value').removeClass('dimming_value_off').addClass('dimming_value_on');
		var slider_value = $("#dimming_slider").val();
		$('#dimming_value').html('<div class="span_group"><div class="value_span mainColorFont">'+slider_value+'</div><div class="flag_span mainColorFont">단계</div></div>');
	}else{
		$('#switch').lcs_off();
		$('#btn_dimming_minus').removeClass('btn_dimming_minus_on').addClass('btn_dimming_minus_off');
		$('#btn_dimming_plus').removeClass('btn_dimming_plus_on').addClass('btn_dimming_plus_off');
		$('.ui-slider-bg').hide();
		$('.ui-slider-handle').hide();
		$('#btn_dimming_submit').hide();
		$('#dimming_value').html('꺼짐');
		$('#dimming_value').removeClass('dimming_value_on').addClass('dimming_value_off');
	}
}

function onDemoReady(){
    var cnt = 0;
    var output='';
    var output="";
    var Demo_DATA;
    var swZone = 1,zoneLength=1;
	var Demo_DATA_Length=[];
	var cnt=1;
	var lastZone = 2;

    if(parent.demo_id == 'lct10102'){
        Demo_DATA = Demo_DATA_A;
	}else{
        Demo_DATA = Demo_DATA_B;
	}
	/**************** 존별 조명상태 2차원 배열 선언 ****************/
    for(var i = 0; i < Demo_DATA.length; i++)
    {
        var light = Demo_DATA[i];
        if(Number(light.number) === 1){
            cnt=1;
        }
        Demo_DATA_Length[Number(light.zone)-1] = cnt++;
    }
	for(var i = 0; i < Demo_DATA_Length.length;i++){
		light_onoff_demo[i] = [];
	}



   if(Demo_DATA_Length.length  <= 6) {
        for (var i = 0; i < Demo_DATA.length; i++){
            var light = Demo_DATA[i];
            if(light.zone == undefined){
                light.zone = 0;
            }

            if(light.zone == '1'){
                light.zone = 1;
            }
            light_onoff_demo[Number(light.zone)-1][Number(light.number)-1] = 0;
            if(swZone === Number(light.zone)){
                output += '<div id="switch_light' + (light.zone-1) + '" class="style_switch_squear switch_squear_off" onclick="demo_openZoneLight(' + light.zone + ',\'' + light.title + '\')">';
                output += '	<div class="img_light_title">' + light.title + '</div>';
                output += '	<div id="icon_light' + (light.zone-1) + '" class="img_light light_off"></div>';
                output += '</div>';
                swZone++;
            }
        }
        $('#btn_group_onoff').html(output);
        $('#btn_group_onoff').addClass('btn_group_onoff_1');
       $('body').show();
       $('#content').show();
    }else{
        output += '<div class="swiper-wrapper">';
        for (var i = 0; i < Demo_DATA.length; i++){
            var light = Demo_DATA[i];
            if(light.zone == undefined){
                light.zone = 1;
            }
            light_onoff_demo[Number(light.zone)-1][Number(light.number)-1] = 0;
			console.log('swZone : ', swZone , ' / ' , light.zone)
            if(swZone === Number(light.zone)){
				if(cnt == 0){
					output += '<div class="swiper-slide">';
				}
                output += '<div id="switch_light' + light.zone + '" class="style_switch_squear switch_squear_off" onclick="demo_openZoneLight(' + light.zone + ',\'' + light.title + '\')">';
                //output += '	<div class="img_light_title">'+$.lang[parent.site_lang][getTitleCode(light.title)]+'</div>';
                output += '	<div class="img_light_title">' + light.title + '</div>';
                output += '	<div id="icon_light' + light.zone + '" class="img_light light_off"></div>';
                output += '</div>';
                if (cnt >= 6) {
                    output += '</div>';
                    cnt = 0;
                } else {
                    cnt++;
                }
                swZone++;
            }
        }
        output += '</div>';

        $('#btn_group_onoff').hide();
        $('#btn_group_onoff').addClass('btn_group_onoff_2');
        $('#btn_group_onoff').html(output);
        $('#btn_group_onoff').append('<div class="swiper-pagination"></div>');
        $('body').show();
        $('#content').show();

        setTimeout(function(){
            $('#btn_group_onoff').show();
            /******************[set swiper]******************/
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 30
            });
		},300);
    }

    console.log('light_onoff_demo: ',light_onoff_demo);
}

function demo_Control(_zone,_number) {
    if(light_onoff_demo[_zone][_number] == 1){
        light_onoff_demo[_zone][_number] = 0;
    }else if(light_onoff_demo[_zone][_number] == 0){
        light_onoff_demo[_zone][_number] = 1;
    }
    setLightCondition(_zone);
};

function lctZoneLight(_zone,_name){
    nowZone =   Number(_zone)-1;
    $('.popup_title').html(_name+' 조명');
    $('.sub_content').show();
    $('.modal').show();
    //$('.main_content').hide();

    var output ='';
    console.log('lightInfoJson : ', lightInfoJson.contents)

    var light_contents = _.filter(lightInfoJson.contents, {zone : _zone});

    if(light_onoff[nowZone].length > 6) {
        output += '<div class="swiper-wrapper" style="margin-left:0px;">';
    }
    var cnt = 0;
    for (var i = 0; i < light_contents.length; i++){
        var light_id = _zone + '-' + light_contents[i].number;

        if(light_onoff[nowZone].length > 6 && cnt == 0){
            output += '<div class="swiper-slide">';
        }
        output += '<div id="switch_zone_light' + nowZone + '-'+ i +'" class="style_switch_squear switch_squear_off" onclick="control_light(\'' + light_id +'\',-1)">';
        output += '	<div class="img_light_title">조명' + (i+1) + '</div>';
        output += '	<div id="icon_zone_light' + nowZone +'-'+i+ '" class="img_light light_off"></div>';
        output += '</div>';
        if(cnt >= 5){
            output += '</div>';
            cnt = 0;
        }else{
            cnt++;
        }
    }
    output += '</div>';
    $('.sub_content #popup_btn_group_onoff ').html(output);
    if(light_onoff[nowZone].length > 6) {
        $('.sub_content #popup_btn_group_onoff').append('<div class="swiper-pagination" style="bottom:10px;"></div>');
    }

    $('.sub_content #popup_btn_group_onoff').addClass('btn_group_onoff_1');

    $('.sub_content').show();
    $('.modal').show();
    setLightCondition(nowZone);

    console.log('subSwiper  : ', subSwiper );
    if(subSwiper == undefined){
        subSwiper = new Swiper('.popup-swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 30
        });
    }else{
        subSwiper.destroy();
        subSwiper = new Swiper('.popup-swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 30
        });
    }
    // setTimeout(function(){
    //     var swiper = new Swiper('.swiper-container', {
    //         pagination: '.swiper-pagination',
    //         visibilityFullFit: true,
    //         paginationClickable: true,
    //         spaceBetween: 35,
    //         centeredSlides : true,
    //         slidesPerView : 'auto'
    //     });
    // },300);
}

function demo_openZoneLight(_zone,_name){
	nowZone =   Number(_zone)-1;
    $('.popup_title').html(_name+' 조명');
	$('.sub_content').show();
    $('.modal').show();
    //$('.main_content').hide();

    var output ='';

    if(light_onoff_demo[nowZone].length > 5) {
        output += '<div class="swiper-wrapper" style="margin-left:0px;">';
	}
	var cnt = 0;
    for (var i = 0; i < light_onoff_demo[nowZone].length; i++){
			if(light_onoff_demo[nowZone].length > 5 && cnt == 0){
				output += '<div class="swiper-slide">';
			}
            output += '<div id="switch_zone_light' + nowZone + '-'+ i +'" class="style_switch_squear switch_squear_off" onclick="demo_Control(' + nowZone +','+ i +')">';
            output += '	<div class="img_light_title">조명' + (i+1) + '</div>';
            output += '	<div id="icon_zone_light' + nowZone +'-'+i+ '" class="img_light light_off"></div>';
            output += '</div>';
            if(cnt >= 4){
                output += '</div>';
                cnt = 0;
			}else{
                cnt++;
			}
    }
    output += '</div>';
    $('.sub_content #popup_btn_group_onoff ').html(output);
    if(light_onoff_demo[nowZone].length > 5) {
        $('.sub_content #popup_btn_group_onoff').append('<div class="swiper-pagination" style="bottom:10px;"></div>');
    }

    $('.sub_content #popup_btn_group_onoff').addClass('btn_group_onoff_1');

    $('.sub_content').show();
    $('.modal').show();
    setLightCondition(nowZone);

    console.log('subSwiper  : ', subSwiper );
    if(subSwiper == undefined){
        subSwiper = new Swiper('.popup-swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 30
        });
	}else{
        subSwiper.destroy();
        subSwiper = new Swiper('.popup-swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 30
        });
	}


    // setTimeout(function(){
    //     var swiper = new Swiper('.swiper-container', {
    //         pagination: '.swiper-pagination',
    //         visibilityFullFit: true,
    //         paginationClickable: true,
    //         spaceBetween: 35,
    //         centeredSlides : true,
    //         slidesPerView : 'auto'
    //     });
    // },300);


}

function setLightCondition(_zone, onoff){
    console.log('_zone : ', _zone);
    var _roomnum = _rnum;
	if(wsClient == null){
		return;
	}

	if(subscribed == false){
		console.log('need subcribed address');
		return;
	}

	if(wsClient != null && address != null && remote_addr != null && userId != null) {
		if(_brightnessRatio == -1){
			_brightnessRatio = 0; //Modified by jhchoi. 2016-06-23
		}
        var brightValue = _brightnessRatio;
        var json = {
            id : userId,
            remote_addr : remote_addr,
            request : "control",
            onoff : onoff.toString(), // 1: 켜기, 0: 끄기
            brightness : brightValue.toString(), // 0 ~ 10
            zone : _zone.toString(),
        };
        console.log('send Json : ', json)
        wsClient.publish(address, JSON.stringify(json), null);
	}
   /*  var tempLightCnt = 0;
	for (var i = 0; i < light_onoff_demo[_zone].length; i++) {
		if (light_onoff_demo[_zone][i] == 1) {
            tempLightCnt++;
			$("#switch_zone_light" + _zone+ '-'+i).removeClass('switch_squear_off').addClass('switch_squear_on');
			$("#icon_zone_light" + _zone+ '-'+i).removeClass('light_off').addClass('light_on');
		} else {
			$("#switch_zone_light" + _zone+ '-'+i).removeClass('switch_squear_on').addClass('switch_squear_off');
			$("#icon_zone_light" + _zone+ '-'+i).removeClass('light_on').addClass('light_off');
		}
	}
	if(tempLightCnt >= 1){
		$("#switch_light" + _zone).removeClass('switch_squear_off').addClass('switch_squear_on');
		$("#icon_light" + _zone).removeClass('light_off').addClass('light_on');
	}else{
        $("#switch_light" + _zone).removeClass('switch_squear_on').addClass('switch_squear_off');
        $("#icon_light" + _zone).removeClass('light_on').addClass('light_off');
    } */
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

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
