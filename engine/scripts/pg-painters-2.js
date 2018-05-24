// *************************************************************************************************
// File name: dbgrid-painters-2.js
// Last modified on
// 31-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jPageControlPainter
//**************************************************************************************************
Class.Inherits(jPageControlPainter, jBasePainter);
function jPageControlPainter(params) {
	jPageControlPainter.prototype.parent.call(this, params);
};

jPageControlPainter.prototype.classID = "jPageControlPainter";

jPageControlPainter.prototype.initialize = function(params) {
    jPageControlPainter.prototype.parent.prototype.initialize.call(this, params);
};

jPageControlPainter.prototype.paint = function(container) {
	jPageControlPainter.prototype.parent.prototype.paint.call(this, container);
		
	var self = this;
	var tabs = this.control.tabs;
	this.mainContainer = this.creaMainContainer(container, "pg2", this.params.theme);
	if(this.params.fullBorder)
		this.mainContainer.addClass("pg-full-border");
	
	this.header = CreateElementEx("div", this.mainContainer, function(header) {
		
		if(self.control.params.indent !== undefined)
			header.css("padding-left", self.control.params.indent)
		
		if(self.params.tabsAlign === "right")
			header.css("justify-content", "flex-end");

		$(tabs).each(function(i, tab) {
			tab.painter.paint(header);
		})
		
		// new jScroller({
				// target:header, 
				// scroll:"horz"
			// });
			
		// if(self.control.params.showScrollButtons) {
		// };
		
		header.on("mouseenterx", function(e) {
			// if the content is overflowing then show the scroll bar buttons
			if(this.scrollWidth > $(this).outerWidth())
				self.showScrollButtons();
			
			// console.log({scrollLeft: $(this).scrollLeft(), scrollWidth: this.scrollWidth, width:$(this).outerWidth()})
		});
		
		header.on("mouseleavex", function(e) {
			if(self.scrollBarButtons)
				self.scrollBarButtons.remove();	
		});
		
	}, "pg-header");
	
	this.gutter = CreateElementEx("div", this.mainContainer, function(gutter) {
		CreateElementEx("div", gutter, function(gutterBorder) {
			
		}, "pg-gutter-border");
	}, "pg-gutter");
	
	this.contentContainer = CreateElementEx("div", this.mainContainer, function(content) {
		if(self.params.autoHeight)
			content.addClass("auto-height")
		// $(tabs).each(function(i, tab) {
			
		// })
	}, "pg-content");
};

jPageControlPainter.prototype.showTabs = function(visible) {
	this.header.css("display", visible ? "": "none");
	this.gutter.css("display", visible ? "": "none");
};

jPageControlPainter.prototype.showScrollButtons = function(visible) {
	var self = this;
	var offset = this.header.offset();
	var width = this.header.outerWidth();
	var height = this.header.outerHeight();
	
	this.scrollBarButtons = CreateElementEx("div", this.header, function(scrollButtons) {
	// this.scrollBarButtons = CreateElementEx("div", $("body"), function(scrollButtons) {
		// scrollButtons.css({
			// top: offset.top,
			// left: offset.left + width - 100,
			// height: 32,
			// width: 100,
			// "z-index": ++desktop.zIndex
		// });
		
		CreateElementEx("div", scrollButtons, function(left) {
			desktop.svg.draw(left, "chevron-left", 24);
		}, "pg-scroll-left").click(function() {
			// console.log("left")
			self.header.velocity("scroll", {duration:50, axis:"x", container:self.header, offset: -100});
			// self.header.scrollLeft(self.header.scrollLeft()-100);
		});
		
		CreateElementEx("div", scrollButtons, function(right) {
			desktop.svg.draw(right, "chevron-right", 24)
		}, "pg-scroll-right").click(function() {
			// console.log("right")
			self.header.velocity("scroll", {duration:50, axis:"x", container:self.header, offset: 100});			
			// self.header.scrollLeft(self.header.scrollLeft()+100);
		});
	}, "pg-scroll-buttons");
};

//**************************************************************************************************
// jPageTabPainter
//**************************************************************************************************
Class.Inherits(jPageTabPainter, jBasePainter);
function jPageTabPainter(params) {
	jPageTabPainter.prototype.parent.call(this, params);
};

jPageTabPainter.prototype.classID = "jPageTabPainter";

jPageTabPainter.prototype.initialize = function(params) {
    jPageTabPainter.prototype.parent.prototype.initialize.call(this, params);
};

jPageTabPainter.prototype.paint = function(container) {
	jPageTabPainter.prototype.parent.prototype.paint.call(this, container);
	
	var self = this;
	var params = this.control.params;
	// var paintParams = this.control.paintParams;
	// console.log(paintParams)
	this.mainContainer = this.creaMainContainer(container, "pg-tab", this.control.theme)
		.click(function() {
			self.control.show();
		});
		
	CreateElementEx("div", this.mainContainer, function(content) {
		if(params.icon.name && params.icon.position === "left")
			CreateElementEx("div", content, function(icon) {
				icon.css("fill", params.icon.color || "")
				if(params.hideCaption)
					icon.addClass("no-caption");
				
				desktop.svg.draw(icon, params.icon.name, params.icon.size)
					
			}, "pg-content-icon");
			
		if(!params.hideCaption)
			CreateElementEx("div", content, function(caption) {
				caption.html(params.caption)
			}, "pg-content-caption");
			
	}, "pg-tab-content");
};

jPageTabPainter.prototype.setVisible = function(visible) {
	if(this.control.pg.painter.params.autoHeight) {
		if(visible) 
			this.tabContent.css("display", "block")
		else
			this.tabContent.css("display", "none");
	} else { 
		if(visible) {
			// this.tabContent.css("display", "block");
			this.tabContent.css("visibility", "visible");
			this.tabContent.css("opacity", 1);
			this.tabContent.css("pointer-events", "");
		} else {
			// this.tabContent.css("display", "none");
			this.tabContent.css("visibility", "hidden");
			this.tabContent.css("opacity", 0);
			this.tabContent.css("pointer-events", "none");
		};
	};
	
	// console.log(this.control.params)
	if(this.control.params.OnVisibility) {
		this.control.params.OnVisibility(this.control, visible);
	}
};

jPageTabPainter.prototype.hide = function() {
	// this.tabContent.css("display", "none");
	// this.tabContent.css("visibility", "hidden");
	this.setVisible(false);
	this.mainContainer.removeClass("tab-active");
};

jPageTabPainter.prototype.show = function() {
	var self = this;
	if(this.control.pg.activeTab) {
		this.control.pg.activeTab.active = false;
		this.control.pg.activeTab.hide();
	};
	
	this.control.pg.activeTab = this.control;
	this.control.pg.activeTab.active = true;
	
	if(!this.tabContent) {
		this.tabContent = CreateElementEx("div", this.control.pg.painter.contentContainer, function(content) {
			if(self.control.pg.painter.params.autoHeight)
				content.addClass("auto-height");

			// self.control.container = content.css("display", "block");
			// self.control.container = content.css("visibility", "visible");
			self.control.container = content;
			// self.setVisible(true);
			if(self.control.params.OnCreate)
				self.control.params.OnCreate(self.control);
			
			// self.activate();
		}, "tab-content");
	} else 
		this.activate();
	
	// this.tabContent.css("display", "block");
	// this.tabContent.css("visibility", "visible");
	this.setVisible(true);
	this.mainContainer.addClass("tab-active");
};

jPageTabPainter.prototype.activate = function() {
	if(this.control.params.OnActivate)
		this.control.params.OnActivate(this.control);
};
