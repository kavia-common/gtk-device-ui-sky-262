page_tag='adv_setting-parental_control'
lang_tag='adv_setting_parental_control'
$(document).ready(function(){
	$.lang_load(lang_tag);
	page_initial()
});

// Block Specific Sites - [ TargetName ]
function updateSuffix(newValue) {
        let element = $("#lang_pc_block_site_title");
        let baseText = "Block Specific Sites";
        element.text(`${baseText} - [ ${newValue} ]`);
}

function _prepare_layout(obj) {
	var i;
	var content = "";

	$('#restrict_internet_access').empty();
	for (i = 0; i < obj.length; ++i){
		$('#restrict_internet_access').append("<option value='"+obj[i].TargetMac.toLowerCase()+"'>"+obj[i].TargetName+"( "+obj[i].TargetMac.toLowerCase()+" )</option>");
		updateSuffix(obj[i].TargetName);
	}

	$('#schedule_never').attr("value","0");
	$('#schedule_always').attr("value","1");
	$('#schedule_spectime').attr("value","2");
	$('#schedule_specific').attr("value","3");

	for (i = 1; i <= 8; ++i) {
		/* content += "<div class=\"el-form-item el-form-item--mini\">";
		content += "<label class=\"el-form-item__label\" style=\"width: 180px;\">"+L.adv_setting_parental_control.lang_pc_url_title+"&nbsp;"+i+"&nbsp;:</label>";
		content += "<div class=\"el-form-item__content\" style=\"margin-left: 180px;\">";
		content += "<div class=\"el-input el-input--mini\"><input type=\"text\" autocomplete=\"off\" class=\"el-input__inner\" id=\"url_"+i+"\" onblur=\"valid_url(this,SPACE_NO)\"></div>";
		content += "<div class=\"el-form-item__error\" id=\"url_"+i+"_error\"></div>";
		content += "</div>";
		content += "</div>"; */
		content += '\
			<div class="row">\
				<div class="input-field no-padding-hr-l">\
					<input class="form-control hidden-dom-removal col-xs-12 col-sm-6" id=\"url_'+i+'\" name=\"'+i+'\" type="text" onblur=\"valid_url(this,SPACE_NO)\">\
					<label class="row active ng-binding" for=\"'+i+'\"><span class="multi_lang" >'+L.adv_setting_parental_control.lang_pc_url_title+'&nbsp;'+i+'&nbsp;:</span></label>\
					<span class="error" id=\"url_'+i+'_error\" style="display:none"></span>\
				</div>\
			</div>\
		';
	}

	$('#div_block_site').html(content);
}

function set_ui_init(obj) {
	_prepare_layout(obj.PcPolicy.PcPolicyT);

	if (obj.PcPolicy.PcPolicyT.length > 0) {
		$('#restrict_internet_access').val(obj.PcPolicy.PcPolicyT[0].TargetMac.toLowerCase());

		if (obj.PcPolicy.PcPolicyT[0].BlockType == "0" || obj.PcPolicy.PcPolicyT[0].BlockType == "2") {
			pc_blocktype_radio_selected("3");
			pc_blocktype_radio_selected(obj.PcPolicy.PcPolicyT[0].BlockType);
		}
		else
			pc_blocktype_radio_selected(obj.PcPolicy.PcPolicyT[0].BlockType);

		for (i = 1; i <= 8; ++i)
			$("#url_"+i).val(eval("obj.PcPolicy.PcPolicyT[0].BlockUrl"+i));
	}
	else {
		pc_blocktype_radio_selected("3");
		pc_blocktype_radio_selected("0");
		$('input[id^="url_"]').val("");
	}

	$('#pc_enabled').val(obj.Pc.PcP.Enable);
	switcher_handler('pc_enabled', obj.Pc.PcP.Enable, "pc_enable_switched()");
	set_dev_list_init();
}

function set_dev_list_init() {
	var i, j, exist;
	var hostname = "";
	$('#dev_list').empty();
	var dev_list = INFO_DATA.DhcpClientT.Clients;
	var cur_dev_list = $('#restrict_internet_access')[0].options;

	for (i = 0; i < dev_list.length; ++i) {
		for (j = 0, exist = 0; j < cur_dev_list.length; ++j) {
			if (cur_dev_list[j].value.toLowerCase() == dev_list[i].Mac.toLowerCase()) {
				exist=1;
				break;
			}
		}

		if (exist == 1)
			continue;

		if (dev_list[i].HostName == "unknown")
			hostname = L.adv_setting_parental_control.lang_pc_unknow_dev_title;
		else
			hostname = dev_list[i].HostName;

		$('#dev_list').append('<option value='+dev_list[i].Mac.toLowerCase()+'>'+hostname+'( '+dev_list[i].Mac.toLowerCase()+' )</option>');
	}
}

function set_pc_forgot_pwd_init() {
	var obj = MODIFIED_OBJ_DATA.Pc.PcP;

	$('#pc_quest').text(obj.Question);
}

function set_dev_rename_init() {
	var name = $('#restrict_internet_access').find(":selected").text();

	$('#dev_name').text(' '+name);
	$('#dev_new_name').val(name);
}

function _pase_url(url) {
	var new_url;
	var matches = url.match(/(?:\w+\:\/\/)?(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);

	// find & remove protocol (http, ftp, etc.) and get hostname
	// domain will be null if no match is found
	new_url = matches && matches[1];

	if (typeof(new_url) == 'undefined' || new_url === null)
		return null;

	// remove first and last '.'
	new_url = new_url.replace(/^\.?|\.?$/g, "");
	if (typeof(new_url) == 'undefined' || new_url === null)
		return null;

	if (new_url.lastIndexOf('.') == -1)
		new_url += ".com";

	return new_url;
}
function valid_url(I,space_no) {
	var hostname;
	var matches = I.value.match(/(?:\w+\:\/\/)?(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);

	// $(I).closest('div.el-form-item').removeClass("is-error");
	// $(I).closest('div.el-form-item').removeClass("is-success");

	// allow empty string
	if (I.value == "") {
		// $(I).closest('div.el-form-item').addClass("is-success");
		$('#'+I.id+'_error').css("display","none");
		return true;
	}

	hostname = matches && matches[1];

	if (typeof(hostname) == 'undefined' || hostname === null) {
		// $(I).closest('div.el-form-item').addClass("is-error");
		$('#'+I.id+'_error').css("display","");
		return false;
	}

	// $(I).closest('div.el-form-item').addClass("is-success");
	$('#'+I.id+'_error').css("display","none");
	return true;
}
function valid_pc_devname(I) {
	// $(I).closest('div.el-form-item').removeClass("is-error");
	// $(I).closest('div.el-form-item').removeClass("is-success");

	if (!valid_name(I, 'DeviceName', 0) || $('#dev_new_name').val() == "") {
		// $(I).closest('div.el-form-item').addClass("is-error");
		$('#dev_new_name_error').css("display","");
		return false;
	}
	
	// $(I).closest('div.el-form-item').addClass("is-success");
	$('#dev_new_name_error').css("display","none");
	return true;
}
function valid_pc_password() {
	var pwd = $('#pc_pwd').val();
	var vpwd = $('#pc_verify_pwd').val();
	var re = new RegExp("[^a-zA-Z0-9]+","gi");

	// $('#pc_pwd').closest('div.el-form-item').removeClass("is-error");
	// $('#pc_pwd').closest('div.el-form-item').removeClass("is-success");
	// $('#pc_verify_pwd').closest('div.el-form-item').removeClass("is-error");
	// $('#pc_verify_pwd').closest('div.el-form-item').removeClass("is-success");

	if (pwd.length < 4 || pwd.length > 32 || re.test(pwd)) {
		$('#pc_pwd_error').text(L.adv_setting_parental_control.lang_pc_password_format_error_title);
		// $('#pc_pwd').closest('div.el-form-item').addClass("is-error");
		$('#pc_pwd_error').css("display","");
		return false;
	}
	if (vpwd.length < 4 || vpwd.length > 32 || re.test(vpwd)) {
		$('#pc_pwd_error').text(L.adv_setting_parental_control.lang_pc_password_format_error_title);
		// $('#pc_verify_pwd').closest('div.el-form-item').addClass("is-error");
		$('#pc_pwd_error').css("display","");
		return false;
	}

	if (pwd != vpwd) {
		$('#pc_pwd_error').text(L.adv_setting_parental_control.lang_pc_password_nomatch_title);
		// $('#pc_verify_pwd').closest('div.el-form-item').addClass("is-error");
		$('#pc_pwd_error').css("display","");
		return false;
	}

	$('#pc_pwd_error').text("");
	// $('#pc_pwd').closest('div.el-form-item').addClass("is-success");
	// $('#pc_verify_pwd').closest('div.el-form-item').addClass("is-success");
	$('#pc_pwd_error').css("display","none");
	return true;
}
function valid_quest_ans() {
	var quest = $('#pc_quest').val();
	var ans = $('#pc_ans').val();

	// $('#pc_quest').closest('div.el-form-item').removeClass("is-error");
	// $('#pc_quest').closest('div.el-form-item').removeClass("is-success");
	// $('#pc_ans').closest('div.el-form-item').removeClass("is-error");
	// $('#pc_ans').closest('div.el-form-item').removeClass("is-success");

	if (quest == "") {
		$('#pc_qa_error').text(L.adv_setting_parental_control.lang_pc_qa_empty_error_title);
		// $('#pc_quest').closest('div.el-form-item').addClass("is-error");
		$('#pc_qa_error').css("display","");
		return false;
	}
	if (ans == "") {
		$('#pc_qa_error').text(L.adv_setting_parental_control.lang_pc_qa_empty_error_title);
		// $('#pc_ans').closest('div.el-form-item').addClass("is-error");
		$('#pc_qa_error').css("display","");
		return false;
	}

	$('#pc_qa_error').text("");
	// $('#pc_quest').closest('div.el-form-item').addClass("is-success");
	// $('#pc_ans').closest('div.el-form-item').addClass("is-success");
	$('#pc_qa_error').css("display","none");
	return true;
}

function _set_specific_time_select_obj(obj) {
	var index = $('#restrict_internet_access').find(":selected").index();

	if (index < 0 || index >= obj.length) {
		_set_specific_time_select_default();
		return;
	}

	$('#schoolnight_start').val(obj[index].WorkdayTimeStart);
	$('#schoolnight_end').val(obj[index].WorkdayTimeStop);
	$('#weekend_start').val(obj[index].WeekendTimeStart);
	$('#weekend_end').val(obj[index].WeekendTimeStop);
}
function _set_specific_time_select_default() {
	$('#schoolnight_start').val('21:00');
	$('#schoolnight_end').val('7:00');
	$('#weekend_start').val('00:00');
	$('#weekend_end').val('7:00');
}

function _set_elements_enable() {
	var conn_dev_list = INFO_DATA.DhcpClientT.Clients;
	var dev_list_len = $('#restrict_internet_access option').length;
	var addListExist = 1;
	for (var i=0; i < conn_dev_list.length; i++){
		for (var j=0; j < dev_list_len; j++){
			if (conn_dev_list[i].Mac.toLowerCase() == $('#restrict_internet_access option')[j].value.toLowerCase()){
				addListExist = 0;
				break;
			}
			addListExist = 1;				
		}
		if(addListExist == 1)
			break;
	}
	$('#restrict_internet_access').removeAttr("disabled");

	if (conn_dev_list.length > 0 && addListExist == 1 && dev_list_len < MAX_DEV_NUM) {
		$('#pc_dev_add').removeAttr("disabled");
		// $('#pc_dev_add').removeClass("is-disabled");
	}
	else {
		$('#pc_dev_add').attr("disabled",true);
		// $('#pc_dev_add').addClass("is-disabled");
	}

	if (dev_list_len > 0) {
		$('#pc_dev_remove').removeAttr("disabled");
		$('#pc_dev_rename').removeAttr("disabled");
		// $('#pc_dev_remove').removeClass("is-disabled");
		// $('#pc_dev_rename').removeClass("is-disabled");
		$('input[id^="schedule_"]').removeAttr("disabled");
		$('input[id^="url_"]').removeAttr("disabled");
		// $('input[id^="url_"]').closest('div.el-input').removeClass("is-disabled");

		if ($('#schedule_spectime').prop("checked"))
		{
			pc_blocktype_radio_selected("3");
			pc_blocktype_radio_selected("2");
		}
		else if ($('#schedule_always').prop("checked"))
			pc_blocktype_radio_selected("1");
		else
		{
			pc_blocktype_radio_selected("3");
			pc_blocktype_radio_selected("0");
		}
	}
	else {
		$('#pc_dev_remove').attr("disabled",true);
		$('#pc_dev_rename').attr("disabled",true);
		// $('#pc_dev_remove').addClass("is-disabled");
		// $('#pc_dev_rename').addClass("is-disabled");
		$('input[id^="schedule_"]').attr("disabled",true);
		$('input[id^="url_"]').attr("disabled",true);
		// $('input[id^="url_"]').closest('div.el-input').addClass("is-disabled");
		pc_blocktype_radio_selected("3");
		pc_blocktype_radio_selected("0");
	}
}

function pc_enable_switched() {
	var pc_enable = $('#pc_enabled').val();

	if (pc_enable == '1') {
		_set_elements_enable();
	}
	else {
		$('#restrict_internet_access').attr("disabled",true);
		$('button[id^="pc_dev_"]').attr("disabled",true);
		// $('button[id^="pc_dev_"]').addClass("is-disabled");
		$('input[id^="schedule_"]').attr("disabled",true);
		$('select[id^="schoolnight_"]').attr("disabled",true);
		// $('select[id^="schoolnight_"]').addClass("is-disabled");
		$('select[id^="weekend_"]').attr("disabled",true);
		// $('select[id^="weekend_"]').addClass("is-disabled");
		$('input[id^="url_"]').attr("disabled",true);
		// $('input[id^="url_"]').closest('div.el-input').addClass("is-disabled");
	}
	/* PLEASE HELP TO CHECK THIS FUNCTION
	update_selected("restrict_internet_access");
	 */
}

// device selected
function pc_device_selected(index,mac) {
	var i,j;
	var obj = MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT;
	for (i = 0; i < obj.length; ++i) {
		if (obj[i].TargetMac == mac.toUpperCase() || obj[i].TargetMac == mac) {
			updateSuffix(obj[i].TargetName);
			pc_blocktype_radio_selected(obj[i].BlockType);

			for (j = 1; j <= 8; ++j)
				eval('$("#url_'+j+'").val(obj['+i+'].BlockUrl'+j+')');
			break;
		}
	}
}

function pc_blocktype_radio_selected(type) {
	var index=$('#restrict_internet_access').find(":selected").index();
	var blockType="0";

	if(type == "3" || type == "1")
		$('input[name="radio_schedule"][value="'+type+'"]').prop("checked",true);
	else
		$('input[name="radio_schedule_specific"][value="'+type+'"]').prop("checked",true);

	// 0:Never, 1:Always, 2:Specific times, 3: Specific
	if (type == "3") {
		$("#radio_radio_schedule_specific").show();
		if (index >= 0) {
			blockType=MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[index].BlockType;
			if (blockType == "1")
				pc_blocktype_radio_selected("0");
			else
				pc_blocktype_radio_selected(blockType);
		}
	}
	else if (type == "2") {
		$('select[id^="schoolnight_"]').removeAttr("disabled");
		$('select[id^="weekend_"]').removeAttr("disabled");
		// $('select[id^="schoolnight_"]').removeClass("is-disabled");
		// $('select[id^="weekend_"]').removeClass("is-disabled");
		$("#radio_radio_schedule_specific").show();
		$("#pc_school_schedule_select").show();
		$("#pc_weekend_schedule_select").show();
		$("#pc_block_site_title").hide();
		$("#pc_div_block_site").hide();
		_set_specific_time_select_obj(MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT);
	}
	else if (type == "1") {
		$("#radio_radio_schedule_specific").hide();
		$('select[id^="schoolnight_"]').attr("disabled",true);
		$('select[id^="weekend_"]').attr("disabled",true);
		$("#radio_radio_schedule_specific").hide();
		$("#pc_school_schedule_select").hide();
		$("#pc_weekend_schedule_select").hide();
		$("#pc_block_site_title").hide();
		$("#pc_div_block_site").hide();
		// $('select[id^="schoolnight_"]').addClass("is-disabled");
		// $('select[id^="weekend_"]').addClass("is-disabled");
		_set_specific_time_select_default();
	}
	else {
		$('select[id^="schoolnight_"]').attr("disabled",true);
		$('select[id^="weekend_"]').attr("disabled",true);
		$("#radio_radio_schedule_specific").show();
		$("#pc_school_schedule_select").hide();
		$("#pc_weekend_schedule_select").hide();
		$("#pc_block_site_title").show();
		$("#pc_div_block_site").show();
		// $('select[id^="schoolnight_"]').addClass("is-disabled");
		// $('select[id^="weekend_"]').addClass("is-disabled");
		_set_specific_time_select_default();
	}
}

function pc_device_add() {
	var dev_name = $('#dev_list').find(":selected").text();
	if (dev_name === "") {
		return;
	}
	var mac = $('#dev_list').find(":selected").val().toLowerCase();
	var obj = MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT;
	var pc_obj={};

	if (typeof(dev_name) == "undefined" || dev_name == "") {
		//pop_alert_message(L.adv_setting_parental_control.lang_pc_dev_select_empty_title,"error",3000);
		$('#dev_list_error').css("display","");
		return;
	}

	$('#restrict_internet_access').append("<option value='"+mac+"'>"+dev_name+"( "+mac.toLowerCase()+" )</option>");
	$('#restrict_internet_access').val(mac);

	var hostname_mac = $('#restrict_internet_access').text();
	updateSuffix(hostname_mac);

	pc_obj.gid='0';
	pc_obj.name='PcPolicyT0';
	pc_obj.TargetName = dev_name;
	pc_obj.TargetMac = mac;
	pc_obj.BlockType = '0';
	pc_obj.WorkdayTimeStart = '21:00';
	pc_obj.WorkdayTimeStop = '7:00';
	pc_obj.WeekendTimeStart = '00:00';
	pc_obj.WeekendTimeStop = '7:00';
	for (var i=1; i <= 8; ++i)
		eval('pc_obj.BlockUrl'+i+'=""');
	obj.push(pc_obj);

	pc_device_selected($('#restrict_internet_access').find(":selected").index(),$('#restrict_internet_access').find(":selected").val());
			_set_elements_enable();
	close_dialog();
}
function pc_device_remove() {
	var obj = MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT;
	var index = $('#restrict_internet_access').find(":selected").index();
	if(index==-1){
		return;
	}
	var mac = $('#restrict_internet_access').find(":selected").val().toLowerCase();

	for (var i = 0; i < obj.length; ++i) {
		if (obj[i].TargetMac.toLowerCase() == mac) {
			obj.splice(i,1);
			break;
		}
	}
	$('#restrict_internet_access').find(":selected").remove();

	// select orogin index
	if (index >= $('#restrict_internet_access option').length)
		index = $('#restrict_internet_access option').length-1;

	$('#restrict_internet_access option').eq(index).prop('selected', true);

	pc_device_selected($('#restrict_internet_access').find(":selected").index(),$('#restrict_internet_access').find(":selected").val());
	_set_elements_enable();
}

function pc_device_rename_pop() {
	var index = $('#restrict_internet_access').find(":selected").index();
	if(index==-1){
		return;
	}
	_pop_diag('pc-dev-rename','set_dev_rename_init()');
}

function pc_device_rename() {
	var dev_new_name = $('#dev_new_name').val();
	var obj = MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT;
	var mac = $('#restrict_internet_access').find(":selected").val().toLowerCase();

	if (!valid_pc_devname($('#dev_new_name')[0]))
		return;

	for (var i = 0; i < obj.length; ++i) {
		if (obj[i].TargetMac.toLowerCase() == mac) {
			obj[i].TargetName = dev_new_name;
			break;
		}
	}

	$('#restrict_internet_access').find(":selected").text(dev_new_name);
	close_dialog();
}

function pc_save_password_qa() {
	if (!valid_pc_password() || !valid_quest_ans())
					return;

			MODIFIED_OBJ_DATA.Pc.PcP.Pwd = $('#pc_pwd').val();
			MODIFIED_OBJ_DATA.Pc.PcP.Question = $('#pc_quest').val();
			MODIFIED_OBJ_DATA.Pc.PcP.Ans = $('#pc_ans').val();

	close_dialog();
	page_save();
}

function pc_password_auth() {
	var auth_pwd = $('#pc_auth_pwd').val();

	// $('#pc_auth_pwd').closest('div.el-form-item').removeClass("is-error");
	// $('#pc_auth_pwd').closest('div.el-form-item').removeClass("is-success");

	if (auth_pwd == "" || auth_pwd != MODIFIED_OBJ_DATA.Pc.PcP.Pwd) {
		// $('#pc_auth_pwd').closest('div.el-form-item').addClass("is-error");
		$('#pc_auth_pwd_error').css("display","");
		return;
	}

	// $('#pc_auth_pwd').closest('div.el-form-item').addClass("is-success");
	$('#pc_auth_pwd_error').css("display","none");

	close_dialog();
	page_save();
}

function pc_answer_auth() {
	var auth_ans = $('#pc_auth_ans').val();

	// $('#pc_auth_ans').closest('div.el-form-item').removeClass("is-error");
	// $('#pc_auth_ans').closest('div.el-form-item').removeClass("is-success");

	if (auth_ans == "" || auth_ans != MODIFIED_OBJ_DATA.Pc.PcP.Ans) {
		// $('#pc_auth_ans').closest('div.el-form-item').addClass("is-error");
		$('#pc_auth_ans_error').css("display","");
		return;
	}

	// $('#pc_auth_ans').closest('div.el-form-item').addClass("is-success");
	$('#pc_auth_ans_error').css("display","none");

	close_dialog();
	_pop_diag("pc-dev-password");
}

function _pop_diag(name,cb) {
	var action = [];
	var confirm_action = "";

	if (name == "pc-dev-list")
		confirm_action = "pc_device_add();";
	else if (name == "pc-dev-rename")
		confirm_action = "pc_device_rename();";
	else if (name == "pc-dev-password")
		confirm_action = "pc_save_password_qa();";
	else if (name == "pc-dev-auth")
		confirm_action = "pc_password_auth();";
	else if (name == "pc-dev-forgot-pwd")
		confirm_action = "pc_answer_auth();";
	else
		confirm_action = "close_dialog();";

	action = [{"style":"default","text":L.common.lang_cancel_btn_title,"action":"close_dialog()"},{"style":"primary","text":L.common.lang_confirm_btn_title,"action":confirm_action}];

	pop_dialog(name,action,cb);
	// $('.el-dialog__title').text(L.adv_setting_parental_control.lang_pc_title);
}

function pc_applied() {
	var obj = MODIFIED_OBJ_DATA.Pc.PcP;

	if (obj.Pwd == "" || obj.Question == "" || obj.Ans == "")
		// fist time setting password and Q&A
		_pop_diag("pc-dev-password");
	else
		// after setting, use password to auth
		_pop_diag("pc-dev-auth");
}
function pc_refresh() {
	get_obj_data(OBJ_LIST);
}

function page_save() {
	var i,j;
	var index=$('#restrict_internet_access').find(":selected").index();
	var radio_schedule_checked;

	MODIFIED_OBJ_DATA.Pc.PcP.Enable = $('#pc_enabled').val();

	if (index >= 0) {
		radio_schedule_checked = $('input[name="radio_schedule"]:checked').val();
		if (radio_schedule_checked == "3")
			MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[index].BlockType = $('input[name="radio_schedule_specific"]:checked').val();
		else
			MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[index].BlockType = $('input[name="radio_schedule"]:checked').val();
		MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[index].WorkdayTimeStart = $('#schoolnight_start').val();
		MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[index].WorkdayTimeStop = $('#schoolnight_end').val();
		MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[index].WeekendTimeStart = $('#weekend_start').val();
		MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[index].WeekendTimeStop = $('#weekend_end').val();

		for (i = 1; i <= 8; ++i) {
			var tmp_url = _pase_url($('#url_'+i).val());
			if (typeof(tmp_url) == 'undefined' || tmp_url === null)
				tmp_url = "";

			eval('MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT['+index+'].BlockUrl'+i+'=tmp_url');
		}
	}

	for (i = 0; i < MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT.length; ++i) {
		for (j = 0; j < ORIGINAL_OBJ_DATA.PcPolicy.PcPolicyT.length; ++j) {
			if (MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[i].TargetMac.toLowerCase() == ORIGINAL_OBJ_DATA.PcPolicy.PcPolicyT[j].TargetMac.toLowerCase()) {
				// use gid that we get from object
				MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[i].gid = ORIGINAL_OBJ_DATA.PcPolicy.PcPolicyT[j].gid;
				break;
			}
		}
		MODIFIED_OBJ_DATA.PcPolicy.PcPolicyT[i].name = 'PcPolicyT'+i;
	}

	loading_control(1);
	set_obj_data(MODIFIED_OBJ_DATA);
}

function set_obj_success_cb(obj) {
	setTimeout(function () {
		loading_control(0);
	},SAVE_PC_WAITING_TIME);
} 
 function set_obj_error_cb(obj) {
	loading_control(0);

	if (obj.api_return == 403) {
		logout('sto')
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
	set_ui_init(MODIFIED_OBJ_DATA);
} 
 function get_obj_error_cb(obj) { 
	if (obj.api_return == 403) {
		logout('sto');
	}
} 
function get_obj_data(obj_list){ 
	API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
}

function get_info_success_cb(obj) {
	INFO_DATA = API.obj.copy(obj);
	get_obj_data(OBJ_LIST);
}
function get_info_error_cb(obj) {
	if (obj.api_return == 403) {
		logout('sto');
	}
}
function get_info_data(info_list) {
	API.info.get(info_list, get_info_success_cb, get_info_error_cb);
} 
function page_initial(){
	//Coding initial function here
	loading_control(1);
	get_info_data(INFO_LIST);
	setTimeout(function(){
		loading_control(0);
	},1000)
}
