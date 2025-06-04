	page_tag='basic_setting-nat-portforward'
	land_tag='basic_setting_nat_portforward'
	var PFR_DATA
		
	$(document).ready(function(){
		$.lang_load(land_tag);
		page_initial()
	}); 
		
	function insert_pfr_item(item, origin_id){
		if(typeof(origin_id) != "undefined"){
			PFR_DATA[origin_id]=item
		}else{
			PFR_DATA.push(item)
		}
		pfr_table_layout()
	}
	function pfr_table_layout(){
		/* var prf_table_content=""
		var id = 0
		PFR_DATA.forEach(function(element) {
			number = id+1
			element.name = "pfr"+id;
			prf_table_content = prf_table_content + '<tr>'
			prf_table_content = prf_table_content + '<td >'+number+'</td>'
			prf_table_content = prf_table_content + '<td >'+element.Enable+'</td>'
			prf_table_content = prf_table_content + '<td >'+element.Comment+'</td>'
			//prf_table_content = prf_table_content + '<td >'+element.RemoteIp+'</td>'
			prf_table_content = prf_table_content + '<td >'+element.Protocol+'</td>'
			prf_table_content = prf_table_content + '<td >'+element.RemotePortStart+' - '+element.RemotePortEnd+'</td>'
			prf_table_content = prf_table_content + '<td >'+element.LocalPortStart+' - '+element.LocalPortEnd+'</td>'
			prf_table_content = prf_table_content + '<td >'+element.LocalIp+'</td>'
			prf_table_content = prf_table_content + '<td class="text-center"><a style="cursor: pointer;" onclick="update_pfr_item('+id+')"><img src="img/ic_edit_24px.png"></a><a style="cursor: pointer;" onclick="delete_pfr_item('+id+')"><img src="img/ic_delete_24px.png" ></a></td>'

			id++
		});
		if(id == 0)
			draw_empty_table_td('pfr_table')
		else
			$("#pfr_table").html(prf_table_content) */

		var id = 0
		PFR_DATA.forEach(function(element) {
			number = id+1
			element.name = "pfr"+id;
			element.Number = number
			element.RemotePort = element.RemotePortStart+' - '+element.RemotePortEnd
			element.LocalPort = element.LocalPortStart+' - '+element.LocalPortEnd
			element.TB_ACTION={"edit":"update_pfr_item("+id+")","delete":"delete_pfr_item("+id+")"}
			id++
		});

		update_table('pfr_table', PFR_DATA, BASIC_SETTING_NAT_PORT_FORWARDING_COLUMNS_LIST_VALUE)
	}
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		PFR_DATA=[];
		for(i=0;i<MODIFIED_OBJ_DATA.PortForward.PortForwardT.length;i++){
			insert_pfr_item(MODIFIED_OBJ_DATA.PortForward.PortForwardT[i]);
		}
		
		draw_wan_list(MODIFIED_OBJ_DATA.Wan.WanT, 'new_item_wan')
		
		pfr_table_layout()
		
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
	
	function update_pfr_item(item_id){
		action=[{"style":"default","text":"Cancel","action":"close_dialog()"},{"style":"primary","text":"Confirm","action":"save_pfr_item('"+item_id+"')"}]
		if( 'new' == item_id)
			pop_dialog('pfr',action, 'pfr_item_layout("new")', land_tag)
		else
			pop_dialog('pfr',action, "pfr_item_layout("+item_id+")", land_tag)
	}
	
	function delete_pfr_item(item_id){
		PFR_DATA.splice(item_id, 1);
		page_save()
	}
		
	function pfr_item_layout(id){
		if( 'undefined' != typeof(id) && 'undefined' != typeof(PFR_DATA[id]) ){
			switcher_handler('pfr_item_enable',PFR_DATA[id].Enable)
			$("#pfr_item_local_ipaddr").val(PFR_DATA[id].LocalIp)
			$("#pfr_item_local_ipaddr_start").val(PFR_DATA[id].LocalPortStart)
			$("#pfr_item_local_ipaddr_end").val(PFR_DATA[id].LocalPortEnd)
			//$("#pfr_item_remote_ipaddr").val(PFR_DATA[id].RemoteIp)
			$("#pfr_item_remote_ipaddr_start").val(PFR_DATA[id].RemotePortStart)
			$("#pfr_item_remote_ipaddr_end").val(PFR_DATA[id].RemotePortEnd)
			$("#pfr_item_remote_ipaddr_common").val(PFR_DATA[id].Comment)
			
			$("#pfr_item_proto").val(PFR_DATA[id].Protocol)
			
			draw_wan_list(MODIFIED_OBJ_DATA.Wan.WanT, 'pfr_item_wan', PFR_DATA[id].Interface)

		}else if( 'new' == id ){
			switcher_handler('pfr_item_enable',"1")
			draw_wan_list(MODIFIED_OBJ_DATA.Wan.WanT, 'pfr_item_wan', $("#new_item_wan").val())
		}		
	}
	function valid_value(){
		if(valid_range($("#pfr_item_local_ipaddr_start")[0], 1, 65535, "Port") != true){
			return false;
		}
		if(valid_range($("#pfr_item_local_ipaddr_end")[0], 1, 65535, "Port") != true){
			return false;
		}
		
		if(valid_range($("#pfr_item_remote_ipaddr_start")[0], 1, 65535, "Port") != true){
			return false;
		}
		if(valid_range($("#pfr_item_remote_ipaddr_end")[0], 1, 65535, "Port") != true){
			return false;
		}
		/*
		if(ValidateIPaddress($("#pfr_item_remote_ipaddr").val())!=true){
			alert(L.error_message.lang_error2_msg);
			return false;
		}
		*/
		
		if(ValidateIPaddress($("#pfr_item_local_ipaddr").val())!=true){
			alert(L.error_message.lang_error1_msg);
			return false;
		}
		
		var lan = MODIFIED_OBJ_DATA.Lan.LanP.IpAddress.split('.')
		var st = $("#pfr_item_local_ipaddr").val().split('.')
		if(lan[0]!=st[0] || lan[1] != st[1] || lan[2] != st[2]){
			alert(L.error_message.lang_error3_msg)
			return false;
		} 
		
		if(parseInt($("#pfr_item_local_ipaddr_start").val()) > parseInt($("#pfr_item_local_ipaddr_end").val())){
			alert(L.error_message.lang_error4_msg)
			return false;
		}
		if(parseInt($("#pfr_item_remote_ipaddr_start").val()) > parseInt($("#pfr_item_remote_ipaddr_end").val())){
			alert(L.error_message.lang_error5_msg)
			return false;
		}
		return true;
	}
	function save_pfr_item(id){
		if(valid_value()!=true)
			return false;
	
		var item={}
		item.Enable=$("#pfr_item_enable").val()
		item.LocalIp=$("#pfr_item_local_ipaddr").val()
		item.LocalPortStart=$("#pfr_item_local_ipaddr_start").val()
		item.LocalPortEnd=$("#pfr_item_local_ipaddr_end").val()
		//item.RemoteIp=$("#pfr_item_remote_ipaddr").val()
		item.RemotePortStart=$("#pfr_item_remote_ipaddr_start").val()
		item.RemotePortEnd=$("#pfr_item_remote_ipaddr_end").val()
		item.RemoteIp=""
		//item.RemotePortStart="0"
		//item.RemotePortEnd="0"
		item.Comment=$("#pfr_item_remote_ipaddr_common").val()
		item.Protocol=$("#pfr_item_proto").val()
		item.Interface=$("#pfr_item_wan").val()
		
		if('new' != id)
			insert_pfr_item(item, id)
		else{
			runtime_id=PFR_DATA.length
			item.name = "pfr"+runtime_id;
			insert_pfr_item(item)
		}
		close_dialog()
		
		page_save()
	}

	function set_obj_success_cb_post(){
		get_obj_data(OBJ_LIST)
	}
	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}

		if( "1" == ORIGINAL_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable){
            loading_time=page_loading_time.mlo_enabled.common
        }else{
            loading_time=page_loading_time.mlo_disabled.common
        }

		loading_wait_control(loading_time, "set_obj_success_cb_post()")
		
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
		MODIFIED_OBJ_DATA.PortForward.PortForwardT=PFR_DATA
		
		delete MODIFIED_OBJ_DATA.Wan;
		delete MODIFIED_OBJ_DATA.WlanGlobal;

		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA)
	}
	