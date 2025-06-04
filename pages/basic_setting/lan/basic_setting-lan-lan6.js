page_tag='basic_setting-lan-lan6'
$(document).ready(function(){
    $.lang_load("basic_setting_lan_lan6");
    page_initial()
}); 
function callback(){

} 

function v6server_change(mode){
    if( "undefined" != typeof(mode) && mode != "" )
        selected_mode = mode
    else
        selected_mode=$("#v6server_mode").val()

    if( "11" == selected_mode )
        $(".stateful_only").show()
    else
        $(".stateful_only").hide()
}

 function get_obj_success_cb(obj) { 
    ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
    MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
    layout_init(); 
} 
 function get_obj_error_cb(obj) { 
    if (obj.api_return == 403) {
        logout('sto');
    }
} 
function get_obj_data(obj_list){ 
    API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
} 
function page_initial(){
    //Coding initial function here
    get_obj_data(OBJ_LIST) 
}
function switch_toggle(id,val){
    if(typeof(val) == "undefined" || val == "2"){  // val: 2 is from GUI trigger
        val = $('#'+id).val()
    }

    if(val == '1') {
        if(id=="managed_flag"){
            MODIFIED_OBJ_DATA.Lanv6.Lanv6P.ManagedFlag = "1";
        }
        if(id=="other_flag"){
            MODIFIED_OBJ_DATA.Lanv6.Lanv6P.OtherConfigFlag = "1";
        }
        if(id=="dhcp6s_enable"){
            MODIFIED_OBJ_DATA.Lanv6.Lanv6P.Dhcp6sEnable = "1";
                $(".v6server_enabled").show()
            if(MODIFIED_OBJ_DATA.Lanv6.Lanv6P.Ipv6Mode == "0")
                $("#div_lan_manual").show()

            v6server_change()
        }
    }
    else {
        if(id=="managed_flag"){
            MODIFIED_OBJ_DATA.Lanv6.Lanv6P.ManagedFlag = "0";
        }
        if(id=="other_flag"){
            MODIFIED_OBJ_DATA.Lanv6.Lanv6P.OtherConfigFlag = "0";
        }
        if(id=="dhcp6s_enable"){
            MODIFIED_OBJ_DATA.Lanv6.Lanv6P.Dhcp6sEnable = "0";
            $(".v6server_enabled").hide()
            if(MODIFIED_OBJ_DATA.Lanv6.Lanv6P.Ipv6Mode == "0")
                $("#div_lan_manual").hide()
        } 
    }

    switcher_handler(id,val)
}

function switch_radio(obj){
    if(obj.id=="ipv6_manual"){
        MODIFIED_OBJ_DATA.Lanv6.Lanv6P.Ipv6Mode = '0'
        $("#div_lan_manual").show()
    }
    else if(obj.id=="ipv6_auto"){
        MODIFIED_OBJ_DATA.Lanv6.Lanv6P.Ipv6Mode = '1'
        $("#div_lan_manual").hide()
    }
}
function layout_init(){
    var obj = MODIFIED_OBJ_DATA.Lanv6.Lanv6P
    $("#max_ra").val(obj.MaxRA)
    $("#min_ra").val(obj.MinRA)
    $("#start_ip").val(obj.StartAddress)
    $("#end_ip").val(obj.EndAddress)
    $("#ip_prefix").val(obj.Ipv6prefix)
    $("#dns").val(obj.Ipv6dns)
    $("#prefix_set").val(obj.Ipv6prefixset)
    $("#dhcp6s_enable").val(obj.Dhcp6sEnable)

    if(obj.Dhcp6sEnable=="1")
        switch_toggle('dhcp6s_enable','1')
    else
        switch_toggle('dhcp6s_enable','0')
    if(obj.Ipv6Mode=="1") {
        switch_radio($('#ipv6_auto')[0])
        $("#ipv6_auto").prop("checked", true)
    }
    else {
        switch_radio($('#ipv6_manual')[0])
        $("#ipv6_manual").prop("checked", true)
    }

    if (obj.ManagedFlag=="1" && obj.OtherConfigFlag=="1"){
        update_select('v6server_mode', dhcpv6_server_select_str, dhcpv6_server_select_val,'v6server_change()', '11');
        v6server_change('11')
    }else if(obj.ManagedFlag=="0" && obj.OtherConfigFlag=="0"){
        update_select('v6server_mode', dhcpv6_server_select_str, dhcpv6_server_select_val,'v6server_change()', '00');
        v6server_change('00')
    }else if(obj.ManagedFlag=="0" && obj.OtherConfigFlag=="1"){
        update_select('v6server_mode', dhcpv6_server_select_str, dhcpv6_server_select_val,'v6server_change()', '01');
        v6server_change('01')
    }

    //reload lang after update_select
    $.lang_load("basic_setting_lan_lan6");
}

function valid_ip6addr(ip6addr,check_prefixlen) {
    var tmp;
    var reg = /[0-9A-Fa-f]/g;

    if (typeof(ip6addr) == 'undefined')
            return false;

    //if (ip6addr.indexOf(':') == -1 || if (ip6addr.indexOf('/') == -1))
    tmp = (ip6addr.match(/:/g) || []).length;
    if (tmp <= 0 || tmp > 8)
            return false;

    if (check_prefixlen) {
            tmp = (ip6addr.match(/\//g) || []).length;
            if (tmp <=0 || tmp > 1)
                    return false;
    }

    if (!reg.test(ip6addr))
            return false;

    return true;
}

function calc_adv_interval() {
    var MAXRAINTERVAL = 1800;
    var MINRAINTERVAL = 3;
    var ramax = $("#max_ra").val();
    var ramin = $("#min_ra").val();

    if (ramax > MAXRAINTERVAL)
        ramax = MAXRAINTERVAL;
    else if (ramax < 4)
        ramax = 4;

    if (ramin < MINRAINTERVAL)
        ramin = MINRAINTERVAL;
    else if (ramin > ((ramax * 3) / 4))
        ramin = (ramax >= 9) ? ramax/3 : ramax;

    $("#max_ra").val(ramax);
    $("#min_ra").val(ramin);
}

function page_save(){
    var obj = MODIFIED_OBJ_DATA.Lanv6.Lanv6P
    
    // check ipv6 address when ipv6 mode is manual
    if (MODIFIED_OBJ_DATA.Lanv6.Lanv6P.Ipv6Mode == "0") {
        if (!valid_ip6addr($("#ip_prefix").val(),true)){
            warning_control('on','page',L.error_message.lang_error37_msg)
            return;
        }
        if (!valid_ip6addr($("#prefix_set").val(),true)){
            warning_control('on','page',L.error_message.lang_error37_msg)
            return;
        }
        if ($("#dns").val() != "::" && !valid_ip6addr($("#dns").val(),false)){
            warning_control('on','page',L.error_message.lang_error37_msg)
            return;
        }
    }

    calc_adv_interval();

    obj.MaxRA = $("#max_ra").val()
    obj.MinRA = $("#min_ra").val()
    obj.StartAddress = $("#start_ip").val()
    obj.EndAddress = $("#end_ip").val()
    obj.Ipv6prefix = $("#ip_prefix").val()
    obj.Ipv6dns = $("#dns").val()
    obj.Ipv6prefixset = $("#prefix_set").val()
    var smode = $("#v6server_mode").val()
    if( smode == "11" ){
        obj.ManagedFlag="1"
        obj.OtherConfigFlag="1"
    }else if( smode == "01" ){
        obj.ManagedFlag="0"
        obj.OtherConfigFlag="1"
    }else{
        obj.ManagedFlag="0"
        obj.OtherConfigFlag="0"
    }

    loading_control(1);

    delete MODIFIED_OBJ_DATA.WlanGlobal;

    set_obj_data(MODIFIED_OBJ_DATA)
}
function set_obj_success_cb(obj) {
    //show_alert(L.common.success_title, L.common.save_success);
    if( "1" == ORIGINAL_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable){
        loading_time=page_loading_time.mlo_enabled.lan6
    }else{
        loading_time=page_loading_time.mlo_disabled.lan6
    }
    
    ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);

    loading_wait_control(loading_time, "page_initial()")
}
function set_obj_error_cb(obj) {
    loading_control(0);
    //show_alert(L.common.fail_title, L.common.save_fail)
    if (obj.api_return == 403) {
            logout('sto');
    }
}
function set_obj_data(obj_content){
    if(typeof(obj_content) == 'string')
            API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
    else if(typeof(obj_content) == 'object')
            API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
}
function refresh(){
    page_initial()
}