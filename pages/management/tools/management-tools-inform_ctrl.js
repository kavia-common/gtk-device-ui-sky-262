	page_tag='management-tools-inform_ctrl'
	$(document).ready(function(){
		$.lang_load("management_tools_inform_ctrl");
		page_initial();
	});
	
	var INFORM_CHECK_COUNTER=0
	var INFORM_CHECK_TIMER
	
	function _update_result(obj) {
		var content1 = ""
		var content2 = ""
		var recheck = false
		
		if (obj.first_result == "reporting" || obj.second_result == "reporting" ) {
			INFORM_CHECK_COUNTER++
			if (INFORM_CHECK_COUNTER >= 10) {
				$('#report_btn').removeClass("is-disabled");
			}else
				recheck = true;
		}else if(obj.first_result != "reporting" && obj.second_result != "reporting" ) {
			$('#report_btn').removeClass("is-disabled");
		}
		
		if (obj.first_result == "reporting") {
			if (INFORM_CHECK_COUNTER >= 10) {
				content1 = L.management_tools_inform_ctrl.lang_infomanul_server1_title + L.management_tools_inform_ctrl.lang_infomanul_timeout
			}else
				content1 = L.management_tools_inform_ctrl.lang_infomanul_server1_title + L.management_tools_inform_ctrl.lang_infomanul_waiting_msg;
		}else if (obj.first_result != "reporting") {
			if (obj.first_result == "Disabled")
				content1 = L.management_tools_inform_ctrl.lang_infomanul_server1_title + L.management_tools_inform_ctrl.lang_infomanul_server_disabled;
			else
				content1 = L.management_tools_inform_ctrl.lang_infomanul_server1_title + obj.first_result;
		}
		
		if (obj.second_result == "reporting") {
			if (INFORM_CHECK_COUNTER >= 10) {
				content1 = L.management_tools_inform_ctrl.lang_infomanul_server2_title + L.management_tools_inform_ctrl.lang_infomanul_timeout
			}else
				content2 = L.management_tools_inform_ctrl.lang_infomanul_server2_title + L.management_tools_inform_ctrl.lang_infomanul_waiting_msg;
		}else if (obj.second_result != "reporting") {
			if (obj.second_result == "Disabled")
				content2 = L.management_tools_inform_ctrl.lang_infomanul_server2_title + L.management_tools_inform_ctrl.lang_infomanul_server_disabled;
			else
				content2 = L.management_tools_inform_ctrl.lang_infomanul_server2_title + obj.second_result;
		}
		
		$("#infomanul_result").html(content1 + '<br/>' + content2);
				
		if (recheck)
			INFORM_CHECK_TIMER = setTimeout(get_info_data, TIMER_INTERVAL, INFO_LIST);
	}

	function set_ui_init() {
		if(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.EnableServer1=="1"){
			switch_toggle($("#enable1_btn"),"1");
		}else{
			switch_toggle($("#enable1_btn"),"0");
		}
		if(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.EnableServer2=="1"){
			switch_toggle($("#enable2_btn"),"1");
		}else{
			switch_toggle($("#enable2_btn"),"0");
		}
		$('#server_1').val(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SercerAddress1);
		$('#server_2').val(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SercerAddress2);
		$('#time_1').val(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.IntervalTime1);
		$('#time_2').val(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.IntervalTime2);
		//$('#ais_version').val(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SecretKeyVersion);
		//$('#ais_key').val(MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SecretKey);
	}
	

	function start_report() {
		$("#infomanul_result").html('')
		set_info_data(INFOMANUL_CMD);
	}

	function set_info_success_cb(obj) {
		INFORM_CHECK_COUNTER = 0;
		TIMER_INTERVAL = 2500;
		timer_flag = true;

		$('#infomanul_result').text("");
		$('#report_btn').addClass("is-disabled");

		get_info_data(INFO_LIST);
	}
	function set_info_error_cb(obj) {
		if (obj.api_return == 403) {
			logout('sto');
		}
	}
	function set_info_data(obj_content){
		if(typeof(obj_content) == 'string')
			API.info.set(JSON.parse(obj_content), set_info_success_cb, set_info_error_cb);
		else if(typeof(obj_content) == 'object')
			API.info.set(obj_content, set_info_success_cb, set_info_error_cb);
	}

 	function get_info_success_cb(obj) {
		INFO_DATA = API.obj.copy(obj);
		_update_result(INFO_DATA.InformManual);		
	} 
 	function get_info_error_cb(obj) {
		$('#report_btn').removeClass("is-disabled");
		if (obj.api_return == 403) {
			logout('sto');
		}
	}
	function get_info_data(info_list,flag){ 
		clearTimeout(INFORM_CHECK_TIMER);
		if(flag=='1')
			API.info.get(info_list, get_info2_success_cb, get_info_error_cb);
		else
			API.info.get(info_list, get_info_success_cb, get_info_error_cb);
	}
 	function get_info2_success_cb(obj) {
		INFO_DATA = API.obj.copy(obj);
		update_ais(INFO_DATA)
	}
	function update_ais(obj){
		$('#ais_version').val(obj.InformManual.enc_version);
		$('#ais_key').val(obj.InformManual.enc_key);
		
	} 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST)

	}
	function switch_toggle(obj,val){

		if(val == "1"){
			$(obj).parent().attr('class','el-switch is-checked')
		}else if(val == "0"){
			$(obj).parent().attr('class','el-switch')
		}else{
			if($(obj).parent().prop('class') == "el-switch is-checked"){
				$(obj).parent().attr('class','el-switch')
			}else{
				$(obj).parent().attr('class','el-switch is-checked')
			}
		}
		
	}
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	
 	function get_obj_error_cb(obj) { 
		
	}
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		//page_initial();
		set_ui_init();
		get_info_data(INFO_LIST,'1')
		//loading_control(0);
	} 
	function set_obj_success_cb(obj) {
		//show_alert(L.common.success_title, L.common.save_success);
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
		
		setTimeout(function(){
			page_initial()
			loading_control(0)
		}, 1000);
	}
	
	function set_obj_error_cb(obj) {
		loading_control(0)
		//alert("set fail");
	}

	function page_save(){

		loading_control(1);
		if($("#enable1_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.EnableServer1='1';
		else
			MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.EnableServer1='0';
		
		if($("#enable2_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.EnableServer2="1";
		else
			MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.EnableServer2='0';	
		MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SercerAddress1=$('#server_1').val()
		MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SercerAddress2=$('#server_2').val()
		MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.IntervalTime1=$('#time_1').val()
		MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.IntervalTime2=$('#time_2').val()
		if($("#ais_version").val() != INFO_DATA.InformManual.enc_version)
		MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SecretKeyVersion=$("#ais_version").val();
		if($("#ais_key").val() != INFO_DATA.InformManual.enc_key)
		MODIFIED_OBJ_DATA.CpeAgent.CpeAgentP.SecretKey=$("#ais_key").val();

		set_obj_data(MODIFIED_OBJ_DATA)
	}
		
	function set_obj_data(obj_content){
		if(typeof(obj_content) == 'string')
		API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object')
		API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}
