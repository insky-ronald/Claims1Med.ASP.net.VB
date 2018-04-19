//==================================================================================================
// File name: controls-2.js
//==================================================================================================
// function jBaseControl(params)
//==================================================================================================
//**************************************************************************************************
// jBaseControl
//**************************************************************************************************
function jBaseControl(params) {
    if (params == undefined) {
		this.classID2 = this.toString();
        return;
    };

	this.events = {};
	this.id = params.id;
	this.container = params.container;
	
	this.initialize(params);
	
	this.beforePaint();
	if(this.delayPainting)
		this.delayPainting(function(me) {
			me.paint();
			me.afterPaint();
		})
	else {
		this.paint();
		this.afterPaint();
	};
	
	// if(!this.delatePainting) {
		// this.paint();
	// };
	// this.events.onInit = new EventHandler(this);	
	// alerts(this.classID);
};

jBaseControl.prototype.classID = "jBaseControl";
// jBaseControl.prototype.delatePainting = false;

jBaseControl.prototype.initialize = function(params) {
	// alerts(this.classID)
};

jBaseControl.prototype.paint = function() {
};

jBaseControl.prototype.beforePaint = function() {
};

jBaseControl.prototype.afterPaint = function() {
};

//**************************************************************************************************
// jControl
//**************************************************************************************************
Class.Inherits(jControl, jBaseControl);
function jControl(params) {
	jControl.prototype.parent.call(this, params);
};

jControl.prototype.classID = "jControl";
