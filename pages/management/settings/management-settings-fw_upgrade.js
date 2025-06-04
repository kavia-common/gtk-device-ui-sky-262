	var PAGE_LOADER
	page_tag='management-settings-fw_upgrade'
	$(document).ready(function(){
		$.lang_load("management_settings_fw_upgrade");
		page_initial()
	}); 
	function get_fwinfo_success_cb(obj) {
		$("#current_fw_version").html(obj.DeviceInfo.FwVer)
		if ( "undefined" != typeof(obj.DeviceInfo.LastFwVer) && obj.DeviceInfo.LastFwVer != "" )
			$("#last_fw_version").html(obj.DeviceInfo.LastFwVer)
		else
			$("#last_fw_version").html("None")
	}
	function get_fwinfo_error_cb(obj) {
		if(obj.api_return == 403){
			logout('sto')
			return;
		}
	} 
	function get_fwinfo_version(){
		API.info.get('DeviceInfo', get_fwinfo_success_cb, get_fwinfo_error_cb, 30000); 
	}
	function page_initial(){
		get_obj_data(OBJ_LIST)
		get_fwinfo_version()
		check_fw_version()
	}
	function check_upload_file(){
		
		var file_name = $("#filename").val().replace("C:\\fakepath\\",'');

		if (typeof(file_name) == "undefined" || file_name == "") {
			alert(L.management_settings_fw_upgrade.lang_file_empty_msg);
			//alert("Please select a file to update.");
			return;
		} else {
			if(validation_file_name(file_name) != true) {
				alert(L.management_settings_fw_upgrade.lang_file_format_msg);
				//alert("The file you chose doesn't work.");
				//$("#manual_file_info_tr").show()
				//$("#manual_select_file_tr").show()
				//$("#manual_start_upgrade_tr").hide()
			} else {
				$("#manual_fw_filename").html(file_name)
				//$("#manual_file_info_tr").show()
				//$("#manual_select_file_tr").hide()
				//$("#manual_start_upgrade_tr").show()
			}
		}
	}

	function validation_file_name(f_name) {
		var file_type = f_name.substr(f_name.length - 4 , f_name.length).toLowerCase();

		if(file_type == '.bin' || file_type == '.img') {
			return true;
		} else {
			return false;
		}
	}

	function clean_fw_path(){
		$("#filename").val('')
		//$("#manual_fw_filename").html('')
		//$("#manual_file_info_tr").hide()
		//$("#manual_select_file_tr").show()
		//$("#manual_start_upgrade_tr").hide()
	}


	function upload_fw_file() {
		loading_control(1)

		$.ajaxFileUpload({
			url:"cgi-bin/upload_fw.cgi",
			secureuri:false,
			fileElementId:'filename',
			dataType: 'text',
			success: function (data, status){
				var splitdata = data.split("{");
				var splitdata2 = splitdata[1].split("</pre>");
				var current_data = "{"+ splitdata2[0];
				var obj_result = jQuery.parseJSON(current_data);

				if (obj_result.result == "success") {
					upgrade_fw_process();
				} else {
					clean_fw_path()
					loading_control(0)
					alert(L.management_settings_fw_upgrade.lang_file_upgrade_fail_msg)
					//alert("Firmware update failed");
				}
			}
		})
	}
	function upgrade_fw_process() {
		var estr = '{}';

		$.ajax({
			type: "POST",
			url: "cgi-bin/upgrade_fw.cgi",
			data: estr,
			dataType : "text",
			cache: false,
			timeout: 5000,
			async:  false,
			beforeSend: onSend,
			success: onSuccess,
			complete: onComplete,
			error: onError
		});
		function onSend(){};
		function onComplete(){};
		function onError(){};
		function onSuccess(data, status){
			var success = data.search("success");
			var time_out = data.search("timeout");
			if(success != -1){
				setTimeout(function(){
					$("#loading_message").html(L.management_settings_fw_upgrade.lang_upgrade_donot_reboot_tip+"<br/>0%")
					$("#manual_file_info_tr").hide()
					process_percentage=0
					reflash_process_bar('manual')
					setTimeout(function(){
						reboot_back_checker()
					},180000)
				},1000)
			}else{	
				clean_fw_path()
				loading_control(-1)
				alert(L.management_settings_fw_upgrade.lang_file_upgrade_fail_msg)
				//alert("Firmware update failed");
			}

		};
	}
	var process_percentage = 0
	var bar_timer
	function reflash_process_bar(mode){
		/*if( 'ota' == mode ){
				$('#ota_upgrade_process_zone').html(process_bar_content);
		}else if( 'manual' == mode ){
				$('#manual_upgrade_process_zone').html(process_bar_content);
		}*/

		bar_timer = setInterval(function(){
		process_percentage = process_percentage + 2
		$("#loading_message").html(L.management_settings_fw_upgrade.lang_upgrade_donot_reboot_tip+"<br/>"+process_percentage+"%")
		//$("#fw_upgrade_percent_bar").css("width", process_percentage+"%");
		//$("#fw_upgrade_percent_msg").html(process_percentage+"%")
		if( 100 == process_percentage ){
			clearInterval(bar_timer)
			$("#loading_message").html(L.common.lang_rebooting)
			
		}
		},2000);
	}

	//ota
	function upgrade_success_cb(obj) {
		if(obj.api_return != 0){
			upgrade_error_cb(obj)
			return;
		}
		
		//process_percentage=0
		//reflash_process_bar('ota')
		setTimeout(function(){
			reboot_back_checker()
		},180000 )
	}

	function upgrade_error_cb(obj) {
		$('#loader').hide();
		loading_control(-1)
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			alert(L.management_settings_fw_upgrade.lang_file_upgrade_fail_msg)
		}
	}

	function ota_upgrade_fw(){
		loading_control(0)
		var fw_data = {"CheckFW":{"version":INFO_DATA.CheckFW.version, "status":"1"}}
		API.info.set(fw_data, upgrade_success_cb, upgrade_error_cb);
	}

	function get_fwv_success_cb(obj) {
		loading_control(-1)
		if(obj.api_return != 0){
			get_fwv_error_cb(obj)
			return;
		}
		
		INFO_DATA = API.obj.copy(obj);
		
		if( "0" != INFO_DATA.CheckFW.status){
			$("#fw_checking_zone").hide()
			$("#fw_upgrade_zone").show()
			$("#newer_fw_version").html(INFO_DATA.CheckFW.version)
			$("#new_firmware_zone").show()
		}else{
			$("#fw_checking_zone").hide()
			$("#new_firmware_zone").hide()
			$("#fw_uptodate_zone").show()
		}
	} 
	function get_fwv_error_cb(obj) {
		loading_control(-1)
		if(obj.api_return == 403){
			logout('sto')
			return;
		}
		$("#fw_checking_zone").hide()
		$("#fw_uptodate_zone").show()
	} 

	function check_fw_version(){
		loading_control(0)
		$("#loading_message").html(L.management_settings_fw_upgrade.lang_ota_checking_msg)
		$("#fw_checking_zone").show()
		API.info.get('CheckFW', get_fwv_success_cb, get_fwv_error_cb, 30000); 
	}

	function auto_upgrade(auto){
		var  need_save=false
		if ( 'undefined' == typeof(auto) ){
			var auto=$("#auto_upgrade").val()
			need_save=true
		}
				
		$("#auto_upgrade").val(auto)
		
		MODIFIED_OBJ_DATA.FwControl.FwControlP.FwAutoUpgrade = auto
		
		if(need_save)
			page_save()
	}

	function get_obj_success_cb(obj) { 
		if(obj.api_return != 0){
			get_obj_error_cb(obj)
			return;
		}
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		switcher_handler('auto_upgrade',MODIFIED_OBJ_DATA.FwControl.FwControlP.FwAutoUpgrade)
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

	function set_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
		},2000);
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
		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA)
	}
