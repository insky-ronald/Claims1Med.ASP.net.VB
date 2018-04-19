// *************************************************************************************************
// File name: form-sub.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
Class.Inherits(SubPage, JBaseForm);
function SubPage(Params) {
	SubPage.prototype.parent.call(this, Params);
};

SubPage.prototype.classID = "SubPage";
SubPage.prototype.showHeader = false;
SubPage.prototype.showFooter = false;

// SubPage.prototype.DefaultPainter = function() {
	// return new SubFormPainter(this); // SubFormPainter: refer to form-base-painters.js
// }

SubPage.prototype.Initialize = function(Params) {
	SubPage.prototype.parent.prototype.Initialize.call(this, Params);
	// this.Events.OnInitToolbar = new EventHandler(this);
};

SubPage.prototype.Paint = function() {
	SubPage.prototype.parent.prototype.Paint.call(this);
	// if(this.showToolbar) {
		// this.Events.OnInitToolbar.trigger(this.toolbar = this.Painter.createToolbar());
	// };
};

SubPage.prototype.AfterPaint = function() {
	SubPage.prototype.parent.prototype.AfterPaint.call(this);
	// if(!this.showHeader) {
		// this.Painter.header.css("height", "100%").remove();
		// this.Painter.content.css("top", 0).css("height", "100%");
	// };
};
