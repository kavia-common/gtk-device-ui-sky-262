	page_tag='management-ntp'
	$(document).ready(function(){
		$.lang_load("management_ntp");
		page_initial();
	});

	function _tz2id_convertor() {
		var tz = get_browser_timezone();
		var tz_val = "";
		var match_tz = "";

		if (tz > 0)
			tz_val="utc_p_"+tz;
		else if (tz < 0)
			tz_val="utc_m_"+(tz*-1);
		else if (tz == 0)
			tz_val="gmt_m_"+tz;

		if ("utc_p_8" == tz_val && "tw" == get_browser_lang())
			match_tz = "utc_p_8-0_0_0_singapore";
		else if ("utc_p_8" == tz_val && "cn" == get_browser_lang())
			match_tz = "utc_p_8-0_0_0_china";
		else {
			var tz_list_length = timezone_val_list.length
			for (i=0; i < tz_list_length; i++) {
				if (timezone_val_list[i].indexOf(tz_val) != -1) {
					match_tz = timezone_val_list[i];
					break;
				}
			}
		}

		if ('undefined' == typeof(match_tz) || "" == match_tz)
			match_tz = timezone_val_list[0];

		return match_tz;
	}

	function set_ui_init(obj) {
		var i;

		if (obj.Zonename != "")
			$('#timezone').val(obj.Zonename);
		else
			$('#timezone').val(_tz2id_convertor());

		switcher_handler('auto_dst',obj.DstEnable);
		//switcher_handler('client_update',obj.EnableServer,'set_ntp_server_status()');
		switcher_handler('client_update',obj.Enable,'set_ntp_server_status()');

		for (i = 1; i <= 5; ++i) {
			$('#ntp_server'+i).val(eval('obj.Server'+i));
		}

		$('#ntp_server_interval').val(obj.Interval);
	}

	function set_ntp_server_status() {
		var st = $('#client_update').val();

		if (st == "0") {
			$('input[id^="ntp_server"]').attr("disabled",true);
			$('input[id^="ntp_server"]').parent('div.el-input').addClass("is-disabled");
		}
		else {
			$('input[id^="ntp_server"]').removeAttr("disabled");
			$('input[id^="ntp_server"]').parent('div.el-input').removeClass("is-disabled");
		}
	}

	function ntp_tz_selected(tz) {
		var tz_val, tz_datas;

		tz_datas = tz.split("_");
		//if (tz_datas[3] == "1") {
			// set DLS enable=1 , when supported DLS
		//	tz_val = tz_datas[0]+'_'+tz_datas[1]+'_'+tz_datas[2]+'_'+tz_datas[3]+'_'+'1'+'_'+tz_datas[5];
		//}
	}

	function ntp_applied() {
		page_save();
	}

	function ntp_refresh() {
		get_obj_data(OBJ_LIST);
	}

	function page_save() {
		var i;
		var obj = MODIFIED_OBJ_DATA.Ntp.NtpP;

		obj.Zonename = $('#timezone').val();
		obj.DstEnable = $('#auto_dst').val();
		obj.Enable = $('#client_update').val();
		//obj.EnableServer = $('#client_update').val();

		if($('#ntp_server_interval').val()>=300 && $('#ntp_server_interval').val()<=86400){
			obj.Interval = $('#ntp_server_interval').val();
		}else{
			window.alert(L.management_ntp.lang_ntp_interval_validation)
			return;
		}

		for (i = 1; i <= 5; ++i) {
			eval('ntp_server_content = $(\'#ntp_server'+i+'\').val();');

			if(ntp_server_content!= "" && !valid_url(ntp_server_content)){
				window.alert('Invalid NTP Server ( NTP Server'+i+')')
				return;
			}

			eval('obj.Server'+i+' = $(\'#ntp_server'+i+'\').val();');
		}

		obj.Interval = $('#ntp_server_interval').val();

		loading_control(1);

		set_obj_data(MODIFIED_OBJ_DATA);
	}

	function set_obj_success_cb(obj) {
                setTimeout(function () {
                        loading_control(0);
                },SAVE_NTP_WAITING_TIME);
        }
        function set_obj_error_cb(obj) {
                loading_control(0);

                if (obj.api_return == 403) {
                        logout('sto');
                }
        }
        function set_obj_data(obj_content){
                if(typeof(obj_content) == 'string')
                        API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
                else if(typeof(obj_content) == 'object')
                        API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
        }

 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);

		set_ui_init(MODIFIED_OBJ_DATA.Ntp.NtpP);
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
