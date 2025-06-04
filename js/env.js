var lang_data=['en','tw','cn']
var search_function_enabled="0"
var captcha_function_enabled="0"
var opmode_ap_untag_enabled="0"
var qs_enabled="0"
var qs_mode="eseries-mesh"
var brand_style="pccw"
var mpt_enabled="0"
var imda_enabled="0"
var multi_account_enabled="0"
var ipfilter_proto_display="1"
var env_loading_time = ['180000', '140000', '5000']
var G_MESH_SUPPORT="1"
var G_STORAGE_SUPPORT="0"
var G_TELNET_SUPPORT="0"
var G_SSH_SUPPORT="1"
var G_AP_MODE_IP="192.168.100.100"
var G_ETH_PORT_LIST=['WAN','LAN1','LAN2','LAN3','LAN4']
var G_MULTI_WAN_SUPPORTED="0"
var G_DEMO_ELNABLED="0"
var G_WAN_BRIDGE_SUPPORT="0"
var G_WLAN_MULTIPLE_SSID_MODE="0"
var G_VLAN_ENABLED="0"
var G_USP_ENABLED="0"
var G_WIFIZONE_ENABLED="0"

if (G_MESH_SUPPORT == "1"){
	var mesh_status_page="Y"
	var mesh_control_page="Y"
}else{
	var mesh_status_page="N"
	var mesh_control_page="N"
}

if (G_STORAGE_SUPPORT == "1"){
	var storage_main_page="Y"
	var storage_dlna_page="Y"
}else{
	var storage_main_page="N"
	var storage_dlna_page="N"
}

if (G_TELNET_SUPPORT == "1"){
	var telnet_main_page="Y"
}else{
	var telnet_main_page="N"
}

if (G_SSH_SUPPORT == "1"){
	var ssh_main_page="Y"
}else{
	var ssh_main_page="N"
}

if (G_WLAN_MULTIPLE_SSID_MODE == "1"){
	var l1_wifi_zone="Y"
	var l2_wifi_zone="N"
}else{
	var l1_wifi_zone="N"
	var l2_wifi_zone="Y"
}

if(G_USP_ENABLED == "1")
	var usp_main_page="Y"
else
	var usp_main_page="N"

if(G_WIFIZONE_ENABLED == "1")
	var wiifzone_page="Y"
else
	var wiifzone_page="N"
	
	
var mainmenu_data = {
	"dashboard": {
		"enabled": "Y",
		"admin": "Y",
		"superadmin": "Y",
		"independent_page": "Y",
		"display_mode": "common",
		"icon": "icon-1/ico-home.svg",
		"href": "dashboard.html"
	},
	"status": {
		"enabled": "Y",
		"admin": "Y",
		"superadmin": "Y",
		"independent_page": "N",
		"display_mode": "common",
		"icon": "icon-1/menu-status.svg",
		"href": "status-wan.html"
	},
	"basic_setting": {
		"enabled": "Y",
		"admin": "Y",
		"superadmin": "Y",
		"independent_page": "N",
		"display_mode": "common",
		"icon": "icon-1/menu-basic.svg",
		"href": "status-wan.html"
	},
	"wlan": {
		"enabled": l1_wifi_zone,
		"admin": "Y",
		"superadmin": "Y",
		"independent_page": "N",
		"display_mode": "common",
		"icon": "icon-1/menu-wifi.svg",
		"href": "status-wan.html"
	},
	"adv_setting": {
		"enabled": "Y",
		"admin": "Y",
		"superadmin": "Y",
		"independent_page": "N",
		"display_mode": "common",
		"icon": "icon-1/menu-advanced.svg",
		"href": "status-wan.html"
	},
	"application": {
		"enabled": "Y",
		"admin": "Y",
		"superadmin": "Y",
		"independent_page": "N",
		"display_mode": "common",
		"icon": "icon-1/menu-security.svg",
		"href": "status-wan.html"
	},
	"management": {
		"enabled": "Y",
		"admin": "Y",
		"superadmin": "Y",
		"independent_page": "N",
		"display_mode": "common",
		"icon": "icon-1/menu-utilities.svg",
		"href": "status-wan.html"
	}
}
var dashboard_data = {
	"home": {
		"device_info": {
			"enable": "Y",
			"location": "left"
		},
		"attached_device": {
			"enable": "Y",
			"location": "left"
		},
		"speed_test": {
			"enable": "Y",
			"location": "center"
		},
		"internet_status": {
			"enable": "Y",
			"location": "center"
		},
		"wireless": {
			"enable": "Y",
			"location": "center"
		},
		"diag": {
			"enable": "Y",
			"location": "right"
		}
	}
}

var submenu_data={
	"status":{
		"wan":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"icon":"ic_status_wan",
			"href":"status-single_wan.html"
		},
		"lan":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"icon":"ic_status_lan",
			"href":"status-lan.html"
		},
		"statistics":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"icon":"ic_status_statistics",
			"href":"status-statistics.html"

		},
		"throughtput":{
			"enabled": "N",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"icon":"ic_status_throughtput",
			"href":"status-throughtput.html"
		},
		"throughput":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"icon":"ic_status_throughput",
			"href":"status-throughput.html"
		},
		"wifiNeighbor":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"icon":"ic_wifi_tethering",
			"href":"status-wifiNeighbor.html"
		},
		"wifiMesh":{
			"enabled":mesh_status_page,
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"N",
			"independent_page":"Y",
			"display_mode": "router_only",
			"icon":"ic_devices_other",
			"href":"status-wifiMesh.html"
		},
		"dualImage":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"icon":"ic_manage_reboot",
			"href":"status-dualImage.html"
		}
	},
	"basic_setting":{
		"wan":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"icon":"ic_wifi_tethering",
			"href":"basic_setting-wan-single_wan.html"
		},
		"lan":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"ic_basic_lan",
			"href":"lan/basic_setting-lan-lan4.html",
			"sub_page":{
				"lan4":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-lan-lan4.html"
				},
				"lan6":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"display_mode": "router_only",
					"icon":"ic_status_wan",
					"href":"basic_setting-lan-lan6.html"
				}
			}
		},
		"wlan":{
			"enabled": l2_wifi_zone,
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"ic_status_wan",
			"sub_page":{
				"wifi_basic_allinone":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_basic_allinone.html"
				},
				"wifi_adv_allinone":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_adv_allinone.html"
				},
				"wifi_basic2":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_basic2.html"
				},
				"wifi_basic5":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_basic5.html"
				},
				"wifi_adv2":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_adv2.html"
				},
				"wifi_adv5":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_adv5.html"
				},
				"wifi_chs2":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_chs2.html"
				},
				"wifi_chs5":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_chs5.html"
				},
				"wifi_wps":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_wps.html"
				},
				"wifi_guest":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_guest.html"
				},
				"mesh":{
					"enabled":mesh_control_page,
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"N",
					"independent_page":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-mesh.html"
				},
				"mpt":{
					"enabled":"N",
					"bd":"1",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"independent_page":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-mpt.html"
				},
				"wifi_zone":{
					"enabled":wiifzone_page,
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wifi_zone.html                                                                                                                                                                                                                                                                                                                    "
				},
				"wireless_connection":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-wlan-wireless_connection.html"
				}
			}
			
		},
		"nat":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"sub_page_support":"Y",
			"icon":"ic_basic_NAT",
			"href":"nat/basic_setting-nat-portforward.html",
			"sub_page":{
				"portforward":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-nat-portforward.html"
				},
				"dmz":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-nat-dmz.html"
				},
				"alg":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-nat-alg.html"
				}
			}
		},
		"seciruty":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"sub_page_support":"Y",
			"icon":"ic_basic_Security",
			"href":"seciruty/basic_setting-seciruty-ipfilter.html",
			"sub_page":{
				"ipfilter":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-seciruty-ipfilter.html"
				},
				"macfilter":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"basic_setting-seciruty-macfilter.html"
				}
			}
		},
		"routing":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"sub_page_support":"N",
			"icon":"ic_basic_Routing",
			"href":"basic_setting-routing.html"
		}
	},
	"wlan":{
		"wifi_indep2":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"menu-wifi",
			"href":"wifi2/basic_setting-wlan-wifi_basic2.html",
			"sub_page":{
				"ssid2":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"wlan-wifi_indep2-ssid2.html"
				},
				"configuration2":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"wlan-wifi_indep2-configuration2.html"
				}
			}
		},
		"wifi_indep5":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"menu-wifi",
			"href":"",
			"sub_page":{
				"ssid5":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"wlan-wifi_indep5-ssid5.html"
				},
				"configuration5":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"wlan-wifi_indep5-configuration5.html"
				}
			}
		},
		"wifi_indep6":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"menu-wifi",
			"href":"",
			"sub_page":{
				"ssid6":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"wlan-wifi_indep6-ssid6.html"
				},
				"configuration6":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"wlan-wifi_indep6-configuration6.html"
				}
			}
		},
		"wifi_mlo":{
			"enabled":"Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"icon":"ic_status_wan",
			"href":"wlan-wifi_mlo.html"
		},
		"wifi_adv_common":{
			"enabled":"Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"icon":"ic_status_wan",
			"href":"wlan-wifi_adv_common.html"
		},
		"wifi_wps":{
			"enabled":"Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"icon":"ic_status_wan",
			"href":"../basic_setting/wlan/basic_setting-wlan-wifi_wps.html"
		},
		"wifi_guest":{
			"enabled":"N",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"icon":"ic_status_wan",
			"href":"../basic_setting/wlan/basic_setting-wlan-wifi_guest.html"
		},
		"mesh":{
			"enabled":mesh_control_page,
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"N",
			"independent_page":"Y",
			"icon":"ic_status_wan",
			"href":"../basic_setting/wlan/basic_setting-wlan-mesh.html"
		},
		"mpt":{
			"enabled":"N",
			"bd":"1",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"icon":"ic_status_wan",
			"href":"../basic_setting/wlan/basic_setting-wlan-mpt.html"
		},
		"wireless_connection":{
			"enabled":"Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"icon":"ic_status_wan",
			"href":"../basic_setting/wlan/basic_setting-wlan-wireless_connection.html"
		}
	},
	"adv_setting":{
		"qos":{
			"enabled": "N",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"sub_page_support":"N",
			"icon":"ic_manage_setting",
			"href":"adv_setting-qos.html"
		},
		"cwmp":{
			"enabled":"N",
			"admin":"N",
			"superadmin":"Y",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_devices_other",
			"href":"adv_setting-cwmp.html"
		},
		"telnet":{
			"enabled":telnet_main_page,
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"icon":"ic_appli_DLNA",
			"href":"adv_setting-telnet.html"
		},
		"ssh":{
			"enabled":ssh_main_page,
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"icon":"ic_appli_DDNS",
			"href":"adv_setting-ssh.html"
		},
		"service_control":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"sub_page_support":"N",
			"icon":"ic_games",
			"href":"adv_setting-service_control.html"
		},
		"parental_control":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "router_only",
			"sub_page_support":"N",
			"icon":"ic_basic_Parental",
			"href":"adv_setting-parental_control.html",
			"sub_page":{
				"time_restriction":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"adv_setting-parental_control-time_restriction.html"
				},
				"url_filter":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"adv_setting-parental_control-url_filter.html"
				}
			}
		},
		"usp_agent":{
			"enabled":usp_main_page,
			"admin":"N",
			"superadmin":"Y",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_devices_other",
			"href":"adv_setting-usp_agent.html"
		}
	},
	"application":{
		"upnp":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_appli_Multicast",
			"href":"application-upnp.html"
		},
		"ddns":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_https",
			"href":"application-ddns.html"
		},
		"storage":{
			"enabled":storage_main_page,
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"ic_appli_device",
			"href":"storage/application-storage-storage_info.html",
			"sub_page":{
				"storage_info":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"href":"application-storage-storage_info.html"
				},
				"storage_account":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"href":"application-storage-storage_account.html"
				},
				"share_floder":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"href":"application-storage-share_floder.html"
				},
				"samba":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"href":"application-storage-samba.html"
				},
				"ftp":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"href":"application-storage-ftp.html"
				}
			}
			
		},
		"dlna":{
			"enabled":storage_dlna_page,
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_appli_DLNA",
			"href":"application-dlna.html",
		},
		"multicast":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_manage_diagnosis",
			"href":"application-multicast-igmpMultiVer.html",
			"sub_page":{
				"igmp":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"application-multicast-igmpMultiVer.html"
				}
			}
			
		}
	},
	"management":{
		"reboot":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_manage_reboot",
			"href":"management-reboot.html"
		},
		"opmode":{
			"enabled":"N",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_appli_device",
			"href":"management-opmode.html"
		},
		"account":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_manage_accoun",
			"href":"management-account.html"
		},
		"remote":{
			"enabled":"N",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_manage_remote",
			"href":"management-remote.html"
		},
		"ntp":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"N",
			"icon":"ic_status_arp",
			"href":"management-ntp.html"
		},
		"settings":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"ic_manage_setting",
			"sub_page":{
				"reset_dafault":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-settings-reset_dafault.html"
				},
				"backup":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-settings-backup.html"
				},
				"fw_upgrade":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-settings-fw_upgrade.html"
				},
				"multi_lang":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-settings-multi_lang.html"
				}
			}
			
		},
		"tools":{
			"enabled": "Y",
			"admin":"Y",
			"superadmin":"N",
			"mesh_cnt_support":"Y",
			"mesh_ag_support":"Y",
			"independent_page":"Y",
			"display_mode": "common",
			"sub_page_support":"Y",
			"icon":"ic_manage_diagnosis",
			"href":"settings/management-tools-ping.html",
			"sub_page":{
				"ping":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-tools-ping.html"
				},
				"traceroute":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-tools-traceroute.html"
				},
				"nslookup":{
					"enabled":"Y",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-tools-nslookup.html"
				},
				"inform_ctrl":{
					"enabled":"N",
					"admin":"Y",
					"superadmin":"N",
					"mesh_cnt_support":"Y",
					"mesh_ag_support":"Y",
					"icon":"ic_status_wan",
					"href":"management-tools-inform_ctrl.html"
				}
			}
			
		}
	}
}

var page_loading_time={
	"mlo_enabled":{
		"wan":60,
		"lan":60,
		"lan6":90,
		"firewall":5,
		"common":60
	},
	"mlo_disabled":{
		"wan":25,
		"lan":20,
		"lan6":90,
		"firewall":5,
		"common":20
	}
}
