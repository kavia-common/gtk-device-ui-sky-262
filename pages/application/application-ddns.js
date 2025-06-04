	page_tag='application-ddns'
	lang_tag='application_ddns'
	
	var DDNS_STATUS = {}
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	function ddns_enable_handler(enable){
		var need_save = false
		if( 'undefined' == typeof(enable) ){
			enable = $("#ddns_enable").val()
			need_save = true
		}
		
		if( "0" == enable){
			$(".ddns_emabled_show").hide()
		}else{
			$(".ddns_emabled_show").show()
		}
		
		if(need_save)
			page_save()
	}
	
	function ddns_service_handler(id){
		provider = $("#"+id).val()

		if( "DynDNS.org" == provider ){
		}
		else if( "no-ip.com" == provider ){
		
		}
	}
	
	function ddns_list_layout(obj, status){
		if( 'undefined' == typeof(obj) || "" ==obj)
			obj = API.obj.copy(MODIFIED_OBJ_DATA); 
		
		if( 'undefined' == typeof(status) || "" ==status)
			status = API.obj.copy(DDNS_STATUS);
		
		var status_content = ""
		
		if ( "0" == status.status )
			status_content = L.application_ddns.lang_ddns_status_disabled
		else if( "1" == status.status )
			status_content = L.application_ddns.lang_ddns_status_success
		else if( "2" == status.status )
			status_content = L.application_ddns.lang_ddns_status_fail
		else if( "3" == status.status )
			status_content = L.application_ddns.lang_ddns_status_invalid_hostname
		else if( "4" == status.status )
			status_content = L.application_ddns.lang_ddns_status_connected
		else if( "5" == status.status )
			status_content = L.application_ddns.lang_ddns_status_no_internet
		else if( "6" == status.status )
			status_content = L.application_ddns.lang_ddns_status_complete
			
		/* var ddns_table_content=""
		
		ddns_table_content = ddns_table_content + '<tr>'
		ddns_table_content = ddns_table_content + '<td >'+obj.Hostname+'</td>'
		ddns_table_content = ddns_table_content + '<td >'+obj.Username+'</td>'
		ddns_table_content = ddns_table_content + '<td >'+status.ip+'</td>'
		ddns_table_content = ddns_table_content + '<td >'+status_content+'</td>'
		//ddns_table_content = ddns_table_content + '<td class="text-center"><button class="card-btn green" onclick="test_ddns()">Test</button></td>'
		 */

		obj.IP = status.ip
		obj.Status = status_content

		var obj_arr = []
		obj_arr.push(obj)
		update_table('ddns_table', obj_arr, APPLICATION_DDNS_COLUMNS_LIST_VALUE)
		loading_control(0);
	}
	
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		//test data start
		/*
		var test_data = {"enable":"1","username":"test","password":"test","hostname":"test","provider":"noip","system":"0","mailex":"test","backupmailex":"0","wildcard":"0","ip":"192.168.8.8","status":"connected"}
		
		MODIFIED_OBJ_DATA.Ddns.DdnsP = test_data
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA); 
		*/
		//test data end
		
		switcher_handler('ddns_enable',MODIFIED_OBJ_DATA.Ddns.DdnsP.Enable,"ddns_enable_handler('"+MODIFIED_OBJ_DATA.Ddns.DdnsP.Enable+"')")
		
		$("#ddns_service").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.Provider)
		$("#ddns_username").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.Username)
		$("#ddns_domainname").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.Hostname)
		$("#ddns_password").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.Password)
		$("#ddns_system").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.System)
		$("#ddns_mailex").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.Mailex)
		$("#ddns_backupmx").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.Backupmailex)
		$("#ddns_wildcard").val(MODIFIED_OBJ_DATA.Ddns.DdnsP.Wildcard)
				
		ddns_list_layout(MODIFIED_OBJ_DATA.Ddns.DdnsP, DDNS_STATUS)
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
		
		DDNS_STATUS = API.obj.copy(obj.DdnsStatus);
		
		get_obj_data(OBJ_LIST)
	} 
	function get_info_error_cb(obj) {
				
	}
	
	function get_ddns_status(info){
		API.info.get(info, get_info_success_cb, get_info_error_cb, 20000);
	}
	
	function page_initial(){
		//Coding initial function here
		loading_control(1);
		get_ddns_status(INFO_LIST)
	}
	
	function ddns_refresh(){
		get_ddns_status(INFO_LIST)
		loading_control(1);
		setTimeout("loading_control(0)",1500);
	}
	
	function ddns_apply(){
		
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Enable = $("#ddns_enable").val()
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Username = $("#ddns_username").val()
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Hostname = $("#ddns_domainname").val()
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Password = $("#ddns_password").val()		
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Provider = $("#ddns_service").val()
		MODIFIED_OBJ_DATA.Ddns.DdnsP.System = $("#ddns_system").val()
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Mailex = $("#ddns_mailex").val()
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Backupmailex = $("#ddns_backupmx").val()
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Wildcard = $("#ddns_wildcard").val()
		
		page_save()
	}
	
	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}
		pop_alert_message(L.common.lang_success_msg,'success')
		
		get_ddns_status(INFO_LIST)
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
		MODIFIED_OBJ_DATA.Ddns.DdnsP.Enable = $("#ddns_enable").val()
		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA)
	}
