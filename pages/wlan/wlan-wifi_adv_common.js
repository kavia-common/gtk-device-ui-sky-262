page_tag='wlan-wifi_adv_common'
lang_tag='wlan_wifi_adv_common'
$(document).ready(function(){
    $.when(
        $.lang_load(lang_tag)
    ).done(function(){
        page_initial()
    })
});

function page_init(obj){		
    $("#twt_enabled").val(obj.WlanGlobal.WlanGlobalP.TWTEnabled);
    if ( 0 == obj.WlanGlobal.WlanGlobalP.TWTEnabled){
        $("#twt_enabled").parent("div").removeClass("is-checked");
    }

    twt_enabled_handler(obj.WlanGlobal.WlanGlobalP.TWTEnabled)
}

function get_obj_success_cb(obj) {
    ORIGINAL_OBJ_DATA = API.obj.copy(obj);
    MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);

    page_init(MODIFIED_OBJ_DATA)
    loading_control(0);
}
function get_obj_error_cb(obj) {
    loading_control(0);
}
function get_obj_data(obj_list){
    API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
}
function page_initial(){
    get_obj_data(OBJ_LIST)
}

function twt_enabled_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
        enabled = $("#twt_enabled").val()
    }
    
    MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.TWTEnabled=enabled

    switcher_handler('twt_enabled',enabled)
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
    $("#loading_message").html(L.common.lang_plz_wait)
    loading_control(1);

    set_obj_data(MODIFIED_OBJ_DATA)
}