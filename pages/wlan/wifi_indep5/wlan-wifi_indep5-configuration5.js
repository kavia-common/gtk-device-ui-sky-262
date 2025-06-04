page_tag='basic_setting-wlan-wifi_adv2'
$(document).ready(function(){
    $.lang_load("basic_setting_wlan_wifi_adv2");
    $.lang_load("basic_setting_wlan_wifi_basic2");
    page_initial()
}); 
var current_idx=0;
function switch_toggle(obj,val){
    if(val == "1"){
        $(obj).parent().attr('class','el-switch is-checked')
    }else if(val == "0"){
        $(obj).parent().attr('class','el-switch')
    }else{
        if($(obj).parent().prop('class') == "el-switch is-checked"){
            $(obj).parent().attr('class','el-switch')
        }else{
            $(obj).parent().attr('class','el-switch is-checked')
        }
    }
    
}

function select_ssid_select(){
    
}

function select_encryptype_select(){
    
}

function select_wifi_mode_select(band){
    var M =document.getElementById("wifi_mode_select5");
    var mode = M.options[M.selectedIndex].value;
    if (mode != "bea") {
        if (MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable == 1 ) {
            alert(L.error_message.lang_error43_msg);
            $("#wifi_mode_select" + band).val("bea");
            return;
        } // if
    } // if 
}

function SSID_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
    enabled = $("#SSID_enable5").val()
    }
    switcher_handler('SSID_enable5',enabled)

}

function select_wifi_bw_select(){
    
}

function select_wifi_channel_select(){
    
}

function layout_init(){
    var target_band
    if ( 0 == MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled){
        $("#SSID_enable5").parent("div").removeClass("is-checked");
        }
        SSID_enable_handler(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled)
    for(var i=0 ; i< MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT.length;i++){
        if( MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].RadioBand != TARGET_BAND)
            continue
        else
            target_band = TARGET_BAND
        $("#wifi_mode_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].WifiMode)
        $("#wifi_bw_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Bw)
        $("#wifi_channel_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Channel)
        //$("#id_maxclients"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].MaxClients)
        
        /*
        if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].ShortGI=="1"){
            switch_toggle($("#short_gi_btn"+target_band),"1");
        }else{
            switch_toggle($("#short_gi_btn"+target_band),"0");
        }
        
        if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Wmm=="1"){
            switch_toggle($("#wmm_btn"+target_band),"1");
        }else{
            switch_toggle($("#wmm_btn"+target_band),"0");
        }
        
        if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Atf=="1"){
            switch_toggle($("#atf_btn"+target_band),"1");
        }else{
            switch_toggle($("#atf_btn"+target_band),"0");
        }
        
        if(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Txbf=="1"){
            switch_toggle($("#txbf_btn"+target_band),"1");
        }else{
            switch_toggle($("#txbf_btn"+target_band),"0");
        }
         */
    }
}

function Mesh_and_MLO_confirmed(){
    close_confirm()
    MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable='0'
    MODIFIED_OBJ_DATA.Mesh.MeshP.Enable = '0'
    loading_control(1)
    set_obj_data(MODIFIED_OBJ_DATA);
}

function page_save(){
    // if(valid_range($("#id_maxclients")[0], 1, 128, "Port") != true)                                 
    // 	return false; 
    
    for(var i=0 ; i< MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT.length;i++){
        if( MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].RadioBand != TARGET_BAND)
            continue
        else
            target_band = TARGET_BAND
        
        MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].WifiMode=$("#wifi_mode_select"+target_band).val();
        MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Bw=$("#wifi_bw_select"+target_band).val();
        MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Channel=$("#wifi_channel_select"+target_band).val();
        //MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].MaxClients=$("#id_maxclients"+target_band).val();
        MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Enabled=$("#SSID_enable"+target_band).val();

        /*
        if($("#short_gi_btn"+target_band).parent().prop('class') == "el-switch is-checked")
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].ShortGI='1';
        else
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].ShortGI='0';
        
        if($("#wmm_btn"+target_band).parent().prop('class') == "el-switch is-checked")
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Wmm='1';
        else
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Wmm='0';
        
        if($("#atf_btn"+target_band).parent().prop('class') == "el-switch is-checked")
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Atf='1';
        else
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Atf='0';
        
        if($("#txbf_btn"+target_band).parent().prop('class') == "el-switch is-checked")
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Txbf='1';
        else
            MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Txbf='0';
        */
    }
    
    if (MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[1].Enabled == 0){
        pop_confirm(L.error_message.lang_error45_msg,Mesh_and_MLO_confirmed);
    } // if
    else{
        loading_control(1);
        set_obj_data(MODIFIED_OBJ_DATA)
    }
}
    
function set_obj_data(obj_content){
    if(typeof(obj_content) == 'string')
    API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
    else if(typeof(obj_content) == 'object')
    API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
}

function current_channel_layput(band, channel){
    $current = $( "<span><b>Current Channel:"+channel+"</b></span>" )
    $( "#select_wifi_channel_select"+band ).append( $current );
}

function get_info_success_cb(obj) {
    var data = API.obj.copy(obj);
    var checked = 0
    data.WlanStatus.forEach((row, index) => {
        if (checked == 1)
            return
        if(row.RadioBand != '5')
            return

        if ( 'undefined' != typeof(row.Channel) ){
            current_channel_layput('5',row.Channel)
            checked = 1
        }
    });
    
}

function get_info_error_cb(obj) {
    if(obj.api_return == 403) {
        logout('sto');
    }
}

function getWlanStatus(){
    API.info.get(INFO_LIST, get_info_success_cb, get_info_error_cb);
}

function get_obj_success_cb(obj) { 
    ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
    MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
    getWlanStatus()
    layout_init();
    loading_control(0);
} 

function set_obj_success_cb(obj) {
    //show_alert(L.common.success_title, L.common.save_success);
    ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
    loading_wait_wireless_restart()
}

function set_obj_error_cb(obj) {
    //show_alert(L.common.fail_title, L.common.save_fail)
    loading_control(0)
    alert("set fail");
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