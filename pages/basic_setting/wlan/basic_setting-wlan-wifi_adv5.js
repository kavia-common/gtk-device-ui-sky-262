	page_tag='basic_setting-wlan-wifi_adv5'
	$(document).ready(function(){
		$.lang_load("basic_setting_wlan_wifi_adv5");
		page_initial()
	}); 
	function callback(){
	
	} 
	var current_idx=0;
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
	
	function select_ssid_select(){
		
	}
	
	function select_encryptype_select(){
		
	}
	
	function select_wifi_mode_select(){
		
	}

	function select_wifi_bw_select(){
		var ch = $("#wifi_channel_select").val();
		var bw = $("#wifi_bw_select").val()

		$("#wifi_channel_select option[value='165']").remove();

		if (bw == "20only")
			$("#wifi_channel_select").append('<option value="165">165</option>');

		if (ch == "165") {
			if (bw == "20only")
				$("#wifi_channel_select").val("165");
			else
				$("#wifi_channel_select").val("auto");
		}
	}

	function select_wifi_channel_select(){
		
	}
	
	
	function switch_style(obj,val){

			// $(obj).parent().attr('class','el-radio__input is-checked')

			// if(obj.id=="tr_enable")
					// $("#tr_disable").parent().attr('class','el-radio__input')
			// else if(obj.id=="tr_disable")
					// $("#tr_enable").parent().attr('class','el-radio__input')
			// if(obj.id=="info_enable")
					// $("#info_disable").parent().attr('class','el-radio__input')
			// else if(obj.id=="info_disable")
					// $("#info_enable").parent().attr('class','el-radio__input')
			// if(obj.id=="stun_enable")
					// $("#stun_disable").parent().attr('class','el-radio__input')
			// else if(obj.id=="stun_disable")
					// $("#stun_enable").parent().attr('class','el-radio__input')
	}
	function layout_init(){
		//alert(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanP.Ssid);
		// for(var i=0 ; i< MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT.length;i++){
			
			
		// }
		//alert(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT.length);
		change_ssid_idx(1);

	}
	
	function change_ssid_idx(idx){
		current_idx= idx;
		$("#wifi_mode_select").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].WifiMode)
		$("#wifi_bw_select").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].Bw)
		$("#wifi_channel_select").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].Channel)
		$("#id_maxclients").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].MaxClients)

		select_wifi_bw_select();
		
//		$("#2g_ssid").val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].Ssid);
		if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].ShortGI=="1"){
			switch_toggle($("#short_gi_btn"),"1");
		}else{
			switch_toggle($("#short_gi_btn"),"0");
		}
		
		if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].Wmm=="1"){
			switch_toggle($("#wmm_btn"),"1");
		}else{
			switch_toggle($("#wmm_btn"),"0");
		}
		
		if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].Atf=="1"){
			switch_toggle($("#atf_btn"),"1");
		}else{
			switch_toggle($("#atf_btn"),"0");
		}
		
		if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].Txbf=="1"){
			switch_toggle($("#txbf_btn"),"1");
		}else{
			switch_toggle($("#txbf_btn"),"0");
		}
	}
	function page_save(){
		if(valid_range($("#id_maxclients")[0], 1, 128, "Port") != true)
			return false;
		loading_control(1);

		MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].WifiMode=$("#wifi_mode_select").val();
		MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Bw=$("#wifi_bw_select").val();
		MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Channel=$("#wifi_channel_select").val();
		MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].MaxClients=$("#id_maxclients").val();


		if($("#short_gi_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].ShortGI='1';
		else
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].ShortGI='0';
		
		if($("#wmm_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Wmm='1';
		else
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Wmm='0';
		
		if($("#atf_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Atf='1';
		else
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Atf='0';
		
		if($("#txbf_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Txbf='1';
		else
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[current_idx].Txbf='0';
		

		set_obj_data(MODIFIED_OBJ_DATA)
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
		layout_init();
		loading_control(0);
	} 
	
	function set_obj_success_cb(obj) {
		//show_alert(L.common.success_title, L.common.save_success);
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
		setTimeout(function(){
			loading_control(0)
		}, loading_time[0]);
	}
	
	function set_obj_error_cb(obj) {
		//show_alert(L.common.fail_title, L.common.save_fail)
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			pop_alert_message(L.common.lang_error_msg,'error')
		}
	}
	
 	function get_obj_error_cb(obj) { 
		
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST) 
	} 
