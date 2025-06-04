	page_tag='application-dlna'
	lang_tag='application_dlna'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	
	var SHARE_MODE
	
	function share_mode_handler(mode){
		if ( 'undefined' == typeof(mode) )
			var mode=$("#upnp_share_type").val()

		SHARE_MODE = mode
		if( 'a' == mode ){
			$("#upnp_share_type").val('a')
			$('.share_custom_enabled_show').hide()
		}
		else if ( 'c' == mode ){
			$("#upnp_share_type").val('c')
			$('.share_custom_enabled_show').show()
		}
	} 
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		switcher_handler('dlna_enable',MODIFIED_OBJ_DATA.Dlna.DlnaP.Enable,"dlna_enable_handler('"+MODIFIED_OBJ_DATA.Dlna.DlnaP.Enable+"')")
		
		$("#upnp_custom_path").val(MODIFIED_OBJ_DATA.Dlna.DlnaP.CustomFolder)
		
		if ( '1' == MODIFIED_OBJ_DATA.Dlna.DlnaP.CustomFolderEnable )
			share_mode_handler('c')
		else
			share_mode_handler('a')
			
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

	function dlna_enable_handler(enable){
		if( 'undefined' == typeof(enable) ){
			enable = $("#dlna_enable").val()
		}
			
		if( "0" == enable){
			$(".dlna_emabled_show").hide()
		}else{
			$(".dlna_emabled_show").show()
		}
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
		MODIFIED_OBJ_DATA.Dlna.DlnaP.Enable=$("#dlna_enable").val()
		if (SHARE_MODE == 'a')
			MODIFIED_OBJ_DATA.Dlna.DlnaP.CustomFolderEnable="0"
		else
			MODIFIED_OBJ_DATA.Dlna.DlnaP.CustomFolderEnable="1"
		MODIFIED_OBJ_DATA.Dlna.DlnaP.CustomFolder=$("#upnp_custom_path").val()
		
		
		set_obj_data(MODIFIED_OBJ_DATA)
	}