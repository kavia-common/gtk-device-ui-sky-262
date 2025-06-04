/**
 * Mutilple Language v0.0.1
 *
 *	Function list:
 *		$.lang_load(page_name, [lib_path])
 *			page_name		Name of page & lang lib
 *			lib_path		Path of lang library
 *
 *		$.lang_get(page_name, wording_key)
 *			page_name		Name of page & lang lib
 *			wording_key		wording's key name in the language json file
 */

/* Grobal Language parameter */
var LANG = get_browser_lang();
if(localStorage.lang=="en" || localStorage.lang=="th")
	LANG = localStorage.lang
else
	localStorage.lang = LANG


var LANG_LIB_PATH = "/lang/";
var L = new Object();
var UI_VERSION = "";

/* Get the language set */
function load_lang_lib(page, lang, path, target_obj) {
	var obj_lang = new Object();
	var async = false;
	var cache = false;
	var url = "";
	var version = "";

    this._get_ui_version = function() {
        var obj;
        if (UI_VERSION !== "") {
            return UI_VERSION;
        }
        obj = document.getElementById("UI_VERSION");
        if (null == obj) {
            return UI_VERSION;
        } else {
            var src = document.getElementById("UI_VERSION").src;
            var name = src.split('/').pop();
            var qstr = name.split('?').pop();
            var version = qstr.split('=').pop();
            UI_VERSION = version;
            return version;
        }
    };

	//switch ajax async config to support setting browser with apple product
	if("iPhone"==navigator.platform || "iPad"==navigator.platform){
		async=true;
	}

    version = this._get_ui_version();

    if (version == "") {
        url = path + lang + "/" + page + ".json";
    } else {
        cache = true;
        url = path + lang + "/" + page + ".json?v=" + version;
    }

	$.ajax({
		type: "GET",
		contentType: "application/json",
		dataType: 'json',
		url: url,
		cache: cache,
		timeout: 10000,
		async: async,
		beforeSend: onSend,
		success: onSuccess,
		complete: onComplete,
		error: onError
	});
	function onSend(){};
	function onError(){};
	function onComplete(){
	};
	function onSuccess(config){
		jQuery.extend(L, obj_lang = config );
		autoAdapt_i18n(L, 'common');
		autoAdapt_i18n(L, 'error_message');
		autoAdapt_i18n(L, page);
		if('undefined' != typeof(target_obj))
			autoAdapt_obj_i18n(L, page, target_obj);
	};
	return obj_lang;
};

/* Ensure language code is in the format aa-AA. */
function normaliseLang(lang) {
	lang = lang.replace(/_/, '-').toLowerCase();
	if (lang.length > 3) {
		lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
	}
	return lang;
}

/* autoAdapt the multi language with specific class */
function autoAdapt_i18n(obj, page){
	$("a.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	$("title.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+".title"));
		}catch(e){};
	});

	$("meta.multi_lang").each(function(){
		try{
			$(this).attr("content", eval("obj."+page+".meta"));
		}catch(e){};
	});

	$("input.multi_lang").each(function(){
		try{
			$(this).val(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	$("input.multi_placeholder").each(function(){
		try{
			$(this).attr("placeholder", eval("obj."+page+"."+this.id+"_placeholder"));
		}catch(e){};
	});

	$("span.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	$("select option.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	$("div.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	$("p.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	$("button.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});
}

function autoAdapt_obj_i18n(obj, page, target_obj){
	target_obj.find("a.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	target_obj.find("title.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+".title"));
		}catch(e){};
	});

	target_obj.find("meta.multi_lang").each(function(){
		try{
			$(this).attr("content", eval("obj."+page+".meta"));
		}catch(e){};
	});

	target_obj.find("input.multi_lang").each(function(){
		try{
			$(this).val(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	target_obj.find("input.multi_placeholder").each(function(){
		try{
			$(this).attr("placeholder", eval("obj."+page+"."+this.id+"_placeholder"));
		}catch(e){};
	});

	target_obj.find("span.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	target_obj.find("select option.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	target_obj.find("div.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	target_obj.find("p.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});

	target_obj.find("button.multi_lang").each(function(){
		try{
			$(this).html(eval("obj."+page+"."+this.id));
		}catch(e){};
	});
}

/* Auto Load 'common' wording lang set */
var common_obj = load_lang_lib("common", LANG, LANG_LIB_PATH);

/* Auto Load 'error_message' wording lang set */
var error_message_obj = load_lang_lib("error_message", LANG, LANG_LIB_PATH);

(function($) {
	/* Load the specific Language library by different LANG */
	$.lang_load = function(page_name, lib_path){
		var path = (typeof(lib_path) == 'undefined') ? LANG_LIB_PATH : lib_path;
		var tmp_obj = load_lang_lib(page_name, LANG, path);

	};

	$.lang_insert = function(target_obj, page_name, lib_path, lang_obj){
		var path = (typeof(lib_path) == 'undefined' || lib_path== "" ) ? LANG_LIB_PATH : lib_path;
		if( typeof(lang_obj) != 'undefined' && lang_obj != "")
			autoAdapt_obj_i18n(lang_obj, page_name, target_obj)
		else
			var tmp_obj = load_lang_lib(page_name, LANG, path, target_obj);

	};

	/* Retrieve the default language set for the browser. */
	$.lang_load.defaultLanguage = normaliseLang(navigator.language /* Mozilla */ ||
		navigator.userLanguage /* IE */);

})(jQuery);
