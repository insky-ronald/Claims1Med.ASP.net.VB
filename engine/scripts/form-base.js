// *************************************************************************************************
// File name: form-base.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
Class.Inherits(JBaseForm, JControl);
function JBaseForm(Params) {
	JBaseForm.prototype.parent.call(this, Params);
};

JBaseForm.prototype.classID = "JBaseForm";

JBaseForm.prototype.DefaultPainter = function() {
	return new BaseFormPainter(this); // BaseFormPainter: refer to form-base-painters.js
}

JBaseForm.prototype.Initialize = function(Params) {
    JBaseForm.prototype.parent.prototype.Initialize.call(this, Params);
	this.Events = {};
	this.id = Params.id;
	this.host = Params.host;
	this.url = Params.url;
	this.requestParams = Params.requestParams;
	this.container = Params.container;
	// console.log(this)
};
