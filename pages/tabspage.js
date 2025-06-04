	$(document).ready(function () {
		if('undefined' != typeof(MENU_SELECTED_PAGE_DATA) && MENU_SELECTED_PAGE_DATA.sub_page_support == "Y"){
			tabspage_layout_handler(get_target_tab())
		}
	});