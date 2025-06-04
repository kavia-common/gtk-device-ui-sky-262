        page_tag='basic_setting-wlan-mpt'
        $(document).ready(function(){
                $.lang_load("basic_setting_wlan_mpt");
                page_initial()
        });
        function callback(){

        }
        function get_obj_success_cb(obj) {
		ORIGINAL_OBJ_DATA = API.obj.copy(obj);
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
		page_init(MODIFIED_OBJ_DATA.Mpt)
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
        function page_init(obj){
		$("#mpt_select").val(obj.MptP.Country)
        }
        function select_mpt_select(){
	
        }
        function page_save(){
                loading_control(1);
                var obj = MODIFIED_OBJ_DATA.Mpt.MptP
                obj.Country = $("#mpt_select").val()
		set_obj_data(MODIFIED_OBJ_DATA)
        }
        function set_obj_success_cb(obj) {
                //show_alert(L.common.success_title, L.common.save_success);
                ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);

                setTimeout(function(){
                        loading_control(0)
                }, 60000);
        }

        function set_obj_error_cb(obj) {
                loading_control(0)
                alert("set fail");
        }
        function set_obj_data(obj_content){
                if(typeof(obj_content) == 'string')
                API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
                else if(typeof(obj_content) == 'object')
                API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
        }
