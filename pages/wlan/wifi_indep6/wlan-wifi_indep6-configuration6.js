page_tag='basic_setting-wlan-wifi_adv6'
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

function select_wifi_mode_select(band) {
    var M =document.getElementById("wifi_mode_select6");
    var mode = M.options[M.selectedIndex].value;
    if (mode != "bea") {
        if (MODIFIED_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable == 1 ) {
            alert(L.error_message.lang_error43_msg);
            $("#wifi_mode_select" + band).val("bea");
            return;
        } // if
    } // if 

    if (mode == "ax" ) {
        $("#wifi_bw_select" + band).find("option[value='mixed']").hide();
        $("#wifi_bw_select" + band).val("mixed160");
    } 
    else if ( mode == "bea" ) {
        $("#wifi_bw_select" + band).find("option[value='mixed']").show();
        $("#wifi_bw_select" + band).val("mixed");
    }
}

function init_wifi_mode_select(band) {
    var M =document.getElementById("wifi_mode_select6");
    var mode = M.options[M.selectedIndex].value;
    if (mode == "ax" )
    $("#wifi_bw_select" + band).find("option[value='mixed']").hide();
}

function SSID_enable_handler(enabled){
    if( 'undefined' == typeof(enabled) ){
    enabled = $("#SSID_enable6").val()
    }
    switcher_handler('SSID_enable6',enabled)

}


function select_wifi_bw_select(){
    
}

function select_wifi_channel_select(){
    
    var ch = document.getElementById("wifi_channel_select6");
    var bw = document.getElementById("wifi_bw_select6")
    var value = ch.options[ch.selectedIndex].value;

    if (value == 233){ /* channel 233 */
        bw.options[0].disabled = true; /* 20 / 40 / 80 / 160 / 320MHz */
        bw.options[1].disabled = true; /* 20 / 40 / 80 / 160 MHz */
        bw.options[2].disabled = true; /* 20 / 40 / 80 MHz */
        bw.options[3].disabled = true; /* 20 / 40 MHz */

        if (bw.selectedIndex == 0 || bw.selectedIndex == 1 || bw.selectedIndex == 2 || bw.selectedIndex == 3){ /* only remain 20 MHz */
            bw.selectedIndex = 4; /* 20 MHz */
        }
    }
    else if (value == 229 || value == 225){
        bw.options[0].disabled = true;
        bw.options[1].disabled = true;
        bw.options[2].disabled = true;
        bw.options[3].disabled = false;

        if (bw.selectedIndex == 0 || bw.selectedIndex == 1 || bw.selectedIndex == 2){ /* remain to 20 / 40 MHz */
            bw.selectedIndex = 3; /* 20 / 40 MHz */
        }
    }
    else {
        bw.options[0].disabled = false;
        bw.options[1].disabled = false;
        bw.options[2].disabled = false;
        bw.options[3].disabled = false;
    }
}

function layout_init(){

    if ( 0 == MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled){
        $("#SSID_enable6").parent("div").removeClass("is-checked");
    }
    SSID_enable_handler(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled);
    var target_band
    for(var i=0 ; i< MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT.length;i++){
        if( MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].RadioBand != TARGET_BAND)
            continue
        else
            target_band = TARGET_BAND
        $("#wifi_mode_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].WifiMode)
        $("#wifi_bw_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Bw)
        $("#wifi_channel_select"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].Channel)
        //$("#id_maxclients"+target_band).val(MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[i].MaxClients)
        init_wifi_mode_select(target_band);
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
    
    if (MODIFIED_OBJ_DATA.WlanDeviceRadio.WlanDeviceRadioT[2].Enabled == 0){
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

function get_obj_success_cb(obj) { 
    ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
    MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
    
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