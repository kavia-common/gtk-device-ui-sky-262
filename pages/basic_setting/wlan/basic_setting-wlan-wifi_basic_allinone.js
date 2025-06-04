	var INFO_LIST = ['MeshNodeStatus']
	var info_data={};
	var delay
	page_tag='basic_setting-wlan-mesh'
	$(document).ready(function(){
		$.when(
			$.lang_load("basic_setting_wlan_mesh"),
			$.lang_load("basic_setting_wlan_wifi_basic2")		
		 ).done(function(){
			loading_control(1);
			page_initial()
		 })
		
		
	});
	function callback(){

	}
	
	function get_info_data(info_list) {
		API.info.get(info_list, get_info_success_cb, get_info_error_cb);
	}
	function get_info_success_cb(obj) {
		info_data = API.obj.copy(obj);
		if(info_data.MeshNodeStatus.length > 1)
			delay = 360000
		else
			delay = 15000
	}
	function get_info_error_cb(obj) {
		if (obj.api_return == 403) {
			logout('sto')
		}
	}
	function get_obj_success_cb(obj) {
		ORIGINAL_OBJ_DATA = API.obj.copy(obj);
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
		page_init(MODIFIED_OBJ_DATA)
		loading_control(0);
	}
	function get_obj_error_cb(obj) {
		loading_control(0);
	}
	function get_obj_data(obj_list){
			API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
	}
	function page_initial(){
		$("#password_displaycommon").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
		$("#password_display2").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
		$("#password_display5").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
		$("#password_display6").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
		get_obj_data(OBJ_LIST)
	}

	function ssid_hide_switch(band, hide){
		if(typeof(hide) == "undefined"){
			if($("#hide_ssid_btn"+band).parent().prop('class') == "el-switch is-checked"){
				$("#hide_ssid_btn"+band).parent().attr('class','el-switch')
				hide="1"
			}else{
				$("#hide_ssid_btn"+band).parent().attr('class','el-switch is-checked')
				hide="0"
			}
		}else{
			if(hide == "0"){
				$("#hide_ssid_btn"+band).parent().attr('class','el-switch is-checked')
			}else{
				$("#hide_ssid_btn"+band).parent().attr('class','el-switch')
			}
	}
	
		if("2" == band)
			MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[0].Hidden = hide
		else if("5" == band)
			MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[4].Hidden = hide
		else
			MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[8].Hidden = hide
	}

	function mesh_onoff_control(enabled){
		if(typeof(enabled) == "undefined"){
			if($('#enable_btn').parent().prop('class') == "el-switch is-checked"){
				$('#enable_btn').parent().attr('class','el-switch')
				enabled = "0"
			}else{
				$('#enable_btn').parent().attr('class','el-switch is-checked')
				enabled = "1"
			}
		}else{
			if(enabled == "1"){
				$('#enable_btn').parent().attr('class','el-switch is-checked')
			}else{
				$('#enable_btn').parent().attr('class','el-switch')
			}
		}
		
		if(enabled == "1"){
			//switch_toggle($('#enable_btn')[0],'1')
			update_select('authtype_2g', allinone_mesh_authtype_select_str, allinone_mesh_authtype_select_val,'select_authtype_select(\'2\')', '');
			update_select('authtype_5g', allinone_mesh_authtype_select_str, allinone_mesh_authtype_select_val,'select_authtype_select(\'5\')', '');
			update_select('authtype_6g', allinone_mesh_authtype_select_str, allinone_mesh_authtype_select_val,'select_authtype_select(\'6\')', '');			
		}
		else{
			//switch_toggle($('#enable_btn')[0],'0')
			update_select('authtype_2g', allinone_unmesh_authtype_select_str, allinone_unmesh_authtype_select_val,'select_authtype_select(\'2\')', '');
			update_select('authtype_5g', allinone_unmesh_authtype_select_str, allinone_unmesh_authtype_select_val,'select_authtype_select(\'5\')', '');
			update_select('authtype_6g', allinone_unmesh_authtype_select_str, allinone_unmesh_authtype_select_val,'select_authtype_select(\'6\')', '');
		}
				
        if(enabled == "1"){
            if(-1 == allinone_mesh_authtype_select_val.indexOf(MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType2G.toLowerCase()))
                select_authtype_select("2",'wpa3')
            else
                select_authtype_select("2",MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType2G.toLowerCase())
        }else{
            select_authtype_select("2",MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType2G.toLowerCase())
        }

        if(enabled == "1"){
            if(-1 == allinone_mesh_authtype_select_val.indexOf(MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType5G.toLowerCase()))
                select_authtype_select("5",'wpa3')
            else
                select_authtype_select("5",MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType5G.toLowerCase())
        }else{
            select_authtype_select("5",MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType5G.toLowerCase())
        }

        if(enabled == "1"){
            if(-1 == allinone_mesh_authtype_select_val.indexOf(MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType6G.toLowerCase()))
                select_authtype_select("6",'wpa3')
            else
                select_authtype_select("6",MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType6G.toLowerCase())
        }else{
            select_authtype_select("6",MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType6G.toLowerCase())
        }
				
		MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = enabled
	}

	function page_init(obj){
		mesh_onoff_control(obj.Mesh.MeshP.Enable)
		
		update_select('authtype_commong', allinone_common_ssid_authtype_select_str, allinone_common_ssid_authtype_select_val,'select_authtype_select(\'common\')', '');
		update_select('encryptype_2g', encryptype_select_str, encryptype_select_val,'select_encrytype_select(\'2\')', '');
		update_select('encryptype_5g', encryptype_select_str, encryptype_select_val,'select_encrytype_select(\'5\')', '');
		update_select('encryptype_6g', encryptype_select_str, encryptype_select_val,'select_encrytype_select(\'6\')', '');
		
		$("#2g_ssid").val(obj.WlanDeviceSsid.WlanDeviceSsidT[0].Ssid)
		$("#5g_ssid").val(obj.WlanDeviceSsid.WlanDeviceSsidT[4].Ssid)
		$("#6g_ssid").val(obj.WlanDeviceSsid.WlanDeviceSsidT[8].Ssid)
		$("#2g_wpa_key").val(obj.WlanDeviceSsid.WlanDeviceSsidT[0].Key)
		$("#5g_wpa_key").val(obj.WlanDeviceSsid.WlanDeviceSsidT[4].Key)
		$("#6g_wpa_key").val(obj.WlanDeviceSsid.WlanDeviceSsidT[8].Key)
		
		ssid_hide_switch("2", obj.WlanDeviceSsid.WlanDeviceSsidT[0].Hidden)
		ssid_hide_switch("5", obj.WlanDeviceSsid.WlanDeviceSsidT[4].Hidden)
		ssid_hide_switch("6", obj.WlanDeviceSsid.WlanDeviceSsidT[8].Hidden)
			
		if(obj.OpMode.OpModeP.Mode=="ap"){
			$('#ssid_zone_2').hide()
			$('#ssid_zone_5').hide()
			$('#ssid_zone_6').hide()
		}else{
			$('#ssid_zone_2').show()
			$('#ssid_zone_5').show()
			$('#ssid_zone_6').show()
		}
		
		//Single SSID Zone
		$("#single_ssid_enable").val(obj.WlanGlobal.WlanGlobalP.SingleSsidEnable);
		if ( 0 == obj.WlanGlobal.WlanGlobalP.SingleSsidEnable){
			$("#single_ssid_enable").parent("div").removeClass("is-checked");
		}
		single_ssid_enable_handler(obj.WlanGlobal.WlanGlobalP.SingleSsidEnable)

		$("#MLO_enable").val(obj.WlanGlobal.WlanGlobalP.MloEnable);
		if ( 0 == obj.WlanGlobal.WlanGlobalP.MloEnable){
			$("#MLO_enable").parent("div").removeClass("is-checked");
		}
		MLO_enable_handler(obj.WlanGlobal.WlanGlobalP.MloEnable)

		select_authtype_select("common",'wpa3')

		var single_ssid_name=obj.WlanGlobal.WlanGlobalP.SingleSsidName
		var single_ssid_key=obj.WlanGlobal.WlanGlobalP.SingleSsidKey
		if ( single_ssid_name == "" || single_ssid_key == "" ){
			$("#commong_ssid").val(obj.WlanDeviceSsid.WlanDeviceSsidT[0].Ssid)
			$("#commong_wpa_key").val(obj.WlanDeviceSsid.WlanDeviceSsidT[0].Key)
		}else{
			$("#commong_ssid").val(obj.WlanGlobal.WlanGlobalP.SingleSsidName)
			$("#commong_wpa_key").val(obj.WlanGlobal.WlanGlobalP.SingleSsidKey)
		}
	}

	function switch_ssid_hide(target,val){
		if(typeof(val) == "undefined"){
			if($(target).parent().prop('class') == "el-switch is-checked"){
				$(target).parent().attr('class','el-switch')
			}else{
				$(target).parent().attr('class','el-switch is-checked')
			}
		}else{
			if(val == "1"){
				$(target).parent().attr('class','el-switch is-checked')
			}else{
				$(target).parent().attr('class','el-switch')
			}
	}
	}

	function switch_toggle(obj,val){
		if(typeof(val) == "undefined"){
			if($(obj).parent().prop('class') == "el-switch is-checked"){
				$(obj).parent().attr('class','el-switch')
				MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "0"
			}else{
				$(obj).parent().attr('class','el-switch is-checked')
				MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "1"
			}
		}else{
			if(val == "1"){
				$(obj).parent().attr('class','el-switch is-checked')
				MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "1"
			}else{
				$(obj).parent().attr('class','el-switch')
				MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "0"
			}
	}
	}
	function select_authtype_select(band, auth_val){
		if(typeof(auth_val) == "undefined"){
			auth_val = $('#authtype_'+band+'g').val()
		}else{
			$('#authtype_'+band+'g').val(auth_val)
		}
		
		if(auth_val=='open'){
			//$('#div_encryptype_select').hide()
			$('#div_ssidpwd'+band).hide()
		}else{
			if (auth_val=='mixed2'){
				$('#encryptype_'+band+'g').val("aes+tkip") 
			}else
				$('#encryptype_'+band+'g').val('aes')  
			//$('#div_encryptype_select').show()
			
			$('#div_ssidpwd'+band).show()
		}
	}

	function select_encrytype_select(band, encry_val){
		
		if(typeof(encry_val) == "undefined"){
			encry_val = $('#encryptype_'+band+'g_select').val()  
		}
	}

	function valid_ssid(band){
		var ssid_valid_result = validation_ssid($("#"+band+"g_ssid").val())

		if(ssid_valid_result == 1){
			warning_control('on','page',L.error_message.lang_ssid_empty_msg)
			return false;
		}else if(ssid_valid_result == 2) {
			warning_control('on','page',L.error_message.lang_ssid_overlength_msg)
			return false;
		}else if(ssid_valid_result == 3) {
			warning_control('on','page',L.error_message.lang_ssid_length_error_msg)
			return false;
		}else if(ssid_valid_result == 4) {
			warning_control('on','page',L.error_message.lang_ssid_front_end_space_error_msg)
			return false;
		}
		return true
	}
	function valid_key(band){
		var auth_type = $('#authtype_'+band+'g_select').val()
		var auth_key = $('#'+band+'g_wpa_key').val()
		if( auth_type != 'open' ){
			var key_valid_result = validation_key(auth_key)
			if(!key_valid_result){
				warning_control('on','page',L.error_message.lang_wpa_key_ascii_format_error_msg)
				return false
			}
		}
		return true
	}
	function page_save(){
		warning_control('off','page')
		
		if ($("#single_ssid_enable").val() == 1){
			if(!valid_ssid('common') || !valid_key('common') )
				return false;
		}else{
			if(!valid_ssid('2') || !valid_ssid('5') || !valid_ssid('6'))
				return false;
			if(!valid_key('2') || !valid_key('5') || !valid_key('6'))
				return false;
		}

		$("#loading_message").html("Synchronize setting...")
		
		loading_control(1);
		
		var mesh_obj = MODIFIED_OBJ_DATA.Mesh.MeshP
		var wlan_obj = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT
		var wlan_global_obj = MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP
		mesh_obj.Ssid2G = wlan_obj[0].Ssid = $("#2g_ssid").val()
		mesh_obj.Ssid5G = wlan_obj[4].Ssid = $("#5g_ssid").val()
		mesh_obj.Ssid6G = wlan_obj[8].Ssid = $("#6g_ssid").val()
		mesh_obj.Pwd2G = wlan_obj[0].Key = $("#2g_wpa_key").val()
		mesh_obj.Pwd5G = wlan_obj[4].Key = $("#5g_wpa_key").val()
		mesh_obj.Pwd6G = wlan_obj[8].Key = $("#6g_wpa_key").val()
		mesh_obj.AuthType2G = wlan_obj[0].AuthType = $("#authtype_2g").val()
		mesh_obj.AuthType5G = wlan_obj[4].AuthType = $("#authtype_5g").val()
		mesh_obj.AuthType6G = wlan_obj[8].AuthType = $("#authtype_6g").val()
		mesh_obj.EncrypType2G = wlan_obj[0].EncrypType = $("#encryptype_2g").val()
		mesh_obj.EncrypType5G = wlan_obj[4].EncrypType = $("#encryptype_5g").val()
		mesh_obj.EncrypType6G = wlan_obj[8].EncrypType = $("#encryptype_6g").val()
		
		wlan_global_obj.SingleSsidName = $("#commong_ssid").val()
		wlan_global_obj.SingleSsidKey = $("#commong_wpa_key").val()
		wlan_global_obj.SingleSsidAuthType = $("#authtype_commong").val()
		
		/*
		get_info_data(INFO_LIST)
		*/
		
		delete MODIFIED_OBJ_DATA.OpMode
		//delete MODIFIED_OBJ_DATA.Mesh

		set_obj_data(MODIFIED_OBJ_DATA)
		
	}
	function set_obj_success_cb(obj) {
		//show_alert(L.common.success_title, L.common.save_success);
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
		loading_wait_wireless_restart()
	}

	function set_obj_error_cb(obj) {
		loading_control(0)
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

	function add_node(){
		$.getScript( "/js/quicksetup.js" )
		.done(function( script, textStatus ) {
			var action = [];
			pop_dialog("quicksetup", action, "addNode_prepare()", "quicksetup");
		});	
	}

	function single_ssid_enable_handler(enabled){
		if( 'undefined' == typeof(enabled) ){
			enabled = $("#single_ssid_enable").val()
		}
		if (1 == enabled){
			$(".multi_ssid_zone").hide()
			$(".single_ssid_zone").show()
			$("#switch_MLO_enable").show()
		}else{
			$(".multi_ssid_zone").show()
			$(".single_ssid_zone").hide()
			$("#switch_MLO_enable").hide()
		}
		MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.SingleSsidEnable=enabled

		switcher_handler('single_ssid_enable',enabled)
	}

	function MLO_enable_handler(enabled){
		if( 'undefined' == typeof(enabled) ){
			enabled = $("#MLO_enable").val()
		}
		MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable=enabled

		switcher_handler('MLO_enable',enabled)
	}
