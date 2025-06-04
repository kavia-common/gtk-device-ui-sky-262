/////////////  COMMON ////////////
function logout(act, target_url){
	var query = ""
	if("sto" == act)
		query = "a=sto"
	
	if( 'undefined' != typeof(target_url) && target_url != "")
		window.location.href = target_url+"pre_out.html?" + query;
	else
		window.location.href = "/pre_out.html?" + query;
}

function loading_wait_300s(){
	var process_percentage = 0
	var bar_timer

	loading_control(1)
	$("#loading_message").html(L.common.lang_plz_wait+"<br/>0%")

	bar_timer = setInterval(function(){
		process_percentage = process_percentage + 1
		$("#loading_message").html(L.common.lang_plz_wait+"<br/>"+process_percentage+"%")
		if( 100 == process_percentage ){
			clearInterval(bar_timer)
			loading_control(0);
		}
	},3000);
}


function loading_wait_control(wait_time, cb) {
	var process_percentage = 0
	var bar_timer
	var interval_time = 0

	loading_control(1)
	$("#loading_message").html(L.common.lang_plz_wait+"<br/>0%")
	
	setTimeout(function () {
		loading_control(0);
		$("#loading_message").html(L.common.lang_plz_wait)
		eval(cb)
	},wait_time * 1000);

	interval_time = (wait_time/100) * 1000
	
	bar_timer = setInterval(function(){
		process_percentage = process_percentage + 1
		$("#loading_message").html(L.common.lang_plz_wait+"<br/>"+process_percentage+"%")
		if( 100 == process_percentage ){
			clearInterval(bar_timer)
            $("#loading_message").html(L.common.lang_plz_wait)
		}
	},interval_time);
	
}

// Dynamic wireless restarting check function 
var WIRELESS_RESTARTING_FLAG = false 
var RESTART_CHECK_TIMER
var WIRELESS_PROCESS_PERCENTAGE_TIME=0

function get_status_success_cb(obj){
	clearTimeout(RESTART_CHECK_TIMER)
	if ( "undefined" != typeof(obj.WlanServiceAction.Status) ){
		if ( "Restarting" == obj.WlanServiceAction.Status ){
			setTimeout(function(){
				RESTART_CHECK_TIMER=check_wireless_restart_status()
			}, 2000 );
		}else if( "idle" == obj.WlanServiceAction.Status ){
			WIRELESS_RESTARTING_FLAG=false
			WIRELESS_PROCESS_PERCENTAGE_TIME=100
			$("#loading_message").html(L.common.lang_plz_wait+"<br/>"+WIRELESS_PROCESS_PERCENTAGE_TIME+"%")
			setTimeout(function(){
				loading_control(0);
				$("#loading_message").html(L.common.lang_plz_wait)
			}, 1000 );
		}else{
			WIRELESS_RESTARTING_FLAG=false
			loading_control(0);
			$("#loading_message").html(L.common.lang_plz_wait)
		}
	}
}

function get_status_error_cb(obj){
	if (obj.api_return == 403) {
		logout('sto');
		return;
	}else{
		clearTimeout(RESTART_CHECK_TIMER)
		setTimeout(function(){
			RESTART_CHECK_TIMER=check_wireless_restart_status()
		}, 2000 );
	}
}

function check_wireless_restart_status(){
	WIRELESS_PROCESS_PERCENTAGE_TIME = WIRELESS_PROCESS_PERCENTAGE_TIME + 2
	if (WIRELESS_PROCESS_PERCENTAGE_TIME > 98)
		WIRELESS_PROCESS_PERCENTAGE_TIME=99
	$("#loading_message").html(L.common.lang_plz_wait+"<br/>"+WIRELESS_PROCESS_PERCENTAGE_TIME+"%")
	API.info.get(['WlanServiceAction'], get_status_success_cb, get_status_error_cb, 5000);
}

function loading_wait_wireless_restart(){
	WIRELESS_RESTARTING_FLAG=true
	WIRELESS_PROCESS_PERCENTAGE_TIME=0
	if (WIRELESS_RESTARTING_FLAG){
		$("#loading_message").html(L.common.lang_plz_wait+"<br/>"+WIRELESS_PROCESS_PERCENTAGE_TIME+"%")
		loading_control(1)
		setTimeout(function(){
			RESTART_CHECK_TIMER=check_wireless_restart_status()
		}, 2000 );
	}
}

function string_display_handler(string){
	string = string.replace(/</g, "&lt;")
	string = string.replace(/>/g, "&gt;")
	return string
}

function check_local_user(loginip, ip4, mask4) {
	var i, ip_tmp;
	if (typeof(loginip) == "undefined" || typeof(ip4) == "undefined" || typeof(mask4) == "undefined")
		return false;

	if (loginip.indexOf(":") == -1) {
		ip_tmp = loginip.split(".");
		ip4 = ip4.split(".");
		mask4 = mask4.split(".");

		for (i = 0; i < 4; ++i) {
			if (eval(ip4[i] & mask4[i]) != eval(ip_tmp[i] & mask4[i]))
				return false;
		}
	}
	return true;
}

var CONTROL_TIMER = null

function reboot_back_checker(target_url, dialog){
	var check_url = ""

	if( 'undefined' != typeof(target_url) && target_url != "")
		check_url = target_url
	//if( 'undefined' != typeof(dialog) && dialog != "")
	//	open_dialog(dialog);

	clearTimeout(CONTROL_TIMER)
	CONTROL_TIMER = setInterval(function(){
		$.ajax({ cache: false,
			url: check_url+"echo.html",
			timeout: 3000,
			success: function (data) {
				clearInterval(CONTROL_TIMER)
				logout('sto', check_url)
			},
			error: function (data){}
		});
	},5000)
}

function queryString ()
{
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++)
	{
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined")
		{
			query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string")
		{
			var arr = [query_string[pair[0]], pair[1]];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else
		{
			query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
}

function get_browser_lang() {
	var bws_lang = "";
	var browser_lang = (navigator.language || navigator.browserLanguage).toLowerCase();

	if(browser_lang == 'th' || browser_lang == 'th-th')
		bws_lang = 'th'
	/*else if(browser_lang == 'zh-tw' || browser_lang == 'zh' || browser_lang == 'zh-hk')
		bws_lang = 'tw'
	else if(browser_lang == 'zh-cn')
		bws_lang = 'cn'
	else if(browser_lang == 'ko' || browser_lang == 'ko-kr')
		bws_lang = 'kr'
	else if(browser_lang == 'ja' || browser_lang == 'ja-jp')
		bws_lang = 'jp'
	else if(browser_lang == 'vi' || browser_lang == 'vi-vn')
		bws_lang = 'vn'
	else if(browser_lang == 'fr-ca')
		bws_lang = 'ca'*/
	else
		bws_lang = 'en'

	return bws_lang;
}

function get_browser_timezone() {
	var d = new Date();
	var offset = (d.getTimezoneOffset() / 60) * -1;
	return offset;
}

function get_target_page(){
	var data=[]
	var target_string = ""
	if( 'undefined' != typeof(queryString().p)){
		data=queryString().p.split('/');
	}
	
	$.each(data, function(layer_index, layer_target) {
		if("" == target_string)
			target_string=layer_target
		else
			target_string=target_string+"/"+layer_target
	});
	return target_string
}

function get_target_tab(){
	var target_string = ""
	if( 'undefined' != typeof(queryString().t)){
		target_string=queryString().t
	}
	return target_string
}

/////////////  RESTFULL HANDLER START ////////////
function handleEvent(e){
	console.log(e)
}

function addListeners(xhr_val) {
	xhr_val.addEventListener("loadstart", handleEvent);
	xhr_val.addEventListener("load", handleEvent);
	xhr_val.addEventListener("loadend", handleEvent);
	xhr_val.addEventListener("progress", handleEvent);
	xhr_val.addEventListener("error", handleEvent);
	xhr_val.addEventListener("abort", handleEvent);
}

function REST_API_GET(url, params, cb) {
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		addListeners(xhr)
		xhr.open('GET', url + "?" + params);
		xhr.onreadystatechange = cb
		xhr.send();
		return xhr;
}

function REST_API_POST(url, data, cb) {
	function onSend(){
		//console.log('cb.send not defined!')
	};
	function onComplete(){
		//console.log('cb.complete not defined!')
	};
	function onError(){
		console.log('cb.error not defined!')
	};
	function onSuccess(){
		console.log('cb.success not defined!')
	};

	if('object' == typeof(cb)){
		if ( 'function' == typeof(cb.success))
			onSuccess=cb.success
		if ( 'function' == typeof(cb.error))
			onError=cb.error
		if ( 'function' == typeof(cb.complete))
			onComplete=cb.complete
	}else{
		return false
	}
	
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		dataType : "text",
		cache: false,
		beforeSend: onSend,
		success: onSuccess,
		complete: onComplete,
		error: onError
	});
	
	return true
}