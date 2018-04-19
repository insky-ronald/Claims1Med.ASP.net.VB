// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: clients.js
//==================================================================================================
function CreateSubPage(params){
	return new UnderConstruction(params)
};

Class.Inherits(UnderConstruction, SubPageData);
function UnderConstruction(Params) {
	UnderConstruction.prototype.parent.call(this, Params);
};

UnderConstruction.prototype.classID = "UnderConstruction";
UnderConstruction.prototype.showHeader = false;
UnderConstruction.prototype.showFooter = false;
UnderConstruction.prototype.dataSource = "under-construction";

UnderConstruction.prototype.Initialize = function(Params) {
	UnderConstruction.prototype.parent.prototype.Initialize.call(this, Params);
};

UnderConstruction.prototype.InitializeData = function(data) {
	UnderConstruction.prototype.parent.prototype.InitializeData.call(this, data);
	// alerts(this.serverData.module);
	// this.serverData = data; // holds the entire JSON from server
	// this.rights = data.rights;
};

UnderConstruction.prototype.CreateWidget = function(container, params) {
	var widget = CreateElement("div", container)
		.attr("x-sec", "widget")
		// .attr("x-sec", params.section);
		
	return widget;
};

UnderConstruction.prototype.Paint = function() {
	UnderConstruction.prototype.parent.prototype.Paint.call(this);
	
	this.Painter.content.addClass("under-construction");
	
	// var toolBar = CreateElement("div", this.Painter.content)
		// .attr("x-sec", "toolbar");
};

UnderConstruction.prototype.AfterPaint = function() {
	UnderConstruction.prototype.parent.prototype.AfterPaint.call(this);
	// alerts(this.serverData.module);
};
