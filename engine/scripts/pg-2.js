// *************************************************************************************************
// File name: pg-2.js
// Last modified on
// 31-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jPageControl
//**************************************************************************************************
Class.Inherits(jPageControl, jControl);
function jPageControl(params) {
    jPageControl.prototype.parent.call(this, params);
	
};

jPageControl.prototype.classID = "jPageControl";
jPageControl.prototype.controlType = "pg";

jPageControl.prototype.painterClass = jPageControlPainter;

jPageControl.prototype.initialize = function(params) {
    jPageControl.prototype.parent.prototype.initialize.call(this, params);
	this.tabs = [];
	this.activeTab = undefined;
	this.paintParams.icon = $.extend({
								size: 24,
								position: "left"
							}, params.paintParams.icon);
							
	if(params.masterView) {
		var self = this;
		this.masterDetail = new jMasterDetailController({
								pg: this,
								view: params.masterView
							});
							
		params.masterView.events.OnAfterPaint.add(function(grid) {
			self.defaultTab.detail.update();
		});
	};
};

jPageControl.prototype.showTabs = function(visible) {
	this.painter.showTabs(visible);
};

jPageControl.prototype.addTab = function(params) {
	if (params.permission != undefined) {
		if (!params.permission.view) {
			return undefined;
		}
	};
	
	var tab = new jPageTab($.extend(params, {
		creator: this,
		id: defaultValue(params.id, this.tabs.length+1)
	});
	
	if(this.masterDetail) {
		this.masterDetail.add({
			tab: tab,
			createView: function(keyID) {
				return params.OnCreateMasterDetail(this, keyID);
			}
		});
	};
	
	this.tabs.push(tab);
	
	return tab;
};

jPageControl.prototype.afterPaint = function() {
	jPageControl.prototype.parent.prototype.afterPaint.call(this);
	// console.log(this.defaultTab)
	if(!this.defaultTab)
		this.defaultTab = this.tabs[0];
	
	this.defaultTab.show();
};

jPageControl.prototype.showScrollButtons = function(visible) {
	this.painter.showScrollButtons(visible);
};

//**************************************************************************************************
// jPageTab
//**************************************************************************************************
Class.Inherits(jPageTab, jControl);
function jPageTab(params) {
    jPageTab.prototype.parent.call(this, params);
};

jPageTab.prototype.classID = "jPageTab";
jPageTab.prototype.controlType = "pg-tab";
jPageTab.prototype.paintImediately = false;

jPageTab.prototype.painterClass = jPageTabPainter;

jPageTab.prototype.initialize = function(params) {
    jPageTab.prototype.parent.prototype.initialize.call(this, params);
	this.pg = params.creator;
	this.pg.defaultTab = params.defaultTab ? this : this.pg.defaultTab;
	this.params.icon = $.extend({}, this.pg.paintParams.icon, params.icon);
	this.active = false;
};

jPageTab.prototype.activate = function() {
	this.painter.activate();
};

// jPageTab.prototype.activate = function() {
	// this.painter.activate();
// };

jPageTab.prototype.show = function() {
	this.painter.show();
};

jPageTab.prototype.hide = function() {
	this.painter.hide();
};
