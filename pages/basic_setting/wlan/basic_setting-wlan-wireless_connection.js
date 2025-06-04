page_tag='basic_setting-wlan-wireless_connection'
var SITE_SURVEY_RESULT_LIST = []

$(document).ready(function(){
        $.lang_load("basic_setting_wlan_wireless_connection");
		$.lang_load("basic_setting_wlan_wifi_wps");
		$.lang_load("basic_setting_wlan_wifi_basic2");
        page_initial()
});

function page_initial(){
    //Coding initial function here
    get_obj_data(OBJ_LIST)
}

function wirelessExtender_enable_handler(enabled){
	if( 'undefined' == typeof(enabled) ){
		enabled = $("#extender_enable").val()
	}
	var confirmed = confirm('System will auto reboot after change mode.');
	if (confirmed) {
		switcher_handler('extender_enable',enabled)
		change_Mode(enabled)
	}else{
		(enabled == "1") ? switcher_handler('extender_enable',"0") : switcher_handler('extender_enable',"1");
	}

	//action=[{"style":"default","text":"Cancel","action":"cancel_change()"},{"style":"primary","text":"Apply","action":"change_Mode(" + enabled + ")"}];
	//pop_dialog("wlan-changemode-confirm", action, "", "basic_setting-wlan-wireless_connection");
}

function getConnectionStatus(){
	API.info.get(Conn_INFO_LIST, get_info_success_cb_conn, get_info_error_cb_conn);
}

function cancel_change(){
	if(ORIGINAL_OBJ_DATA.OpMode.OpModeP.Mode != "ap") {
		$("#extender_enable").val("0");
		$(".wirelessExtender_enabled_show").hide();
	} else {
		$("#extender_enable").val("1");
		$(".wirelessExtender_enabled_show").show();
	}
	$('.el-dialog__header').css("display","block");
	close_dialog();
}

function change_Mode(enable) {
	if( 'undefined' == typeof(enable) ){
		enable = $("#wirelessExtender_enable").val()
	}
	MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);	
	if( "0" == enable){
		MODIFIED_OBJ_DATA.OpMode.OpModeP.Mode = "auto";
		MODIFIED_OBJ_DATA.OpMode.OpModeP.Requester = "gui";
	}else{
		MODIFIED_OBJ_DATA.OpMode.OpModeP.Mode = "ap";
		MODIFIED_OBJ_DATA.OpMode.OpModeP.Requester = "gui";
	}
	
	delete MODIFIED_OBJ_DATA.Wps;
	delete MODIFIED_OBJ_DATA.WlanDeviceRadio;
	delete MODIFIED_OBJ_DATA.Mesh;
	delete MODIFIED_OBJ_DATA.WlanExtender;
	set_obj_data(MODIFIED_OBJ_DATA);
	loading_control(1, '');
	
	var Timer = 240;
	close_dialog();
	var countdown = setInterval(function () {
		if(Timer >= 0){
			$("#loading_message").html("Wait system reboot <br>" + Timer);
			Timer = Timer - 1;
		}
	}, 1000);
	
	setTimeout(function () { 
		clearInterval(countdown);
		$("#loading_message").html("Redirecting...");
		if("0" == enable){
			window.location.href = "http://192.168.1.1";
		} else {
			window.location.href = "http://"+G_AP_MODE_IP;
		}
	}, 240000);
}

function site_survey_start() {
	loading_control(1, "");
	SITE_SURVEY_RESULT_LIST = []
    var band2_enable = ORIGINAL_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[0].Enabled;
    var band5_enable = ORIGINAL_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled;
    var band6_enable = ORIGINAL_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled;

    if (band2_enable == '0' || band5_enable == '0' || band6_enable == '0') {
        pop_alert_message(L.status_wifiNeighbor.lang_wifinb_band_disabled_error, "error");
        return;
    }

    set_info_data(SCAN_CMD);
}

function start_wps(){
	WPS_CMD.WpsProcess.PinCode = "";
	WPS_CMD.WpsProcess.Mode = "PBC";
	set_info_data(WPS_CMD);
}

function wps_success(suc = false) {
	loading_control(0);
	var msg = ""
	if(suc) 
		msg += L.basic_setting_wlan_wifi_wps.lang_wps_success_msg;
	else
		msg += L.basic_setting_wlan_wifi_wps.lang_wps_failed_msg;
	msg += ("<br>" + L.basic_setting_wlan_wifi_wps.lang_wps_done_msg)
	pop_alert_message(msg, "error", 5000);
}

function hide_site_more(){
	$(".site_more_zone").remove()
}


function show_site_more(id){
	hide_site_more()
	if( id > -1 ){
		site_more_html = '<tr>\
			<td class="no-padding-hr ng-scope site_more_zone" colspan="4" id="">\
				<div class="panel-grey" style="padding:15px">\
					<div class="panel-body">\
						<div class="wrapperdiv">\
								<input type="hidden" id="wireless_extend_ssid"  value="'+SITE_SURVEY_RESULT_LIST[id].Ssid+'">\
								<input type="hidden" id="wireless_extend_security" value="'+SITE_SURVEY_RESULT_LIST[id].Security+'">\
								<input type="hidden" id="wireless_extend_band"  value="'+SITE_SURVEY_RESULT_LIST[id].RadioBand+'">\
								<table class="table tableCount theme_intel gemtek-two-color-table"><tbody>\
									<tr class="gemtek-tr-bottom-line">\
										<td>Radio Band</td>\
										<td class="text-right gemtek-text-color"><span class="ng-binding" id="side_band_info">'+SITE_SURVEY_RESULT_LIST[id].RadioBand+'</span></td>\
									</tr>\
									<tr class="gemtek-tr-bottom-line">\
										<td>BSSID</td>\
										<td class="text-right gemtek-text-color"><span class="ng-binding" id="side_bssid_info">'+SITE_SURVEY_RESULT_LIST[id].Bssid+'</span> </td>\
									</tr>\
									<tr class="gemtek-tr-bottom-line">\
										<td>Wifi Mode</td>\
										<td class="text-right gemtek-text-color"><span class="ng-binding" id="side_wifimode_info">'+SITE_SURVEY_RESULT_LIST[id].WifiMode+'</span></td>\
									</tr>\
									<tr class="gemtek-tr-bottom-line">\
										<td>Security</td>\
										<td class="text-right gemtek-text-color"><span class="ng-binding" id="side_security_info">'+SITE_SURVEY_RESULT_LIST[id].Security+'</span></td>\
									</tr>\
								</tbody></table>'
								if ( SITE_SURVEY_RESULT_LIST[id].Security != "open" && SITE_SURVEY_RESULT_LIST[id].Security != "eopen" ){
									site_more_html = site_more_html + '<div class="row" style="padding-bottom:15px">\
										<div id="pwinput_wireless_extend_password" class="no-padding-hr pwdblock col-xs-6 col-sm-6"></div>\
									</div>'
								}
								site_more_html = site_more_html + '<div class="btn-form text-center">\
								<button class="gemtek-btn-normal gemtek-btn-mr" onclick="hide_site_more()">Cancel</button>\
								<button class="gemtek-btn-primary" onclick="connect_SSID()">Connect</button>\
							</div>\
						</div>\
					</div>\
				</div>\
			</td>\
		</tr>'
		$( "#scan_list_id_"+id ).after(site_more_html);
		draw_password('wireless_extend_password',L.basic_setting_wlan_wifi_basic2.lang_pwd,'Please Enter the value')
	}else if( id == -1 ){
		site_more_html = '<tr>\
			<td class="no-padding-hr ng-scope site_more_zone" colspan="4" id="">\
				<div class="panel-grey" style="padding:15px">\
					<div class="panel-body">\
						<div class="wrapperdiv">\
								<div id="input_wireless_extend_ssid" class="form-group no-padding-hr col-xs-12 col-sm-12"></div>\
								<div id="select_wireless_extend_security" class="form-group no-padding-hr col-xs-12 col-sm-5"></div>\
								<div class="row" style="padding-bottom:15px">\
										<div id="pwinput_wireless_extend_password" class="no-padding-hr pwdblock col-xs-6 col-sm-6"></div>\
									</div>\
								<div class="btn-form text-center">\
								<button class="gemtek-btn-normal gemtek-btn-mr" onclick="hide_site_more()">Cancel</button>\
								<button class="gemtek-btn-primary" onclick="connect_SSID()">Connect</button>\
							</div>\
						</div>\
					</div>\
				</div>\
			</td>\
		</tr>'
		$( "#scan_list_id_manually" ).after(site_more_html);
		draw_input('wireless_extend_ssid','lang_ssid','Please Enter the value')
        draw_select('wireless_extend_security', authtype_select_str, authtype_select_val,'select_authtype_select(\'common\')', '', 'lang_auth_title');   
		draw_password('wireless_extend_password',L.basic_setting_wlan_wifi_basic2.lang_pwd,'Please Enter the value')
	}
	$.lang_load("basic_setting_wlan_wireless_connection");
}

function set_survey_result(obj) {
	var id=0
	obj.forEach((row, index) => {
		if(row.Ssid == " ") {
			return;
		}
		row.TB_ACTION={"more":"show_site_more("+id+")"}
		SITE_SURVEY_RESULT_LIST.push(row)
		id++
	});
	
	//Use update_table() to update table content, $1 is table tbody ID, $2 is table data, $3 is which columns need to display
	update_table('scan_list', SITE_SURVEY_RESULT_LIST, SCAN_COLUMNS_LIST_VALUE)

	manually_option='<tr id="scan_list_id_manually" style="background-color: #3333;">\
    <td class="no-padding-hr " colspan="3" style="text-align:center;">Manually Setting</td>\
	<td class="no-padding-hr "><button class="btn btn-xs table-btn-txt" onclick="show_site_more(-1)">\
	<img src="img/icons/icon-1/gemtek-more.svg"></button></td></tr>'
	$("#scan_list_id_"+(id-1)).after(manually_option)	
}

function select_SSID(ssid, security) {
	action=[{"style":"default","text":"Cancel","action":"close_dialog()"},{"style":"primary","text":"Connect","action":"connect_SSID()"}];
	pop_dialog("wlan-ext-manual-conn", action, "connection_layout('" + ssid + "', '" + security + "')", "basic_setting-wlan-wireless_connection");
}

function connect_SSID(){
	MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
	MODIFIED_OBJ_DATA.WlanExtender.WlanExtenderP.Mode = "pure";
	MODIFIED_OBJ_DATA.WlanExtender.WlanExtenderP.Ssid = $("#wireless_extend_ssid").val();
	MODIFIED_OBJ_DATA.WlanExtender.WlanExtenderP.AuthType = $("#wireless_extend_security").val();
	MODIFIED_OBJ_DATA.WlanExtender.WlanExtenderP.EncrypType = "aes";
	MODIFIED_OBJ_DATA.WlanExtender.WlanExtenderP.Key = $("#wireless_extend_password").val();
	MODIFIED_OBJ_DATA.WlanExtender.WlanExtenderP.Band = $("#wireless_extend_band").val();
	
	
	delete MODIFIED_OBJ_DATA.OpMode; 
	delete MODIFIED_OBJ_DATA.Wps;
	delete MODIFIED_OBJ_DATA.WlanDeviceRadio;
	delete MODIFIED_OBJ_DATA.Mesh;
	
	//close_dialog();
	loading_control(1, ' ');
	set_obj_data(MODIFIED_OBJ_DATA);
	
}

function password_display_hide() {
	var x = document.getElementById("wireless_extend_password");
	if (x.type === "password") {
		$("#wireless_extend_password").html("Show Password");
		x.type = "text";
	} else {
		$("#wireless_extend_password").html("Hide Password");
		x.type = "password";
	}
}

function connection_layout(ssid, sec) {
	var security_str = sec.split(" ")[0].split('/');
	var security_val = security_str.map((s) => s.toLowerCase());
	$("#wireless_extend_ssid").val(ssid);
	draw_select('wireless_extend_security', security_str, security_val, '', '');
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

function set_info_data(obj_content){
    var cb_success, cb_error;
	if(obj_content.WifiNeighbor != undefined)
		cb_success = set_info_success_cb_scan;
	if(obj_content.WpsProcess != undefined)
		cb_success = set_info_success_cb_wps;
    cb_error   = set_info_error_cb;


    if(typeof(obj_content) == 'string')
        API.info.set(JSON.parse(obj_content), cb_success, cb_error);
    else if(typeof(obj_content) == 'object')
        API.info.set(obj_content, cb_success, cb_error);
}

	/* ------- set Info Functions ------- */
function set_info_success_cb_scan(obj) {
	API.info.get(INFO_LIST, get_info_success_cb_scan, get_info_error_cb_scan);
}

var	WPSTIME = 120;
var bar_timer
function set_info_success_cb_wps(obj) {
	if (typeof(obj) == 'undefined' || obj.WpsProcess == 'NOK')
		return;

	WPSTIME = 120;
	loading_control(1, L.basic_setting_wlan_wifi_wps.lang_wps_msg1 + "<br>" + L.basic_setting_wlan_wifi_wps.lang_wps_msg2);
	bar_timer = setInterval(function(){
		WPSTIME = WPSTIME - 1;

		if (WPSTIME <= 0) {
			clearInterval(bar_timer);
			wps_success(false);
		}
		else
			API.info.get(WPS_INFO_LIST, get_info_success_cb_wps, get_info_error_cb_wps);
	}, 1000);
}

function set_info_error_cb(obj) {
	loading_control(0);
	if (obj.api_return == 403) {
			logout('sto');
	}
}

function get_info_success_cb_conn(obj) {
	var data = API.obj.copy(obj);
	CONNECTION_DATA=[{"Band":"2.4G"},{"Band":"5G"},{"Band":"6G"}]

	CONNECTION_DATA.forEach(function(conn) {
		if(conn.Band=="2.4G"){
			conn.Status = data.WlanConnectionStatus.Results.data2g.status
			conn.SSID = data.WlanConnectionStatus.Results.data2g.ssid
			conn.AUTH = data.WlanConnectionStatus.Results.data2g.security
		}else if(conn.Band=="5G"){
			conn.Status = data.WlanConnectionStatus.Results.data5g.status
			conn.SSID = data.WlanConnectionStatus.Results.data5g.ssid
			conn.AUTH = data.WlanConnectionStatus.Results.data5g.security
		}else if(conn.Band=="6G"){
			conn.Status = data.WlanConnectionStatus.Results.data6g.status
			conn.SSID = data.WlanConnectionStatus.Results.data6g.ssid
			conn.AUTH = data.WlanConnectionStatus.Results.data6g.security
		}
	});

	//Use update_table() to update table content, $1 is table tbody ID, $2 is table data, $3 is which columns need to display
	update_table('ext_currentConn', CONNECTION_DATA, CONNECTIONS_COLUMNS_LIST_VALUE)

}
	
function get_info_success_cb_scan(obj) {
	var data
	data = API.obj.copy(obj);
			
	if (data.WifiNeighbor.Status == "scanning") {
		setTimeout(function(){
			API.info.get(INFO_LIST, get_info_success_cb_scan, get_info_error_cb_scan);
		},1000);
		return;
	}else{
		if(data.WifiNeighbor.Status != "Idle")
			set_survey_result(data.WifiNeighbor.Results);
		loading_control(0);
	}		
}
	
function get_info_success_cb_wps(obj) {
	var data = API.obj.copy(obj);
	var wsc_ret = get_wscresult(data);

	if (wsc_ret == 'success') {
		clearInterval(bar_timer);
		wps_success(true);
	}
	else if (wsc_ret == 'active') {
		$("#loading_message").html(L.basic_setting_wlan_wifi_wps.lang_wps_msg1+"<br>"+L.basic_setting_wlan_wifi_wps.lang_wps_msg2+"<br>"+WPSTIME);
	}
	else {
		clearInterval(bar_timer);
		wps_success(false);
	}
}

function get_info_error_cb_conn(obj) {
	if(obj.api_return == 403) {
		logout('sto');
	}
}
	
function get_info_error_cb_scan(obj) {
	loading_control(0);
	if(obj.api_return == 403) {
		logout('sto');
	}
}

function get_info_error_cb_wps(obj) {
	clearInterval(bar_timer);
	wps_success(false);

	if(obj.api_return == 403) {
			logout('sto')
	}
}

function get_obj_success_cb(obj) {
    ORIGINAL_OBJ_DATA = API.obj.copy(obj);
	page_init()
}

function get_obj_error_cb(obj) {
    if(obj.api_return == 403)
		logout('sto')
}

function get_obj_data(obj_list){
	API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
}

function set_obj_success_cb_opmode(obj) {
	if(obj.api_return != 0){
		set_obj_error_cb(obj)
		return;
	}
}

function set_obj_success_cb_wireless(obj) {
	if(obj.api_return != 0){
		set_obj_error_cb(obj)
		return;
	}
	setTimeout(function(){
		loading_control(0)
		pop_alert_message(L.common.lang_success_msg,'success')
		get_obj_data(OBJ_LIST)
	}, 30000);
}

function set_obj_error_cb(obj) {
	$("#loader").hide()
	if(obj.api_return == 403){
		logout('sto')
		return;
	}else{
		setTimeout(function(){
			loading_control(0)
			pop_alert_message(L.common.lang_error_msg,'error')
		}, 2000);
	}
}

function set_obj_data(obj_content){
	var success_cb;
	if(obj_content.OpMode != undefined)
		success_cb = set_obj_success_cb_opmode;
	else if(obj_content.WlanExtender != undefined)
		success_cb = set_obj_success_cb_wireless;
	
	if(typeof(obj_content) == 'string')
		API.obj.set(JSON.parse(obj_content), success_cb, set_obj_error_cb);
	else if(typeof(obj_content) == 'object')
		API.obj.set(obj_content, success_cb, set_obj_error_cb);
}

function page_init() {
	if(ORIGINAL_OBJ_DATA.OpMode.OpModeP.Mode != "ap") {
		switcher_handler('extender_enable',"0")
		$(".wirelessExtender_enabled_show").hide();
	} else {
		switcher_handler('extender_enable',"1")
		getConnectionStatus();
		setInterval(getConnectionStatus, 30000);
	}

	if(ORIGINAL_OBJ_DATA.Wps.WpsP.Enable == '0') {
		$("#btn_pbc").attr("disabled", true);
		$("#btn_pbc").addClass("is-disabled");
	}
	
	//draw_empty_table_td("lang_wirelessExtender_siteSurvey_result");
}

function mode_type_selector(ext_mode){
	
}