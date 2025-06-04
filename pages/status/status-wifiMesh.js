page_tag = 'status-wifiMesh'
var mesh_refresh;
var timeoutRefresh;
var timer;
var waitting_time = 60;
var prevent_lock = 0;
var MAP_GRAPH = {
	"nodes": [],
	"lines": []
}
var DISPLAY_MODE = 'table'
var CONTAINER_WIDTH = $("#view_page_zone").width() - ($("#view_page_zone").width() * 0.05);
var TPOPTION = {
	container: '#mapContainer',
	data: MAP_GRAPH,
	width: CONTAINER_WIDTH,
	height: 400
};
var NODE_LAYOUT_LIST
var DEVICE_LAYOUT_LIST
var HOSTNAME_LIST = []

$(document).ready(function() {
	$.lang_load("status_wifiMesh");
	page_initial()
});

function page_initial() {
	loading_control(1);
	map_data_prepare()
}

function mesh_topo_result(obj) {
	var mesh_node_index = 0
	var mesh_client_index = 0
	var MeshNode = []
	MAP_GRAPH.nodes.splice(0, MAP_GRAPH.nodes.length)
	MAP_GRAPH.lines.splice(0, MAP_GRAPH.lines.length)
	//GetDefineHost()
	//controller is first element of MeshNode
	var node = {
		"DevName": obj.DefinedName !== "" ? obj.DefinedName : obj.Name,
		"IPv4Addr": obj.IPv4,
		"MacAddr": obj.Mac,
		"Mode": obj.Mode,
		"Medtype": "N/A",
		"Upstream": "N/A",
		"Hops": 0,
		"TB_ACTION": {
			"more": "node_control('"+(mesh_node_index++)+"','root','" + obj.Mac + "','node','" + obj.Name + "')"
		}
	}
	MeshNode.push(node);

	MAP_GRAPH.nodes.push({
		"hostname": obj.DefinedName !== "" ? obj.DefinedName : obj.Name,
		"macaddr": obj.Mac,
		"type": obj.Mode.toLowerCase(),
		"status": "1",
		"info": {
			"netstatus": "online"
		}
	});
	var DeviceNode = []
	$.each(obj.LegacyDevices, function(index, dev) {
		var device = {
			"DevName": dev.DefinedName !== "" ? dev.DefinedName : dev.Name,
			"IPv4Addr": dev.IPv4,
			"MacAddr": dev.Mac,
			"Mode": "",
			"Medtype": dev.medtype,
			"Upstream": obj.Mac,
			"Hops": 1,
			"TB_ACTION": {
				"more": "node_control('" + (mesh_client_index++) + "','" + dev.medtype + "','" + dev.Mac + "','device','" + dev.Name + "')"
			}
		}
		DeviceNode.push(device);
		var graph_index = MAP_GRAPH.nodes.length;
		var if_type = dev.medtype;
		if (if_type == "ETHER") if_type = "Eth";
		MAP_GRAPH.nodes.push({
			"hostname": dev.DefinedName !== "" ? dev.DefinedName : dev.Name,
			"macaddr": dev.Mac,
			"type": "client",
			"status": "1",
			"info": {
				"netstatus": "online"
			}
		});
		MAP_GRAPH.lines.push({
			"source": 0,
			"target": graph_index,
			"status": (MAP_GRAPH.nodes[0].status && MAP_GRAPH.nodes[graph_index].status),
			"netspeed": "",
			"ifname": if_type
		});
	});
	$.each(obj.DB, function(index, db) {
		var device_index = DeviceNode.findIndex((d) => {
			return d.MacAddr == db.Mac
		});
		var med_type = "";
		var max_mid = 0;
		var med_rssi = "none" ;
		$.each(db.Connect, function(index2, row) {
			if (row.messageID >= max_mid) {
				max_mid = row.messageID;
				med_type = row.medtype;
				med_rssi = row.rssi;
			}
		});
		if (device_index < 0) {
			var node = {
				"DevName": db.DefinedName !== "" ? db.DefinedName : db.Name,
				"IPv4Addr": db.IPv4,
				"MacAddr": db.Mac,
				"Mode": db.Mode,
				"Rssi": med_rssi,
				"Medtype": med_type,//.includes("WLAN") ? med_type + "(" + med_rssi + ")" : med_type,
				"Upstream": db.Upstream_device,
				"Hops": db.Hops,
				"TB_ACTION": {
					"more": "node_control('"+(mesh_node_index++)+"','" + med_type + "','" + db.Mac + "','node','" + db.Name + "')"
				}
			};
			MeshNode.push(node);
			var graph_index = MAP_GRAPH.nodes.length;
			MAP_GRAPH.nodes.push({
				"hostname": db.DefinedName !== "" ? db.DefinedName : db.Name,
				"macaddr": db.Mac,
				"type": "agent",
				"status": "1",
				"info": {
					"netstatus": "online"
				}
			});
			var up_graph_index = MAP_GRAPH.nodes.findIndex((d) => {
				return d.macaddr == db.Upstream_device
			});
			if (up_graph_index >= 0) {
				var if_type = med_type;
				if (if_type == "ETHER") if_type = "Eth";
				MAP_GRAPH.lines.push({
					"source": up_graph_index,
					"target": graph_index,
					"status": (MAP_GRAPH.nodes[0].status && MAP_GRAPH.nodes[graph_index].status),
					"netspeed": "",
					"ifname": if_type
				});
			}
		} else {
			var node = { ...DeviceNode[device_index]
			};
			DeviceNode.splice(device_index, 1);
			if (db.IPv4 != "") node["IPv4Addr"] = db.IPv4;
			if (db.Mode != "") node["Mode"] = db.Mode;
			if (med_type != "") node["Medtype"] = med_type;
			if (db.Upstream_device != "") node["Upstream"] = db.Upstream_device;
			if (node["Hops"] < db.Hops) node["Hops"] = db.Hops;
			node["TB_ACTION"] = {
				"more": "node_control('"+(mesh_node_index++)+"','" + node["Medtype"] + "','" + db.Mac + "','node','" + db.Name + "')"
			}
			MeshNode.push(node);
			var graph_node_index = MAP_GRAPH.nodes.findIndex((d) => {
				return d.macaddr == db.Mac
			});
			MAP_GRAPH.nodes[graph_node_index].type = "agent";
		}
		if (db.LegacyDevices && Array.isArray(db.LegacyDevices)) {
		$.each(db.LegacyDevices, function(index, dev) {
			var dev_index = DeviceNode.findIndex((d) => {
				return d.MacAddr == dev.Mac
			});
			var mesh_index = MeshNode.findIndex((d) => {
				return d.MacAddr == dev.Mac
			});
			if (mesh_index < 0) {
				if (dev_index < 0) {
					var node = {
						"DevName": dev.DefinedName !== "" ? dev.DefinedName : dev.Name,
						"IPv4Addr": dev.IPv4,
						"MacAddr": dev.Mac,
						"Mode": "",
						"Medtype": dev.medtype,
						"Rssi": dev.Rssi,
						"Upstream": db.Mac,
						"Hops": db.Hops + 1,
						"TB_ACTION": {
							"more": "node_control('" + (mesh_client_index++) + "','" + dev.medtype + "','" + dev.Mac + "','device','" + dev.Name + "')"
						}
					};
					DeviceNode.push(node);
					var graph_index = MAP_GRAPH.nodes.length;
					MAP_GRAPH.nodes.push({
						"DevName": dev.DefinedName !== "" ? dev.DefinedName : dev.Name,
						"macaddr": dev.Mac,
						"type": "client",
						"status": "1",
						"info": {
							"netstatus": "online"
						}
					});
					var up_graph_index = MAP_GRAPH.nodes.findIndex((d) => {
						return d.macaddr == db.Mac
					});
					if (up_graph_index >= 0) {
						var if_type = dev.medtype;
						if (if_type == "ETHER") if_type = "Eth";
						MAP_GRAPH.lines.push({
							"source": up_graph_index,
							"target": graph_index,
							"status": (MAP_GRAPH.nodes[up_graph_index].status && MAP_GRAPH.nodes[graph_index].status),
							"netspeed": "",
							"ifname": if_type
						});
					}
				} else {
					var node = DeviceNode[dev_index];
					if (node["Hops"] < (db.Hops + 1)) {
						node["Upstream"] = db.Mac;
						node["Medtype"] = dev.medtype;
						node["Hops"] = db.Hops + 1;
						node["TB_ACTION"] = {"more": "node_control('" + dev_index + "','" + dev.medtype + "','" + dev.Mac + "','device','" + dev.Name + "')"}
						var graph_t_node_index = MAP_GRAPH.nodes.findIndex((d) => {
							return d.macaddr == dev.Mac
						});
						var graph_s_node_index = MAP_GRAPH.nodes.findIndex((d) => {
							return d.macaddr == db.Mac
						});
						var graph_line_index = MAP_GRAPH.lines.findIndex((d) => {
							return d.target == graph_t_node_index
						});
						if (dev.medtype == "ETHER") MAP_GRAPH.lines[graph_line_index].ifname = "Eth";
						MAP_GRAPH.lines[graph_line_index].source = graph_s_node_index;
					}
				}
			} else {
				var node = MeshNode[mesh_index];
				if (node["Medtype"] == "") node["Medtype"] = dev.medtype ;
				else node["Medtype"] = dev.medtype //.includes("WLAN") ? dev.medtype + "(" + dev.Rssi + ")" : dev.medtype;
				if (node["Upstream"] == "") node["Upstream"] = db.Mac;
				if (node["Hops"] < (db.Hops + 1)) node["Hops"] = db.Hops + 1;
				node["TB_ACTION"] = {
					"more": "node_control('"+ mesh_index +"','" + node["Medtype"] + "','" + dev.Mac + "','node','" + dev.Name + "')"}
				var graph_index = MAP_GRAPH.nodes.findIndex((d) => {
					return d.macaddr == node["MacAddr"]
				});
				var up_graph_index = MAP_GRAPH.nodes.findIndex((d) => {
					return d.macaddr == node["Upstream"]
				});
				if (up_graph_index >= 0) {
					var if_type = dev.medtype;
					if (if_type == "ETHER") if_type = "Eth";
					MAP_GRAPH.lines.push({
						"source": up_graph_index,
						"target": graph_index,
						"status": (MAP_GRAPH.nodes[up_graph_index].status && MAP_GRAPH.nodes[graph_index].status),
						"netspeed": "",
						"ifname": if_type
					});
				}
			}
		});
		} // if
	})
	set_mesh_topology_table(MeshNode, DeviceNode);
	TPOPTION.width = $("#view_page_zone").width() - 60
}

function set_mesh_topology_table(mesh_node, device_node) {
	NODE_LAYOUT_LIST = mesh_node
	DEVICE_LAYOUT_LIST = device_node
	update_table('Mesh_topology_table', mesh_node, MESH_NODE_COLUMNS_LIST_VALUE)
	update_table('Device_topology_table', device_node, MESH_CLIENT_COLUMNS_LIST_VALUE)
	if (DISPLAY_MODE == 'table')
		loading_control(0);
}

function get_topo_success_cb(obj) {
	let MeshNode = [], DeviceNode = []; 
	info_data = API.obj.copy(obj);
	HOSTNAME_LIST = info_data.GetHost;
	if (prevent_lock == 1) {
		prevent_lock = 0;
		interval_refresh();
	}
	if (info_data.MeshTopoStatus.status == "OK") {
    warning_control('off', 'global');
		mesh_topo_result(info_data.MeshTopoStatus.data);
	} else if (info_data.MeshTopoStatus.status == "NOK") {
		set_mesh_topology_table(MeshNode, DeviceNode);
		warning_control('on','global',L.error_message.lang_error44_msg);
	}
}

function init_trigger_error_cb(obj) {
	if (obj.api_return == 403) {
		logout('sto');
		return;
	}
}



function open_map_topology() {
	DISPLAY_MODE = 'graph'
	action = [{
		"style": "default",
		"text": "Back",
		"action": "close_map_topology()"
	}, {
		"style": "primary",
		"text": "Refresh",
		"action": "refresh_map('1')"
	}]
	pop_dialog('meshmap', action, 'show_graph()')
}

function close_map_topology() {
	DISPLAY_MODE = 'table'
	close_dialog()
}

function open_map_log(){
    action = [{
		"style": "default",
		"text": "Back",
		"action": "close_dialog()"
	}, {
		"style": "primary",
		"text": "Refresh",
		"action": "refresh_log()"
	}]
	pop_dialog('meshlog', action, 'refresh_log()')
}

function get_log_success_cb(obj){
    var log_html = ""
    if( 'undefined' != typeof(obj.WlanMAPNetworkSteeringAction.SteeringLog) ){
        $.each(obj.WlanMAPNetworkSteeringAction.SteeringLog, function(index, line) {
            log_html = log_html + line + '<br\>'
        });
    }
    
    $("#mesh_log_result").html(log_html)
}

function get_log_error_cb(obj){
    if (obj.api_return == 403) {
		logout('sto');
		return;
	}
}

function get_hostname_error_cb(obj){
    if (obj.api_return == 403) {
		logout('sto');
		return;
	}
}

function get_hostname_success_cb(obj){
	var info_data = ""
	info_data = API.obj.copy(obj);
	HOSTNAME_LIST = info_data.GetHost;
}


function refresh_log(){
    API.info.get(['WlanMAPNetworkSteeringAction'], get_log_success_cb, get_log_error_cb, 5000);
}

function map_data_prepare() {
	API.info.get(['MeshTopoStatus','GetHost'], get_topo_success_cb, init_trigger_error_cb, 30000);
}

function refresh_map(ignore_lock) {
	if ('undefined' != typeof(ignore_lock) && ignore_lock == "1") prevent_lock = 0
	if (page_tag != "status-wifiMesh" || prevent_lock == 1) {
		clearInterval(mesh_refresh);
		clearInterval(timer);
		return;
	}
	if (prevent_lock == 0) map_data_prepare();
	else $(TPOPTION.container).html("");
	prevent_lock = 1;
	clearTimeout(timeoutRefresh)
	clearInterval(mesh_refresh);
	topology_show(0)
}

function interval_refresh() {
	timeout_refresh();
	clearInterval(mesh_refresh);
	mesh_refresh = setInterval(function() {
		refresh_map();
	}, waitting_time * 1000 + 2000)
}

function timeout_refresh() {
	clearTimeout(timeoutRefresh)
	topology_show(0);
	timeoutRefresh = setTimeout(function() {
		topology_show(1);
		//show_button();
	}, 2000)
}

function show_graph() {
	$.getScript("/js/d3-meshmap.js").done(function(script, textStatus) {
		$(TPOPTION.container).html("");
		var tp = new TPChart(TPOPTION);
		tp.init()
		interval_refresh();
		document.addEventListener("click", function() {
			if ($('#dialog-frame').is(":hidden")) {
				clearInterval(mesh_refresh);
				clearTimeout(timeoutRefresh);
				clearInterval(timer);
				prevent_lock = 0;
			}
		})
	})
}

function topology_show(enable = 0) {
	if (enable == 0) {
		timer_refresh(enable);
		loading_control(1);
		$("#mapContainer").css("visibility", "hidden");
	} else {
		timer_refresh(enable);

		if (DISPLAY_MODE == 'graph'){
			var TPOPTION = {
				container: '#mapContainer',
				data: MAP_GRAPH,
				width: CONTAINER_WIDTH,
				height: 400
			};
			$(TPOPTION.container).html("");
			var tp = new TPChart(TPOPTION);
			tp.init()
		}
		loading_control(0);
		$("#mapContainer").css("visibility", "visible");
	}
}

function timer_refresh(enable = 0) {
	clearInterval(timer);
	let countdown = waitting_time;
	if (enable == 0) {
		$('#countdown').text(" " + countdown + "s");
	} else {
		timer = setInterval(function() {
			countdown--;
			$('#countdown').text(" " + countdown + "s");
		}, 1000)
	}
}


// For Demo

function hide_control_bar() {
	$(".mesh_control_zone").remove()
	prevent_lock = 0
}

function GetDefineHost() {
	API.info.get(['GetHost'], get_hostname_success_cb, get_hostname_error_cb, 30000);
}

function getDefineHostname(macAddress) {
    let lowerMac = macAddress.toLowerCase();
    var host
    if(HOSTNAME_LIST.length)
        host = HOSTNAME_LIST.find(entry => entry.mac === lowerMac);
	if (host && host.Definehostname && host.Definehostname.length > 0) {
		return host.Definehostname;
	} else {
		return "Please Enter the value";
	}
}
function node_control(id, link, macaddr, type,name) {
    $.get("/piece/mesh_node_control.html", "", function(data){
		name = getDefineHostname(macaddr);
       _node_control(id, link, macaddr, type, data,name)
    });
}

function _node_control(id, link, macaddr, type, piece_content,name) {
	hide_control_bar()
	prevent_lock = 1
	site_more_html = piece_content
	steer_target_list_hostname = ['Select A Target']
	steer_target_list_mac = ['00:00:00:00:00:00']

	if(link=="WLAN5G")
		show_link='5G'
	else if(link=="WLAN6G")
		show_link='6G'
	else if(link=="WLAN2G")
		show_link='2.4G'
	else if(link=="ETHER")
		show_link='Ethernet'
	else
		show_link='Checking...'

	if ('node' == type) {
		$("#Mesh_topology_table_id_" + id).after(site_more_html);
		$("#steering").attr("onclick",'steer_control(\'bh\',\'' + id + '\');');
		if ( link !="root" ){
			if(link != ""){
				$.each(NODE_LAYOUT_LIST, function(index, dev) {
					if (dev.MacAddr == macaddr) return
					if ('undefined' != typeof(NODE_LAYOUT_LIST[id].Upstream) && dev.MacAddr == NODE_LAYOUT_LIST[id].Upstream) {
						$("#upstream_info").html(dev.DevName+" ("+NODE_LAYOUT_LIST[id].Upstream+")") 
						if(link!="ETHER"){
							if (typeof NODE_LAYOUT_LIST[id].Rssi !== 'undefined' && NODE_LAYOUT_LIST[id].Rssi !== "")
								$("#upstream_band_info").html(" "+show_link+"(signal: " + NODE_LAYOUT_LIST[id].Rssi +" dBm)")
						}else if(link=="ETHER"){
							$("#upstream_band_info").html(" "+show_link)
							$("#select_dev_list").hide()
							$("#steering").hide()
						}
						return
					}
					steer_target_list_hostname.push(dev.DevName)
					steer_target_list_mac.push(dev.MacAddr)
				});
			}
			if (link == '')
				link = NODE_LAYOUT_LIST[id].Medtype
			if(link=="WLAN5G")
				sel='5'
			else if(link=="WLAN6G")
				sel='6'
			else if(link=="WLAN2G")
				sel='2'
			else{
				$("#steering").hide()
				$("#band_list_zone").hide()
				sel='2'
			}
			
			$("#switch_bnad").attr("onclick",'bh_band_control(\'' + NODE_LAYOUT_LIST[id].MacAddr + '\', 0);');
			$("#switch_bnad_fix").attr("onclick",'bh_band_control(\'' + NODE_LAYOUT_LIST[id].MacAddr + '\', 1);');
			//draw_custom_button('switch_bnad', 'Move', 'bh_band_control(\'' + NODE_LAYOUT_LIST[id].MacAddr + '\');', 'fa-exchange');
			//draw_custom_button('switch_bnad_fix', 'Move', 'bh_band_control(\'' + NODE_LAYOUT_LIST[id].MacAddr + '\');', 'fa-exchange');
			draw_select("band_list", BH_SUPPORT_BAND_STR, BH_SUPPORT_BAND_VAL, "", sel, "Band Steer to", 12)
		} // if 
		else{
			$("#steering").hide()
			$("#upstream_container").hide()
			$("#band_list_zone").hide()
			$("#select_dev_list").hide()
		}
	} else if ('device' == type) {
		$("#Device_topology_table_id_" + id).after(site_more_html);
		draw_custom_button('steering', 'Move', 'steer_control(\'sta_ap\',\'' + id + '\');', 'fa-exchange');
		$("#steering").attr("onclick",'steer_control(\'sta_ap\',\'' + id + '\');');
		if(link != ""){
			$.each(NODE_LAYOUT_LIST, function(index, dev) {
				if (dev.MacAddr == macaddr) return
				if ('undefined' != typeof(DEVICE_LAYOUT_LIST[id].Upstream) && dev.MacAddr == DEVICE_LAYOUT_LIST[id].Upstream){
					if(link!="ETHER"){
						//if (typeof NODE_LAYOUT_LIST[id].Rssi !== 'undefined' && NODE_LAYOUT_LIST[id].Rssi !== "")
						//	$("#upstream_band_info").html("Signal: " + NODE_LAYOUT_LIST[id].Rssi +" dBm")
						$("#upstream_band_info").html(" "+show_link)
					}else if(link=="ETHER")
						$("#upstream_band_info").html(" "+show_link)
					$("#upstream_info").html(dev.DevName+" ("+DEVICE_LAYOUT_LIST[id].Upstream+")")
					// if (DEVICE_LAYOUT_LIST[id].Rssi != "" )
					// $("#upstream_band_info").html("Signal: " + DEVICE_LAYOUT_LIST[id].Rssi +" dBm")
					return
				}
				if(link!="ETHER"){
					steer_target_list_hostname.push(dev.DevName)
					steer_target_list_mac.push(dev.MacAddr)
				}else{
					$("#steering").hide()
					$("#band_list_zone").hide()
					$("#select_dev_list").hide()
				}
			});
		}
		if (link == '')
			link = DEVICE_LAYOUT_LIST[id].Medtype
        if(link=="WLAN5G")
            sel='5'
        else if(link=="WLAN6G")
            sel='6'
        else if(link=="WLAN2G")
            sel='2'
        else{
            $("#band_list_zone").hide()
            sel='2'
        }
		
        $("#switch_bnad").attr("onclick",'steer_control(\'sta_band\',\'' + id + '\');');
		$("#switch_bnad_fix").css("display","none");
        //draw_custom_button('switch_bnad', 'Move', 'steer_control(\'sta_band\',\'' + id + '\');', 'fa-exchange');
        draw_select("band_list", BH_SUPPORT_BAND_STR, BH_SUPPORT_BAND_VAL, "", sel, "Band Steer to", 12)
	}
	$("#btn_steering").hide()
	draw_select("dev_list", steer_target_list_hostname, steer_target_list_mac,'select_steer_check(\''+ macaddr + '\')', "", "SteerTo", 12)
	$( "#dev_list" ).on( "change", function() {
		if($("#dev_list").val() != "00:00:00:00:00:00")
			$("#btn_steering").show()
		else
			$("#btn_steering").hide()
	} );
	draw_input('hostname','Hostname',name,'',63,10)
	$("#save_host").attr("onclick",'define_hostname_control(\''+ macaddr + '\', \'' + type + '\');');

}

function select_steer_check(macaddr) {
	var target_device_mac = $("#dev_list").val()  
	$.each(NODE_LAYOUT_LIST, function(index, dev) {
		if (dev.MacAddr == target_device_mac) {
			if ( dev.Upstream == macaddr ) {
				alert(L.error_message.lang_error46_msg);
				$("#dev_list").val("00:00:00:00:00:00");
				return
			}
		}
		
	})
}

function define_hostname_control(macaddr,type){
    loading_control(1);
    target_hostname=$("#hostname").val()
    if (target_hostname == " " ) {
        loading_control(0);
        window.alert("Please input a hostname!");
        return;
    }
    steer_cmd = {
    "GetHost": {
	"Type": type,
    "MacAddress": macaddr,
    "DefineHostname": target_hostname,
    }
    }
    if (steer_cmd != "") set_info_data(steer_cmd, set_info_success_cb, set_info_error_cb)

}



function set_info_success_cb(obj) {
    setTimeout("refresh_map(1);", 5000);
}

function set_info_error_cb(obj) {
	loading_control(0);
	if (obj.api_return == 403) {
		logout('sto');
	}
}

function steer_control(type, list_id) {
	loading_control(1);
	target_device_mac = $("#dev_list").val()
	steer_cmd = ""
	if ("bh" == type) {
		mac = NODE_LAYOUT_LIST[list_id].MacAddr
		if(NODE_LAYOUT_LIST[list_id].Medtype.includes('WLAN2G'))
			band = '2'
		else if(NODE_LAYOUT_LIST[list_id].Medtype.includes('WLAN5G'))
			band = '5'
		else if(NODE_LAYOUT_LIST[list_id].Medtype.includes('WLAN6G'))
			band = '6'
		else
			band = ''

		if(band == ""){
			loading_control(0);
			window.alert('BH Steering only use for Connection Type is WLAN!')
			return;
		}  
		steer_cmd = {
			"WlanMAPNetworkSteeringAction": {
				"Action": "bh",
				"ActionSource": "gui",
				"ActionData": {
					"agent_device_mac": mac,
					"bhap_bssid":"refer",
					"current_band": band,
					"target_device_mac": target_device_mac,
					"steer_timeout": "30"
				}
			}
		}
	} else if ("sta_ap" == type) {
		mac = DEVICE_LAYOUT_LIST[list_id].MacAddr
		if(DEVICE_LAYOUT_LIST[list_id].Medtype == 'WLAN2G')
			band = '2'
		else if(DEVICE_LAYOUT_LIST[list_id].Medtype == 'WLAN5G')
			band = '5'
		else if(DEVICE_LAYOUT_LIST[list_id].Medtype == 'WLAN6G')
			band = '6'
		else
			band = ''

		if(band == ""){
			loading_control(0);
			window.alert('Client Steering only use for Connection Type is WLAN!')
			return;
		}  

		steer_cmd = {
			"WlanMAPNetworkSteeringAction": {
				"Action": "sta",
				"ActionSource": "gui",
				"ActionData": {
					"sta_mac": mac,
					"ap_bssid":"refer",
					"current_band": band,
					"target_device_mac": target_device_mac,
					"btm_disassoc_imminent": "1"
				}
			}
		}
	}else if ("sta_band" == type) {
		mac = DEVICE_LAYOUT_LIST[list_id].MacAddr

		if(DEVICE_LAYOUT_LIST[list_id].Medtype == 'WLAN2G')
			band = '2'
		else if(DEVICE_LAYOUT_LIST[list_id].Medtype == 'WLAN5G')
			band = '5'
		else if(DEVICE_LAYOUT_LIST[list_id].Medtype == 'WLAN6G')
			band = '6'
		else
			band = ''

		if(band == ""){
			loading_control(0);
			window.alert('Client Steering only use for Connection Type is WLAN!')
			return;
		}  

        target_band=$("#band_list").val()

		steer_cmd = {
			"WlanMAPNetworkSteeringAction": {
				"Action": "sta_band",
				"ActionSource": "gui",
				"ActionData": {
					"sta_mac": mac,
					"ap_bssid":"refer",
					"current_band": band,
					"target_device_mac":DEVICE_LAYOUT_LIST[list_id].Upstream,
					"target_band": target_band,
					"btm_disassoc_imminent": "1"
				}
			}
		}
	}

	if (steer_cmd != "") set_info_data(steer_cmd, set_info_success_cb, set_info_error_cb)
}

function bh_band_control(target_mac, force){
	loading_control(1);
	
    target_band=$("#band_list").val()
    
    steer_cmd = {
        "MeshVendorSpecificCommand": {
            "Type": "Send",
            "Action": "bh_band",
            "Data": {
                "MacAddress": target_mac,
                "Band":target_band,
				"Force":force
            }
        }
    }
    if (steer_cmd != "") set_info_data(steer_cmd, set_info_success_cb, set_info_error_cb)
}

function sta_band_control(target_mac){
    loading_control(1);

    target_band=$("#bh_band_list").val()
    
    steer_cmd = {
        "MeshVendorSpecificCommand": {
            "Type": "Send",
            "Action": "sta_band",
            "Data": {
                "MacAddress": target_mac,
                "Band":target_band
            }
        }
    }
    if (steer_cmd != "") set_info_data(steer_cmd, set_info_success_cb, set_info_error_cb)
}

function set_info_data(obj_content, success_cb, error_cb) {
	if (typeof(obj_content) == 'string') API.info.set(JSON.parse(obj_content), success_cb, error_cb);
	else if (typeof(obj_content) == 'object') API.info.set(obj_content, success_cb, error_cb);
}