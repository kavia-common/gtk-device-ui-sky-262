	page_tag='basic_setting-seciruty-ipfilter'
	lang_tag='basic_setting_seciruty_ipfilter'
	var FILTER_DATA = []
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	});

	function obj_table_prepare(src_data, target_data, name_prefix, version){
		var id = 0
		src_data.forEach(function(element) {
			element.name = ""+name_prefix+id;
			element.version = version
			target_data.push(element)
			id++
		});
	}

	function filter_list_layout(){
		var filter_table_content=""
		var id = 0
		FILTER_DATA.forEach(function(element) {
			number = id+1
			element.Number=number
			element.TB_ACTION={"delete":"delete_filter_item("+id+")"}
			id++
		});
		update_table('ipfilter_table', FILTER_DATA, FILTER_COLUMNS_LIST_VALUE)

		/*
		FILTER_DATA.forEach(function(element) {
			number = id+1
						
			filter_table_content = filter_table_content + '<tr>'
			filter_table_content = filter_table_content + '<td >'+number+'</td>'
			filter_table_content = filter_table_content + '<td >'+element.LocalIpStart+'</td>'
			filter_table_content = filter_table_content + '<td >'+element.LocalIpEnd+'</td>'
			//filter_table_content = filter_table_content + '<td >'+element.DstIpStart+'</td>'
			//filter_table_content = filter_table_content + '<td >'+element.DstIpEnd+'</td>'
			if( "undefined" == typeof(ipfilter_proto_display) || ipfilter_proto_display == "1"  ){
				filter_table_content = filter_table_content + '<td class="ipfilter_proto_zone">'+element.Protocol+'</td>'
			}
			//filter_table_content = filter_table_content + '<td >'+element.Interface+'</td>'
			filter_table_content = filter_table_content + '<td >'+element.Comment+'</td>'
			filter_table_content = filter_table_content + '<td class="text-center"><a style="cursor: pointer;" onclick="delete_filter_item('+id+')"><img src="img/ic_delete_24px.png" ></a></td>'
			id++
		});
		
		if(id == 0)
			draw_empty_table_td('ipfilter_table')
		else
			$("#ipfilter_table").html(filter_table_content)
		*/
	}

	function ip_title_layout(version){
		if( '4' == version ){
			$("#ipfilter_mode_local_string").html(L.basic_setting_seciruty_ipfilter.lang_ipfilter_local_addr_v4)
			$("#ipfilter_mode_dest_string").html(L.basic_setting_seciruty_ipfilter.lang_ipfilter_dest_addr_v4)
		}else if('6' == version){
			$("#ipfilter_mode_local_string").html(L.basic_setting_seciruty_ipfilter.lang_ipfilter_local_addr_v6)
			$("#ipfilter_mode_dest_string").html(L.basic_setting_seciruty_ipfilter.lang_ipfilter_dest_addr_v6)
		}
			
	}
	function filter_mode_layout(mode){
		if(mode == 'b')
			$("#ipfilter_mode_title").html(L.basic_setting_seciruty_ipfilter.lang_ipfilter_current_blacklist_table)
		else
			$("#ipfilter_mode_title").html(L.basic_setting_seciruty_ipfilter.lang_ipfilter_current_whitelist_table)
	}

	var FILTER_DATA_SRC4
	var FILTER_DATA_SRC6
	var CURRENT_IP_VERSION
	var CURRENT_FILTER_MODE
	function filter_data_layout(filter_mode){
		CURRENT_FILTER_MODE = filter_mode
		
		if( 'blacklist' == filter_mode ){
			$("#ipfilter_blacklist").prop("checked", true);
			filter_mode_layout('b')
			
			FILTER_DATA_SRC4 = "IpFilter4Black"
			FILTER_DATA_SRC6 = "IpFilter6Black"
			
		}else if( 'whitelist' == filter_mode ){
			$("#ipfilter_whitelist").prop("checked", true);
			filter_mode_layout('w')
						
			FILTER_DATA_SRC4 = "IpFilter4White"
			FILTER_DATA_SRC6 = "IpFilter6White"
		}
				
		FILTER_DATA = []
				
		obj_table_prepare(eval('MODIFIED_OBJ_DATA.'+FILTER_DATA_SRC4+'.'+FILTER_DATA_SRC4+'T'), FILTER_DATA,'filter', 'ipv4')
		obj_table_prepare(eval('MODIFIED_OBJ_DATA.'+FILTER_DATA_SRC6+'.'+FILTER_DATA_SRC6+'T'), FILTER_DATA,'filter', 'ipv6')
		
		filter_list_layout()
	}

	function page_layout(obj){
		//draw_wan_list(obj.Wan.WanT, 'ipfilter_wan')

		switcher_handler('ipfilter_enable',obj.IpFilter.IpFilterP.Enable,"ipfilter_enable_handler('"+obj.IpFilter.IpFilterP.Enable+"')")
		
		var ip_version=obj.IpFilter.IpFilterP.IpVersion
		var filter_mode=obj.IpFilter.IpFilterP.Mode
		
		$("#mode_ipv4").prop("checked", true);
		ip_mode_selector('4')
		ip_title_layout('4')
		
		$('#ipfilter_local_ip_start').val("")                                
		$('#ipfilter_local_ip_end').val("")                                    
		//$('#ipfilter_dest_ip_start').val("")                                 
		//$('#ipfilter_dest_ip_end').val("")
		$("#ipfilter_comment").val("")
		
		if( "undefined" != typeof(ipfilter_proto_display) && ipfilter_proto_display == "0"  ){
			$("#ipfilter_proto").val("all")
			$(".ipfilter_proto_zone").hide()
		}else{
			$("#ipfilter_proto").val("both")
			$(".ipfilter_proto_zone").show()
		}
		
		filter_data_layout(filter_mode)		
	} 
	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
		
		//test data start
		/*				
		var test_data = {"Interface":"WAN3","Protocol":"tcp","DstIpStart":"10","DstIpEnd":"10","LocalIpStart":"10","LocalIpEnd":"10","Comment":"10"}
		var test_data2 = {"Interface":"WAN2","Protocol":"udp","DstIpStart":"90","DstIpEnd":"90","LocalIpStart":"90","LocalIpEnd":"90","Comment":"90"}
		
		MODIFIED_OBJ_DATA.IpFilter.IpFilterP.Enable="1"
		MODIFIED_OBJ_DATA.IpFilter.IpFilterP.IpVersion="ipv4"
		MODIFIED_OBJ_DATA.IpFilter.IpFilterP.Mode="blacklist"
		
		MODIFIED_OBJ_DATA.IpFilter4Black.IpFilter4BlackT[0]=test_data
		MODIFIED_OBJ_DATA.IpFilter4Black.IpFilter4BlackT[1]=test_data2
		*/		
		//test data end
		
		page_layout(MODIFIED_OBJ_DATA)
		
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
	function ipfilter_mode_selector(ipfilter_mode){
		if( 'b' ==  ipfilter_mode)
			CURRENT_FILTER_MODE = 'blacklist'
		else
			CURRENT_FILTER_MODE = 'whitelist'
			
		filter_mode_layout(ipfilter_mode)
		filter_data_layout(CURRENT_FILTER_MODE)
		
		//page_save()
	}

	function ip_mode_selector(ip){
		if( '4' ==  ip)
			CURRENT_IP_VERSION = 'ipv4'
		else
			CURRENT_IP_VERSION = 'ipv6'
		
		ip_title_layout(ip)
		//filter_data_layout(CURRENT_IP_VERSION, CURRENT_FILTER_MODE)
		
		//page_save()
	}

	function ipfilter_enable_handler(enable){
		var need_save = false
		if( 'undefined' == typeof(enable) ){
			enable = $("#ipfilter_enable").val()
			need_save = true
		}
			
		if( "0" == enable){
			$(".ipfilter_enabled_show").hide()
		}else{
			$(".ipfilter_enabled_show").show()
		}
		
		if(need_save)
			page_save()
	}

	function delete_filter_item(item_id){
		FILTER_DATA.splice(item_id, 1);
		
		var v4data = []
		var v6data = []
		
		FILTER_DATA.forEach(function(element) {
			if( "ipv6" == element.version ){
				v6data.push(element)
			}
			else if( "ipv4" == element.version ){
				v4data.push(element)
			}
		});
		
		if( 'blacklist' == CURRENT_FILTER_MODE ){
			MODIFIED_OBJ_DATA.IpFilter4Black.IpFilter4BlackT=v4data
			MODIFIED_OBJ_DATA.IpFilter6Black.IpFilter6BlackT=v6data
		}else if( 'whitelist' == CURRENT_FILTER_MODE ){
			$("#ipfilter_whitelist").prop("checked", true);
			MODIFIED_OBJ_DATA.IpFilter4White.IpFilter4WhiteT=v4data
			MODIFIED_OBJ_DATA.IpFilter6White.IpFilter6WhiteT=v6data
		}
		
		//filter_mode_layout(ipfilter_mode)
		filter_data_layout(CURRENT_FILTER_MODE)
		
		//page_save()
	}

	function valid_global_ip_rule(start, end){
		var st = start.split('.').map(function(item) { return parseInt(item, 10);});
		var dst = end.split('.').map(function(item) { return parseInt(item, 10);});
		if( (dst[0]>st[0]) || (dst[0]==st[0] && dst[1]>st[1]) || (dst[0]==st[0] && dst[1]==st[1] && dst[2]>st[2]) || (dst[0]==st[0] && dst[1]==st[1] && dst[2]==st[2] && dst[3]>=st[3]) ){
			return true
		}else{
			return false
		}
	}
	function valid_local_ip_rule(start, end){
		var lan = MODIFIED_OBJ_DATA.Lan.LanP.IpAddress.split('.').map(function(item) { return parseInt(item, 10);});
		var st = start.split('.').map(function(item) { return parseInt(item, 10);});
		var dst = end.split('.').map(function(item) { return parseInt(item, 10);});

		if(lan[0]!=st[0] || lan[1] != st[1] || lan[2] != st[2]){
			alert(L.error_message.lang_error3_msg);
			return false
		}
		if( (lan[0]==st[0] && lan[1] == st[1] && lan[2] == st[2]) && (lan[0] == dst[0] && lan[1] == dst[1] && lan[2] == dst[2]) && dst[3] >= st[3]){
			return true
		}else{
			alert(L.error_message.lang_error12_msg);
			return false
		}
	}
	function valid_ip_format(){

				var local_ip_start = $('#ipfilter_local_ip_start').val()                                
				var local_ip_end = $('#ipfilter_local_ip_end').val()                                    
				//var dst_ip_start = $('#ipfilter_dest_ip_start').val()                                 
				//var dst_ip_end = $('#ipfilter_dest_ip_end').val()

		if( 'ipv4' == CURRENT_IP_VERSION ){
			if(ValidateIPaddress(local_ip_start)!=true){
				alert(L.error_message.lang_error8_msg);
				return false;
			}
			if(ValidateIPaddress(local_ip_end)!=true){
				alert(L.error_message.lang_error9_msg);
				return false;
			}
			/*
			if(ValidateIPaddress(dst_ip_start)!=true){
				alert(L.error_message.lang_error10_msg);
				return false;
			}
			if(ValidateIPaddress(dst_ip_end)!=true){
				alert(L.error_message.lang_error11_msg);
				return false;
			}
			*/
			if(valid_local_ip_rule(local_ip_start, local_ip_end)!=true){
				return false;
			}
			/*
			if(valid_global_ip_rule(dst_ip_start, dst_ip_end)!=true){
				alert(L.error_message.lang_error13_msg);
				return false;
			}
			*/
			return true;
		}else{
			if(isIPv6(local_ip_start)!=true){
				alert(L.error_message.lang_error8_msg);
				return false;
			}
			if(isIPv6(local_ip_end)!=true){
				alert(L.error_message.lang_error9_msg);
				return false;
			}
			/*
			if(isIPv6(dst_ip_start)!=true){
				alert(L.error_message.lang_error10_msg);
				return false;
			}
			if(isIPv6(dst_ip_end)!=true){
				alert(L.error_message.lang_error11_msg);
				return false;
			}
			*/
			/*if(valid_local_ip_rule(local_ip_start, local_ip_end)!=true){
				alert("The local IP end num must be greater than or equal to the start num.")
				return false;
			}
			if(valid_global_ip_rule(dst_ip_start, dst_ip_end)!=true){
				alert("The destination IP end num must be greater than or equal to the start num.")
				return false;
			}*/
			return true;
		}
	}

    function valid_ip_range(start, end, exist_list){
        var st = start.split('.').map(function(item) { return parseInt(item, 10);});
		var dst = end.split('.').map(function(item) { return parseInt(item, 10);});
        var ret = true

        exist_list.forEach(function(rule) {
            rule_st = rule.LocalIpStart.split('.').map(function(item) { return parseInt(item, 10);});
            rule_dst = rule.LocalIpEnd.split('.').map(function(item) { return parseInt(item, 10);});
			if( (rule_st[3] < st[3] && rule_dst[3] > st[3] ) || (rule_st[3] < dst[3] && rule_dst[3] > dst[3] ) || (rule_st[3] == st[3] || rule_dst[3] == st[3] || rule_st[3] == dst[3] || rule_dst[3] == dst[3] ) ){
                alert('IP range repeat!');
                ret=false
            }
		});
        return ret
    }

	function add_ipfilter_item(){
		var item={}
		var local_ip_start = $('#ipfilter_local_ip_start').val()
		var local_ip_end = $('#ipfilter_local_ip_end').val()
		var dst_ip_start = $('#ipfilter_dest_ip_start').val()
		var dst_ip_end = $('#ipfilter_dest_ip_end').val()

		if(valid_ip_format()!=true){
			return false
		}

        var current_list = API.obj.copy(FILTER_DATA)
        if(valid_ip_range(local_ip_start, local_ip_end, current_list )!=true){
			return false
		}
        
		runtime_id=FILTER_DATA.length
		item.name = "dmz"+runtime_id;
		
		//item.Interface = $("#ipfilter_wan").val()
		item.Interface =""
		item.Protocol = $("#ipfilter_proto").val()
		//item.DstIpStart = $("#ipfilter_dest_ip_start").val()
		//item.DstIpEnd = $("#ipfilter_dest_ip_end").val()
		item.DstIpStart = ""
		item.DstIpEnd = ""
		item.LocalIpStart = $("#ipfilter_local_ip_start").val()
		item.LocalIpEnd = $("#ipfilter_local_ip_end").val()
		item.Comment = $("#ipfilter_comment").val()
		item.version = CURRENT_IP_VERSION
		
		FILTER_DATA.push(item)
		
		
		var v4data = []
		var v6data = []
		
		FILTER_DATA.forEach(function(element) {
			if( "ipv6" == element.version ){
				v6data.push(element)
			}
			else if( "ipv4" == element.version ){
				v4data.push(element)
			}
		});
		
		if( 'blacklist' == CURRENT_FILTER_MODE ){
			MODIFIED_OBJ_DATA.IpFilter4Black.IpFilter4BlackT=v4data
			MODIFIED_OBJ_DATA.IpFilter6Black.IpFilter6BlackT=v6data
		}else if( 'whitelist' == CURRENT_FILTER_MODE ){
			$("#ipfilter_whitelist").prop("checked", true);
			MODIFIED_OBJ_DATA.IpFilter4White.IpFilter4WhiteT=v4data
			MODIFIED_OBJ_DATA.IpFilter6White.IpFilter6WhiteT=v6data
		}
		
		//filter_mode_layout(ipfilter_mode)
		filter_data_layout(CURRENT_FILTER_MODE)
		
		//page_save()
	}

	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}
		setTimeout(function(){
			loading_control(0)
			pop_alert_message(L.common.lang_success_msg,'success')
			get_obj_data(OBJ_LIST)
		}, 5000);
	}
	function set_obj_error_cb(obj) {
		$("#loader").hide()
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			setTimeout(function(){
				loading_control(0)
				pop_alert_message(L.common.lang_error_msg,'error')
			}, 2000);
		}
	}
	function set_obj_data(obj_content){
		loading_control(1);

		if(typeof(obj_content) == 'string')
			API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object')
			API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}

	function save_mode(){
		page_save()
	}

	function page_save(){
		
		//if(CURRENT_FILTER_MODE == "whitelist" &&  !confirm(L.basic_setting_seciruty_ipfilter.lang_whitelist_save_confirm_msg))
		//	return;
		
		MODIFIED_OBJ_DATA.IpFilter.IpFilterP.Enable=$("#ipfilter_enable").val()
		MODIFIED_OBJ_DATA.IpFilter.IpFilterP.IpVersion=CURRENT_IP_VERSION
		MODIFIED_OBJ_DATA.IpFilter.IpFilterP.Mode=CURRENT_FILTER_MODE
		
		
		delete MODIFIED_OBJ_DATA.Wan;
		delete MODIFIED_OBJ_DATA.Lan;
		
		set_obj_data(MODIFIED_OBJ_DATA)
	}
	function isIPv6(value)
	{
		// See https://blogs.msdn.microsoft.com/oldnewthing/20060522-08/?p=31113 and
		// https://4sysops.com/archives/ipv6-tutorial-part-4-ipv6-address-syntax/
		const components = value.split(":");
		if (components.length < 2 || components.length > 8 || (components.length<=2 && components[0] == "" && components[1] == ""))
			return false;
		// if (components[0] !== "" || components[1] !== "")
		// {
		// 	// Address does not begin with a zero compression ("::")
		// 	if (!components[0].match(/^[\da-f]{1,4}/i))
		// 	{
		// 		// Component must contain 1-4 hex characters
		// 		return false;
		// 	}
		// }

		let numberOfZeroCompressions = 0;
		let contiZeroCompressions = 0;
		let middleCheck = 0;
		for (let i = 0; i < components.length; i++)
		{
			if (components[i] === "")
			{
				// We're inside a zero compression ("::")
				numberOfZeroCompressions++;
				contiZeroCompressions++;
				// m=middleCheck (???:???::???:???|m3:m3:m4:m5:m5) (::???:|m1:m1:m2:m1)
				if (middleCheck == 0){
					middleCheck = 1;
				}else if(middleCheck == 3){
					middleCheck = 4;
				}else if(middleCheck == 2){
					return false;
				}else if(middleCheck == 5){
					return false;
				}
				
				if (numberOfZeroCompressions > 1)
				{
					//example (::1234:5678)
					if (i < 2 && numberOfZeroCompressions==2){
						if(contiZeroCompressions == numberOfZeroCompressions){
							continue;
						}
					}
					//example (2001:db8::)
					else if (i > 1 && numberOfZeroCompressions==2){
						if(contiZeroCompressions == numberOfZeroCompressions){
							continue;
						}
					}
				// Zero compression can only occur once in an address
				return false;
				}
			continue;
			}
			contiZeroCompressions = 0;
			// m=middleCheck (???:???::???:???|m3:m3:m4:m5:m5) (::???:|m1:m1:m2:m1)
			if (middleCheck == 0){
				middleCheck = 3;
			}else if(middleCheck == 1){
				middleCheck = 2;
			}else if(middleCheck == 4){
				middleCheck = 5;
			}
			if (!components[i].match(/^[\da-f]{1,4}/i) || components[i].length != components[i].match(/^[\da-f]{1,4}/i)[0].length)
			{
			// Component must contain 1-4 hex characters
			return false;
			}
		}

		if(middleCheck == 5){
			if (numberOfZeroCompressions > 1){
				return false;
			}
		}else{
			if(numberOfZeroCompressions < 2  && components.length < 8){
				return false;
			}
		}
		return true;
	}