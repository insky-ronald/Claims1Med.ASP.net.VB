// *************************************************************************************************
// File name: pg.js
// Last modified on
// 09-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JPageControl
//**************************************************************************************************
Class.Inherits(JPageControl, JControl);
function JPageControl(Params) {
    JPageControl.prototype.parent.call(this, Params);
};

JPageControl.prototype.classID = "JPageControl";

JPageControl.prototype.DefaultPainter = function() {
    return new PageControlPainter(this);
};

// JPageControl.prototype.AfterPaint = function() {
	// JPageControl.prototype.parent.prototype.AfterPaint.call(this); 
	// alerts(this.Painter.header.outerHeight());
	// this.Painter.content.css("height", ("Calc(100% - {0}px)").format(this.Painter.header.outerHeight()));
// };

JPageControl.prototype.AfterPaint = function() {
    JPageControl.prototype.parent.prototype.AfterPaint.call(this);
	this.Select(0);
	this.Events.OnAfterPaint.trigger();
	// this.Painter.AfterPaint(); // It is important that the page control be create on AfterPaint event
};

JPageControl.prototype.Initialize = function(params) {
    JPageControl.prototype.parent.prototype.Initialize.call(this, params);
    this.id = params.id;
	this.owner = params.owner;
    this.container = params.container;
    this.css = params.css;
	this.list = new JList();
	this.tabCount = 0;
	this.initTab = params.initTab;
	this.Methods = new MethodHandler(this);
	this.Events = {};
	this.Events.OnInitPageControl = new EventHandler(this);
	this.Events.OnInitTabs = new EventHandler(this);
	this.Events.OnAfterPaint = new EventHandler(this);
	
	if(params.init) {
		// creator/owner of the page control must add an event to this.Events.OnInitPageControl in "init"
		params.init(this);
	};	

	this.Events.OnInitPageControl.trigger();
	this.Events.OnInitTabs.trigger();
	
	this.Paint();
	this.AfterPaint();  
	
	params.DelayPainting = true;
};

JPageControl.prototype.ShowTabs = function(visible) {
	this.Painter.header.css("display", visible ? "" : "none");
};

JPageControl.prototype.NewTab = function(caption, params) {
	params = defaultValue(params, {});
	params.pg = this;
	params.id = defaultValue(params.id, this.tabCount++);
	params.caption = caption;
	var tab = new JPageTab(params);
	this.list.add(params.id, tab);
	return tab;
};

JPageControl.prototype.Select = function(id) {
	var tab = this.list.get(id);
	this.Painter.Select(tab);
};	

JPageControl.prototype.EachTab = function(callback) {
	this.list.each(callback);
};

JPageControl.prototype.TabCount = function() {
	return this.list.count();
};

//**************************************************************************************************
// JPageTab
//**************************************************************************************************
function JPageTab(params) {
    if (params == undefined) {
        return;
    };

    // this.id = defaultValue(params.id, params.fname);
    this.Initialize(params);
};

JPageTab.prototype.classID = "JPageTab";

JPageTab.prototype.Initialize = function(params) {
    this.owner = this.pg = params.pg;
    this.id = params.id;
    this.caption = params.caption;
    this.OnSelect = params.OnSelect;
    this.OnCreate = params.OnCreate;
};

JPageTab.prototype.SetVisible = function(visible) {
	this.container.css("display", visible ? "" : "none");
};
