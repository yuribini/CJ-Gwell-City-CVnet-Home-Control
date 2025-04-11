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

$(document).ready(function()
{
	setLanguage(parent.site_lang);
	$('body').addClass(parent.site_name);

	//setFontSizeCSS();

	checkBoxInit();
	if(parent.isDemoMode){
        $('body').show();
        $('.notice_space').show();

        $('input').lcs_on();
        $('.lcs_cursor').show();
        $('input').lcs_lock(true);
        gasonoff=true;

        $('#gas_img').removeClass('gas_img_off').addClass('gas_img_on');
        var output='';
        $('#notice_title').removeClass('subColorFont').addClass('mainColorFont');
        $('#notice_title').html($.lang[parent.site_lang]["text_gasOpen"]);


	}else{
        $('input').lcs_off();
        $('.lcs_cursor').hide();
        $('input').lcs_lock(false);
        gasonoff=false;
        init();
    }


});

/************************************************************************
 *                             function
 ************************************************************************/

$(document).on('click', '#btn_back', function(){
	parent.gotoHome();
	unInit();
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


/************************************************************************
 *                             web socket
 ************************************************************************/
function init()
{
	$.ajax({
		url: "device_info.do",
		type: "post",
		data: {"type":"0x11"},		// 0x11 가스밸브..
		dataType: "json",
		cache: false,
		success: function(data)
		{
			console.log('가스 : ', data)
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
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}



// 가스밸브 상태 응답....
var handler =  function(msg, replyTo)
{
	console.log('message', msg);
	var jsonObj = JSON.parse(msg);
	var status;
	if(jsonObj.status == 0x01)
	{
		status = '정상';
	}
	else if(jsonObj.status == 0xFF)
	{
        $('body').show();
		status = '통신단절';
		console.log(status);
		return;
	}

	if(jsonObj.onoff == 1)
	{
		$('input').lcs_lock(true);
		$('input').lcs_on();
		$('.lcs_cursor').show();
		gasonoff=true;
		$('#gas_img').removeClass('gas_img_off').addClass('gas_img_on');
		var output='';
		$('#notice_title').removeClass('subColorFont').addClass('mainColorFont');
		$('#notice_title').html($.lang[parent.site_lang]["text_gasOpen"]);
	}
	else
	{
		$('input').lcs_off();
		$('.lcs_cursor').hide();
		$('input').lcs_lock(false);
		gasonoff=false;
		$('#gas_img').removeClass('gas_img_on').addClass('gas_img_off');

		$('#notice_title').removeClass('mainColorFont').addClass('subColorFont');
		$('#notice_title').html($.lang[parent.site_lang]["text_gasClose"]);
	}

	$('.notice_space').show();
    $('body').show();
};


function onReady(gasvalve_info)
{
	var jsonObj = gasvalve_info;
	if(jsonObj != null && jsonObj.is_use == true && jsonObj.result == 1)
	{
		WEBSOCK_ADDRESS = jsonObj.websock_address;
		remote_addr = jsonObj.tcp_remote_addr;
		// 접속 시도..
		connect(jsonObj.id, jsonObj.dev, jsonObj.tcp_remote_addr);
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
						console.log('dev : ', dev)
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
		console.log('address : ', address)
		wsClient.publish(address, JSON.stringify(json), null);
	}
}

// 가스밸브 닫기
function control_close_gasvalve()
{
	if(subscribed == false)
	{
		console.log('현재 화면 주소가 필요합니다.');
		return;
	}

	if(wsClient != null && address != null && remote_addr != null && userId != null)
	{
		var json = new Object();
		json.id = userId;
		json.remote_addr = remote_addr;
		json.request= "control";
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

var switchOnoff, gasonoff=true;

/********************** checkbox init *************************/
function checkBoxInit(){
	$('input').lc_switch('OPEN','CLOSED');
	$('body').delegate('.lcs_check', 'lcs-statuschange', function() {
		switchOnoff = ($(this).is(':checked')) ? 1 : 0;
		console.log('스위치:',switchOnoff);

	});

	$(".lcs_switch").bind("touchend", function(){
		console.log('잠금해제 스위치 클릭');
		if(!gasonoff){
			return;
		}
		setTimeout(function(){
			if(switchOnoff == 0){
				control_close_gasvalve();
				gasonoff=false;

				$('input').lcs_off();
				$('.lcs_cursor').hide();
				$('input').lcs_lock(false);
				$('#gas_img').removeClass('gas_img_on').addClass('gas_img_off');

				$('#notice_title').removeClass('blue_text').addClass('orange_text');
				$('#notice_title').html($.lang[parent.site_lang]["text_gasClose"]);
			}
		},300);
	});
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