    page_tag='adv_setting-usp_agent'
    lang_tag='adv_setting_usp_agent'
    $(document).ready(function(){
        $.lang_load(lang_tag);
        page_initial()
    }); 

    function insert_agent_item(item, origin_id){
        if(typeof(origin_id) != "undefined"){
            AGENT_DATA[origin_id]=item
        }else{
            AGENT_DATA.push(item)
        }
        //agent_table_layout()
    }

    function get_obj_success_cb(obj) { 
        ORIGINAL_OBJ_DATA = API.obj.copy(obj); 
        MODIFIED_OBJ_DATA = API.obj.copy(ORIGINAL_OBJ_DATA); 

        AGENT_DATA=[];
        for(i=0;i<MODIFIED_OBJ_DATA.Tr369.Tr369T.length;i++){
            insert_agent_item(MODIFIED_OBJ_DATA.Tr369.Tr369T[i]);
        }
        agent_table_layout()
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
        
    function agent_table_layout(){
        var id = 0
        
        AGENT_DATA.forEach(function(element) {
            element.name = "Tr369T"+id;
            if (element.Enabled == "1")
                element.Enabled="Enabled"
            else
                element.Enabled="Disabled"

            element.TB_ACTION={"edit":"update_agent_item("+id+")"}
            id++
        });
        
        update_table('usp_agent_table', AGENT_DATA, USPAGENT_COLUMNS_LIST_VALUE)
    }

    function update_agent_item(item_id){
        action=[{"style":"default","text":"Cancel","action":"close_dialog()"},{"style":"primary","text":"Confirm","action":"save_agent_item('"+item_id+"')"}]
        if( 'new' == item_id)
            pop_dialog('usp-agent',action, 'agent_item_layout("new")')
        else
            pop_dialog('usp-agent',action, "agent_item_layout("+item_id+")")
    }

    function agent_item_layout(id){
        if( 'undefined' != typeof(id) && 'undefined' != typeof(AGENT_DATA[id]) ){
            if(AGENT_DATA[id].Enabled=="Enabled")
                switcher_handler('usp_enable',"1")
            else
                switcher_handler('usp_enable',"0")
                
            $("#connectio_name").val(AGENT_DATA[id].ConnectionName)
            $("#agent_endpoint_id").val(AGENT_DATA[id].AgentEndpointId)
            $("#controller_endpoint_id").val(AGENT_DATA[id].ControllerEndpointId)
            $("#controller_topic").val(AGENT_DATA[id].ControllerTopic)
            $("#controller_parameter_name").val(AGENT_DATA[id].ControllerParameterName)
            $("#controller_noti_interval").val(AGENT_DATA[id].ControllerNotiInterval)
            $("#response_topic").val(AGENT_DATA[id].MTPResponseTopicConfigured)
            $("#mqtt_broker_ip").val(AGENT_DATA[id].MQTTBrokerAddress)
            $("#mqtt_broker_port").val(AGENT_DATA[id].MQTTBrokerPort)
            $("#mqtt_broker_username").val(AGENT_DATA[id].MQTTBrokerUsername)
            $("#mqtt_broker_password").val(AGENT_DATA[id].MQTTBrokerPassword)
            $("#mqtt_broker_proto").val(AGENT_DATA[id].MQTTBrokerProtocol)
            $("#mqtt_broker_version").val(AGENT_DATA[id].MQTTBrokerVersion)
            
            if(AGENT_DATA[id].ControllerProtocol == "MQTT")
                $("#protocol_mode_mqtt").prop("checked", true);
        }else if( 'new' == id ){
            console.log('new')
        }		
    }

    function save_agent_item(id){
        var item={}
        
        item.Enabled=$("#usp_enable").val()
        item.AgentEndpointId=$("#agent_endpoint_id").val()
        item.ControllerEndpointId=$("#controller_endpoint_id").val()
        item.ControllerTopic=$("#controller_topic").val()
        item.ControllerParameterName=$("#controller_parameter_name").val()
        item.ControllerNotiInterval=$("#controller_noti_interval").val()
        item.MTPResponseTopicConfigured=$("#response_topic").val()
        item.MQTTBrokerAddress=$("#mqtt_broker_ip").val()
        item.MQTTBrokerPort=$("#mqtt_broker_port").val()
        item.MQTTBrokerUsername=$("#mqtt_broker_username").val()
        item.MQTTBrokerPassword=$("#mqtt_broker_password").val()
        item.MQTTBrokerProtocol=$("#mqtt_broker_proto").val()
        item.MQTTBrokerVersion=$("#mqtt_broker_version").val()
        item.ControllerProtocol="MQTT"
        item.ConnectionName= $("#connectio_name").val()
        
        if('new' != id){
            item.name = "Tr369T"+id;
            insert_agent_item(item, id)
        }
        else{
            runtime_id=AGENT_DATA.length
            item.name = "Tr369T"+runtime_id;
            insert_agent_item(item)
        }
        if(check()!=true)
            return false;
        else
            close_dialog()

        page_save()
    }

    function valid_USP_agent_format(){
        if(ValidateIPaddress($("#mqtt_broker_ip").val())!=true){
            warning_control('on','page',L.error_message.lang_error16_msg)
            return false
        }
        return true
    }

    function check(){
        if(valid_USP_agent_format()!=true){
        return false
        }
        return true
    }

    function set_obj_success_cb(obj) {
        if(obj.api_return != 0){
            set_obj_error_cb(obj)
            return;
        }
        //pop_alert_message(L.common.lang_success_msg,'success')
        setTimeout(function () {
            loading_control(0);
            page_initial()
        }, 10000);
        
    }
    function set_obj_error_cb(obj) {
        loading_control(0)
        if(obj.api_return == 403){
            logout('sto')
            return;
        }
    }
    function set_obj_data(obj_content){
        if(typeof(obj_content) == 'string')
            API.obj.set(JSON.parse(obj_content), set_obj_success_cb, set_obj_error_cb);
        else if(typeof(obj_content) == 'object')
            API.obj.set(obj_content, set_obj_success_cb, set_obj_error_cb);
    }
    function page_save(){

        loading_control(1)
        MODIFIED_OBJ_DATA.Tr369.Tr369T=AGENT_DATA
        set_obj_data(MODIFIED_OBJ_DATA)
    }