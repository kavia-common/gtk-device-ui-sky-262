	page_tag='application-storage-storage_account'
	lang_tag='application_storage_storage_account'
	var ACCOUNT_DATA = []
	var GUEST_ID = ""
	
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	});
	
	function annonymous_enable_handler(enable){
		var need_save = false
		if( 'undefined' == typeof(enable) ){
			enable = $("#annonymous_enable").val()
			
		}
				
		if(1 == enable)
			add_account_item('anonymous')
		else
			delete_account_item(GUEST_ID)
			
	}
	
	function obj_table_prepare(src_data, target_data, name_prefix){
		var id = 0
		src_data.forEach(function(element) {
			element.name = ""+name_prefix+id;
			target_data.push(element)
			id++
		});
	}
	
	function account_list_layout(){
		/* var account_table_content=""
		var id = 0
		var have_guest_account = "0"
		ACCOUNT_DATA.forEach(function(element) {
			number = id+1
			if (element.Username == "anonymous"){
				have_guest_account = "1"
				GUEST_ID=id
			}
			account_table_content = account_table_content + '<tr>'
			account_table_content = account_table_content + '<td >'+number+'</td>'
			account_table_content = account_table_content + '<td >'+element.Username+'</td>'
			account_table_content = account_table_content + '<td class="text-center"><a style="cursor: pointer;" onclick="delete_account_item('+id+')"><img src="img/ic_delete_24px.png" ></a></td>'
			id++
		});
		
		
		switcher_handler('annonymous_enable',have_guest_account,"")
		
		if(id == 0)
			draw_empty_table_td('account_table')
		else
			$("#account_table").html(account_table_content) */

		var id = 0
		var have_guest_account = "0"
		var obj = API.obj.copy(ACCOUNT_DATA); 
		obj.forEach(function(element) {
			number = id+1
			if (element.Username == "anonymous"){
				have_guest_account = "1"
				GUEST_ID=id
			}

			element.Number = number
			element.TB_ACTION={"delete":"delete_account_item("+id+")"}
			id++
		});
		
		switcher_handler('annonymous_enable',have_guest_account,"")
		update_table('account_table', obj, APPLICATION_STORAGE_ACCOUNT_COLUMNS_LIST_VALUE)
	}
	
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		
		ACCOUNT_DATA = []
		obj_table_prepare(eval('MODIFIED_OBJ_DATA.StorageUser.StorageUserT'), ACCOUNT_DATA,'storage_user')
		account_list_layout()
		
	} 
 	function get_obj_error_cb(obj) { 
		
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST) 
	}
	function valid_name_exist(){

		for(var i=0; i<ACCOUNT_DATA.length;i++){
			if($('#storage_username').val()==ACCOUNT_DATA[i].Username){
				alert(L.error_message.lang_error28_msg);
				return false;
			}
		}
		return true;
	} 
	function valid_name(I) {
		if (I.value.length < 1) {
			alert(L.error_message.lang_error29_msg);
			return false;
		}

		var re = new RegExp("[^a-zA-Z0-9-_-]+","gi");
		if (re.test(I.value)) {
			alert(L.error_message.lang_error30_msg);
			return false;
		}

		return true;
	}
	function validation_key(password){
		var re = new RegExp("[^a-zA-Z0-9-_-]+","gi");
		if (re.test(password)){
			return false;
		}
		if(password.match(/^.{4,64}$/) !== null){
			return true;
		}else{
			return false;
		}
	}	
	function valid_pwd() {
		var pwd = $('#storage_pw').val()
		var pwd_c = $('#storage_pw_confirm').val()
		if(pwd!=pwd_c){
			alert(L.error_message.lang_error31_msg)
			return false
		}
		if(validation_key(pwd)!=true){
			alert(L.error_message.lang_error32_msg)
			return false
		}
		return true;
	}
	function add_account_item(type){
		var item={}
		if(type!="anonymous"){
			if(valid_name($('#storage_username')[0])!=true){
				return false
			}
			if(ACCOUNT_DATA.length!=0){
				if(valid_name_exist()!=true){
					return false
				}
			}
			if(valid_pwd()!=true){
				return false
			}
		}

		runtime_id=ACCOUNT_DATA.length
		item.name = "storage_user"+runtime_id;
		
		if('undefined' != typeof(type) && "anonymous" == type ){
			item.Username = 'anonymous'
			item.Password = ""
		}else{
			item.Username = $("#storage_username").val()
			item.Password = $("#storage_pw").val()
		}
				
		ACCOUNT_DATA.push(item)
		page_save()
	
	}
	
	function delete_account_item(item_id){
		if ( 'all' == item_id )
			ACCOUNT_DATA = []
		else
			ACCOUNT_DATA.splice(item_id, 1);
		
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
		
		MODIFIED_OBJ_DATA.StorageUser.StorageUserT=ACCOUNT_DATA
		set_obj_data(MODIFIED_OBJ_DATA)
	}
