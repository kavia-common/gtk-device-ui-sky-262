	page_tag='application-storage-storage_info'
	lang_tag='application_storage_storage_info'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	function storage_info_layout(status_data){
		
		/* var storage_table_content=""
				
		status_data.forEach(function(element) {
			storage_table_content = storage_table_content + '<tr>'
			storage_table_content = storage_table_content + '<td >'+element.Name+'</td>'
			storage_table_content = storage_table_content + '<td >'+element.Size+'</td>'
			storage_table_content = storage_table_content + '<td >'+element.Available+'</td>'
			storage_table_content = storage_table_content + '<td >'+element.Used+'</td>'
			storage_table_content = storage_table_content + '<td >'+element.UsePercentage+'</td>'
			storage_table_content = storage_table_content + '<td >'+element.Filesystem+'</td>'			
		});

		$("#storage_info_table").html(storage_table_content) */
		
		update_table('storage_info_table', status_data, APPLICATION_STORAGE_INFO_COLUMNS_LIST_VALUE)
	}
	
	function get_info_success_cb(obj) {
		if(obj.api_return != 0){
			get_info_error_cb(obj)
			return;
		}
		
		storage_info_layout(obj.StorageInfo)
		
	} 
	function get_info_error_cb(obj) {
				
	}
	
	function get_storage_status(info){
		API.info.get(info, get_info_success_cb, get_info_error_cb);
	}
	
	function page_initial(){
		//Coding initial function here
		get_storage_status(INFO_LIST) 
	} 