// ****************************************************************************************************
// Last modified on
// 04-JUL-2017
// ****************************************************************************************************
// ****************************************************************************************************
// jSplitContainer
// ****************************************************************************************************
Class.Inherits(jSplitContainer, jControl);

function jSplitContainer(params) {
    jSplitContainer.prototype.parent.call(this, params);
};

jSplitContainer.prototype.classID = "jSplitContainer";
jSplitContainer.prototype.painterClass = jSplitterPainter;
jSplitContainer.prototype.controlType = "split-container";

jSplitContainer.prototype.initialize = function(params) {
    jSplitContainer.prototype.parent.prototype.initialize.call(this, params);

	this.params = $.extend({}, {
		size: 250,
		fixed: true,
		noBorder: true,
		orientation: "vert"
	}, params);

	this.events.OnPaintPane1 = new EventHandler(this);
	this.events.OnPaintPane2 = new EventHandler(this);
};
