var now_js_name = "tablet/tablet_cctv.js";
var bDocumentLoaded = false;
var bTryAutoLogin = false;
var WEBSOCK_ADDRESS = null;
var wsClient =  null;
var subscribed =  false;
var address = null;
var userId = null;
var remote_addr = null;
var bPhoneGap = false;
var listCnt=0;
var tempYear;
var isLoading = true; // 스크롤 로드시 중복 로드 방지를 위한 변수
var tempMaintValue,tempListSelectNum; // 자동로그인시 ajax를 다시 호출하기 위한 변수
var pageNo=1;
var pageNoSW =true;
var notice_load_sw =true;

var DATA = [

	/* {
		title : $.lang[parent.site_lang]['text_emergency_gas'],
		date_time:"2017.10.19 13:09"
	},{
		title : $.lang[parent.site_lang]['text_emergency_emer'],
		date_time:"2017.10.13 13:09"
	},{
		title : $.lang[parent.site_lang]['text_emergency_in'],
		date_time:"2017.10.09 18:10"
	},{
		title : $.lang[parent.site_lang]['text_emergency_emer'],
		date_time:"2017.09.28 09:35"
	} */
	{
		title : '구급 상황 발생',
		date_time:"2017.10.19 13:09"
	},{
		title : '비상 상황 발생',
		date_time:"2017.10.13 13:09"
	},{
		title : '방범1 발생',
		date_time:"2017.10.09 18:10"
	},{
		title : '비상 상황 발생, 피난사다리 상황 발생',
		date_time:"2017.09.28 09:35"
	}

];

$(document).ready(function()
{
	setLanguage(parent.site_lang);
	$('body').addClass(parent.site_name);
	$('body').show();

	firtLoadList();

	setTimeout(function () {
		// monitor the window's scroll event
		$('.control_menu_space').scroll(function() {
			//log("Scroll detected: "+$(window).scrollTop()+".");
			var contentHeight = calcScrollTarget() ;
			if ($('.control_menu_space').scrollTop() > contentHeight && isLoading == true) {
				isLoading = false;
				console.log('Load more content');
				console.log('contentHeight',contentHeight);
				//loadContent();
				LoadNextPage();
			}
		});
	}, 500);
	//setFontSizeCSS();

});

function firtLoadList(){
	pageNo =1 ;
	pageNoSW = true;
	getEmergencyList();
}

function LoadNextPage(){
	if(pageNoSW && notice_load_sw){
		getEmergencyList();
		notice_load_sw = false;
	}
}

function onDeviceReady()
{
	console.log("device ready...tablet_control_gas");
}

/************************************************************************
 *                             function
 ************************************************************************/

$(document).on('click', '#btn_back', function(){
	parent.gotoHome();
});

/************************************************************************
 *                             AJAX
 ************************************************************************/

function getEmergencyList()
{
	$.ajax({
		url: "emergency_list.do ",
		type: "post",
		data: {"pageNo":pageNo, "rows":14},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			if(data.result == 0)
			{
				console.log("서버와의 접속이 끊겼습니다.");
				// 자동로그인 체크..
				autoLoginCheck("emergency_list.do");
			}
			else
			{
				if(data.result == 1)
				{
					var output="";
					//console.log("data :",data);
					var ts_today= $.lang[parent.site_lang]['text_today'];

					if(parent.isDemoMode || parent.isShowRoomMode){
						for (var i = 0; i < DATA.length; i++)
						{

							var contents = DATA[i];
							console.log(contents);
							output += '		<li class="list">';
							output += '			<div class="main_list_title fontsize_main_list_title">'+contents.title+'</div>';
							if(isToDay(contents.date_time)) {
								output += '<div class="main_list_sub fontsize_main_list_sub">'+ts_today+' '+contents.date_time.substring(11, 17)+'</div>';
							}else{
								output += '<div class="main_list_sub fontsize_main_list_sub">'+contents.date_time+'</div>';
							}
							output += '		</li>';
							listCnt++;
						}

					}else{
						for (var i = 0; i < data.contents.length; i++)
						{
							var contents = data.contents[i];
							console.log(contents);
							output += '		<li class="list">';
							output += '			<div class="main_list_title fontsize_main_list_title">'+getGuardText(contents.title)+'</div>';
							if(isToDay(contents.date_time)) {
								output += '			<div class="main_list_sub fontsize_main_list_sub">'+ts_today+' '+ contents.date_time.substring(11, 17) + '</div>';
							}else{
								output += '			<div class="main_list_sub fontsize_main_list_sub">'+contents.date_time+'</div>';
							}
							output += '		</li>';
							listCnt++;
						}

					}


					if(data.exist_next == false)
					{
						pageNoSW = false;
					}
					else
					{
						notice_load_sw =true;
					}

					pageNo++;
					$('#content > ul').append(output);
					console.log("append(output)");
					isLoading = true;
				}
				else if(data.result == -1)
				{
					console.log("time out");
				}
			}
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/emergency_list.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("emergency_list.do");
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
				if(data.servlet_name == "emergency_list.do")
				{
					getEmergencyList();
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

function calcScrollTarget() {
	var windowHeight =$('.control_menu_space').height();
	var bodyHeight =  $('#thelist').height();
	var delta = bodyHeight - windowHeight - 50;
	return delta; // Update target amount
}

//당겨서 초기화
var firstLoadingFunction = function() {
	return new Promise( function( resolve, reject ) {
		// Run some async loading code here

		if ( $('.control_menu_space').scrollTop() <= 0 ) {
			$('#content > ul').html('');
			firtLoadList();
			resolve();
			listCnt=0;
			console.log('초기화');
		} else {
			//reject();
		}
	} );
};

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

function isToDay(reg_date){
	var result = false;

	var tempday = reg_date.substring(8,10);
	var tempyear = reg_date.substring(0,4);
	var tempmonth = reg_date.substring(5,7);
	var temp_yyymmdd = tempyear+tempmonth+tempday;

	var dt = new Date();
	var _dd = dt.getDate();
	var _mm = dt.getMonth()+1;
	_mm = (_mm < 10) ? '0'+_mm : _mm+'';
	var _yyyy = dt.getFullYear();
	var temp_today = _yyyy+''+_mm+''+_dd;

	if(temp_yyymmdd == temp_today){
		result = true;
	}
	return result;
}

function getGuardText(text_data){
    // var text_data = '방범1 발생, 방범2 발생, 좆됨, 응급상황 발생';
	var text_arr = text_data.split(', ');
	var parse_arr = '';
	var result = '';
   	for(var i=0; i < text_arr.length; i++){
		parse_arr = text_arr[i].split(' ');
		result += getEmergency(parse_arr[0]);
		if(i != (text_arr.length-1)) result += ', '
	}
	
	return result;
}