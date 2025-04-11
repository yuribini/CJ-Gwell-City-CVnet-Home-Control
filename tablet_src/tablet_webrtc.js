/* 
2020.05.12 업데이트

$(document).on('click', '#btn_back', function(){
  console.log('WebRtc.step : ', WebRtc.step)
  if(WebRtc.step == false){
    parent.gotoHome();
  }else{
    WebRtc.backFn();
  }
}); */

var isPlatform = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Tizen: function () {
    return navigator.userAgent.match(/Tizen/i);
  },
  Simulator: function () {
    return navigator.userAgent.match(/Simulator/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/Windows/i);
  },
  X11: function () {
    return navigator.userAgent.match(/X11/i);
  },
  any: function () {
    return (isPlatform.Android() || isPlatform.iOS() || isPlatform.Tizen());
  }
  };
  
  var now_js_name = "tablet/tablet_webrtc.js";
  var strAgent;
  //var alarmPlugin, pluginCall;
  var speedTimer;
  var bPhoneGap = false;
  var bStopFlag=false;
  
  strAgent = navigator.userAgent.toLowerCase();
  
  if(localStorage.getItem("config_autologin") != 1){
    sessionStorage.clear();
  }
  
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
  }else{
  site_name = 'CV';
  }
  console.log('strAgent : ', strAgent)
  // if(strAgent.match('cordova') && strAgent.match('android'))
  // {
    
  //   try{
  //     if(cordova == undefined){
  //       console.log('---------------------------------------***************************cordova 확인 : ', cordova);
  //     }
  //   }catch(e){
  //     console.log('cordova 확인 e : ', e);
  //     bPhoneGap = true;
  //     var headTag = document.getElementsByTagName("head")[0];
  //     var newScript = document.createElement('script');
  //     newScript.type = 'text/javascript';
  //    /*  newScript.onload = function() {
        
  //     }; */
  //     newScript.addEventListener('error', function(e){
  //       console.log("loaded cordova javascript error : ", e);
  //     });
  //     newScript.addEventListener('load',function(){
  //       console.log("loaded cordova javascript succeed : " + now_js_name);
  //       loadNativeInterfacePlugin();
  //     });
  //     newScript.src = '/resources/cvnet/scripts/common/cordova.js?ver=2020061801';
  //     headTag.appendChild(newScript);
  //   }
    
    
  // }
  // console.log(now_js_name + "... is not phone gap...");
  // bPhoneGap = false;
  
  // function loadNativeInterfacePlugin()
  // {
  // var headTag = document.getElementsByTagName("head")[0];
  // var newScript = document.createElement('script');
  // newScript.type = 'text/javascript';
  // newScript.onload = function()
  // {
  //   console.log("loaded cordova loadNativeInterfacePlugin : " + now_js_name);
  //   document.addEventListener("deviceready", onDeviceReady, false);
  //   document.addEventListener("resume", onResume, false);
  //   document.addEventListener("pause", onPause, false);
  // };
  
  // newScript.src = '/resources/cvnet/scripts/common/plugin_native_interface.js?ver=2020022001';
  // headTag.appendChild(newScript);
  // return;
  // }
  
  function receiveMsgFromParent(e){
	   console.log('Recive From home :', e.data );
	   if (e.data=='close_call')
	   {
		   console.log("Process Hangup "+WebRtc.call_status+" "+WebRtc.step_val);
		   //WebRtc.call_status = 'incomingcalling'
		    try{
				if(isPlatform.Android() && strAgent.match('cordova')) cordova.exec(null, null, "AlarmPlugin", "alarm", [false]);;
			}catch(e){
        
			}
			if (WebRtc.step_val=='' || WebRtc.step_val=='calling' )
			{ 
		        if (WebRtc.call_status=='incomingcalling'){
					WebRtc.callEndFunc();
					bStopFlag=true;
				}else  window.parent.postMessage('close','*');
			}else{
				WebRtc.backFn();
				//WebRtc.callEndFunc();
				bStopFlag=true;
			}
			
		   
	   }
	  
  }
  
  function onDeviceReady(){
  //console.log("onDeviceReady()alarmPlugin : ", AlarmPlugin);
  //pluginCall = new CallPlugin();
  //alarmPlugin = new AlarmPlugin();
    documentInit();
  }

  $(function(){
    onDeviceReady();
  })
  
  
  function onPause(){
  console.log("-----------------onPause(): " + now_js_name);
  }
  
  function onResume(){
  console.log("-----------------onResume(): " + now_js_name);
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
  
  var WebRtc;
  var bTryAutoLogin = false;
  //var alarmPlugin, //pluginCall;
  
  function callAlarm(){
    if(WebRtc.step_val != 'monitoring' && isPlatform.Android()){
      setTimeout(function(){
        try{
          cordova.exec(null, null, "AlarmPlugin", "alarm", [true]);
          //cordova.exec(null, null, "AlarmPlugin", "alarm", [true]);
        }catch(e){
          
          if(e.toString().indexOf('cordova is not defined') != -1){
            if(strAgent.match('cordova') && strAgent.match('android')){
              bPhoneGap = true;
              var headTag = document.getElementsByTagName("head")[0];
              var newScript = document.createElement('script');
              newScript.type = 'text/javascript';
              newScript.onload = function() {
                console.log("loaded cordova javascript succeed : " + now_js_name);
                //loadNativeInterfacePlugin();
              };
              newScript.src = '/resources/cvnet/scripts/common/cordova.js?ver=2020061802';
              headTag.appendChild(newScript);
            }
          }
          console.log('callAlarm : ', e)
          /* setTimeout(function(){
            console.log('재귀콜 2')
            callAlarm();
          }, 100) */
          console.log('재귀콜 2')
            callAlarm();
        }
      }, 100)
    };

    
  }
  function stopAlarm()
  {
	  
	   try{
          if(isPlatform.Android() && strAgent.match('cordova')) cordova.exec(null, null, "AlarmPlugin", "alarm", [false]);
        }catch(e){
          
        }
  }



 function documentInit(){
    
    WebRtc = new Vue({
      el: '#web-rtc',
      watch : {
        input_dong : function(dong_val, pre_val){
            console.log('dong_val : ', dong_val)
            if(dong_val == undefined) return;
  
            if(!/^[0-9]{0,4}$/.test(dong_val)){
                this.input_dong = pre_val;
                return false;
            }
        },
        input_ho : function(ho_val, pre_val){
            if(ho_val == undefined) return;
            
            if(!/^[0-9]{0,4}$/.test(ho_val)){
                this.input_ho = pre_val;
                return false;
            }
        },
        mode : function(val, pre_val){
          console.log('mode : ', val)
          if(val != ''){
            this.removeClassMain();
            if(!this.auth_check) {
              this.getSIPInfo();
            }else{
              alert('등록되지 않은 단말기 또는 세대 입니다.');
            }
            
          }else{
   
            this.step_title = '통 화';
            this.lobby_flag = false;
            this.apartment_flag = false;
            this.call_flag = false;
          }
        }
      },
      data: {
        popup_msg : '',
        speed_val : '',
        step_title : '',
        sip_info : {},
        sip_dong_ho : '',
        sip_number : '',
        input_num : '',
        lobby_flag : false, // 문열림 버튼
        apartment_flag : false, // 세대 문열림
        calling : false,
        back_flag : false, // 뒤로가기 키 보이는거
        call_status : '',
        step : false,
        door_flag : false,
        lobby_dong : '',
        lobby_ho : '',
        step_val : '',
        push : localStorage.getItem('callpush'),
        input_dong : null,
        input_ho : null,
        mode : '',
        caller : '',
        reject : false,
        network_msg : false,
		network_msg_2 : false,
        destroying : false,
        auth_check : false,
        call_flag : false
      },
	   activated:function()
	  {
		  console.log('activated vue');
	  },
	  deactivated:function()
	  {
		  console.log('deactivated vue');
	  },
	  updated:function()
	  {
		  console.log('updated vue');
     	  if (bStopFlag){
			   console.log('rejected vue');
			   WebRtc.callRejectFunc();
			   bStopFlag=false;
	      }
	  },	
	  destroyed:function()
	  {
		  console.log('destroyed vue');
	  },
	  errorCaptured:function(err,component,details)
	  {
		    console.log('error '+err+' detail:'+details);
	  },
      mounted : function(){
          /*  
            1.push 일 경우에는 localStorage.getItem('callpush') == 'y'
            1.push 일 경우에는 caller != 0
  
            2.그냥 페이지 자동 접속일 경우에는 localStorage.getItem('callpush') != 0
  
          */
          /* if(model.caller == 0){
              this.getSIPInfo();
          } */

          try{
            console.log('notification_url : ', notification_url)
            console.log('localStorage callpush : ', localStorage.getItem('callpush'))
          }catch(e){

          }
          

          webrtcPhone.getSupportedDevices(function(data){
            console.log('getSupportedDevices data : ', data)
          });
          if(localStorage.getItem('callpush') == 'y'){
            this.step = true;
            this.getSIPInfo();
          }
  
          if(localStorage.getItem('callpush') == 'p'){
            localStorage.setItem('callpush', 'n');
            this.step_title = '통 화'
          }
  
          if(localStorage.getItem('callpush') == 'n'){
            this.step_title = '통 화'
          }
  
          $('body').addClass(parent.site_name);
          $('body').show();
		    window.addEventListener( 'message', receiveMsgFromParent );
    
         /*  this.step = true;
          this.call_status = 'doorMonitoring';
          this.step_val = 'monitoring'; // monitoring calling */
         /*  this.step = true;
          this.step_val = 'calling';
          this.call_status = 'incomingcalling';
          this.lobby_flag = true; */
      },
      methods : {
          modeChange : function(mode, el){
            var el_name = '.' + el;
            $(el_name).addClass('active');
            this.mode = mode;
            this.call_flag = true;
            if(mode == 'doorMonitoring') this.call_flag = false;
            
          },
          init(){
            $('.btn-monitoring').removeClass('active')
            $('.btn-security').removeClass('active')
            $('.btn-Management').removeClass('active')
            $('.btn-dongho').removeClass('active');
            this.step = false;
            this.call_status = '';
            this.step_title = '통 화';
            this.mode = '';
            this.step_val = '';
            this.destroying = false;
            this.door_flag = false;
            this.lobby_flag = false;
          },
          logoutBack : function(){
            webrtcPhone.logout();
          },
          normalBack : function(msg){
            webrtcPhone.logout();
            if(msg) alert(msg);
          },
          backFn : function(){
            webrtcPhone.hangup();
          },
          openDoorBell : function(){
            var self  = this;
            webrtcPhone.openDoor(self.sip_info.userId);
            /*$('#alert-popup').show();
            setTimeout(function(){
              $('#alert-popup').hide();
            }, 2000)
            webrtcPhone.hangup();*/
          },
          openDoor : function(){ // 로비 문열기, 세대 문열기
            var self  = this;
            webrtcPhone.openDoor(self.sip_info.userId);
       /*     $('#alert-popup').show();
            setTimeout(function(){
              $('#alert-popup').hide();
            }, 2000) */
            //webrtcPhone.hangup();
            //alert('현관 도어락을 열었습니다.');
            
            /* var self = this;
            self.lobby_dong = localStorage.getItem('from').substring(0,4)
            self.lobby_ho = localStorage.getItem('from').substring(4,8)
            $.ajax({
              url: 'lobby_open.do',
              data : { lobby_dong : self.lobby_dong, lobby_ho : self.lobby_ho },
              type: "POST",
              dataType : "json",
              success: function (data) {
                webrtcPhone.answer();
                setTimeout(function(){
                  webrtcPhone.hangup();
                  self.lobby_flag = false;
                }, 500);
              },
              fail: function(){
                console.log(" fail called");
              }
            }) */
          },
	 	 getSIPReload:function(){
					var self  = this;
					$.ajax({
							  url: "../mobile/getSIPInfo.do?loginId="+userId,
							  type: "get",
							  dataType: "json",
							  async:false,
							  cache: false,
							  success: function(data){
								  console.log('getSIP : ', data)
								  localStorage.setItem('sipinfo',JSON.stringify(data));
								  self.sip_info = data;
								  
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
	       },
        getSIPInfo(){  // 단지서버에서  SIP 정보 얻어옴
             var self = this;
			 var jsonData= localStorage.getItem("sipinfo");
			 var data=JSON.parse(jsonData);       
			 if (data==null || data.sipIp=='' )
			 {
				 console.log('sip info null error');
				 alert("접속 정보가 맞지 않습니다. 로그아웃 후 다시 로그인 해주세요");
				 
			 }else{
				self.sip_info = data;	
				self.InitPhone();				
			 }
			 //console.log("sip Info :"+JSON.stringify(data)+" "+data.userId);
             
          
            
          },
          InitPhone(){
            var self = this;
			if (self.sip_info.userId.substr(-2)=='00'){
					//self.sip_info.userId=self.sip_info.userId.substr(0,self.sip_info.userId.length-2)+'01';
					alert("모바일로 사용할 수 없는 가입정보입니다. 탈퇴후 모바일로 재가입해주세요");
					return;
			}
			
            var login_info = {
              server : self.sip_info.sipIp,
              name: 'sip' + self.sip_info.userId,
              exten: '1001'+self.sip_info.userId,
              //audioId: 'remote-stream-audio',
              localVideoId: 'local-stream-video',
			  dispId:'overlaytext',
              remoteVideoId: 'remote-stream-video'
            };
			console.log("Init Phone "+self.sip_info.userId);
            this.sip_dong_ho = this.sip_info.userId.substring(0,8);
            this.sip_number = this.sip_info.userId.substring(9,10);
		    
			
            console.log('Webrtc 접속 시도 : ',  localStorage.getItem('callpush'));
			/*
            var url = "https://"+self.sip_info.sipIp+":25101"+ "/api/status?id="+ '1001' + this.sip_dong_ho;
            if(localStorage.getItem('callpush') == 'n'){
              $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    console.log('/api/status : 기존 월패드 체크 API 해당 동호에 관련된 전체 단말 상태 체크  : ', data);
                    if(data.state == 'avail'){
                      webrtcPhone.initAndLogin(login_info, self.call_flag);
                    }else{
                      self.init()
                      self.normalBack('모니터링 또는 통화중입니다.');
                    }
                },
                fail: function(){
                  self.mode = '';
                  localStorage.setItem('callpush', 'n');
                  self.init()
                  self.normalBack('통화서버 접속 원활하지 않습니다.');
                  console.log(" fail called");
                },
                error: function(){
                  self.mode = '';
                  localStorage.setItem('callpush', 'n');
                  self.init()
                  alert('통화서버 접속 원활하지 않습니다.');
                  webrtcPhone.initAndLogin(login_info, self.call_flag);
                  console.log(" error called");
                }
              })
            }else{
              
              webrtcPhone.initAndLogin(login_info, self.call_flag);
            }
			*/
		//	console.log("login info display "+login_info.dispId);
		try{
			webrtcPhone.initAndLogin(login_info, self.call_flag);
		}catch(ex){
			console.log('init error '+ex);
		}

            /*speedTimer = setInterval(function(){
              console.log('---------------- setInterval')
              if(webrtcPhone.getSipcall().getBitrate().indexOf('sec') != -1){
                self.speed_val = webrtcPhone.getSipcall().getBitrate()
              }
              console.log('---------------- setInterval speed_val : ', self.speed_val)
            }, 1000)
			*/
            
          },
          monitoringStart (){
            console.log('모니터링 요청')
            //[jacky]
            var self = this;
            var destWallpad='1001'+this.sip_dong_ho+"00";
            this.checkOnline(destWallpad, function(data){
              if (data.state == 'online'){
                console.log('self.sip_dong_ho : ', self.sip_dong_ho)
                self.network_msg = false;
				self.network_msg_2 = true;
				var videotag=document.getElementById('videoid');
				if (videotag!=null)
					videotag.className='video-container-monitoring';
				
                webrtcPhone.callmonitor('1001'+self.sip_dong_ho+'00');
               // self.sendCheck('1001'+self.sip_dong_ho+'00');
              }else if(data.state == 'busy'){
                self.normalBack('월패드가 통화 중이거나 모니터링 중 입니다.');
              }else{
                self.normalBack('월패드가 연결되어 있지 않습니다.');
              }
  
            })
          },
          virtualCall (){ //[jacky]
              var self = this;
              //userId 0101 0105 00
              var virtualNum = '1001'+self.sip_dong_ho+"1"+self.sip_number;
              var mobileNum='1001'+self.sip_dong_ho+"0"+self.sip_number;
              var url = "https://"+self.sip_info.sipIp+":25101"+ "/api/reqchan?virtualid="+virtualNum+"&mobileid="+mobileNum;
              //var send_url = "https://"+self.sip_info.sipIp+":25100/?/hangup%20"+ "1001"+self.sip_dong_ho+"1"+ self.sip_number;\
              console.log('virtualCall : ', url)
              $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    //json {'state':'online',callstatus:'called'};
                    // state online,offline,unknown
                    // call: 'calling'(내가 다른 세대나 로비로 걸고 있음),'called'(전화오고 있음),'idle'(대기중),'none'(알수없음)
                    console.log('virtualCall : ', JSON.stringify(data));
                    if (data.state!='online'){
                        $('.btn-monitoring').removeClass('active')
                        $('.btn-security').removeClass('active')
                        $('.btn-Management').removeClass('active')
                        $('.btn-dongho').removeClass('active');
                        WebRtc.step = false;
                        WebRtc.call_status = '';
                        WebRtc.step_title = '통 화';
                        WebRtc.mode = '';
                        WebRtc.step_val = '';
                        WebRtc.destroying = false;
                        WebRtc.door_flag = false;
                        WebRtc.lobby_flag = false;
                        self.normalBack('상대방이 통화 연결 상태가 아닙니다.');
                    }
                    if (data.callstatus!='called'){
                        $('.btn-monitoring').removeClass('active')
                        $('.btn-security').removeClass('active')
                        $('.btn-Management').removeClass('active');
                        $('.btn-dongho').removeClass('active');
                        WebRtc.step = false;
                        WebRtc.call_status = '';
                        WebRtc.step_title = '통 화';
                        WebRtc.mode = '';
                        WebRtc.step_val = '';
                        WebRtc.destroying = false;
                        WebRtc.door_flag = false;
                        WebRtc.lobby_flag = false;
                        var text = '';
                        if(data.callstatus == 'calling') text = '1'
                        if(data.callstatus == 'idle') text = '2'
                        if(data.callstatus == 'unknown') text = '3'
                        if(data.callstatus == 'down') text = '4'

                        self.normalBack('이미 통화가 종료되었거나 연결할 수 없습니다.(code : ' + text + ')');
                    }
                },
                fail: function(){
                  self.normalBack('통화서버 접속 원활하지 않습니다.');
                }
              })
          },
          callAnswer(){
			 this.network_msg = true;
		     this.network_msg_2=false;  
            if(this.call_status == 'incomingcalling'){
                webrtcPhone.answer();
            }else{
                alert('연결할 통화가 없습니다.')
            }
          },
          callSecId(){
            // 경비실 -> 관할 경비 webrtcPhone.call('0101070000', true);
            webrtcPhone.call(this.sip_info.secId +'00', true);
		    this.network_msg = true;
		    this.network_msg_2=false;
            //var self = this;
          //  setTimeout(function(){
             // self.callCheck('1001'+self.sip_info.secId +'00')
           // }, 5000)
          },
          callAdminId(){
            // 관리실 - > 관할 관리
            webrtcPhone.call(this.sip_info.adminId + '00', true);
			 this.network_msg = true;
			this.network_msg_2=false;
            //var self = this;
           // setTimeout(function(){
             // self.callCheck('1001'+self.sip_info.adminId +'00')
          //  }, 5000)
          },
          callApartment(){
            // 세대통화
            const self =this;
            let dong =_.padStart(this.input_dong, 4, '0');
            let ho = _.padStart(this.input_ho, 4, '0');
            console.log('dong : ', dong, ' / ho : ', ho)
            if(dong == '0000' || ho == '0000'){
              alert('동, 호를 정확히 입력하세요.');
            }/*else if(this.sip_dong_ho == (dong + ho)){
              alert('자택 월패드에는 연결할 수 없습니다.')
            }*/
			else{
              let call_num = dong + ho + '00';
              this.checkOnline('1001' + call_num, function(data){
                
                if (data.state == 'online'){
                  console.log('call_num : ', call_num)
                  self.door_flag = false;
                  self.step = true;
                  self.network_msg = true;
				  self.network_msg_2=false;
                  webrtcPhone.call(call_num, false);
                }else if(data.state == 'busy'){
                  alert('월패드가 통화 중이거나 모니터링 중 입니다.');
                }else{
                  alert('월패드가 연결되어 있지 않거나 발신 할 수 없는 세대 입니다.');
                }
              })
            }
          },
          sendCheck : function(call_num){
              var self = this;
              var url = "https://"+self.sip_info.sipIp+":25101"+ "/api/check?id="+call_num;
              //var send_url = "https://"+self.sip_info.sipIp+":25100/?/hangup%20"+ "1001"+self.sip_dong_ho+"1"+ self.sip_number;
              $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    console.log('전화 건 후 check data : ', data)
                    if (data.state =='online'){
                      return true;
                    }else if (data.state =='None'){
                      return true;
                    }else{
                      return false;
                    }
                },
                fail: function(){
                  self.normalBack('통화서버 접속 원활하지 않습니다.');
                }
              })
          },
          callCheck : function(call_num){
            
            var self = this;
            var url = "https://"+self.sip_info.sipIp+":25101"+ "/api/callstate?callid="+call_num;
            console.log('전화 걸기 체크 : ', call_num , ' / ', url)
              //var send_url = "https://"+self.sip_info.sipIp+":25100/?/hangup%20"+ "1001"+self.sip_dong_ho+"1"+ self.sip_number;
              $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    console.log('전화 건 후 check data : ', data)
                    if(data.state == 'busy' || data.state == 'preview'){
                      setTimeout(function(){
                        self.callCheck(call_num);
                      }, 5000)
                    }else{
                      self.normalBack('연결을 다시 시도해주세요.');
                    }
                    /* if (data.state =='Up' || data.state =='Down' || data.state =='Ringing' || data.state =='Calling'){
                        
                      }else if(data.state =='None'){
                        self.normalBack('수신 세대 또는 경비/관리실이 등록되지 않았습니다.');  
                      }else{
                      self.normalBack('연결을 다시 시도해주세요.');
                    } */
                    
                },
                fail: function(){
                  self.normalBack('통화서버 접속 원활하지 않습니다.');
                }
              })
          },
          callRejectFunc : function(){
            webrtcPhone.answer();
            this.reject = true;
          },
          callEndFunc : function(){
			  stopAlarm();
              if(this.destroying){
                alert('통화 종료 중입니다.')
              }
              webrtcPhone.hangup();
			  webrtcPhone.logout();
          },
          removeClassMain : function(){
            $('.btn-monitoring').removeClass('active')
            $('.btn-security').removeClass('active')
            $('.btn-Management').removeClass('active')
            $('.btn-dongho').removeClass('active')
          },
            // [jacky] wallpad online
         checkOnline : function(idnum, cb){
           console.log('checkOnline 시도 : ', idnum)
            var self = this;
            //userId 0101 0105 00
            var url = "https://"+self.sip_info.sipIp+":25101"+ "/api/check?id="+idnum;
            // json 구조 {'state':'online'}
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    // online, offline(등록되어 있어나 꺼져 있음), unknown(연결안됨)-->online 이며 등록및 연결 상태 ,register 안되어 있으면 unknown으로 됨
                    console.log('모니터링 체크 : ', data);
                    cb(data)
                },
                fail: function(){
                    console.log(" fail called");
                    cb(false)
                }
            })
            
        }
      }
    })
  
    $(document).on('registered', function (ev) {
        WebRtc.call_status = 'regist';
        console.log('Webrtc 등록 완료 이벤트 받음')
        console.log('현재 모드 확인 : ', WebRtc.mode);
        //$('#output-lbl').text('Registered / ' + localStorage.getItem('callpush'));
		var videotag=document.getElementById('videoid');
		if (WebRtc.mode!='doorMonitoring'){
			if (videotag!=null)
					videotag.className='video-container';
		}
        if(WebRtc.mode == 'doorMonitoring'){
            WebRtc.step = true;
            WebRtc.step_title = '현관 모니터링';
            WebRtc.step_val = 'monitoring';
            WebRtc.monitoringStart();
        }else if(WebRtc.mode == 'doorCall'){
            WebRtc.door_flag = true;
            WebRtc.step_title = '인터폰 통화';
            WebRtc.step_val = 'calling';
        }else if(WebRtc.mode == 'security'){
            WebRtc.step = true;
            WebRtc.step_title = '경비실 통화';
            WebRtc.step_val = 'calling';
            WebRtc.callSecId();
        }else if(WebRtc.mode == 'management'){
            WebRtc.step = true;
            WebRtc.step_title = '관리실 통화';
            WebRtc.step_val = 'calling';
            WebRtc.callAdminId();
        }else{
          let dong = localStorage.getItem('from').substring(0,4)
          let ho = localStorage.getItem('from').substring(4,8)
          if(localStorage.getItem('callpush') == 'y'){
            let caller = localStorage.getItem('caller');
            WebRtc.caller = caller;
            if(caller == '1'){
              WebRtc.step_title = '현관 통화';
			 //WebRtc.apartment_flag = true;
              if(navigator.userAgent.match(/SM-T58/i) && window.location.href.match(/tablet/i)){
                WebRtc.apartment_flag = true;
              }
              //https://cvnetrndsh01.uasis.com/cvnet/mobile/webrtc_call.view?from=03070303&to=03070303&caller=1&push=y
            }else if(caller == '2'){
              WebRtc.lobby_flag = true;
              WebRtc.step_title = '공동현관 통화';
              //https://cvnetrndsh01.uasis.com/cvnet/mobile/webrtc_call.view?from=01019006&to=03070303&caller=2&push=y
            }else if(caller == '5'){
              WebRtc.step_title = parseInt(dong) + '동 ' + parseInt(ho) + '호';
            }else if(caller == '6'){
              WebRtc.step_title = '경비실 통화';
            }else if(caller == '7'){
              WebRtc.step_title = '관리실 통화';
              //https://cvnetrndsh01.uasis.com/cvnet/mobile/webrtc_call.view?from=01000500&to=03070303&caller=7&push=y
            }else if(caller == '8'){
              WebRtc.step_title = parseInt(dong) + '동 ' + parseInt(ho) + '호';
            }else{
              
            }
            localStorage.setItem('callpush', 'n');
            WebRtc.virtualCall(); //[jacky] 리턴값 체크 필요
            WebRtc.step = true;
            WebRtc.step_val = 'calling';
          }
        }
        //
    });
    
    $(document).on('incomingcall', function (ev, from) {
        console.log('evt incomingcall')
        callAlarm()
        try{
         
          /* if(WebRtc.step_val != 'monitoring' && isPlatform.Android()){
            setTimeout(function(){
              alarmPlugin.alarm(true);
            }, 100)
            
          } */
        }catch(e){

        }
         
        setTimeout(function(){
          if(WebRtc.step_val != 'monitoring'){
            WebRtc.call_status = 'incomingcalling';
          }
        }, 1000)
    });
  
    $(document).on('callaccepted', function (ev) {
        WebRtc.call_status = 'conversation';
         stopAlarm();
        
        if(WebRtc.reject){
          webrtcPhone.hangup();
          WebRtc.reject = false;
        }
    });
  
    $(document).on('monitoring', function (ev) {
      console.log('모니터링 이벤트 받음 : ', ev)
      stopAlarm();
     
    });
  
    $(document).on('hangup', function (ev) {
      
        stopAlarm();
        webrtcPhone.logout();
    });
  
    $(document).on('notconnected', function (ev) {
      console.log('notconnected')
    });
  
    $(document).on('monitoringfailed', function (ev) {
        //alert('현관 도어벨이 동작중입니다.')
        //common_modal.alertModal('[알림]', '현관 도어벨이 동작중이거나 연결상태를 다시 확인하세요.', moment().format('YYYY-MM-DD HH:mm:ss'), false);
        // 로그아웃만 수행한다.
        setTimeout(function(){
            WebRtc.normalBack('현관 도어벨이 동작중이거나 연결상태를 다시 확인하세요.');
        }, 1500)
    });
  
    $(document).on('unregistered', function (ev) {
        //$('#output-lbl').text('Unregistered');
		console.log("unregistered");
		webrtcPhone.destroySession();
		
		if (bStopFlag ||   WebRtc.caller >0){
			console.log("stop Destroyed");
			window.parent.postMessage('destroy','*');
		}
        
    });
  
    $(document).on('calling', function (ev) {
        WebRtc.call_status = 'calling';
		if (bStopFlag){
			   WebRtc.callEndFunc();
		}
        //$('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
    });
  
    $(document).on('error', function (ev,msg) {
	  stopAlarm();
      WebRtc.backFn();
	  if (msg=='down') webrtcPhone.destroySession();
      alert('통화 서버 또는 월패드 연결이 실패했습니다.');
      //$('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
    });
	
  	$(document).on('errorevent', function (ev,errmsg) {
	  stopAlarm();
      WebRtc.backFn();
      alert('통화중 에러가 발생하였습니다. ');
      //$('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
    });
  
    $(document).on('auth_video', function (ev) {
      stopAlarm();
      
      
  
      if(isPlatform.Android() || isPlatform.iOS()){
        WebRtc.normalBack('어플리케이션의 카메라, 마이크 권한을 허용해주세요.\n(설정 > 어플리케이션 정보 > CVnet 스마트홈 > 권한 > 마이크 ON, 카메라 ON)');
      }else{
        WebRtc.normalBack('PC에서는 지원하지 않습니다.');
      }
     
      //$('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
    });
  
   $(document).on('call_reject', function (ev) {
	  stopAlarm();
	  WebRtc.backFn();
      //WebRtc.normalBack('수신자가 받을 수 없는 상태 입니다. \n수신자 상태를 확인하세요.');
      //$('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
    });
	
    $(document).on('call_fail', function (ev) {
		stopAlarm();
        WebRtc.normalBack('수신자가 받을 수 없는 상태 입니다. \n수신자 상태를 확인하세요.');
      //$('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
    });
  
    $(document).on('track_pause', function (ev, data) {
		
      if(data.type == 'ended'){
        WebRtc.destroying = true;
      }else{
        WebRtc.network_msg = true;
      }
    });
  
    $(document).on('track_again', function (ev) {
      WebRtc.network_msg = false;
    });
  
    $(document).on('session_destory', function(ev){
     stopAlarm();
   /*  if(isPlatform.Android() && strAgent.match('cordova')){
        parent.gotoHome();
     }*/
      
      WebRtc.door_flag = false;
      WebRtc.lobby_flag = false;
      $('.btn-monitoring').removeClass('active')
      $('.btn-security').removeClass('active')
      $('.btn-Management').removeClass('active')
      $('.btn-dongho').removeClass('active');
      WebRtc.step = false;
      WebRtc.call_status = '';
      WebRtc.step_title = '통 화';
      WebRtc.mode = '';
      WebRtc.step_val = '';
      WebRtc.destroying = false;
      WebRtc.door_flag = false;
      WebRtc.lobby_flag = false;
      
      
    })
  
    $(document).on('forbidden', function (ev) {
        //$('#output-lbl').text('Unregistered');
        WebRtc.auth_check = true;
        alert('event forbidden 등록되지 않은 단말기 또는 세대 입니다.');
    });
  
    $(document).on('registration_failed', function (ev, result) {
      WebRtc.normalBack('접속에 실패 했습니다.\n(' + result["code"] + " " + result["reason"] + ')');
      //$('#output-lbl').text('Calling ' + webrtcPhone.getCounterpartNum() + '...');
    });

    $(document).on('opendoor', function (ev,code) {
      console.log('opendoor 이벤트 수신');
       if (code=="OK"){
            $('#alert-popup').show();
			setTimeout(function(){
				$('#alert-popup').hide();
				//console.log("title "+WebRtc.step_title);
				if (WebRtc.step_title=='현관 통화')
				{
					WebRtc.callEndFunc();
				}
			}, 2000);
			 
       }else{
          alert("문열기가 실패하였습니다."+code);
	  
	   }

    });

    $('.alert-btn').click(function(){
      $('#alert-popup').hide();
    })
  
    $('#login-btn').click(function () {
      /*
        server-address : 미디어 게이트웨 주소 - SIP Web Server 주소
        name : 사용자 이름
        exten : 등록할 아이디(등록 주소 : 1001+동+호+일련번호)
        password : 등록 패스워드(기본 : pwd1234)
      */
       webrtcPhone.initAndLogin({
        server: $('#server-address').val(),
        name: $('#name').val(),
        exten: $('#exten').val(),
        password: $('#password').val(),
		dispId:'overlaytext',
       // audioId: 'remote-stream-audio',
        localVideoId: 'local-stream-video',
        remoteVideoId: 'remote-stream-video'
      });
    });
  };
  
  
  function getwebrtcPhone(){
    return webrtcPhone;
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
  
  function autoLoginCheck(){
    if(localStorage.getItem("config_autologin") == 0 ) return;

    if(localStorage.getItem("config_autologin_id") == null ) return;
    if(localStorage.getItem("config_autologin_pw") == null ) return;
	
	  var token_val = tokenId;

	$.ajax({
		url: "login.do",
		type: "post",
		data:{
			"id":localStorage.getItem("config_autologin_id"), 
			"password":localStorage.getItem("config_autologin_pw"), 
			"deviceId": 0, 
			"tokenId":0
		},
		dataType: "json",
		success: function(data){
			if(data.result == 0){
				alert("로그인 실패: " + data.message);
        $('#body').show();
			}else if(data.result == 1){
          if(strAgent.match('cordova_mobile') && strAgent.match('iphone')){
            setTimeout(function() {
                location.href="home.view";
            }, 100);
          }else{
            location.href="home.view";
				}
			}
				getSIP();
		},
		error:function(request,status,error)
		{
			//alert("login.do - code:"+request.status+"\n"+"error:"+error);
			alert("서버와 연결이 끊어졌습니다. [" + xhr.status + "]");
		}
	});
}
  
  /* numberClick : function(num){
  console.log('num : ',num)
  if(num == 'dong'){
      if(this.input_num.indexOf('동') == -1){
          this.input_num += '동'
      }
  }else if(num == 'ho'){
      if(this.input_num.indexOf('호') == -1){
          this.input_num += '호'
      }
  }else if(num == 'del'){
      this.input_num = this.input_num.substring(0, this.input_num.length-1)
  }else if(num == 'call'){
      if(this.input_num == ''){
          alert('동 / 호를 입력하세요')
          return false;
      }
      if(this.input_num.indexOf('동') == -1){
          alert('동을 선택하세요')
          return false;
  
      }
      if(this.input_num.indexOf('호') == -1){
          alert('호를 선택하세요')
          return false;
      }
      if(this.input_num.indexOf('동호') != -1){
          alert('동 또는 호를 입력하세요')
          return false;
      }
      var dong_num = this.input_num.substring(0, this.input_num.indexOf('동'))
      var ho_num = this.input_num.substring( this.input_num.indexOf('동')+1, this.input_num.length-1);
      var call_num = _.padStart(dong_num, 4, 0) + _.padStart(ho_num, 4, 0) + '00';
      console.log('call_num :', call_num);
      
      webrtcPhone.call(call_num, true);
  
  }else if(num == 're'){
      this.input_num = this.temp_call_num;
      if(this.input_num == ''){
          alert('동 / 호를 입력하세요')
          return false;
      }
      $('#video_call')[0].load()
      $('#video_call')[0].play()
      this.calling = true;
  }else{
      if(this.input_num.indexOf('호') == -1){
          this.input_num += num
      }
  }
  } */

  document.addEventListener("visibilitychange", function() {
    if(isPlatform.iOS() && document.visibilityState == 'hidden'){
        webrtcPhone.hangup();
        webrtcPhone.logout();
        console.log('webrtcPhone : ', webrtcPhone)
        console.log('document.visibilityState : ', document.visibilityState)
    }
});