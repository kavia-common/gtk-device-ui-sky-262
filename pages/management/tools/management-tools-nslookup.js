	page_tag='management-tools-nslookup'
	$(document).ready(function(){
		$.lang_load("management_tools_nslookup");
		page_initial();
	});

	function _update_nslookup_result(obj) {
		var content = $("#nslookup_result").html();

		for (i=0; i < obj.Nslookup.length; ++i) {
			if (obj.Nslookup[i] == "-1") {
				++empty_data_count;
				if (empty_data_count >= 3) {
					$('#nslookup_btn').removeClass("is-loading");
					timer_flag = false;
				}
				break;
			}

			empty_data_count = 0;

			content += obj.Nslookup[i]+'<br>';
		}

		clearTimeout(timer_id);

		$("#nslookup_result").html(content);
	}

	function _prepare_layout(obj) {
                nslookup_iface_str_list = [LAN_NAME]
                nslookup_iface_val_list = [LAN_NAME]

                obj.forEach(function(element) {
                        if (element.Enabled == "1") {
                                nslookup_iface_str_list.push(element.ConnectionName);
                                nslookup_iface_val_list.push(element.ConnectionName);
                        }
                });

               update_select("nslookup_iface", nslookup_iface_str_list, nslookup_iface_val_list,"", "a");
        }

	function set_ui_init(obj) {
		_prepare_layout(obj);
	}

	function valid_nslookup_ipurl(I,emptyOK) {
		var ip_proto = $('#nslookup_proto').val().toLowerCase();
		var ret = false;

		$('#nslookup_ipurl').closest('div.el-form-item').removeClass("is-success");
		$('#nslookup_ipurl').closest('div.el-form-item').removeClass("is-error");

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
			$('#nslookup_ipurl').closest('div.el-form-item').addClass("is-success");
			$('#nslookup_ipurl_error').css("display","none");
			$('#nslookup_ipurl6_error').css("display","none");
		}
		else {
			$('#nslookup_ipurl').closest('div.el-form-item').addClass("is-error");

			if (ip_proto == "ipv6") {
				$('#nslookup_ipurl_error').css("display","none");
				$('#nslookup_ipurl6_error').css("display","");
			}
			else {
				$('#nslookup_ipurl_error').css("display","");
				$('#nslookup_ipurl6_error').css("display","none");
			}
		}
		return ret;
	}

	function start_nslookup() {
		if (!valid_nslookup_ipurl($('#nslookup_ipurl')[0],false))
			return;

		NSLOOKUP_CMD.Nslookup.IpUrl = $('#nslookup_ipurl').val();
		NSLOOKUP_CMD.Nslookup.IpProtocolType = $('#nslookup_proto').val();
		NSLOOKUP_CMD.Nslookup.Interface = $('#nslookup_iface').val();
		set_info_data(NSLOOKUP_CMD);
	}

	function set_info_success_cb(obj) {
		$('#nslookup_result_panel').css("display","");

		empty_data_count = 0;
		timer_flag = true;
		TIMER_INTERVAL = SHORT_INTERVAL;

		$("#nslookup_result").html("");
		$('#nslookup_btn').addClass("is-loading");

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

		_update_nslookup_result(INFO_DATA);

		if (timer_flag)
			timer_id = setTimeout(get_info_data, TIMER_INTERVAL, INFO_LIST);
	} 
 	function get_info_error_cb(obj) {
		clearTimeout(timer_id);
		$('#nslookup_btn').removeClass("is-loading");

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
