//==================================================================================================
// File name: utils.js
// 12-FEB-2015 ihms.1.0.0.6
//==================================================================================================
function alerts(s) {
    var ret = "";
    var c = arguments.length;
    for (var x = 0; x < c; x++) {
       if(ret == "") {
           ret = arguments[x]
       } else {
           ret = ret +"\n"+ arguments[x];
       };
    };

    alert(ret);
    return ret
};

if(typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function(s) {
        return $.inArray(s, this);
    };
};

if(typeof Array.prototype.pushUnique !== 'function') {
    Array.prototype.pushUnique = function(v, callback) {
		if(this.indexOf(v) == -1) {
			this.push(v);
			if(callback) callback(v);
		};
    };
};

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  };
};

String.prototype.splitInt= function(del) {
	var ArrayData = $.map(this.split(del), function(value){
	    return parseInt(value, 10);
	    // or return +value; which handles float values as well
	});
	
	return ArrayData;
};

String.prototype.format = function(s) {
    var str = this.toString();
    var c = arguments.length;
    for (var x = 0; x < c; x++) {
       str = str.replaceAll("{"+(x)+"}", arguments[x]);
//     str = str.replace("{"+(x)+"}", arguments[x]);
    };

    return str.replace(/ +(?= )/g,"").trim();
};

String.prototype.replaceAll = function(str1, str2, ignore)
{
   return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function(c){return "\\" + c;}), "g"+(ignore?"i":"")), str2);
};

String.prototype.replaceAt = function(index, character) {
      return this.substr(0, index) + character + this.substr(index+character.length);
}

Number.prototype.formatMoney = function(zeroPrefix) {
	var len = 32;
	var noLimit = false;
	var f;
	
	if(this == null) {
		return "";
	};

	if(zeroPrefix === undefined) {
		zeroPrefix = "0";		
		noLimit = true;
		f = parseFloat(this);
	} else {
		len = zeroPrefix.length;
		f = parseFloat(this).toFixed(len);
	};
	
	var parts = f.toString().split(".");
	if(noLimit)
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
	else
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + (parts[1] ? parts[1] : zeroPrefix);
};

Number.prototype.strZero = function(width) {
    var n = Math.abs(this);
    var zeros = Math.max(0, width - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( this < 0 ) {
        zeroString = '-' + zeroString;
    };

    return zeroString+n;
};

function DefaultValue(v, def) {
    if(v == null) {
        return def
    } else {
        return v;
    };
};

function defaultValue(v, def) {
	return v == undefined ? def : v;
};

function GetPathName() {
    var Paths = window.location.pathname.split("/");
    if(Paths[0] == "") {
        Paths.splice(0,1);
    };

    return "/"+Paths.join("/");
};

function GetRequestParams() {
  var searchString = window.location.search.substring(1)
    , params = searchString.split("&")
    , hash = {}
    ;

  for (var i = 0; i < params.length; i++) {
    var val = params[i].split("=");
    hash[unescape(val[0])] = unescape(val[1]);
  }
  return hash;
};

function GetUrlRequestParamsObject(url) {
	var requestParams2 = url.split("?");
	var requestParams = requestParams2.length > 1 ? requestParams2[1] : "";
	// var searchString = requestParams;
    var params = requestParams.split("&");
    var hash = {};

  for (var i = 0; i < params.length; i++) {
    var val = params[i].split("=");
    hash[unescape(val[0])] = unescape(val[1]);
  }
  
  return hash;
};

function RequestParamsToObject(requestParams) {
  var searchString = requestParams
    , params = searchString.split("&")
    , hash = {}
    ;

  for (var i = 0; i < params.length; i++) {
    var val = params[i].split("=");
    hash[unescape(val[0])] = unescape(val[1]);
  }
  return hash;
};

function ObjectToRequestParams(params) {
	var Params = [];
	for(var Name in params) {
			Params.push(Name +"="+ params[Name]);
	};

	return Params.join("&");
};

function HttpRequestParams(encode) {
    var aParams = [];
    var Encode = encode;

    this.Add = function(Name, Value, NoEncode) {
//      aParams[Name] = encodeURI(Value);
//      aParams[Name] = encodeURIComponent(Value);

        if(Encode) {
            aParams[Name] = encodeURIComponent(Value)
       } else {
            aParams[Name] = Value;
       };
    };

    this.QueryString = function(delimeter) {
        var Params = [];
        for(var Name in aParams) {
            Params.push(Name +"="+ aParams[Name]);
        };

        return Params.join(delimeter ? delimeter : "&");
//        return Params.join(If(delimeter, delimeter, "&"));
    };
};

function CreateElement(type, parent, id, css) {
    var isPassword = type.toLowerCase() == "password";
    if(isPassword) {
        type = "input";
    };

    var element = $("<" + type + ">");
    if(type.toLowerCase() == "iframe") {
        element.attr("frameBorder", 0)
    };
    if(isPassword) {
        $(element)[0].setAttribute("type", "password");
    };
    if(parent) { $(parent).append(element) };
    if(id) { element.attr("id", id) };
    if(css) { element.addClass(css) };

    return element;
};

function CreateElementEx(type, parent, callback, css) {
    var e = CreateElement(type, parent)
	if(css) e.addClass(css);
	if(callback) callback(e);
	
    return e;
};

function GetSvg(e, svg, size, base) {
	desktop.GetSvg(svg, {
		base: base,
		init: function(params) {
			params.size = size;
		},
		result: function(data) {
			e.html(data)
		}
	});
}
;
function supportStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}