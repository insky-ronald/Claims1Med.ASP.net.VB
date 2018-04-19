//**************************************************************************************************
// File name: base-painter-5.js
// jBasePainter
// Last modified on
// 06-JUL-2017
//**************************************************************************************************
Class.Inherits(jBasePainter, jObject)
function jBasePainter(params) {
    jBasePainter.prototype.parent.call(this, params)
}

jBasePainter.prototype.classID = "jBasePainter"

jBasePainter.prototype.initialize = function(params) {
	jBasePainter.prototype.parent.prototype.initialize.call(this, params)
	this.control = params.control
	this.parentContainer = params.parentContainer
}	

jBasePainter.prototype.beginPainting = function() {
	this.paint()
	this.afterPaint()
	
	if (this.params.afterPaint) {
		this.params.afterPaint(this, this.control)
	}
}

jBasePainter.prototype.paint = function(container) {
}

jBasePainter.prototype.afterPaint = function() {
}

jBasePainter.prototype.creaMainContainer = function(container, cssClass, theme) {

	if(!container)
		container = this.control.parentContainer
	
	var mainContainer = CreateElement("div", container, "", cssClass)
		.attr("control-type", this.control.controlType)
	
	if(this.control.paintParams.css)
		mainContainer.addClass(this.control.paintParams.css)
	
	mainContainer.attr("theme", defaultValue(theme, "default"))
	
	return mainContainer
}
