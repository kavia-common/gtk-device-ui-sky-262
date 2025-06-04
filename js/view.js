var EDIT_ICON="img/icons/icon-1/edit.svg"
var DELETE_ICON="img/icons/icon-1/delete.svg"
var MORE_ICON="img/icons/icon-1/gemtek-more.svg"
var MORE_TRIGGER_ICON="img/icons/icon-1/gemtek-less.svg"

function sidebarControl() {
	var windowwidth = $(window).width();
	var bodyClass = $('body').hasClass('mmc');
	if (windowwidth >= 768 && bodyClass) {
		$('.sidebarItem').each(function() {
			$(this).removeClass('open');
		})
	} else {
		$('.sidebarItem').each(function() {
			if ($(this).children().hasClass('menuitem-highlight')) {
				$(this).addClass('open');
			}
		})
	}
}

function loading_element_initial() {
	const anlottie = lottie.loadAnimation({
		container: ajaxLoaderIcon,
		animType: 'svg',
		loop: true,
		autoplay: true,
		path: 'js/loading.json',
	});
	anlottie.play();
}

function common_element_loader() {
	//loading 
	//var loading='<div class="el-loading-mask" style="display: ;"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div><div><span class="el-loading-spinner-message" id="loading_message"></span></div></div>'
	//$( "body" ).append( loading );
}

function element_initial() {
	common_element_loader()
	loading_element_initial()
	$(document).on("click", "#content-wrapper", function() {
		if ($(".language").is(':visible')) {
			$(".language").removeClass('language-toggle');
		}
	});
	//For Theme toggle Icons change
	//Language Block Hide/Show
	$(".notification").click(function() {
		$(".notificationdiv").toggle();
		if ($(".language").show()) {
			$(".language").hide();
		}
	});
}

function layout_resize() {
	var windowheight = $(window).height();
	var windowwidth = $(window).width();
	// $(window).on('beforeunload', function () {
	//     return "You should keep this page open.";
	// });
	$("#content-wrapper").css("min-height", windowheight);
	//For Menu Toggle
	$(document).on("click", "#main-menu-toggle", function() {
		$('body').toggleClass("mmc mme");
		sidebarControl();
		if ($("#main-navbar-collapse").hasClass("in")) {
			$("#main-navbar-collapse").removeClass('in');
		}
	});
	$(window).resize(function() {
		sidebarControl();
	})
}

function draw_wan_list(wan_obj, id, sel){
	var wan_list_str = []
	var wan_list_val = []
	var i=1
	wan_obj.forEach(function(element) {
		if (element.Enabled == '1') {
			wan_list_str.push(element.ConnectionName)
			wan_list_val.push("WAN"+i)
		}
		i++
	});
	
	update_select(id, wan_list_str, wan_list_val,'', '')
	
	if('undefined' != typeof(sel) && "" != sel )
		$("#"+id).val(sel)	
}

function main_header_handler() {
	//show login User Account
	if ( 'undefined' != typeof(localStorage.gUA) ){
		$("#login_account_user").html(localStorage.gUA)
	}
}

function set_select_width(name, width) {
	var obj = [name],
		prt = null;
	if (name.length && typeof name == 'string') obj = document.getElementsByName(name);
	if (obj.length) obj = obj[0];
	else return;
	prt = obj.parentNode || obj.parentElement;
	prt.style.minWidth = 'auto';
	prt.style.width = width;
}

function get_selected_idx(vals, val) {
	for (var i = 0; i < vals.length; i++)
		if (vals[i] == val) return i;
	return 0;
}

function draw_radio_btn(id, name, str, cb) {
	var cb_html = ""
	if ('undefined' != typeof(cb) && "" != cb) cb_html = 'onclick="' + cb + '"'
	html = '<label class="radio-inline"><input id="' + id + '" type="radio" name="' + name + '" ' + cb_html + '><span class="ais-fiber-label-normal"><span class="multi_lang" id="lang_' + str + '">' + str + '</span></span></label>'
	$("#radio_" + id).html(html)
}

function update_select(name, str, val, evt, sel, pop) {
	if (typeof str == 'undefined') str = [];
	if (typeof val == 'undefined') val = [];
	if (typeof evt == 'undefined') evt = '';
	sel = get_selected_idx(val, sel);
	var hvsl = false,
		attr = '',
		html = '\
		<select type="text" class="dropdown-toggle form-control1 hidden-dom-removal" id="' + name + '" name="' + name + '" onchange="' + evt + '">\
		';
	for (var i = 0; i < str.length; i++) {
		attr = '';
		if (i == sel) attr = 'selected';
		html += '\
		<option value="' + val[i] + '" ' + attr + ' class="multi_lang" id="lang_' + str[i] + '">' + str[i] + '</option>\
		';
	}
	html += '\
	</select>\
	</div>\
	</div>\
	';
	if (typeof(pop) == 'undefined') $("div[id='select_div_" + name + "']").html(html)
	else if (typeof(pop) != 'undefined' && pop == 1) document.write(html);
	return {
		width: function(width) {
			set_select_width(name, width);
		}
	}
}

function draw_select(name, str, val, evt, sel, label_lang_id, col_leng ) {
	if (typeof str == 'undefined') str = [];
	if (typeof val == 'undefined') val = [];
	if (typeof evt == 'undefined') evt = '';
	if ('undefined' == typeof(col_leng))
		col_leng = "5"
	sel = get_selected_idx(val, sel);
	var hvsl = false,
		attr = '',
		html = '\
		<div class=" row ng-show">\
		<label class="col-xs-12 no-padding-hr-l control-label gemtek-dropdown-label" ><span class="multi_lang" id="'+label_lang_id+'">'+label_lang_id+'</span></label>\
		<div id="select_div_'+name+'" class="no-padding-hr-l col-xs-12 col-sm-'+col_leng+'" style="margin-top: 20px;">\
		<select type="text" class="dropdown-toggle form-control1 hidden-dom-removal" id="' + name + '" name="' + name + '" onchange="' + evt + '">\
		';
	for (var i = 0; i < str.length; i++) {
		attr = '';
		if (i == sel) attr = 'selected';
		html += '\
		<option value="' + val[i] + '" ' + attr + ' class="multi_lang" id="lang_' + str[i] + '">' + str[i] + '</option>\
		';
	}
	html += '\
	</select>\
	</div>\
	</div>\
	</div>\
	</div>\
	';
	$("div[id='select_" + name + "']").html(html)
}

function draw_btn(type, id, cb, text) {
	var input_class=''
	var btn_html=''
	
	if(type == 'apply'){
		input_class='gemtek-btn-primary'
		btn_txt=L.common.lang_apply_btn_title
	}
	else{
		btn_txt=L.common.lang_cancel_btn_title
		input_class='gemtek-btn-normal'
	}
	
	if ( "undefined" != typeof(text) )
		btn_txt=text

	btn_html = '\
	<input class="'+input_class+'" id="'+id+'" type="button" value="'+btn_txt+'" onclick="'+cb+'" multi_lang_id="'+btn_txt+'"></input>\
	';
	$("#btn_"+id).html(btn_html)
}

//id:switch element ID
//str:switch element ID
function draw_switch(id, multi_lang_id, cb) {
	var sw_html = ""
	
	sw_html = '\
	<div class="row switchblock gemtek-switchblock-no-padding-left gemtek-toggle-label">\
	<label class="control-label" for="'+id+'"><span class="multi_lang" id="'+multi_lang_id+'">'+multi_lang_id+'</span></label>\
	<div class="text-left">\
	<span class="switch hidden-dom-removal" id="switch_layout_'+id+'" onclick="switcher_handler(\''+id+'\',\'\',\''+cb+'\')"><small></small>\
	<input id="'+id+'" type="checkbox" name="" value="" style="display:none">\
	<span class="switch-text"><span class="off">OFF</span></span>\
	</span>\
	</div>\
	</div>\
	';

	$("#switch_"+id).html(sw_html)
}

function draw_input(id, multi_lang_id, placeholder, onblur, max_len, col_leng) {
	var input_html = ""
	var onblur_html = ""
	if ( 'undefined' != typeof(onblur) )
		onblur_html='onblur="'+onblur+'"'

	var max_len_html = ""
	if ( 'undefined' != typeof(max_len) )
		max_len_html='maxlength="'+max_len+'"'

	if ('undefined' == typeof(col_leng))
		col_leng = "5"

	input_html = '\
	<div class="row">\
	<div class="input-field no-padding-hr-l col-xs-12 col-sm-'+col_leng+'">\
	<input class="form-control hidden-dom-removal" id="'+id+'" name="'+id+'" placeholder="'+placeholder+'" required="required" type="text" '+max_len_html+' '+onblur_html+'>\
	<label class="row active ng-binding" for="'+id+'"><span class="multi_lang" id="'+multi_lang_id+'">'+multi_lang_id+'</span></label>\
	<span class="error" id="'+id+'_error_msg" style="display:none">* This Field is Required</span>\
	</div>\
	</div>\
	';

	$("#input_"+id).html(input_html)
}

function draw_checkbox(id, multi_lang_id, cb) {
	var checkbox_html = ""
	
	checkbox_html = '\
	<div class="row checkbox-top-align">\
	<div class="no-padding-hr col-sm-12 col-md-12 col-lg-12 col-xs-12 text-left">\
	<div class="checkbox1">\
	<input class="hidden-dom-removal ng-pristine ng-untouched ng-valid" id="'+id+'" name="'+id+'" type="checkbox"><label class="checkbox1_left_align" for="'+id+'" onclick="'+cb+'" ><span class="multi_lang" id="'+multi_lang_id+'"></span></label>\
	</div>\
	</div>\
	</div>\
	';

	$("#checkbox_"+id).html(checkbox_html)
}

function draw_password(id, multi_lang_id, placeholder, onblur, max_len) {
	var onblur_html = ""
	if ( 'undefined' != typeof(onblur) )
		onblur_html='onblur="'+onblur+'"'

	var max_len_html = ""
	if ( 'undefined' != typeof(max_len) )
		max_len_html='maxlength="'+max_len+'"'

	var password_html = ""
	
	password_html = '\
	<div class="input-field no-padding-hr-l col-xs-6 col-sm-12">\
	<input class="form-control hidden-dom-removal" id="'+id+'" type="password" name="" placeholder="'+placeholder+'" required="required" type="text" '+max_len_html+' '+onblur_html+'>\
	<label class=" row active ng-binding" for="'+id+'"><span class="multi_lang" id="'+multi_lang_id+'">'+multi_lang_id+'</span></label>\
	<span class="error" id="'+id+'_error_msg" style="display:none">* This Field is Required</span>\
	</div>\
	<div class="pwdtoggle">\
	<input class="" id="password_display_'+id+'" type="checkbox" ><label id="" onclick="password_display_control(this)" class="checkbox_right_align showpw" for="'+id+'"></label>\
	</div>\
	';

	$("#pwinput_"+id).html(password_html)
}

function draw_table_plus_btn(body_id, columns, tb_title_lang_id, btn_icon_class, btn_text_lang_id, cb) {
	var table_html = ""
	table_html = 
			'<div class="ip-panel-heading gemtek-mb-0">\
				<span class="multi_lang" id="'+tb_title_lang_id+'">'+tb_title_lang_id+'</span> <a class="gemtek-btn-normal gemtek-btn-addplus" onclick="'+cb+'"><i class="fa '+btn_icon_class+' icontxtgap"></i> <span class="multi_lang" id="'+btn_text_lang_id+'">'+btn_text_lang_id+'</span></a>\
			</div>\
			<div class="gemtek-panel-p20 no-padding-hr">\
				<div class="">\
					<table class="table_txt_align_v theme_intel no-margin-vr">\
						<thead>\
							<tr>'
							$.each(columns, function(column_index, columns_data) {
								table_html=table_html+'<th class="" id=""><span class="multi_lang" id="'+columns_data+'">'+columns_data+'</span></th>'
							});
	table_html = table_html+'</tr>\
						</thead>\
						<tbody id="'+body_id+'">\
						</tbody>\
					</table>\
				</div>\
			</div>'
	$("#tb_"+body_id).html(table_html)
}

function draw_table(body_id, columns, records) {
	var table_html = ""
	
	table_html = '<table class="table tableCount theme_intel" id=""><thead class=""><tr>';
	$.each(columns, function(column_index, columns_data) {
		table_html=table_html+'<th class="" id=""><span class="multi_lang" id="'+columns_data+'">'+columns_data+'</span></th>'
	});
	table_html=table_html+'</tr></thead><tbody id="'+body_id+'"></tbody></table>';

	$("#tb_"+body_id).html(table_html)
}

function update_table(body_id, records, show_columns, ext_td_class, start_index) {
	var table_html = ""
	if('undefined' != typeof(start_index)){
		var tr_index = start_index
	}else
		var tr_index = 0
	var td_class=""
	if('undefined' != typeof(ext_td_class)){
		td_class = ext_td_class
	}
	if('undefined' != typeof(records)){
		$.each(records, function(records_index, records_data) {
			table_html = table_html + '<tr id="'+body_id+'_id_'+tr_index+'">'
			$.each(show_columns, function(show_index, show_column) {
				if("TB_ACTION" == show_column){
					
					show_action_list = eval("records_data." + show_column)
					
					table_html = table_html +'<td class="no-padding-hr '+td_class+'">'
					$.each(show_action_list, function(ac_index, ac_data) {
						if('edit'== ac_index)
							table_html = table_html +'<button class="btn btn-xs table-btn-txt edit_btn" onclick="'+ac_data+'"><img src="'+EDIT_ICON+'"></button>'
						else if('delete'== ac_index)
							table_html = table_html +'<button class="btn btn-xs table-btn-txt del_btn" onclick="'+ac_data+'"><img src="'+DELETE_ICON+'"></button>'
						else if('more'== ac_index)
							table_html = table_html +'<button class="btn btn-xs table-btn-txt more_btn" onclick="'+ac_data+'"><img src="'+MORE_ICON+'"></button>'
					});
					table_html = table_html + '</td>'
				}else if("TB_SELECT" == show_column){
					select_list = eval("records_data." + show_column)
					select_id = select_list.ele_id
					select_content = draw_simple_select(select_id, select_list.list_str, select_list.list_val,'select_authtype_select(this, '+select_list.id+')', select_list.val);
					table_html = table_html +'<td class="no-padding-hr '+td_class+'">'
					table_html = table_html + select_content
					table_html = table_html + '</td>'
				}else if("TB_CHECKBOX" == show_column){
					boxdata = eval("records_data." + show_column);
					var title = boxdata.title ? boxdata.title : "";
					checkbox_content = draw_simple_checkbox(boxdata.id, boxdata.checked, boxdata.cb, boxdata.disabled, title);
					table_html = table_html + '<td class="no-padding-hr '+td_class+'">';
					table_html = table_html + checkbox_content;
					table_html = table_html + '</td>';
				}else{
					show_data = eval("records_data." + show_column)
					table_html = table_html + '<td class="no-padding-hr '+td_class+'">'+show_data+'</td>'
				}
			});
			tr_index++
			table_html = table_html + '</tr>'
		});
		
		$("#"+body_id).html(table_html)
	}
}

function draw_radio_option(id, name, str, cb) {
	var cb_html = ""
	if ('undefined' != typeof(cb) && "" != cb) cb_html = 'onclick="' + cb + '"'
	html = '<input class="with-gap" id="' + id + '" type="radio" name="' + name + '" ' + cb_html + '><label for="' + id + '"><span class="multi_lang" id="lang_' + str + '">' + str + '</span></label>'
	return html
	//draw_radio_btn('mode_whitelist', 'macfilter_mode', 'Whitelist', 'macfilter_mode_selector(\'w\')');})
}

function draw_radio(zone_id, multi_lang_id, options){
	var radio_html = ""
	radio_html=radio_html+'<div class="form-group">\
		<span class="ng-binding multi_lang" id="'+multi_lang_id+'"></span> <label for=""></label>\
		<div class="radiogroup">';
		$.each(options, function(op_index, op_data) {
			radio_html=radio_html+draw_radio_option(op_data.id, zone_id, op_data.label, op_data.cb)
		});
	radio_html=radio_html+'</div>\
		<span class="error" style="display:none"></span>\
		</div>';
	$("#radio_"+zone_id).html(radio_html)
}

function draw_button(id, multi_lang_id, cb){
	var btn_html = ""
	
	btn_html=btn_html+'<span class="ng-binding" style="font-weight:bold"></span>\
	<a class="gemtek-btn-normal" id="" onclick="'+cb+'">\
	<i class="fa fa-plus icontxtgap"></i>\
	<span class="multi_lang" style="font-weight: normal;" id="'+multi_lang_id+'">Add</span>\
	</a>'
	
	$("#btn_"+id).html(btn_html)
}

function draw_custom_button(id, multi_lang_id, cb, icon){
	var icon_class = ""
	var btn_html = ""

	if ('undefined' != typeof(icon) && icon != ""){
		if (icon == "add"){
			icon_class="fa fa-plus"
		}else{
			icon_class="fa "+icon
		}
	}

	btn_html=btn_html+'<a class="gemtek-btn-normal" id="'+id+'" onclick="'+cb+'">\
	<i class="'+icon_class+' icontxtgap"></i>\
		<span class="multi_lang" style="font-weight: normal;" id="'+multi_lang_id+'">'+multi_lang_id+'</span>\
	</a>'
	$("#btn_"+id).html(btn_html)
}

function draw_textbtn(id, title_lang_id, note_lang_id, btn_lang_id ,cb) {
	var textbtn_html=''
	textbtn_html = '<div class="backup-panel-body">\
					<div class="content_body">\
					<p style="font-weight: bold;" class="multi_lang" id="'+title_lang_id+'">'+title_lang_id+'</p>\
					<div class="text-right">\
					<button class="waves-effect waves-light" id="Modify" name="'+id+'" title="'+id+'" value="'+id+'" onclick="'+cb+'"><span class="multi_lang" id="'+btn_lang_id+'"></span></button>\
					</div>\
					<p class="ng-binding"><span class="multi_lang" id="'+note_lang_id+'"></span></p>\
					</div></div>'
	$("#textbtn_"+id).html(textbtn_html)
}

function draw_textbtn_with_upload(id, title_lang_id, note_lang_id, btn_lang_id ,cb, upload_file_id, upload_file_cb) {
	var textbtn_html=''
	textbtn_html = '<div class="backup-panel-body">\
					<div class="content_body">\
					<p style="font-weight: bold;" class="multi_lang" id="'+title_lang_id+'">'+title_lang_id+'</p>\
					<div class="text-right">\
					<button class="waves-effect waves-light" id="Modify" name="'+id+'" title="'+id+'" value="'+id+'" onclick="'+cb+'"><span class="multi_lang" id="'+btn_lang_id+'"></span></button>\
					</div>\
					<p class="ng-binding"><span class="multi_lang" id="'+note_lang_id+'"></span></p>\
					<form class="ng-pristine ng-valid" enctype="multipart/form-data" id="uploadform" method="post" name="uploadform" onsubmit="return false">\
							<div class="form-inline"><div class="form-group">\
								<label class="gemtek-btn-primary" for="'+upload_file_id+'" style="padding: 13px 14px !important;">Choose File <span class="ng-binding" id="config_filename">No file selected</span></label>\
								<input id="'+upload_file_id+'" name="'+upload_file_id+'" type="file" onchange="'+upload_file_cb+'">\
							</div></div>\
						</form>\
					</div></div>'
	$("#textbtn_"+id).html(textbtn_html)
}

function draw_simple_select(name, str, val, evt, sel) {
	if (typeof str == 'undefined') str = [];
	if (typeof val == 'undefined') val = [];
	if (typeof evt == 'undefined') evt = '';
	
	sel = get_selected_idx(val, sel);
	var hvsl = false,
		attr = '',
		html = '\
		<select type="text" class="dropdown-toggle form-control1 hidden-dom-removal" id="' + name + '" name="' + name + '" onchange="' + evt + '">\
		';
	for (var i = 0; i < str.length; i++) {
		attr = '';
		if (i == sel) attr = 'selected';
		html += '\
		<option value="' + val[i] + '" ' + attr + ' class="multi_lang" id="lang_' + str[i] + '">' + str[i] + '</option>\
		';
	}
	html += '\
	</select>\
	';
	$("[id='select_" + name + "']").html(html)
	return html;
}

function draw_simple_checkbox(id, checked, cb, disabled, title) {
    var checkbox_html = "";
    var check_enabled = "";
    var disabled_elem = "";
    var title_attr = "";

    if (checked == "1")
        check_enabled = "checked"; 
    
    if (disabled) {
        disabled_elem = "disabled"; 

        if (checked != "1" && title && title.length > 0) {
            title_attr = ' title="' + title + '"';
        }
    }
    
    checkbox_html = '<span class="editable-controls">' +
        '<input type="checkbox" id="'+id+'" name="'+id+'" ' + check_enabled + ' ' + disabled_elem + '>' +
        '<label class="checkboxwithoutlabel" for="'+id+'" onclick="'+cb+'"'+ title_attr +'></label>' +
        '</span>';

    return checkbox_html;
}

function pop_dialog(target, action, cb, lang){
	$("#leaf_page_content").load("dialog/dialog-"+target+".html", function() {	
		action_content=""
		$.each(action, function(index, value) {
			action_content=action_content+'<div class="btn-align" id="btn_'+value+'">\
				<input class="gemtek-btn-normal" id="leaf'+value.text+'" type="button" value="'+value.text+'" onclick="'+value.action+'">\
				</div>'
		});
		$('#leaf_page_footer').html(action_content)
		
		var dialog_content = $("#leaf_page_zone").contents();
		
		if ('undefined' != typeof(lang) && lang != "")
			lang_tag = lang
		
		if('undefined' != typeof(lang_tag) && 'undefined' != typeof(L)){
			$.lang_insert(dialog_content, lang_tag, "", L)
		}
		
		if ( 'undefined' != typeof(cb) && cb != "")
			eval(cb)

		$("#leaf_page_zone").show()
		$("#view_page_zone").hide()
		$("#tabspage_page_zone").hide()
	});
}

function close_dialog(){
	$("#leaf_page_zone").hide()
	$("#view_page_zone").show()
	$("#tabspage_page_zone").show()
}

function pop_confirm(msg, cb){
	$("#confirm_dialog_msg").html(msg)
	$("#confirm_dialog_confirmed").on("click", cb);
	$("#confirm_dialog_zone").show()
}

function close_confirm(){
	$("#confirm_dialog_zone").hide()
}

function loading_control(onoff, msg){
	
	if( 'undefined' != typeof(msg) && "" != msg )
		$("#loading_message").html(msg)
	
	if (1 == onoff)
		$("#ajaxLoaderSection").show()
	else
		$("#ajaxLoaderSection").hide()
}

function warning_control(onoff, type, msg){
	if("global" == type){
		msg_zone_id="global_warning_msg_zone"
		msg_id="global_warning_msg"
	}else if("page" == type){
		msg_zone_id="page_warning_msg_zone"
		msg_id="page_warning_msg"
	}else
		return

	if (onoff == "on"){
		$("#"+msg_id).html(msg)
		$("#"+msg_zone_id).show()
		$("html, body").animate({ scrollTop: 0 }, "fast");
	}else{
		$("#"+msg_id).html('')
		$("#"+msg_zone_id).hide()
	}
}

function pop_alert_message(msg, type, timeout){
	if( 'undefined' == typeof(msg) || "" == msg || 'undefined' == typeof(type) || "" == type )
		return false;
	//this function not working for this layout design
}

function VIEW_HANDLER(target, type) {
	element_initial()
	main_header_handler()
	MENU_HANDLER(target)//menu.js
	layout_resize()
}