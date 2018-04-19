// *************************************************************************************************
// File name: desktop-window-painters.js
// Last modified on
// 02-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// DesktopWindowPainter
//**************************************************************************************************
Class.Inherits(DesktopWindowPainter, JBasePainter);
function DesktopWindowPainter(Control) {
    DesktopWindowPainter.prototype.parent.call(this, Control);
    this.Window = Control;
};

DesktopWindowPainter.prototype.classID = "DesktopWindowPainter";

DesktopWindowPainter.prototype.Paint = function() {
    DesktopWindowPainter.prototype.parent.prototype.Paint.call(this);

    var Window = this.Control;
    var eWindow = Window.Element();
    eWindow.addClass("desktop-window");
    eWindow.css("z-index", this.Control.Desktop.zIndex++);
	
    var eHeader = CreateElement("div", eWindow, "WinHeader_" + Window.ID, "window-header");
    var eTitle = CreateElement("div", eHeader, "WinTitle_" + Window.ID, "window-title")
    var eContainer = CreateElement("div", eWindow, "WinContainer_" + Window.ID, "desktop-window-container");
    var eContent = CreateElement("div", eContainer, "WinContent_" + Window.ID, "desktop-window-content");

    eWindow.data("header", eHeader);
    eWindow.data("title", eTitle);
    eWindow.data("container", eContainer);
    eWindow.data("frame-container", eContent);
	
    Window.Ready();
};

DesktopWindowPainter.prototype.AdjustSize = function(eButton) {
	// return;
	var eHeader = this.Control.Element().data("header");
    var eContainer = this.Control.Element().data("container");
	
	var offset = eHeader.outerHeight();
	var offsetHeader = 0;
	var toolbar = $("#frame-container-toolbar");
	if(toolbar) offsetHeader = toolbar.outerHeight();
	// alerts(offsetHeader);
	eContainer.css("margin-bottom", offset+parseInt(offsetHeader/2));
	eContainer.css("top", offset);
	this.Control.Element().css("top", parseInt(offsetHeader/2));

	toolbar
		.css("top", parseInt(offsetHeader/2))
		.css("left", 0)
	
    if($.browser.opera)
        eContainer.css("bottom", -offset*2)
    else
        eContainer.css("bottom", -offset+parseInt(offsetHeader/2));
};

DesktopWindowPainter.prototype.SetTitle = function(SubTitle) {
    if(var title = this.Control.Element().data("title")) {    	
				title.html("");
				CreateElement("label", title).attr("title-type", "main").html(desktop.PageTitle);
				CreateElement("label", title).attr("title-type", "quo").html("&raquo");
				CreateElement("label", title).attr("title-type", "sub").html(SubTitle);
				
				// title.html("<label style='font-size:125%'>" + desktop.PageTitle +"</a> <a style='color:white'>&raquo; </a>");
				// title.html("<a style='font-size:125%'>" + desktop.PageTitle +"</a> <a style='color:white'>&raquo; </a>");
				// title.append(SubTitle);
				this.AdjustSize();
		};
};

//**************************************************************************************************
// DesktopToolbuttonPainter
//**************************************************************************************************
Class.Inherits(DesktopToolbuttonPainter, JBasePainter);
function DesktopToolbuttonPainter(Control) {
    DesktopToolbuttonPainter.prototype.parent.call(this, Control);
    this.Button = Control;
};

DesktopToolbuttonPainter.prototype.classID = "DesktopToolbuttonPainter";

DesktopToolbuttonPainter.prototype.Margin = function() {
	return 0
};

DesktopToolbuttonPainter.prototype.Paint = function() {
	DesktopToolbuttonPainter.prototype.parent.prototype.Paint.call(this);

	this.Container = CreateElement("li", this.Control.ParentContainer, this.Button.ID, "side-menu-item")
		.data("icon", this);
    	    	
	if(defaultValue(this.Button.PaintParams.iconImage, "") == "") 
		this.Button.PaintParams.iconImage = "/engine/images/control-right-orange.png";

	if(this.Button.PaintParams.iconImage.toLowerCase().indexOf(".svg") > -1) {
		var img = CreateElement("div", this.Container)
			.css("width", "24px")
			.css("height", "24px")			
			
		desktop.GetSvg(this.Button.PaintParams.iconImage, {
			init: function(params) {
				params.size = 24;
			},
			result: function(data) {
				img.html(data)
			}
		});

		// var img = CreateElement("object", this.Container)
			// .attr("type", "image/svg+xml")
			// .css("width", "24px")
			// .css("height", "24px")
			// .attr("data", this.Button.PaintParams.iconImage)
			
		// img[0].addEventListener("load", function() {
			// var svgDoc = this.contentDocument;
			// var svgItem = svgDoc.getElementsByTagName("svg");
			// if(svgItem.length > 0) {
				// svgItem[0].setAttribute("width", "24px")
				// svgItem[0].setAttribute("height", "24px")
				// svgItem[0].setAttribute("fill", "white")
				// img.css("width", "")
				// img.css("height", "")
			// }
		// });
		
	} else {
		var img = CreateElement("img", this.Container)
			// .attr("src", this.Button.PaintParams.iconImage)
			.attr("src", defaultValue(this.Button.PaintParams.iconImage, "/engine/images/control-right-orange.png"))
	}
				
	CreateElement("a", this.Container)
		.html(this.Control.Title);
		
	if(!this.Control.Enabled) {
		this.Container.attr("p-enabled", "false");
	}
};

DesktopToolbuttonPainter.prototype.Down = function() {
    this.Update(true, true);
    this.Button.Down = !this.Button.Down;
};

DesktopToolbuttonPainter.prototype.Up = function() {
    this.Button.Down = !this.Button.Down;
    this.Update(false, false);
};

DesktopToolbuttonPainter.prototype.Update = function(mouseIn, mouseDown) {
    if(this.Button.Down) {    	
    	return;
    };
       
    this.Container.attr("p-selected", "normal")
    	.hide().show(); // use for IE8
    
    if(mouseIn) {
        if(mouseDown) {
        	this.Container.attr("p-selected", "active")
        		.hide().show(); // use for IE8
        };
    };
};

//**************************************************************************************************
// DesktopToolbuttonPainterIcon
//**************************************************************************************************
Class.Inherits(DesktopToolbuttonPainterIcon, JBasePainter);
function DesktopToolbuttonPainterIcon(Control) {
    DesktopToolbuttonPainterIcon.prototype.parent.call(this, Control);
    this.Button = Control;
};

DesktopToolbuttonPainterIcon.prototype.classID = "DesktopToolbuttonPainterIcon";

DesktopToolbuttonPainterIcon.prototype.Margin = function() {
	return 0
};

// DesktopToolbuttonPainterIcon.prototype.Paint = function() {
	// DesktopToolbuttonPainterIcon.prototype.parent.prototype.Paint.call(this);
	
	// this.Container = CreateElement("div", this.Control.ParentContainer, this.Button.ID, "side-menu-item")
		// .attr("align", "center")
		// .data("icon", this);

	// this.Icon = CreateElement("img", this.Container)
		// .attr("src", defaultValue(this.Button.PaintParams.iconImage, "/engine/images/table-24.png"))
// };

DesktopToolbuttonPainterIcon.prototype.Paint = function() {
	DesktopToolbuttonPainterIcon.prototype.parent.prototype.Paint.call(this);
	
	this.Container = CreateElement("li", this.Control.ParentContainer, this.Button.ID, "side-menu-item")
		.attr("align", "center")
		.data("icon", this);
    	    	
	if(defaultValue(this.Button.PaintParams.iconImage, "") == "") 
		this.Button.PaintParams.iconImage = "/engine/images/control-right-orange.png";

	if(this.Button.PaintParams.iconImage.toLowerCase().indexOf(".svg") > -1) {		
		var iconSize = 32;
		var img = CreateElement("div", this.Container)
			.css("width", iconSize)
			// .css("height", iconSize)
			.css("height", "auto")
			// .css("margin-left", 0)
			.css("padding-top", 8)
			.css("padding-bottom", 8)
			
		desktop.GetSvg(this.Button.PaintParams.iconImage, {
			init: function(params) {
				params.size = iconSize;
			},
			result: function(data) {
				img.html(data)
			}
		});
		
		this.Icon = img;
	} else {
		this.Icon = CreateElement("img", this.Container)
			.attr("src", defaultValue(this.Button.PaintParams.iconImage, "/engine/images/table-24.png"))
	}
};

DesktopToolbuttonPainterIcon.prototype.Down = function() {
    this.Update(true, true);
    this.Button.Down = !this.Button.Down;
};

DesktopToolbuttonPainterIcon.prototype.Up = function() {
    this.Button.Down = !this.Button.Down;
    this.Update(false, false);
};

DesktopToolbuttonPainterIcon.prototype.Update = function(mouseIn, mouseDown) {
    if(this.Button.Down) {    	
    	return;
    };
       
    this.Container.attr("p-selected", "normal")
    	.hide().show(); // use for IE8

	if(this.Icon) {
		this.Icon.attr("p-selected", "normal")
			.hide().show(); // use for IE8
    }
	
    if(mouseIn) {
        if(mouseDown) {
        	this.Container.attr("p-selected", "active")
        		.hide().show(); // use for IE8

			if(this.Icon) {
				this.Icon.attr("p-selected", "active")
					.hide().show(); // use for IE8
			}
        };
    };
};
