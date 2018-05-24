//==================================================================================================
// File name: controls.js
//==================================================================================================
// function JControl(Params)
//==================================================================================================
//**************************************************************************************************
// JControl
//**************************************************************************************************
function JControl(Params) {
    if (Params == undefined) {
        return;
    };

    this.ID = Params.ID;
    this.PaintParams = Params.Painter;
    this.Painter;
    this.PainterClass;

    if (this.PaintParams && this.PaintParams.painterClass) {
        this.Painter = new this.PaintParams.painterClass(this)
    } else { //if (this.DefaultPainter() !== undefined) {
        this.Painter = this.DefaultPainter();
    };

    this.Initialize(Params);
    this.AfterInitialize(Params);
		
    if(!Params.DelayPainting) {
        this.Paint();
        this.AfterPaint();  
    };
	
	// if Params.DelayPainting call Resume from Control
};

JControl.prototype.Resume = function(callBack) {
	this.Paint();
	this.AfterPaint();
	if(callBack) callBack(this);
};

JControl.prototype.Initialize = function(Params) {
	this.Params = Params;
    if(Params && !Params.Styles) {
        if(this.Painter && this.Painter.DefaultStyles) {
            Params.Styles = this.Painter.DefaultStyles();
        };
    };
};

JControl.prototype.AfterInitialize = function(Params) {
};

JControl.prototype.ControlOptions = function() {
    return {};
};

JControl.prototype.DefaultPainter = function() {
    return undefined;
};

JControl.prototype.element = function() {
    // return $("#" + this.ID);
   return this.elementContainer;
};

JControl.prototype.Element = function() {
    // return $("#" + this.ID);
   return this.elementContainer;
};

JControl.prototype.ElementData = function(Data, Value) {
    if (Value) {
        return this.Element().data(Data, Value)
    } else {
        return this.Element().data(Data)
    }
};

JControl.prototype.Position = function() {
    return this.Element().position();
};

JControl.prototype.Width = function() {
    return this.Element().width();
};

JControl.prototype.Height = function() {
    return this.Element().height();
};

JControl.prototype.SetBounds = function(Left, Top, Width, Height) {
    this.Element().css("top", Top);
    this.Element().css("left", Left);
    this.Element().width(Width);
    this.Element().height(Height);
};

// This is called by the painter after painting...
JControl.prototype.Ready = function() {
};

JControl.prototype.Paint = function() {
    if (this.Painter !== undefined) {
	// alerts(this.classID);
             // alerts(this.Painter.classID, this.Painter.Control);
        if (arguments.length > 0) {
            //          this.Painter.Paint(Array.prototype.slice.call(arguments, 0));
            this.Painter.Paint.apply(null, Array.prototype.slice.call(arguments, 0));
        //          this.Painter.prototype.Paint.apply(Array.prototype.slice.call(arguments, 0));
        } else {
            this.Painter.Paint();
			// alerts(this.Painter.classID);
        //          this.Painter.prototype.Paint();
        }
    };
};

JControl.prototype.AfterPaint = function() {
};

JControl.prototype.PaintParam = function(Name, Value) {
    return DefaultValue(this.PaintParams[Name], Value);
};

//**************************************************************************************************
// JControlPainter
//**************************************************************************************************
Class.Inherits(JControlPainter, JBasePainter);
function JControlPainter(Control) {
	JControlPainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

JControlPainter.prototype.classID = "JControlPainter";
JControlPainter.prototype.type = "";

// JControlPainter.prototype.Element = function() {
    // return this.elementContainer;
// };

JControlPainter.prototype.Paint = function() {
	JControlPainter.prototype.parent.prototype.Paint.call(this); 
};

JControlPainter.prototype.SetContainer = function(container) {
	container.data("control", this.Control);
	container.data("object", this.Control);
	this.Control.elementContainer = this.container = container;
	// if(this.container && this.type) {
		// this.container.attr("control-type", this.type);
	// };
	// this.Control.elementContainer = container;
	if(container && this.type) {
		container.attr("control-type", this.type);
	};
};
