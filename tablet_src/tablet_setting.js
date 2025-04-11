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
//lock number button
var tempNumber='';
var numCnt=0;
var numValue = '';
var pushAlram_checkbox_list=[];
var lock_checkbox_list=[];
var config_fontsize=0, config_call=0;
var pushAlramSwitchOnoff,lockSwitchOnoff,pushCallSwitchOnoff;
var accountInfoTitle='';
/************[잠금해제번호 설정]*************/
var useLockNo = 0;
var lockPassword = "";
var inputLockNo = 0;
var useLockNoControl = 0;
var useLockNoGuard = 0;
var tempPassword; // 오토로그인시 필요한 변수
var lockscreen_pwd = null;
var tempLang,tempWlocation;

$(document).ready(function()
{
    getSettingInfo();
    
	$('body').addClass(parent.site_name);
	$('body').show();
	settingLang(parent.site_lang);
    settingWlocation(parent.site_wlocation);
	for(var i = 0; i < 5; i++){
		pushAlram_checkbox_list[i]=0;
		lock_checkbox_list[i]=0;
	}

	checkBoxInit();
	numberButtonEvnetInit();
	bindForActiveEffect();
	homeModeInit();
	$("#appver_title ").html($.lang[parent.site_lang]['text_look']);		//세대정보(동, 호)
	//$(".popup_appInfo_span").html( $.lang[parent.site_lang]['now_version']+ '<br>'+'정보 보기');

	//폰트 사이즈 CSS 셋팅
	//setFontSizeCSS();

	//통화 기능 여부 가져오기
	getSettingInfo_Call();
	
	//계정정보 가져오기
	getSettingInfo_Account();

	//잠금해제 설정 가져오기
	getSettingInfo_LockScreen();

	//푸쉬알림 설정 가져오기
	getSettingInfo_Push();

});

function onDeviceReady()
{
	console.log("device ready...tablet_control_gas");
}


/************************************************************************
 *                             button
 ************************************************************************/

$(document).on('click', '#btn_back', function(){
	parent.gotoHome();
});

// 귀가모드
$(document).on('click', '#btn_homeMode', function(){
	$('#popup_home').show();
	$('.modal').show();
});

$(document).on('click', '.btn_popup_home_ok', function(){
	$('#popup_home').hide();
    $('.modal').hide();
    setHomeMode();
});

$(document).on('click', '.btn_popup_home_cancel', function(){
	$('#popup_home').hide();
    $('.modal').hide();
    homeModeInit();
});


// 통화벨 모드
$(document).on('click', '#btn_callMode', function(){
	console.log('btn_callMode!!!')
	$('#popup_callmode').show();
	$('.modal').show();
});

$(document).on('click', '.btn_popup_home_ok', function(){
	$('#popup_callmode').hide();
    $('.modal').hide();
});

$(document).on('click', '.btn_popup_home_cancel', function(){
	$('#popup_callmode').hide();
    $('.modal').hide();
});


//계정정보
$(document).on('click', '#btn_accountInfo', function(){
	$('#popup_accountInfo').show();
	$('.modal').show();
});

//앱정보
$(document).on('click', '#btn_appInfo', function(){
	$('#popup_appInfo').show();
	$('.modal').show();
});

$(document).on('click', '.btn_popup_appInfo_ok ', function(){
	$('#popup_appInfo').hide();

	$('.modal').hide();
});

$(document).on('click', '.btn_popup_appInfo_terms ', function(){
	$('#terms').html(text_terms);
	$('#terms').animate({scrollTop:0},100);
	$('#popup_terms').show();
});

$(document).on('click', '.btn_popup_appInfo_privacy ', function(){
	$('#terms').html(text_privacy);
	$('#terms').animate({scrollTop:0},100);
	$('#popup_terms').show();
});

$(document).on('click', '.btn_popup_terms_ok  ', function(){
	$('#popup_terms').hide();
});


$(document).on('click', '#btn_popup_accountInfo_cancel', function(){
	$('#popup_accountInfo').hide();
	$('.modal').hide();
});

	$(document).on('click', '.btn_popup_accountInfo_logout', function(){
		parent.logout();
	});

		//비밀번호변경
		$(document).on('click', '.btn_popup_accountInfo_pw', function(){
			$('#input_popup_pw').val('');
			$('#input_popup_pw_check').val('');
			$('#popup_accountInfo_changepw').show();
			$('#popup_accountInfo').hide();

		});

		$(document).on('click', '.btn_popup_accountInfo_changepw_ok', function(){

			var pw = $('#input_popup_pw').val();
			var pw_check = $('#input_popup_pw_check').val();



			if(checkPw(pw,pw_check)){
				modifyPassword(pw);
				$('#popup_accountInfo_changepw').hide();
				$('#popup_accountInfo').show();

			}

			/*
			if(CheckPW(pw,pw_check)){
				modifiyPassword(pw);
			}*/

		});

		$(document).on('click', '.btn_popup_accountInfo_changepw_cancel', function(){
			$('#popup_accountInfo_changepw').hide();
			$('#popup_accountInfo').show();
		});

		$(document).on('click', '.btn_popup_accountInfo_ok', function(){
			$('#popup_accountInfo').hide();
			$('.modal').hide();
		});



//잠금해제번호 사용
$(document).on('click', '#btn_lock', function(){
	$('#popup_lock').show();
	$('.modal').show();
	isLockPopupOpen = true;
});

//통화 기능 사용
$(document).on('click', '#btn_call', function(){
	$('#popup_call').show();
	$('.modal').show();
	isLockPopupOpen = true;
});

	$(document).on('click', '.btn_popup_call_ok', function(){
		$('#popup_call').hide();
		$('.modal').hide();
		if(parent.pluginCall == null){
			if(pushCallSwitchOnoff == 1){
				$('#call_title').html($.lang[parent.site_lang]['switch_on']);
                $('#call_title').removeClass('title_off').addClass('title_on');
			}else{
				$('#call_title').html($.lang[parent.site_lang]['switch_off']);
                $('#call_title').removeClass('title_on').addClass('title_off');
			}
		}else{
			if(pushCallSwitchOnoff == 1){
				parent.pluginCall.enableSipApp('true');
				$('#call_title').html($.lang[parent.site_lang]['switch_on']);
                $('#call_title').removeClass('title_off').addClass('title_on');
			}else{
				parent.pluginCall.enableSipApp('false');
				$('#call_title').html($.lang[parent.site_lang]['switch_off']);
                $('#call_title').removeClass('title_on').addClass('title_off');
			}

		}
		localStorage.setItem("config_call",pushCallSwitchOnoff);
	});

	$(document).on('click', '.btn_popup_call_cancel', function(){
		$('#popup_call').hide();
		$('.modal').hide();
		getSettingInfo_Call();

	});


$(document).on('click', '#popup_lock .lcs_cursor', function(){
	setTimeout(function(){
		//settingLock0();
	}, 500);
});

$(document).on('click', '#lock_checkbox_1', function(){
	settingLock1();
});

$(document).on('click', '#lock_checkbox_2', function(){
	settingLock2();
});


$(document).on('click', '.btn_popup_lock_ok', function(){
	$('#popup_lock').hide();
	$('.modal').hide();
});

//잠금해제번호 변경
$(document).on('click', '.btn_popup_lock_change', function(){

	if(inputLockNo == 0){
		return;
	}


	showLockNumPopup();
});

$(document).on('click', '.btn_popup_lockNum_cancel', function(){

	if(inputLockNo == 0){

		//$('#checkbox_lock').lcs_off();
		lock_checkbox_list[0] = 0;
		//settingLock0();
		lock_checkbox(0, 0);

	}
	$('#popup_lockNum').hide();

});


//푸쉬알림 설정
$(document).on('click', '#btn_pushAlram', function(){
	$('#popup_pushAlram').show();
	$('.modal').show();
	isLockPopupOpen = true;
});

$(document).on('click', '.btn_popup_alram_ok', function(){
	$('#popup_pushAlram').hide();
	$('.modal').hide();
	localStorage.setItem("config_fontsize",config_fontsize);
	fontsize_checkbox(config_fontsize);
});

$(document).on('click', '.btn_popup_alram_cancel', function(){
	$('#popup_pushAlram').hide();
	$('.modal').hide();
});


$(document).on('click', '#btn_wlocation', function(){
    $('#popup_wlocation').show();
    $('.modal').show();
    isLockPopupOpen = true;
});


$(document).on('click', '.btn_popup_wlocation_ok', function(){
    parent.site_wlocation = tempWlocation;
    localStorage.setItem("config_wlocation",tempWlocation);
    parent.getSiteWlocation(tempWlocation);
    $('#popup_wlocation').hide();
    $('.modal').hide();
});


$(document).on('click', '.btn_popup_wlocation_cancel', function(){
    settingWlocation(parent.site_wlocation);
    $('#popup_wlocation').hide();
    $('.modal').hide();
});


$(document).on('click', '#btn_lang', function(){
	$('#popup_lang').show();
	$('.modal').show();
	isLockPopupOpen = true;
});

$(document).on('click', '.btn_popup_lang_ok', function(){
	parent.site_lang = tempLang;
	//parent.getSiteInfo();
	
	console.log('실행!!!! : ', parent.setLanguage(tempLang))
	parent.requestGuardStatus();
	localStorage.setItem("config_lang",tempLang);
	$("#appver_title ").html($.lang[parent.site_lang]['text_look']);		//세대정보(동, 호)
	//$(".popup_appInfo_span").html( $.lang[parent.site_lang]['now_version']+ '<br>'+$.lang[parent.site_lang]['text_look']);
	getSettingInfo_Call();
	getSettingInfo_Push();
	getSettingInfo_Account();
	$('#popup_lang').hide();
	$('.modal').hide();
	parent.setLanguage(tempLang);
});

$(document).on('click', '.btn_popup_lang_cancel', function(){
	settingLang(parent.site_lang);
	$('#popup_lang').hide();
	$('.modal').hide();
});
/* 귀가 모드 */
function homeModeInit(){
	
    if(localStorage.getItem("config_home_light_on") == '1'){
        $('#homemode_1 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_1 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    }
    
    if(localStorage.getItem("config_home_aircon_on") == '1'){
        $('#homemode_2 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_2 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    }
    
    if(localStorage.getItem("config_home_curtain_open") == '1'){
        $('#homemode_3 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_3 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    }
    
    if(localStorage.getItem("config_home_heating_on") == '1'){
        $('#homemode_4 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_4 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
	}
}

function setHomeMode(){
    if($('#homemode_1 > .checkbox').hasClass('ckeckbox_off')){
        localStorage.setItem("config_home_light_on", '0')
    }else{
        localStorage.setItem("config_home_light_on", '1')
    }

    if($('#homemode_2 > .checkbox').hasClass('ckeckbox_off')){
        localStorage.setItem("config_home_aircon_on", '0')
    }else{
		localStorage.setItem("config_home_aircon_on", '1')
    }

    if($('#homemode_3 > .checkbox').hasClass('ckeckbox_off')){
        localStorage.setItem("config_home_curtain_open", '0')
    }else{
        localStorage.setItem("config_home_curtain_open", '1')
    }

    if($('#homemode_4 > .checkbox').hasClass('ckeckbox_off')){
        localStorage.setItem("config_home_heating_on", '0')
    }else{
		localStorage.setItem("config_home_heating_on", '1')
	}
	console.log('localStorage : ', localStorage)
}


$(document).on('click', '#homemode_1', function(){
    $(this).children('.checkbox').toggleClass('ckeckbox_off').toggleClass('ckeckbox_on');
});

$(document).on('click', '#homemode_2', function(){
    $(this).children('.checkbox').toggleClass('ckeckbox_off').toggleClass('ckeckbox_on');
	if($(this).children('.checkbox').hasClass('ckeckbox_on')){
		$('#homemode_4 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off')
	}
});

$(document).on('click', '#homemode_3', function(){
    $(this).children('.checkbox').toggleClass('ckeckbox_off').toggleClass('ckeckbox_on');
});

$(document).on('click', '#homemode_4', function(){
	$(this).children('.checkbox').toggleClass('ckeckbox_off').toggleClass('ckeckbox_on');
	if($(this).children('.checkbox').hasClass('ckeckbox_on')){
		$('#homemode_2 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off')
	}
});

$(document).on('click', '#pushAlram_checkbox_1', function(){
	settingPush1();
});

$(document).on('click', '#pushAlram_checkbox_2', function(){
	settingPush2();
});

$(document).on('click', '#pushAlram_checkbox_3', function(){
	settingPush3();
});

$(document).on('touchend', '#pushAlram_checkbox_4', function(){
	settingPush4();
});


$(document).on('touchend', '#pushAlram_checkbox_5', function(){
	settingPush5();
});

$(document).on('touchend', '#pushAlram_checkbox_6', function(){
	settingPush6();
});

$(document).on('click', '#lang_checkbox_1', function(){
	settingLang('ko');
});

$(document).on('click', '#lang_checkbox_2', function(){
	settingLang('en');
});

$(document).on('click', '#lang_checkbox_3', function(){
	settingLang('ch');
});


$(document).on('click', '#wlocation_checkbox_1', function(){
    settingWlocation('Tokyo');
});

$(document).on('click', '#wlocation_checkbox_2', function(){
    settingWlocation('Osaka');
});

$(document).on('click', '#wlocation_checkbox_3', function(){
    settingWlocation('Sapporo');
});


$(document).on('click', '#checkbox_fontsize_normal', function(){
	fontsize_checkbox(0);
});

$(document).on('click', '#checkbox_fontsize_large', function(){
	fontsize_checkbox(1);
});


//글자크기 변경
$(document).on('click', '#btn_fontSize', function(){
	console.log('asd');
	$('#popup_fontSize').show();
	$('.modal').show();
});

$(document).on('click', '#btn_popup_fontSize_cancel', function(){
	$('#popup_fontSize').hide();
	$('.modal').hide();
});

$(document).on('click', '.btn_popup_fontSize_ok', function(){
	$('#popup_fontSize').hide();
	$('.modal').hide();
	localStorage.setItem("config_fontsize",config_fontsize);
	fontsize_checkbox(config_fontsize);
	parent.updateFontSizeCSS(config_fontsize);
	updateFontSizeCSS(config_fontsize);
});

$(document).on('click', '.btn_popup_fontSize_cancel', function(){
	$('#popup_fontSize').hide();
	$('.modal').hide();
});


/************************************************************************
 *                             AJAX
 ************************************************************************/

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
		success: function(data)
		{
			if(data.result == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_account.do");
			}
			else if(data.result == 1)
			{
				console.log(data);

				if(data.id !== 'guest') {


                    var dongHo = data.DONGHO.split("-");
                    var dong = Number(dongHo[0]);
                    var ho = Number(dongHo[1]);

                    accountInfoTitle = data.COMPLEX_NAME + ' ' + dong + $.lang[parent.site_lang]['text_dong'] + ' ' + ho + $.lang[parent.site_lang]['text_ho'] + ' ' + data.ACCOUNT_NAME;
                    var tempLength;
                    var value = localStorage.getItem("config_fontsize");
                    if (value == 1) {
                        tempLength = 32;
                    } else {
                        tempLength = 36;
                    }
                  //  $("#accountInfo_title ").html(stringSplit(accountInfoTitle, tempLength)); //세대정보(동, 호)

                    $(".accountInfo_span").html(data.COMPLEX_NAME + ' ' + dong + $.lang[parent.site_lang]['text_dong'] + ' ' + ho + $.lang[parent.site_lang]['text_ho'] + '<br> ID : ' + data.ACCOUNT_NAME); //세대정보(동, 호)
                }else{
                   // $("#accountInfo_title ").html(stringSplit(accountInfoTitle, tempLength)); //세대정보(동, 호)

                    $(".accountInfo_span").html('101동 101호'+'<br/>'+'ID : guest'); //세대정보(동, 호)

                }


			}
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/setting_list.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_account.do");
			}
		},
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}

/************[비밀번호 변경]*************/
function modifyPassword(value)
{

	tempPassword = value;
	$.ajax({
		url: "modify_password.do",
		type: "post",
		data: {"password":value, "deviceId":parent.deviceId},
		dataType: "json",
		cache: false,
		async:false,		//동기
		success: function(data){
			
			console.log('modify_password : ',data)
			if(data.result == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("modifiy_password.do");
				return;
			}
			else if(data.result == 1){
				alert('패스워드 변경이 완료되었습니다.');
				$('#popup_accountInfo').hide();
			}

		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/setting_list.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("modifiy_password.do");
			}
		},
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}


/************[잠금해제 설정 / 푸쉬 알림 설정]*************/
function writeSettingInfo_PushAndLock(keyItem, value)
{
	$.ajax({
		url: "write_setting.do",
		type: "post",
		data: {"key":keyItem, "value":value},
		dataType: "json",
		cache: false,
		async: false, 			//동기
		success: function(data)
		{
			if(data.result == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_list.do");	// 다시 정보를 얻는다....
			}
			else if(data.result == 1)
			{
				console.log("write_setting_result data: " ,data);
				console.log("keyItem: ",keyItem);
				console.log("value: ",value);
				if(keyItem == "USE_PUSH_ALARM")
				{
					pushAlram_checkbox(0,value);		//푸시알람 사용여부
					
				}
				else if(keyItem == "USE_PUSH_ALARM_OUTMODE")
				{
					pushAlram_checkbox(1,value);		//외출모드 설정/해제
				}
				else if(keyItem == "USE_PUSH_ALARM_CAR_IN")
				{
					pushAlram_checkbox(2,value);		//입차통보
				}
				else  if(keyItem == "USE_PUSH_ALARM_NOTICE")
				{
					pushAlram_checkbox(3,value);		//신규 공지/택배
				}
				/*********************** 잠금해제번호사용 *************************/
				else if(keyItem == "APP_LOCK_NO")
				{
					lock_checkbox(0,value);		//잠금해제번호 사용여부
				}
				else if(keyItem == "USE_LOCK_NO_CONTROL")
				{
					lock_checkbox(1,value);		//제어시
				}
				else if(keyItem == "USE_LOCK_NO_SECURITY")
				{
					lock_checkbox(2,value);		//방범 변경시
				}
			}
			else if(data.result == -1)
			{
				console.log("write_setting....time out....");
			}
			else if(data.result == -2)  // 서버쪽 입력 실패..
			{
				console.log("server error to input setting value -- GR_PUSH");
				getSettingInfo("GR_PUSH");  // 다시 로드한다...
			}

		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/setting_write.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_list.do");	// 다시 정보를 얻는다....
			}
		},
		beforeSend: function(xhr)
		{
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


// 잠금해제 비밀번호 설정..
function settingLockNo(password)
{
	inputLockNo = 1;
	writeLockScreenInfo(password);
	$('#popup_lockNum').hide();
}


function btn_num(value){

	if(numCnt > 4){
		return;
	}

	tempNumber += value;
	console.log(value);

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
			console.log('잠금해제번호 셋팅 값: ',tempNumber);
			isPasswordNumChange = true;
			settingLockNo(tempNumber);
		}, 100);
	}
	console.log('tempNumber:',tempNumber);

}


function btn_delete(){

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
	console.log('tempNumber',tempNumber);
}




function fontsize_checkbox(value){

	if(value == 1){
		$('#checkbox_fontsize_normal .checkbox').removeClass('ckeckbox_on');
		$('#checkbox_fontsize_normal .checkbox').addClass('ckeckbox_off');
		$('#checkbox_fontsize_large .checkbox').removeClass('ckeckbox_off');
		$('#checkbox_fontsize_large .checkbox').addClass('ckeckbox_on');
		config_fontsize = 1;
		$('#fontsize_title').html('125%');
	}else{
		$('#checkbox_fontsize_normal .checkbox').removeClass('ckeckbox_off');
		$('#checkbox_fontsize_normal .checkbox').addClass('ckeckbox_on');
		$('#checkbox_fontsize_large .checkbox').removeClass('ckeckbox_on');
		$('#checkbox_fontsize_large .checkbox').addClass('ckeckbox_off');
		config_fontsize = 0;
		$('#fontsize_title').html('보통');
	}

}

/********************** checkbox init *************************/
function checkBoxInit(){
	$('input').lc_switch($.lang[parent.site_lang]['switch_on'],$.lang[parent.site_lang]['switch_off']);

	$('body').delegate('#popup_lock .lcs_check', 'lcs-statuschange', function() {
		lockSwitchOnoff = ($(this).is(':checked')) ? 1 : 0;
		console.log('잠금해제 스위치:',lockSwitchOnoff);

	});

	$("#popup_lock .lcs_switch").bind("touchend mousedown", function(){
		console.log('잠금해제 스위치 클릭');
		setTimeout(function(){
			if(lockSwitchOnoff == 0){
				console.log('field is off');
				lock_checkbox_list[0] = 0;
				//settingLock0();
				useLockNo=0;
				writeLockScreenInfo(0);
				lock_checkbox(0, 0);
			}else if(lockSwitchOnoff == 1 ){
				lock_checkbox_list[0] = 1;
				useLockNo=1;
				if(inputLockNo == 0){
					showLockNumPopup();
				}
				//settingLock0();
			}
		},300);
	});

	$('body').delegate('#popup_pushAlram .lcs_check', 'lcs-statuschange', function() {
		pushAlramSwitchOnoff = ($(this).is(':checked')) ? 1 : 0;
		console.log('푸쉬알림 스위치:',pushAlramSwitchOnoff);
	});

	$("#popup_pushAlram .lcs_switch").bind("touchend mousedown", function(){
		console.log('푸쉬알림 스위치 클릭');
		setTimeout(function(){
			if(pushAlramSwitchOnoff == 0){
				console.log('field is off');
				pushAlram_checkbox_list[0] = 0;
				settingPush0();
				pushAlram_checkbox(0, 0);
			}else if(pushAlramSwitchOnoff == 1 ){
				pushAlram_checkbox_list[0] = 1;
				settingPush0();
			}
		},300);
	});



	$('body').delegate('#popup_call .lcs_check', 'lcs-statuschange', function() {
		pushCallSwitchOnoff = ($(this).is(':checked')) ? 1 : 0;
		console.log('통화기능 스위치:',pushCallSwitchOnoff);
	});


}

/**********************  number button event init *************************/
function numberButtonEvnetInit(){
	for(var i =0; i <= 9; i++){
		$("#number"+i).bind("touchstart click", function(){
			btn_num($(this).html());
		});
	}

	$("#btn_delete").bind("touchstart click", function(){
		btn_delete();
	});
}

function showLockNumPopup(){
	$('#popup_lockNum').show();
	$('#keypad_input').html('○○○○');
	numCnt = 0;
	numValue = '';
	tempNumber = '';
}

/**********************   bind for active effect *************************/
function bindForActiveEffect() {
	$('.number').bind('touchstart touchend mouseup mousedown', function (e) {
		e.preventDefault();
		$(this).toggleClass('num_active_effect');
	});

	$('.btn_deleteNum').bind('touchstart touchend mouseup mousedown', function (e) {
		e.preventDefault();
		$(this).toggleClass('btn_deleteNum_active_effect');
	});

	$('.btn_popup_accountInfo_logout').bind('touchstart touchend mouseup mousedown', function (e) {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_accountInfo_pw').bind('touchstart touchend mouseup mousedown', function (e) {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_accountInfo_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.btn_popup_accountInfo_changepw_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_accountInfo_changepw_cancel').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.btn_popup_lock_change').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_lock_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_lockNum_cancel').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_alram_cancel').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnGrayColor_active');
	});
	$('.btn_popup_lang_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_lang_cancel').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.btn_popup_fontSize_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_fontSize_cancel').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_call_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_call_cancel').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.btn_popup_appInfo_terms').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_appInfo_privacy').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnMainColor_active');
	});



	$('.btn_popup_appInfo_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnGrayColor_active');
	});

	$('.btn_popup_terms_ok').bind('touchstart touchend mouseup mousedown', function () {
		$(this).toggleClass('btnGrayColor_active');
	});

}

function getSettingInfo_Call(){
	config_call = localStorage.getItem("config_call");
	if(config_call == undefined || isNaN(config_fontsize)){
		config_call = 0;
	}

	if(config_call == 1){
		$('#call_title').html($.lang[parent.site_lang]['switch_on']);
		$('#checkbox_call').lcs_on();
		pushCallSwitchOnoff = 1;

	}else if(config_call == 0){
		$('#call_title').html($.lang[parent.site_lang]['switch_off']);
		$('#checkbox_call').lcs_off();
		pushCallSwitchOnoff=0;
	}

}

function checkPw(pwd,pwd_re){
		var chk_num = pwd.search(/[0-9]/g);
		var chk_eng = pwd.search(/[a-z]/ig);

		if(pwd == null || pwd == undefined || pwd == ''){
			alert('패스워드를 입력하세요.');
			$('#input_popup_pw').focus();
			return;
		}

		if(pwd_re == null || pwd_re == undefined || pwd_re == ''){
			alert('패스워드 확인을 입력하세요.');
			$('#input_popup_pw_check').focus();
			return;
		}


		if(!/^[a-zA-Z0-9]{8,20}$/.test(pwd)){
			alert('패스워드는 영문자와 숫자 조합으로 8자리 이상으로 사용해야 합니다.');
			return false;
		}

		if(pwd != pwd_re){
			alert('패스워드가 일치하지 않습니다.');
			return false;
		}

		if(chk_num < 0 || chk_eng < 0){
			alert("패스워드는 숫자와 영문자를 혼용하여야 합니다.");
			return false;
		}

		if(/(\w)\1\1\1/.test(pwd)){
			alert('패스워드에 같은 문자를 4번 이상 사용하실 수 없습니다.');
			return false;
		}
		return true;

}

//문자열 자르기
function stringSplit(string,cnt){
	var tempString='';

	if(string.length > cnt){
		tempString = string.substring(0,cnt)+'...';
	}else{
		tempString = string;
	}
	return tempString;
}

function setFontSizeCSS(){

	//폰트정보 가져오기
	config_fontsize = localStorage.getItem("config_fontsize");

	if(config_fontsize == undefined || isNaN(config_fontsize)){
		config_fontsize = 0;
	}
	fontsize_checkbox(config_fontsize);
	value = config_fontsize;

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

	var tempLength;

	if(value == 0){
		$('head').find("#largeFontcss").remove();
		$('head').append('<link id="normalFontcss" rel="stylesheet" href="'+normalFont+'" type="text/css" />');
		tempLength = 36;
	}else{
		$('head').find("#normalFontcss").remove();
		$('head').append('<link id="largeFontcss" rel="stylesheet" href="'+large+'" type="text/css" />');
		tempLength = 32;
	}
	//$("#accountInfo_title").html(stringSplit(accountInfoTitle,tempLength));		//세대정보(동, 호)

}



function limit(element,maxlength)
{
	if(element.value.length > maxlength) {
		element.value = element.value.substr(0, maxlength);
	}
}



function getSettingInfo()
{
	$.getJSON("/resources/cvnet/siteinfo/info.json", function(json) {
		console.log(json.site); // this will show the info it in firebug console
		if(json.use_call == '1'){
			$('.list_call').css('display','inline-block');
		}

		if(json.use_language == '1'){
			$('.list_language').css('display','inline-block');
		}
    });

    // 귀가 모드 설정
    if(localStorage.getItem("config_home_light_on") == '1'){
        $('#homemode_1 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_1 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    }

    if(localStorage.getItem("config_home_curtain_open") == '1'){
        $('#homemode_2 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_2 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    }

    if(localStorage.getItem("config_home_aircon_on") == '1'){
        $('#homemode_3 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_3 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    }

    if(localStorage.getItem("config_home_heating_on") == '1'){
        $('#homemode_4 > .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#homemode_4 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
    }

}


function settingLang(setlang)
{
	$('#popup_lang .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');
	if(setlang == 'ko') {
		$('#lang_checkbox_1 .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
		$('#language_title').html('한국어');
		$('#input_popup_pw').attr('placeholder',$.lang[setlang]['pw']);
		$('#input_popup_pw_check').attr('placeholder',$.lang[setlang]['pw_check']);
	}else if(setlang == 'en') {
		$('#lang_checkbox_2 .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
		$('#language_title').html('English');
	}else{
		$('#lang_checkbox_3 .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
		$('#language_title').html('中國語');
	}
	localStorage.setItem("config_lang",setlang);
    console.log('settingLang:',setlang);
	setLanguage(setlang);
	tempLang = setlang;



}

function settingWlocation(setWloaction){

    $('#popup_wlocation .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off');

    if(setWloaction == 'Tokyo') {
        $('#wlocation_checkbox_1 .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else if(setWloaction == 'Osaka') {
        $('#wlocation_checkbox_2 .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }else{
        $('#wlocation_checkbox_3 .checkbox').removeClass('ckeckbox_off').addClass('ckeckbox_on');
    }

    $('#wlocation_title').html(setWloaction);
    localStorage.setItem("config_wlocation",setWloaction);
    tempWlocation = setWloaction;
}


$(document).on('touchend', '#callbell_checkbox_1', function(){
	$(this).children('.checkbox').addClass('ckeckbox_on');
	$('#callbell_checkbox_2 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off')
	writeSettingInfo_PushAndLock('USE_PUSH_WEBRTC_MODE' ,1);
});

$(document).on('touchend', '#callbell_checkbox_2', function(){
	$(this).children('.checkbox').addClass('ckeckbox_on');
	$('#callbell_checkbox_1 > .checkbox').removeClass('ckeckbox_on').addClass('ckeckbox_off')
	writeSettingInfo_PushAndLock('USE_PUSH_WEBRTC_MODE' ,2);
});