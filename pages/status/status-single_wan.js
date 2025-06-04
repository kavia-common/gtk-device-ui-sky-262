	page_tag='status-wan'
	lang_tag="status_wan"
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial();
	});

	function _prepare_layout(obj) {
		var content = "";
		var WAN_MAX = 6;

		// ipv4
		content = "";
		//for (i = 1; i <= obj.Ipv4.length; ++i) {
		for (i = 1; i <= 1; ++i) {
			if ((i%2) == 1)
				content += "<tr class=\"el-table__row\">";
			else
				content += "<tr class=\"el-table__row el-table__row--striped\">";

			content += "<td class=\"el-table_12_column_53\"><div class=\"cell\" id=\"ipv4conn_name"+i+"\"></div></td>";
			content += "<td class=\"el-table_12_column_54\"><div class=\"cell\" id=\"ipv4type"+i+"\"></div></td>";
			content += "<td class=\"el-table_12_column_55\"><div class=\"cell\" id=\"ipv4address"+i+"\"></div></td>";
			content += "<td class=\"el-table_12_column_56\"><div class=\"cell\" id=\"ipv4status"+i+"\"></div></td>";
			content += "<td class=\"el-table_12_column_57\"><div class=\"cell\"><button type=\"button\" class=\"el-button el-button--text el-button--small\" id=\"ipv4_more_btn"+i+"\" onclick=\"clicked('ipv4',"+i+")\"><span class=\"multi_lang\" id=\"lang_wan_st_more_title\">more</span></button></div></td>";
			content += "</tr>";
		}
		if (content == "")
			draw_empty_table_td('wan_ipv4_conn_st');
		else
			$('#wan_ipv4_conn_st').html(content);

		// ipv6
		content = "";
		//for (i = 1; i <= obj.Ipv6.length; ++i) {
		for (i = 1; i <= 1; ++i) {
			if ((i%2) == 1)
				content += "<tr class=\"el-table__row\">";
			else
				content += "<tr class=\"el-table__row el-table__row--striped\">";

                        content += "<td class=\"el-table_13_column_58\"><div class=\"cell\" id=\"ipv6conn_name"+i+"\"></div></td>";
                        content += "<td class=\"el-table_13_column_59\"><div class=\"cell\" id=\"ipv6type"+i+"\"></div></td>";
                        content += "<td class=\"el-table_13_column_60\"><div class=\"cell\" id=\"ipv6address"+i+"\"></div></td>";
                        content += "<td class=\"el-table_13_column_61\"><div class=\"cell\" id=\"ipv6status"+i+"\"></div></td>";
                        content += "<td class=\"el-table_13_column_62\"><div class=\"cell\"><button type=\"button\" class=\"el-button el-button--text el-button--small\" id=\"ipv6_more_btn"+i+"\" onclick=\"clicked('ipv6',"+i+")\"><span class=\"multi_lang\" id=\"lang_wan_st_more_title\">more</span></button></div></td>";
                        content += "</tr>";
		}
		if (content == "")
			draw_empty_table_td('wan_ipv6_conn_st');
		else
			$('#wan_ipv6_conn_st').html(content);
	}

	function set_ui_init(obj) {
		var i;
		var wan_ipv4_data4 = obj.Ipv4;
		var wan_ipv6_data6 = obj.Ipv6;

		//_prepare_layout(obj);

		i=1;
		keep_list_wan=true
		out_list = []
		wan_ipv4_data4.forEach(function(element) {
			if (keep_list_wan){
				element.TB_ACTION={"more":"clicked('ipv4',"+i+")"}
				out_list.push(element)
				i++
			}
			
			if ( G_MULTI_WAN_SUPPORTED == "0")
				keep_list_wan = false
		})

		update_table('status_wan_ipv4_table', out_list, STATUS_WAN_COLUMNS_LIST_VALUE);

		i=1;
		keep_list_wan=true
		out_list = []
		wan_ipv6_data6.forEach(function(element) {
			if (keep_list_wan){
				element.TB_ACTION={"more":"clicked('ipv6',"+i+")"}
				out_list.push(element)
				i++
			}
			
			if ( G_MULTI_WAN_SUPPORTED == "0")
				keep_list_wan = false
		})
		update_table('status_wan_ipv6_table', out_list, STATUS_WAN_COLUMNS_LIST_VALUE);
	}

	function set_dialog_init(diagdata) {
                var conn_st, ip_proto;

                if (typeof(diagdata) == 'undefined') {
                        close_dialog();
                        return;
                }

                conn_st = diagdata.ConnectStatus.toLowerCase();
                ip_proto = diagdata.IpProtocolType;

                $('.el-dialog__title').text(diagdata.ConnectionName);
                $('#conn_name_diag').text(diagdata.ConnectionName);
                $('#type_diag').text(diagdata.Type);
                $('#status_diag').text(eval("L.status_wan.lang_wan_st_"+conn_st));
                $('#ipaddress_diag').text("");
                $('#pd_diag').text("");
                $('#gateway_diag').text("");
                $('#dns1_diag').text("");
                $('#dns2_diag').text("");
                $('#prefix_diag').text("");
                $('#mask_diag').text("");
				
				if ("bridge" == diagdata.Type){
					$(".wan-bridge-hide").hide()
				}else{
					$(".wan-bridge-hide").show()
				}
				
                if (conn_st == "connected") {
					$('#ipaddress_diag').text(diagdata.IpAddress);
					$('#pd_diag').text(diagdata.PdAddress);
					$('#gateway_diag').text(diagdata.Gateway);
					$('#dns1_diag').text(diagdata.Dns1);
					$('#dns2_diag').text(diagdata.Dns2);

					if (ip_proto == "ipv6")
						$('#prefix_diag').text(diagdata.PrefixLen);
					else
						$('#mask_diag').text(diagdata.Netmask);
                }

		if (ip_proto == "ipv6") {
                        $('#mask_div').css('display',"none");
                        $('#prefix_div').css('display',"");
                        $('#pd_div').css('display',"");
                }
                else {
                        $('#mask_div').css('display',"");
                        $('#prefix_div').css('display',"none");
                        $('#pd_div').css('display',"none");
                }
        }

	function clicked(ip_proto, index) {
		var action = [{"style":"el-button el-button--primary","text":L.status_wan.lang_wan_st_confirm_title,"action":"close_dialog()"}];
		var obj = {};
		var idx = index-1;

		if (ip_proto == "ipv4")
			obj = INFO_DATA.WanStatus.Ipv4;
		else if(ip_proto == "ipv6")
			obj = INFO_DATA.WanStatus.Ipv6;
		else
			return;

		if (idx < 0 || idx >= obj.length)
			return;

		DIALOG_DATA = API.obj.copy(obj[idx]);
		pop_dialog("wan-more-info", action, "set_dialog_init(DIALOG_DATA);");
	}

	function scrolled(block,I) {
		var val = I.scrollLeft;

		$('#'+block+'_header').scrollLeft(val);
	}

 	function get_info_success_cb(obj) { 
		INFO_DATA = API.obj.copy(obj);

		set_ui_init(INFO_DATA.WanStatus);
		loading_control(0);
	} 
 	function get_info_error_cb(obj) {
		loading_control(0);
		if(obj.api_return == 403) {
                        logout('sto');
                }
	} 
	function get_info_data(info_list){ 
		API.info.get(info_list, get_info_success_cb, get_info_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		loading_control(1);
		get_info_data(INFO_LIST) 
	} 