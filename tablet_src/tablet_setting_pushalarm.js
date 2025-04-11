


/************************************************************************
 *                             AJAX
 ************************************************************************/

/************[푸시 정보 가져오기]*************/

function getSettingInfo_Push()
{
	console.log('푸시정보 호출!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	$.ajax({
		url: "setting_list.do",
		type: "post",
		data: {"key":"GR_PUSH", "type":0x01},		//type 0 : 개별 항목 요청, 1: 그룹 요청
		dataType: "json",
		cache: false,
		async:false,
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
				bTryAutoLogin = false;

				console.log('getSettingInfo_Push:',data);
				//푸시알람 사용여부
				pushAlram_checkbox(0,data.USE_PUSH_ALARM);
				
				//외출모드 설정/해제
				pushAlram_checkbox(1,data.USE_PUSH_ALARM_OUTMODE);

				//3G/LTE시 통화 호출
				pushAlram_checkbox(2,data.USE_PUSH_ALARM_LTE_CALL);
				
				//입차통보
				pushAlram_checkbox(3,data.USE_PUSH_ALARM_CAR_IN);
				
				//신규 공지/택배
				pushAlram_checkbox(4,data.USE_PUSH_ALARM_NOTICE);

				//제어실행
				pushAlram_checkbox(5,data.USE_PUSH_ALARM_CONTROL);

				//비상발생
				pushAlram_checkbox(6,data.USE_PUSH_ALARM_EMG);

				//WebRTC 설정
				pushAlram_checkbox(7,data.USE_PUSH_WEBRTC_MODE);

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



/************************************************************************
 *                             function
 ************************************************************************/

function pushAlram_checkbox(cnt, bool){

	console.log('cnt:'+cnt+'bool:'+bool);
	if(cnt == 0){
		console.log('pushAlram_checkbox:',bool);
		if(cnt == 0 && bool == 0) {
			pushAlram_checkbox_list[0]= 0;
			for(var i = 1; i <= 3; i++){
				pushAlram_checkbox_list[i]=0;
				$('#pushAlram_checkbox_'+i+' .checkbox').addClass('ckeckbox_off');
				$('#pushAlram_checkbox_'+i+' .checkbox').removeClass('ckeckbox_on');
			}

			$('#checkbox_alram').lcs_off();
			writeSettingInfo_PushAndLock("USE_PUSH_ALARM_OUTMODE", 0);
			writeSettingInfo_PushAndLock("USE_PUSH_ALARM_LTE_CALL", 0);
			writeSettingInfo_PushAndLock("USE_PUSH_ALARM_CAR_IN", 0);
			writeSettingInfo_PushAndLock("USE_PUSH_ALARM_NOTICE", 0);
			writeSettingInfo_PushAndLock("USE_PUSH_ALARM_CONTROL", 0);
			$('#pushAlram_title').html($.lang[parent.site_lang]['switch_off']);
            $('#pushAlram_title').removeClass('title_on').addClass('title_off');
		}else if(cnt == 0 && bool == 1){
			pushAlram_checkbox_list[0]= 1;
			$('#checkbox_alram').lcs_on();
			$('#pushAlram_title').html($.lang[parent.site_lang]['switch_on']);
            $('#pushAlram_title').removeClass('title_off').addClass('title_on');

		}
	}

	if(cnt == 7){
		console.log('WebRTC pushAlram_checkbox:',bool);
		if(bool == 1 || bool == ''){
			$('#callbell_checkbox_1').children('.checkbox').addClass('ckeckbox_on');
			$('#callbell_checkbox_2').children('.checkbox').addClass('ckeckbox_off');
		}else{
			$('#callbell_checkbox_1').children('.checkbox').addClass('ckeckbox_off');
			$('#callbell_checkbox_2').children('.checkbox').addClass('ckeckbox_on');
		}
		
		
	}

	if(bool == 0){
		pushAlram_checkbox_list[cnt]= 0;
		$('#pushAlram_checkbox_'+cnt+' .checkbox').addClass('ckeckbox_off');
		$('#pushAlram_checkbox_'+cnt+' .checkbox').removeClass('ckeckbox_on');
		return;
	}else{
		pushAlram_checkbox_list[cnt] = 1;
		$('#pushAlram_checkbox_'+cnt+' .checkbox').removeClass('ckeckbox_off');
		$('#pushAlram_checkbox_'+cnt+' .checkbox').addClass('ckeckbox_on');
	}
}

function settingPush0()
{
	console.log('settingPush0');

	writeSettingInfo_PushAndLock("USE_PUSH_ALARM", pushAlram_checkbox_list[0]);
}

function settingPush1()
{
	if(pushAlram_checkbox_list[1] == 0) {
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_OUTMODE", 1);
		$('#pushAlram_checkbox_1 .checkbox').removeClass('ckeckbox_off');
		$('#pushAlram_checkbox_1 .checkbox').addClass('ckeckbox_on');
	}else{
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_OUTMODE", 0);
		$('#pushAlram_checkbox_1 .checkbox').addClass('ckeckbox_off');
		$('#pushAlram_checkbox_1 .checkbox').removeClass('ckeckbox_on');
	}
}

function settingPush2()
{
	if(pushAlram_checkbox_list[2] == 0) {
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_CAR_IN", 1);
		$('#pushAlram_checkbox_2 .checkbox').removeClass('ckeckbox_off');
		$('#pushAlram_checkbox_2 .checkbox').addClass('ckeckbox_on');
	}else{
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_CAR_IN", 0);
		$('#pushAlram_checkbox_2 .checkbox').addClass('ckeckbox_off');
		$('#pushAlram_checkbox_2 .checkbox').removeClass('ckeckbox_on');
	}
}

function settingPush3()
{
	if(pushAlram_checkbox_list[3] == 0) {
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_NOTICE", 1);
		$('#pushAlram_checkbox_3 .checkbox').removeClass('ckeckbox_off');
		$('#pushAlram_checkbox_3 .checkbox').addClass('ckeckbox_on');
	}else{
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_NOTICE", 0);
		$('#pushAlram_checkbox_3 .checkbox').addClass('ckeckbox_off');
		$('#pushAlram_checkbox_3 .checkbox').removeClass('ckeckbox_on');
	}
}

function settingPush4()
{
	if(pushAlram_checkbox_list[4] == 0) {
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_NOTICE", 1);
		$('#pushAlram_checkbox_4 .checkbox').removeClass('ckeckbox_off');
		$('#pushAlram_checkbox_4 .checkbox').addClass('ckeckbox_on');
	}else{
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_NOTICE", 0);
		$('#pushAlram_checkbox_4 .checkbox').addClass('ckeckbox_off');
		$('#pushAlram_checkbox_4 .checkbox').removeClass('ckeckbox_on');
	}
}


function settingPush5()
{
	if(pushAlram_checkbox_list[5] == 0) {
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_CONTROL", 1);
		$('#pushAlram_checkbox_5 .checkbox').removeClass('ckeckbox_off');
		$('#pushAlram_checkbox_5 .checkbox').addClass('ckeckbox_on');
	}else{
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_CONTROL", 0);
		$('#pushAlram_checkbox_5 .checkbox').addClass('ckeckbox_off');
		$('#pushAlram_checkbox_5 .checkbox').removeClass('ckeckbox_on');
	}
}


function settingPush6()
{
	if(pushAlram_checkbox_list[6] == 0) {
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_EMG", 1);
		$('#pushAlram_checkbox_6 .checkbox').removeClass('ckeckbox_off');
		$('#pushAlram_checkbox_6 .checkbox').addClass('ckeckbox_on');
	}else{
		writeSettingInfo_PushAndLock("USE_PUSH_ALARM_EMG", 0);
		$('#pushAlram_checkbox_6 .checkbox').addClass('ckeckbox_off');
		$('#pushAlram_checkbox_6 .checkbox').removeClass('ckeckbox_on');
	}
}
