    page_tag='management-tools-remotecapture'
    $(document).ready(function(){
        $.lang_load('management_tools_remotecapture');
        page_initial()
    });
    
    function set_ui_init() {
        if(MODIFIED_OBJ_DATA.RemoteCapture.RemoteCaptureP.Enable=="1"){
            switch_toggle($("#enable_btn"),"1");
        }else{
            switch_toggle($("#enable_btn"),"0");
        }
        $("#remoteCapture_data").text(L.management_tools_remotecapture.lang_remotecapture_link)
        
    }
    function get_obj_success_cb(obj) {
        ORIGINAL_OBJ_DATA = API.obj.copy(obj);
        MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
        set_ui_init()
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
    function remotecapture_link(){
        var result = window.confirm(L.management_tools_remotecapture.lang_remotecapture_confirm)
        get_obj_data(OBJ_LIST)
        if(result == true)
            window.location.href = window.location.protocol+window.location.hostname+"/remote/capture"
        else
            return
    }
    
    function switch_toggle(obj,val){
        if(val == "1"){
            $(obj).parent().attr('class','el-switch is-checked')
            $(".remoteCapture_enable_show").show()
        }else if(val == "0"){
            $(obj).parent().attr('class','el-switch')
            $(".remoteCapture_enable_show").hide()
        }else{
            if($(obj).parent().prop('class') == "el-switch is-checked"){
                $(obj).parent().attr('class','el-switch')
            }else{
                $(obj).parent().attr('class','el-switch is-checked')
            }
        }
    }

    function set_obj_success_cb(obj) {
        if(obj.api_return != 0){
            set_obj_error_cb(obj)
            return;
        }
        pop_alert_message(L.common.lang_success_msg,'success')
        get_obj_data(OBJ_LIST)
    }
    function set_obj_error_cb(obj) {
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
        if($("#enable_btn").parent().prop('class') == "el-switch is-checked")
            MODIFIED_OBJ_DATA.RemoteCapture.RemoteCaptureP.Enable='1';
        else
            MODIFIED_OBJ_DATA.RemoteCapture.RemoteCaptureP.Enable='0';
        set_obj_data(MODIFIED_OBJ_DATA)
    }