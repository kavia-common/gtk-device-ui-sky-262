page_tag='adv_setting-ssh'
$(document).ready(function(){
        $.lang_load("adv_setting_ssh");
        page_initial();
});

function set_ui_init(obj) {
        $('#ssh_enabled').val(obj.Enable);
        switcher_handler('ssh_enabled', obj.Enable, ssh_enabled_switched(false));
}


function ssh_enabled_switched(is_save) {
        var ssh_enabled = $('#ssh_enabled').val();

        if (ssh_enabled == '1') {
                $('button[id^="btn_"]').removeAttr("disabled");
                $('button[id^="btn_"]').removeClass("is-disabled");
        }
        else {
                $('button[id^="btn_"]').attr("disabled",true);
                $('button[id^="btn_"]').addClass("is-disabled");
        }

}

function applied() {
        page_save();
}

function page_save() {
        MODIFIED_OBJ_DATA.Ssh.SshP.Enable = $('#ssh_enabled').val();
        if($('#ssh_enabled').val()=="1")
                alert(L.adv_setting_ssh.lang_ssh_help_msg)

        loading_control(1);
        set_obj_data(MODIFIED_OBJ_DATA);
}

function set_obj_success_cb(obj) {
        setTimeout(function () {
                loading_control(0);
        },SAVE_SSH_WAITING_TIME);
}
function set_obj_error_cb(obj) {
        loading_control(0);

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

 function get_obj_success_cb(obj) { 
        ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
        MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA);

        set_ui_init(MODIFIED_OBJ_DATA.Ssh.SshP);
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
        get_obj_data(OBJ_LIST);
} 
