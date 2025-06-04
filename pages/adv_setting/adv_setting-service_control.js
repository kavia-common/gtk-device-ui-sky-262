	page_tag='adv_setting-service_control'
	lang_tag='adv_setting_service_control'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial();
	});

	function _update_table_layout(obj) {
		var ip_range, acl_enable;
		var i = 0;
		obj.forEach(function(element) {
			if (element.IpVersion == 'ipv6') {
				if (element.Ip6SrcStart == "" && element.Ip6SrcEnd == "")
					ip_range = L.adv_setting_service_control.lang_acl_ip_any_title;
				else
					ip_range = element.Ip6SrcStart+'-'+element.Ip6SrcEnd;
			}
			else {
				if (element.Ip4SrcStart == "" && element.Ip4SrcEnd == "")
					ip_range = L.adv_setting_service_control.lang_acl_ip_any_title;
				else
					ip_range = element.Ip4SrcStart+'-'+element.Ip4SrcEnd;
			}


			element.IpRange = ip_range
			element.RuleEnable = element.Enable == '1' ? L.adv_setting_service_control.lang_acl_accept_title : L.adv_setting_service_control.lang_acl_block_title;
			element.TB_ACTION = {"delete":"del_acl('"+i+"')"}
			i++
		});
		update_table('acl_tbody', obj, ADV_SETTING_SERVICE_CONTROL_COLUMNS_LIST_VALUE)

	}

	function set_ui_init(obj) {
		_update_table_layout(obj.AclPolicy.AclPolicyT);
		$('#acl_enabled').val(obj.Acl.AclP.Enable);
		switcher_handler('acl_enabled', obj.Acl.AclP.Enable, acl_enable_switched(false));
	}

	function set_valid_range_ret(eid,ret) {

		if (ret) {
			$('#'+eid+'_error_msg').css("display","none");
		}
		else {
			$('#'+eid+'_error_msg').css("display","");
		}
	}

	function valid_ip_address_range() {
		var ip_proto = $('#ip_proto').val().toLowerCase();
		var ip_start = $('#ip_start').val();
		var ip_end = $('#ip_end').val();
		var ret_start = false;
		var ret_end = false;

		if (ip_start == "" && ip_end == "") {
			set_valid_range_ret('ip_start',true);
			set_valid_range_ret('ip_end',true);
			return true;
		}

		if (ip_proto == 'ipv4') {
			ret_start = ValidateIPaddress(ip_start);
			ret_end   = ValidateIPaddress(ip_end);
                }
		else if (ip_proto == 'ipv6') {
			ret_start = valid_ipv6($('#ip_start')[0]);
			ret_end   = valid_ipv6($('#ip_end')[0]);
		}

		if (ip_start == "")
			ret_start = !ret_end;
		else if (ip_end == "")
			ret_end = !ret_start;

		set_valid_range_ret('ip_start',ret_start);
		set_valid_range_ret('ip_end',ret_end);
		
		return (ret_start && ret_end);
        }

	function get_acl_datas() {
		var data = {};

		data.gid = '0';
		data.name = "AclPolicyT0";
		data.Protocol = $('#protocol').val();
		data.Interface = $('#access_ctrl').val();
		data.IpVersion = $('#ip_proto').val().toLowerCase();

		if ($("#radio_accept").prop("checked")) {
			data.Enable = '1';
		} else {
			data.Enable = '0';
		}
		

		if (data.IpVersion == "ipv6") {
			data.Ip6SrcStart = $('#ip_start').val();
			data.Ip6SrcEnd = $('#ip_end').val();
		}
		else {
			data.Ip4SrcStart = $('#ip_start').val();
			data.Ip4SrcEnd = $('#ip_end').val();
		}

		return data;
	}

	function switch_radio(obj){
		if(obj.id=="radio_accept") {
			$("#radio_accept").prop("checked", true);
			$("#radio_block").prop("checked", false);
		} else if(obj.id=="radio_block") {
			$("#radio_block").prop("checked", true);
			$("#radio_accept").prop("checked", false);
		}
	}

	function add_acl() {
		var data;

		if (!valid_ip_address_range())
			return;

		data = get_acl_datas();
		MODIFIED_OBJ_DATA.AclPolicy.AclPolicyT.push(data);

		_update_table_layout(MODIFIED_OBJ_DATA.AclPolicy.AclPolicyT);

		close_dialog();
		page_save('add');
	}

	function del_acl(idx) {
		if (idx < 0 || idx >= MODIFIED_OBJ_DATA.AclPolicy.AclPolicyT.length )
			return;

		MODIFIED_OBJ_DATA.AclPolicy.AclPolicyT.splice(idx, 1);

		_update_table_layout(MODIFIED_OBJ_DATA.AclPolicy.AclPolicyT);

		page_save('del');
	}

	function acl_enable_switched(is_save) {
		var acl_enable = $('#acl_enabled').val();

		if (acl_enable == '1') {
			$('button[id^="btn_"]').removeAttr("disabled");
			$('button[id^="btn_"]').removeClass("is-disabled");
			$(".acl_emabled_show").show();
		}
		else {
			$('button[id^="btn_"]').attr("disabled",true);
			$('button[id^="btn_"]').addClass("is-disabled");
			$(".acl_emabled_show").hide()
		}

		if (is_save)
			page_save();
	}

	function pop_init() {
		$("#radio_block").prop("checked", true);
		$("#radio_accept").prop("checked", false);
	}

	function add_clicked() {
		var action = [{"style":"default","text":L.adv_setting_service_control.lang_acl_cancel_title,"action":"close_dialog()"},{"style":"primary","text":L.adv_setting_service_control.lang_acl_confirml_title,"action":"add_acl()"}];

		pop_dialog("acl-add", action, "pop_init()");
	}

	function page_save(action){
		var i;

		MODIFIED_OBJ_DATA.Acl.AclP.Enable = $('#acl_enabled').val();

		for (i = 0; i < MODIFIED_OBJ_DATA.AclPolicy.AclPolicyT.length; ++i)
			MODIFIED_OBJ_DATA.AclPolicy.AclPolicyT[i].name = "AclPolicyT"+i;

		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA, action);
	}

	function set_add_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
			pop_alert_message(L.adv_setting_service_control.lang_acl_add_success_msg,"success",3000);
		},SAVE_ACL_WAITING_TIME);
	}
	function set_del_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
			pop_alert_message(L.adv_setting_service_control.lang_acl_del_success_msg,"success",3000);
		},SAVE_ACL_WAITING_TIME);
	}
	function set_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
			pop_alert_message(L.common.lang_success_msg,"success",3000);
		},SAVE_ACL_WAITING_TIME);
	}
	function set_obj_error_cb(obj) {
		loading_control(0);

		if (obj.api_return == 403) {
			logout('sto');
		}
	}
	function set_obj_data(obj_content, action){ 
		if(typeof(obj_content) == 'string')
			API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb); 
		else if(typeof(obj_content) == 'object' && action == "add") 
			API.obj.set(obj_content, set_add_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object' && action == "del") 
			API.obj.set(obj_content, set_del_obj_success_cb, set_obj_error_cb);
		else  
			API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}

 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);

		set_ui_init(MODIFIED_OBJ_DATA);
	} 
 	function get_obj_error_cb(obj) { 
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	}
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST);
	} 
