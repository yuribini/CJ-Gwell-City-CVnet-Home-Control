function unInit(){
	setTimeout(function() {
		if(app.wsClient != null)
		{
			app.wsClient.close();
			wsClient=null;
			console.log('close web socket');
		}
	}, 200);
}
/*
   - 개발 해야할것
    1) 환기 on/off 제어 기능
    2) 세팅 기능 : 환기 욕실/주방 연동 기능, 강/중/약풍 기능
    3) 환기 전체 On/off 제어 기능
    4) back 버튼

*/
var app = new Vue({
    el: '#content',
    watch : {
        wind : function(wind_val, old_val){
            if (parseInt(wind_val) == 3) {
                $('#mode_wind0_on').show();
                $('#mode_wind1_on').hide();
                $('#mode_wind2_on').hide();
        
            } else if (parseInt(wind_val) == 2) {
                $('#mode_wind0_on').hide();
                $('#mode_wind1_on').show();
                $('#mode_wind2_on').hide();
        
            } else if (parseInt(wind_val) == 1) {
                $('#mode_wind0_on').hide();
                $('#mode_wind1_on').hide();
                $('#mode_wind2_on').show();
            }
        },
        kitchen_link : function(val, old_val){
          
        },
        bathroom_link : function(val, old_val){
           
        }
    },
    filters : {
        parseTitle : function(vent_title){
            //$.lang[parent.site_lang]['text_ventilator']
            return getTitleName(vent_title) || '-'
        }
    },
    data : function() {
        return {
            wind : '', // 강/중/약 풍
            kitchen_link : false,
            bathroom_link : false,
            wsClient : '',
            ws_info : '',
            vent_arr : [],
            vent_list : [], // 환기 리스트
        }
    },
    mounted : function() {
        console.log('vue mounted');
        setLanguage(parent.site_lang);
        $('body').addClass(parent.site_name);
        $('body').show();
        $('#content').show();
        checkBoxInit();
        this.btnAnimation();
        this.getVentilaterData();
    },
    methods : {
        btnAnimation : function(){
            var self = this;
            
            $(document).on('click', '#btn_back', function () {
                parent.gotoHome();
                unInit();
            });
            // 환기 설정
            $(document).on("touchend mousedown","#btn_popup_ok",function(){
                self.sendControl();
                $('.popup').hide();
                $('.modal').hide();
            });

            // 환기 설정
            $(document).on("touchend mousedown","#btn_popup_cancel",function(){
                $('.popup').hide();
                $('.modal').hide();
            });

            $('#btn_setting').bind('touchstart touchend mouseup mousedown', function() {
                self.setStatus();
                $(this).addClass('btnSubColor_active').delay(200).removeClass('btnSubColor_active');
                $('.popup').show();
                $('.modal').show();
            });


            $('#btn_allOn').bind('touchstart touchend  mouseup mousedown', function() {
                $(this).toggleClass('btnMainColor_active');
            });
            $('#btn_allOff').bind('touchstart touchend  mouseup mousedown', function() {
                $(this).toggleClass('btnGrayColor_active');
            });

           
        },
        getVentilaterData : function(){
            var self = this;
            $.ajax({
                url: "device_info.do",
                type: "post",
                data: {"type":"0x18"},		// 0x30: 환기(LCT),  0x18 :일반환기
                dataType: "json",
                cache: false,
                success: function(data) {
                    console.log('getVentilaterData data:',data);
                    data.dev = '48';
                    self.listInit(data);
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
        },
        listInit : function(vent_info){
            var self = this;
            console.log('vent_info : ', vent_info)
            var temp_vent_list = [];
            var sub_vent_list = [];
            self.vent_arr = [];
            _.forEach( vent_info.contents, function(vent, idx){
                self.vent_arr.push(vent);
                temp_vent_list.push(_.assignIn(vent, {open_close : 0}))
                if((idx+1) % 5 == 0 || vent_info.contents.length == (idx+1)){
                    sub_vent_list.push(temp_vent_list);
                    temp_vent_list = [];
                }
            })
            this.vent_list = sub_vent_list;
            console.log('vent_list : ', this.vent_list);
            setTimeout(function(){
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    slidesPerView: 1,
                    paginationClickable: true,
                    spaceBetween: 30
                });
            }, 200)
            this.websocketConn(vent_info);
        },
        websocketConn : function(socket_info){
            var self = this;
            this.ws_info = socket_info;
            //this.ws_info.dev = '48'
            var websock_address = socket_info.websock_address;
            console.log('websock_address : ', websock_address)
            this.wsClient = new vertx.EventBus(websock_address);
            this.wsClient.onopen = function() {
                console.log('connected to server');
                self.wsClient.login(socket_info.id, 'cvnet', function(reply) {		// reply : 로그인 결과 json
                    console.log('reply : ', reply);
                    if(reply.result && reply.id == socket_info.id){
                        self.wsClient.registerHandler(socket_info.dev, self.handler);
                        
                        self.wsClient.publish(socket_info.dev, JSON.stringify({
                            id : socket_info.id,
                            remote_addr : socket_info.tcp_remote_addr,
                            request : 'status'
                        }), null);
                    }
                });
            }
            this.wsClient.onclose = function() {
                console.log('close');
                self.wsClient = null;
            }
        },
        handler : function(msg, replyTo){
            console.log('message', msg);
            var result = JSON.parse(msg);
            var result_status = result.status;
            if(result_status == 0x01){ // 정상

            }else if(result_status == 0xFF){ // 통신단절

            }else if(result_status == 0xFE){ // 주소에러

            }
            /*
            {"dev":48,"data":{"bath_relation":"0","damper":[{"num":"1","open_close":"0"},{"num":"2","open_close":"0"},{"num":"3","open_close":"0"},{"num":"4","open_close":"0"},{"num":"5","open_close":"0"},{"num":"6","open_close":"0"}],"kitchen_using":"0","bath_using":"0","ho":"1201","kitchen_relation":"0","dong":"0102","type":"lctfan","wind_power":"0","damper_count":"6"},"users":{"lct1021201":"127.0.0.1^0102^1201^16d7a4fca7442dda3ad93c9a726597e4^0"}}
            */
            // 0 : OFF, 1 : ON
            this.kitchen_link = parseInt(result.data.kitchen_relation) == 1;
            this.bathroom_link = parseInt(result.data.bath_relation) == 1;
            this.wind = parseInt(result.data.wind_power);
            var temp_vent_list = [];
            var temp_obj = {};

            var self = this;
            console.log('result : ', result)
            var temp_vent_list = [];
            var sub_vent_list = [];
            console.log('self.vent_arr : ', self.vent_arr)
            _.forEach( result.data.damper, function(vent, idx){
                temp_vent_list.push(
                    _.assignIn(vent, {
                        open_close : vent.open_close,
                        title : _.find(self.vent_arr, { number : parseInt(vent.num)}).title
                    }))
                if((idx+1) % 5 == 0 || result.data.damper.length == (idx+1)){
                    sub_vent_list.push(temp_vent_list);
                    temp_vent_list = [];
                }
            })
            this.vent_list = sub_vent_list;
        },
        setStatus : function(){
            console.log('상태 업데이트')
        },
        sendControl : function(){
            var send_data = {
                kitchen_link : this.kitchen_link,
                bathroom_link : this.bathroom_link,
                wind : this.wind
            }
            var json = new Object();
            json.id = this.ws_info.id;
            json.remote_addr = this.ws_info.tcp_remote_addr;
            json.request= "control";
            json.control_type = "fan";
            json.kitchen_relation = this.kitchen_link ? '1' : '0'
            json.bath_relation = this.bathroom_link ? '1' : '0'
            json.wind_power = this.wind.toString();
            
            
            console.log('json : ', json, ' / ', this.ws_info.dev)
            this.wsClient.publish( this.ws_info.dev, JSON.stringify(json), null);

            console.log('send_data : ', send_data)
        },
        controlAllOpenClose : function(open_close){
            var json = new Object();
            json.id = this.ws_info.id;
            json.remote_addr = this.ws_info.tcp_remote_addr;
            json.request= "control";
            json.control_type = "damper";
            json.num = '0';
            json.open_close = open_close.toString();
            console.log('json : ', json, ' / ', this.ws_info.dev)
            this.wsClient.publish( this.ws_info.dev, JSON.stringify(json), null);
        },
        controlOpenClose : function(vent_info){
            var open_close = vent_info.open_close == 1 ? 0 : 1;
            var json = new Object();
            json.id = this.ws_info.id;
            json.remote_addr = this.ws_info.tcp_remote_addr;
            json.request = "control";
            json.control_type = "damper";
            json.num = vent_info.num.toString();
            json.open_close = open_close.toString();
            console.log('json : ', json, ' / ', this.ws_info.dev)
            this.wsClient.publish( this.ws_info.dev, JSON.stringify(json), null);
        },
        controlWindMode : function(wind_val){
            
            this.wind = wind_val;
            console.log('controlWindMode : ', this.wind)
            if (wind_val == 3) {
                $('#mode_wind0_on').show();
                $('#mode_wind1_on').hide();
                $('#mode_wind2_on').hide();
        
            } else if (wind_val == 2) {
                $('#mode_wind0_on').hide();
                $('#mode_wind1_on').show();
                $('#mode_wind2_on').hide();
        
            } else if (wind_val == 1) {
                $('#mode_wind0_on').hide();
                $('#mode_wind1_on').hide();
                $('#mode_wind2_on').show();
            } else {
                showMessage('센서 상태를 확인해주십시오.'); // title : 모드변경 실패
            }

        },
        autoLoginCheck : function(_servletName){
            if(bTryAutoLogin == true){
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
    }
})


function checkBoxInit(){
	$('#switch').lc_switch('ON','OFF');
	$('body').delegate('.lcs_check', 'lcs-statuschange', function() {
		switchopen_close_dimming = ($(this).is(':checked')) ? 0 : 1;
		//console.log('스위치:',switchopen_close_dimming);
	});

	$(".switch_space .lcs_switch").bind("touchend", function(){
		//console.log('잠금해제 스위치 클릭');
		if(!lightopen_close){
			return;
		}

		if(switchopen_close_dimming == 0){
			light_open_close[nowDimmingNum] = 0;
		}else if(switchopen_close_dimming == 1){
			light_open_close[nowDimmingNum] = 1;
		}

		//control_light(1,-1);
		control_dimming(nowDimmingNum,currentBrightnessRatio[nowDimmingNum]);
		setSwitchStyle_dimming(switchopen_close_dimming);
	});
}