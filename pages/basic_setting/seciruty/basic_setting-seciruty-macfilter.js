	page_tag='basic_setting-seciruty-macfilter'
	lang_tag='basic_setting_seciruty_macfilter'
	$(document).ready(function(){
		$.lang_load(lang_tag);
		page_initial()
	});
	function obj_table_prepare(src_data, target_data, name_prefix){
		var id = 0
		src_data.forEach(function(element) {
			element.name = ""+name_prefix+id;
			target_data.push(element)
			id++
		});
	}
	function filter_list_layout(){
		var filter_table_content=""
		var id = 0
		FILTER_DATA.forEach(function(element) {
			number = id+1
			element.Number=number
			element.TB_ACTION={"delete":"delete_macfilter_item("+id+")"}
			id++
		});
		update_table('macfilter_table', FILTER_DATA, FILTER_COLUMNS_LIST_VALUE)
	}
	
	function filter_mode_layout(mode){
		if(mode == 'b')
			$("#macfilter_mode_title").html(L.basic_setting_seciruty_macfilter.lang_macfilter_mode_blacklist)
		else
			$("#macfilter_mode_title").html(L.basic_setting_seciruty_macfilter.lang_macfilter_mode_whitelist)
	}
	
	function macfilter_enable_handler(enable){
		var need_save = false
		if( 'undefined' == typeof(enable) ){
			enable = $("#macfilter_enable").val()
			need_save = true
		}
			
		if( "0" == enable){
			$(".macfilter_emabled_show").hide()
		}else{
			$(".macfilter_emabled_show").show()
		}
		
		if(need_save)
			page_save()
	}
	var FILTER_DATA_SRC
	var CURRENT_FILTER_MODE
	function filter_data_layout(filter_mode){
		
		CURRENT_FILTER_MODE = filter_mode
		
		if( 'blacklist' == filter_mode ){
			$("#mode_blacklist").prop("checked", true);
			FILTER_DATA_SRC = "MacFilterBlack"
			filter_mode_layout('b')
		}else if( 'whitelist' == filter_mode ){
			$("#mode_whitelist").prop("checked", true);
			FILTER_DATA_SRC = "MacFilterWhite"
			filter_mode_layout('w')
		}
				
		FILTER_DATA = []
		obj_table_prepare(eval('MODIFIED_OBJ_DATA.'+FILTER_DATA_SRC+'.'+FILTER_DATA_SRC+'T'), FILTER_DATA,'macfilter')
		filter_list_layout()
	}
	function page_layout(obj){
			
		switcher_handler('macfilter_enable',obj.MacFilter.MacFilterP.Enable,"macfilter_enable_handler('"+obj.MacFilter.MacFilterP.Enable+"')")
		
		var filter_mode=obj.MacFilter.MacFilterP.Mode
		
		
		filter_data_layout(filter_mode)		
	} 
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		
		//test data start
		/*		
		var test_data = {"Mac":"2","Comment":"10"}
		var test_data2 = {"Mac":"3","Comment":"3333"}
		
		MODIFIED_OBJ_DATA.MacFilter.MacFilterP.Enable="1"
		MODIFIED_OBJ_DATA.MacFilter.MacFilterP.Mode="whitelist"
		
		MODIFIED_OBJ_DATA.MacFilterWhite.MacFilterWhiteT[0]=test_data
		MODIFIED_OBJ_DATA.MacFilterWhite.MacFilterWhiteT[1]=test_data2
		*/		
		//test data end
		
		page_layout(MODIFIED_OBJ_DATA)
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
	
	function macfilter_mode_selector(macfilter_mode){
		if( 'b' ==  macfilter_mode)
			CURRENT_FILTER_MODE = 'blacklist'
		else
			CURRENT_FILTER_MODE = 'whitelist'
			
		filter_mode_layout(macfilter_mode)
		filter_data_layout(CURRENT_FILTER_MODE)
		
		//page_save()
	}

	function valid_mac_exist(){
		
		for(var i=0; i<FILTER_DATA.length;i++){
			if($('#macfilter_smac').val()==FILTER_DATA[i].Mac){
				alert(L.error_message.lang_error6_msg);
				return false;
			}
		}
		return true;
	}
	function valid_mac_format(){
		if(valid_mac_17($('#macfilter_smac')[0])!=true){
			alert(L.error_message.lang_error7_msg);
			return false;
		}
		return true;
	}

	function add_macfilter_item(){
		var item={}
		
		if(valid_mac_format()!=true){
				return false
		}
		if(FILTER_DATA.length!=0){
			if(valid_mac_exist()!=true){
				return false
			}
		}
		runtime_id=FILTER_DATA.length
		item.name = "mft"+runtime_id;
				
		item.Mac = $("#macfilter_smac").val()
		item.Comment = $("#macfilter_comment").val()
		
		FILTER_DATA.push(item)
		
		MODIFIED_OBJ_DATA.MacFilter.MacFilterP.Enable=$("#macfilter_enable").val()
		MODIFIED_OBJ_DATA.MacFilter.MacFilterP.Mode=CURRENT_FILTER_MODE
		
		if( 'blacklist' == CURRENT_FILTER_MODE ){
			MODIFIED_OBJ_DATA.MacFilterBlack.MacFilterBlackT=FILTER_DATA
		}else if( 'whitelist' == CURRENT_FILTER_MODE ){
			MODIFIED_OBJ_DATA.MacFilterWhite.MacFilterWhiteT=FILTER_DATA
		}
		
		page_layout(MODIFIED_OBJ_DATA)
	}
	
	function delete_macfilter_item(item_id){
		FILTER_DATA.splice(item_id, 1);
		
		MODIFIED_OBJ_DATA.MacFilter.MacFilterP.Enable=$("#macfilter_enable").val()
		MODIFIED_OBJ_DATA.MacFilter.MacFilterP.Mode=CURRENT_FILTER_MODE
		
		if( 'blacklist' == CURRENT_FILTER_MODE ){
			MODIFIED_OBJ_DATA.MacFilterBlack.MacFilterBlackT=FILTER_DATA
		}else if( 'whitelist' == CURRENT_FILTER_MODE ){
			MODIFIED_OBJ_DATA.MacFilterWhite.MacFilterWhiteT=FILTER_DATA
		}
		
		page_layout(MODIFIED_OBJ_DATA)
	}
	
	function set_obj_success_cb(obj) {
		if(obj.api_return != 0){
			set_obj_error_cb(obj)
			return;
		}
		setTimeout(function(){
			loading_control(0)
			//pop_alert_message(L.common.lang_success_msg,'success')
			get_obj_data(OBJ_LIST)
		}, 5000);
	
	}
	function set_obj_error_cb(obj) {
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			setTimeout(function(){
				loading_control(0)
				//pop_alert_message(L.common.lang_error_msg,'error')
			}, 2000);
			
		}
	}
	function set_obj_data(obj_content){
		loading_control(1);
		
		if(typeof(obj_content) == 'string')
			API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
		else if(typeof(obj_content) == 'object')
			API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
	}
	
	function save_mode(){
		page_save()
	}
	
	function page_save(){
		//if(CURRENT_FILTER_MODE == "whitelist" &&  !confirm(L.basic_setting_seciruty_macfilter.lang_whitelist_save_confirm_msg))
		//	return;
		
		MODIFIED_OBJ_DATA.MacFilter.MacFilterP.Enable=$("#macfilter_enable").val()
		
		set_obj_data(MODIFIED_OBJ_DATA)
	}