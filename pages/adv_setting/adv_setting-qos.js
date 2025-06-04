	page_tag='adv_setting-qos'
	lang_tag='adv_setting_qos'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial();
	});

	function custom_btn(id){
		$('#' + id).addClass("pull-right");
	}
	function update_str_item(idx){
		var obj = {};

		if (idx < 0 || idx >= MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT.length)
			return;

		if (idx == "new"){
			$('#qos_uplink').attr("disabled",true);
			$('#qos_downlink').attr("disabled",true);
		} else{
			EDIT_INDEX = idx;
			obj = MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT[idx];

			if (obj.Category == '0') {
				$('#qos_bw').val('0');
				qos_bw_changed('0');

				$('#qos_port_start_1').val(obj.ServicePortStart1);
				$('#qos_port_end_1').val(obj.ServicePortEnd1);
				$('#qos_protocol_1').val(obj.ServiceProto1);
				$('#qos_port_start_2').val(obj.ServicePortStart2);
				$('#qos_port_end_2').val(obj.ServicePortEnd2);
				$('#qos_protocol_2').val(obj.ServiceProto2);
				$('#qos_port_start_3').val(obj.ServicePortStart3);
				$('#qos_port_end_3').val(obj.ServicePortEnd3);
				$('#qos_protocol_3').val(obj.ServiceProto3);
			}
			else if (obj.Category == '1') {
				$('#qos_bw').val('0');
				qos_bw_changed('0');

				$('#qos_mac').val(obj.DeviceMac);
			}
			else if (obj.Category == '2') {
				$('#qos_bw').val('1');
				qos_bw_changed('1');

				$('#qos_ifac').val(obj.Iface);
			}

			$('#qos_name').val(obj.ServiceName);
			$('#qos_prio').val(obj.Priority);

			$('#qos_category').val(obj.Category);
			qos_cat_changed(obj.Category,false);	
		}
		
		
		
	}

	function _update_table_layout(obj) {
		var id = 0

		obj.forEach(function(element) {
			if (element.Priority == '0')
				element.PriorityT = L.adv_setting_qos.lang_qos_low_titlie
			else if (element.Priority == '1')
				element.PriorityT = L.adv_setting_qos.lang_qos_normal_titlie
			else if (element.Priority == '2')
				element.PriorityT = L.adv_setting_qos.lang_qos_medium_titlie
			else if (element.Priority == '3')
				element.PriorityT = L.adv_setting_qos.lang_qos_high_titlie

			if (element.ServiceName != "")
				element.NameT = element.ServiceName;
			else
				element.NameT = "";

			if (element.Category == '0')
				element.InfoT = L.adv_setting_qos.lang_qos_port_title+" "+element.ServicePortStart1+" - "+element.ServicePortEnd1;
			else if (element.Category == '1')
				element.InfoT = element.DeviceMac;
			else if (element.Category == '2')
				element.InfoT = element.Iface;


			element.TB_ACTION={"edit":"qos_update("+id+")","delete":"qos_remove("+id+")"}
			id++
		});

		update_table('qos_tbody', obj, ADV_SETTING_QOS_COLUMNS_LIST_VALUE);
	}

	function _prepare_select(bw_mode) {
		qos_cat_str_list = [L.adv_setting_qos.lang_qos_app_title,L.adv_setting_qos.lang_qos_macaddr_title];
		qos_cat_val_list = ['0','1'];

		if (bw_mode == '1') {
			qos_cat_str_list.push(L.adv_setting_qos.lang_qos_interface_title);
			qos_cat_val_list.push('2');
		}

		draw_select('qos_category', qos_cat_str_list, qos_cat_val_list,'qos_cat_changed(this.value,true)', 'a', L.adv_setting_qos.lang_qos_category_title);
	}

	function set_ui_init(obj) {
		_update_table_layout(obj.QosPolicy.QosPolicyT);

		$('#qos_enabled').val(obj.Qos.QosP.Enable);
		switcher_handler('qos_enabled', obj.Qos.QosP.Enable, "qos_enable_switched()");
	}

	function _set_qos_rules_default() {
		$('#qos_name').val("");
		$('#qos_port_start_1').val("");
		$('#qos_port_end_1').val("");
		$('#qos_protocol_1').val('0');
		$('#qos_port_start_2').val("");
		$('#qos_port_end_2').val("");
		$('#qos_protocol_2').val('0');
		$('#qos_port_start_3').val("");
		$('#qos_port_end_3').val("");
		$('#qos_protocol_3').val('0');
		$('#qos_my_mac').val("");
		$('#qos_ifac').val('LAN1');
		$('#qos_prio').val('0');
	}

	function qos_enable_switched(is_save) {
		var qos_enable = $('#qos_enabled').val();

		if (qos_enable == '1') {
			$('[id^="btn_"]').removeAttr("disabled");
			$(".qos_emabled_show").show();
		}
		else {

			$('[id^="btn_"]').attr("disabled",true);
			$(".qos_emabled_show").hide();
		}

		if (is_save)
			page_save();
	}

	function qos_bw_changed(bw_mode) {
		if (bw_mode == '0') {
			$('#qos_uplink').attr("disabled",true);
			$('#qos_downlink').attr("disabled",true);
		}
		else {
			$('#qos_uplink').removeAttr("disabled");
			$('#qos_downlink').removeAttr("disabled");
		}

		_prepare_select(bw_mode);
		qos_cat_changed('0',true);
	}

	function qos_cat_changed(cat,is_set_defalut) {
		$('#input_qos_port_start_1').css("display","none");
		$('#input_qos_port_end_1').css("display","none");
		$('#select_qos_protocol_1').css("display","none");
		$('#input_qos_port_start_2').css("display","none");
		$('#input_qos_port_end_2').css("display","none");
		$('#select_qos_protocol_2').css("display","none");
		$('#input_qos_port_start_3').css("display","none");
		$('#input_qos_port_end_3').css("display","none");
		$('#select_qos_protocol_3').css("display","none");
		$('#input_qos_mac').css("display","none");
		// $('#div_qos_my_mac').css("display","none");
		$('#select_qos_ifac').css("display","none");
		$(".multi_port_zone").hide();

		if (cat == '0'){
			$('#input_qos_port_start_1').css("display","");
			$('#input_qos_port_end_1').css("display","");
			$('#select_qos_protocol_1').css("display","");
			$('#input_qos_port_start_2').css("display","");
			$('#input_qos_port_end_2').css("display","");
			$('#select_qos_protocol_2').css("display","");
			$('#input_qos_port_start_3').css("display","");
			$('#input_qos_port_end_3').css("display","");
			$('#select_qos_protocol_3').css("display","");
			$(".multi_port_zone").show();
		}
		else if (cat == '1') {
			$('#input_qos_mac').css("display","");
			// $('#qos_my_mac').text(L.adv_setting_qos.lang_qos_my_mac_msg+': ');
			// $('#div_qos_my_mac').css("display","");
		}
		else if (cat == '2')
			$('#select_qos_ifac').css("display","");

		if (is_set_defalut)
			_set_qos_rules_default();
	}

	function get_qos_datas(is_edit) {
		var obj = {};
		var new_rule = {};
		if (is_edit)
			obj = MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT[EDIT_INDEX];
		else {
			new_rule.gid = '0';
			new_rule.name = "QosPolicyT0";

			obj = new_rule;
		}
		obj.ServiceName = $('#qos_name').val();
		obj.Priority = $('#qos_prio').val();
		obj.Category = $('#qos_category').val();
		obj.DeviceMac = "";
		obj.Iface = "";
		obj.ServiceProto = "";
		obj.ServicePortStart = "";
		obj.ServicePortEnd = "";

		if (obj.Category == '0') {
			obj.ServiceProto1 = $('#qos_protocol_1').val();
			obj.ServicePortStart1 = $('#qos_port_start_1').val();
			obj.ServicePortEnd1 = $('#qos_port_end_1').val();
			obj.ServiceProto2 = $('#qos_protocol_2').val();
			obj.ServicePortStart2 = $('#qos_port_start_2').val();
			obj.ServicePortEnd2 = $('#qos_port_end_2').val();
			obj.ServiceProto3 = $('#qos_protocol_3').val();
			obj.ServicePortStart3 = $('#qos_port_start_3').val();
			obj.ServicePortEnd3 = $('#qos_port_end_3').val();
		}
		else if (obj.Category == '1')
			obj.DeviceMac = $('#qos_mac').val();
		else if (obj.Category == '2')
			obj.Iface = $('#qos_ifac').val();

		return obj;
	}

	function qos_apply() {
		var data;
		var is_edit = (EDIT_INDEX >= 0 && EDIT_INDEX < MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT.length);

		data = get_qos_datas(is_edit);

		if (!is_edit)
			MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT.push(data);

		EDIT_INDEX = -1;
		_set_qos_rules_default();
		_update_table_layout(MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT);
		close_dialog();
		if (!is_edit)
			page_save('add');
		else
			page_save();
	}
	function qos_remove(idx) {
		if (idx < 0 || idx >= MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT.length)
			return;

		MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT.splice(idx, 1);

		EDIT_INDEX = -1;
		_update_table_layout(MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT);
		page_save('del');
	}

	function qos_update(idx) {
		var action = [{"style":"default","text":L.adv_setting_qos.lang_qos_cancel_title,"action":"close_dialog()"},{"style":"primary","text":L.adv_setting_qos.lang_qos_apply_title,"action":"qos_apply()"}];
		if( 'new' == idx)
			pop_dialog("qos-add", action, "update_str_item(\'new\')");
		else
			pop_dialog("qos-add", action, "update_str_item("+idx+")");
	}

	function qos_refresh() {
		EDIT_INDEX = -1;

		get_obj_data(OBJ_LIST);
	}

	function qos_link_error(Rate, UnitType){
		if((UnitType == '0' && Rate < 4096) || (UnitType == '1' && Rate < 4)){
			window.alert(L.adv_setting_qos.lang_qos_link_kbps_error_msg);
			return true;
		}
	}

	function page_save(action){
		var i;

		MODIFIED_OBJ_DATA.Qos.QosP.Enable = $('#qos_enabled').val();

		for (i = 0; i < MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT.length; ++i)
			MODIFIED_OBJ_DATA.QosPolicy.QosPolicyT[i].name = "QosPolicyT"+i;

		MODIFIED_OBJ_DATA.Qos.QosP.WanRateMode = $('#qos_bw').val();

		
		if(MODIFIED_OBJ_DATA.Qos.QosP.Enable == '1') {
			MODIFIED_OBJ_DATA.Qos.QosP.UplinkRateUnitType = '0';

			if(qos_link_error($('#qos_uplink').val(), MODIFIED_OBJ_DATA.Qos.QosP.UplinkRateUnitType)){
				return;
			}

			MODIFIED_OBJ_DATA.Qos.QosP.UplinkRateKbps = $('#qos_uplink').val();
			MODIFIED_OBJ_DATA.Qos.QosP.UplinkRateMbps = "0";
			

			MODIFIED_OBJ_DATA.Qos.QosP.DownlinkRateUnitType = '0';

			if(qos_link_error($('#qos_downlink').val(), MODIFIED_OBJ_DATA.Qos.QosP.DownlinkRateUnitType)){
				return;
			}

			MODIFIED_OBJ_DATA.Qos.QosP.DownlinkRateKbps = $('#qos_downlink').val();
			MODIFIED_OBJ_DATA.Qos.QosP.DownlinkRateMbps = "0";
		}

		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA, action);
	}

	function set_del_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
			pop_alert_message(L.adv_setting_qos.lang_qos_del_success_msg,"success",3000);
		},SAVE_QOS_WAITING_TIME);
	}

	function set_add_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
			pop_alert_message(L.adv_setting_qos.lang_qos_add_success_msg,"success",3000);
		},SAVE_QOS_WAITING_TIME);
	}

	function set_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
		},SAVE_QOS_WAITING_TIME);
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
		if (obj.api_return == 403) {
			logout('sto');
		}
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST);
	}


