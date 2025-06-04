page_tag='management-settings-reset_dafault'
	$(document).ready(function(){
		$.lang_load("management_settings_reset_dafault");
		page_initial()
	}); 
	function callback(){
	
	} 
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		LOGINIP = obj.LOGINIP;
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

	var redirect_timeout
	function get_redirect_url() {
		var is_local = check_local_user(LOGINIP, MODIFIED_OBJ_DATA.Lan.LanP.IpAddress, MODIFIED_OBJ_DATA.Lan.LanP.Netmask);

		if (!is_local)
			return (window.location.protocol+"//"+window.location.host+"/");

		if(ORIGINAL_OBJ_DATA.OpMode.OpModeP.Mode == 'mrt_untag' )
			return (window.location.protocol+"//192.168.10.1/");
		else
			return (window.location.protocol+"//192.168.1.1/");
	}
	function reset_success_cb(obj) {
		var url = get_redirect_url();

		if(obj.api_return != 0){
			reboot_error_cb(obj)
			return;
		}

		redirect_timeout = setTimeout(function () {
			window.location.href = url + "pre_out.html";
		}, REDIRECT_WAITING_TIME);
//		setTimeout(reboot_back_checker, 40000, url);
	}
	function reset_error_cb(obj) {
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			loading_control(0)
			alert(L.management_settings_reset_dafault.lang_restore_fail_msg);
			//alert("Factory reset failed");
			return;
		}
	}

    function reset_default_confirmed(){
        close_confirm()
        $("#loading_message").html(L.common.lang_rebooting)
        loading_control(1)
        var reset_data = {"DeviceReset":{"Action": "reset"}}
        API.info.set(reset_data, reset_success_cb, reset_error_cb);
    }

	function reset_default(){
        pop_confirm(L.management_settings_reset_dafault.lang_restore_confirm_msg,reset_default_confirmed)
	}