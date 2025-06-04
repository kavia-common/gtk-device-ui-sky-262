	page_tag='management-account'
	$(document).ready(function(){
		$.lang_load("management_account");
		page_initial();
	});

	function _prepare_layout(obj) {
		var i;

		account_username_str_list = [];
		account_username_val_list = [];

		for (i = 0; i < obj.length; ++i) {
			account_username_str_list.push(obj[i].username);
			account_username_val_list.push(obj[i].username);
		}

		update_select("account_username", account_username_str_list, account_username_val_list,"account_selected(this.value)", "a");
	}

	function set_ui_init(obj) {
		_prepare_layout(obj);
		
		if ("undefined" != typeof(multi_account_enabled) && multi_account_enabled == "1"){
			account_selected($('#account_username').val());
			$('.account_zone').show()
		}else{
			$('.account_zone').hide()
			account_selected("admin");
		}
		
		
		$('#old_pwd').val("");
		$('#new_pwd').val("");
		$('#confirm_pwd').val("");
	}

	function _find_obj_by_account(account) {
		var i;
		var obj = MODIFIED_OBJ_DATA.Account.AccountT;

		for (i = 0; i < obj.length; ++i) {
			if (account == obj[i].username) {
				break;
			}
		}

		if (i >= obj.length)
			return obj[0];

		return obj[i];
	}

	function _set_input_error(id,state,msg) {
		$('#'+id).closest('div.el-form-item').removeClass("is-success");
		$('#'+id).closest('div.el-form-item').removeClass("is-error");

		if (state) {
			$('#'+id).closest('div.el-form-item').addClass("is-success");
			$('#'+id+'_error_msg').text(msg);
			$('#'+id+'_error_msg').css("display","none");
		}
		else {
			$('#'+id).closest('div.el-form-item').addClass("is-error");
			$('#'+id+'_error_msg').text(msg);
			$('#'+id+'_error_msg').css("display","");
		}
	}
	function valid_pwd(I) {

		var re = new RegExp("[^a-zA-Z0-9-!@]+","gi");
		if (re.test(I.value)) {
			alert(L.error_message.lang_error32_msg);
			return false;
		}
	
		return true;
	}

	function valid_password(id) {
		var pwd = $('#'+id).val();

		if (pwd == "") {
			_set_input_error(id,false,L.management_account.lang_account_password_empty_error);
			return false;
		}

		_set_input_error(id,true,"");
		return true;
	}

	function confirm_password() {
		var new_pwd = $('#new_pwd').val();
		var confirm_pwd = $('#confirm_pwd').val();

		if (!valid_password("confirm_pwd"))
			return false;

		if (confirm_pwd != new_pwd) {
			_set_input_error("confirm_pwd",false,L.management_account.lang_account_password_confirm_error);
			return false;
		}

		_set_input_error("confirm_pwd",true,"");
		return true;
	}

	function check_password() {
		if (!valid_password("old_pwd"))
			return false;

		_set_input_error("old_pwd",true,"");
		return true;
	}

	function account_selected(acut) {
		var i;
		var obj = _find_obj_by_account($('#account_username').val());
		$('#account_username').val(acut)
	}

	function account_applied() {
		page_save();
	}

	function account_refresh() {
		page_initial()
	}

	function page_save() {
		var obj;
		if(!valid_pwd($('#new_pwd')[0])  || !valid_password("new_pwd") || !confirm_password())
			return;

		//if (!check_password())
		//	return;

		obj='{"Account":{"Method":"set_password","Account":"'+$('#account_username').val()+'","OldPassword":"'+UI.AES.encrypt($('#old_pwd').val())+'","NewPassword":"'+UI.AES.encrypt($('#new_pwd').val())+'"}}'
		
		loading_control(1);
	
		set_obj_data(obj);
	}
    
	function set_obj_success_cb(obj) {
		if("old_pw_error" == obj.Account){
			loading_control(0);
			_set_input_error("old_pwd",false,L.management_account.lang_account_oldpassword_change_error);
		}else{
			setTimeout(function () {
				loading_control(0);
				page_initial()
			},SAVE_ACCOUNT_WAITING_TIME);
		}
	}
	function set_obj_error_cb(obj) {
		loading_control(0);
		if (obj.api_return == 403) {
			logout('sto');
		}
	}
	function set_obj_data(obj_content){
		API.info.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
	}

 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		set_ui_init(MODIFIED_OBJ_DATA.Account.AccountT);
	} 
 	function get_obj_error_cb(obj) {
		if (obj.api_return == 403) {
			logout('sto');
		}
	} 
		
	function page_initial(){
		//Coding initial function here
		//get_obj_data(OBJ_LIST);
		
		obj_content='{"Account":{"Method":"get_list","Account":"'+localStorage.getItem('gUA')+'","Level":"'+localStorage.getItem('p')+'"}}'
		API.info.set(JSON.parse(obj_content), get_obj_success_cb, get_obj_error_cb);	
	}