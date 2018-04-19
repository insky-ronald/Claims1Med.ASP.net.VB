// *************************************************************************************************
// File name: dialogs-2.js
// Last modified on
// 29-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jDialog
//**************************************************************************************************
Class.Inherits(jDialog, jControl);
function jDialog(params) {
    jDialog.prototype.parent.call(this, params);
};

jDialog.prototype.classID = "jDialog";
jDialog.prototype.controlType = "dlg";
jDialog.prototype.painterClass = jDialogBasePainter

jDialog.prototype.initialize = function(params) {
    jDialog.prototype.parent.prototype.initialize.call(this, params);
	
	this.options = $.extend({}, params.options);
	
    this.options.top = defaultValue(this.options.top, 0);
    this.options.left = defaultValue(this.options.left, 0);
    this.options.width = defaultValue(this.options.width, "auto");
    this.options.height = defaultValue(this.options.height, "auto");
    this.options.align = defaultValue(this.options.align, "center");
    this.options.modal = defaultValue(this.options.modal, false);

	this.events.OnPaintContainer = new EventHandler(this)
	// this.close_on_espace = defaultValue(params.CloseOnEsc, true);
	// this.onClose = params.onClose;
	
	
};

jDialog.prototype.hide = function() {
    // this.Painter.Hide();
	// if(this.onClose) this.onClose(this);
};
