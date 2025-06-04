	page_tag='application-storage-samba'
	lang_tag='application_storage_samba'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
		
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		switcher_handler('samba_enable',MODIFIED_OBJ_DATA.Samba.SambaP.Enable,"")
		
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
	
	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}
		pop_alert_message(L.common.lang_success_msg,'success')
		
		get_obj_data(OBJ_LIST)
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
		MODIFIED_OBJ_DATA.Samba.SambaP.Enable=$("#samba_enable").val()
		
		set_obj_data(MODIFIED_OBJ_DATA)
	}