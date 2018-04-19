//*****************************************************************************************************
// Last modified on*/
// ihms.1.0.0.3 */
//*****************************************************************************************************
function JDrag(Node, Target, Params) {
	var self = this;
	this.Node = Node;
	this.Target = Target;
	this.Params = Params;

	// this.SizeMode = DefaultValue(Params.SizeMode, "default");
	this.SizeMode = "default";

	var Ready = false;
	this.DragCallback;

	this.Node.Ready = false; // Add a custom properties to node to track movement events...
	this.Node.Moving = false; // Add a custom properties to node to track movement events...
    this.Node.Sizing = false; // Add a custom properties to node to track movement events...

	this.Node.data("drag", this);

	this.Node.on({
        mousemove: this.UpdateCursor,
        mousedown: this.InitBegin,
        mouseout: function(e) {
        	$("body").css("cursor", "default");
        }
    });
	
	if(Params.Init) Params.Init(this);
};

JDrag.prototype.InitBegin = function(e) {
	var self = $(e.target).data("drag");
	if(!self) return;

	self.Node.Ready = false;
	self.Node.Moving = false;
	self.Node.Sizing = false;

	self.Params.InitDrag(self, false);

	if(self.SizeMode == "move") {
        if(!self.Params.AllowDrag(self)) {
        	return;
        };
    } else if(self.SizeMode != "default") {
        if(!self.Params.AllowSize(self)) {
        	return;
        };
    };

	self.Node.Ready = (self.SizeMode == "move" || self.SizeMode != "default");

//	if(!self.Node.Ready || e.target.NoDrag || $(e.target) !== $(self.Node)) {
//	if(!self.Node.Ready || e.target.NoDrag || $(e.target) != self.Node) {
	if(!self.Node.Ready || e.target.NoDrag) {
		return;
	};

	e.preventDefault();

    var xy1 = self.Target.offset();
    var xy2 = self.Target.parent().offset();

    self.Target.OffsetW = self.Target.width(); // Add a custom properties to node to track movement events...
    self.Target.OffsetH = self.Target.height(); // Add a custom properties to node to track movement events...
    self.Target.OffsetX = e.pageX - xy1.left + xy2.left;
    self.Target.OffsetY = e.pageY - xy1.top + xy2.top;// - $("#header-container").height() - 9;

    self.Target.Width = self.Target.width(); // Add a custom properties to node to track movement events...
    self.Target.Height = self.Target.height(); // Add a custom properties to node to track movement events...
    self.Target.Left = xy1.left - xy2.left;
    self.Target.Top = xy1.top - xy2.top;
    self.Target.X = e.pageX;
    self.Target.Y = e.pageY;

	if(self.SizeMode == "move")
        self.DragCallback = self.DragNode
	else
        self.DragCallback = self.SizeNode;

	self.Node.off({
        mousemove: self.UpdateCursor,
        mouseout: self.CursorOut
    });

	$("body").on({
        mousemove: self.DragCallback,
        mouseup: self.DragEnd
    });

    $("body").data("drag", self);
};

JDrag.prototype.CursorOut = function(e) {
	$("body").css("cursor", 'default');
};

JDrag.prototype.DragEnd = function(e) {
	var self = $("body").data("drag");

	$("body").off({
        mousemove: self.DragCallback,
        mouseup: self.DragEnd
    });

	if(self.Params.DragEnd) {
    	self.Params.DragEnd(self);
	};

	self.Node.Moving = false;
	self.Node.Sizing = false;

	self.Node.on({
        mousemove: self.UpdateCursor,
        mouseout: self.CursorOut
    });
};

JDrag.prototype.DragNode = function(e) {
	var self = $("body").data("drag");

	e.preventDefault();

	if(!self.Node.Moving) {
    	self.Node.Moving = true;
    	self.Params.InitDrag(self, true);
	};

	var PageX = e.pageX;
	var PageY = e.pageY;
	var X = PageX - self.Target.X;
	var Y = PageY - self.Target.Y;

    var Top = self.Target.Top + Y;
    var Left = self.Target.Left + X;

	if(self.Params.Dragging) {
    	self.Params.Dragging(self, Left, Top, null, null);
	} else {
        self.Target.css("top", Top);
        self.Target.css("left", Left);
	};

	$("body").css("cursor", self.SizeMode);
//	$(self.Target).text(("pageY:{0},pageX:{1};Y:{2},X:{3}").format(PageY,PageX,Y,X));
};

JDrag.prototype.SizeNode = function(e) {
	var self = $("body").data("drag");

	e.preventDefault();

	if(!self.Node.Moving) {
    	self.Node.Moving = true;
    	self.Params.InitDrag(self, true);
	};

	var PageX = e.pageX;
	var PageY = e.pageY;
	var X = PageX - self.Target.X;
	var Y = PageY - self.Target.Y;

    var Top = null;
    var Left = null;
	var Width = null;
	var Height = null;

	if(self.SizeMode == "n-resize" || self.SizeMode == "ne-resize" || self.SizeMode == "nw-resize") {
		Top = self.Target.Top + Y;
		Height = self.Target.Height - Y;
	};

	if(self.SizeMode == "w-resize" || self.SizeMode == "sw-resize" || self.SizeMode == "nw-resize") {
		Left = self.Target.Left + X;
		Width = self.Target.Width - X;
	};

	if(self.SizeMode == "e-resize" || self.SizeMode == "se-resize" || self.SizeMode == "ne-resize") {
		Width = self.Target.Width + X;
	};

	if(self.SizeMode == "s-resize" || self.SizeMode == "se-resize" || self.SizeMode == "sw-resize") {
		Height = self.Target.Height + Y;
	};

	if(self.Params.Dragging) {
    	self.Params.Dragging(self, Left, Top, Width, Height);
	} else {
        self.Target.css("top", Top);
        self.Target.css("left", Left);
	};

	$("body").css("cursor", self.SizeMode);
//	$(self.Target).text(("pageY:{0},pageX:{1};Y:{2},X:{3}").format(PageY,PageX,Y,X));
};

JDrag.prototype.UpdateCursor = function(event) {
	var target = $(event.target);
	var self = target.data("drag");
	if(!self) return;

    var offset = self.Params.SizeOffset;
    var xy = target.offset();
    var x = event.pageX - xy.left + 1;
    var y = event.pageY - xy.top + 1;
    var w = target.width();
    var h = target.height();

	self.SizeMode = "default";

	if(self.Params.Moving) {
        self.SizeMode = 'move';
        if(!self.Params.AllowDrag(self)) {
        	return;
        };
	} else {
        self.SizeMode = 'default';
	};

    // if(!self.Params.Moving && !self.Params.AllowSize(self)) {
    	// return;
    // };

	event.preventDefault();

    // var xcursor = self.SizeMode;
    // var ycursor = self.SizeMode;

    // if(x <= offset)
        // xcursor = "w-resize"
    // else if(x >= w-offset)
        // xcursor = "e-resize";

    // if(y <= offset)
        // ycursor = "n-resize"
    // else if(y >= h-offset)
        // ycursor = "s-resize";

    // if(ycursor == 'n-resize' && xcursor =='e-resize')
        // self.SizeMode = 'ne-resize'
    // else if(ycursor == 'n-resize' && xcursor =='w-resize')
        // self.SizeMode = 'nw-resize'
    // else if(ycursor == 's-resize' && xcursor =='e-resize')
        // self.SizeMode = 'se-resize'
    // else if(ycursor == 's-resize' && xcursor =='w-resize')
        // self.SizeMode = 'sw-resize'
    // else if(xcursor != self.SizeMode)
        // self.SizeMode = xcursor
    // else
        // self.SizeMode = ycursor;

	$("body").css("cursor", self.SizeMode);
};

//*****************************************************************************************************
// Last modified on*/
// ihms.1.0.0.3 */
//*****************************************************************************************************
function JSimpleDrag(Params) {
	this.Params = Params;
	this.Owner = Params.Owner;
	this.Node = Params.Node;
	this.Target = Params.Target;

	this.Node.data("drag", this);

	this.Node.on({
        mousedown: this.InitBegin
    });
	
	if(Params.Init) Params.Init(this);
};

JSimpleDrag.prototype.InitBegin = function(e) {
	var self = $(e.target).data("drag");
	if(!self) return;

	self.Params.InitDrag(self);

	e.preventDefault();

    self.pageX = e.pageX;
    self.pageY = e.pageY;

	$("body").on({
        mousemove: self.DragNode,
        mouseup: self.DragEnd
    });

    $("body").data("drag", self);
};

JSimpleDrag.prototype.DragEnd = function(e) {
	var self = $("body").data("drag");

	$("body").off({
        mousemove: self.DragNode,
        mouseup: self.DragEnd
    });

	if(self.Params.DragEnd) {
    	self.Params.DragEnd(self);
	};
};

JSimpleDrag.prototype.DragNode = function(e) {
	var self = $("body").data("drag");

	e.preventDefault();

   	self.Params.Dragging(self, e.pageX - self.pageX, e.pageY - self.pageY);
};

//*****************************************************************************************************
// Last modified on*/
// ihms.1.0.0.3 */
//*****************************************************************************************************
function jResize(params) {
	this.params = params;
	this.owner = params.owner;
	this.sizer = params.sizer;
	this.target = params.target;
	this.target2 = params.target2;
	this.parent = params.parent;
	this.orientation = params.orientation;

	this.sizer.data("drag", this);

	this.sizer.on({
        mousedown: this.initBegin
    });
	
	if(params.init) params.init(this);
};

jResize.prototype.initBegin = function(e) {
	var self = $(e.target).data("drag");
	if(!self) return;

	self.params.initDrag(self);

	e.preventDefault();

    self.pageX = e.pageX;
    self.pageY = e.pageY;

	$("body").on({
        mousemove: self.dragNode,
        mouseup: self.dragEnd
    });

    $("body").data("drag", self);
};

jResize.prototype.dragEnd = function(e) {
	var self = $("body").data("drag");

	$("body").off({
        mousemove: self.dragNode,
        mouseup: self.dragEnd
    });

	if(self.params.dragEnd) {
    	self.params.dragEnd(self);
	};
};

jResize.prototype.dragNode = function(e) {
	var self = $("body").data("drag");

	e.preventDefault();

   	self.params.dragging(self, e.pageX - self.pageX, e.pageY - self.pageY);
};
