// ****************************************************************************************************
// Last modified on
// 04-JUL-2017
// ****************************************************************************************************
// ****************************************************************************************************
// JSplitter
// ****************************************************************************************************
Class.Inherits(JSplitter, JControl);

function JSplitter(Params) {
    JSplitter.prototype.parent.call(this, Params);
};

JSplitter.prototype.classID = "JSplitter";

JSplitter.prototype.Initialize = function(Params) {
    JSplitter.prototype.parent.prototype.Initialize.call(this, Params);

	this.Events = {};
	this.Events.OnPaintTarget = new EventHandler(this);
	this.Events.OnPaintTarget2 = new EventHandler(this);
	
	this.onresize = Params.onresize
	
	if(Params.init) Params.init(this);
};

JSplitter.prototype.AfterPaint = function() {
    JSplitter.prototype.parent.prototype.AfterPaint.call(this);	
	this.Events.OnPaintTarget.trigger(this.Painter.target);
	this.Events.OnPaintTarget2.trigger(this.Painter.target2);
};

JSplitter.prototype.DefaultPainter = function() {
    return new JSplitterPainter(this);
};
