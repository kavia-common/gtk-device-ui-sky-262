	page_tag='basic_setting-wan-wan'
	$(document).ready(function(){
		$.lang_load("basic_setting_wan_wan");
		page_initial()
	}); 
	function callback(){
	
	} 
	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		//init wan_name element
		$("#wan_name").empty();
		var tmp
		//init wan_name element
		//for(var i=0;i<MODIFIED_OBJ_DATA.Wan.WanT.length;i++){
		for(var i=0;i<1;i++){
			tmp = $('<option></option>').attr("value", i).text(MODIFIED_OBJ_DATA.Wan.WanT[i].ConnectionName);
			$("#wan_name").append(tmp);
		}
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

	function mtu_validate_input() {
		var inputValue = $("#mtu").val();
		var regex = /^[0-9]{4}$/;
		var number = parseInt(inputValue, 10);
		if (regex.test(inputValue)) {
			if(number >= 1300 && number <= 8896) {
				return true;
			}else {
				alert(L.error_message.lang_error36_msg);
			}
		}else {
			alert(L.error_message.lang_error36_msg);
		}
		return false;
	}

	function timeout_validate_input() {
		var inputValue = $("#dial_timeout").val();
		var number = parseInt(inputValue, 10);
		if(number == 0 || (number >= 10 && number <= 86400)) {
			return true;
		}else {
			alert(L.error_message.lang_error42_msg);
		}
		return false;
	}

	function valid_ipv6_addr(ip6addr_tmp) {
		var regExp = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^:(:[0-9a-fA-F]{1,4}){1,7}$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}$|^:(?::[0-9a-fA-F]{1,4}){1,7}$|^::$|^(?:[0-9a-fA-F]{1,4}:){6}\d{1,3}(?:\.\d{1,3}){3}$|^::(?:ffff:)?\d{1,3}(?:\.\d{1,3}){3}$/;

		var regex = new RegExp(regExp);
		if (regex.test(ip6addr_tmp)) {
			return true;
		} else {
			return false;
		}
		return false;
	}
	
	var NOW_WAN_INDEX = 0
	
	function save_table(index){
		if(typeof(index)=="undefined")
			var wan = MODIFIED_OBJ_DATA.Wan.WanT[$("#wan_name").val()]
		else
			var wan = MODIFIED_OBJ_DATA.Wan.WanT[index]
		wan.Mtu = $("#mtu").val()
		wan.PppoeUserName = $("#ppp_name").val()
		wan.PppoePassword = $("#ppp_pwd").val()
		wan.PppoeIdleTimeout = $("#dial_timeout").val()
		wan.Ipv4Address = $("#static_ip").val()
		wan.Ipv4SubnetMask = $("#static_mask").val()
		wan.Ipv4DefaultGateway = $("#static_gatway").val()
		wan.Ipv4Dns1 = $("#static_dns1").val()
		wan.Ipv4Dns2 = $("#static_dns2").val()
		wan.Ipv6Address = $("#static_v6_ip").val()
		wan.Ipv6Gateway = $("#static_v6_gatway").val()
		wan.Ipv6PdAddress = $("#static_v6_pd").val()
		wan.Ipv6Dns1 = $("#static_v6_dns1").val()
		wan.Ipv6Dns2 = $("#static_v6_dns2").val()
		wan.VlanId = $("#vlan_id").val()
	}
	
	(function () {
		var previous;
		$('#wan_name').focus(function () {
			// Store the current value on focus, before it changes
			NOW_WAN_INDEX = previous = this.value;
		}).change(function() {
			// Do soomething with the previous value after the change
			if(!vlan_rule_validation()){
				this.value = previous
				return;
			}
			save_table(previous)
			layout_init()
			//select_wan_mode()
			NOW_WAN_INDEX = previous = this.value;
		});
	})();
	function select_wan_name(){
		
	}

	function select_wan_mode(){
		var wmode = $("#wan_mode").val();
		if (wmode == "bridge6") {
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mode = "route";
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6BridgeEnable = "1";
		}
		else {
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mode = wmode;
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6BridgeEnable = "0";
		}

		$(".wan_mode_selection").hide();
		if (MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6BridgeEnable == "1") { // bridge6
			$(".wan_mode_bridge6").show();
			$("#wan_service option[value='INTERNET_TR069']").hide();
			$("#wan_service option[value='TR069']").hide();
			$("#wan_service").val("INTERNET")

			layout_init()
		}
		else if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mode == "route"){ // route
			$(".wan_mode_route").show();
			$("#wan_service option[value='INTERNET_TR069']").show();
			$("#wan_service option[value='TR069']").show();
			$("#wan_service").val("INTERNET_TR069")
			layout_init()
		}
		else{ // bridge
			$(".wan_mode_bridge").show();
			$("#wan_service option[value='INTERNET_TR069']").hide();
			$("#wan_service option[value='TR069']").hide();
			$("#wan_service").val("INTERNET")
		}
	}
	function select_wan_proto(val){
		if(typeof(val)=="undefined")
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType = $("#wan_proto").val()

		if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType == 'static'){
			if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType == "ipv4v6"){
				$(".wan_protocol_v6").hide()
				$(".static_ipv6_enable").show()
				$("#div_static_ip").show()
				$("#div_static_ipv6").show()
				$("#div_ipv6").hide()
				$("#div_type_pd").hide()
			}else if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType == "ipv6"){
				$(".static_v4").hide()
				$(".wan_protocol_v6").hide()
				$(".static_ipv6_enable").show()
				$("#div_static_ip").show()
				$("#div_static_ipv6").show()
				$("#div_ipv6").hide()
				$("#div_type_pd").hide()
			}
			else{
				$(".static_v4").show()
				$(".wan_protocol_v6").hide()
				$(".static_ipv6_enable").hide()
				$("#div_static_ip").show()
				$("#div_static_ipv6").hide()
				$("#div_ipv6").hide()
				$("#div_type_pd").hide()
			}
		}
		else{
			if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType == "ipv4v6" || MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType == "ipv6"){
				$(".wan_protocol_v6").show()
				$("#div_ipv6").show()
				$("#div_type_pd").show()
			}
			else{
				$(".wan_protocol_v6").hide()
				$("#div_ipv6").hide()
				$("#div_type_pd").hide()
			}
		}
	}
	function select_wan_dial(val){
		if(typeof(val)=="undefined")
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].DialMode = $("#wan_dial").val()

		if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType == "pppoe"){
			if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].DialMode == 'automatically'){
				$("#input_dial_timeout").hide()
				$("#div_dial_manual").hide()
			}
			else if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].DialMode == 'dial_on_demand'){
				$("#input_dial_timeout").show()
				$("#div_dial_manual").hide()
			}
			else{
				$("#input_dial_timeout").hide()
				$("#div_dial_manual").show()
			}
		}
		else{
			$("#input_dial_timeout").hide()
			$("#div_dial_manual").hide()
		}
	}
	function select_wan_802(){
		MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Vlan8021P = $("#wan_802").val()
	}
	function select_wan_service(){
		MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ServiceType = $("#wan_service").val()
	}

	function switch_toggle(id, val){
		if(typeof(val) == "undefined" || val == "2"){  // val: 2 is from GUI trigger
			val = $('#'+id).val()
		}
		
		if(val == "1"){
			if(id=="vlan"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].VlanEnabled = "1";
				$(".vlan_enable").show()
			}
			if(id=="nat"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].NatEnabled = "1";
			}
			if(id=="enable"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Enabled = "1";
			}
			if(id=="PD"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6PdEnabled = "1";
			}
		}else{
			if(id=="vlan"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].VlanEnabled = "0";
				$(".vlan_enable").hide()
			}
			if(id=="nat"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].NatEnabled = "0";
			}
			if(id=="enable"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Enabled = "0";
			}
			if(id=="PD"){
				MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6PdEnabled = "0";
			}
		}

		switcher_handler(id, val);
	}
	
	function switch_radio(obj, flag){
		if(obj.id=="radio_dhcp"){
			$(".connection_type_selection").hide();
			$("#radio_dhcp").prop("checked", true);
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType = 'dhcp'
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].LinkType = 'ip'
			//max and customize value
			if(!flag)
				$('#mtu').val('1500')
			else
				$('#mtu').val(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mtu)

			$("#radio_static").prop("checked", false);
			$("#radio_pppoe").prop("checked", false);
			$(".connection_type_dhcp").show();
			$("#wan_proto").find("option[value='ipv6']").show();
			$("#wan_proto").find("option[value='ipv4v6']").show();
			$("#wan_proto").find("option[value='ipv4']").show();
		}
		else if(obj.id=="radio_static"){
			$(".connection_type_selection").hide();
			$("#radio_static").prop("checked", true);
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType = 'static'
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].LinkType = 'ip'
			if(!flag)
				$('#mtu').val('1500')
			else
				$('#mtu').val(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mtu)

			$("#radio_dhcp").prop("checked", false);
			$("#radio_pppoe").prop("checked", false);
			$(".connection_type_static").show();
			$("#wan_proto").find("option[value='ipv6']").show();
			$("#wan_proto").find("option[value='ipv4v6']").show();
			$("#wan_proto").find("option[value='ipv4']").show();
		}
		else if(obj.id=="radio_pppoe"){
			$(".connection_type_selection").hide();
			$("#radio_pppoe").prop("checked", true);
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType = 'pppoe'
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].LinkType = 'ppp'
			if(!flag)
				$('#mtu').val('1492')
			else
				$('#mtu').val(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mtu)
			
			$("#radio_static").prop("checked", false);
			$("#radio_dhcp").prop("checked", false);
			$(".connection_type_pppoe").show();
			var prototype = document.getElementById("wan_proto");
			var mode = prototype.options[prototype.selectedIndex].value;
			$("#wan_proto").find("option[value='ipv6']").show();
			$("#wan_proto").find("option[value='ipv4v6']").show();
			$("#wan_proto").find("option[value='ipv4']").show();
		}

		if(obj.id=="radio_v6"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6AddressMode = 'dhcpv6'
			$("#radio_SLAAC").prop("checked", false);
			$("#radio_v6").prop("checked", true);
		}
		else if(obj.id=="radio_SLAAC"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6AddressMode = 'slaac'
			$("#radio_v6").prop("checked", false);
			$("#radio_SLAAC").prop("checked", true);
		}
		select_wan_proto('update')
		select_wan_dial('update')

		// hidden ipv6 fields when protocol is bridge6
		if (MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6BridgeEnable == "1") {
			$(".wan_mode_selection").hide();
			$(".wan_mode_bridge6").show();
		}
		if (typeof(G_VLAN_ENABLED) != "undefined" && G_VLAN_ENABLED === "1") {
			$("#switch_vlan").show();
			} else {
			$("#switch_vlan").hide();
		}
	}

	function wan_init_setting(wan){
		$("#mtu").val(wan.Mtu)
		$("#vlan_id").val(wan.VlanId)
		$("#wan_proto").val(wan.IpProtocolType)
		$("#wan_802").val(wan.Vlan8021P)
		$("#ppp_name").val(wan.PppoeUserName)
		$("#dial_timeout").val(wan.PppoeIdleTimeout)
		$("#ppp_pwd").val(wan.PppoePassword)
		$("#wan_dial").val(wan.DialMode)
		$("#wan_service").val(wan.ServiceType)
		$("#static_ip").val(wan.Ipv4Address)
		$("#static_mask").val(wan.Ipv4SubnetMask)
		$("#static_gatway").val(wan.Ipv4DefaultGateway)
		$("#static_dns1").val(wan.Ipv4Dns1)
		$("#static_dns2").val(wan.Ipv4Dns2)
		$("#static_v6_ip").val(wan.Ipv6PdAddress)
		$("#static_v6_gatway").val(wan.Ipv6Gateway)
		$("#static_v6_pd").val(wan.Ipv6PdAddress)
		$("#static_v6_dns1").val(wan.Ipv6Dns1)
		$("#static_v6_dns2").val(wan.Ipv6Dns2)
	}

	function layout_init(obj){
		if(typeof(obj)=="undefined")
			var wan = MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()]
		else
			var wan = MODIFIED_OBJ_DATA.Wan.WanT[obj]
		
		if (wan.Ipv6BridgeEnable == "1")
			$("#wan_mode").val("bridge6")
		else
			$("#wan_mode").val(wan.Mode)

		if (typeof(G_WAN_BRIDGE_SUPPORT)!="undefined" && G_WAN_BRIDGE_SUPPORT==1){
			$("#select_wan_mode").show()
		}
		wan_init_setting(wan);

		if(wan.NatEnabled=="1")
			switcher_handler('nat', '1', 'switch_toggle(\'nat\',\'1\')');
		else
			switcher_handler('nat', '0', 'switch_toggle(\'nat\',\'0\')');
				
		if(wan.Ipv6PdEnabled=="1")
			switcher_handler('PD', '1', 'switch_toggle(\'PD\',\'1\')');
		else
			switcher_handler('PD', '0', 'switch_toggle(\'PD\',\'0\')');

		if(wan.Enabled=="1")
			switcher_handler('enable', '1', 'switch_toggle(\'enable\',\'1\')');
		else
			switcher_handler('enable', '0', 'switch_toggle(\'enable\',\'0\')');
		if(wan.VlanEnabled=="1"){
			switcher_handler('vlan', '1', 'switch_toggle(\'vlan\',\'1\')');
		}else{
			switcher_handler('vlan', '0', 'switch_toggle(\'vlan\',\'0\')');
		}

		$(".wan_mode_selection").hide();
		if(wan.Mode == "route"){
			$(".wan_mode_route").show();
			if(wan.ConnectionType == "dhcp"){
				switch_radio($("#radio_dhcp")[0], 1)
			}
			else if(wan.ConnectionType == "static"){
				switch_radio($("#radio_static")[0], 1)
			}
			else if(wan.ConnectionType == "pppoe"){
				switch_radio($("#radio_pppoe")[0], 1)
			}
			if(wan.Ipv6AddressMode == "dhcpv6"){
				switch_radio($("#radio_v6")[0])
			}
			else{
				switch_radio($("#radio_SLAAC")[0])
			}
			select_wan_proto('update')
			select_wan_dial('update')

			// hidden ipv6 fields when protocol is bridge6
			if (wan.Ipv6BridgeEnable == "1") {
				$(".wan_mode_selection").hide();
				$(".wan_mode_bridge6").show();
			}
		}
		else{   
			$("#vlan").show();
		}

		if (typeof(G_VLAN_ENABLED) != "undefined" && G_VLAN_ENABLED === "1") {
			$("#switch_vlan").show();
			} else {
			$("#switch_vlan").hide();
		}

	}

	function vlan_rule_validation(){
		var target_wan_mode = $("#wan_mode").val()
		var target_vlan_id = $("#vlan_id").val()
		
		if ( 'bridge' != target_wan_mode)
			return true
		
		for(var i=0;i<MODIFIED_OBJ_DATA.Wan.WanT.length;i++){
			var mode=MODIFIED_OBJ_DATA.Wan.WanT[i].Mode
			
			if( i == NOW_WAN_INDEX || 'bridge' != mode)
				continue;
			
			var vlan=MODIFIED_OBJ_DATA.Wan.WanT[i].VlanId
						
			if(target_vlan_id == vlan){
				if( '0' == target_vlan_id )
					alert(L.error_message.lang_error14_msg)
				else
					alert(L.error_message.lang_error15_msg)
				return false
			}				
		}
		
		return true		
	
	}
	function valid_local_ip_rule(net1, net2){
		var net1 = net1.split('.')
		var net2 = net2.split('.')
		if(net1[0]==net2[0] && net1[1] == net2[1] && net1[2] == net2[2]){
			return true
		}else{
			return false
		}
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
	function static_rule_validation(){
		var wan_type = MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType
		var lan = MODIFIED_OBJ_DATA.Lan.LanP.IpAddress
		var ip = $('#static_ip').val()
		var dns1 = $("#static_dns1").val()
		var dns2 = $("#static_dns2").val()
		var mask = $("#static_mask").val()
		var gw = $("#static_gatway").val()
		var ipv6_addr = $("#static_v6_ip").val()
		var ipv6_gw = $("#static_v6_gatway").val()
		var ipv6_pd = $("#static_v6_pd").val()
		var ipv6_dns1 = $("#static_v6_dns1").val()
		var ipv6_dns2 = $("#static_v6_dns2").val()


		if (wan_type == 'static'){
			if(ValidateIPaddress(ip)!=true){
				alert(L.error_message.lang_error16_msg);
				return false;
			}
			if(valid_local_ip_rule(ip, lan)!=false){
				alert(L.error_message.lang_error17_msg)
				return false;
			}
			if(ValidateIPaddress(gw)!=true){
				alert(L.error_message.lang_error18_msg);
				return false;
			}
			if(valid_local_ip_rule(gw, ip)!=true){
				alert(L.error_message.lang_error19_msg)
				return false;
			}
			if(ip == gw){
				alert(L.error_message.lang_error20_msg);
				return false;
			}
			if(dns1 != ""){
				if(ValidateIPaddress(dns1)!=true){
					alert(L.error_message.lang_error21_msg);
					return false;
				}
			}
			if(dns2 != ""){
				if(ValidateIPaddress(dns2)!=true){
					alert(L.error_message.lang_error22_msg);
					return false;
				}
			}
			if(Validatemask(mask)!=true){
				alert(L.error_message.lang_error23_msg);
				return false;
			}
			if(valid_ipv6_addr(ipv6_addr)!=true){
				alert(L.error_message.lang_error37_msg);
				return false;
			}
			if(valid_ipv6_addr(ipv6_gw)!=true){
				alert(L.error_message.lang_error38_msg);
				return false;
			}
			if(valid_ipv6_addr(ipv6_pd)!=true){
				alert(L.error_message.lang_error39_msg);
				return false;
			}
			if(ipv6_dns1 != ""){
				if(valid_ipv6_addr(ipv6_dns1)!=true){
					alert(L.error_message.lang_error40_msg);
					return false;
				}
			}
			if(ipv6_dns2 != ""){
				if(valid_ipv6_addr(ipv6_dns2)!=true){
					alert(L.error_message.lang_error41_msg);
					return false;
				}
			}
		}
		return true
	} 
	function page_save(){
		if(!vlan_rule_validation())
			return;
		if(!static_rule_validation())
			return;
			
		if(!mtu_validate_input()){
			return;
		}
		if(!timeout_validate_input()){
			return;
		}
		
		delete MODIFIED_OBJ_DATA.WlanGlobal;

		save_table()
		set_obj_data(MODIFIED_OBJ_DATA)
	}
    
	function set_obj_success_cb(obj) {
		//show_alert(L.common.success_title, L.common.save_success);
		if( "1" == ORIGINAL_OBJ_DATA.WlanGlobal.WlanGlobalP.MloEnable){
			loading_time=page_loading_time.mlo_enabled.wan
		}else{
			loading_time=page_loading_time.mlo_disabled.wan
		}
		
		ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
		loading_wait_control(loading_time, "page_initial()")
		//loading_wait_300s()
		
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
