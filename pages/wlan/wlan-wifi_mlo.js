var info_data={};
var delay
page_tag='wlan-wifi_mlo'
$(document).ready(function(){
    $.when(
        $.lang_load("basic_setting_wlan_mesh"),
        $.lang_load("basic_setting_wlan_wifi_basic2"),


    ).done(function(){
        loading_control(1);
        page_initial()
    })
});

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
    $("#password_displaycommon").html(L.basic_setting_wlan_wifi_basic2.lang_show_key)
    get_obj_data(OBJ_LIST)
}

function page_init(obj){		
    update_select('authtype_commong', allinone_common_ssid_authtype_select_str, allinone_common_ssid_authtype_select_val,'select_authtype_select(\'common\')', '');
    
    //Single SSID Zone
    $("#MLO_enable").val(obj.WlanGlobal.WlanGlobalP.MloEnable);
    if ( 0 == obj.WlanGlobal.WlanGlobalP.MloEnable){
        $("#MLO_enable").parent("div").removeClass("is-checked");
    }

    MLO_enable_handler(obj.WlanGlobal.WlanGlobalP.MloEnable)

    select_authtype_select("common",'wpa3')

    var single_ssid_name=obj.WlanGlobal.WlanGlobalP.SingleSsidName
    var single_ssid_key=obj.WlanGlobal.WlanGlobalP.SingleSsidKey
    if ( single_ssid_name == "" || single_ssid_key == "" ){
        $("#commong_ssid").val(obj.WlanDeviceSsid.WlanDeviceSsidT[MLO_SSID_TARGET_INDEX].Ssid)
        $("#commong_wpa_key").val(obj.WlanDeviceSsid.WlanDeviceSsidT[MLO_SSID_TARGET_INDEX].Key)
    }else{
        $("#commong_ssid").val(obj.WlanGlobal.WlanGlobalP.SingleSsidName)
        $("#commong_wpa_key").val(obj.WlanGlobal.WlanGlobalP.SingleSsidKey)
    }
}

function select_authtype_select(band, auth_val){
    if(typeof(auth_val) == "undefined"){
        auth_val = $('#authtype_'+band+'g').val()
    }else{
        $('#authtype_'+band+'g').val(auth_val)
    }
    
    if(auth_val=='open'){
        //$('#div_encryptype_select').hide()
        $('#div_ssidpwd'+band).hide()
    }else{
        if (auth_val=='mixed2'){
            $('#encryptype_'+band+'g').val("aes+tkip") 
        }else
            $('#encryptype_'+band+'g').val('aes')  
        //$('#div_encryptype_select').show()
        
        $('#div_ssidpwd'+band).show()
    }
}

function valid_ssid(band){
    var ssid_valid_result = validation_ssid($("#"+band+"g_ssid").val())
    if(ssid_valid_result == 1){
        warning_control('on','global',L.error_message.lang_ssid_empty_msg)
        return false;
    }else if(ssid_valid_result == 2) {
        warning_control('on','global',L.error_message.lang_ssid_overlength_msg)
        return false;
    }else if(ssid_valid_result == 3) {
        warning_control('on','global',L.error_message.lang_ssid_length_error_msg)
        return false;
    }else if(ssid_valid_result == 4) {
        warning_control('on','global',L.error_message.lang_ssid_front_end_space_error_msg)
        return false;
    }
    return true
}
function valid_key(band){
    var auth_type = $('#authtype_'+band+'g_select').val()
    var auth_key = $('#'+band+'g_wpa_key').val()
    if( auth_type != 'open' ){
        var key_valid_result = validation_key(auth_key)
        if(!key_valid_result){
            warning_control('on','page',L.error_message.lang_wpa_key_ascii_format_error_msg)
            return false
        }
    }
    return true
}

function MLO_Enable_confirmed(){
    close_confirm()
    MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[0].WifiMode= 'beg';
    MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].WifiMode= 'bea';
    MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].WifiMode= 'bea';
    loading_control(1)
    set_obj_data(MODIFIED_OBJ_DATA);
}

function page_save(){

    warning_control('off','page')
    
    if(!valid_ssid('common') || !valid_key('common') )
        return false;

    $("#loading_message").html("Synchronize setting...")
    
    var wlan_obj = MODIFIED_OBJ_DATA.WlanDeviceSsid.WlanDeviceSsidT
    var wlan_global_obj = MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP
            
    wlan_global_obj.SingleSsidName = $("#commong_ssid").val()
    wlan_global_obj.SingleSsidKey = $("#commong_wpa_key").val()
    wlan_global_obj.SingleSsidAuthType = $("#authtype_commong").val()
    
    //sync to WlanDeviceSsid obj
    $.each(wlan_obj, function(ssid_index, ssid_data) {
        if(SSID_CONFIG_LIST.indexOf(ssid_index) == -1 )
            return;
        
        ssid_data.Ssid = $("#commong_ssid").val()
        ssid_data.Key =  $("#commong_wpa_key").val()
        ssid_data.AuthType = $("#authtype_commong").val()
    });

    if (mlo_enable == 1){
        pop_confirm(L.basic_setting_wlan_mesh.lang_mlo_enable_confirm_msg,MLO_Enable_confirmed);
    } // if
    else{
        loading_control(1);
        set_obj_data(MODIFIED_OBJ_DATA)
    }
    
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

function single_ssid_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
        enabled = $("#single_ssid_enable").val()
    }
    if (1 == enabled){
        $(".single_ssid_zone").show()
    }else{
        $(".single_ssid_zone").hide()
    }
    MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.SingleSsidEnable=enabled
    
    switcher_handler('single_ssid_enable',enabled)
}

function MLO_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
        enabled = $("#MLO_enable").val()
    }
    mlo_enable = enabled
    MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable=enabled
    MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.SingleSsidEnable=enabled
    if (1 == enabled){
        $(".single_ssid_zone").show()
    }else{
        $(".single_ssid_zone").hide()
    }

    switcher_handler('MLO_enable',enabled)
}