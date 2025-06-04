	page_tag='basic_setting-wlan-wifi_adv2'
	$(document).ready(function(){
		$.lang_load("basic_setting_wlan_wifi_adv2");
		page_initial()
	}); 
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

	function init_wifi_mode_select(band) {
		var selectedMode = $("#wifi_mode_select" + band).val();
		if (selectedMode == "bg" || selectedMode == "b") {
		$("#wifi_bw_select" + band).find("option[value='mixed']").hide();
		$("#wifi_bw_select" + band).find("option[value='40only']").hide();
		$("#wifi_bw_select" + band).find("option[value='20only']").show();
		}
		}
		
	function SSID_enable_handler2(enabled){
	if( 'undefined' == typeof(enabled) ){
	enabled = $("#SSID_enable2").val()
	}
	switcher_handler('SSID_enable2',enabled)
	}

	function SSID_enable_handler5(enabled){
		if( 'undefined' == typeof(enabled) ){
		enabled = $("#SSID_enable5").val()
		}
		switcher_handler('SSID_enable5',enabled)
	}


	function SSID_enable_handler6(enabled){
		if( 'undefined' == typeof(enabled) ){
		enabled = $("#SSID_enable6").val()
		}
		switcher_handler('SSID_enable6',enabled)
	}

	function select_ssid_select(){
		
	}

	function select_encryptype_select(){
		
	}

	function select_wifi_mode_select(band){
		
	}

	function select_wifi_bw_select(){
		
	}

	function select_wifi_channel_select(){
		
		var ch = document.getElementById("wifi_channel_select6");
		var bw = document.getElementById("wifi_bw_select6")
		var value = ch.options[ch.selectedIndex].value;

		if (value == 233){ /* channel 233 */
			bw.options[0].disabled = true; /* 20 / 40 / 80 / 160 / 320MHz */
			bw.options[1].disabled = true; /* 20 / 40 / 80 / 160 MHz */
			bw.options[2].disabled = true; /* 20 / 40 / 80 MHz */
			bw.options[3].disabled = true; /* 20 / 40 MHz */

			if (bw.selectedIndex == 0 || bw.selectedIndex == 1 || bw.selectedIndex == 2 || bw.selectedIndex == 3){ /* only remain 20 MHz */
				bw.selectedIndex = 4; /* 20 MHz */
			}
		}
		else if (value == 229 || value == 225){
			bw.options[0].disabled = true;
			bw.options[1].disabled = true;
			bw.options[2].disabled = true;
			bw.options[3].disabled = false;

			if (bw.selectedIndex == 0 || bw.selectedIndex == 1 || bw.selectedIndex == 2){ /* remain to 20 / 40 MHz */
				bw.selectedIndex = 3; /* 20 / 40 MHz */
			}
		}
		else {
			bw.options[0].disabled = false;
			bw.options[1].disabled = false;
			bw.options[2].disabled = false;
			bw.options[3].disabled = false;
		}
	}

	function layout_init(){
		var target_band
		if ( 0 == MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[0].Enabled){
			$("#SSID_enable2").parent("div").removeClass("is-checked");
		}
		if ( 0 == MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled){
			$("#SSID_enable5").parent("div").removeClass("is-checked");
		}
		if ( 0 == MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled){
			$("#SSID_enable6").parent("div").removeClass("is-checked");
		}
		SSID_enable_handler2(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[0].Enabled)
		SSID_enable_handler5(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled)
		SSID_enable_handler6(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled)
		for(var i=0 ; i< MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT.length;i++){
			target_band=MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].RadioBand
			$("#wifi_mode_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].WifiMode)
			$("#wifi_bw_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Bw)
			$("#wifi_channel_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Channel)
			//$("#id_maxclients"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].MaxClients)
			
			init_wifi_mode_select(target_band);
			
			/*
			if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].ShortGI=="1"){
				switch_toggle($("#short_gi_btn"+target_band),"1");
			}else{
				switch_toggle($("#short_gi_btn"+target_band),"0");
			}
			
			if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Wmm=="1"){
				switch_toggle($("#wmm_btn"+target_band),"1");
			}else{
				switch_toggle($("#wmm_btn"+target_band),"0");
			}
			
			if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Atf=="1"){
				switch_toggle($("#atf_btn"+target_band),"1");
			}else{
				switch_toggle($("#atf_btn"+target_band),"0");
			}
			
			if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Txbf=="1"){
				switch_toggle($("#txbf_btn"+target_band),"1");
			}else{
				switch_toggle($("#txbf_btn"+target_band),"0");
			}
			*/
		}
	}

	function change_ssid_idx(idx){
		current_idx= idx;
				
		$("#wifi_mode_select").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].WifiMode)
		$("#wifi_bw_select").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].Bw)
		$("#wifi_channel_select").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].Channel)
		//$("#id_maxclients").val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[idx].MaxClients)
		
	//		$("#2g_ssid").val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].Ssid);
		
	}

	function Mesh_and_MLO_confirmed(){
		close_confirm()
		MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable='0'
		MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = '0'
		loading_control(1)
		set_obj_data(MODIFIED_OBJ_DATA);
	}

	function page_save(){
		// if(valid_range($("#id_maxclients")[0], 1, 128, "Port") != true)                                 
		// 	return false; 
		
		for(var i=0 ; i< MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT.length;i++){
			target_band=MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].RadioBand
			
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].WifiMode=$("#wifi_mode_select"+target_band).val();
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Bw=$("#wifi_bw_select"+target_band).val();
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Channel=$("#wifi_channel_select"+target_band).val();
			//MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].MaxClients=$("#id_maxclients"+target_band).val();
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Enabled=$("#SSID_enable"+target_band).val();

			/*
			if($("#short_gi_btn"+target_band).parent().prop('class') == "el-switch is-checked")
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].ShortGI='1';
			else
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].ShortGI='0';
			
			if($("#wmm_btn"+target_band).parent().prop('class') == "el-switch is-checked")
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Wmm='1';
			else
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Wmm='0';
			
			if($("#atf_btn"+target_band).parent().prop('class') == "el-switch is-checked")
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Atf='1';
			else
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Atf='0';
			
			if($("#txbf_btn"+target_band).parent().prop('class') == "el-switch is-checked")
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Txbf='1';
			else
				MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Txbf='0';
			*/
		}
		if (
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[0].Enabled == 0 || 
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled == 0 || 
			MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled == 0
		) {
			pop_confirm(L.error_message.lang_error45_msg, Mesh_and_MLO_confirmed);
		}
		else{
			loading_control(1);
			set_obj_data(MODIFIED_OBJ_DATA)
		}	
	}
		
	function set_obj_data(obj_content){
		if(typeof(obj_content) == 'string')
		API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object')
		API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}

	function current_channel_layput(band, channel){
		$current = $( "<span><b>Current Channel:"+channel+"</b></span>" )
		$( "#select_wifi_channel_select"+band ).append( $current );
	}

	function get_info_success_cb(obj) {
		var data = API.obj.copy(obj);
		var checked = 0
		data.WlanStatus.forEach((row, index) => {
			if (checked == 1)
				return
			if(row.RadioBand != '5')
				return

			if ( 'undefined' != typeof(row.Channel) ){
				current_channel_layput('5',row.Channel)
				checked = 1
			}
		});
		
	}

	function get_info_error_cb(obj) {
		if(obj.api_return == 403) {
			logout('sto');
		}
	}

	function getWlanStatus(){
		API.info.get(INFO_LIST, get_info_success_cb, get_info_error_cb);
	}

	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
		getWlanStatus()
		layout_init();
		loading_control(0);
	} 

	function set_obj_success_cb(obj) {
		//show_alert(L.common.success_title, L.common.save_success);
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
		loading_wait_wireless_restart()
	}

	function set_obj_error_cb(obj) {
		//show_alert(L.common.fail_title, L.common.save_fail)
		loading_control(0)
		alert("set fail");
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