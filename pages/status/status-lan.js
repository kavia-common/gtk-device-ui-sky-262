	page_tag='status-lan'
	$(document).ready(function(){
		$.lang_load("status_lan");
		page_initial();
	});

	function _prepare_layout(obj) {
		/* status_lan_host_table table */
		var tmp_obj = API.obj.copy(obj);
		var tmp_arr = [];
		tmp_arr.push(tmp_obj);
		update_table('status_lan_host_table', tmp_arr, STATUS_LAN_HOST_COLUMNS_LIST_VALUE)

		/* status_lan_table table */
		tmp_obj = API.obj.copy(obj.Lan);
		tmp_obj.forEach(function(element) {
			var st;
			var speed = '-';
			var duplex = '-';

			if (element.Status.toLowerCase() == "up") {
				st = L.status_lan.lang_status_up;

				if (element.Speed != "0")
					//speed = obj.Lan[i].Speed+'bps';
					speed = element.Speed;

				if (element.Duplex != "")
					duplex = eval('L.status_lan.lang_duplex_'+element.Duplex.toLowerCase());
			}
			else {
				st = L.status_lan.lang_status_down;
			}

			element.Interface = element.Interface.toUpperCase();
			element.Status = st;
			element.Speed = speed;
			element.Duplex = duplex;
		});

		update_table('status_lan_table', tmp_obj, STATUS_LAN_COLUMNS_LIST_VALUE)
	}

	function set_ui_init(obj) {
		var i;

		if (typeof(obj) == "undefined")
			return;

		_prepare_layout(obj);
	}

 	function get_info_success_cb(obj) { 
		INFO_DATA = API.obj.copy(obj); 

		loading_control(0);

		set_ui_init(INFO_DATA.LanStatus);
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
		loading_control(1);

		get_info_data(INFO_LIST);
	} 
