// *************************************************************************************************
// File name: dialogs-painters-2.js
// Last modified on
// 29-JUL-2017
// *************************************************************************************************
Class.Inherits(jDialogBasePainter, jBasePainter);
function jDialogBasePainter(params) {
	jDialogBasePainter.prototype.parent.call(this, params);
};

jDialogBasePainter.prototype.classID = "jDialogBasePainter";

jDialogBasePainter.prototype.initialize = function(params) {
    jDialogBasePainter.prototype.parent.prototype.initialize.call(this, params);
};

jDialogBasePainter.prototype.paint = function(container) {
	jDialogBasePainter.prototype.parent.prototype.paint.call(this, container);
		
	var self = this;
	this.mainContainer = this.creaMainContainer(container, "dialog2", this.control.paintParams.theme);
	
	this.mainContainer.css({
		width: this.control.options.width,
		height: this.control.options.height
	});
	
	this.mainContainer.attr("dlg-align", this.control.options.align);
	
	this.control.events.OnPaintContainer.trigger(this.mainContainer);
	
	if(this.control.options.align === "center") {
		this.mainContainer.parent().css("display", "flex");
	} else if(this.control.options.align === "float") {
		// this.mainContainer.parent().css("position", "relative");
		this.mainContainer.css({
			"z-index": desktop.zIndex++,
			"top": this.control.options.top,
			"left": this.control.options.left
		});
	}
};
