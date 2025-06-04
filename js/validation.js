
var SPACE_NO = 1;

function isdigit(I, M) {
	for (i = 0; i < I.value.length; i++) {
		ch = I.value.charAt(i);
		if (ch < '0' || ch > '9') {
			if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				alert(window.parent.L.error_message.lang_error_message_err28);
			else
				alert(L.error_message.lang_error_message_err28);
			I.value = I.defaultValue;
			return false;
		}
	}
	return true;
}

function isascii(I, M) {
	for(i=0 ; i<I.value.length; i++) {
		ch = I.value.charAt(i);
		if(ch < ' ' || ch > '~') {
			//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			//	alert(window.parent.L.error_message.lang_error_message_err29);
			//else
			//	alert(L.error_message.lang_error_message_err29);
			//I.value = I.defaultValue;
			return false;
		}
	}
	return true;
}

function valid_range(I, start, end, M) {
	M1 = unescape(M);
	isdigit(I, M1);
	d = parseInt(I.value, 10);
	if (!(d <= end && d >= start)) {
		//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
		//	alert(eval("window.parent.L.error_message.lang_error_message_err14") + '[' + start + ' - ' + end + '].'); //Maybe call from idp page
		//else
		alert(eval("L.error_message.lang_error34_msg") + '[' + start + ' - ' + end + '].');
		//window.onblur=document.getElementById(I.id).blur();
		//I.value = I.defaultValue;
		return false;
	} else{
		//I.value = d; // strip 0
		return true;
	}
}

function valid_range_st(I, start, end, M) {
        M1 = unescape(M);
        isdigit(I, M1);
        d = parseInt(I.value, 10);
        if (!(d <= end && d >= start)) {
                if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
                        alert(eval("window.parent.L.error_message."+M+"") + '[' + start + ' - ' + end + '].'); //Maybe call from idp page
                else
                        alert(eval("L.error_message."+M+"") + '[' + start + ' - ' + end + '].');
                window.onblur=document.getElementById(I.id).blur();
                I.value = I.defaultValue;
                return false;
        } else{
                I.value = d; // strip 0
                return true;
        }
}


function check_space(I, M1) {
	M = unescape(M1);
	for(i=0 ; i<I.value.length; i++) {
		ch = I.value.charAt(i);
		if(ch == ' '){
			//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			//	alert(window.parent.L.error_message.lang_error_message2_err10);
			//else
			//	alert(L.error_message.lang_error_message2_err10);
			//I.value = I.defaultValue;
			return false;
		}
	}
	return true;
}

function is_english_And_symbol(character){
	for(i=0;i<character.length;i++) {
		if(character.charCodeAt(i)  < 32 || character.charCodeAt(i)  > 126) {
			return false;
		}
	}
	return true;
}

function valid_space_begin_end(str){
        var checkBegin = /^\s/;
        var checkFinish = /\s$/;
        if( checkBegin.test(str) ){
                return false;
        }
        else if(checkFinish.test(str))
                return false;
        else{
                return true;
        }
}

function validation_ssid(ssid){
	var min = 1, max = 32, total_length = 0;
	var str_length = ssid.length;
	var total_length = 0;
        
	/*
		return 0 : pass
		return 1 : length empty
		return 2 : length over 32
		return 3 : ascii error
		return 4 : have space at begin or end
	*/
	
	if(str_length == 0)
		return 1
	else if( !valid_space_begin_end(ssid) )
		return 4
	else {
		/* validate input char type */
		for(var i=0; i < str_length; i ++){
			if (is_english_And_symbol(ssid[i])){
				/* english and symbol */
				total_length++;
				}else if(ssid[i].match(/^[\x00-\x7F]*$/) == null){
				/* control char */
				return 3;
			}
		}

		if((min > total_length) || (total_length > max)){
			return 2;
		}
		return 0;
	}
}

function validation_key(password){
	if((password.match(/^[a-fA-F0-9]{64}$/) !== null) || (password.match(/^.{8,63}$/) !== null)){
		return true;
	}else{
		return false;
	}
}

function valid_name(I, M, flag) {
	if (!isascii(I, M))
		return false;

	var bbb = I.value.replace(/^\s*/,"");
	var ccc = bbb.replace(/\s*$/,"");

	I.value = ccc;
	if(flag & SPACE_NO){
		if (!check_space(I,M)) {
			return false;
		}
	}

	return true;
}

function valid_name1(I, flag) {
	var bbb = I.value.replace(/^\s*/,"");
	var ccc = bbb.replace(/\s*$/,"");
	var ch , i ;

	if(flag & SPACE_NO){
		check_space(I,M);
	}

	var re = new RegExp("[^a-zA-Z0-9-_\\s]+","gi")
		if (( re.test(I.value))) {
			if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				alert(window.parent.L.error_message.lang_error_message_err14+" [A - Z , a - z , 0 - 9 , - , _ or space]");
			else
				alert(L.error_message.lang_error_message_err14+" [A - Z , a - z , 0 - 9 , - , _ or space]");
			I.value = I.defaultValue;
			return false;
		}
	I.value = ccc;
}

function valid_device_name(I) {
	if (I.value.length < 1) {
		alert(L.error_message.lang_hostname_blank_error_msg);
		//I.value = I.defaultValue;
		return false;
	}else if( I.value.length > 15 ){
		alert(L.error_message.lang_hostname_length_error_msg);
		//I.value = I.defaultValue;
		return false;	
	}

	var re = new RegExp("[^a-zA-Z0-9-]+","gi");
	if (re.test(I.value)) {
		alert(L.error_message.lang_hostname_format_error_msg);
		//I.value = I.defaultValue;
		return false;
	}
	
	re = new RegExp("^[0-9-]","gi");
	if (re.test(I.value)) {
		alert(L.error_message.lang_alert_dev_name_start_letter);
		//I.value = I.defaultValue;
		return false;
	}
	
	//ele_set_default(I,I.value);
	
	return true;
}

function valid_friendly_name(I) {
	if (I.value.length < 1) {
		alert(L.error_message.lang_friendlytname_blank_error_msg);
		//I.value = I.defaultValue;
		return false;
	}else if( I.value.length > 63 ){
		alert(L.error_message.lang_friendlytname_length_error_msg);
		//I.value = I.defaultValue;
		return false;	
	}

	var re = new RegExp("[^a-zA-Z0-9-\\\s]+","gi");
	if (re.test(I.value)) {
		alert(L.error_message.lang_friendlytname_format_error_msg);
		//I.value = I.defaultValue;
		return false;
	}
	/*
	re = new RegExp("^[0-9-]","gi");
	if (re.test(I.value)) {
		alert(L.error_message.lang_alert_dev_name_start_letter);
		I.value = I.defaultValue;
		return false;
	}

	ele_set_default(I,I.value);
	*/
	return true;
}

// valid 1 byte of mac address
function valid_mac(I,T) {
	var m1,m2=0;
	if(I.value.length == 1)
		I.value = "0" + I.value;

	m1 =parseInt(I.value.charAt(0), 16);
	m2 =parseInt(I.value.charAt(1), 16);

	if( isNaN(m1) || isNaN(m2) ) {
		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err15);
		else
			alert(L.error_message.lang_error_message_err15);
		I.value = I.defaultValue;
	}

	I.value = I.value.toUpperCase();
	if(T == 0) {
		if((m2 & 1) == 1){
			if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				alert(window.parent.L.error_message.lang_error_message_err16);
			else
				alert(L.error_message.lang_error_message_err16);
			I.value = I.defaultValue;
		}
	}
}

// valid all byte of mac address that mac address format is "000000000000"
function valid_mac_12(I) {
	var m,m3;

	if(I.value == "")
		return true;
	else if(I.value.length==12) {
		for(i=0;i<12;i++) {
			m=parseInt(I.value.charAt(i), 16);
			if( isNaN(m) )
				break;
		}
		if( i!=12 ){
			if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				alert(window.parent.L.error_message.lang_error_message_err17);
			else
				alert(L.error_message.lang_error_message_err17);
			I.value = I.defaultValue;
		}
	}
	else{
		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err5);
		else
			alert(L.error_message.lang_error_message_err5);
		I.value = I.defaultValue;
	}

	I.value = I.value.toUpperCase();
	if(I.value == "FFFFFFFFFFFF"){
		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err19);
		else
			alert(L.error_message.lang_error_message_err19);
		I.value = I.defaultValue;
	}

	if(check_multicast_mac(I.value)){
		I.value = I.defaultValue;
	}

	m3 = I.value.charAt(1);
	if((m3 & 1) == 1 || m3 == 'B' || m3 == 'D' || m3 == 'F'){ //modified by michael to deny the "B/D/F" char at 20080422
		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err16);
		else
			alert(L.error_message.lang_error_message_err16);
		I.value = I.defaultValue;
	}
}

function ignoreSpaces(string) {
	var temp = "";

	string = ''+string;
	splitstring = string.split(" ");
	for (var i=0; i < splitstring.length; ++i) temp += splitstring[i];
	return temp;
}

function trans16to2(data)
{
	var str = new Array("A","B","C","D","E","F");
	var num = new Array(10,11,12,13,14,15);
	var sd = new Array(0,0,0,0);
	var i,x,y;
	if(data < '0' || data > '9')
	{
		data = data.toUpperCase();
		for(i=0; i<str.length; i++)
		{
			if ( data.indexOf(str[i])!=-1 )
			{
				data = num[i];
				break;
			}
		}
	}
	for(i=3; i>=0; i--)
	{
		sd[i] = parseInt(data%2);
		data = parseInt(data/2);
	}
	return sd;
}

function check_multicast_mac(data) {
	var mac_arr = new Array("0000","0001","0000","0000","0101","1110");
	var nmac = new Array();
	var imac = new Array();
	var i,j,k=0,range="";

	if ( data.length == 17 )
	{
		nmac = data.split(":");
		for(i=0; i<6; i++)
		{
			for(j=0; j<2; j++)
			{
				imac[k] = trans16to2(nmac[i].charAt(j));
				k++;
			}
		}
	}
	else if ( data.length == 12 ) 
	{
		for(i=0; i<12; i++)
		{
			imac[k] = trans16to2(data.charAt(i));
			k++;
		}
	}
	else 
		return false;

	for(i=0; i<6; i++)
	{
		for(j=0; j<4; j++)
		{
			if ( mac_arr[i].charAt(j) != imac[i][j] ) return false ;
		}
	}
	for(i=6; i<8; i++)
	{
		for(j=0; j<4; j++)
		{
			range = range + imac[i][j] ;
		}
	}
	range = trans2to10(range);
	if ( range <= 127 )
	{
		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err75);
		else
			alert(L.error_message.lang_error_message_err75);
		return true ;
	}
	return false;
}

// valid all byte of mac address that mac address format is "00:00:00:00:00:00"
function valid_mac_17(I) {
	oldmac = I.value;
	var mac = ignoreSpaces(oldmac);

	if (mac == "") {
/*		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err17);
		else
			alert(L.error_message.lang_error_message_err17);
		I.value = I.defaultValue;
*/		return false;
	}

	var m = mac.split(":");
	if (m.length != 6) {
/*		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err21);
		else
			alert(L.error_message.lang_error_message_err21);
		I.value = I.defaultValue;
*/		return false;
	}

	var idx = oldmac.indexOf(':');
	if (idx != -1) {
		var pairs = oldmac.substring(0, oldmac.length).split(':');
		for (var i=0; i<pairs.length; i++) {
			nameVal = pairs[i];
			len = nameVal.length;
			if (len != 2) {
/*				if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
					alert(window.parent.L.error_message.lang_error_message_err17);
				else
					alert(L.error_message.lang_error_message_err17);
				I.value = I.defaultValue;		
*/				return false;
			}
			for(iln = 0; iln < len; iln++) {
				ch = nameVal.charAt(iln).toLowerCase();
				if (ch >= '0' && ch <= '9' || ch >= 'a' && ch <= 'f') {
				}
				else {
/*					if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
						alert (window.parent.L.error_message.lang_error_message_err23);
					else
						alert (L.error_message.lang_error_message_err23);
					I.value = I.defaultValue;		
*/					return false;
				}
			}	
		}
	}

	I.value = I.value.toUpperCase();
	if(I.value == "FF:FF:FF:FF:FF:FF"){
/*		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err19);
		else
			alert(L.error_message.lang_error_message_err19);
		I.value = I.defaultValue;
*/		return false;
	}

	if(check_multicast_mac(I.value)){
		I.value = I.defaultValue;	
	}

	m3 = I.value.charAt(1);
	if((m3 & 1) == 1 || m3 == 'B' || m3 == 'D' || m3 == 'F'){ //modified by michael to deny the "B/D/F" char at 20080422
/*		if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			alert(window.parent.L.error_message.lang_error_message_err16);
		else
			alert(L.error_message.lang_error_message_err16);
		I.value = I.defaultValue;
*/		return false;
	}
	return true;
}

function ValidateIPaddress(ipaddress) 
{
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
	{
		return true
	}
	return false
}

function valid_ipaddr_empty(name){
	var e = document.getElementsByName(name);
	var pass = true
	for(var i=0;i<e.length;i++)
	{
		if(e[i].value == ""){
			pass = false
			break;
		}
	}
	return pass
}

function valid_ipv6(I) {
	var regExp="^([0-9a-fA-F\:])";
	var ip6addr_tmp=I.value;
	var buff1=ip6addr_tmp.split(":");
	var buff2=ip6addr_tmp.split(/::/);

	for (i = 0; i < ip6addr_tmp.length; i++) {
		ch = ip6addr_tmp.charAt(i);
		if (ch.search(regExp) == -1) {
			//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			//	alert(window.parent.L.error_message.lang_error_message_err100);
			//else
			//	alert(L.error_message.lang_error_message_err100);
			return false;
		}
		if (i > 1) {
			if (ch==":" && ip6addr_tmp.charAt(i-1)==":" && ip6addr_tmp.charAt(i-2)==":") {
				//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				//	alert(window.parent.L.error_message.lang_error_message_err100);
				//else
				//	alert(L.error_message.lang_error_message_err100);
				return false;
			}
		}
	}

	for (i=0; i < buff1.length; i++) {
		if (buff1[i].length > 4) {
			//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			//	alert(window.parent.L.error_message.lang_error_message_err100);
			//else
			//	alert(L.error_message.lang_error_message_err100);
			return false;
		}
	}

	if (buff2.length == 1) {
		if (buff1.length != 8 || buff1[0] == "" || buff1[buff1.length-1] == "") {
			//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			//	alert(window.parent.L.error_message.lang_error_message_err100);
			//else
			//	alert(L.error_message.lang_error_message_err100);
			return false;
		}
	}
	else {
		if (ip6addr_tmp.charAt(0) == ":" && ip6addr_tmp.charAt(1) == ":") {
			if (buff1.length > 9) {
				//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				//	alert(window.parent.L.error_message.lang_error_message_err100);
				//else
				//	alert(L.error_message.lang_error_message_err100);
				return false;
			}
		}
		else if (ip6addr_tmp.charAt(ip6addr_tmp.length) == ":" && ip6addr_tmp.charAt(ip6addr_tmp.length-1) == ":") {
			if (buff1.length > 9){
				//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				//	alert(window.parent.L.error_message.lang_error_message_err100);
				//else
				//	alert(L.error_message.lang_error_message_err100);
				return false;
			}
		}
		else {
			if (buff1.length > 8){
				//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
				//	alert(window.parent.L.error_message.lang_error_message_err100);
				//else
				//	alert(L.error_message.lang_error_message_err100);
				return false;
			}
		}
	}

	if (buff2.length == 2) {
		if (buff2[0] == "" && buff2[1] == "") {
			//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			//	alert(window.parent.L.error_message.lang_error_message_err100);
			//else
			//	alert(L.error_message.lang_error_message_err100);
			return false;
		}
	}

	if (buff2.length > 2) {
		//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
		//	alert(window.parent.L.error_message.lang_error_message_err100);
		//else
		//	alert(L.error_message.lang_error_message_err100);
		return false;
	}

	if (buff1.length == 8 && buff1[0].match(/ffff/i) && buff1[1].match(/ffff/i) && 
				 buff1[2].match(/ffff/i) && buff1[3].match(/ffff/i) && 
				 buff1[4].match(/ffff/i) && buff1[5].match(/ffff/i) && 
				 buff1[6].match(/ffff/i) && buff1[7].match(/ffff/i))
	{
		//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
		//	alert(window.parent.L.error_message.lang_error_message_err100);
		//else
		//	alert(L.error_message.lang_error_message_err100);
		return false;
	}

	var illegal=0;
	for (i=0; i < buff1.length; i++){
		if (buff1[i] == 0 || buff1[i] == "")
			illegal=illegal+1;

		if (i == buff1.length-1 && illegal == buff1.length){
			//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
			//	alert(window.parent.L.error_message.lang_error_message_err100);
			//else
			//	alert(L.error_message.lang_error_message_err100);
			return false;
		} 
	}

	if (buff1[0].match(/fe80/i)) {
		//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
		//	alert(window.parent.L.error_message.lang_error_message_err100);
		//else
		//	alert(L.error_message.lang_error_message_err100);
		return false;
	}

	if (buff1[0].match(/^ff/i)) {
		//if('undefined' == typeof(L.error_message) && 'undefined' != typeof(window.parent.L) )
		//	alert(window.parent.L.error_message.lang_error_message_err100);
		//else
		//	alert(L.error_message.lang_error_message_err100);
		return false;
	}

	return true;
}

function validate_email(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function valid_url(url) {
	var reg = new RegExp("(www.)?" +
                             "[a-zA-Z0-9@:%._\\+~#?&//=]" +
                             "{2,256}\\.[a-z]" +
                             "{2,6}\\b([-a-zA-Z0-9@:%" +
                             "._\\+~#?&//=]*)")

	if (typeof(url) == "undefined")
		return false;

	return reg.test(url);
}

function valid_root_pwd(pw,imda_enabled) {
	if (!imda_enabled){
		var re = new RegExp("[^a-zA-Z0-9-!@]+","gi");
		if ("" == pw || re.test(pw)) {
			return false;
		}
	}
	return true;
}

function check_contain_space(value) {
	for(i=0 ; i<value.length; i++) {
		ch = value.charAt(i);
		if(ch == ' '){
			return false;
		}
	}
	return true;
}

