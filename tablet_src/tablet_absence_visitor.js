var now_js_name = "tablet/tablet_visitor_list.js";
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
var listSelectNumLast;
var isFirstLoadList=true;
var Demo_DATA = [
    {
        title :'세대현관',
        date_time : "2017-10-19 09:00",
        file_name : "admin"
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

	var tempHeight = $(document).height() - 80;
	var subContent_width  = $('.sub_content_list_space').width();
	$('.visitor_image').height(tempHeight-110);
	$('.visitor_image').width(subContent_width-80);
	//setFontSizeCSS();

});

function firtLoadList(){
	listCnt=0;
	pageNo =1 ;
	pageNoSW = true;

	if(parent.isDemoMode){
		getDemoList();
	}else{
        getVisitorList();
	}

}

function LoadNextPage(){
	if(pageNoSW && notice_load_sw){
		getVisitorList();
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

function getVisitorList()
{

	$.ajax({
		url: "visitor_list.do",
		type: "post",
		data: {"pageNo":pageNo, "rows":14},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			console.log('visitor_list data: ', data)
			if(data.result == 0)
			{
				console.log("서버와의 접속이 끊겼습니다.");
				// 자동로그인 체크..
				autoLoginCheck("visitor_list.do");
			}
			else
			{
				if(data.result == 1)
				{
					var output="";
					//console.log("data :",data);
					for (var i = 0; i < data.contents.length; i++)
					{
						var contents = data.contents[i];
						if(i == 0 && isFirstLoadList == true){
							getVisitorPhoto(contents.file_name,listCnt);
							output += '		<li class="list list_down" id="listNo_'+listCnt+'" onclick="getVisitorPhoto(' + '\'' + contents.file_name +'\','+listCnt+')">';
							isFirstLoadList=false;
						}else{
							output += '		<li class="list" id="listNo_'+listCnt+'" onclick="getVisitorPhoto(' + '\'' + contents.file_name +'\','+listCnt+')">';
						}
						output += '			<div class="main_list_title fontsize_main_list_title">'+translation(contents.title)+'</div>';
						if(isToDay(contents.date_time)) {
							output += '			<div class="main_list_sub fontsize_main_list_sub">오늘 ' + contents.date_time.substring(11, 17) + '</div>';
						}else{
							output += '			<div class="main_list_sub fontsize_main_list_sub">'+contents.date_time+'</div>';
						}
						output += '		</li>';
						listCnt++;
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
			console.log("/tablet/visitor_list.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("visitor_list.do");
			}
		},
		beforeSend: function(xhr){
			xhr.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
		}
	});
}
var currentImageFileName;

function getVisitorPhoto(fileName,listSelectNum)
{

	if(listSelectNumLast == listSelectNum){
		return;
	}

	$('#listNo_'+listSelectNum).addClass('list_down');
	$('#listNo_'+listSelectNumLast).addClass('list');
	$('#listNo_'+listSelectNumLast).removeClass('list_down');
	listSelectNumLast = listSelectNum;

	currentImageFileName = fileName;

	$.ajax({
		url: "visitor_content.do",
		type: "post",
		data: {"file_name":fileName},
		dataType: "json",
		cache: false,
		success: function(data)
		{
			if(data.result == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("visitor_content.do");
			}
			else if(data.result == 1)
			{
				var output = "data:image/jpg;base64,"+ data.image;

				//output += '<video controls> <source src="/resources/dash/movie/mov.mp4" type="video/mp4" /> </video>';
				//dep2_output += '<video controls> <source src="/resources/dash/movie/test.mp4" type="video/mp4"/> </video>';

				$( '.visitor_image' ).attr( {src:output});

			}
		},
		error:function(xhr,status,error)
		{
			console.log("/tablet/visitor_content.do - code:"+xhr.status+"\n"+"error:"+error);
			if(xhr.status == 401 || xhr.status == 0)
			{
				console.log("Login Session Expired.... try AutoLogin...");
				// 자동로그인 체크..
				autoLoginCheck("visitor_content.do");
			}
		},
		beforeSend: function(xmlHttpRequest)
		{
			xmlHttpRequest.setRequestHeader("AJAX", "true");  // ajax 호출을 header 에 기록
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
				if(data.servlet_name == "visitor_list.do")
				{
					getVisitorList();

				}
				else if(data.servlet_name == "visitor_content.do")
				{
					getVisitorPhoto(currentImageFileName,listSelectNumLast);
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

function getDemoList()
{

	var output="";
	var listCnt = 0;
	//console.log("data :",data);
	for (var i = 0; i < Demo_DATA.length; i++)
	{
		var contents = Demo_DATA[i];
		if(i == 0 && isFirstLoadList == true){
			output += '		<li class="list list_down" id="listNo_'+listCnt+'" onclick="getDemoPhoto(' + '\'' + contents.file_name +'\','+listCnt+')">';
			isFirstLoadList=false;
		}else{
			output += '		<li class="list" id="listNo_'+listCnt+'" onclick="getDemoPhoto(' + '\'' + contents.file_name +'\','+listCnt+')">';
		}
		output += '			<div class="main_list_title fontsize_main_list_title">'+translation(contents.title)+'</div>';
		if(isToDay(contents.date_time)) {
			output += '			<div class="main_list_sub fontsize_main_list_sub">오늘 ' + contents.date_time.substring(11, 17) + '</div>';
		}else{
			output += '			<div class="main_list_sub fontsize_main_list_sub">'+contents.date_time+'</div>';
		}
		output += '		</li>';
        listCnt++;
	}
    $( '.visitor_image' ).attr( {src:'/resources/cvnet/images/tablet/tablet_demo_visitor.jpg' });
    $('#content > ul').append(output);

    $('.visitor_image').height(540);
    $('.visitor_image').width(752);


}



function getDemoPhoto(fileName,listSelectNum)
{



    $('#listNo_'+listSelectNum).addClass('list_down');
    $('#listNo_'+listSelectNumLast).addClass('list');
    $('#listNo_'+listSelectNumLast).removeClass('list_down');
    listSelectNumLast = listSelectNum;
    currentImageFileName = fileName;


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

function translation(_val){


	if(_val == '세대현관' && parent.site_lang == 'en'){
		return 'Front Door';
	}

	if(_val == '공동현관' && parent.site_lang == 'en'){
		return 'Lobby';
	}

	if(_val == '세대현관' && parent.site_lang == 'ch'){
		return '大门摄像机';
	}

	if(_val == '공동현관' && parent.site_lang == 'ch'){
		return '公共大门设备';
	}

	return _val;

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