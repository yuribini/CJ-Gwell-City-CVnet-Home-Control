
/************************************************************************
 *                             AJAX
 ************************************************************************/


/************[잠금해제 설정값 가져오기]*************/
function getSettingInfo_LockScreen()
{
	$.ajax({
		url: "list_lockscreen_info.do",
		type: "post",
		dataType: "json",
		cache: false,
		async:false,			//동기
		success: function(data)
		{
			if(data.result == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("list_lockscreen_info.do");
			}
			else if(data.result == 1)
			{
				console.log('getSettingInfo_LockScreen data:',data);

				useLockNo = data.use;
				//$(".locknumber_use_value").html(useLockNo==1 ? "사용" : "미사용");		//잠금해제번호 사용   0 or 1
				inputLockNo = data.use_pwd;
				
				if(inputLockNo == 1){
					lockscreen_pwd = data.pwd;
				}
				
				console.log('잠금해제번호사용유무:',data);
				if(data.use == 1){
					$('#lockNum_title').html('잠금해제번호 사용함');
				}else{
					$('#lockNum_title').html('잠금해제번호 사용하지 않음');
				}

				//잠금해제번호 사용여부
				lock_checkbox(0,data.use);
				//제어시 사용
				lock_checkbox(1,data.use_control);
				//방범변경시 사용
				lock_checkbox(2,data.use_guard);

				//$(".locknumber_login_value").html(data.USE_LOCK_NO_LOGIN);		//로그인시 사용     0 or 1
				useLockNoControl = data.use_control;

				//$(".locknumber_control_value").html(useLockNoControl==1 ? "설정":"미설정");		//제어범위적용  0 or 1

				useLockNoGuard = data.use_guard;
				//$(".locknumber_guard_value").html(useLockNoGuard==1?"설정":"미설정");		//밤범범위적용   0 or 1
			}
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/list_lockscreen_info.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("list_lockscreen_info.do");
			}
		},
		beforeSend: function(xhr)
		{
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}

//잠금해제번호 설정
function writeLockScreenInfo(value)
{
	$.ajax({
		url: "setting_lockscreen.do",
		type: "post",
		data: {"use":useLockNo, "pwd":value, "useControl":useLockNoControl, "useGuard":useLockNoGuard},
		dataType: "json",
		cache: false,
		async:false,
		success: function(data)
		{
			if(data.result == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_write_lockscreen.do");	// 다시 설정 불러온다.
			}
			else if(data.result == 1)
			{
				console.log("write_setting_result: " + data.result);

				if(data.use == 0)
				{
					lockscreen_pwd = null;
					$('#lockNum_title').html('잠금해제번호 사용하지 않음');
					$('.btn_popup_lock_change_disable').show();
					$('.btn_popup_lock_change').hide();
					
				}else if(data.use == 1){
					lockscreen_pwd = value;
					$('#lockNum_title').html('잠금해제번호 사용함');
					$('.btn_popup_lock_change_disable').hide();
					$('.btn_popup_lock_change').show();
				}

				console.log('data:',data);

				inputLockNo = data.use ;
				console.log('inputLockNo:',inputLockNo);
				useLockNo = data.use;
				useLockNoControl = data.useControl;
				useLockNoGuard = data.useGuard;

			}
			else if(data.result == -1)
			{
				console.log("write_setting....time out....");
			}
		},
		error: function(xhr,status,error)
		{
			console.log("/tablet/setting_write.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");

				// 자동로그인 체크..
				autoLoginCheck("setting_write_lockscreen.do");	// 다시 정보를 얻는다....
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

function lock_checkbox(cnt, bool){
	if(cnt == 0){
		if(cnt == 0 && bool == 0) {
			lock_checkbox_list[0]= 0;
			$('#checkbox_lock').lcs_off();

			for(var i = 1; i <= 2; i++){
				lock_checkbox_list[i]=0;
				$('#lock_checkbox_'+i+' .checkbox').addClass('ckeckbox_off');
				$('#lock_checkbox_'+i+' .checkbox').removeClass('ckeckbox_on');
			}

			$('#checkbox_alram').lcs_off();

			//writeSettingInfo_PushAndLock("USE_LOCK_NO_CONTROL", 0);
			//writeSettingInfo_PushAndLock("USE_LOCK_NO_SECURITY", 0);

			useLockNo = 0;
			writeLockScreenInfo(lockscreen_pwd);

			$('#lockNum_title').html('잠금해제번호 사용하지 않음');
			$('.btn_popup_lock_change_disable').show();
			$('.btn_popup_lock_change').hide();

		}else if(cnt == 0 && bool == 1) {
			lock_checkbox_list[0]= 1;
			$('#checkbox_lock').lcs_on();
			$('#lockNum_title').html('잠금해제번호 사용함');
			$('.btn_popup_lock_change_disable').hide();
			$('.btn_popup_lock_change').show();


		}
		useLockNo=bool;
	}

	if(bool == 0){
		lock_checkbox_list[cnt]= 0;
		$('#lock_checkbox_'+cnt+' .checkbox').addClass('ckeckbox_off');
		$('#lock_checkbox_'+cnt+' .checkbox').removeClass('ckeckbox_on');
		return;
	}else{
		lock_checkbox_list[cnt] = 1;
		$('#lock_checkbox_'+cnt+' .checkbox').removeClass('ckeckbox_off');
		$('#lock_checkbox_'+cnt+' .checkbox').addClass('ckeckbox_on');
	}

	if(cnt == 1){
		useLockNoControl=bool;
	}else if(cnt == 2){
		useLockNoGuard=bool;
	}
}

/*
function settingLock1()
{
	if(lock_checkbox_list[1] == 0) {
		$('#lock_checkbox_1 .checkbox').removeClass('ckeckbox_off');
		$('#lock_checkbox_1 .checkbox').addClass('ckeckbox_on');

	}else{
		$('#lock_checkbox_1 .checkbox').addClass('ckeckbox_off');
		$('#lock_checkbox_1 .checkbox').removeClass('ckeckbox_on');

	}
}*/

function settingLock2()
{
	if(inputLockNo == 1){
		if(useLockNoGuard == 0) {
			useLockNoGuard = 1;
			$('#lock_checkbox_2 .checkbox').removeClass('ckeckbox_off');
			$('#lock_checkbox_2 .checkbox').addClass('ckeckbox_on');
		}else{
			useLockNoGuard = 0;
			$('#lock_checkbox_2 .checkbox').addClass('ckeckbox_off');
			$('#lock_checkbox_2 .checkbox').removeClass('ckeckbox_on');
		}
		writeLockScreenInfo(lockscreen_pwd);
	}
}
