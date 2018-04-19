// *************************************************************************************************
// File name: dbgrid-column-painters-2.js
// Last modified on
// 15-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGridDataPainter
//**************************************************************************************************
Class.Inherits(jGridDataPainter, jBasePainter);
function jGridDataPainter(params) {
	jGridDataPainter.prototype.parent.call(this, params);
};

jGridDataPainter.prototype.type = "grid";
jGridDataPainter.prototype.classID = "jGridDataPainter";

jGridDataPainter.prototype.initialize = function(params) {
    jGridDataPainter.prototype.parent.prototype.initialize.call(this, params);
};

jGridDataPainter.prototype.paint = function() {
    jGridDataPainter.prototype.parent.prototype.paint.call(this);
	// this.debug("paint")
};
