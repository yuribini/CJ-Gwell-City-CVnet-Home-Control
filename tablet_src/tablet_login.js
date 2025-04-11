//초기 변수
//for lock number button
var tempNumber='';
var numCnt=0;
var numValue = '';
var autoLoginInterVal = null;
var intervalCount = 0;
var now_js_name = "tablet/tablet_login.js";
var versionInfo = null, pluginPush = null , pluginCall = null;
var userId;
var deviceId = "0";
var tokenId = "0";
var checkbox = false;
var bDocumentLoaded= false;
var bTryAutoLogin = false;
var findIdList=[];
var strAgent;
var isDemoMode=false;
var site_lang;
var bPhoneGap = false;
var site_name_temp;
//self-function: 이 js 파일이 로딩시 바로 호출되는 함수...
(function() {
	if(localStorage.getItem("config_autologin") == 1){
		//autoLoginCheck();
	}else{
		$('#progress_body').hide();
		$('#body').hide();
	}
	//demo_login();
	strAgent = navigator.userAgent.toLowerCase();

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

	if(strAgent.match('cordova_tablet') && strAgent.match('android')){
		bPhoneGap = true;
		console.log(now_js_name + "... is phone gap...");

		var headTag = document.getElementsByTagName("head")[0];
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.onload = function() {
			//console.log("loaded cordova javascript succeed : " + now_js_name);
			loadNativeInterfacePlugin();

		};
		newScript.src = '/resources/cvnet/scripts/common/cordova.js?ver=201911501';
		headTag.appendChild(newScript);
		return;
	}else if(strAgent.match('cordova_tablet') && strAgent.match('iphone')){
		bPhoneGap = true;
		console.log(now_js_name + "... is phone gap...");

		var headTag = document.getElementsByTagName("head")[0];
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.onload = function() {
			//console.log("loaded cordova javascript succeed : " + now_js_name);
			loadNativeInterfacePlugin();

		};
		newScript.src = '/resources/cvnet/scripts/common/cordova_ios.js?ver=2016081606';
		headTag.appendChild(newScript);
		return;
	}

	//alert(strAgent);
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
		//console.log("loaded cordova loadNativeInterfacePlugin : " + now_js_name);
		document.addEventListener("deviceready", onDeviceReady, false);
		document.addEventListener("resume", onResume, false);
		document.addEventListener("pause", onPause, false);
	};
	newScript.src = '/resources/cvnet/scripts/common/plugin_native_interface.js?ver=2016081606';
	headTag.appendChild(newScript);
	return;
}


/// Token ID 받는 콜백 함수 정의..
var funcGetTokenId = function onResult(_tokenId){
	console.log("onResult tokenId: " + _tokenId);
	tokenId = _tokenId;
	if(localStorage.getItem("config_autologin") == 1){
		autoLoginCheck();
	}else{
		$('#progress_body').hide();
	}

}

function onPause()
{
	console.log("-----------------onPause(): " + now_js_name);
	//alert('onPause');
	//localStorage.setItem("config_create",0);

}

function onResume()
{
	//localStorage.setItem("config_create",1);
	console.log("--------------onResume");
	//existLockScreen(0);
}

function onDeviceReady()
{
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

		}else if(strAgent.match('cordova_tablet') && strAgent.match('iphone')){
			function success(token){
				tokenId = token;
				if(localStorage.getItem("config_autologin") == 1){
					autoLoginCheck();
				}else{
					$('#progress_body').hide();
				}
			}
			function error(error){
				//alert(error);
			}
			FCMPlugin.getToken(success, error);
		}

		//pluginCall = new CallPlugin();
		//onDocumentReady();
		onDocumentReady();
		autoLoginInterVal = setInterval(function()
		{
			intervalCount++;
			if((tokenId != null && tokenId != "0") || intervalCount >= 10)
			{
				intervalCount = 0;
				var configCreate = localStorage.getItem("config_create");

				if(configCreate != null && configCreate == 0)
				{
					//localStorage.setItem("config_create",1);
					//onResume();
				}
			}
		}, 200);

	}
}

$(document).ready(function()
{
	if(bPhoneGap == false)
	{
		onDocumentReady();
	}
});

function onDocumentReady(){
    getSiteInfo();
	if(bDocumentLoaded == true) {
		return;
	}
	console.log("on document ready..." + now_js_name);
	bDocumentLoaded = true;
	/// do something.......
	/* if(autoLoginCheck("") == true){
		return;
	} */


	var $input = $('.input_dong')
	$input.keyup(function(e) {
		var max = 4;
		if ($input.val().length > max) {
			$input.val($input.val().substr(0, max));
		}
	});



	/************************************************************************
	 *                        bind for active effect
	 ************************************************************************/

	$('.btn_login').bind('touchstart touchend', function() {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_search').bind('touchstart touchend', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('.btn_popup_tempPassword').bind('touchstart touchend', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('.btn_popup_gotoLogin').bind('touchstart touchend', function() {
		$(this).toggleClass('btnMainColor_active');
	});

	$('.btn_popup_findMember').bind('touchstart touchend', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('.btn_cancel').bind('touchstart touchend', function() {
		$(this).toggleClass('btnSubColor_active');
	});

	$('.btn_tempPassword_cancel').bind('touchstart touchend', function() {
		$(this).toggleClass('btnSubColor_active');
	});


	$('.btn_signup').bind('touchstart touchend', function() {
		$(this).toggleClass('btnGrayColor_active');
	});




	$('.number').bind('touchstart touchend', function(e) {
		e.preventDefault();
		$(this).toggleClass('num_active_effect');
	});

	$('.btn_deleteNum').bind('touchstart touchend', function(e) {
		e.preventDefault();
		$(this).toggleClass('btn_deleteNum_active_effect');
	});

	// number button event init
	for(var i =0; i <= 9; i++){
		$("#number"+i).bind("touchstart click", function(){
			btn_num($(this).html());
		});
	}
	$("#btn_delete").bind("touchstart click", function(){
		btn_delete();
	});


}


/************************************************************************
 *                             Button
 ************************************************************************/
$('#btn_checkbox').click(function(){
	autoLoginCheckBox();
});


function autoLoginCheckBox(){
	if(checkbox){
		$('#checkbox').removeClass('ckeckbox_on');
		$('#checkbox').addClass('ckeckbox_off');
		checkbox = false;
	}else{
		$('#checkbox').removeClass('ckeckbox_off');
		$('#checkbox').addClass('ckeckbox_on');
		checkbox = true;
	}
}


$('#btn_tab1').click(function(){
	$('.space_tab1').show();
	$('.space_tab2').hide();
	$('#btn_tab1').removeClass('tab1_down');
	$('#btn_tab1').addClass('tab1');
	$('#btn_tab2').removeClass('tab2');
	$('#btn_tab2').addClass('tab2_down');

});

$('#btn_tab2').click(function(){
	$('.space_tab2').show();
	$('.space_tab1').hide();
	$('#btn_tab1').removeClass('tab1');
	$('#btn_tab1').addClass('tab1_down');
	$('#btn_tab2').removeClass('tab2_down');
	$('#btn_tab2').addClass('tab2');
});



$('.btn_popup_tempPassword').click(function(){
	getTempPassword();
});

//로그인
$(document).on('click', '.btn_login', function(){
	localStorage.setItem('callpush', 'n')
	login();
});


// 회원가입
$(document).on('click', '.btn_signup', function(){
    window.location.href  = "https://" + location.hostname + "/cvnet/tablet/register_member.view?site_name="+site_name_temp;

    document.next_register.action = "https://" + location.hostname + "/cvnet/tablet/register_member.view?site_name="+ site_name_temp;
    console.log('document.next_register.action : ', document.next_register.action);


    //로컬 테스트...
    //document.next_register.action = "http://" + _url + ":8080"+  "/cvnet/mobile/register_member_view.do";
    document.next_register.complex_url.value = location.hostname;
    document.next_register.submit();
});

$(document).on('click', '.btn_search', function(){
	$('.modal').show();
	$('#popup_search_idpw').show();
	findIdList=[];
	$('.input_dong').val('');
	$('.input_ho').val('');
	$('.input_findId').val('');
	$('.input_housekey1').val('');
	$('.input_housekey2').val('');
});

$('.btn_popup_gotoLogin').click(function(){
	$('.modal').hide();
	$('#popup_search_idpw').hide();
});

$('.btn_popup_findMember').click(function(){
	find_memeber();
});

$('.btn_cancel').click(function(){
	$('.popup_findMemberList').hide();
});

$('.btn_tempPassword_cancel').click(function(){
	$('.popup_tempPassword').hide();
	$('#popup_search_idpw').hide();

});

async function  getSIP(userId)
{
	await  $.ajax({
							  url: "../mobile/getSIPInfo.do?loginId="+userId,
							  type: "get",
							  dataType: "json",
							  async:false,
							  cache: false,
							  success: function(data){
								  console.log('getSIP : ', data)
								  localStorage.setItem('sipinfo',JSON.stringify(data));
								  
							  },
							  fail:function(data, textStatus, errorThrown){
										console.log("fail in get addr");
										callback(data);
							  },
							  error: function(xhr,status,error)
							  {
								console.log("../mobile/getSIPInfo.do - code:"+xhr.status+"\n"+"error:"+error);
								if(xhr.status == 401 || xhr.status == 0)
								{
									console.log("Login Session Expired.... try AutoLogin...");
									autoLoginCheck('badge_info.do');
								}
							  }
							  
	  });
	
}

/************************************************************************
 *                             AJAX
 ************************************************************************/
function login()
{


	userId = $(".input_id").val().trim(); ///수정 변수 겹침
	var userPw = $(".input_pw").val();


	if(!Checkinfo3(userId,userPw)){
		return;
	}

	/* if(tokenId === null || tokenId === 0 || tokenId === '') {
        tokenId = localStorage.getItem("config_autologin_tokenId");
    }else{
        localStorage.setItem("config_autologin_tokenId",tokenId);
    } */

	$.ajax({
		url: "login.do",
		type: "post",
		data: {"id":userId, "password":userPw, "deviceId": deviceId, "tokenId":tokenId},
		dataType: "json",
		cache: false,
		success: function(data){
			if(data.result == 0){
				showMessage("로그인 실패: " + data.message);
				$('#body').show();
			}else if(data.result == 1){
		  	   if(userId.toLowerCase() !='guest')
								getSIP(userId);;
				SetAutoLogin(userId,userPw);
			}
		},
		error:function(request,status,error)
		{
			//alert("login.do - code:"+request.status+"\n"+"error:"+error);
			showMessage("서버와 연결이 끊어졌습니다. [" + xhr.status + "]");
		}
	  });
}
function demo_login()
{

	var	userId = 'wt01';
	var userPw = 'pw';

	$.ajax({
		url: "login.do",
		type: "post",
		data: {"id":userId, "password":userPw, "deviceId": deviceId, "tokenId":tokenId},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			location.href="home.view";
		},
		error:function(request,status,error)
		{
			//alert("login.do - code:"+request.status+"\n"+"error:"+error);
			showMessage("서버와 연결이 끊어졌습니다. [" + xhr.status + "]");
		}
	});
}

function find_memeber()
{
	var dong = $(".input_dong").val(),
		ho = $(".input_ho").val(),
		key = $(".input_housekey1").val().toUpperCase();
	if(!Checkinfo1(dong,ho,key)){
		return;
	}

	$.ajax({
		url: "find_member.do",
		type: "post",
		data: {"dong":dong, "ho":ho, "key":key},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			console.log(data);

			if(data.result == 0)
			{
				showMessage("로그인 실패: " + data.message);
			}
			else if(data.result == 1)
			{
				if(data.success == 0){
					showMessage(data.desc);
					return;
				}

				console.log(data);
				if( data.contents.length == null){
					showMessage("아이디 찾기를 실패했습니다.");
					return;
				}
				var output="";
				for (var i = 0; i < data.contents.length; i++) {
					var contents = data.contents[i];
					output += '	<div id="list'+i+'" class="list" onmousedown="selectFindId('+i+')" >'+contents.id+'</div>';
					findIdList[i] = contents.id;
				}

				$('.popup_findMemberList').show();

				$('.popup_findMemberList .select_space').html(output);

			}
		},
		error:function(request,status,error)
		{
			//alert("login.do - code:"+request.status+"\n"+"error:"+error);
			showMessage("서버와 연결이 끊어졌습니다. [" + xhr.status + "]");
		}
	});
}
function getTempPassword(){

	var id = $(".input_findId").val(),
		key = $(".input_housekey2").val().toUpperCase();

	console.log('key:',key);
	if(!Checkinfo2(id,key)){
		return;
	}

	$.ajax({
		url: "find_password.do",
		type: "post",
		data: {"id":id, "key": key},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			console.log(data);
			if(data.result == 0)
			{
				console.log("로그인 실패 : " + data.message);
			}
			else if(data.result == 1)
			{

				if(data.success == 0){
					showMessage(data.desc);
					return;
				}

				console.log(data);
				if(data.success == 1){
					$('.tempPassword').html('"'+data.desc+'"');
					$('.popup_tempPassword').show();
				}else{
					$('.tempPassword').html(data.message);
					$('.popup_tempPassword').show();
				}
			}else{
				showMessage('임시 패스워드 발급을 실패했습니다.');
			}
		},
		error:function(request,status,error)
		{
			//alert("login.do - code:"+request.status+"\n"+"error:"+error);
			showMessage("서버와 연결이 끊어졌습니다. [" + xhr.status + "]");
		}
	});
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
			if(data.result == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_list.do");
			}
			else if(data.result == 1)
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

			}

		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/setting_list.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_list.do");
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

			}
		},
		error:function(xhr,status,error)
		{
			console.log("mobile/check_lockscreen.do - code:"+xhr.status+"\n"+"error:"+error);
		}
	});

}
/// 자동 로그인 체크
function autoLoginCheck(){
	if(localStorage.getItem("config_autologin") == 0 ) return;

	if(localStorage.getItem("config_autologin_id") == null ) return;
	if(localStorage.getItem("config_autologin_pw") == null ) return;
	
	var token_val = tokenId;
	var send_data = {
		"id":localStorage.getItem("config_autologin_id"), 
		"password":localStorage.getItem("config_autologin_pw"), 
		"deviceId": deviceId, "tokenId":token_val
	}
	console.log('autoLoginCheck : ', send_data)
	$.ajax({
		url: "login.do",
		type: "post",
		data:  send_data,
		dataType: "json",
		success: function(data){
			console.log('login.do : ', data)
			if(data.result == 0){
				alert("로그인 실패 : " + data.message);
                $('#body').show();
			}else if(data.result == 1){
                location.href="home.view";
			   if (localStorage.getItem("config_autologin_id")!='guest')
					getSIP(localStorage.getItem("config_autologin_id"));
				
			}
			
		},
		error:function(request,status,error){
			//alert("login.do - code:"+request.status+"\n"+"error:"+error);
			alert("서버와 연결이 끊어졌습니다. [" + xhr.status + "]");
		}
	});
}

/// 자동로그인 설정
function SetAutoLogin(_id,_pw)
{
	var value = 0;

	/* if(checkbox){
		value = 1;
		localStorage.setItem("config_autologin",1);
		localStorage.setItem("config_autologin_id",_id);
		localStorage.setItem("config_autologin_pw",_pw);
		localStorage.setItem("config_autologin_tokenId",tokenId);
		localStorage.setItem("config_autologin_deviceId",deviceId);
	}else{
		localStorage.setItem("config_autologin",0);
		localStorage.setItem("config_autologin_id",'');
		localStorage.setItem("config_autologin_pw",'');
		localStorage.setItem("config_autologin_tokenId",'');
	} */
	value = 1;
	localStorage.setItem("config_autologin",1);
	localStorage.setItem("config_autologin_id",_id);
	localStorage.setItem("config_autologin_pw",_pw);
	/* 귀가 모드 */
	if(localStorage.getItem("config_home") != '1' || localStorage.getItem("config_home") == null){
		localStorage.setItem("config_home",0);
		localStorage.setItem("config_home_light_on",0);
		localStorage.setItem("config_home_curtain_open",0);
		localStorage.setItem("config_home_aircon_on",0);
		localStorage.setItem("config_home_heating_on",0);
	}
	

	$.ajax({
		url: "setting_autologin.do",
		type: "post",
		data: {"value":value},
		dataType: "json",
		cache: false,
		async: false,
		success: function(data)
		{
			if(data.result == 1)
			{
				if(data.success == 1){
					console.log('자동로그인 설정 성공');
				}

				//var config_call = localStorage.getItem("config_call");    0101	0810	1A97393EC93F


                if(bPhoneGap == false){
					location.href="home.view";
				}else{
					var href = location.href;
					var tempHref = href.substring(7,70);
					var tempAddr = tempHref.split('/');
					//pluginCall.invokeSipApp(userId,tempAddr[1],'tablet');
					location.href="home.view";
				}

			}
			else // data.result: 0 or -1
			{
				console.log("Login Session Expired - no autologin info....code: " + data.result);
			}
		},
		error:function(xhr,status,error)
		{
			console.log("tablet/auto_login_check.do - code:"+xhr.status+"\n"+"error:"+error);
			//if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired - no autologin info....");
			}
		}
	});
}

/************************************************************************
 *                             function
 ************************************************************************/

function selectFindId(index){
	$('.modal').hide();
	$('#popup_search_idpw').hide();
	$('.popup_findMemberList').hide();
	$('.input_id').val(findIdList[index]);
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


//예외처리
function Checkinfo1(dong,ho,auth_key){

	if(!/^[0-9]{3,4}$/.test(dong)){
		showMessage('동은 숫자 조합으로 3~4자리를 입력해야 합니다.');
		return false;
	}

	if(!/^[0-9]{3,4}$/.test(ho)){
		showMessage('호는 숫자 조합으로 3~4자리를 입력해야 합니다.');
		return false;
	}

	if(!/^[a-zA-Z0-9]{12}$/.test(auth_key)){
		showMessage('HOUSE KEY는 영문 또는 숫자 12자리를 입력해야 합니다.');
		return false;
	}

	return true;
}

//예외처리
function Checkinfo2(id,auth_key){

	if(id == undefined || id == ''){
		showMessage('아이디를 입력하세요.');
		return false;
	}

	if(!/^[a-zA-Z0-9]{12}$/.test(auth_key)){
		showMessage('HOUSE KEY는 영문 또는 숫자 12자리를 입력해야 합니다.');
		return false;
	}
	return true;
}

//예외처리
function Checkinfo3(id,pw){

	if(id == undefined || id == ''){
		showMessage('아이디를 입력하세요.');
		return false;
	}

	if(pw == undefined || pw == ''){
		showMessage('비밀번호를 입력하세요.');
		return false;
	}

	if(!/^[a-zA-Z0-9]{1,32}$/.test(id)){
		showMessage('ID는 영문자 또는 숫자 조합으로 사용해야 합니다.');
		return false;
	}

	return true;
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

//number button event init
function showLockScreen(){
	$('#popup_lock').show();
	$('.notice_top').show();
}

function hideLockScreen(){
	$('#keypad_input').html('○○○○');
	$('#popup_lock').hide();
	$('.notice_top').hide();
}

function limit(element,maxlength)
{
	if(element.value.length > maxlength) {
		element.value = element.value.substr(0, maxlength);
	}
}


function getSiteInfo()
{
	$.getJSON("/resources/cvnet/siteinfo/info.json?ver="+new Date().getTime(), function(json) {
        if(bPhoneGap == true){
            $('body').addClass('site_'+site_name);
            $('body').show();
        }else{
            $.getJSON("/resources/cvnet/siteinfo/info.json?ver="+new Date().getTime(), function(json) {
                console.log('json.site: ',json.site); // this will show the info it in firebug console
                site_name_temp = json.site;
                $('body').addClass('site_'+json.site);
                $('body').show();
            });
        }

		$.getJSON("/resources/cvnet/siteinfo/info.json?ver"+new Date().getTime(), function(json) {
			console.log('siteinfo: ',json, ' / ', json.use_call == 1); 
			if(parseInt(json.use_call) == 1){
				try{
				
					pluginCall = new CallPlugin();
					console.log('pluginCall : ', pluginCall)
					pluginCall.enableWebRTC();
				}catch(err){
					console.log('통화 로드 에러')
				}
			}
	
		});

		site_lang = localStorage.getItem("config_lang");
		console.log('site_lang : ',site_lang);

		if(site_lang == null || site_lang == undefined || site_lang == ''){
			site_lang = 'ko';
			//localStorage.getItem("config_lang");
			localStorage.setItem("config_lang",site_lang);
		}

		setLanguage(site_lang);
		$('.input_id').attr('placeholder',$.lang[site_lang]['id']);
		$('.input_pw').attr('placeholder',$.lang[site_lang]['pw']);
		$('.input_findId').attr('placeholder',$.lang[site_lang]['id']);

		$('.input_dong').attr('placeholder',$.lang[site_lang]['input_dong']);
		$('.input_ho').attr('placeholder',$.lang[site_lang]['input_ho']);
		$('.input_housekey1').attr('placeholder',$.lang[site_lang]['access_key']);
		$('.input_housekey2').attr('placeholder',$.lang[site_lang]['access_key']);

		if(site_lang == "en"){
			$('.tab1_notice_space').css('top','375px');
			$('.tab2_notice_space').css('top','375px');
			//$('.tab1_notice').css('font-size','14px');
		}
		if(localStorage.getItem("config_autologin") != 1){
			$('#body').show();
		}
	});
}
