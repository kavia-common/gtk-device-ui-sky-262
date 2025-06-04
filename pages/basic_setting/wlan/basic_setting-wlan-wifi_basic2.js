	page_tag='basic_setting-wlan-wifi_basic2'
	var WLAN_STATUS = {}
	$(document).ready(function(){
		$.lang_load("basic_setting_wlan_wifi_basic2");
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
	
	function select_authtype_select(){
		if($('#authtype_select').val()=='open'){
			$('#div_encryptype_select').hide()
			$('#div_ssidpwd').hide()
		}else{
			$('#div_encryptype_select').show()
			$('#div_ssidpwd').show()
		}
		if($('#authtype_select').val()=='mixed3' || $('#authtype_select').val()=='wpa3'  || $('#authtype_select').val()=='wpa2'){
                        $("#encryptype_select option[value='tkip']").remove();
			$("#encryptype_select").html('<option value="aes" selected="" class="multi_lang" id="">AES</option>');
                        select_encryptype_select()
                }else{ //mixed2
			$("#encryptype_select option[value='aes']").remove();
			$("#encryptype_select option[value='tkip']").remove();
			$("#encryptype_select").html('<option value="aes+tkip" selected="" class="multi_lang" id="">AES/TKIP</option>');
			select_encryptype_select()
                        //$("#encryptype_select").html('<option value="aes" selected="" class="multi_lang" id="lang_AES">AES</option><option value="tkip" class="multi_lang" id="lang_TKIP">TKIP</option>');
                }
	}
	function valid_ssid(){
		var ssid_valid_result = validation_ssid($("#2g_ssid").val())

		if(ssid_valid_result == 1){
			alert(L.error_message.lang_ssid_empty_msg)
			return false;
		}else if(ssid_valid_result == 2) {
			alert(L.error_message.lang_ssid_overlength_msg)
			return false;
		}else if(ssid_valid_result == 3) {
			alert(L.error_message.lang_ssid_length_error_msg)
			return false;
		}else if(ssid_valid_result == 4) {
			alert(L.error_message.lang_ssid_front_end_space_error_msg)
			return false;
		}
		return true
	}
	function valid_key(){
		var auth_type = $('#authtype_select').val()
		var auth_key = $('#wpa_key').val()
		if( auth_type != 'open' ){
			var key_valid_result = validation_key(auth_key)
			if(!key_valid_result){
				alert(L.error_message.lang_wpa_key_ascii_format_error_msg)
				return false
			}
		}
		return true
	}
	
	function layout_init(){
		$("#password_display").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
		change_ssid_idx(0);
	}
	
	function password_display_control(){
		var x = document.getElementById("wpa_key");
		if (x.type === "password") {
			$("#password_display").html(L.basic_setting_wlan_wifi_basic2.lang_hide_key)
			x.type = "text";
		} else {
			$("#password_display").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
			x.type = "password";
		}
	}
	
	function change_ssid_idx(idx){
		current_idx= idx;
		
		$("#2g_ssid").val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].Ssid);
		if(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].Enabled=="1"){
			switch_toggle($("#enable_wlan_2g_btn"),"1");
		}else{
			switch_toggle($("#enable_wlan_2g_btn"),"0");
		}
		if(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].Hidden=="1"){
			switch_toggle($("#hide_ssid_btn"),"1");
		}else{
			switch_toggle($("#hide_ssid_btn"),"0");
		}

		$("#wpa_key").val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].Key);

		$('#authtype_select').val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].AuthType);

		$('#encryptype_select').val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[idx].EncrypType);

		$("#wpa_key").val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].Key);
		
		$("#id_bssid").html(WLAN_STATUS[current_idx].Bssid);
		if($('#authtype_select').val()=='open'){
                        $('#div_encryptype_select').hide()
                        $('#div_ssidpwd').hide()
                }else{
                        $('#div_encryptype_select').show()
                        $('#div_ssidpwd').show()
                }
		if($('#authtype_select').val()=='mixed3' || $('#authtype_select').val()=='wpa3'  || $('#authtype_select').val()=='wpa2'){
                        $("#encryptype_select option[value='tkip']").remove();
			$("#encryptype_select").html('<option value="aes" selected="" class="multi_lang" id="">AES</option>');
                        select_encryptype_select()
                }else{ //mixed2
			$("#encryptype_select option[value='aes']").remove();
			$("#encryptype_select option[value='tkip']").remove();
			$("#encryptype_select").html('<option value="aes+tkip" selected="" class="multi_lang" id="">AES/TKIP</option>');
			select_encryptype_select()
                        //$("#encryptype_select").html('<option value="aes" selected="" class="multi_lang" id="lang_AES">AES</option><option value="tkip" class="multi_lang" id="lang_TKIP">TKIP</option>');
                }
	}
	function page_save(){
		
		if(!valid_ssid())
			return false;
		if(!valid_key())
			return false;
		loading_control(1);
		if($("#enable_wlan_2g_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].Enabled='1';
		else
			MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].Enabled='0';
		
		if($("#hide_ssid_btn").parent().prop('class') == "el-switch is-checked")
			MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].Hidden='1';
		else
			MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].Hidden='0';	
		MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].AuthType=$('#authtype_select').val()
		MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].EncrypType=$('#encryptype_select').val()
		MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].Ssid=$("#2g_ssid").val();
		MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[current_idx].Key=$("#wpa_key").val();
		
		//Sync Wlan config to Mesh obj
		MODIFIED_OBJ_DATA.Mesh.MeshP.Ssid2G = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[0].Ssid 
		MODIFIED_OBJ_DATA.Mesh.MeshP.Pwd2G = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[0].Key
		MODIFIED_OBJ_DATA.Mesh.MeshP.AuthType2G = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[0].AuthType
		MODIFIED_OBJ_DATA.Mesh.MeshP.EncrypType2G = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[0].EncrypType
		
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
		// loading_wait_300s()
		setTimeout("loading_control(0)",loading_time[0]);
	}
	
	function set_obj_error_cb(obj) {
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
	
	function get_info_success_cb(obj) {
		if(obj.api_return != 0){
			get_info_error_cb(obj)
			return;
		}
		WLAN_STATUS = API.obj.copy(obj.WlanStatus);
		get_obj_data(OBJ_LIST)
	} 
	function get_info_error_cb(obj) {
				
	}
	function get_wlan_status(info){
		API.info.get(info, get_info_success_cb, get_info_error_cb);
	}
	
	function page_initial(){
		//Coding initial function here
		get_wlan_status(INFO_LIST);
		//get_obj_data(OBJ_LIST) 
	}
