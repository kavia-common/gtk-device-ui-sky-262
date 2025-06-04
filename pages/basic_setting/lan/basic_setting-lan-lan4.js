page_tag = 'basic_setting-lan-lan4'
land_tag = 'basic_setting_lan_lan4'
var MLO_ENABLED = "0"
$(document).ready(function () {
	$.lang_load("basic_setting_lan_lan4");
	page_initial()
});

function _prepare_dhcpreserved_items(index) {
	var obj = MODIFIED_OBJ_DATA.Dhcp4Reserved.Dhcp4ReservedT;

	if (typeof (index) == "undefined" || typeof (obj[index]) == "undefined")
		return;

	$("#dhcpreserved_mac").val(obj[index].MacAddress);
	$("#dhcpreserved_ip").val(obj[index].AssignedIp);
}
function _prepare_dhcpreserved_layout() {
	var i;
	var content = "";
	var obj = MODIFIED_OBJ_DATA.Dhcp4Reserved.Dhcp4ReservedT;
	var objdhcps = MODIFIED_OBJ_DATA.Dhcp4s.Dhcp4sP;

	var id = 0;
	obj.forEach(function(element) {
		number = id+1
		element.Number=number
		element.TB_ACTION={"edit":"edit_dhcp_reserved("+id+")","delete":"del_dhcp_reserved("+id+")"}
		id++
	});
	update_table('lan_dhcpreserved_tbody', obj, BASIC_LAN_COLUMNS_LIST_VALUE)

	/*
	for (i = 0; i < obj.length; ++i) {
		var tr_class = ((i % 2) == 0) ? "el-table__row" : "el-table__row el-table__row--striped";

		content += "<tr class=\"" + tr_class + "\">";
		content += "<td class=\"\"><div class=\"cell\">" + (i + 1) + "</div></td>";
		content += "<td class=\"\"><div class=\"cell\">" + obj[i].MacAddress + "</div></td>";
		content += "<td class=\"\"><div class=\"cell\">" + obj[i].AssignedIp + "</div></td>";

		if (objdhcps.ReservedIpEanbled == '1')
			content += "<td class=\"text-center\"><a style=\"cursor: pointer;\" onclick=\"edit_dhcp_reserved(" + i + ")\"><img src=\"img/ic_edit_24px.png\"></a><a style=\"cursor: pointer;\" onclick=\"del_dhcp_reserved(" + i + ")\"><img src=\"img/ic_delete_24px.png\"></a></td>";
		else
			content += "<td class=\"text-center\"><img src=\"img/ic_edit_24px.png\"><img src=\"img/ic_delete_24px.png\"></td>";

		content += "</tr>";
	}

	if (content == "")
		draw_empty_table_td('lan_dhcpreserved_tbody');
	else
		$('#lan_dhcpreserved_tbody').html(content);
	*/
}

function lan_layer_switch(layer) {
	if ('l1' == layer) {
		$("#page_content_l2").hide()
		$("#page_content_l1").show()
		CUR_LAYER = "l1";
	}
	else if ('l2' == layer) {
		$("#page_content_l2").show()
		$("#page_content_l1").hide()
		CUR_LAYER = "l2";
	}
	window.scrollTo(0, 0);
}

function get_obj_success_cb(obj) {
	LOGINIP = obj.LOGINIP;
	ORIGINAL_OBJ_DATA = API.obj.copy(obj);
	MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
	MLO_ENABLED = ORIGINAL_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable
	layout_init(MODIFIED_OBJ_DATA)
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
function switch_toggle(id, val) {
	if(typeof(val) == "undefined" || val == "2"){  // val: 2 is from GUI trigger
		val = $('#'+id).val()
	}

	if(val == "1") {
		$(".dhcp_emabled_show").show()
	}
	else {
		$(".dhcp_emabled_show").hide()
	}

	switcher_handler(id,val)
}
function valid_lan_format() {
	if (ValidateIPaddress($("#ip").val()) != true) {
		alert(L.error_message.lang_error16_msg);
		return false;
	}
	if ($("#dns1").val() != "") {
		if (ValidateIPaddress($("#dns1").val()) != true) {
			alert(L.error_message.lang_error21_msg);
			return false;
		}
	}
	if ($("#dns2").val() != "") {
		if (ValidateIPaddress($("#dns2").val()) != true) {
			alert(L.error_message.lang_error22_msg);
			return false;
		}
	}
	if (Validatemask($("#mask").val()) != true) {
		alert(L.error_message.lang_error23_msg);
		return false;
	}
	return true;
}
function valid_dhcp_format() {
	if (valid_range($("#dhcp_start_input")[0], 1, 254, "IP") != true)
		return false;
	if (valid_range($("#dhcp_end_input")[0], 1, 254, "IP") != true)
		return false;
	if (parseInt($("#dhcp_start_input").val()) > parseInt($("#dhcp_end_input").val())) {
		alert(L.error_message.lang_error24_msg);
		return false;
	}
	return true;
}
function valid_time_format() {
	if (valid_range($("#dhcp_lease_input")[0], 1, 604800, "Time") != true)
		return false;
	return true;

}
function Validatemask(inputText) {
	var ipformat = /^^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/gm;
	if (inputText.match(ipformat)) {
		return true;
	}
	else {
		return false;
	}
}
function check() {
	if (valid_lan_format() != true) {
		return false
	}
	if (valid_dhcp_format() != true) {
		return false
	}
	if (valid_time_format() != true) {
		return false
	}
	var tmp = $('#ip').val().split(".")
	var tmp_str = ""
	for (var i = 0; i < tmp.length - 1; i++) {
		tmp_str += tmp[i] + '.'
	}
	$("#pre_start").html(tmp_str)
	$("#pre_end").html(tmp_str)
	$("#pre_start").val(tmp_str)
	$("#pre_end").val(tmp_str)
	var start_ip_addr = 0
	for (var i = 0; i < tmp.length; i++) {
		tmp_str += tmp[i] + '.'
		if (i == 3) {
			start_ip_addr = tmp[i]
		}
	}
	//alert("start_ip_addr " + start_ip_addr)
	var mask_tmp = $('#mask').val().split(".")
	tmp_str = ""
	for (var i = 0; i < mask_tmp.length; i++) {
		tmp_str += mask_tmp[i] + '.'
		//alert(i+ " " + mask_tmp[i])
		//alert("\n")
		if ((i == 3) && (mask_tmp[i] != 0)) {
			//alert(mask_tmp[i]^255)
			$("#dhcp_start_input").val(parseInt(start_ip_addr) + 1);
			$("#dhcp_end_input").val(parseInt(mask_tmp[i] ^ 255) - 1);
		}
	}
	return true
}
function dns_mode(mode) {
	if (mode == "p") {
		MODIFIED_OBJ_DATA.Lan.LanP.DnsMode = "proxy"
		$('#dns_zone').hide()
	} else if (mode == "r") {
		MODIFIED_OBJ_DATA.Lan.LanP.DnsMode = "relay"
		$('#dns_zone').hide()
	} else {
		MODIFIED_OBJ_DATA.Lan.LanP.DnsMode = "manually"
		$('#dns_zone').show()
	}
}
function layout_init_dhcpreserved(obj) {
	var objdhcps = obj.Dhcp4s.Dhcp4sP;

	switcher_handler('dhcpreserved_enabled', objdhcps.ReservedIpEanbled, "dhcpreserved_enable_switched(false)");

	_prepare_dhcpreserved_layout(obj);
}
function layout_init(obj) {
	if (obj.Dhcp4s.Dhcp4sP.Enabled == '1')
		switch_toggle('dhcp_btn', '1')
	else
		switch_toggle('dhcp_btn', '0')

	$("#ip").val(obj.Lan.LanP.IpAddress);
	$("#mask").val(obj.Lan.LanP.Netmask);
	$("#dns1").val(obj.Lan.LanP.Dns1);
	$("#dns2").val(obj.Lan.LanP.Dns2);
	if (obj.Lan.LanP.DnsMode == "proxy") {
		dns_mode('p')
		$("#dns_proxy").prop("checked", true)
	}
	else if (obj.Lan.LanP.DnsMode == "relay") {
		dns_mode('r')
		$("#dns_relay").prop("checked", true)
	}
	else {
		dns_mode('m')
		$("#dns_manually").prop("checked", true)
	}
	var tmp = obj.Lan.LanP.IpAddress.split(".")
	var tmp_str = ""
	for (var i = 0; i < tmp.length - 1; i++) {
		tmp_str += tmp[i] + '.'
	}
	$("#pre_start").html(tmp_str)
	$("#pre_end").html(tmp_str)
	$("#pre_start").val(tmp_str)
	$("#pre_end").val(tmp_str)

	$("#dhcp_start_input").val(obj.Dhcp4s.Dhcp4sP.StartIp.split(".")[3]);
	$("#dhcp_end_input").val(obj.Dhcp4s.Dhcp4sP.EndIp.split(".")[3]);
	$("#dhcp_lease_input").val(obj.Dhcp4s.Dhcp4sP.LeaseTime);

	layout_init_dhcpreserved(obj);
}

function dhcpreserved_enable_switched(is_save) {
	var dhcpreserved_enabled = $("#dhcpreserved_enabled").val();

	if (dhcpreserved_enabled == '1') {
		$("#dhcpreserved_add_btn").removeClass("is-disabled");
		$("#dhcpreserved_add_btn").removeAttr("disabled");
	}
	else {
		$("#dhcpreserved_add_btn").addClass("is-disabled");
		$("#dhcpreserved_add_btn").attr("disabled", true);
	}
	_prepare_dhcpreserved_layout();

	if (is_save)
		page_save_dhcpreserved();
}

function popup_add_dhcp_reserved(cb) {
	var action = [{ "style": "default", "text": L.common.lang_cancel_btn_title, "action": "close_dialog()" }, { "style": "primary", "text": L.common.lang_confirm_btn_title, "action": "add_dhcp_reserved();" }]

	pop_dialog("dhcp-reserved", action, cb, land_tag);
	// $('.el-dialog__title').text(L.basic_setting_lan_lan4.lang_add_dhcp_reserved);
}
function valid_exist() {
	var dhcpreserved = MODIFIED_OBJ_DATA.Dhcp4Reserved.Dhcp4ReservedT;
	for (var i = 0; i < dhcpreserved.length; i++) {
		//Fix #51787:[GUI-LAN] GUI does not show error message when add an reserved IP to DHCP reserved pool
		if (CUR_INDEX == i) {
			continue;
		}
		if ($('#dhcpreserved_mac').val() == dhcpreserved[i].MacAddress) {
			alert(L.error_message.lang_error6_msg);
			return false;
		}
		if ($('#dhcpreserved_ip').val() == dhcpreserved[i].AssignedIp) {
			alert(L.error_message.lang_error25_msg);
			return false;
		}
	}
	return true;
}

function valid_mac_format() {
	if (valid_mac_17($('#dhcpreserved_mac')[0]) != true) {
		alert(L.error_message.lang_error26_msg);
		return false;
	}
	return true;
}
function valid_local_ip_rule(start) {
	var lan = MODIFIED_OBJ_DATA.Lan.LanP.IpAddress.split('.')
	var st = start.split('.')
	if (lan[0] == st[0] && lan[1] == st[1] && lan[2] == st[2]) {
		return true
	} else {
		return false
	}
}
function valid_ip_format() {
	var ip = $('#dhcpreserved_ip').val()
	if (ValidateIPaddress(ip) != true) {
		alert(L.error_message.lang_error16_msg);
		return false;
	}
	if (valid_local_ip_rule(ip) != true) {
		alert(L.error_message.lang_error27_msg)
		return false;
	}
	return true;
}
function add_dhcp_reserved() {
	var i;
	var dhcpreserved = MODIFIED_OBJ_DATA.Dhcp4Reserved.Dhcp4ReservedT;
	var tmp = { "gid": "0", "name": "Dhcp4ReservedT", "AssignedIp": "", "MacAddress": "", "HostName": "" };
	if (valid_ip_format() != true) {
		return false
	}
	if (valid_mac_format() != true) {
		return false
	}
	if (dhcpreserved.length != 0) {
		if (valid_exist() != true) {
			return false
		}
	}

	var tmp_dhcpreserved_ip = $('#dhcpreserved_ip').val().split('.');
	if (parseInt(tmp_dhcpreserved_ip[3]) < parseInt($("#dhcp_start_input").val()) || parseInt(tmp_dhcpreserved_ip[3]) > parseInt($("#dhcp_end_input").val())) {
		alert(L.error_message.lang_error34_msg);
		return false;
	}

	if (CUR_INDEX == -1) {
		tmp.AssignedIp = $("#dhcpreserved_ip").val();
		tmp.MacAddress = $("#dhcpreserved_mac").val();

		dhcpreserved.push(tmp);
	}
	else {
		dhcpreserved[CUR_INDEX].AssignedIp = $("#dhcpreserved_ip").val();
		dhcpreserved[CUR_INDEX].MacAddress = $("#dhcpreserved_mac").val();
	}

	for (i = 0; i < dhcpreserved.length; ++i)
		dhcpreserved[i].name = "Dhcp4ReservedT" + i;
	close_dialog();
	page_save_dhcpreserved();
}
function edit_dhcp_reserved(index) {
	CUR_INDEX = index;
	popup_add_dhcp_reserved("_prepare_dhcpreserved_items(" + index + ");");
}
function del_dhcp_reserved(index) {
	var dhcpreserved = MODIFIED_OBJ_DATA.Dhcp4Reserved.Dhcp4ReservedT;

	dhcpreserved.splice(index, 1);
	CUR_INDEX = -1;

	page_save_dhcpreserved();
}

function page_save_dhcpreserved() {
	var objset = { "Dhcp4s": {}, "Dhcp4Reserved": {} };

	MODIFIED_OBJ_DATA.Dhcp4s.Dhcp4sP.ReservedIpEanbled = $("#dhcpreserved_enabled").val();

	objset.Dhcp4s = API.obj.copy(MODIFIED_OBJ_DATA.Dhcp4s);
	objset.Dhcp4Reserved = API.obj.copy(MODIFIED_OBJ_DATA.Dhcp4Reserved);

	CUR_INDEX = -1;
	loading_control(1);
	set_obj_data(objset);
}

function page_save() {
	if (check() != true)
		return false;
	if ($("#dhcp_btn").parent().prop('class').includes('checked'))
		MODIFIED_OBJ_DATA.Dhcp4s.Dhcp4sP.Enabled = '1';
	else
		MODIFIED_OBJ_DATA.Dhcp4s.Dhcp4sP.Enabled = '0';
	MODIFIED_OBJ_DATA.Lan.LanP.IpAddress = $('#ip').val();
	MODIFIED_OBJ_DATA.Lan.LanP.Netmask = $('#mask').val();
	MODIFIED_OBJ_DATA.Lan.LanP.Dns1 = $('#dns1').val();
	MODIFIED_OBJ_DATA.Lan.LanP.Dns2 = $('#dns2').val();
	MODIFIED_OBJ_DATA.Dhcp4s.Dhcp4sP.StartIp = $('#pre_start').val() + $('#dhcp_start_input').val();
	MODIFIED_OBJ_DATA.Dhcp4s.Dhcp4sP.EndIp = $('#pre_end').val() + $('#dhcp_end_input').val();
	MODIFIED_OBJ_DATA.Dhcp4s.Dhcp4sP.LeaseTime = $("#dhcp_lease_input").val();

	delete MODIFIED_OBJ_DATA.WlanGlobal;

	set_obj_data(MODIFIED_OBJ_DATA)
	loading_control(1);
	//$("#loading_message").html(L.common.lang_reconnect_msg)
}

function check_local_user(loginip, obj) {
	var i, ip_tmp;
	var ip4 = obj.IpAddress;
	var mask4 = obj.Netmask;

	if (typeof (loginip) == "undefined")
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

function set_obj_success_cb_post(){

	var is_local = check_local_user(LOGINIP, ORIGINAL_OBJ_DATA.Lan.LanP);
	var is_redirect = (ORIGINAL_OBJ_DATA.Lan.LanP.IpAddress != MODIFIED_OBJ_DATA.Lan.LanP.IpAddress) ||
		(ORIGINAL_OBJ_DATA.Lan.LanP.Netmask != MODIFIED_OBJ_DATA.Lan.LanP.Netmask);

	if (is_local && is_redirect)
		window.location.href = window.location.protocol + "//" + MODIFIED_OBJ_DATA.Lan.LanP.IpAddress;
	else{
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
		if (CUR_LAYER == "l1")
			layout_init(MODIFIED_OBJ_DATA);
		else if (CUR_LAYER == "l2")
			layout_init_dhcpreserved(MODIFIED_OBJ_DATA);
	}
}

function set_obj_success_cb(obj) {
	//show_alert(L.common.success_title, L.common.save_success);
	
	if( "1" == MLO_ENABLED){
		loading_time=page_loading_time.mlo_enabled.lan
	}else{
		loading_time=page_loading_time.mlo_disabled.lan
	}

	loading_wait_control(loading_time, 'set_obj_success_cb_post()')
}
function set_obj_error_cb(obj) {
	//show_alert(L.common.fail_title, L.common.save_fail)
}
function set_obj_data(obj_content) {
	if (typeof (obj_content) == 'string')
		API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
	else if (typeof (obj_content) == 'object')
		API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
}
function refresh(obj) {
	layout_init(ORIGINAL_OBJ_DATA)
}

