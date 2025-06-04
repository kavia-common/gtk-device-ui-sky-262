	page_tag='application-multicast-igmp'
	lang_tag="application_multicast_igmp"
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	function switch_version(target){
		if ( "IGMPv3" == target ){
			MODIFIED_OBJ_DATA.Multicast.MulticastP.IgmpVersion="IGMPv3"
			$("#IGMPv3").prop("checked", true);
		}			
		else if ( "IGMPv2" == target ){
			MODIFIED_OBJ_DATA.Multicast.MulticastP.IgmpVersion="IGMPv2"
			$("#IGMPv2").prop("checked", true);
		}
	} 
	function igmp_pc_enable_switched() {
		var igmp_pc_enable = $('#igmp_pc_enabled').val();

		if (igmp_pc_enable == '1') {
			$(".igmp_version_emabled_show").show();
		}
		else {
			$(".igmp_version_emabled_show").hide()
		}
	}

 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		switcher_handler('igmp_sp_enabled',MODIFIED_OBJ_DATA.Multicast.MulticastP.IgmpSnooping)
		switcher_handler('mld_sp_enabled',MODIFIED_OBJ_DATA.Multicast.MulticastP.MldSnooping)
		switcher_handler('igmp_pc_enabled',MODIFIED_OBJ_DATA.Multicast.MulticastP.IgmpEnable, "igmp_pc_enable_switched()")
		switcher_handler('mld_pc_enabled',MODIFIED_OBJ_DATA.Multicast.MulticastP.MldEnable)
		switch_version(MODIFIED_OBJ_DATA.Multicast.MulticastP.IgmpVersion)
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
		pop_alert_message('success','success')
		
		get_obj_data(OBJ_LIST)
	}
	function set_obj_error_cb(obj) {
		$("#loader").hide()
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			pop_alert_message('Error','error')
		}
	}
	function set_obj_data(obj_content){
		if(typeof(obj_content) == 'string')
			API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object')
			API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}
	function page_save(){
				
		MODIFIED_OBJ_DATA.Multicast.MulticastP.IgmpSnooping = $("#igmp_sp_enabled").val()
		MODIFIED_OBJ_DATA.Multicast.MulticastP.MldSnooping = $("#mld_sp_enabled").val()
		MODIFIED_OBJ_DATA.Multicast.MulticastP.IgmpEnable = $("#igmp_pc_enabled").val()
		MODIFIED_OBJ_DATA.Multicast.MulticastP.MldEnable = $("#mld_pc_enabled").val()

		set_obj_data(MODIFIED_OBJ_DATA)
	}
