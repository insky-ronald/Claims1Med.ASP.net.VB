// *************************************************************************************************
// Last modified on
// 06-JUL-2017
// *************************************************************************************************
//==================================================================================================
// File name: desktop-5.js
//==================================================================================================
//  Class.Inherits(Desktop, DesktopBase);
//==================================================================================================

//**************************************************************************************************
// Desktop()
//**************************************************************************************************
Class.Inherits(Desktop, DesktopBase);
function Desktop(params) {
    Desktop.prototype.parent.call(this, params);
};

Desktop.prototype.classID = "Desktop";
Desktop.prototype.painterClass = DesktopPainter

Desktop.prototype.initialize = function(params) {
	Desktop.prototype.parent.prototype.initialize.call(this, params);
}

/************************************************************************************************************************
	LoadModule
	* Loading of CSS and Scripts of sub pages
	* Called from DesktopPainter.prototype.loadSubPage
************************************************************************************************************************/
function LoadModule(menu) {
	this.menu = menu;
};

// desktop.loadingModule.load(MasterPolicyEdit);
LoadModule.prototype.load = function(callback) {
	this.menu.page = callback({
		id:this.menu.id, 
		host:desktop, 
		container:this.menu.subContainer, 
		url:this.menu.url,
		requestParams: this.menu.params
	});

	this.menu.loaded = true;
};
