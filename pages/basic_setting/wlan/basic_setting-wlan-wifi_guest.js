    page_tag='basic_setting-wlan-wifi_guest'
	$(document).ready(function(){
		$.when(
			$.lang_load("basic_setting_wlan_wifi_guest"),
			$.lang_load("basic_setting_wlan_wifi_basic2")
		 ).done(function(){
			page_initial()
		 })
	});
	
	function password_display_control(band){
		
		var x = document.getElementById("guest_password");
		if (x.type === "password") {
			$("#password_display").html(L.basic_setting_wlan_wifi_basic2.lang_hide_key)
			x.type = "text";
		} else {
			$("#password_display").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
			x.type = "password";
		}
	}
	
	function guest_onoff_control(enabled){
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
		MODIFIED_OBJ_DATA.Guest.GuestP.Enabled = enabled
	}
	
	function guest_hide_control(hide){
		if(typeof(hide) == "undefined"){
			if($('#guest_hide_btn').parent().prop('class') == "el-switch is-checked"){
				$('#guest_hide_btn').parent().attr('class','el-switch')
				hide = "1"
			}else{
				$('#guest_hide_btn').parent().attr('class','el-switch is-checked')
				hide = "0"
			}
		}else{
			if(hide == "0"){
				$('#guest_hide_btn').parent().attr('class','el-switch is-checked')
			}else{
				$('#guest_hide_btn').parent().attr('class','el-switch')
			}
		}
		MODIFIED_OBJ_DATA.Guest.GuestP.Hide = hide
	}
	
	function page_layout(obj){
		guest_onoff_control(obj.Guest.GuestP.Enabled)
		
		$("#guest_ssid_2").html(obj.Guest.GuestP.Ssid2)
		$("#guest_ssid_5").html(obj.Guest.GuestP.Ssid5)
		
		$("#guest_password").val(obj.Guest.GuestP.Password)
		$("#guest_allow_max_select").val(obj.Guest.GuestP.MaxClient)
		
		guest_hide_control(obj.Guest.GuestP.Hide)
	}
	
	function get_obj_success_cb(obj) {
		ORIGINAL_OBJ_DATA = API.obj.copy(obj);
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
		page_layout(MODIFIED_OBJ_DATA)
	}
	
	function get_obj_error_cb(obj) {
		if(obj.api_return == 403){
			logout('sto')
			return;
		}
	}
	
	function get_obj_data(obj_list){
			API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
	}
	function page_initial(){
		$("#password_display").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
		get_obj_data(OBJ_LIST)
	}
	
	function password_validation(password){
		if( ignoreSpaces(password) == "" || !check_contain_space(password)){
			alert(L.error_message.lang_error32_msg)
			return false
		}
		else
			return true
	}
	
	function page_save(){
		
		if(!password_validation($("#guest_password").val()))
			return false
		
		loading_control(1);
		
		MODIFIED_OBJ_DATA.Guest.GuestP.Password = $("#guest_password").val()
		MODIFIED_OBJ_DATA.Guest.GuestP.MaxClient = $("#guest_allow_max_select").val()
		
		set_obj_data(MODIFIED_OBJ_DATA)
		
	}
	function set_obj_success_cb(obj) {
		//show_alert(L.common.success_title, L.common.save_success);
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);

		setTimeout(function(){
				loading_control(0)
		}, 10000 );
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
