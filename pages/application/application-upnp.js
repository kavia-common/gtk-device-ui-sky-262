	page_tag='application-upnp'
	lang_tag='application_upnp'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	function callback(){
	
	} 
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);  
		
		draw_wan_list(MODIFIED_OBJ_DATA.Wan.WanT, 'upnp_wan',MODIFIED_OBJ_DATA.Upnp.UpnpP.ConnectionName)
		
		switcher_handler('upnp_enable',MODIFIED_OBJ_DATA.Upnp.UpnpP.Enable,"upnp_enable_handler('"+obj.Upnp.UpnpP.Enable+"')")
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
	
	function upnp_enable_handler(enable){
		if( 'undefined' == typeof(enable) ){
			enable = $("#upnp_enable").val()
		}
			
		if( "0" == enable){
			$(".upnp_emabled_show").hide()
		}else{
			$(".upnp_emabled_show").show()
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
		MODIFIED_OBJ_DATA.Upnp.UpnpP.Enable=$("#upnp_enable").val()
		MODIFIED_OBJ_DATA.Upnp.UpnpP.ConnectionName=$("#upnp_wan").val()
		
		delete MODIFIED_OBJ_DATA.Wan;
		
		set_obj_data(MODIFIED_OBJ_DATA)
	}
