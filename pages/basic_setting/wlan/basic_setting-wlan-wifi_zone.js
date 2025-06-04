page_tag='basic_setting-wlan-wifi_zone'
var GUEST_SSID_LIST = [3, 7, 11]
var EMPLOYEE_SSID_LIST = [1, 5, 9]

$(document).ready(function(){
    $.lang_load("basic_setting_wlan_wifi_zone");
    page_initial();
});
    
function page_initial(){
    //Coding initial function here
    get_obj_data(OBJ_LIST)
}

function guest_zone_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
        enabled = $("#guest_enable").val();
    }

    if(enabled == "1"){
        $(".guest_enabled_show").show();
    } else {
        $(".guest_enabled_show").hide();
    }

    MODIFIED_OBJ_DATA.WifiZone.WifiZoneT[0].Enable=enabled
    switcher_handler("guest_enable",enabled);
}

function employee_zone_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
        enabled = $("#employee_enable").val();
    }

    if(enabled == "1"){
        $(".employee_enabled_show").show();
    } else {
        $(".employee_enabled_show").hide();
    }

    MODIFIED_OBJ_DATA.WifiZone.WifiZoneT[1].Enable=enabled
    switcher_handler("employee_enable",enabled);
}

function guest_captive_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
        enabled = $("#guest_captive_enable").val();
    }

    MODIFIED_OBJ_DATA.WifiZone.WifiZoneT[0].CaptivePortalEnable=enabled
    switcher_handler("guest_captive_enable",enabled);
}

function employee_captive_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
        enabled = $("#employee_captive_enable").val();
    }

    MODIFIED_OBJ_DATA.WifiZone.WifiZoneT[1].CaptivePortalEnable=enabled
    switcher_handler("employee_captive_enable",enabled);
}

function page_save(){
    var zone_obj = MODIFIED_OBJ_DATA.WifiZone.WifiZoneT
    var wlan_obj = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT


    if(!valid_ssid('guest_ssid') || !valid_ssid('employee_ssid')){
        return false;
    }

    if(!valid_key('guest_ssid') || !valid_key('employee_ssid')){
        return false;
    }

    loading_control(1);

    zone_obj[0].Enable =  $("#guest_enable").val();
    zone_obj[0].CaptivePortalEnable =  $("#guest_captive_enable").val();
    zone_obj[1].Enable =  $("#employee_enable").val();
    zone_obj[1].CaptivePortalEnable =  $("#employee_captive_enable").val();
    wlan_obj[GUEST_SSID_LIST[0]].Ssid =  $("#guest_ssid").val();
    wlan_obj[GUEST_SSID_LIST[1]].Ssid =  $("#guest_ssid").val();
    wlan_obj[GUEST_SSID_LIST[2]].Ssid =  $("#guest_ssid").val();
    wlan_obj[EMPLOYEE_SSID_LIST[0]].Ssid =  $("#employee_ssid").val();
    wlan_obj[EMPLOYEE_SSID_LIST[1]].Ssid =  $("#employee_ssid").val();
    wlan_obj[EMPLOYEE_SSID_LIST[2]].Ssid =  $("#employee_ssid").val();
    wlan_obj[EMPLOYEE_SSID_LIST[0]].Key =  $("#employee_wpa_key").val();
    wlan_obj[EMPLOYEE_SSID_LIST[1]].Key =  $("#employee_wpa_key").val();
    wlan_obj[EMPLOYEE_SSID_LIST[2]].Key =  $("#employee_wpa_key").val();

    
    set_obj_data(MODIFIED_OBJ_DATA);
}

function valid_ssid(zone_type){
    var ssid_valid_result = validation_ssid($("#"+zone_type).val())

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

function valid_key(zone_type){
    var auth_key = $('#'+zone_type).val()
    var key_valid_result = validation_key(auth_key)
    if(!key_valid_result){
        warning_control('on','page',L.error_message.lang_wpa_key_ascii_format_error_msg)
        return false
    }

    return true
}

/* ------- get obj Functions ------- */
function get_obj_success_cb(obj) {
    ORIGINAL_OBJ_DATA = API.obj.copy(obj);
    MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
    page_init(MODIFIED_OBJ_DATA);
}

function get_obj_error_cb(obj) {
    if(obj.api_return == 403)
    logout('sto')
}

function get_obj_data(obj_list){
    API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb);
}

/* ------- set obj Functions ------- */
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
        setTimeout(function(){
            loading_control(0)
            pop_alert_message(L.common.lang_error_msg,'error')
        }, 2000);
    }
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

function page_init(obj) {
    $("#guest_enable").val(obj.WifiZone.WifiZoneT[0].Enable);
    $("#guest_captive_enable").val(obj.WifiZone.WifiZoneT[0].CaptivePortalEnable);
    $("#guest_ssid").val(obj.WlanDeviceSsid.WlanDeviceSsidT[GUEST_SSID_LIST[0]].Ssid);
    
    $("#employee_enable").val(obj.WifiZone.WifiZoneT[1].Enable);
    $("#employee_captive_enable").val(obj.WifiZone.WifiZoneT[1].CaptivePortalEnable);
    $("#employee_ssid").val(obj.WlanDeviceSsid.WlanDeviceSsidT[EMPLOYEE_SSID_LIST[0]].Ssid);
    $("#employee_wpa_key").val(obj.WlanDeviceSsid.WlanDeviceSsidT[EMPLOYEE_SSID_LIST[0]].Key);

    guest_zone_enable_handler($("#guest_enable").val());
    employee_zone_enable_handler($("#employee_enable").val());
    guest_captive_enable_handler($("#guest_captive_enable").val());
    employee_captive_enable_handler( $("#employee_captive_enable").val());
}
