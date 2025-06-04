page_tag='basic_setting-wan-port'
var row_size = 6;
//var row_size = $("input[name='lan1']").length;
$(document).ready(function(){
        $.lang_load("basic_setting_wan_port");
        page_initial()
});
function callback(){

}
function get_obj_success_cb(obj) {
        ORIGINAL_OBJ_DATA = API.obj.copy(obj);
        MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);
        gen_table()
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
function port_refresh(){
        get_obj_data(OBJ_LIST)
}
function layout_init(){
                var obj = MODIFIED_OBJ_DATA.WanPortBound.WanPortBoundP
                var obj_id =['PortLan1','PortLan2','PortLan3','PortLan4','PortSsid1','PortSsid2','PortSsid3','PortSsid4','PortSsid5','PortSsid6','PortSsid7','PortSsid8']
                var lan_id =['LAN1','LAN2','LAN3','LAN4','SSID1','SSID2','SSID3','SSID4','SSID5','SSID6','SSID7','SSID8']
                var tmp = '<th colspan="1" rowspan="1" class="el-table_3_column_12 is-center"><div class="cell">#</div></th>'
                var tmp_list = []
                for(var i=0;i<MODIFIED_OBJ_DATA.Wan.WanT.length;i++){
                        tmp += eval('\'<th colspan="1" rowspan="1" class="el-table_3_column_'+(13+i)+' is-center"><div class="cell">'+MODIFIED_OBJ_DATA.Wan.WanT[i].ConnectionName+'</div></th>\'')
                        tmp_list.push("WAN"+(i+1))
                }
                                        
                $("#bnn").html(tmp)
                for(var i=0;i<12;i++){
                        if(eval('obj.'+obj_id[i]+'')!="")
                                switch_style( eval('$("input[name=\''+lan_id[i] +'\']")') , tmp_list.indexOf(eval('obj.'+obj_id[i]+'')))
                }
}
function get_index(obj){
        for(var i=0;i<row_size;i++){
                if(obj[i].className == "el-checkbox__input is-checked"){
                        return i+1;
                }
        }
        return "0"
}
function page_save(){
                
                var obj = MODIFIED_OBJ_DATA.WanPortBound.WanPortBoundP
                var obj_id =['PortLan1','PortLan2','PortLan3','PortLan4','PortSsid1','PortSsid2','PortSsid3','PortSsid4','PortSsid5','PortSsid6','PortSsid7','PortSsid8']
                var lan_id =['LAN1','LAN2','LAN3','LAN4','SSID1','SSID2','SSID3','SSID4','SSID5','SSID6','SSID7','SSID8']
                for(var i=0;i<12;i++){
                        if(typeof(eval('$("input[name=\''+lan_id[i] +'\']:checked")').val())!="undefined"){
                                eval('obj.'+obj_id[i]+'='+ '\'WAN'+eval('$("input[name=\''+lan_id[i] +'\']:checked")').val() +'\'')
                        }
                }
                
                set_obj_data(MODIFIED_OBJ_DATA)
}


function set_obj_success_cb(obj) {
                //show_alert(L.common.success_title, L.common.save_success);
                ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
                // loading_wait_300s()
                loading_wait()
}
function set_obj_error_cb(obj) {
                loading_control(0)
                //show_alert(L.common.fail_title, L.common.save_fail)
}
function set_obj_data(obj_content){
        if(typeof(obj_content) == 'string')
                API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
        else if(typeof(obj_content) == 'object')
                API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
}
function gen_table(){
                var content = ""
                var lan_id =['LAN1','LAN2','LAN3','LAN4','SSID1','SSID2','SSID3','SSID4','SSID5','SSID6','SSID7','SSID8']
                for(var i=0;i<12;i++){
                        content += '<tr class="el-table__row">\
                                <td class="el-table__header el-table_3_column_12 is-center">\
                                <div class="cell">'+lan_id[i]+'</div></td>'
                        for(var j=0;j<6;j++){
                                content += eval('\'<td class="el-table_3_column_'+ (13+j) +' is-center">\'')
                                content += '<div class="cell" style="line-height: 30px; ">'
                                content += eval('\'<label class="radio-inline"><input style="margin-top: -6px;" value="'+(j+1)+'" type="radio" name="'+lan_id[i]+'" onclick="switch_style(this)">\'')
                                content += '<span class="ais-fiber-label-normal"><span class="multi_lang" id=""></span></span></label></div></td>'
                        }
                content += '</tr>'
                }
                $("#inn").html(content)
}
function switch_style(obj, val){
                if(typeof(val) != "undefined")
                        obj[val].setAttribute("checked", "checked")
}
function loading_wait(){
        var process_percentage = 0
        var bar_timer
        var intervalTimes = env_loading_time[0]/100
    
        loading_control(1)
        $("#loading_message").html(L.common.lang_plz_wait+"<br/>0%")
    
        bar_timer = setInterval(function(){
                process_percentage = process_percentage + 1
                $("#loading_message").html(L.common.lang_plz_wait+"<br/>"+process_percentage+"%")
                if( 100 == process_percentage ){
                        clearInterval(bar_timer)
                        loading_control(0);
                }
        },intervalTimes);
}

