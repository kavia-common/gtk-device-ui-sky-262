// Change based on different device
var MENU_LAYOUT_DATA = [{
	"zone": ".mainmenu_zone",
	"handler": "_mainmenu_handler"
}]
var MENU_SELECTED_PAGE_DATA = {}


// tab page handling
function open_tab_url(url) {
	$('#tab-content').load("pages/" + url, function() {
	});
}

function tab_selector(tab_index, page_path, tab_url) {
	$(".tabspage_tabs").removeClass('active')
	$("#tab_" + tab_index).addClass('active')
	open_tab_url(page_path + "/" + tab_url)
	close_dialog()
}

function page_tabs_handler(target) {
	var tabs_list_content = ""
	var tab_selected = false
	var selected_target = {}
	if ('undefined' == typeof(target)) target = ""
	page_data = MENU_SELECTED_PAGE_DATA.page_path.split('/');
	$.each(MENU_SELECTED_PAGE_DATA.sub_page_data, function(tab_index, tab_data) {
		active_class = ""
		target_tab = {}
		if (tab_data.enabled == "N")
			return true
		if (localStorage.opmode != 'undefined' && localStorage.opmode != ""){
			if ( 'undefined' != typeof(tab_data.display_mode) && tab_data.display_mode == "router_only" && localStorage.opmode != "rt" )
				return true
		}
		target_tab = eval('MENU_SELECTED_PAGE_DATA.sub_page_data.' + tab_index)
		tab_title = 'lang_submenu_' + page_data[0] + '_' + page_data[1] + '_' + tab_index
		if (tab_data.enabled == "Y") {
			if ((!tab_selected && target == "") || (target == tab_index)) {
				active_class = 'active'
				tab_selected = true
				selected_target = target_tab
			}
			tabs_list_content = tabs_list_content + '<li id="tab_' + tab_index + '" class="tabspage_tabs ' + active_class + '"><a onclick="tab_selector(\'' + tab_index + '\',\'' + MENU_SELECTED_PAGE_DATA.page_path + '\',\'' + target_tab.href + '\')">' + eval("L.menu." + tab_title) + '</a></li>'
		}
	});
	$("#tabspage_tabs_zone").html(tabs_list_content)
	open_tab_url(MENU_SELECTED_PAGE_DATA.page_path + "/" + selected_target.href)
}

function tabspage_layout_handler(target, type) {
	page_tabs_handler(target)
}


// single page handling
function open_view_url(url) {
	$('#view_page_zone').load("pages/" + url, function() {
	});
}

function singlepage_layout_handler() {
	var page_data = MENU_SELECTED_PAGE_DATA.page_path.split('/');
	if(MENU_SELECTED_PAGE_DATA.sub_page_support=="N"){
		url_prefix=page_data[0]
	}else{
		url_prefix=MENU_SELECTED_PAGE_DATA.page_path
	}
	open_view_url(url_prefix + "/" + MENU_SELECTED_PAGE_DATA.sub_page_data.href)
}

// mainmenu handling
function open_page_url(elem, path, url, title) {
	var path_data = path.split('/');
	$("#main-content").html('');
	$("#homepage_quick_link").html('')
	var selected_submenu_data = eval("submenu_data." + path_data[0])
	if ('undefined' != typeof(selected_submenu_data)) {
		var selected_page_data = eval("selected_submenu_data." + path_data[1])
		if (selected_page_data.sub_page_support == "Y") {
			url = "tabspage.html"
			MENU_SELECTED_PAGE_DATA.sub_page_data = selected_page_data.sub_page
			MENU_SELECTED_PAGE_DATA.sub_page_support = "Y"
		} else {
			url = "singlepage.html"
			MENU_SELECTED_PAGE_DATA.sub_page_data = selected_page_data
			MENU_SELECTED_PAGE_DATA.sub_page_support = "N"
		}
	} else {
		MENU_SELECTED_PAGE_DATA.sub_page_data = eval("mainmenu_data." + path_data[0])
		MENU_SELECTED_PAGE_DATA.sub_page_support = "N"
	}
	MENU_SELECTED_PAGE_DATA.page_path = path
	$('#main-content').load("pages/" + url, function() {
		$("#homepage_tile").html("<span class='multi_lang' id='" + title + "'>" + title + "</span>")
		if (typeof(L.menu) != "undefined") {
			var page_name = eval("L.menu." + title)
			var mainmenu_name = eval("L.menu.lang_mainmenu_" + path_data[0])
			$("#homepage_tile").html(page_name)
			$("#homepage_quick_link").html(mainmenu_name + ' / ' + page_name)
			document.title = page_name
		}
	});
}

function menu_selector(elem, menu_path, page_href, title_multi_lang_id) {
	var elem_id = elem.id
	var menu_path_data = menu_path.split('/');
	if ("open" == page_href) {
		if (document.querySelector("#" + elem_id + "_item").classList.contains("open")) {
			$("#" + elem_id + "_item").removeClass('open')
		} else {
			$(".sidebarItem").removeClass('open')
			$("#" + elem_id + "_item").addClass('open')
		}
	} else {
		$(".menu_element").removeClass('menuitem-highlight')
		$(".submenu_element").removeClass('menuitem-highlight')
		$('.menu_class_' + menu_path_data[0]).addClass('menuitem-highlight')
		$("#" + elem_id).addClass('menuitem-highlight')
		open_page_url(elem, menu_path, page_href, title_multi_lang_id)
	}
}

function _mainmenu_handler(zone, target) {
	var mainmenu_content = ""
	var selected_flag = ""
	var selected_target = {}
	target_layer_data = target.split('/');
	$.each(mainmenu_data, function(menu_index, menu_content) {
		selected_class = ""
		selected_class_btn = ""
		page_href = ""
		if (localStorage.opmode != 'undefined' && localStorage.opmode != ""){
			if ( menu_content.display_mode == "router_only" && localStorage.opmode != "rt" )
				return true
		}
		if (menu_content.enabled == "N")
			return true
		if (menu_content.independent_page == "N") {
			page_href = "open"
		} else if (menu_content.independent_page == "Y") {
			page_href = menu_content.href
		}
		if (target_layer_data[0] == menu_index) {
			selected_class = "open"
			selected_class_btn = "menuitem-highlight"
			selected_target.elem = this
			selected_target.index = menu_index
			selected_target.title = 'lang_mainmenu_' + menu_index
			selected_target.href = page_href
			selected_flag = "1"
		}
		mainmenu_content = mainmenu_content + '<li id="menu_' + menu_index + '_item" class="sidebarItem ' + selected_class + '" >'
		mainmenu_content = mainmenu_content + '<button id="menu_' + menu_index + '" name="menu_' + menu_index + '" class="menu_element menu_class_' + menu_index + ' ' + selected_class_btn + ' fa fa-angle-right dropdown-btn dropdown-btn-menu no-padding-hr dropdown-toggle" onclick="menu_selector(this,\'' + menu_index + '\',\'' + page_href + '\',\'lang_mainmenu_' + menu_index + '\')">'
		mainmenu_content = mainmenu_content + '<img class="menu-icon ltq-icon t1" src="img/icons/' + menu_content.icon + '">'
		mainmenu_content = mainmenu_content + '<span class="mm-text menu-title ng-binding multi_lang" id="lang_mainmenu_' + menu_index + '">' + menu_index + '</span>'
		mainmenu_content = mainmenu_content + '</button>'
		mainmenu_content = mainmenu_content + '<ul class="mmc-dropdown-delay animated fadeInLeft navigation ltq_submenu dropdown-menu dropdown-side-menu no-padding-vr" href="#">'
		eval('submenu_tmp=submenu_data.' + menu_index)
		if('undefined' != typeof(submenu_tmp)){
			$.each(submenu_tmp, function(submenu_index, submenu_content) {
				page_href = ""
				selected_class = ""
				if (localStorage.opmode != 'undefined' && localStorage.opmode != ""){
					if ( submenu_content.display_mode == "router_only" && localStorage.opmode != "rt" )
						return true
				}
				if (submenu_content.enabled == "N")
					return true
				if (submenu_content.independent_page == "Y") {
					page_href = menu_index + '/' + submenu_content.href
				}
				if (target_layer_data[0] == menu_index && target_layer_data[1] == submenu_index) {
					selected_class = "menuitem-highlight"
					selected_target.elem = this
					selected_target.index = menu_index + '/' + submenu_index
					selected_target.href = menu_index + '/' + submenu_content.href
					selected_target.title = 'lang_submenu_' + menu_index + '_' + submenu_index
				}
				mainmenu_content = mainmenu_content + '<li class="no-padding-hr no-margin-vr" id="menu_' + menu_index + '_' + submenu_index + '_item">'
				mainmenu_content = mainmenu_content + '<a tabindex="-1" class="submenu_element ' + selected_class + '" id="menu_' + menu_index + '_' + submenu_index + '" type="custom" source="stats" title="' + submenu_index + '" onclick="menu_selector(this,\'' + menu_index + '/' + submenu_index + '\',\'' + page_href + '\',\'lang_submenu_' + menu_index + '_' + submenu_index + '\')">'
				mainmenu_content = mainmenu_content + '<span class="mm-text ng-binding multi_lang" id="lang_submenu_' + menu_index + '_' + submenu_index + '">' + submenu_index + '</span>'
				mainmenu_content = mainmenu_content + '</a>'
				mainmenu_content = mainmenu_content + '</li>'
			});
		}

		mainmenu_content = mainmenu_content + '</ul>'
		mainmenu_content = mainmenu_content + '</li>'
	});
	$(zone).html(mainmenu_content)
	if (selected_flag == "1") open_page_url(selected_target.elem, selected_target.index, selected_target.href, selected_target.title)
}

function MENU_HANDLER(target) {
	$.each(MENU_LAYOUT_DATA, function(index, value) {
		eval(value.handler + '("' + value.zone + '","' + target + '")')
	});
	$.lang_load("menu");
}
