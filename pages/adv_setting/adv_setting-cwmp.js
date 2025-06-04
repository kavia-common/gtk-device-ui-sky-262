	page_tag='adv_setting-cwmp'
	$(document).ready(function(){
		$.lang_load("adv_setting_cwmp");
		page_initial()
	}); 

 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		layout_init() 
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
        function cwmp_undo(){
                $("#tr_disable").parent().attr('class','el-radio__input')
                $("#tr_enable").parent().attr('class','el-radio__input')
                $("#info_disable").parent().attr('class','el-radio__input')
                $("#info_enable").parent().attr('class','el-radio__input')
                $("#stun_disable").parent().attr('class','el-radio__input')
                $("#stun_enable").parent().attr('class','el-radio__input')
                get_obj_data(OBJ_LIST)
        }
        function switch_style(obj,val){
                $(obj).parent().attr('class','el-radio__input is-checked')
                //$(obj).attr('class','el-radio__input is-checked')
                if(obj.id=="tr_enable")
                        $("#tr_disable").parent().attr('class','el-radio__input')
                else if(obj.id=="tr_disable")
                        $("#tr_enable").parent().attr('class','el-radio__input')
                if(obj.id=="info_enable")
                        $("#info_disable").parent().attr('class','el-radio__input')
                else if(obj.id=="info_disable")
                        $("#info_enable").parent().attr('class','el-radio__input')
                if(obj.id=="stun_enable")
                        $("#stun_disable").parent().attr('class','el-radio__input')
                else if(obj.id=="stun_disable")
                        $("#stun_enable").parent().attr('class','el-radio__input')
        }
        function layout_init(){
                if(MODIFIED_OBJ_DATA.Tr069.Tr069P.Enabled=='1')
                        switch_style($('#tr_enable'))
                else
                        switch_style($('#tr_disable'))

                if(MODIFIED_OBJ_DATA.Tr069.Tr069P.InformEnabled=='1')
                        switch_style($('#info_enable'))
                else
                        switch_style($('#info_disable'))

		if(MODIFIED_OBJ_DATA.Tr069.Tr069P.StunEnabled=='1')
			switch_style($('#stun_enable'))
		else
			switch_style($('#stun_disable'))

                $("#tr_url").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.AcsUrl);
                $("#tr_name").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.AcsUserName);
                $("#tr_pwd").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.AcsPassword);
                $("#interval").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.InformInterval);

		$("#cr_username").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqUserName);
		$("#cr_password").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqPassword);
		$("#cr_path").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqPath);
		$("#cr_port").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqPort);

		$("#stun_url").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.StunServer);
		$("#stun_port").val(MODIFIED_OBJ_DATA.Tr069.Tr069P.StunServerPort);
        }

        function page_save(){
                if($("#tr_enable").parent().prop('class') == "el-radio__input is-checked")
                        MODIFIED_OBJ_DATA.Tr069.Tr069P.Enabled='1';
                else
                        MODIFIED_OBJ_DATA.Tr069.Tr069P.Enabled='0';

                if($("#info_enable").parent().attr('class') =="el-radio__input is-checked")
                        MODIFIED_OBJ_DATA.Tr069.Tr069P.InformEnabled='1';
                else
                        MODIFIED_OBJ_DATA.Tr069.Tr069P.InformEnabled='0';

		if($("#stun_enable").parent().attr('class') =="el-radio__input is-checked")
			MODIFIED_OBJ_DATA.Tr069.Tr069P.StunEnabled='1';
		else
			MODIFIED_OBJ_DATA.Tr069.Tr069P.StunEnabled='0';

                MODIFIED_OBJ_DATA.Tr069.Tr069P.AcsUrl=$('#tr_url').val();
                MODIFIED_OBJ_DATA.Tr069.Tr069P.AcsUserName=$("#tr_name").val();
                MODIFIED_OBJ_DATA.Tr069.Tr069P.AcsPassword=$("#tr_pwd").val();
                MODIFIED_OBJ_DATA.Tr069.Tr069P.InformInterval=$("#interval").val();
		MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqUserName=$("#cr_username").val();
		MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqPassword=$("#cr_password").val();
		MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqPath=$("#cr_path").val();
		MODIFIED_OBJ_DATA.Tr069.Tr069P.ConnReqPort=$("#cr_port").val();
		MODIFIED_OBJ_DATA.Tr069.Tr069P.StunServer=$("#stun_url").val();
		MODIFIED_OBJ_DATA.Tr069.Tr069P.StunServerPort=$("#stun_port").val();
                set_obj_data(MODIFIED_OBJ_DATA)
        }


        function set_obj_success_cb(obj) {
                //show_alert(L.common.success_title, L.common.save_success);
                ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
        }
        function set_obj_error_cb(obj) {
                //show_alert(L.common.fail_title, L.common.save_fail)
        }
        function set_obj_data(obj_content){
                if(typeof(obj_content) == 'string')
                        API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
                else if(typeof(obj_content) == 'object')
                        API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
        }
 
