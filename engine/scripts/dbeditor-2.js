// ****************************************************************************************************
// Last modified on
// 02-SEP-2017
// ****************************************************************************************************
// ****************************************************************************************************
// jEditor
// ****************************************************************************************************
Class.Inherits(jEditor, jControl);

function jEditor(params) {
    jEditor.prototype.parent.call(this, params);
};

jEditor.prototype.classID = "jEditor";
jEditor.prototype.painterClass = jEditorPainter;
jEditor.prototype.controlType = "editor2";

jEditor.prototype.initialize = function(params) {
    jEditor.prototype.parent.prototype.initialize.call(this, params);

	this.params = $.extend({}, {
		
	}, params);

	// this.events.OnPaintPane1 = new EventHandler(this);
	// this.events.OnPaintPane2 = new EventHandler(this);
};
