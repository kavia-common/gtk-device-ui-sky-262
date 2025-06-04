page_tag='basic_setting-wlan-wifi_wps'
$(document).ready(function(){
	$.lang_load("basic_setting_wlan_wifi_wps");
	page_initial()
});

	function page_initial(){
			//Coding initial function here
			get_obj_data(OBJ_LIST)
	}

function valid_wps_pin(pin) {
	if (pin.length == 4) {
		var rule4 = /^[\d]{4,4}$/
		return (rule4.test(pin));
	}

	var rule1 = /^(?=.{9,9}$)\d{1,8}(-|\s){1,1}\d{1,9}$/;
	var rule2 = /^[\d]{8,8}$/;

	if( rule1.test(pin) || rule2.test(pin) ){
		if(pin.length == 9) {
			pin=pin.replace("-","");
			pin=pin.replace(" ","");
		}

		var accum = 0;

		accum += 3 * (parseInt((pin / 10000000) % 10));
		accum += 1 * (parseInt((pin / 1000000) % 10));
		accum += 3 * (parseInt((pin / 100000) % 10));
		accum += 1 * (parseInt((pin / 10000) % 10));
		accum += 3 * (parseInt((pin / 1000) % 10));
		accum += 1 * (parseInt((pin / 100) % 10));
		accum += 3 * (parseInt((pin / 10) % 10));
		accum += 1 * (parseInt((pin / 1) % 10));

		return (0 == (accum % 10));
	}
	else
		return false;
}

function wps_string_handler(pin) {
	if(pin.length == 9) {
		var pin_data = pin.split(/-| /);
		pin = pin_data[0] + pin_data[1];

		return pin
	}
	else
		return pin
}

function start_wps(){
	WPS_CMD.WpsProcess.PinCode = "";
	WPS_CMD.WpsProcess.Mode = "PBC";
	set_info_data(WPS_CMD);
}

function start_pin(){
	var pin_code = $("#pin").val();
  $("#wps_ping_error").hide()
	if (!valid_wps_pin(pin_code)) {
	 $("#wps_ping_error").html(L.basic_setting_wlan_wifi_wps.lang_wps_pin_error_msg+": "+pin_code)
	 $("#wps_ping_error").show()
	 //warning_control('on','page',L.basic_setting_wlan_wifi_wps.lang_wps_pin_error_msg+": "+pin_code)
		//pop_alert_message(L.basic_setting_wlan_wifi_wps.lang_wps_pin_error_msg+": "+pin_code, "error", 3000);
		return;
	}

	WPS_CMD.WpsProcess.PinCode = wps_string_handler(pin_code);
	WPS_CMD.WpsProcess.Mode = "PIN";
	set_info_data(WPS_CMD);
}

function set_elem_state(st) {
	if (st == "1") {
		$("#btn_pbc").removeAttr("disabled");
		$("#btn_pbc").removeClass("is-disabled");
		$("#btn_pin").removeAttr("disabled");
					$("#btn_pin").removeClass("is-disabled");
					$("#pin").removeAttr("disabled");
		$("#pin").closest('div.el-input').removeClass("is-disabled");
	}
	else {
		$("#btn_pbc").attr("disabled", true);
		$("#btn_pbc").addClass("is-disabled");
		$("#btn_pin").attr("disabled", true);
		$("#btn_pin").addClass("is-disabled");
		$("#pin").attr("disabled", true);
		$("#pin").closest('div.el-input').addClass("is-disabled");
	}
}

function switch_toggle(obj,val) {
	if (val == "1") {
		$(obj).parent().attr('class','el-switch is-checked')
		MODIFIED_OBJ_DATA.Wps.WpsP.Enable='1';
	}
	else if(val == "0") {
		$(obj).parent().attr('class','el-switch')
		MODIFIED_OBJ_DATA.Wps.WpsP.Enable='0';
	}
	else {
		if ($(obj).parent().prop('class') == "el-switch is-checked") {
			$(obj).parent().attr('class','el-switch')
			MODIFIED_OBJ_DATA.Wps.WpsP.Enable='0';
		}
		else {
			if(MODIFIED_OBJ_DATA.Mesh.MeshP.Enable=='1'){
				alert(L.basic_setting_wlan_wifi_wps.lang_wps_mesh_msg);
				return;
			}
			$(obj).parent().attr('class','el-switch is-checked')
			MODIFIED_OBJ_DATA.Wps.WpsP.Enable='1';
		}
		val = MODIFIED_OBJ_DATA.Wps.WpsP.Enable;
	}
	set_elem_state(val);
}

function page_init(){
  var tab = document.getElementById('inn');
  var obj = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT

  if(MODIFIED_OBJ_DATA.Wps.WpsP.Enable=='1'){
	$("#btn_pbc").show();
	$("#btn_pin").show();
  }
  else {
	$("#btn_pbc").hide();
	$("#btn_pin").hide();
  } 

  switcher_handler('btn',MODIFIED_OBJ_DATA.Wps.WpsP.Enable)


  WPS_DATA = []
  var ssid_index = 0
  var slelected_ssid_index = ['0', '4', '8']
  obj.forEach(function(ssid_item) {
	 if (slelected_ssid_index.indexOf(ssid_index.toString()) > -1 ){
		ssid = {}
		ssid.Band=ssid_item.RadioBand
		ssid.Status=L.basic_setting_wlan_wifi_wps.lang_wps_configured_title
		ssid.SSID=ssid_item.Ssid
		ssid.AUTH=ssid_item.AuthType
		ssid.ENCRY=ssid_item.EncrypType
		WPS_DATA.push(ssid)
	 }
	 ssid_index++
	});

  update_table('wps_info_table', WPS_DATA, WPS_CONF_COLUMNS_LIST_VALUE)

  $("#wps_router_pin").val(MODIFIED_OBJ_DATA.Wps.WpsP.RouterPin)
  //var router_pin = document.getElementById('wps_router_pin');     
  //var obj1 = MODIFIED_OBJ_DATA.Wps.WpsP.RouterPin                                                             
  //router_pin.innerHTML='<div class="cell" style="margin-left:">'+obj1+'</div>';

}
function page_save(){
	/*
	if($("#btn").parent().prop('class') == "el-switch is-checked")
	MODIFIED_OBJ_DATA.Wps.WpsP.Enable='1';
	else
	MODIFIED_OBJ_DATA.Wps.WpsP.Enable='0';
	*/

	MODIFIED_OBJ_DATA.Wps.WpsP.Enable = $("#btn").val()

	if(MODIFIED_OBJ_DATA.Wps.WpsP.Enable=='1'){
		$("#btn_pbc").show();
		$("#btn_pin").show();
	  }
	  else {
		$("#btn_pbc").hide();
		$("#btn_pin").hide();
	} 

	delete MODIFIED_OBJ_DATA.Wlan;

	loading_control(1);
	set_obj_data(MODIFIED_OBJ_DATA)
}

/* --------- WPS run status start --------- */

function wps_success() {
//		$("#loading_message").html(L.basic_setting_wlan_wifi_wps.lang_wps_success_msg+"<br>"+L.basic_setting_wlan_wifi_wps.lang_wps_done_msg);
//		setTimeout(loading_control, 5000, 0);
	loading_control(0);
	pop_alert_message(L.basic_setting_wlan_wifi_wps.lang_wps_success_msg+"<br>"+L.basic_setting_wlan_wifi_wps.lang_wps_done_msg, "success", 5000);
}
function wps_failed() {
//		$("#loading_message").html(L.basic_setting_wlan_wifi_wps.lang_wps_failed_msg+"<br>"+L.basic_setting_wlan_wifi_wps.lang_wps_done_msg);
//		setTimeout(loading_control, 5000, 0);
	loading_control(0);
	pop_alert_message(L.basic_setting_wlan_wifi_wps.lang_wps_failed_msg+"<br>"+L.basic_setting_wlan_wifi_wps.lang_wps_done_msg, "error", 5000);
}

function get_wscresult(obj) {
	var wsc;
	var nsuccess = 0, nerror = 0, nactive = 0;

	if (typeof(obj) == "undefined" || typeof(obj.WscMonitor) == "undefined")
		return 'disabled';

	wsc = obj.WscMonitor;
	for (var k in wsc) {
		var st = wsc[k];

		if (st == "success") nsuccess = nsuccess+1;
		else if (st == "active") nactive = nactive+1;
		else if (st == "disabled") continue;
		else return nerror = nerror+1;
	}

	if (nsuccess > 0) return "success";
	else if (nactive > 0) return "active";
	else if (nerror > 0) return "error";

	return 'disabled';
}

var WPSTIME = 120;
	var bar_timer;
function refresh_wps_process_bar() {
	var wsc_ret = get_wscresult(INFO_DATA);

	if (wsc_ret == 'success') {
		clearInterval(bar_timer);
		wps_success();
	}
	else if (wsc_ret == 'active') {
		$("#loading_message").html(L.basic_setting_wlan_wifi_wps.lang_wps_msg1+"<br>"+L.basic_setting_wlan_wifi_wps.lang_wps_msg2+"<br>"+WPSTIME);
	}
	else {
		clearInterval(bar_timer);
		wps_failed();
	}
	}

/* --------- WPS run status end --------- */

function set_info_success_cb(obj) {
	if (typeof(obj) == 'undefined' || obj.WpsProcess == 'NOK')
		return;

	WPSTIME = 120;
	loading_control(1, L.basic_setting_wlan_wifi_wps.lang_wps_msg1+"<br>"+L.basic_setting_wlan_wifi_wps.lang_wps_msg2);

	bar_timer = setInterval(function(){
		WPSTIME = WPSTIME-1;

		if (WPSTIME <= 0) {
			clearInterval(bar_timer);
			wps_failed();
		}
		else
			get_info_data(INFO_LIST);
	}, 1000);
}
function set_info_error_cb(obj) {
	if (obj.api_return == 403)
		logout('sto')
}
function set_info_data(obj_content){
	if(typeof(obj_content) == 'string')
		API.info.set(JSON.parse(obj_content), set_info_success_cb, set_info_error_cb);
	else if(typeof(obj_content) == 'object')
		API.info.set(obj_content, set_info_success_cb, set_info_error_cb);
}
function get_info_success_cb(obj) {
			INFO_DATA = API.obj.copy(obj);
	refresh_wps_process_bar();
	}
	function get_info_error_cb(obj) {
	clearInterval(bar_timer);
	wps_failed();

			if(obj.api_return == 403)
					logout('sto')
	}
	function get_info_data(info_list){
			API.info.get(info_list, get_info_success_cb, get_info_error_cb);
	}

function set_obj_success_cb(obj) {
	setTimeout(function () {
		loading_control(0);
		pop_alert_message(L.common.success_title, L.common.save_success);
	},loading_time[2]);
	ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
}
function set_obj_error_cb(obj) {
	if(obj.api_return == 403){
		logout('sto')
		return;
	}else{
		pop_alert_message(L.common.lang_error_msg,'error')
	}
}
function set_obj_data(obj_content){
			if(typeof(obj_content) == 'string')
					API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
			else if(typeof(obj_content) == 'object')
					API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}

function get_obj_success_cb(obj) {
			ORIGINAL_OBJ_DATA = API.obj.copy(obj);
			MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
			page_init()
	}
function get_obj_error_cb(obj) {
	if(obj.api_return == 403)
		logout('sto')
}
function get_obj_data(obj_list){
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
}