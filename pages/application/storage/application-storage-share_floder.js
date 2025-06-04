	page_tag='application-storage-share_floder'
	lang_tag='application_storage_share_floder'
	var FOLDER_LIST
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	}); 
	function obj_table_prepare(src_data, target_data, name_prefix){
		var id = 0
		src_data.forEach(function(element) {
			element.name = ""+name_prefix+id;
			target_data.push(element)
			id++
		});
	}
	
	function permission_list_layout(){
		/* var permission_table_content=""
		var id = 0
		PERMISSION_DATA.forEach(function(element) {
			number = id+1
			
			permission_table_content = permission_table_content + '<tr>'
			permission_table_content = permission_table_content + '<td >'+element.Owner+'</td>'
			permission_table_content = permission_table_content + '<td >'+element.Path+'</td>'
			permission_table_content = permission_table_content + '<td >'+element.Owner+'</td>'
			permission_table_content = permission_table_content + '<td >'+eval('permission_str['+element.Permission+']')+'</td>'
			permission_table_content = permission_table_content + '<td class="text-center"><a style="cursor: pointer;" onclick="delete_permission_item('+id+')"><img src="img/ic_delete_24px.png" ></a></td>'
			id++
		});
		
		if(id == 0)
			draw_empty_table_td('permission_table')
		else
			$("#permission_table").html(permission_table_content) */

		var id = 0
		var obj = API.obj.copy(PERMISSION_DATA); 
		obj.forEach(function(element) {
			number = id+1
			
			element.Permission = eval('permission_str['+element.Permission+']')
			element.TB_ACTION={"delete":"delete_permission_item("+id+")"}
			id++
		});

		update_table('permission_table', obj, APPLICATION_STORAGE_SHARE_FOLDER_COLUMNS_LIST_VALUE)
	}
	
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		var user_list_val = []
		var user_list_str = []
		
		MODIFIED_OBJ_DATA.StorageUser.StorageUserT.forEach(function(element) {
			user_list_val.push(element.Username)	
			user_list_str.push(element.Username)
		});
		
		update_select('folder_owner', user_list_str, user_list_val,'', '');
		
		PERMISSION_DATA = []
		obj_table_prepare(eval('MODIFIED_OBJ_DATA.ShareFolder.ShareFolderT'), PERMISSION_DATA,'pms')
		permission_list_layout()
		if($("#ftp_folder").val() == null || $("#folder_owner").val() == null)
		{
			$('#add').attr("disabled",true);
			$('#add').addClass("is-disabled");
		}else{
			$('#add').removeAttr("disabled");
			$('#add').removeClass("is-disabled");
		}
	} 
 	function get_obj_error_cb(obj) { 
		
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
		
	function get_info_success_cb(obj) {
		if(obj.api_return != 0){
			get_info_error_cb(obj)
			return;
		}
		
		var folder_list_val = []
		var folder_list_str = []
		
		if (obj.StorageInfo.length == 0){
			update_select('ftp_folder', folder_list_str, folder_list_val,'', '');
		}else{
			obj.StorageInfo.forEach(function(element) {
				folder_list_val.push(element.Name)	
				folder_list_str.push(element.Name)
				
			});
			
			update_select('ftp_folder', folder_list_str, folder_list_val,'', '');
			 	
		}
		
		get_obj_data(OBJ_LIST)
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
	
	function add_permission_item(){
		var item={}
		var Folder_num = MODIFIED_OBJ_DATA.ShareFolder.ShareFolderT.length
		var User_num = MODIFIED_OBJ_DATA.StorageUser.StorageUserT.length
		if(Folder_num != 0){
			for(var i=0;i<Folder_num;i++){
				if($("#folder_owner").val()==MODIFIED_OBJ_DATA.ShareFolder.ShareFolderT[i].Owner){
					alert(L.error_message.lang_error33_msg)
					return;
				}
			}
		}
		runtime_id=PERMISSION_DATA.length
		item.name = "pms"+runtime_id;
		
		item.Path = $("#ftp_folder").val()
		item.Owner = $("#folder_owner").val()
		item.Permission = $("#folder_permission").val()
		
		PERMISSION_DATA.push(item)
		page_save()
	}
	function delete_permission_item(item_id){
		if (item_id == 'all')
			PERMISSION_DATA = []
		else
			PERMISSION_DATA.splice(item_id, 1);
			
		page_save()
	}
	
	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}
		pop_alert_message(L.common.lang_success_msg,'success')
		
		page_initial()
	}
	function set_obj_error_cb(obj) {
		$("#loader").hide()
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			pop_alert_message(L.common.lang_error_msg,'error')
		}
	}
	function set_obj_data(obj_content){
		if(typeof(obj_content) == 'string')
			API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object')
			API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}
	function page_save(){
		
		MODIFIED_OBJ_DATA.ShareFolder.ShareFolderT=PERMISSION_DATA
		
		delete MODIFIED_OBJ_DATA.StorageUser
		
		set_obj_data(MODIFIED_OBJ_DATA)
	}
