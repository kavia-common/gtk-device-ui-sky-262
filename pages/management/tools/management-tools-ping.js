	page_tag='management-tools-ping'
	$(document).ready(function(){
		$.lang_load("management_tools_ping");
		page_initial();
	});

	function _update_ping_result(obj) {
		var content = $("#ping_result").html();

		for (i=0; i < obj.PingTest.length; ++i) {
			if (obj.PingTest[i] == "-1") {
				++empty_data_count;
				if (empty_data_count >= 3) {
					$('#ping_btn').removeClass("is-loading");
					timer_flag = false;
				}
				TIMER_INTERVAL = NORMAL_INTERVAL;
				break;
			}
			else if (obj.PingTest[i].indexOf("ping statistics") != -1) {
				is_summary = true;
				TIMER_INTERVAL = SHORT_INTERVAL;
			}
			else if (is_summary == false)
				TIMER_INTERVAL = NORMAL_INTERVAL;

			empty_data_count = 0;

			content += obj.PingTest[i]+'<br>';
		}

		clearTimeout(timer_id);

		$('#ping_result').html(content);
	}

	function _prepare_layout(obj) {
		ping_iface_str_list = [LAN_NAME]
		ping_iface_val_list = [LAN_NAME]

		obj.forEach(function(element) {
			if (element.Enabled == "1") {
	                        ping_iface_str_list.push(element.ConnectionName);
        	                ping_iface_val_list.push(element.ConnectionName);
			}
		});

		update_select("ping_iface", ping_iface_str_list, ping_iface_val_list,"", "a")
	}

	function set_ui_init(obj) {
		$('#ping_times').val("1");
		$('#ping_times').attr("placeholder", "(1~3)"+L.management_tools_ping.lang_ping_times_msg);

		_prepare_layout(obj);
	}

	function valid_ping_times(I,emptyOK) {
		var ret = false;

		$('#ping_times').closest('div.el-form-item').removeClass("is-success");
		$('#ping_times').closest('div.el-form-item').removeClass("is-error");

		if (emptyOK && I.value == "")
			ret = true;
		else if (/^\+?[0-9][\d]*$/.test(I.value) == false)
			ret = false;
		else if (I.value > 3 || I.value < 1)
			ret = false;
		else
			ret = true;

		if (ret) {
			$('#ping_times').closest('div.el-form-item').addClass("is-success");
			$('#ping_times_error').css("display","none");
		}
		else {
			$('#ping_times').closest('div.el-form-item').addClass("is-error");
			$('#ping_times_error').css("display","");
		}
		return ret;
	}

	function valid_ping_ipurl(I,emptyOK) {
		var ip_proto = $('#ping_proto').val().toLowerCase();
		var ret = false;

		$('#ping_ipurl').closest('div.el-form-item').removeClass("is-success");
                $('#ping_ipurl').closest('div.el-form-item').removeClass("is-error");

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
                        $('#ping_ipurl').closest('div.el-form-item').addClass("is-success");
			$('#ping_ipurl_error').css("display","none");
			$('#ping_ipurl6_error').css("display","none");
		}
                else {
                        $('#ping_ipurl').closest('div.el-form-item').addClass("is-error");

			if (ip_proto == "ipv6") {
	                        $('#ping_ipurl6_error').css("display","");
				$('#ping_ipurl_error').css("display","none");
			}
			else {
				$('#ping_ipurl6_error').css("display","none");
				$('#ping_ipurl_error').css("display","");
			}
                }
                return ret;
	}

	function start_ping() {
		if (!valid_ping_times($('#ping_times')[0],false))
			return;

		if (!valid_ping_ipurl($('#ping_ipurl')[0],false))
			return;

		PING_CMD.PingTest.IpUrl = $('#ping_ipurl').val();
		PING_CMD.PingTest.Count = $('#ping_times').val();
		PING_CMD.PingTest.IpProtocolType = $('#ping_proto').val();
		PING_CMD.PingTest.Interface = $('#ping_iface').val();
		set_info_data(PING_CMD);
	}

	function set_info_success_cb(obj) {
		$('#ping_result_panel').css("display","");

		empty_data_count = 0;
                is_summary = false;
		TIMER_INTERVAL = NORMAL_INTERVAL;
                timer_flag = true;

		$("#ping_result").html("");
		$('#ping_btn').addClass("is-loading");

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

		_update_ping_result(INFO_DATA);

		if (timer_flag)
			timer_id = setTimeout(get_info_data, TIMER_INTERVAL, INFO_LIST);
	} 
 	function get_info_error_cb(obj) {
		$('#ping_btn').removeClass("is-loading");
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
