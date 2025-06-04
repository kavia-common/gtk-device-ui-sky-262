	page_tag='management-tools-traceroute'
	$(document).ready(function(){
		$.lang_load("management_tools_traceroute");
		page_initial();
	});

	function _update_traceroute_result(obj) {
		var content = $("#traceroute_result").html();

		for (i=0; i < obj.TraceRoute.length; ++i) {
			if (obj.TraceRoute[i] == "-1") {
				++empty_data_count;
				if (empty_data_count >= 10) {
					timer_flag = false;
					$('#traceroute_btn').removeClass("is-loading");
				}
				break;
			}

			empty_data_count = 0;

			content += obj.TraceRoute[i]+'<br>';
		}

		clearTimeout(timer_id);

		$('#traceroute_result').html(content);
	}

	function _prepare_layout(obj) {
                traceroute_iface_str_list = [LAN_NAME]
                traceroute_iface_val_list = [LAN_NAME]

                obj.forEach(function(element) {
                        if (element.Enabled == "1") {
                                traceroute_iface_str_list.push(element.ConnectionName);
                                traceroute_iface_val_list.push(element.ConnectionName);
                        }
                });

                update_select("traceroute_iface", traceroute_iface_str_list, traceroute_iface_val_list,"", "a");
        }

	function set_ui_init(obj) {
		_prepare_layout(obj);
	}

	function valid_traceroute_ipurl(I,emptyOK) {
		var ip_proto = $('#traceroute_proto').val().toLowerCase();
		var ret = false;

		$('#traceroute_ipurl').closest('div.el-form-item').removeClass("is-success");
		$('#traceroute_ipurl').closest('div.el-form-item').removeClass("is-error");

		if (emptyOK && I.value == "")
			ret = true;
		else if (ip_proto == "ipv4") {
			ret = ValidateIPaddress(I.value);

			if (!ret)
				ret = valid_url(I.value);
		}
		else if (ip_proto == "ipv6") {
			ret = valid_ipv6(I);

			if (!ret)
				ret = valid_url(I.value);
		}

		if (ret) {
			$('#traceroute_ipurl').closest('div.el-form-item').addClass("is-success");
			$('#traceroute_ipurl_error').css("display","none");
			$('#traceroute_ipurl6_error').css("display","none");
		}
		else {
			$('#traceroute_ipurl').closest('div.el-form-item').addClass("is-error");

			if (ip_proto == "ipv6") {
				$('#traceroute_ipurl_error').css("display","none");
				$('#traceroute_ipurl6_error').css("display","");
			}
			else {
				$('#traceroute_ipurl_error').css("display","");
				$('#traceroute_ipurl6_error').css("display","none");
			}
		}
		return ret;
	}

	function start_traceroute() {
		if (!valid_traceroute_ipurl($('#traceroute_ipurl')[0],false))
			return;

		TRACEROUTE_CMD.TraceRoute.IpUrl = $('#traceroute_ipurl').val();
		TRACEROUTE_CMD.TraceRoute.IpProtocolType = $('#traceroute_proto').val();
		TRACEROUTE_CMD.TraceRoute.Interface = $('#traceroute_iface').val();
		set_info_data(TRACEROUTE_CMD);
	}

	function set_info_success_cb(obj) {
		$('#traceroute_result_panel').css("display","");

		TIMER_INTERVAL = NORMAL_INTERVAL;
		empty_data_count = 0;
		timer_flag = true;

		$("#traceroute_result").html("");
		$('#traceroute_btn').addClass("is-loading");

		get_info_data(INFO_LIST);
	}
	function set_info_error_cb(obj) {
		if (obj.api_return == 403) {
			logout('sto');
		}
	}
	function set_info_data(obj_content){
		if(typeof(obj_content) == 'string')
			API.info.set(JSON.parse(obj_content), set_info_success_cb, set_info_error_cb);
		else if(typeof(obj_content) == 'object')
			API.info.set(obj_content, set_info_success_cb, set_info_error_cb);
	}

 	function get_info_success_cb(obj) {
		INFO_DATA = API.obj.copy(obj);

		_update_traceroute_result(INFO_DATA);

		if (timer_flag)
			timer_id = setTimeout(get_info_data, TIMER_INTERVAL, INFO_LIST);
	} 
 	function get_info_error_cb(obj) {
		$('#traceroute_btn').removeClass("is-loading");
		clearTimeout(timer_id);

		if (obj.api_return == 403) {
			logout('sto');
		}
	} 
	function get_info_data(info_list){ 
		API.info.get(info_list, get_info_success_cb, get_info_error_cb); 
	}

	function get_obj_success_cb(obj) {
                OBJ_DATA = API.obj.copy(obj);

                set_ui_init(OBJ_DATA.Wan.WanT);
        }
        function get_obj_error_cb(obj) {
                if (obj.api_return == 403) {
                        logout('sto');
                }
        }
        function get_obj_data(obj_list){
                API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
        } 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST);
	} 
