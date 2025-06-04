	page_tag='basic_setting-nat-alg'
	lang_tag='basic_setting_nat_alg'
	
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		switcher_handler('l2tp_pth',MODIFIED_OBJ_DATA.Alg.AlgP.L2tpPassthrough)
		switcher_handler('pptp_pth',MODIFIED_OBJ_DATA.Alg.AlgP.PptpPassthrough)
		switcher_handler('ipsec_pth',MODIFIED_OBJ_DATA.Alg.AlgP.IpsecPassthrough)
		
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
		setTimeout(function () {
			loading_control(0);
			pop_alert_message(L.common.lang_success_msg,'success')
			get_obj_data(OBJ_LIST)
		},3000);
	}
	function set_obj_error_cb(obj) {
		loading_control(0);
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
		
		MODIFIED_OBJ_DATA.Alg.AlgP.L2tpPassthrough = $("#l2tp_pth").val()
		MODIFIED_OBJ_DATA.Alg.AlgP.PptpPassthrough = $("#pptp_pth").val()
		MODIFIED_OBJ_DATA.Alg.AlgP.IpsecPassthrough = $("#ipsec_pth").val()

		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA)
	}