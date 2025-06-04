var INFO_LIST = ['MeshNodeStatus']
var TOPO_INFO_LIST = ['MeshTopoStatus']
var info_data = {};
var delay = 0;
page_tag = 'basic_setting-wlan-mesh'
$(document).ready(function() {
	$.lang_load("basic_setting_wlan_mesh");
	page_initial()
});

function callback() {

}

function check_delay() {
	if (delay == 0) {
		setTimeout("check_delay();", 1000)
	}
}

function get_info_data(info_list) {
	API.info.get(info_list, get_info_success_cb, get_info_error_cb);
}

function get_info_success_cb(obj) {
	info_data = API.obj.copy(obj);
	if (info_data.MeshNodeStatus.length > 1)
		delay = 360000
	else
		delay = loading_time[1]
	check_delay();
	set_obj_data(MODIFIED_OBJ_DATA)
}

function get_info_error_cb(obj) {
	if (obj.api_return == 403) {
		logout('sto')
	}
}

function get_obj_success_cb(obj) {
	ORIGINAL_OBJ_DATA = API.obj.copy(obj);
	MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
	layout_init();
	page_init(MODIFIED_OBJ_DATA.Mesh)
}

function get_obj_error_cb(obj) {
	
}

function get_obj_data(obj_list) {
	API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
}

function page_initial() {
	//Coding initial function here
	get_obj_data(OBJ_LIST)
}

function page_init(obj) {
	//$("#backhaul_ssid").prop('disabled', true);
	$("#backhaul_authtype").prop('disabled', true);
	//$("#backhaul_encryptype").prop('disabled', true);
   switcher_handler('enable_btn',obj.MeshP.Enable)
   switcher_handler('enable_btn1',obj.MeshP.BSSColoringEnabled)
   /*
	if (obj.MeshP.Enable == "1")
		switch_toggle($('#enable_btn')[0], '1')
	else
		switch_toggle($('#enable_btn')[0], '0')
   */
	$("#2g_ssid").val(obj.MeshP.Ssid)
	//$("#5g_ssid").val(obj.MeshP.Ssid5G)
	$("#2g_wpa_key").val(obj.MeshP.Pwd)
	//$("#5g_wpa_key").val(obj.MeshP.Pwd5G)
	$("#encryptype_2g_select").val(obj.MeshP.EncrypType.toLowerCase())
	//$("#encryptype_5g_select").val(obj.MeshP.EncrypType5G.toLowerCase())
	$("#authtype_2g_select").val(obj.MeshP.AuthType.toLowerCase())
	//$("#authtype_5g_select").val(obj.MeshP.AuthType5G.toLowerCase())

	if ($('#ssid').css('display') != "none") {
		if (MODIFIED_OBJ_DATA.OpMode.OpModeP.Mode == "ap")
			$('#ssid').hide()
		else
			$('#ssid').show()
	}

	$("#backhaul_ssid").val(obj.MeshP.BHSsid)
	if (obj.MeshP.BHAuthType == "wpa3") {
		$("#backhaul_authtype").val("WPA3 PSK")
	} else if (obj.MeshP.BHAuthType == "wpa2") {
		$("#backhaul_authtype").val("WPA2 PSK")
	} else if (obj.MeshP.BHAuthType == "wpa") {
		$("#backhaul_authtype").val("WPA PSK")
	} else if (obj.MeshP.BHAuthType == "open" || obj.MeshP.BHAuthType == "eopen") {
		$("#backhaul_authtype").val("OPEN")
	} else {
		$("#backhaul_authtype").val("Unknown")
	}
	$("#backhaul_wpa_key").val(obj.MeshP.BHPwd)
}

function switch_toggle(obj, val) {
	if (typeof(val) == "undefined") {
		if ($(obj).parent().prop('class') == "el-switch is-checked") {
			$(obj).parent().attr('class', 'el-switch')
			MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "0"
			MODIFIED_OBJ_DATA.Mesh.MeshP.BSSColoringEnabled = "0"
			$('#backhaul').hide()
		} else {
			$(obj).parent().attr('class', 'el-switch is-checked')
			MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "1"
			MODIFIED_OBJ_DATA.Mesh.MeshP.BSSColoringEnabled = "1"
			$('#backhaul').show()
		}
	} else {
		if (val == "1") {
			$(obj).parent().attr('class', 'el-switch is-checked')
			MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "1"
			MODIFIED_OBJ_DATA.Mesh.MeshP.BSSColoringEnabled = "1"
			$('#backhaul').show()
		} else {
			$(obj).parent().attr('class', 'el-switch')
			MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "0"
			MODIFIED_OBJ_DATA.Mesh.MeshP.BSSColoringEnabled = "0"
			$('#backhaul').hide()
		}
	}
}

function select_authtype_select() {
	if ($('#authtype_2g_select').val() == 'open') {
		$('#div_encryptype_select').hide()
		$('#div_ssidpwd').hide()
	} else {
		$('#div_encryptype_select').show()
		$('#div_ssidpwd').show()
	}
}

function select_encryptype_select() {

}

function valid_ssid() {
	var ssid_valid_result = validation_ssid($("#backhaul_ssid").val())

	if (ssid_valid_result == 1) {
		alert(L.error_message.lang_ssid_empty_msg)
		return false;
	} else if (ssid_valid_result == 2) {
		alert(L.error_message.lang_ssid_overlength_msg)
		return false;
	} else if (ssid_valid_result == 3) {
		alert(L.error_message.lang_ssid_length_error_msg)
		return false;
	} else if (ssid_valid_result == 4) {
		alert(L.error_message.lang_ssid_front_end_space_error_msg)
		return false;
	}
	return true
}

function valid_key() {
	var auth_type = $('#backhaul_authtype').val()
	var auth_key = $('#backhaul_wpa_key').val()
	if (auth_type != 'open') {
		var key_valid_result = validation_key(auth_key)
		if (!key_valid_result) {
			alert(L.error_message.lang_wpa_key_ascii_format_error_msg)
			return false
		}
	}
	return true
}

function layout_init() {
	$("#password_display").html(L.basic_setting_wlan_mesh.lang_show_key)
	$("#backhaul_password_display").html(L.basic_setting_wlan_mesh.lang_show_key)
}

function password_display_control() {
	var x = document.getElementById("backhaul_wpa_key");
	if (x.type === "password") {
		$("#backhaul_password_display").html(L.basic_setting_wlan_mesh.lang_hide_key)
		x.type = "text";
	} else {
		$("#backhaul_password_display").html(L.basic_setting_wlan_mesh.lang_show_key)
		x.type = "password";
	}
}

function page_save() {
	if (!valid_ssid())
		return false;
	if (!valid_key())
		return false;
	$("#loading_message").html("Synchronize setting...")
	loading_control(1);
	var obj = MODIFIED_OBJ_DATA.Mesh.MeshP
	//obj.Ssid = $("#2g_ssid").val()
	//obj.Ssid5G = $("#5g_ssid").val()
	//obj.Pwd = $("#2g_wpa_key").val()
	//obj.Pwd5G = $("#5g_wpa_key").val()
	//obj.EncrypType = $("#encryptype_2g_select").val()
	//obj.EncrypType5G = $("#encryptype_5g_select").val()
	//obj.AuthType = $("#authtype_2g_select").val()
	//obj.AuthType5G = $("#authtype_5g_select").val()
	obj.BHSsid = $("#backhaul_ssid").val()
	obj.BHPwd = $("#backhaul_wpa_key").val()
	obj.Enable=$("#enable_btn").val()
	obj.BSSColoringEnabled=$("#enable_btn1").val()
	set_obj_data(MODIFIED_OBJ_DATA);
}

function set_obj_success_cb(obj) {
	//show_alert(L.common.success_title, L.common.save_success);
	ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
	loading_wait_wireless_restart()
}

function set_obj_error_cb(obj) {
	if (obj.api_return == 403) {
		logout('sto')
		return;
	} else {
		pop_alert_message(L.common.lang_error_msg, 'error')
	}
}

function set_obj_data(obj_content) {
	if (typeof(obj_content) == 'string')
		API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
	else if (typeof(obj_content) == 'object')
		API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
}

function open_mesh_map() {
	action = []
	loading_control(1);
	setTimeout(function() {
		loading_control(0);
		pop_dialog('meshtopology', action, '');
	}, 2500);
}