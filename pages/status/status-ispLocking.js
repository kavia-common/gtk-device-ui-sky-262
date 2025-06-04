page_tag='status-ispLocking'
$(document).ready(function(){
    $.lang_load("status_ispLocking");
    page_initial()
});
function get_info_success_cb(obj) {
INFO_DATA = API.obj.copy(obj);
$('#IspStatus').text(INFO_DATA.IspLocking.status)
}
function get_info_error_cb(obj) {
if(obj.api_return == 403) {
logout('sto');
}
}
function get_info_data(info_list){
API.info.get(info_list, get_info_success_cb, get_info_error_cb);
}
function page_initial(){
//Coding initial function here
get_info_data(INF_LIST)
} 
