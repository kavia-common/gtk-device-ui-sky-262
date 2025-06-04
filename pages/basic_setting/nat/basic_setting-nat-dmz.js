	page_tag='basic_setting-nat-dmz'
	lang_tag='basic_setting_nat_dmz'
	var DMZ_DATA = []
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	function dmz_enable_handler(enable){
		var need_save = false
		if( 'undefined' == typeof(enable) ){
			enable = $("#dmz_enable").val()
			need_save = true
		}
			
		
		if( "0" == enable){
			$(".dmz_emabled_show").hide()
		}else{
			$(".dmz_emabled_show").show()
		}
		
		if(need_save)
			page_save()
	}
	
	function dmz_list_layout(){
		/* var dmz_table_content=""
		var id = 0
		DMZ_DATA.forEach(function(element) {
			number = id+1
			dmz_table_content = dmz_table_content + '<tr>'
			dmz_table_content = dmz_table_content + '<td >'+number+'</td>'
			dmz_table_content = dmz_table_content + '<td >'+element.DstIp+'</td>'
			dmz_table_content = dmz_table_content + '<td >'+element.Interface+'</td>'
			dmz_table_content = dmz_table_content + '<td class="text-center"><a style="cursor: pointer;" onclick="delete_dmz_item('+id+')"><img src="img/ic_delete_24px.png" ></a></td>'
			id++
		});
		
		if(id == 0)
			draw_empty_table_td('dmz_table')
		else
			$("#dmz_table").html(dmz_table_content) */

		var id = 0
		var obj = API.obj.copy(DMZ_DATA);
		obj.forEach(function(element) {
			number = id+1

			element.Number = number
			element.TB_ACTION={"delete":"delete_dmz_item("+id+")"}
			id++
		});

		update_table('dmz_table', obj, BASIC_SETTING_NAT_DMZ_COLUMNS_LIST_VALUE)
	}
	
	function obj_table_prepare(src_data, target_data){
		var id = 0
		src_data.forEach(function(element) {
			element.name = "dmz"+id;
			target_data.push(element)
			id++
		});
	}
	
	function page_layout(obj){
		get_client_list(INFO_LIST)
		switcher_handler('dmz_enable',obj.Dmz.DmzP.Enable,"dmz_enable_handler('"+obj.Dmz.DmzP.Enable+"')")
		draw_wan_list(obj.Wan.WanT, 'dmz_wan')
		
		update_select('dmz_host_list', [], [],'', '');
		//$("#dmz_host_ip").attr('disabled','disabled')
		
		DMZ_DATA = []
		obj_table_prepare(obj.DmzPolicy.DmzPolicyT, DMZ_DATA)
		dmz_list_layout()
	} 
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		//test data start
		/*
		var test_data = {"Interface":"WAN3","HostName":"test","DstIp":"192.168.1.1"}
		var test_data2 = {"Interface":"WAN4","HostName":"test2","DstIp":"192.168.2.1"}
		MODIFIED_OBJ_DATA.DmzPolicy.DmzPolicyT[0] = test_data
		MODIFIED_OBJ_DATA.DmzPolicy.DmzPolicyT[1] = test_data2
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA); 
		*/
		//test data end
		
		page_layout(MODIFIED_OBJ_DATA)
	} 
 	function get_obj_error_cb(obj) { 
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			pop_alert_message(L.common.lang_error_msg,'error')
		}
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST)
		
	}
	
	function host_selector(id){
		var index = $("#"+id).val()
		if ('none' != index)
			$("#dmz_host_ip").val(CLIENT_LIST[index-1].ip)
	}
	
	var CLIENT_LIST = []
	function get_info_success_cb(obj) {
		if(obj.api_return != 0){
			get_info_error_cb(obj)
			return;
		}
		
		var client_name_list_str = [""]
		var client_name_list_val = ["none"]
		var client_no = 1
		obj.DhcpClientT.Clients.forEach(function(element) {
			var client_item = {}

			client_item.name = element.HostName
			client_item.ip = element.IpAddress
			client_name_list_str.push(element.HostName)
			client_name_list_val.push(client_no)
			client_no++
			CLIENT_LIST.push(client_item)
		});
		
		update_select('dmz_host_list',client_name_list_str , client_name_list_val,'host_selector(this.id)', '');
		
	} 
	function get_info_error_cb(obj) {
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			pop_alert_message(L.common.lang_error_msg,'error')
		}
	}
	
	function get_client_list(info){
		API.info.get(info, get_info_success_cb, get_info_error_cb);
	}	
	
	function delete_dmz_item(item_id){
		DMZ_DATA.splice(item_id, 1);
		page_save()
	}
	
	function valid_value(){
		var i;

		if(ValidateIPaddress($("#dmz_host_ip").val())!=true){
			alert(L.error_message.lang_error16_msg);
			return false;
		}

		for (i = 0 ; i < DMZ_DATA.length; ++i) {
			if (DMZ_DATA[i].Interface == $("#dmz_wan").val()) {
				alert(L.error_message.lang_error35_msg);
				return false;
			}
		}

		return true;
	}

	function add_dmz_item(){
		if(valid_value()!=true)
			return false;

		var item={}
		runtime_id=DMZ_DATA.length
		item.name = "dmz"+runtime_id;
		item.Interface = $("#dmz_wan").val()
		item.HostName = 
		item.DstIp = $("#dmz_host_ip").val()
		
		DMZ_DATA.push(item)
		
		page_save()
	}
	
	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}
		setTimeout(function () {
			loading_control(0);
			pop_alert_message(L.common.lang_success_msg,'success')
			page_initial()
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
		MODIFIED_OBJ_DATA.Dmz.DmzP.Enable = $("#dmz_enable").val()
		MODIFIED_OBJ_DATA.DmzPolicy.DmzPolicyT=DMZ_DATA
		
		delete MODIFIED_OBJ_DATA.Wan;

		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA)
	}
