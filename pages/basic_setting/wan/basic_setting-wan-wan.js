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
                for(var i=0;i<MODIFIED_OBJ_DATA.Wan.WanT.length;i++){
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

	function set_info_success_cb(obj) {
		
	}
	function set_info_error_cb(obj) {
		if (obj.api_return == 403)
			logout('sto')
	}

	function set_info_data(obj_content){
		if(typeof(obj_content) == 'string')
			API.info.set(JSON.parse(obj_content), set_info_success_cb, set_info_error_cb);
		else if(typeof(obj_content) == 'object')
			API.info.set(obj_content, set_info_success_cb, set_info_error_cb);
	}

	function get_info_success_cb(obj) {
		INFO_DATA = API.obj.copy(obj);
		get_obj_data(OBJ_LIST);
		loading_control(0);
	}
	
	function get_info_error_cb(obj) {
		loading_control(0);
		if(obj.api_return == 403)
			logout('sto');
	}
	
	function get_info_data(info_list){
		API.info.get(info_list, get_info_success_cb, get_info_error_cb);
	}

	function page_initial(){
		//Coding initial function here
		loading_control(1);
		get_info_data(INFO_LIST);
	}
	function wan_refresh(){
		get_obj_data(OBJ_LIST);
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

			var conn_st = INFO_DATA.WanStatus.Ipv4[$('#wan_name').val()].ConnectStatus.toLowerCase();
			var conn_ty = INFO_DATA.WanStatus.Ipv4[$('#wan_name').val()].Type.toLowerCase();
			if (conn_st == "connected" && conn_ty == "pppoe"){
				$("#connect_btn").attr("class","el-button el-button--info el-button--mini")
				$("#disconnect_btn").attr("class","el-button el-button--primary el-button--mini")
				$("#div_dial_alert").hide()
				enable_btn = 0;
			}else if(conn_st == "disconnected" && conn_ty == "pppoe"){
				$("#connect_btn").attr("class","el-button el-button--primary el-button--mini")
				$("#disconnect_btn").attr("class","el-button el-button--info el-button--mini")
				$("#div_dial_alert").hide()
				enable_btn = 1;
			}else{
				$("#connect_btn").attr("class","el-button el-button--info el-button--mini")
				$("#disconnect_btn").attr("class","el-button el-button--info el-button--mini")
				$("#div_dial_alert").show()
				enable_btn = 2;
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
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].VlanEnabled = "0";
                                        $("#div_vlan_id").hide()
                                        $("#div_802").hide()
                                }
                                if(obj.id=="switch_nat"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].NatEnabled = "0";
				}
                                if(obj.id=="switch_enable"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Enabled = "0";
				}
                                if(obj.id=="switch_PD"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6PdEnabled = "0";
				}
                        }else{  
                                $(obj).parent().attr('class','el-switch is-checked')
                                if(obj.id=="switch_VLAN"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].VlanEnabled = "1";
                                        $("#div_vlan_id").show()
                                        $("#div_802").show()
                                }
                                if(obj.id=="switch_nat"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].NatEnabled = "1";
				}
                                if(obj.id=="switch_enable"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Enabled = "1";
				}
                                if(obj.id=="switch_PD"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6PdEnabled = "1";
				}
                        }
                }else{
        	        if(val == "1"){
                	        $(obj).parent().attr('class','el-switch is-checked')
                                if(obj.id=="switch_VLAN"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].VlanEnabled = "1";
                                        $("#div_vlan_id").show()
                                        $("#div_802").show()
                                }
                                if(obj.id=="switch_nat"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].NatEnabled = "1";
				}
                                if(obj.id=="switch_enable"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Enabled = "1";
				}
                                if(obj.id=="switch_PD"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6PdEnabled = "1";
				}
			}else{
                        	$(obj).parent().attr('class','el-switch')
                                if(obj.id=="switch_VLAN"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].VlanEnabled = "0";
                                        $("#div_vlan_id").hide()
                                        $("#div_802").hide()
                                }
                                if(obj.id=="switch_nat"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].NatEnabled = "0";
				}
                                if(obj.id=="switch_enable"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Enabled = "0";
				}
                                if(obj.id=="switch_PD"){
					MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Ipv6PdEnabled = "0";
				}
			}
               }
        }
	
        function switch_radio(obj, flag){
                $(obj).parent().attr('class','el-radio__input is-checked')
                if(obj.id=="radio_dhcp"){
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].ConnectionType = 'dhcp'
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].LinkType = 'ip'
			//max and customize value
			if(!flag)
				$('#mtu').val('1500')
			else
				$('#mtu').val(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mtu)
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
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].LinkType = 'ip'
			if(!flag)
				$('#mtu').val('1500')
			else
				$('#mtu').val(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mtu)
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
			MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].LinkType = 'ppp'
			if(!flag)
				$('#mtu').val('1492')
			else
				$('#mtu').val(MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()].Mtu)
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
		if(typeof(obj)=="undefined")
			var wan = MODIFIED_OBJ_DATA.Wan.WanT[$('#wan_name').val()]
		else
			var wan = MODIFIED_OBJ_DATA.Wan.WanT[obj]
                $("#mtu").val(wan.Mtu)
                $("#vlan_id").val(wan.VlanId)
                $("#wan_proto").val(wan.IpProtocolType)
                $("#wan_802").val(wan.Vlan8021P)
                $("#wan_mode").val(wan.Mode)
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
                                switch_radio($("#radio_dhcp")[0], 1)
				$("#div_dial_mode").hide()
				$("#div_ppp_name").hide()
				$("#div_ppp_pwd").hide()
                        	$("#div_static_ip").hide()
                        	$("#div_static_ipv6").hide()
                        }
                        else if(wan.ConnectionType == "static"){
                                switch_radio($("#radio_static")[0], 1)
				$("#div_dial_mode").hide()
				$("#div_ppp_name").hide()
				$("#div_ppp_pwd").hide()
                        	$("#div_static_ip").show()
                        	$("#div_static_ipv6").show()
                        }
                        else if(wan.ConnectionType == "pppoe"){
                                switch_radio($("#radio_pppoe")[0], 1)
				$("#div_dial_mode").show()
				$("#div_ppp_name").show()
				$("#div_ppp_pwd").show()
                        	$("#div_static_ip").hide()
                        	$("#div_static_ipv6").hide()
                        }
                        if(wan.Ipv6AddressMode == "dhcpv6"){
                                switch_radio($("#radio_v6")[0])
                        }
                        else{
                                switch_radio($("#radio_SLAAC")[0])
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
		}
		return true
	}	
	function page_save(){
		if(!vlan_rule_validation())
			return;
		if(!static_rule_validation())
			return;
			
		save_table()
		set_obj_data(MODIFIED_OBJ_DATA)
	}

	function WanUp(){
		if(enable_btn==1){
			var WanName = "WAN"+ String(parseInt($('#wan_name').val())+1)
			var wan_data = {"WanConnection":{"Action":"ifup","WanName":WanName}};
			set_info_data(wan_data)
			loading_control(1)
			setTimeout(function(){
			page_initial()
			},20000)
		}
	}
		
	function WanDown(){
		if(enable_btn==0){
			var WanName = "WAN"+ String(parseInt($('#wan_name').val())+1)
			var wan_data = {"WanConnection":{"Action":"ifdown","WanName":WanName}};
			set_info_data(wan_data)
			loading_control(1)
			setTimeout(function(){
				page_initial()
			},3000)
		}
	}

        function set_obj_success_cb(obj) {
			//show_alert(L.common.success_title, L.common.save_success);
			ORIGINAL_OBJ_DATA = API.obj.copy(MODIFIED_OBJ_DATA);
			// loading_wait_300s()
			loading_wait()
			
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
		function loading_wait(){
				var process_percentage = 0
				var bar_timer
				var intervalTimes = env_loading_time[0]/100
			
				loading_control(1)
				$("#loading_message").html(L.common.lang_plz_wait+"<br/>0%")
			
				bar_timer = setInterval(function(){
					process_percentage = process_percentage + 1
					$("#loading_message").html(L.common.lang_plz_wait+"<br/>"+process_percentage+"%")
					if( 100 == process_percentage ){
						clearInterval(bar_timer)
						loading_control(0);
					}
				},intervalTimes);
		}
