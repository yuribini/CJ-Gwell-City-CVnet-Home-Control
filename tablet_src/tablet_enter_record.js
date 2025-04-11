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

var DATA = {
    result : "1",
    dong : "0101",
    ho : "0101",
    page_no : "01",
    count : "10",
    is_next : "1",
    list : [
        {
            datetime : "20200122175030",
            card_order : "1",
            lobby_dong : "0101",
            lobby_ho : "9001",
            type : "1"
        },
        {
            datetime : "20200122175030",
            card_order : "1",
            lobby_dong : "0101",
            lobby_ho : "9001",
            type : "3"
        },
        {
            datetime : "20200122175030",
            card_order : "1",
            lobby_dong : "0101",
            lobby_ho : "9001",
            type : "5"
        },
        {
            datetime : "20200122175030",
            card_order : "1",
            lobby_dong : "0101",
            lobby_ho : "9001",
            type : "41"
        },
        {
            datetime : "20200122175030",
            card_order : "1",
            lobby_dong : "0101",
            lobby_ho : "9001",
            type : "17"
        }
    ],
}

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

			if($('.control_menu_space').scrollTop() == 0){
				setTimeout(function () {
					$('.ptr-loading #content').css({transform:"translate3d(0,0,0)"});
				}, 500);
			}
		});
	}, 500);

	//setFontSizeCSS();
});

function firtLoadList(){
	pageNo =1 ;
	pageNoSW = true;
	getEnterCarList();
}

function LoadNextPage(){
	if(pageNoSW && notice_load_sw){
		getEnterCarList();
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

function getEnterCarList(){
	console.log('pageNo : ', pageNo)
	$.ajax({
		url: "lobby_history.do ",
		type: "post",
		data: {
			page_no : pageNo.toString().padStart(2, '0'),
            count : "14"
		},
		dataType: "json",
		cache: false,
		success: function(data){
			console.log("lobby_history.do data",data);
			if(data.result == 0){
				console.log("서버와의 접속이 끊겼습니다.");
				// 자동로그인 체크..
				autoLoginCheck("lobby_history.do");
			}else{
				if(data.result == 1){
					var output="";
					//console.log("data :",data);
					//locker_number
					//title
					//status

					if(parent.isDemoMode || parent.isShowRoomMode){
						for (var i = 0; i < DATA.length; i++)
						{
							var contents = DATA[i];
							//console.log(contents);
							output += '		<li class="list">';
							output += '			<div class="main_list_title fontsize_main_list_title">'+contents.status+' ('+contents.locker_number+')</div>';

							if(isToDay(contents.reg_date)){
								output += '			<div class="main_list_sub fontsize_main_list_sub"> '+ $.lang[parent.site_lang]['text_today'] + contents.reg_date.substring(11, 17) + '</div>';
							}else{
								output += '			<div class="main_list_sub fontsize_main_list_sub">'+contents.reg_date+'</div>';
							}
							output += '		</li>';
							listCnt++;
						}
					}else{
						for (var i = 0; i < data.list.length; i++)
						{
							var contents = data.list[i];
							//console.log(contents);
							output += '		<li class="list">';
							output += '			<div class="main_list_title fontsize_main_list_title">'+ contents.lobby_dong+'동 '+contents.lobby_ho+'호('+ parseOpenType(contents.type) +')</div>';
							if(isToDay(contents.datetime)){
								output += '			<div class="main_list_sub fontsize_main_list_sub"> '+ '오늘' + contents.datetime.substring(11, 17) + '</div>';
							}else{
								output += '			<div class="main_list_sub fontsize_main_list_sub">'+parseDay(contents.datetime)+'</div>';
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
			console.log("/tablet/entrancecar_list.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("entrancecar_list.do");
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
				if(data.servlet_name == "entrancecar_list.do")
				{
					getEnterCarList();
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

function parseOpenType(type){
	if(type == '1') return '비밀번호';
	if(type == '3') return 'RF Card';
	if(type == '5') return '얼굴인식';
	if(type == '41') return '원패스';
	if(type == '17') return '모바일';

}

function parseDay(datetime){
	var YYYY = datetime.substring(0,4)
	var MM = datetime.substring(4,6)
	var DD = datetime.substring(6,8)
	var HH = datetime.substring(8,10)
	var mm = datetime.substring(10,12)

	return YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm
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