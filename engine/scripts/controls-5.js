//==================================================================================================
// File name: controls-5.js
//==================================================================================================
// function jControl(params)
//==================================================================================================
//**************************************************************************************************
// jControl
//**************************************************************************************************
Class.Inherits(jControl, jObject)
function jControl(params) {
    jControl.prototype.parent.call(this, params)
}

jControl.prototype.classID = "jControl"
jControl.prototype.controlType = "?"
jControl.prototype.painterClass = jBasePainter
jControl.prototype.paintImediately = true

jControl.prototype.initialize = function(params) {
	jControl.prototype.parent.prototype.initialize.call(this, params);
	
	this.owner = params.owner
	this.paintParams = $.extend({}, this.paintParams, params.paintParams);
	this.parentContainer = params.container
	
	// if (!this.paintParams)
		// this.paintParams = {}
	
	this.paintParams.control = this
	this.paintParams.parentContainer = params.container
	
    if (this.paintParams && this.paintParams.painterClass) {
        this.painter = new this.paintParams.painterClass(this.paintParams)
    } else if (this.painterClass) {
        this.painter = new this.painterClass(this.paintParams)
    }
}

jControl.prototype.afterInitialize = function() {
	jControl.prototype.parent.prototype.afterInitialize.call(this);
	
	if(this.paintImediately) {
		if (this.params.delayPainting)
			// do something before painting, ie fetch data from server so they are available before painting...
			// BUT, DO NOT this.paint until data has completed fetching from server
			this.params.delayPainting(this) 
		else 
			this.paint()
	}
}

jControl.prototype.paint = function() {
    if (this.painter) {
		this.beforePaint()
		
        if (arguments.length > 0) {
            // this.painter.beginPainting.apply(null, Array.prototype.slice.call(arguments, 0));
        } else {
            this.painter.beginPainting();
        }
				
		this.afterPaint()
    }
}

jControl.prototype.beforePaint = function() {
}

jControl.prototype.afterPaint = function() {
}
