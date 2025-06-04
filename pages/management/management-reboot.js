	page_tag='management-reboot'
	$(document).ready(function(){
		$.lang_load("management_reboot");
		page_initial();
	});
	function auto_reboot_enable_control(enabled){
		if ( 'undefined' == typeof(enabled) )
			var enabled=$("#auto_reboot_update").val()
		$("#auto_reboot_update").val(enabled)
		if(enabled=='1'){                                                                                                        
			$(".auto_reboot_zone").show()
			auto_reboot_select()
		}else{
			$(".auto_reboot_zone").hide()
			$(".auto_reboot_bootup_zone").hide()
			$(".auto_reboot_ntp_zone").hide()
		}
	}
	function auto_reboot_select(mode){
		if ( 'undefined' == typeof(mode) )
			var mode=$("#auto_reboot").val()
		
		$("#auto_reboot").val(mode)
		
		if( "bootup" == mode ){
			$(".auto_reboot_bootup_zone").show()
			$(".auto_reboot_ntp_zone").hide()
		}else if( "ntp" == mode ){
			$(".auto_reboot_ntp_zone").show()
			$(".auto_reboot_bootup_zone").hide()
		}
	}

	function set_ui_init() {
		$('#rb_date').attr("placeholder",L.management_reboot.lang_reboot_input_date_title)
	}

	function reboot_clicked() {
		set_info_data(REBOOT_CMD);
	}

	function set_info_success_cb(obj) {
		loading_control(1);
		setTimeout("reboot_back_checker();", 80000);
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

 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		switcher_handler('auto_reboot_update',MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.Enabled)
		auto_reboot_select(MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.Type)
		
		$("#auto_reboot_ntp_hour").val(MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.NtpHour)
		$("#auto_reboot_ntp_min").val(MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.NtpMinute)
		$("#auto_reboot_bootup_day").val(MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.BootupDay)
		$("#auto_reboot_bootup_hour").val(MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.BootupHour)
	
		var enabled=$("#auto_reboot_update").val()
		if(enabled=='1'){                                                                                                        
			$(".auto_reboot_zone").show()
			auto_reboot_select()
		}else{
			$(".auto_reboot_zone").hide()
			$(".auto_reboot_bootup_zone").hide()
			$(".auto_reboot_ntp_zone").hide()
		}
	} 
 	function get_obj_error_cb(obj) { 
		
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST);
		set_ui_init();
	} 
	
	function set_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
			get_obj_data(OBJ_LIST);
		},8000);
	}
	
	function set_obj_error_cb(obj) {
		loading_control(0);
		if (obj.api_return == 403) {
			logout('sto');
		}
	}
	
	function set_obj_data(obj_content){
		if(typeof(obj_content) == 'string')
			API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object')
			API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}
	
	function page_save(){

		MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.Enabled=$("#auto_reboot_update").val()
		MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.Type=$("#auto_reboot").val()
		
		$("#loading_message").html("")
		
		if( "ntp" == $("#auto_reboot").val() ){
			MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.NtpEverydayEnabled="1"
			MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.NtpHour=$("#auto_reboot_ntp_hour").val()
			MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.NtpMinute=$("#auto_reboot_ntp_min").val()
		}
		else{
			if($("#auto_reboot_bootup_day").val() == '0' && $("#auto_reboot_bootup_hour").val()=='0'){
				alert(L.management_reboot.lang_autoreboot_bootup_ivalid_time_msg)
				return;
			}
			if( "bootup" == $("#auto_reboot").val() && "1" == $("#auto_reboot_update").val() ){
				$("#loading_message").html(L.management_reboot.lang_autoreboot_bootup_tip)
			}
			MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.NtpEverydayEnabled="0"
			MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.BootupDay=$("#auto_reboot_bootup_day").val()
			MODIFIED_OBJ_DATA.AutoReboot.AutoRebootP.BootupHour=$("#auto_reboot_bootup_hour").val()
		}
				
		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA)

	}
