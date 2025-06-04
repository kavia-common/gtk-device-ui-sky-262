var INFO_LIST = ['MeshNodeStatus']
var info_data = {};
var delay = 0;
page_tag = 'basic_setting-wlan-mesh2'
$(document).ready(function () {
    $.lang_load("basic_setting_wlan_mesh");
    page_initial()
});
function callback() {

}
function check_delay() {
    if (delay == 0) {
        setTimeout("check_delay();", 1000)
    }
}
function get_info_data(info_list) {
    API.info.get(info_list, get_info_success_cb, get_info_error_cb);
}
function get_info_success_cb(obj) {
    info_data = API.obj.copy(obj);
    if (info_data.MeshNodeStatus.length > 1)
        delay = 360000
    else
        delay = loading_time[1]
    check_delay();
    set_obj_data(MODIFIED_OBJ_DATA)
}
function get_info_error_cb(obj) {
    if (obj.api_return == 403) {
        logout('sto')
    }
}
function get_obj_success_cb(obj) {
    ORIGINAL_OBJ_DATA = API.obj.copy(obj);
    MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
    page_init(MODIFIED_OBJ_DATA.Mesh)
}
function get_obj_error_cb(obj) {
    
}
function get_obj_data(obj_list) {
    API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
}
function page_initial() {
    //Coding initial function here
    get_obj_data(OBJ_LIST)
}
function page_init(obj) {
    if (obj.MeshP.Enable == "1")
        switch_toggle($('#enable_btn')[0], '1')
    else
        switch_toggle($('#enable_btn')[0], '0')
}

function switch_toggle(obj, val) {
    if (typeof (val) == "undefined") {
        if ($(obj).parent().prop('class') == "el-switch is-checked") {
            $(obj).parent().attr('class', 'el-switch')
            MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "0"
        } else {
            $(obj).parent().attr('class', 'el-switch is-checked')
            MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "1"
        }
    } else {
        if (val == "1") {
            $(obj).parent().attr('class', 'el-switch is-checked')
            MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "1"
        } else {
            $(obj).parent().attr('class', 'el-switch')
            MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = "0"
        }
    }
}

function page_save() {
    $("#loading_message").html("Synchronize setting...")
    loading_control(1);
    var obj = MODIFIED_OBJ_DATA.Mesh.MeshP
    get_info_data(INFO_LIST)
}
function set_obj_success_cb(obj) {
    ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
    // pop_alert_message(L.common.lang_success_msg,'success')
    loading_wait_wireless_restart()
}

function set_obj_error_cb(obj) {
    if (obj.api_return == 403) {
        logout('sto')
        return;
    } else {
        pop_alert_message(L.common.lang_error_msg, 'error')
    }
}
function set_obj_data(obj_content) {
    if (typeof (obj_content) == 'string')
        API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
    else if (typeof (obj_content) == 'object')
        API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
}