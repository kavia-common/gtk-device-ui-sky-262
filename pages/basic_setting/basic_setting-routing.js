page_tag='basic_setting-routing'
lang_tag='basic_setting_routing'
var STR_DATA

$(document).ready(function(){
	$.lang_load(lang_tag);
	page_initial()
});

function insert_str_item(item, origin_id){
	if(typeof(origin_id) != "undefined"){
		STR_DATA[origin_id]=item
	}else{
		STR_DATA.push(item)
	}
	str_table_layout()
}

function str_table_layout(){
	var str_table_content=""
	var id = 0
	
	//Prepare table data
	/*
	[
		{"desc":"1",
		"DstIp":"1.1.1.1",
		"DstNetmask":"192.168.1.1",
		"Gateway":"1.1.1.1",
		"Ifname":"lan",
		"name":"str0",
		"Metric":"",
		"TB_ACTION":{"edit":"update_str_item(0)","delete":"delete_str_item(0)"} //if every record need action, please add TB_ACTION, and the action allow 'edit' and 'delete' for now
		},
		{"desc":"2",
		"DstIp":"2.2.2.2",
		"DstNetmask":"192.168.1.1",
		"Gateway":"1.1.1.1",
		"Ifname":"wan",
		"name":"str1",
		"Metric":"",
		"TB_ACTION":{"edit":"update_str_item(1)","delete":"delete_str_item(1)"}
		}
	]
	*/
	STR_DATA.forEach(function(element) {
		if ( 'undefined' == typeof(element.name) ){
			element.name = "str"+id;
		}
		if ( 'undefined' == typeof(element.Metric) ) {
			element.Metric = ""
		}
		element.Ifname = element.Ifname.toUpperCase()
		//{"action":"callback function"}
		element.TB_ACTION={"edit":"update_str_item("+id+")","delete":"delete_str_item("+id+")"}
		id++
	});

	//Use update_table() to update table content, $1 is table tbody ID, $2 is table data, $3 is which columns need to display
	update_table('staticroute_table', STR_DATA, STROUTE_COLUMNS_LIST_VALUE)
}

 function get_obj_success_cb(obj) { 
	ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
	MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 

			
	//test data start
	/*
	var test_data = {"desc":"1","DstIp":"1.1.1.1","DstNetmask":"192.168.1.1","Gateway":"1.1.1.1","Ifname":"lan"}
	var test_data2 = {"desc":"2","DstIp":"2.2.2.2","DstNetmask":"192.168.1.1","Gateway":"1.1.1.1","Ifname":"wan"}
	
	MODIFIED_OBJ_DATA.StaticRoute.StaticRouteT[0] = test_data
	MODIFIED_OBJ_DATA.StaticRoute.StaticRouteT[1] = test_data2
	ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA); 
	*/
	//test data end
	
	STR_DATA=[];
	for(i=0;i<MODIFIED_OBJ_DATA.StaticRoute.StaticRouteT.length;i++){
		insert_str_item(MODIFIED_OBJ_DATA.StaticRoute.StaticRouteT[i]);
	}
	
	str_table_layout()
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

function update_str_item(item_id){
	action=[{"style":"default","text":"Cancel","action":"close_dialog()"},{"style":"primary","text":"Confirm","action":"save_str_item('"+item_id+"')"}]
	if( 'new' == item_id)
		pop_dialog('strt',action, 'str_item_layout("new")')
	else
		pop_dialog('strt',action, "str_item_layout("+item_id+")")
}

function delete_str_item(item_id){
	STR_DATA.splice(item_id, 1);
	page_save()
}

function str_item_layout(id){
	var iface_val = []
	var iface_str = []
	var keep_list_wan = true
	MODIFIED_OBJ_DATA.Wan.WanT.forEach(function(element) {
		if (keep_list_wan){
			iface_val.push(element.ConnectionName)
			iface_str.push(element.ConnectionName)
		}
		
		if ( G_MULTI_WAN_SUPPORTED == "0")
			keep_list_wan = false	
	});
	
	iface_val.push('lan')
	iface_str.push('LAN')
	
	if( 'undefined' != typeof(id) && 'undefined' != typeof(STR_DATA[id]) ){
		switcher_handler('str_item_enable',STR_DATA[id].Enable)
		
		$("#str_item_name").val(STR_DATA[id].name)
		$("#str_item_ipaddr").val(STR_DATA[id].DstIp)
		$("#str_item_netmask").val(STR_DATA[id].DstNetmask)
		$("#str_item_gw").val(STR_DATA[id].Gateway)
		$("#str_item_metric").val(STR_DATA[id].Metric)
							
		update_select('str_item_iface', iface_str, iface_val,'', STR_DATA[id].Ifname)
	}else if( 'new' == id ){
		switcher_handler('str_item_enable',"1")
		update_select('str_item_iface', iface_str, iface_val,'', 'lan')
	}		
}

function insert_str_item(item, origin_id){
	if(typeof(origin_id) != "undefined"){
		STR_DATA[origin_id]=item
	}else{
		STR_DATA.push(item)
	}
	str_table_layout()
}
function Validatemask(inputText){
	var ipformat = /^^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/gm;
	if(inputText.match(ipformat)){
		return true;
	}
	else{
		return false;
	}
}
function ValidRouteName(inputText){
	if (inputText.length < 1) {
		return false;
	}else if( inputText.length > 30 ){
		return false;	
	}

	var re = new RegExp("[^\\x20-\\x7E]+", "g");
	if (re.test(inputText)) {
		return false;
	}
	
	return true;
}
function valid_value(){
	if(ValidRouteName($("#str_item_name").val())!=true){
		alert(L.error_message.lang_route_name_error_msg);
		return false;
	}
	if(ValidateIPaddress($("#str_item_ipaddr").val())!=true){
		alert(L.error_message.lang_error16_msg);
		return false;
	}
	if(Validatemask($("#str_item_netmask").val())!=true){
		alert(L.error_message.lang_error23_msg);
		return false;
	}
	if(ValidateIPaddress($("#str_item_gw").val())!=true){
		alert(L.error_message.lang_error18_msg);
		return false;
	}
	if(valid_range($('#str_item_metric')[0], 1, 9999, 'Port')!=true){
		return false;
	}
	return true;
}
function save_str_item(id){

	if(valid_value()!=true)
		return false;
	var item={}
	
	item.name=$("#str_item_name").val()
	item.DstIp=$("#str_item_ipaddr").val()
	item.DstNetmask=$("#str_item_netmask").val()
	item.Gateway=$("#str_item_gw").val()
	item.Metric=$("#str_item_metric").val()
	item.Enable=$("#str_item_enable").val()
	item.Ifname=$("#str_item_iface").val()
			
	if('new' != id)
		insert_str_item(item, id)
	else{
		// runtime_id=STR_DATA.length
		// item.name = "str"+runtime_id;
		insert_str_item(item)
	}
	close_dialog()
	
	page_save()
}
function set_obj_success_cb(obj) {
	loading_control(0)
	if(obj.api_return != 0){
		set_obj_error_cb(obj)
		return;
	}
	//pop_alert_message(L.common.lang_success_msg,'success')
	
	get_obj_data(OBJ_LIST)
}
function set_obj_error_cb(obj) {
	loading_control(0)
	if(obj.api_return == 403){
		logout('sto')
		return;
	}else{
		warning_control('on', 'page',L.common.lang_error_msg)
	}
}
function set_obj_data(obj_content){
	if(typeof(obj_content) == 'string')
		API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
	else if(typeof(obj_content) == 'object')
		API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
}
function page_save(){
	loading_control(1)

	MODIFIED_OBJ_DATA.StaticRoute.StaticRouteT=STR_DATA
	
	delete MODIFIED_OBJ_DATA.Wan;

	set_obj_data(MODIFIED_OBJ_DATA)
}