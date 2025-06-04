	page_tag='status-dualImage'
	$(document).ready(function(){
		$.lang_load("status_dualImage");
		page_initial()
	});
	function get_info_success_cb(obj) {
		INFO_DATA = API.obj.copy(obj);
		page_init()
	}
	function get_info_error_cb(obj) {
		if(obj.api_return == 403) {
			logout('sto');
		}
	}
	function get_info_data(info_list){
		API.info.get(info_list, get_info_success_cb, get_info_error_cb);
	}
	function page_init(){
		$('#current').text(INFO_DATA.DualImage.boot)
		var TB_DATA = []
		TB_DATA.push({"partition_index": 1, "partition_version": (INFO_DATA.DualImage.p_1=="undefined")?" ":INFO_DATA.DualImage.p_1})
		TB_DATA.push({"partition_index": 2, "partition_version": (INFO_DATA.DualImage.p_2=="undefined")?" ":INFO_DATA.DualImage.p_2})
		update_table('tbody', TB_DATA, STATUS_DUALIMAGE_COLUMNS_LIST_VALUE)
	}
	function page_initial(){
		//Coding initial function here
		get_info_data(INF_LIST)
	} 
