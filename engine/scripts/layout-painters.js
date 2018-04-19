function TestLayoutx(container, painter, color, size, callback) {
    return new JLayout({
            Container: container,
            Painter: {
                painterClass: painter,
//                size: size,
                onPaintContainer: function(e, painter, layout) {
                	e.css("border", "1px solid " + color)
                },
                onPaintStatic: function(e, painter, layout) {
                	e.css("height", size)
                	e.css("background-color", color)
                },
                onPaintContent: function(e, painter, layout) {
                	e.css("padding", 10);
                	e.css("background-color", "white");
                	callback(e, painter, layout);
				}
            }
    });	
};

//**************************************************************************************************
// CustomLayoutPainter
//**************************************************************************************************
Class.Inherits(CustomLayoutPainter, JBasePainter);
function CustomLayoutPainter(Control) {
    CustomLayoutPainter.prototype.parent.call(this, Control);
    this.Control = Control;
};

CustomLayoutPainter.prototype.classID = "CustomLayoutPainter";

CustomLayoutPainter.prototype.Paint = function() {
		CustomLayoutPainter.prototype.parent.prototype.Paint.call(this);
		
		this.ParentContainer = this.Control.PaintParams.onCreateContainer(this.Control.Container);
		this.Static = this.Control.PaintParams.onPaintStatic(this.ParentContainer);
		this.Content = this.Control.PaintParams.onPaintContent(this.ParentContainer);
};

//**************************************************************************************************
// LayoutPainter
//**************************************************************************************************
Class.Inherits(LayoutPainter, JBasePainter);
function LayoutPainter(Control) {
    LayoutPainter.prototype.parent.call(this, Control);
    this.Control = Control;
};

LayoutPainter.prototype.classID = "LayoutPainter";

LayoutPainter.prototype.CreateSection = function(section, container) {
		return CreateElement("div", container);
};

LayoutPainter.prototype.Paint = function() {
	LayoutPainter.prototype.parent.prototype.Paint.call(this);

    this.Size = this.Control.PaintParams.size;
    this.FixedSize = this.Control.PaintParams.fixedSize;
    if(this.Control.PaintParams.styles) {
    	this.ContainerCss = this.Control.PaintParams.styles.container;
    	this.StaticCss = this.Control.PaintParams.styles.static;
    	this.ContentCss = this.Control.PaintParams.styles.content;
    };
    
    if(this.Control.PaintParams.reverse == undefined) {
    	this.Reverse = false;
    } else {
    	this.Reverse = this.Control.PaintParams.reverse;
    };    

    this.Control.Container
        .css("box-sizing", "border-box");

    if(!this.ContainerCss) {
      this.ContainerCss = {
            "width": "100%",
            "height": "100%"
      }
    };

    this.Container = this.CreateSection("container", this.Control.Container)
        .css(this.ContainerCss)
        .css("box-sizing", "border-box");

//    this.Container = this.CreateContainer(this.Container);
    this.ParentContainer = this.CreateContainer(this.Container);

    if(!this.StaticCss) {
    	this.StaticCss = {};
    };

    if(!this.ContentCss) {
    	this.ContentCss = {};
    };

    if(this.Reverse) {
		this.Content = this.CreateSection("content", this.ParentContainer);		
		this.Static = this.CreateSection("static", this.ParentContainer);		
    } else {
		this.Static = this.CreateSection("static", this.ParentContainer);		
		this.Content = this.CreateSection("content", this.ParentContainer);		
    };    

    this.InitStatic(this.Static.css(this.StaticCss));    
    this.InitContent(this.Content.css(this.ContentCss));    
        
//	if(this.Control.PaintParams.addStatic) {
//		this.InitExtraStatic(this.ExtraStatic = CreateElement("div", this.ParentContainer));
//	};
    
//	this.Static = CreateElement("div", this.ParentContainer).css(this.StaticCss);		
//    this.InitStatic(this.Static);    
//
//	this.Content = CreateElement("div", this.ParentContainer).css(this.ContentCss);		
//    this.InitContent(this.Content);    

    if(this.Control.PaintParams.onPaintContainer) {
    	this.Control.PaintParams.onPaintContainer(this.Container, this, this.Control);
    };

    if(this.Control.PaintParams.onPaintStatic) {
    	this.Control.PaintParams.onPaintStatic(this.Static, this, this.Control);
    };

    if(this.Control.PaintParams.onPaintContent) {
    	this.Control.PaintParams.onPaintContent(this.Content, this, this.Control);
    };

//    if(this.Control.PaintParams.onPaintExtraStatic) {
//    	this.Control.PaintParams.onPaintExtraStatic(this.ExtraStatic, this, this.Control);
//    };
};

LayoutPainter.prototype.CreateContainer = function(Container) {
	return Container;
};

LayoutPainter.prototype.InitStatic = function(Container) {
};

LayoutPainter.prototype.InitContent = function(Container) {
};

LayoutPainter.prototype.InitExtraStatic = function(Container) {
};

LayoutPainter.prototype.Resize = function(size) {
};

//**************************************************************************************************
// xLayoutTopStaticPainterx
//**************************************************************************************************
//Class.Inherits(xLayoutTopStaticPainterx, LayoutPainter);
//function xLayoutTopStaticPainterx(Control) {
//    xLayoutTopStaticPainterx.prototype.parent.call(this, Control);
//};
//
//xLayoutTopStaticPainterx.prototype.classID = "xLayoutTopStaticPainterx";
//
//xLayoutTopStaticPainterx.prototype.InitStatic = function(Container) {
//	xLayoutTopStaticPainterx.prototype.parent.prototype.InitStatic.call(this, Container);
//    Container
//        .css("position", "relative")
//        .css("top", "0px")
//        .css("height", this.Size)
//        .css("width", "100%")
//        .css("box-sizing", "border-box");
//};
//
//xLayoutTopStaticPainterx.prototype.InitContent = function(Container) {
//	xLayoutTopStaticPainterx.prototype.parent.prototype.InitContent.call(this, Container);
//    Container
//        .css("position", "relative")
//        .css("top", "0px")
//        .css("width", "100%")
//        .css("height", "100%")
//        .css("box-sizing", "border-box")
//};
//
//xLayoutTopStaticPainterx.prototype.Paint = function() {
//    xLayoutTopStaticPainterx.prototype.parent.prototype.Paint.call(this);
//	if(!this.FixedSize) {
//		this.Container.css("padding-bottom", this.Static.outerHeight());
//	};
//};

//**************************************************************************************************
// LayoutTopStaticPainterGen
// Auto-height
// Used for all browsers other than IE
//**************************************************************************************************
Class.Inherits(LayoutTopStaticPainterGen, LayoutPainter);
function LayoutTopStaticPainterGen(Control) {
    LayoutTopStaticPainterGen.prototype.parent.call(this, Control);
};

LayoutTopStaticPainterGen.prototype.classID = "LayoutTopStaticPainterGen";

LayoutTopStaticPainterGen.prototype.InitStatic = function(Container) {
	LayoutTopStaticPainterGen.prototype.parent.prototype.InitStatic.call(this, Container);
    Container
//        .css("display", "table-row")
        .css("box-sizing", "border-box")
        .css("width", "100%")
        .css("height", this.Size ? this.Size : "auto");
        
	this.Static = CreateElement("div", Container)        
//        .css("display", "table-cell")
        .css("box-sizing", "border-box")
        .css("width", "100%")
        .css("height", this.Size ? this.Size : "auto");
};

LayoutTopStaticPainterGen.prototype.InitExtraStatic = function(Container) {
	LayoutTopStaticPainterGen.prototype.parent.prototype.InitStatic.call(this, Container);
    Container
        .css("box-sizing", "border-box")
//        .css("display", "table-row")
        .css("width", "100%")
        
	this.ExtraStatic = CreateElement("div", Container)        
        .css("box-sizing", "border-box")
//        .css("display", "table-cell")
        .css("width", "100%")
};

LayoutTopStaticPainterGen.prototype.InitContent = function(Container) {
	LayoutTopStaticPainterGen.prototype.parent.prototype.InitContent.call(this, Container);
    Container
        .css("box-sizing", "border-box")
//        .css("display", "table-row")
        .css("width", "100%")
        .css("height", "100%")
        
	this.Content = CreateElement("div", Container)        
        .css("box-sizing", "border-box")
//        .css("display", "table-cell")
        .css("width", "100%")
        .css("height", "100%")
};

LayoutTopStaticPainterGen.prototype.Paint = function() {
    LayoutTopStaticPainterGen.prototype.parent.prototype.Paint.call(this);
//	this.Container.css("display", "table");
};

//**************************************************************************************************
// LayoutTopStaticPainterGen2
// Full fluid
// Used for all browsers other than IE
//**************************************************************************************************
Class.Inherits(LayoutTopStaticPainterGen2, LayoutPainter);
function LayoutTopStaticPainterGen2(Control) {
    LayoutTopStaticPainterGen2.prototype.parent.call(this, Control);
};

LayoutTopStaticPainterGen2.prototype.classID = "LayoutTopStaticPainterGen2";

LayoutTopStaticPainterGen2.prototype.InitStatic = function(Container) {
		LayoutTopStaticPainterGen2.prototype.parent.prototype.InitStatic.call(this, Container);
		Container
				.css("width", "100%")
				.css("height", this.Size ? this.Size : "auto")
				.css("box-sizing", "border-box");
};

LayoutTopStaticPainterGen2.prototype.InitContent = function(Container) {
		LayoutTopStaticPainterGen2.prototype.parent.prototype.InitContent.call(this, Container);
		Container
				.css("position", "absolute")
				.css("bottom", 0) 
				.css("width", "100%")
				.css("box-sizing", "border-box");
};

LayoutTopStaticPainterGen2.prototype.InitExtraStatic = function(Container) {
		LayoutTopStaticPainterGen2.prototype.parent.prototype.InitStatic.call(this, Container);
};

LayoutTopStaticPainterGen2.prototype.Paint = function() {
    LayoutTopStaticPainterGen2.prototype.parent.prototype.Paint.call(this);
    this.Container.css("position", "relative");
    this.Content.css("top", this.Static.outerHeight());
    // this.Content.css("top", 26);
};

LayoutTopStaticPainterGen2.prototype.Resize= function(size) {
		if(size) {
				this.Static.css("height", size);
		} else {
				size = this.Static.outerHeight();
		};
		
		this.Content.css("top", size);
};

//**************************************************************************************************
// LayoutTopStaticPainterIE
//**************************************************************************************************
Class.Inherits(LayoutTopStaticPainterIE, LayoutPainter);
function LayoutTopStaticPainterIE(Control) {
    LayoutTopStaticPainterIE.prototype.parent.call(this, Control);
};

LayoutTopStaticPainterIE.prototype.classID = "LayoutTopStaticPainterIE";

LayoutTopStaticPainterIE.prototype.InitStatic = function(Container) {
	LayoutTopStaticPainterIE.prototype.parent.prototype.InitStatic.call(this, Container);
    Container
        .css("width", "100%")
        .css("height", this.Size ? this.Size : "auto")
        .css("box-sizing", "border-box");
};

LayoutTopStaticPainterIE.prototype.InitContent = function(Container) {
	LayoutTopStaticPainterIE.prototype.parent.prototype.InitContent.call(this, Container);
    Container
        .css("width", "100%")
        .css("height", "100%")
        .css("box-sizing", "border-box");               
        
	if(!$.browser.msie) {        
	    // this.Container
	        // .css("padding-bottom", this.Static.outerHeight());
	};
};

LayoutTopStaticPainterIE.prototype.InitExtraStatic = function(Container) {
	LayoutTopStaticPainterIE.prototype.parent.prototype.InitStatic.call(this, Container);
    Container
        .css("display", "table-row")
        .css("width", "100%")
        
	this.ExtraStatic = CreateElement("div", Container)        
        .css("display", "table-cell")
        .css("width", "100%")
};

LayoutTopStaticPainterIE.prototype.Paint = function() {
    LayoutTopStaticPainterIE.prototype.parent.prototype.Paint.call(this);
		if(!this.FixedSize) {
				this.Container.css("padding-bottom", this.Static.outerHeight());
    };
};

LayoutTopStaticPainterIE.prototype.Resize= function(size) {
		if(size) {
				this.Static.css("height", size);
		} else {
				size = this.Static.outerHeight();
		};
		
		this.Container.css("padding-bottom", size);
};

//**************************************************************************************************
// LayoutTopStaticPainter
//**************************************************************************************************
if($.browser.msie) {
	Class.Inherits(LayoutTopStaticPainter, LayoutTopStaticPainterIE);
} else {
	Class.Inherits(LayoutTopStaticPainter, LayoutTopStaticPainterGen2);
//	Class.Inherits(LayoutTopStaticPainter, LayoutTopStaticPainterGen);	
};

function LayoutTopStaticPainter(Control) {
    LayoutTopStaticPainter.prototype.parent.call(this, Control);
};

LayoutTopStaticPainter.prototype.classID = "LayoutTopStaticPainter";

//**************************************************************************************************
// LayoutTopStaticPainterAuto: Use this for auto height
//**************************************************************************************************
if($.browser.msie) {
	Class.Inherits(LayoutTopStaticPainterAuto, LayoutTopStaticPainterIE);
} else {
	Class.Inherits(LayoutTopStaticPainterAuto, LayoutTopStaticPainterGen);	
};

function LayoutTopStaticPainterAuto(Control) {
    LayoutTopStaticPainterAuto.prototype.parent.call(this, Control);
};

LayoutTopStaticPainterAuto.prototype.classID = "LayoutTopStaticPainterAuto";

//**************************************************************************************************
// LayoutLeftStaticPainter
//**************************************************************************************************
Class.Inherits(LayoutLeftStaticPainter, LayoutPainter);
function LayoutLeftStaticPainter(Control) {
    LayoutLeftStaticPainter.prototype.parent.call(this, Control);
    this.Control = Control;

    this.Size = this.Control.PaintParams.size;
    this.FixedSize = this.Control.PaintParams.fixedSize;
    if(this.Control.PaintParams.styles) {
    	this.ContainerCss = this.Control.PaintParams.styles.container;
    	this.StaticCss = this.Control.PaintParams.styles.static;
    	this.ContentCss = this.Control.PaintParams.styles.content;
    };
};

LayoutLeftStaticPainter.prototype.classID = "LayoutLeftStaticPainter";

LayoutLeftStaticPainter.prototype.InitStatic = function(Container) {
	LayoutLeftStaticPainter.prototype.parent.prototype.InitStatic.call(this, Container);
    Container
//        .css("display", "inline-block")
        .css("display", "table-cell")
        .css("width", this.Size)
        .css("height", "100%")        
};

LayoutLeftStaticPainter.prototype.InitContent = function(Container) {
	LayoutLeftStaticPainter.prototype.parent.prototype.InitContent.call(this, Container);
    Container
//        .css("display", "inline-block")
        .css("display", "table-cell")
//        .css("width", "100%")
        .css("height", "100%")
        .css("box-sizing", "border-box");
};

LayoutLeftStaticPainter.prototype.Paint = function() {
    LayoutLeftStaticPainter.prototype.parent.prototype.Paint.call(this);
	this.Container.css("display", "table");
	this.Container.css("height", "100%");
};

//**************************************************************************************************
// LayoutLeftStaticPainter2
//**************************************************************************************************
Class.Inherits(LayoutLeftStaticPainter2, LayoutPainter);
function LayoutLeftStaticPainter2(Control) {
    LayoutLeftStaticPainter2.prototype.parent.call(this, Control);
    this.Control = Control;

    this.Size = this.Control.PaintParams.size;
    this.FixedSize = this.Control.PaintParams.fixedSize;
    if(this.Control.PaintParams.styles) {
    	this.ContainerCss = this.Control.PaintParams.styles.container;
    	this.StaticCss = this.Control.PaintParams.styles.static;
    	this.ContentCss = this.Control.PaintParams.styles.content;
    };
};

LayoutLeftStaticPainter2.prototype.classID = "LayoutLeftStaticPainter2";

LayoutLeftStaticPainter2.prototype.InitStatic = function(Container) {
	LayoutLeftStaticPainter2.prototype.parent.prototype.InitStatic.call(this, Container);
    // Container
//        .css("display", "inline-block")
        // .css("display", "table-cell")
        // .css("width", this.Size)
        // .css("height", "100%")        
};

LayoutLeftStaticPainter2.prototype.InitContent = function(Container) {
	LayoutLeftStaticPainter2.prototype.parent.prototype.InitContent.call(this, Container);
    Container
//        .css("display", "inline-block")
        // .css("display", "table-cell")
//        .css("width", "100%")
        // .css("height", "100%")
        // .css("box-sizing", "border-box");
};

LayoutLeftStaticPainter2.prototype.Paint = function() {
    LayoutLeftStaticPainter2.prototype.parent.prototype.Paint.call(this);
	this.Container.attr("cellspacing", "0");
	this.Container.attr("cellpadding", "0");
	// this.Container.css("display", "table");
	// this.Container.css("height", "100%");
	// this.Container.css("width", "100%");
};

LayoutLeftStaticPainter2.prototype.CreateSection = function(section, container) {
		if(section == "container") {
				return CreateElement("table", container)
		} else {
				return $("<td>").appendTo(container);
		}
};

LayoutLeftStaticPainter2.prototype.CreateContainer = function(Container) {
	return $("<tr>").appendTo(Container);
};
