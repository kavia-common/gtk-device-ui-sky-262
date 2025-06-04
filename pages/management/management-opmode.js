	page_tag='management-opmode'
	lang_tag='management_opmode'
	var INFO_LIST = ['MeshNodeStatus']
	var info_data={};
	
	$(document).ready(function(){
		$.lang_load(lang_tag);
		if ("undefined" != typeof(opmode_ap_untag_enabled) && opmode_ap_untag_enabled == "1")
			$(".map_untag_support").show()
		else
			$(".map_untag_support").hide()
		page_initial();
	});

	function set_ui_init(obj) {
		var p=UI.LS.getItem('p');
				
		if("sa" == p){
			$(".sa-only").show()
		}else
			$(".sa-only").hide()
	
		CURRENT_MODE = obj.Mode;
		
		$('#auto_mode').attr("value","auto");
		$('#mrt_tag_mode').attr("value","mrt_tag");
		$('#mrt_untag_mode').attr("value","mrt_untag");
		$('#ap_mode').attr("value","ap");

		opmode_selected(CURRENT_MODE);
	}

	function opmode_selected(mode) {
//		$('input[id$="_mode"]').closest('label.el-radio').removeAttr("aria-checked");
//		$('input[id$="_mode"]').closest('label.el-radio').removeClass("is-checked");
//		$('input[id$="_mode"]').closest('span.el-radio__input').removeClass("is-checked");

//		$('#'+mode+'_mode').closest('label.el-radio').attr("aria-checked","true");
//		$('#'+mode+'_mode').closest('label.el-radio').addClass("is-checked");
//		$('#'+mode+'_mode').closest('span.el-radio__input').addClass("is-checked");
		$('input[name="opmode"][value="'+mode+'"]').prop("checked",true);

		if (mode == CURRENT_MODE) {
			$('#opmode_apply').addClass("is-disabled");
			$('#opmode_apply').attr("disabled",true);
		}
		else {
			$('#opmode_apply').removeClass("is-disabled");
			$('#opmode_apply').removeAttr("disabled");
		}
	}

	function opmode_init_error() {
		var action = [{"style":"el-button el-button--primary","text":L.common.lang_confirm_btn_title,"action":"close_dialog()"}];

		pop_dialog("opmode-error",action);
		$('.el-dialog__title').text(L.management_opmode.lang_opmode_init_error_title);
	}

	function opmode_applied() {
		var action = [{"style":"el-button el-button--default","text":L.common.lang_cancel_btn_title,"action":"close_dialog()"},{"style":"el-button el-button--primary","text":L.common.lang_confirm_btn_title,"action":"close_dialog();page_save()"}];
		if($('input[name="opmode"]:checked').val()=='ap' && (ORIGINAL_OBJ_DATA.OpMode.OpModeP.Mode == 'mrt_untag' || ORIGINAL_OBJ_DATA.OpMode.OpModeP.Mode == 'mrt_tag') && info_data.MeshNodeStatus.length > 1){
			alert(L.management_opmode.lang_opmode_mesh_info_msg);
			return;
		}
		pop_dialog("opmode-confirm",action);
		$('.el-dialog__title').text(L.management_opmode.lang_opmode_reset_confirm_title);
	}

	function page_save() {
		MODIFIED_OBJ_DATA.OpMode.OpModeP.Mode = $('input[name="opmode"]:checked').val();
       		MODIFIED_OBJ_DATA.OpMode.OpModeP.Requester = 'gui';
		loading_control(1);
		$("#loading_message").html(L.common.lang_reconnect_msg)
		set_obj_data(MODIFIED_OBJ_DATA);
	}

	function set_obj_success_cb(obj) {
		/*
		setTimeout(function () {
			loading_control(0);
			opmode_init_error();
		},SAVE_OPMODE_WAITING_TIME);
		*/
		if (MODIFIED_OBJ_DATA.OpMode.OpModeP.Mode == 'mrt_untag'){
			setTimeout(function () {
				window.location.href = window.location.protocol + "//192.168.10.1/pre_out.html";
			}, SAVE_OPMODE_WAITING_TIME);
		}else{
			setTimeout(function () {
				window.location.href = window.location.protocol + "//192.168.1.1/pre_out.html";
			}, SAVE_OPMODE_WAITING_TIME);
		}
		/*
		setTimeout(function(){
			reboot_back_checker()
		},40000)
		*/
	}
	function set_obj_error_cb(obj) {
		loading_control(0);
		
		if (obj.api_return == 403) {
			logout('sto');
		}else
			opmode_init_error();
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

		set_ui_init(MODIFIED_OBJ_DATA.OpMode.OpModeP);
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
		get_info_data(INFO_LIST)
	}
	function get_info_data(info_list) {
		API.info.get(info_list, get_info_success_cb, get_info_error_cb);
	}
	function get_info_success_cb(obj) {
		info_data = API.obj.copy(obj);
	}
	function get_info_error_cb(obj) {
		if (obj.api_return == 403) {
			logout('sto')
		}
	}
