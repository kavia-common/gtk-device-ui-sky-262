	page_tag='status-statistics'
	$(document).ready(function(){
		$.lang_load("status_statistics");
		page_initial();
	});

	function _prepare_layout(obj) {
		if (typeof(obj) == "undefined")
			return;

		// sort
		obj.Lan.sort(function(a, b) {
			var nameA = a.Port.toUpperCase();
			var nameB = b.Port.toUpperCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0;
		});

		obj.WlanDeviceSsid.sort(function(a, b) {
			var nameA = a.Port.toUpperCase();
			var nameB = b.Port.toUpperCase();
			if (nameA < nameB) {
					return -1;
			}
			if (nameA > nameB) {
					return 1;
			}
			return 0;
		});

		output_lan_list=[]
		obj.Lan.forEach(function(element) {
			if(G_ETH_PORT_LIST.indexOf(element.Port) > -1)
			output_lan_list.push(element)
		});
		// LAN
		update_table('lan_statistics_tbody', output_lan_list, STATUS_STATISTICS_COLUMNS_LIST_VALUE)

		// WLAN
		obj.WlanDeviceSsid.forEach(function(element) {
			if(element.Port == "2")
				element.Port = element.Port + ".4G"
			else
				element.Port = element.Port + "G"
		});
		update_table('wlan_statistics_tbody', obj.WlanDeviceSsid, STATUS_STATISTICS_COLUMNS_LIST_VALUE)
	}

	function set_ui_init(obj) {
		_prepare_layout(obj);
	}

 	function get_info_success_cb(obj) { 
		INFO_DATA = API.obj.copy(obj);
		set_ui_init(INFO_DATA.Statistics);
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
		get_info_data(INFO_LIST);
	} 
