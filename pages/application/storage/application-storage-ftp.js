	page_tag='application-storage-ftp'
	lang_tag='application_storage_ftp'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		switcher_handler('ftp_enable',MODIFIED_OBJ_DATA.Ftp.FtpP.Enable,"")
		
		$("#ftp_folder").val(MODIFIED_OBJ_DATA.Ftp.FtpP.RootDir)
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
		
		var folder_list_val = []
		var folder_list_str = []
		
		if (obj.StorageInfo.length == 0){
			switcher_handler('ftp_enable',"0","")
			update_select('ftp_folder', folder_list_str, folder_list_val,'', '');
			$('.folder_not_empty').hide()
		}else{
			obj.StorageInfo.forEach(function(element) {
				folder_list_val.push(element.Name)	
				folder_list_str.push(element.Name)
				
			});
			
			update_select('ftp_folder', folder_list_str, folder_list_val,'', '');
			$('.folder_not_empty').show()
			get_obj_data(OBJ_LIST) 	
		}
	} 
	function get_info_error_cb(obj) {
				
	}
	
	function get_storage_status(info){
		API.info.get(info, get_info_success_cb, get_info_error_cb);
	}
	
	function page_initial(){
		//Coding initial function here
		get_storage_status(INFO_LIST) 
	} 
	
	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}
		pop_alert_message(L.common.lang_success_msg,'success')
		
		page_initial()
	}
	function set_obj_error_cb(obj) {
		$("#loader").hide()
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
	function page_save(){
		MODIFIED_OBJ_DATA.Ftp.FtpP.Enable=$("#ftp_enable").val()
		MODIFIED_OBJ_DATA.Ftp.FtpP.RootDir=$("#ftp_folder").val()
		
		set_obj_data(MODIFIED_OBJ_DATA)
	}