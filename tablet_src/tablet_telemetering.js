var now_js_name = "tablet/mobile_absence_visitor_list.js";
var bDocumentLoaded = false;
var bTryAutoLogin = false;
var WEBSOCK_ADDRESS = null;
var wsClient =  null;
var subscribed =  false;
var address = null;
var userId = null;
var remote_addr = null;
var bPhoneGap = false;
var isLoading = true; // 스크롤 로드시 중복 로드 방지를 위한 변수
var notice_load_sw =true;

$(document).ready(function()
{
	setLanguage(parent.site_lang);
	$('body').addClass(parent.site_name);
	$('body').show();
	getTelemeteringList();
	setFontSizeCSS();


	$.getJSON("/resources/cvnet/siteinfo/info.json", function(json) {
		if(json.ems == '5'){
			$('.telemetering_list').css('display','inline-block');
		}
		if (json.show_elect=="0") $('#elect').remove();
		if (json.show_gas=="0") $('#gas').remove();
		if (json.show_heating=="0") $('#heating').remove();
		if (json.show_water=="0") $('#water').remove();
		if (json.show_hotwater=="0") $('#hotwater').remove();
	});

});

/************************************************************************
 *                             function
 ************************************************************************/

$(document).on('click', '#btn_back', function(){
	parent.gotoHome();
});

/************************************************************************
 *                             AJAX
 ************************************************************************/

function getTelemeteringList()
{
	if(parent.isDemoMode || parent.isShowRoomMode){
		$('#list_elect').html(425);
		$('#list_gas').html(24.67);
		$('#list_heating').html(75.12);
		$('#list_water').html(4.67);
		$('#list_hotwater').html(63.38);
		return;
	}

	$.ajax({
		url: "telemeter_info.do",
		type: "post",
		dataType: "json",
		cache: false,
		success: function(data)
		{
			console.log("data :",data);
			
			if(data.result == 0)
			{
				console.log("서버와의 접속이 끊겼습니다.");
				// 자동로그인 체크..
				autoLoginCheck("telemeter_info.do");
			}
			else
			{
				if(data.result == 1)
				{
					console.log("data :",data);
					$('#list_elect').html(numberWithCommas(data.electric));
					$('#list_gas').html(numberWithCommas(data.gas));
					$('#list_heating').html(numberWithCommas(data.heating));
					$('#list_water').html(numberWithCommas(data.water));
					$('#list_hotwater').html(numberWithCommas(data.hotwater));

				}
				else if(data.result == -1)
				{
					console.log("time out");
				}
			}
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/telemeter_info.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("telemeter_info.do");
			}
		},
		beforeSend: function(xhr){
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}

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
			if(data.result == 1)
			{
				console.log("Auto Login Success: " + data.result);
				if(data.servlet_name == "telemeter_info.do")
				{
					getTelemeteringList();
				}
				else
				{
					console.log("Login Session Expired - no servlet name");
					parent.toLoginPage();
				}
			}
			else // data.result: 0 or -1
			{
				console.log("Login Session Expired - no autologin info....code: " + data.result);
				console.log(data.message);
				parent.toLoginPage();
			}
		},
		error:function(xhr,status,error)
		{
			console.log("mobile/auto_login_check.do - code:"+xhr.status+"\n"+"error:"+error);
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
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function calcScrollTarget() {
	var windowHeight =$('.control_menu_space').height();
	var bodyHeight =  $('#thelist').height();
	var delta = bodyHeight - windowHeight - 50;
	return delta; // Update target amount
}

function getDate(){
	var dt = new Date();
	dt.setMonth(dt.getMonth());
	var thisYear = dt.getFullYear(); //현재 년도
	var thisMonth = dt.getMonth()+1; //현재 월
	return {thisYear:thisYear,thisMonth:thisMonth};
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