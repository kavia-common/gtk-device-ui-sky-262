	page_tag='basic_setting-wlan-wifi_chs5'
	$(document).ready(function(){
		$.lang_load("basic_setting_wlan_wifi_chs5");
		page_initial()
}); 
	function callback(){
	
	} 
	var current_idx=0;

	function radio_toggle(obj){
		//alert(obj.id);
		if(obj.id == "customize_btn"){
			$("#customize_btn").parent().attr('class','el-radio__input is-checked');
			$("#auto_btn").parent().attr('class','el-radio__input');
			$("#customize_list").show();
		}else{
			$("#customize_btn").parent().attr('class','el-radio__input');
			$("#auto_btn").parent().attr('class','el-radio__input is-checked');
			$("#customize_list").hide();
		}
	}
	
	function chexkbox_toggle(obj,val){
		if(val == "1"){
			$(obj).parent().attr('class','el-checkbox__input is-checked')
			//$(obj).parent().parent().attr('class','el-checkbox is-checked')
		}else if(val == "0"){
			$(obj).parent().attr('class','el-checkbox__input')
			//$(obj).parent().parent().attr('class','el-checkbox')
		}else{
			if($(obj).parent().prop('class') == "el-checkbox__input is-checked"){
				$(obj).parent().attr('class','el-checkbox__input')
				//$(obj).parent().parent().attr('class','el-checkbox')
			}else{
				$(obj).parent().attr('class','el-checkbox__input is-checked')
				//$(obj).parent().parent().attr('class','el-checkbox is-checked')
			}
		}
		
	}

	function layout_init(){
		gen_label()
		change_idx(1);
	}


        function gen_label(){
			var content = ""
			for(var i=0;i<channel_list.length;i++){
				content += '<label data-v-111e589b="" role="checkbox" aria-checked="true" class="el-checkbox">'
				content += eval('\'<span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner" id="c'+channel_list[i]+'_btn" onclick="chexkbox_toggle(this)"></span>\'')
				content += eval('\'<input type="checkbox" aria-hidden="true" class="el-checkbox__original" value="'+channel_list[i]+'">\'')
				content += eval('\'</span><span class="el-checkbox__label"><span class="multi_lang" id="lang_channel"></span> '+L.basic_setting_wlan_wifi_chs5.lang_channel+' '+channel_list[i]+'</span></label>\'')
			}
			$("#inn").html(content)
	}
	
	function update_list(){
		var i;
		for(i=0;i<channel_list.length;i++){
			//chexkbox_toggle($("#c"+channel_list[i]+"_btn"),1);
			for(var j=0;j<oridata.length;j++){
				if(oridata[j]==channel_list[i]){
					chexkbox_toggle($("#c"+channel_list[i]+"_btn"),1);
				}
			}
		}
	}
	
	var channel_list=['36','40','44','48','52','56','60','64','100','104','108','112','116','120','124','128','132','136','140','149','153','157','161','165'];
	var oridata=[];
	function change_idx(idx){
		current_idx= idx;
		var tmpobj;
		if(MODIFIED_OBJ_DATA.WlanChSelect.WlanChSelectT[idx].ChSelected=="auto"){
			tmpobj=document.getElementById("auto_btn");
			radio_toggle(tmpobj)
		}else{
			tmpobj=document.getElementById("customize_btn");
			oridata = MODIFIED_OBJ_DATA.WlanChSelect.WlanChSelectT[idx].ManualChList.split(',');
			radio_toggle(tmpobj)
		}
		update_list(channel_list);

	}
	function page_save(){
		loading_control(1);
		var save_ch_list_data;
		if($("#auto_btn").parent().prop('class') == "el-radio__input is-checked"){
			save_ch_list_data="auto";
		}else{
			var tmplist=[];
			for(var i=0;i<channel_list.length;i++){
				if($("#c"+channel_list[i]+"_btn").parent().prop('class') == "el-checkbox__input is-checked"){
					tmplist.push(channel_list[i]);
				}
			}
			save_ch_list_data= tmplist.toString();
		}
		
		if (save_ch_list_data == 'auto')
			MODIFIED_OBJ_DATA.WlanChSelect.WlanChSelectT[current_idx].ChSelected='auto';
		else{
			MODIFIED_OBJ_DATA.WlanChSelect.WlanChSelectT[current_idx].ChSelected='manual';
			MODIFIED_OBJ_DATA.WlanChSelect.WlanChSelectT[current_idx].ManualChList=save_ch_list_data;
		}
		
		set_obj_data(MODIFIED_OBJ_DATA)
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
		setTimeout(function(){
			loading_control(0)
		}, loading_time[0]);
	} 
	
	function set_obj_error_cb(obj) {
		//show_alert(L.common.fail_title, L.common.save_fail)
		if(obj.api_return == 403){
			logout('sto')
			return;
		}else{
			pop_alert_message(L.common.lang_error_msg,'error')
		}
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
