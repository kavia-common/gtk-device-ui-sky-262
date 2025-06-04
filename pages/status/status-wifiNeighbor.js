	page_tag='status-wifiNeighbor'
	$(document).ready(function(){
		$.lang_load("status_wifiNeighbor");
		page_initial();
	});

	function set_ui_init(band,obj) {
		if (typeof(obj) == "undefined")
			return;

		obj.forEach(function(element) {
			if(element.RadioBand != band || " " == element.Ssid)
				return;

			var ssid_conv = string_display_handler(element.Ssid)
			var wifi_mode = "AX"
			if ("11AXG" == element.WifiMode || "11AXA" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_ax
			else if ("11NG" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_bgn_mixed
			//else if ("11G" == element.WifiMode)
			//	wifi_mode = L.status_wifiNeighbor.lang_mode_bg_mixed
			else if ("11B" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_b_only
			else if ("11AC" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_anac_mixed
			else if ("11NA" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_an_mixed
			else if ("11A" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_a_only
			else if ("11N" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_n_only
			else if ("11G" == element.WifiMode)
				wifi_mode = L.status_wifiNeighbor.lang_mode_g_only

			if ( "open" == element.Security )
				wifi_security = "OPEN"
			else if( "wpa" == element.Security )
				wifi_security = "WPA PSK"
			else if( "wpa2" == element.Security )
				wifi_security = "WPA2 PSK"
			else if( "mixed2" == element.Security )
				wifi_security = "WPA2/WPA PSK"
			else if( "mixed3" == element.Security )
				wifi_security = "WPA3/WPA2 PSK"
			else if( "wpa3" == element.Security )
				wifi_security = "WPA3 PSK"
			else
				wifi_security = element.Security

			element.Ssid = ssid_conv
			element.WifiMode = wifi_mode
			element.Security = wifi_security
		});
		update_table('result_'+band+'g', obj, STATUS_WIFINEIGHBOR_COLUMNS_LIST_VALUE)
	}

	function _lock_scan(band,lock) {
		if (lock) {
			$('#scan_2g').attr("disabled", true);
			$('#scan_5g').attr("disabled", true);
            $('#scan_6g').attr("disabled", true);
		}
		else {
			$('#scan_2g').removeAttr("disabled");
			$('#scan_5g').removeAttr("disabled");
            $('#scan_6g').removeAttr("disabled");
		}
	}

	function start_scan(band) {
		loading_control(1);
		SCAN_TIMEOUT = 30;
		var band2_enable = ORIGINAL_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[0].Enabled;
		var band5_enable = ORIGINAL_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled;
        var band6_enable = ORIGINAL_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled;

		if ((band == '2' && band2_enable == '0') || (band == '5' && band5_enable == '0') || (band == '6' && band6_enable == '0')) {
			pop_alert_message(L.status_wifiNeighbor.lang_wifinb_band_disabled_error, "error");
			return;
		}

		_lock_scan(band,true);
		
		// draw_empty_table_td('result_'+band+'g');
		
		SCAN_CMD.WifiNeighbor.Band = band;
		set_info_data(SCAN_CMD, band);
	}

	function scrolled(block,I) {
		var val = I.scrollLeft;

		$('#'+block+'_header').scrollLeft(val);
	}

	/* ------- set Info Functions ------- */
	function set_info_success_2g_cb(obj) {
		get_info_data('2',INFO_LIST);
	}

	function set_info_error_2g_cb(obj) {
		_lock_scan('2',false);

		if (obj.api_return == 403) {
				logout('sto');
		}
	}

	function set_info_success_5g_cb(obj) {
		get_info_data('5',INFO_LIST);
	}
	function set_info_error_5g_cb(obj) {
		_lock_scan('5',false);

		if (obj.api_return == 403) {
			logout('sto');
		}
	}

    function set_info_success_6g_cb(obj) {
		get_info_data('6',INFO_LIST);
	}
	function set_info_error_6g_cb(obj) {
		_lock_scan('6',false);

		if (obj.api_return == 403) {
			logout('sto');
		}
	}

	function set_info_data(obj_content, action_band){
		var cb_success, cb_error;

		if (action_band == "2") {
			cb_success = set_info_success_2g_cb;
			cb_error   = set_info_error_2g_cb;
		}
		else if (action_band == "5") {
			cb_success = set_info_success_5g_cb;
			cb_error   = set_info_error_5g_cb;
		}
        else if (action_band == "6") {
			cb_success = set_info_success_6g_cb;
			cb_error   = set_info_error_6g_cb;
		}

		if(typeof(obj_content) == 'string')
			API.info.set(JSON.parse(obj_content), cb_success, cb_error);
		else if(typeof(obj_content) == 'object')
			API.info.set(obj_content, cb_success, cb_error);
	}

	/* ------- get Info Functions ------- */
	function get_info_error_2g_cb(obj) {
		loading_control(0);
		_lock_scan('2',false);

		if(obj.api_return == 403) {
			logout('sto');
		}
	}
	function get_info_error_5g_cb(obj) {
		loading_control(0);
		_lock_scan('5',false);

		if(obj.api_return == 403) {
			logout('sto');
		}
	}
    function get_info_error_6g_cb(obj) {
		loading_control(0);
		_lock_scan('6',false);

		if(obj.api_return == 403) {
			logout('sto');
		}
	}

	function get_info_success_2g_cb(obj) {
		var band='2';
		var data
		data = API.obj.copy(obj);
				
		if (data.WifiNeighbor.Status == "scanning" && SCAN_TIMEOUT > 0) {
			SCAN_TIMEOUT = SCAN_TIMEOUT - 1;
			setTimeout(function(){
				get_info_data('2',INFO_LIST)
			},1000);
			return;
		}else{
			_lock_scan(band,false);
			if (data.WifiNeighbor.Status == "Done") {
				set_ui_init(band, data.WifiNeighbor.Results);
			}
			loading_control(0);
		}		
	} 

	function get_info_success_5g_cb(obj) {
		var band='5';
		var data
		data = API.obj.copy(obj);
				
		if (data.WifiNeighbor.Status == "scanning" && SCAN_TIMEOUT > 0) {
			SCAN_TIMEOUT = SCAN_TIMEOUT - 1;
			setTimeout(function(){
				get_info_data('5',INFO_LIST)
			},1000);
			return;
		}else{
			_lock_scan(band,false);
			if (data.WifiNeighbor.Status == "Done") {
				set_ui_init(band, data.WifiNeighbor.Results);
			}
			loading_control(0);
		}	
	}

    function get_info_success_6g_cb(obj) {
		var band='6';
		var data
		data = API.obj.copy(obj);
				
		if (data.WifiNeighbor.Status == "scanning" && SCAN_TIMEOUT > 0) {
			SCAN_TIMEOUT = SCAN_TIMEOUT - 1;
			setTimeout(function(){
				get_info_data('6',INFO_LIST)
			},1000);
			return;
		}else{
			_lock_scan(band,false);
			if (data.WifiNeighbor.Status == "Done") {
				set_ui_init(band, data.WifiNeighbor.Results);
			}
			loading_control(0);
		}	
	}

	function get_info_data(band,info_list){
		if (band == '2')
			API.info.get(info_list, get_info_success_2g_cb, get_info_error_2g_cb); 
		else if (band == '5')
			API.info.get(info_list, get_info_success_5g_cb, get_info_error_5g_cb);
        else if (band == '6')
			API.info.get(info_list, get_info_success_6g_cb, get_info_error_6g_cb);
	}

	/* ------- get object Functions ------- */ 
	function get_obj_success_cb(obj) {
		ORIGINAL_OBJ_DATA = API.obj.copy(obj);
	}

	function get_obj_error_cb(obj) {
		if(obj.api_return == 403) {
			logout('sto');
		}
	}

	function get_obj_data(obj_list){
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
	}

	function page_initial(){
		get_obj_data(OBJ_LIST);
	}
