// *************************************************************************************************
// File name: form-sub-db.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
Class.Inherits(SubPageData, SubPage);
function SubPageData(Params) {
	SubPageData.prototype.parent.call(this, Params);
};

SubPageData.prototype.classID = "SubPageData";
SubPageData.prototype.immediatePaint = true;
SubPageData.prototype.dataSource = "";
	
SubPageData.prototype.GetData = function(mode, callback, init) {	
	var params = {
		// src: this.dataSource
	};
	
	var parts = this.url.split("?");
	if(parts.length > 0 {
		var rp = parts[1];
		if(rp) {
			var p = rp.split("&");
			$(p).each(function(i, s) {
				var p = s.split("=");
				params[p[0]] = p[1];
			});
		};
	};
	
	if(init) init(params);
	
	// desktop.Ajax(this, "/api/getdata/" + mode, params, callback);
	// console.log(this.url);
	// console.log(("/get/{0}/{1}").format(mode, this.dataSource));
	desktop.Ajax(this, ("/get/{0}/{1}").format(mode, this.dataSource), params, callback);
};

SubPageData.prototype.Initialize = function(Params) {
	SubPageData.prototype.parent.prototype.Initialize.call(this, Params);
	this.GetData("info", function(result) {
		result.caller.InitializeData(result);
		if(result.caller.immediatePaint) {
			result.caller.Paint();
			result.caller.AfterPaint();  
		};
	});
	
	Params.DelayPainting = true;
};

SubPageData.prototype.InitializeData = function(data) {
	this.serverData = data; // holds the entire JSON from server
	this.rights = data.rights;
};
