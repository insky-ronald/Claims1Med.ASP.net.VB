// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: demo1.js
//==================================================================================================
function CreateSubPage(params){
	return new Demo(params)
};

Class.Inherits(Demo, jControl);
function Demo(params) {
	Demo.prototype.parent.call(this, params);
};

Demo.prototype.classID = "Demo";

Demo.prototype.initialize = function(params) {
	Demo.prototype.parent.prototype.initialize.call(this, params);
	
	var self = this;
	this.delayPainting = function(resumePaint) {
		desktop.Ajax(self, ("/get/{0}/{1}").format("info", "demo1"), {}, function(result) {
			resumePaint(self);
		});		
	};
};

Demo.prototype.paint = function() {
	Demo.prototype.parent.prototype.initialize.call(this);
	
	var container = CreateElement("div", this.container);
};
