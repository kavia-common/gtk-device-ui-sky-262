	page_tag='adv_setting-telnet'
	$(document).ready(function(){
		$.lang_load("adv_setting_telnet");
		page_initial()
	});

	function set_ui_init(obj) {
		$('#telnet_enabled').val(obj.Enable);
		set_switch_value("telnet_enabled", obj.Enable);
	}
        function set_switch_value(id, onoff){
                $("#"+id).val(onoff)

                if( "0" == onoff ){
                        $("#"+id).parent('div.el-switch').removeClass('is-checked')
		}
                else{
                        $("#"+id).parent('div.el-switch').addClass('is-checked')
		}
        }

        function switcher_handler(ele_id, ele_val, cb){
                if ( 'undefined' != typeof(ele_val) && "" != ele_val ){
                        set_switch_value(ele_id, ele_val)
                }else{
                        var ele_val = $("#"+ele_id).val()

                        if( "1" == ele_val )
                                set_switch_value(ele_id, "0")
                        else
                                set_switch_value(ele_id, "1")
                }

                if ( 'undefined' != typeof(cb) && cb != "" )
                        eval(cb)
        }
	function applied() {
		page_save();
	}

	function page_save() {
		MODIFIED_OBJ_DATA.Telnet.TelnetP.Enable = $('#telnet_enabled').val();
		if($('#telnet_enabled').val()=="1")
			alert(L.adv_setting_telnet.lang_telnet_help_msg)

		loading_control(1);
		set_obj_data(MODIFIED_OBJ_DATA);
	}

	function set_obj_success_cb(obj) {
		setTimeout(function () {
			loading_control(0);
		},SAVE_TELNET_WAITING_TIME);
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

		set_ui_init(MODIFIED_OBJ_DATA.Telnet.TelnetP);
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
		get_obj_data(OBJ_LIST) 
	}
