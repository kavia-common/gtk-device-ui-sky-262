	page_tag='management-settings-backup'
	$(document).ready(function(){
		$.lang_load("management_settings_backup");
		page_initial()
	}); 
	function callback(){
	
	} 
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
	} 
 	function get_obj_error_cb(obj) { 
		
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		//get_obj_data(OBJ_LIST) 
	}
	function backup_config(){
		API.cgi.download("backup_config");
	}
	
	function validation_file_name(f_name) {
		var file_type = f_name.substr(f_name.length - 4 , f_name.length).toLowerCase();

		if(file_type == '.bin') {
			return true;
		} else {
			return false;
		}
	}
	
	function check_upload_file(){
		var file_name = $("#restore_file_path").val().replace("C:\\fakepath\\",'');;
		$("#config_filename").html("file name:"+file_name)
		if (typeof(file_name) == "undefined" || file_name == "") {
			alert(L.management_settings_backup.lang_file_null_msg);
			//alert("Please select a settings file for restore.");
			return;
		} else if (validation_file_name(file_name) != true){
			alert(L.management_settings_backup.lang_file_error_msg);
			//alert("That file didn't work. Please try a different file.");
		} 
	}
    
	function upload_config_file() {
		loading_control(1)
		$.ajaxFileUpload({
			url:"cgi-bin/upload_config.cgi",
			secureuri:false,
			fileElementId:'restore_file_path',
			dataType: 'text',
			success: function (data, status){
				var splitdata = data.split("{");
				var splitdata2 = splitdata[1].split("</pre>");
				var current_data = "{"+ splitdata2[0];
				var obj_result = jQuery.parseJSON(current_data);

				if (obj_result.result == "success") {
					upload_config_process();
				} else {
					loading_control(0)
					alert(L.management_settings_backup.lang_restore_fail_msg);
					//alert("We couldn't restore your settings.");
				}
			}
		})
	}

	function upload_config_process() {
		var estr = '{}';

		$.ajax({
				type: "POST",
				url: "cgi-bin/upgrade_config.cgi",
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
					reboot_back_checker()
				},30000)
			}else{
					loading_control(0)
					alert(L.management_settings_backup.lang_restore_fail_msg);
					//alert("We couldn't restore your settings.");
			}
		};
	}