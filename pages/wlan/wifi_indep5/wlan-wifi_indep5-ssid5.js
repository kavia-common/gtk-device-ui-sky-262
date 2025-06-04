var CURRENT_SSID_CONTROL_ID = null
$(document).ready(function(){
    $.when(
        $.lang_load("basic_setting_wlan_wifi_basic2")		
        ).done(function(){
        loading_control(1);
        page_initial()            
    })
});

function page_init(obj){
    var ssid_list = []
    var node = {}
    var first = true
    var list_index = 0
    $.each(obj, function(ssid_index, ssid_data) {
        
        if(ssid_data.RadioBand != RADIO_INDEX || SSID_CONFIG_LIST.indexOf(ssid_index) == -1 )
            return;
        node = {}
        node["SSID"] = '<span class="editable-wrap editable-text ng-scope"><input class="form-control" id="ssid_'+ssid_index+'_name" name=""  required="required" type="text" maxlength="" value="'+ssid_data.Ssid+'" style="margin-bottom:0px" ></span>'
        node["TB_SELECT"] = {
            "list_str": allinone_mesh_authtype_select_str,
            "list_val": allinone_mesh_authtype_select_val,
            "ele_id":"ssid_"+ssid_index+"_auth",
            "id":ssid_index,
            "val":ssid_data.AuthType
        }
        node["Security"] = '<span id="select_ssid_'+ssid_index+'_name"> </span>'
        node["TB_CHECKBOX"] = {
            "id":"ssid_"+ssid_index+"_enabled",
            "checked":ssid_data.Enabled,
            "cb":"ssid_enable_control("+ssid_index+")",
            "disabled":first
        }
        node["TB_ACTION"] = {
            "more": "ssid_control(this, "+list_index+")"
        }
        if(first)
            first = false
        ssid_list.push(node);
        list_index ++
    });

    update_table('ssid_data_list_table', ssid_list, SSID_DATA_COLUMNS_LIST_VALUE, 'gemtek-table-padding')
}

function get_obj_success_cb(obj) {
    ORIGINAL_OBJ_DATA = API.obj.copy(obj);
    MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
    page_init(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT)
    loading_control(0);
}
function get_obj_error_cb(obj) {
    loading_control(0);
}
function get_obj_data(obj_list){
    API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
}
function page_initial(){
    CURRENT_SSID_CONTROL_ID=null
    get_obj_data(OBJ_LIST)
}

function ssid_enable_control(id){
    if($('#ssid_'+id+'_enabled').prop('checked')){
        MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[id].Enabled = "0" 
    }else
        MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[id].Enabled = "1" 
}

function hide_control_bar(clean) {
    if (clean == 1){
        if(valid_key())
            CURRENT_SSID_CONTROL_ID = null
        else
            return false
    }  

    $(".ssid_control_zone").remove()
    return true
}

function ssid_control(element, id) {
    $(".more_btn").children().attr("src",MORE_ICON)
    if ( CURRENT_SSID_CONTROL_ID != null && CURRENT_SSID_CONTROL_ID == SSID_CONFIG_LIST[id] ){
        hide_control_bar(1)
    }else if(CURRENT_SSID_CONTROL_ID != null){
        $(element).children().attr("src",MORE_TRIGGER_ICON)
        if(valid_key()){
            $.get("/piece/ssid_node_control.html", "", function(data){
                CURRENT_SSID_CONTROL_ID = SSID_CONFIG_LIST[id]
                _node_control(id, data)  
            });
        }
    }else{
        $(element).children().attr("src",MORE_TRIGGER_ICON)
        $.get("/piece/ssid_node_control.html", "", function(data){
            CURRENT_SSID_CONTROL_ID = SSID_CONFIG_LIST[id]
            _node_control(id, data)  
        });
    }    
}

function _node_control(id, piece_content) {
    hide_control_bar(0)
    $("#ssid_data_list_table_id_" + id).after(piece_content);

    $("#ssid_key").val(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[SSID_CONFIG_LIST[id]].Key)
    hide_handler(MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[SSID_CONFIG_LIST[id]].Hidden)
}

function hide_handler(hide){
    if( 'undefined' == typeof(hide) ){
        hide = $("#ssid_hide").val()
    }
    
    MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[CURRENT_SSID_CONTROL_ID].Hidden = hide
    switcher_handler('ssid_hide',hide)
}

function select_authtype_select(element, id){
    MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[id].AuthType=$(element).val()
}

function valid_key(){
    var auth_key = $('#ssid_key').val()
    var key_valid_result = validation_key(auth_key)
    
    if(!key_valid_result){
        $("#ssid_key_error_msg").html(L.error_message.lang_wpa_key_ascii_format_error_msg)
        $("#ssid_key_error_msg").show()
        return false
    }
    $("#ssid_key_error_msg").hide()
    MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[CURRENT_SSID_CONTROL_ID].Key = auth_key
    return true
}

function valid_ssid(ssid){
    var ssid_valid_result = validation_ssid(ssid)

    if(ssid_valid_result == 1){
        warning_control('on','page',L.error_message.lang_ssid_empty_msg)
        return false;
    }else if(ssid_valid_result == 2) {
        warning_control('on','page',L.error_message.lang_ssid_overlength_msg)
        return false;
    }else if(ssid_valid_result == 3) {
        warning_control('on','page',L.error_message.lang_ssid_length_error_msg)
        return false;
    }else if(ssid_valid_result == 4) {
        warning_control('on','page',L.error_message.lang_ssid_front_end_space_error_msg)
        return false;
    }
    return true
}

function set_obj_success_cb(obj) {
    //show_alert(L.common.success_title, L.common.save_success);
    ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
    loading_wait_wireless_restart()
}

function set_obj_error_cb(obj) {
    loading_control(0)
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
    var ret = true
    if(CURRENT_SSID_CONTROL_ID!=null && ! hide_control_bar(1)){
        return
    }

    $(".more_btn").children().attr("src",MORE_ICON)

    $.each(SSID_CONFIG_LIST, function(list_index, list_id) {
        if( ! valid_ssid($("#ssid_"+list_id+"_name").val()) ){
            ret = false
            return ret
        }
        MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT[list_id].Ssid=$("#ssid_"+list_id+"_name").val()
        ret = true    
    });
    
    if(ret){
        loading_control(1);
        set_obj_data(MODIFIED_OBJ_DATA)
    }
}