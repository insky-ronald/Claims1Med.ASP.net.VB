// *************************************************************************************************
// File name: pg-painters.js
// Last modified on
// 29-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// PageControlPainter
//**************************************************************************************************
Class.Inherits(PageControlPainter, JControlPainter);
function PageControlPainter(Control) {
	PageControlPainter.prototype.parent.call(this, Control);
};

PageControlPainter.prototype.type = "pg";
PageControlPainter.prototype.classID = "PageControlPainter";

PageControlPainter.prototype.Paint = function() {
	PageControlPainter.prototype.parent.prototype.Paint.call(this); 
	
	// var container = CreateElement("div", this.Control.container, "", "pg").attr("control-theme", "default");
	var container = CreateElement("div", this.Control.container, "", "pg").addClass("pg-theme-" + this.GetParam("theme", "default"));
	
	this.PaintHeader(this.header = CreateElement("div", container).attr("pg-sec", "header"));
	this.PaintContent(this.content = CreateElement("div", container).attr("pg-sec", "content"));

	if(typeof this.GetParam("indent") == "number") {
		var indent = this.GetParam("indent");
		this.header.css("padding-left", indent);
		this.gutter.css("left", -indent).css("width", ("Calc(100% + {0}px)").format(indent));
	};

	if(typeof this.GetParam("margin") == "number") {
		var margin = this.GetParam("margin");
		this.header.css("padding-top", margin);
	};

	if(typeof this.GetParam("gutter") == "number") {
		var gutter = this.GetParam("gutter");
		this.gutter.css("height", gutter);
	};
	
	if(typeof this.GetParam("spacing") == "number") {
		var spacing = this.GetParam("spacing");
		this.Control.EachTab(function(i, tab) {	
			tab.container.css("margin-right", spacing);
		});
	};

	if(this.GetParam("autoHeight", false)) {
		container.css("height", "auto")
		this.content.css("height", "auto")
	} else
		this.content.css("height", ("Calc(100% - {0}px)").format(this.header.innerHeight()));
	
	this.SetContainer(container);
};

PageControlPainter.prototype.PaintHeader = function(container) {
	// this.PaintColumHeaders(container, float);
	// container
		// .click(function() {
			// alerts($(this).outerHeight());
		// });
	var tabsContainer = CreateElement("div", container).attr("pg-sec", "tabs");
	this.Control.EachTab(function(i, tab) {	
		tab.container = CreateElement("div", tabsContainer)
			.data("tab", tab)
			.attr("pg-sec", "tab")
			.html(tab.caption)
			.click(function() {
				var tab = $(this).data("tab");
				tab.pg.Select(tab.id);
			});
			
		// alerts(tab.caption);
	});
	
	this.gutter = CreateElement("div", container).attr("pg-sec", "gutter");
	// alerts(container.outerHeight());
}

PageControlPainter.prototype.PaintContent = function(container) {
	// this.PaintColumHeaders(container, float);
};

// PageControlPainter.prototype.ShowTabs = function(visible) {
// };

PageControlPainter.prototype.Select = function(tab) {
	if(this.Control.selected) {
		this.Control.selected.container.removeAttr("focused");
		if(this.Control.selected.content) {
			// console.log("PageControlPainter.prototype.Select - none")
			this.Control.selected.content.css("display", "none");
			// this.Control.selected.content.css("visibility", "hidden");
		};
	};
	
	// this.header.find("div[pg-sec='tab'][focused='1']").removeAttr("focused");
	// console.log(tab)
	tab.container.attr("focused", "1");
	if(!tab.content && tab.OnCreate) {
		tab.content = CreateElement("div", this.content).attr("pg-sec", "tab-content");
		if(tab.pg.initTab) tab.pg.initTab(tab);
		tab.OnCreate(tab);
	} else	{
		// console.log("PageControlPainter.prototype.Select - block")
		tab.content.css("display", "block");
		// tab.content.css("visibility", "visible");
	};
	
	if(tab.OnSelect) {
		tab.OnSelect(tab);
	};
	
	this.Control.selected = tab;
};
