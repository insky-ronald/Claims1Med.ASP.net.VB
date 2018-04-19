// *************************************************************************************************
// File name: toolbar-painter.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// ToolbarPainter
//**************************************************************************************************
Class.Inherits(ToolbarPainter, JControlPainter);
function ToolbarPainter(Control) {
	ToolbarPainter.prototype.parent.call(this, Control);
};

ToolbarPainter.prototype.type = "toolbar";
ToolbarPainter.prototype.classID = "ToolbarPainter";

ToolbarPainter.prototype.Paint = function() {
	ToolbarPainter.prototype.parent.prototype.Paint.call(this); 

	var container = CreateElement("div", this.Control.container, "", "toolbar tb-theme-" + this.Control.theme);//.attr("theme", "default");
	this.buttonContainer = CreateElement("ul", container)
	
	this.SetContainer(container);
};

ToolbarPainter.prototype.NewItem = function(params) {
}

//**************************************************************************************************
// ToolButtonPainter
//**************************************************************************************************
Class.Inherits(ToolButtonPainter, JControlPainter);
function ToolButtonPainter(Control) {
	ToolButtonPainter.prototype.parent.call(this, Control);
};

ToolButtonPainter.prototype.type = "tool-btn";
ToolButtonPainter.prototype.classID = "ToolButtonPainter";

ToolButtonPainter.prototype.Paint = function() {
	ToolButtonPainter.prototype.parent.prototype.Paint.call(this); 

	var button = this.Control;
	var container = CreateElement("li", button.container, "", "")
		.css("float", button.align)
		.on("mousedown", function(e) {
			desktop.HideHints();
		})
		.click(function(e) {
			button.toolbar.Events.OnSelectItem.trigger(button);
		})
	
	if(button.icon.indexOf(".png") > -1) {
		var img = CreateElement("img", container, "", "")
			.attr("src", button.icon)
	} else {
		// var img = CreateElement("div", container, "", "").css("width", 24).css("height", 24);
		var icon, iconParts = button.icon.split("+");
		// if(iconParts.length == 1)
			icon  = iconParts[0];
		
		// desktop.GetSvg(container, button.icon, this.Control.toolbar.buttonSize+4, {noTopMargin:true})
		var svg = desktop.GetSvg(container, icon, this.Control.toolbar.buttonSize+4, {noTopMargin:true})
			.css("fill", this.Control.iconColor);
			
		var self = this;
		if(iconParts.length > 1)
			CreateElementEx("div", container, function(c) {
				desktop.GetSvg(c, iconParts[1], self.Control.toolbar.buttonSize, {noTopMargin:true})
					.css("fill", self.Control.iconColor);
			});
			// desktop.GetSvg(container, iconParts[1], this.Control.toolbar.buttonSize, {noTopMargin:true})
			// desktop.GetSvg(svg, iconParts[1], this.Control.toolbar.buttonSize, {noTopMargin:true})
				// .css("fill", this.Control.iconColor);
	};

	if(button.dropdown && !button.noIndicator) {
		container.attr("btn-dropdown", 1);
		var d = CreateElement("div", container, "", "")
			.attr("btn-sec", "dropdown");
			
		desktop.GetSvg(d, "tree-expand", 16, {noTopMargin:true})
		// desktop.GetSvg(d, "tree-collapse", 16, {noTopMargin:true})
			.css("fill", this.Control.iconColor)
	};
		
	
	this.SetContainer(container);
	
	if(button.hint) desktop.SetHint(container, button.hint, button.toolbar.hintAlign);
	// if(button.hint) desktop.SetHint(container, button.hint);
	// desktop.SetHint(container, function(dialog, container) {
		// alerts(container.data("control"));
		// container.html(container.data("control").hint);
	// });
};

ToolButtonPainter.prototype.NewItem = function(params) {
}
