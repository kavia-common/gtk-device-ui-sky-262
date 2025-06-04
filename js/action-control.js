//Action Control
/*
	input

*/

const ACTION_LIST = {
	"login":"_ac_login_cb"
}

function _ac_login_cb(data){

}

function AC_HANDLER(action, data){
	var ac_ret={}

	eval("target_action=ACTION_LIST."+action)

	if('undefined' != typeof(target_action)){
		eval("ac_ret="+target_action+"("+data+")")
	}else{
		ac_ret.result="fail"
		ac_ret.data=""
	}
	return ac_ret
}

function AC_LIB_LOADER(list){
	
}