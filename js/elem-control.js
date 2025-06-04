
function password_display_control(target){
	target_elem_id=target.getAttribute("for")

	var x = document.getElementById(target_elem_id);
	if (x.type === "password") {
		$(target).addClass('hidepw');
		$(target).removeClass('showpw');
		x.type = "text";
	} else {
		$(target).addClass('showpw');
		$(target).removeClass('hidepw');
		x.type = "password";
	}
}

function set_switch_value(id, onoff){
	$("#"+id).val(onoff)
}

function switcher_handler(ele_id, ele_val, cb){
	if ( 'undefined' != typeof(ele_val) && "" != ele_val ){
		set_switch_value(ele_id, ele_val)
	}else{
		var original_ele_val = $("#"+ele_id).val()
	
		if( "1" == original_ele_val ){
			set_switch_value(ele_id, "0")
			ele_val="0"
		}
		else{
			set_switch_value(ele_id, "1")
			ele_val="1"
		}
	}

	if( "1" == ele_val )
		$("#switch_layout_"+ele_id).addClass('checked')
	else
		$("#switch_layout_"+ele_id).removeClass('checked')
	
	if ( 'undefined' != typeof(cb) && cb != "" )
		eval(cb)
}