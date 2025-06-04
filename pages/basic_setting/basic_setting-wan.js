	page_tag='basic_setting-wan'
	$(document).ready(function(){
		$.lang_load("basic_setting-wan");
		page_initial()
	}); 
	function callback(){
	
	} 
 	function get_obj_success_cb(obj) { 
		ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
		MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 
		layout_init()
	} 
 	function get_obj_error_cb(obj) { 
		if (obj.api_return == 403) {
                        logout('sto');
                }
	} 
	function get_obj_data(obj_list){ 
		API.obj.get(obj_list, get_obj_success_cb, get_obj_error_cb); 
	} 
	function page_initial(){
		//Coding initial function here
		get_obj_data(OBJ_LIST) 
	}
	function select_wan_name(){
		layout_init()
	}
        function select_wan_mode(){
                MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mode = $("#wan_mode").val()
                if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mode == "route"){
                        $("#div_mtu").show()
                        $("#div_type_dhcp").show()
                        $("#div_type_static").show()
                        $("#div_type_pppoe").show()
                        $("#div_enable_vlan").show()
                        $("#div_ip_type").show()
                        $("#div_nat").show()
			$("#wan_service option[value='INTERNET_TR069']").show();
			$("#wan_service option[value='TR069']").show();
			$("#wan_service").val("INTERNET_TR069")
			layout_init()
                }
                else{
                        $("#div_mtu").hide()
                        $("#div_type_dhcp").hide()
                        $("#div_type_static").hide()
                        $("#div_type_pppoe").hide()
			$("#div_enable_vlan").show()
                        $("#div_ip_type").hide()
                        $("#div_nat").hide()
                        $("#div_ipv6").hide()
                        $("#div_type_pd").hide()
			$("#wan_service option[value='INTERNET_TR069']").hide();
			$("#wan_service option[value='TR069']").hide();
			$("#wan_service").val("INTERNET")
                        $("#div_static_ip").hide()
                        $("#div_static_ipv6").hide()
			$("#div_dial_mode").hide()
			$("#div_dial_timeout").hide()
			$("#div_dial_manual").hide()
                        $("#div_ppp_name").hide()
                        $("#div_ppp_pwd").hide()
                }
        }
        function select_wan_proto(val){
		if(typeof(val)=="undefined")
                	MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType = $("#wan_proto").val()
                if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType == 'static'){
                        if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType == "ipv4v6"){
                                $("#div_static_ip").show()
                                $("#div_static_ipv6").show()
                                $("#div_ipv6").hide()
                                $("#div_type_pd").hide()
                        }
                        else{
                                $("#div_static_ip").show()
                                $("#div_static_ipv6").hide()
                                $("#div_ipv6").hide()
                                $("#div_type_pd").hide()
                        }
                }
                else{
                        if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].IpProtocolType == "ipv4v6"){
                                $("#div_ipv6").show()
                                $("#div_type_pd").show()
                        }
                        else{
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
				$("#div_dial_timeout").hide()
				$("#div_dial_manual").hide()
			}
			else if(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].DialMode == 'dial_on_demand'){
				$("#div_dial_timeout").show()
				$("#div_dial_manual").hide()
			}
			else{
				$("#div_dial_timeout").hide()
				$("#div_dial_manual").show()
			}
		}
		else{
			$("#div_dial_timeout").hide()
			$("#div_dial_manual").hide()
		}
	}
	function select_wan_802(){
		MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Vlan8021P = $("#wan_802").val()
	}
	function select_wan_service(){
		MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ServiceType = $("#wan_service").val()
	}
        function switch_toggle(obj,val){
                if(typeof(val) == "undefined"){   
                        if($(obj).parent().prop('class') == "el-switch is-checked"){
                                $(obj).parent().attr('class','el-switch')
                                if(obj.id=="switch_VLAN"){
                                        $("#div_vlan_id").hide()
                                        $("#div_802").hide()
                                }
                        }else{  
                                $(obj).parent().attr('class','el-switch is-checked')
                                if(obj.id=="switch_VLAN"){
                                        $("#div_vlan_id").show()
                                        $("#div_802").show()
                                }
                        }
                }else{
        	        if(val == "1"){
                	        $(obj).parent().attr('class','el-switch is-checked')
                                if(obj.id=="switch_VLAN"){
                                        $("#div_vlan_id").show()
                                        $("#div_802").show()
                                }
			}else{
                        	$(obj).parent().attr('class','el-switch')
                                if(obj.id=="switch_VLAN"){
                                        $("#div_vlan_id").hide()
                                        $("#div_802").hide()
                                }
			}
               }
        }
	
        function switch_radio(obj){
                $(obj).parent().attr('class','el-radio__input is-checked')
                if(obj.id=="radio_dhcp"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType = 'dhcp'
                        $("#radio_static").parent().attr('class','el-radio__input')
                        $("#radio_pppoe").parent().attr('class','el-radio__input')
			$("#div_dial_mode").hide()
                        $("#div_ppp_name").hide()
                        $("#div_ppp_pwd").hide()
                        $("#div_static_ip").hide()
                        $("#div_static_ipv6").hide()
                }
                else if(obj.id=="radio_static"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType = 'static'
                        $("#radio_dhcp").parent().attr('class','el-radio__input')
                        $("#radio_pppoe").parent().attr('class','el-radio__input')
			$("#div_dial_mode").hide()
                        $("#div_ppp_name").hide()
                        $("#div_ppp_pwd").hide()
                        $("#div_static_ip").show()
                        $("#div_static_ipv6").show()
                }
                else if(obj.id=="radio_pppoe"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType = 'pppoe'
                        $("#radio_static").parent().attr('class','el-radio__input')
                        $("#radio_dhcp").parent().attr('class','el-radio__input')
			$("#div_dial_mode").show()
                        $("#div_ppp_name").show()
                        $("#div_ppp_pwd").show()
                        $("#div_static_ip").hide()
                        $("#div_static_ipv6").hide()
                }

                if(obj.id=="radio_v6"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6AddressMode = 'dhcpv6'
                        $("#radio_SLAAC").parent().attr('class','el-radio__input')
                }
                else if(obj.id=="radio_SLAAC"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6AddressMode = 'slaac'
                        $("#radio_v6").parent().attr('class','el-radio__input')
                }
		select_wan_proto('update')
		select_wan_dial('update')
        }
        function layout_init(obj){
		var wan = MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()]
                $("#mtu").val(wan.Mtu)
                $("#vlan_id").val(wan.VlanId)
                $("#wan_proto").val(wan.IpProtocolType)
                $("#wan_802").val(wan.Vlan8021P)
                $("#wan_mode").val(wan.Mode)
                $("#ppp_name").val(wan.PppoeUserName)
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

                if($("#switch_VLAN").parent().prop('class') == "el-switch__input"){
			$("#div_vlan_id").hide()
			$("#div_802").hide()
		}else{
			$("#div_vlan_id").show()
			$("#div_802").show()
		}
                if(wan.NatEnabled=="1")
                        switch_toggle($('#switch_nat')[0],'1')
                else
                        switch_toggle($('#switch_nat')[0],'0')
                
		if(wan.Ipv6PdEnabled=="1")
                        switch_toggle($('#switch_PD')[0],'1')
                else
                        switch_toggle($('#switch_PD')[0],'0')
 
                if(wan.Enabled=="1")
                        switch_toggle($('#switch_enable')[0],'1')
                else
                        switch_toggle($('#switch_enable')[0],'0')
                if(wan.VlanEnabled=="1"){
                        switch_toggle($("#switch_VLAN")[0], '1')
                }else{
                        switch_toggle($("#switch_VLAN")[0], '0')
                }
		if(wan.Mode == "route"){
                        $("#div_mtu").show()
                        $("#div_type_dhcp").show()
                        $("#div_type_static").show()
                        $("#div_type_pppoe").show()
                        $("#div_enable_vlan").show()
                        $("#div_ip_type").show()
                        $("#div_nat").show()
                        if(wan.ConnectionType == "dhcp"){
                                switch_radio($("#radio_dhcp")[0])
				$("#div_dial_mode").hide()
				$("#div_ppp_name").hide()
				$("#div_ppp_pwd").hide()
                        	$("#div_static_ip").hide()
                        	$("#div_static_ipv6").hide()
                        }
                        else if(wan.ConnectionType == "static"){
                                switch_radio($("#radio_static")[0])
				$("#div_dial_mode").hide()
				$("#div_ppp_name").hide()
				$("#div_ppp_pwd").hide()
                        	$("#div_static_ip").show()
                        	$("#div_static_ipv6").show()
                        }
                        else if(wan.ConnectionType == "pppoe"){
                                switch_radio($("#radio_pppoe")[0])
				$("#div_dial_mode").show()
				$("#div_ppp_name").show()
				$("#div_ppp_pwd").show()
                        	$("#div_static_ip").hide()
                        	$("#div_static_ipv6").hide()
                        }
                        if(wan.Ipv6AddressMode == "dhcpv6"){
                                switch_radio($("#radio_v6")[0])
                        }
                        else if(wan.Ipv6AddressMode == "slaac"){
                                switch_radio($("#radio_SLACC")[0])
                        }
			select_wan_proto('update')
			select_wan_dial('update')
                }
                else{   
                        $("#div_mtu").hide()
                        $("#div_type_dhcp").hide()
                        $("#div_type_static").hide()
                        $("#div_type_pppoe").hide()
			$("#div_ip_type").hide()
			$("#div_nat").hide()
                        $("#div_enable_vlan").show()
                        $("#div_ipv6").hide()
                        $("#div_type_pd").hide()
			$("#div_dial_mode").hide()
			$("#div_ppp_name").hide()
			$("#div_ppp_pwd").hide()
                        $("#div_static_ip").hide()
                        $("#div_static_ipv6").hide()
			$("#div_dial_timeout").hide()
			$("#div_dial_manual").hide()
                }
        }	
	function page_save(){
                set_obj_data(MODIFIED_OBJ_DATA)
        }

        function set_obj_success_cb(obj) {
                //show_alert(L.common.success_title, L.common.save_success);
                ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
        }
        function set_obj_error_cb(obj) {
                //show_alert(L.common.fail_title, L.common.save_fail)
		if (obj.api_return == 403) {
                        logout('sto');
                }
        }
        function set_obj_data(obj_content){
                if(typeof(obj_content) == 'string')
                        API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
                else if(typeof(obj_content) == 'object')
                        API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
        }
