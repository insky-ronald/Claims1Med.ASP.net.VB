// *************************************************************************************************
// File name: dialogs-painters.js
// Last modified on
// 04-MAR-2015
// *************************************************************************************************
Class.Inherits(PopupBasePainter, JControlPainter);
function PopupBasePainter(Control) {
    PopupBasePainter.prototype.parent.call(this, Control);
};

PopupBasePainter.prototype.type = "dlg";
PopupBasePainter.prototype.classID = "PopupBasePainter";
PopupBasePainter.prototype.canCustomizeHeader = true;

PopupBasePainter.prototype.Paint = function() {
    PopupBasePainter.prototype.parent.prototype.Paint.call(this);

	this.css = this.GetParam("css", "");
	this.snap = this.GetParam("snap", "bottom");
	this.align = this.GetParam("align", "left");
	this.inset = this.GetParam("inset", false);
	this.showHeader = this.GetParam("showHeader", true);
	this.showFooter = this.GetParam("showFooter", true);
	
	this.Events = {};
	this.Events.OnRenderContainer = new EventHandler(this.Control);
	this.Events.OnRenderContainer.add(function(dialog, container) {
		dialog.Painter.OnRenderContainer(container);
		if(dialog.PaintParams.OnRenderContainer) {
			dialog.PaintParams.OnRenderContainer(dialog, container);
		};
	})
	
	if(this.showHeader) {
		this.Events.OnRenderHeader = new EventHandler(this.Control);
		this.Events.OnRenderHeader.add(function(dialog, container) {
			dialog.Painter.OnRenderHeader(container);
			if(dialog.PaintParams.OnRenderHeader && dialog.Painter.canCustomizeHeader) {
				dialog.PaintParams.OnRenderHeader(dialog, container);
			};
		})
	};
	
	this.Events.OnRenderContent = new EventHandler(this.Control);
	this.Events.OnRenderContent.add(function(dialog, container) {
		dialog.Painter.OnRenderContent(container);
		if(dialog.PaintParams.OnRenderContent) {
			dialog.PaintParams.OnRenderContent(dialog, container);
		};
	})
	
	if(this.showFooter) {
		this.Events.OnRenderFooter = new EventHandler(this.Control);
		this.Events.OnRenderFooter.add(function(dialog, container) {
			dialog.Painter.OnRenderFooter(container);
			if(dialog.PaintParams.OnRenderFooter) {
				dialog.PaintParams.OnRenderFooter(dialog, container);
			};
		})
	};
	
	this.GetTargetDimension();
	
	this.container = CreateElement("div", this.Control.container, "", "dialog")
		.attr("dlg-snap", this.snap)
		.attr("dlg-align", this.align)
		// .css("opacity", 0) // we will transition this to 1 in Show() 
		.css("z-index", ++desktop.zIndex)
		.css("width", this.GetParam("width", ""))
		.css("height", this.GetParam("height", ""))
	    .on("dlgclose", function() {
			var dialog = $(this).data("object");
			if(dialog.close_on_espace) {
				dialog.Hide();
			};
	    })
		
	this.InitializeDialog();	
	this.AfterInitializeDialog();	
	this.SetContainer(this.container);
	
	this.Show();
	
	var self = this;
    $("body").on("mousedown", function(e) {	
		var dialog = $(e.target).closest("div[control-type='dlg']");
		var targetIndex = defaultValue(dialog.css("z-index"), 0);
		if(targetIndex != desktop.GetTopMostDialogIndex()) // BUT! if there is a dialog box on top of this then do not hide
			if(!self.Control.modal && $(e.target).closest(self.container).index() < 0) {
				self.Control.Hide();
			}
    });
	
	$(window).resize(function() {
		self.Reposition();
	});
	
};

PopupBasePainter.prototype.OnRenderContainer = function(container) {
};

PopupBasePainter.prototype.OnRenderHeader = function(container) {
};

PopupBasePainter.prototype.OnRenderContent = function(container) {
};

PopupBasePainter.prototype.OnRenderFooter = function(container) {
};

PopupBasePainter.prototype.RenderSection = function(section, container) {
	if(section == "container")
		this.Events.OnRenderContainer.trigger(container)
	else if(section == "header")
		this.Events.OnRenderHeader.trigger(container)
	else if(section == "content")
		this.Events.OnRenderContent.trigger(container)
	else if(section == "footer")
		this.Events.OnRenderFooter.trigger(container);
};

PopupBasePainter.prototype.AdjustX = function(x0, x1) {
};

PopupBasePainter.prototype.SnapAdjusted = function(oldSnap) {
};

PopupBasePainter.prototype.CalculatePosition = function() {
	var x = this.left, y = this.top;
	var w = this.container.outerWidth();
	
	if(this.snap == "bottom") {
		if(this.inset)
			y = this.targetY
		else
			y = this.targetY + this.targetH;		
		
		if(y + this.container.outerHeight() > $("body").outerHeight()) {
			this.container.attr("dlg-snap", this.snap = "top");
			var p = this.CalculatePosition();
			x = p.left; y = p.top;
			this.SnapAdjusted("bottom");
		};
		
	} else if(this.snap == "top") {
		if(this.inset)
			y = this.targetY + this.targetH - this.container.outerHeight()
		else
			y = this.targetY - this.container.outerHeight();	
		
	} else if(this.snap == "right") {
		if(this.inset)
			x = this.targetX
		else
			x = this.targetX + this.targetW;
	} else if(this.snap == "left") {
		if(this.inset)
			x = this.targetX + this.targetW - this.container.outerWidth()
		else
			x = this.targetX - this.container.outerWidth();
	}
	
	if(this.snap == "bottom" || this.snap == "top") {
		if(this.align == "left")
			x = this.targetX
		else if(this.align == "right")
			x = this.targetX + this.targetW - this.container.outerWidth()
		else 
			x = this.targetX + (this.targetW - this.container.outerWidth()) / 2;
		
	
		if(x < 0) this.AdjustX(x, x=1);
		if(x + w > $("body").outerWidth()) this.AdjustX(x, x=$("body").outerWidth()-w-1);
		
	} else if(this.snap == "right" || this.snap == "left") {
		if(this.align == "top")
			y = this.targetY
		else if(this.align == "bottom")
			y = this.targetY + this.targetH- this.container.outerHeight()
		else 
			y = this.targetY + (this.targetH - this.container.outerHeight()) / 2;
	};
	
	return {top:y, left:x};
};

PopupBasePainter.prototype.GetTargetDimension = function() {
	// jQuery offset() not working in IE11
	// var p = this.Control.target.offset(); 
	// this.targetY = p.top;
	// this.targetX = p.left;
	// this.targetY = this.Control.target[0].offsetTop;
	// this.targetX = this.Control.target[0].offsetLeft;
	
	// If you want coords relative to the document use element.getBoundingClientRect().top. 
	// Add window.pageYOffset if you want to take the document scrolling into account.
	// Subtract element.clientTop if you don't consider the element border as the part of the element
	// console.log(this.Control.target.length)
	this.targetY = this.Control.target[0].getBoundingClientRect().top;
	this.targetX = this.Control.target[0].getBoundingClientRect().left;
	this.targetW = this.Control.target.outerWidth();	
	this.targetH = this.Control.target.outerHeight();
	
	this.top = this.targetY+this.targetH;
	this.left = this.targetX;
};

PopupBasePainter.prototype.Reposition = function() {
	this.GetTargetDimension();
	var pos = this.CalculatePosition();
	this.container
		.css("top", pos.top)
		.css("left", pos.left)
		// .css("opacity", 1)
		.removeClass("hide-dialog")
		.addClass("animate-dialog");
		
	// alerts("1")
}

PopupBasePainter.prototype.PreShow = function() {
};

PopupBasePainter.prototype.Show = function() {
	var pos = this.CalculatePosition();
	var e = this.container
		.css("display", "block")
		// .css("visibility", "visible")
		.css("top", pos.top)
		.css("left", pos.left)
		.removeClass("hide-dialog")
		.addClass("animate-dialog");
		// .css("transition", "opacity 0.5s ease-in")
		// .css("opacity", 1)
	
	// e.css("display", "block");
	
	// var p = this.container.offset();

	// if(this.snap == "bottom") {
		// if(p.top + this.container.outerHeight() > $("body").outerHeight()) {
			// var snap = "top";
			// this.snap = snap;
			// this.container.attr("dlg-snap", snap);
			// this.PositionAdjusted();
			// this.Reposition();
		// };
	// };	
	
	// if(this.snap == "top" || this.snap == "bottom") {
		// if(p.left + this.container.outerWidth() > $("body").outerWidth()) {
	// };
};

PopupBasePainter.prototype.Hide = function() {
	this.container.remove();
};

PopupBasePainter.prototype.InitializeDialog = function() {		
	this.RenderSection("container", this.container);
		
	var container = CreateElement("div", this.container)
		.attr("dlg-sec", "container")	
		
	if(this.showHeader) {
		var header = CreateElement("div", container)
			.attr("dlg-sec", "header")		
			
		this.RenderSection("header", header);
	};
	
	var content = CreateElement("div", container)
		.attr("dlg-sec", "content")
		
	this.RenderSection("content", content);
		
	if(this.showFooter) {
		// var footer = CreateElement("div", container)
		var footer = CreateElement("div", content)
			.attr("dlg-sec", "footer")
			
		this.RenderSection("footer", footer);
	};
};

PopupBasePainter.prototype.AfterInitializeDialog = function() {		
	this.container.addClass(this.css);
};

//**************************************************************************************************
// SimpleDialogPainter
//**************************************************************************************************
Class.Inherits(SimpleDialogPainter, PopupBasePainter);
function SimpleDialogPainter(Control) {
    SimpleDialogPainter.prototype.parent.call(this, Control);
};

SimpleDialogPainter.prototype.classID = "SimpleDialogPainter";

SimpleDialogPainter.prototype.OnRenderHeader = function(container) {
	SimpleDialogPainter.prototype.parent.prototype.OnRenderHeader.call(this, container);
	container.parent().css("border-color", this.GetParam("color", ""))
	container.css("background", this.GetParam("color", ""))
};

SimpleDialogPainter.prototype.AfterInitializeDialog = function() {		
	SimpleDialogPainter.prototype.parent.prototype.AfterInitializeDialog.call(this);
	
	this.container.attr("dlg-type", "simple")
};

//**************************************************************************************************
// BasePopupBalloonPainter
//**************************************************************************************************
Class.Inherits(BasePopupBalloonPainter, PopupBasePainter);
function BasePopupBalloonPainter(Control) {
    BasePopupBalloonPainter.prototype.parent.call(this, Control);
};

BasePopupBalloonPainter.prototype.OnRenderContainer = function(container) {
	BasePopupBalloonPainter.prototype.parent.prototype.OnRenderContainer.call(this, container);
	
	this.arrowContainer = CreateElement("div", container).attr("dlg-sec", "arrow-container")
	var innerContainer = CreateElement("div", this.arrowContainer).attr("dlg-sec", "arrow")
	this.arrow = CreateElement("div", innerContainer).attr("dlg-sec", "shape")				
					.css("border-"+this.snap+"-color", this.GetParam("color", ""))
};

BasePopupBalloonPainter.prototype.AfterInitializeDialog = function() {		
	BasePopupBalloonPainter.prototype.parent.prototype.AfterInitializeDialog.call(this);
	
	this.container.attr("dlg-type", "balloon")

	if(this.snap == "top") {
		this.arrowContainer.appendTo(this.container);
	};
		
	if(this.snap == "right") {
		// this.arrowContainer.prependTo(this.container);
		var margin = 0;
		if(this.align == "")
			margin = (this.container.outerHeight() - 20)/2+1
		else if(this.align == "bottom") 
			margin = (this.container.outerHeight() - 20)
		
		this.arrowContainer.css("margin-top", margin);
	};
		
	if(this.snap == "left") {
		var margin = 0;
		if(this.align == "")
			margin = (this.container.outerHeight() - 20)/2+1
		else if(this.align == "bottom") 
			margin = (this.container.outerHeight() - 20)
		
		this.arrowContainer.css("margin-top", margin);
		this.arrowContainer.appendTo(this.container);
	};
};

BasePopupBalloonPainter.prototype.SnapAdjusted = function(oldSnap) {
	BasePopupBalloonPainter.prototype.parent.prototype.SnapAdjusted.call(oldSnap);
	
	this.arrow.css("border-"+this.snap+"-color", this.GetParam("color", ""));
	if(oldSnap == "bottom" && this.snap == "top") {
		this.arrowContainer.appendTo(this.container);
	};
};

BasePopupBalloonPainter.prototype.AdjustX = function(x0, x1) {
	BasePopupBalloonPainter.prototype.parent.prototype.AdjustX.call(x0, x1);

	var dim = {
		x: this.arrow[0].getBoundingClientRect().left,
		y: this.arrow[0].getBoundingClientRect().top,
		w: this.arrow.outerWidth(),
		h: this.arrow.outerHeight()
	};
			
	this.arrow.css("margin", "initial");
	this.arrow.css("position", "relative");
	this.arrow.css("left", (this.container.outerWidth() - dim.w) / 2 + x0;
};

//**************************************************************************************************
// PopupBalloonPainter
//**************************************************************************************************
Class.Inherits(PopupBalloonPainter, BasePopupBalloonPainter);
function PopupBalloonPainter(Control) {
    PopupBalloonPainter.prototype.parent.call(this, Control);
};

PopupBalloonPainter.prototype.classID = "PopupBalloonPainter";

PopupBalloonPainter.prototype.OnRenderHeader = function(container) {
	PopupBalloonPainter.prototype.parent.prototype.OnRenderHeader.call(this, container);
	container.parent().css("border-color", this.GetParam("color", ""))
	container.css("background", this.GetParam("color", ""))
};

//**************************************************************************************************
// PopupHintPainter
//**************************************************************************************************
Class.Inherits(PopupHintPainter, BasePopupBalloonPainter);
function PopupHintPainter(Control) {
    PopupHintPainter.prototype.parent.call(this, Control);
	
};

PopupHintPainter.prototype.classID = "PopupHintPainter";

PopupHintPainter.prototype.Paint = function() {
	this.Control.PaintParams.showHeader = false;
	this.Control.PaintParams.showFooter = false;
    PopupHintPainter.prototype.parent.prototype.Paint.call(this);
};

PopupHintPainter.prototype.OnRenderContent = function(container) {
	PopupHintPainter.prototype.parent.prototype.OnRenderContent.call(this, container);
	container.parent().css("border-color", this.GetParam("color", ""))
	// container.parent().css("border-width", "0")
	// container.parent().css("border-color", "none")
	container.css("background", this.GetParam("color", ""))
};

PopupHintPainter.prototype.AfterInitializeDialog = function() {		
	PopupHintPainter.prototype.parent.prototype.AfterInitializeDialog.call(this);
	this.container.attr("hint", "1")
}	

//**************************************************************************************************
// PopupOverlayPainter
//**************************************************************************************************
Class.Inherits(PopupOverlayPainter, PopupBasePainter);
function PopupOverlayPainter(Control) {
    PopupOverlayPainter.prototype.parent.call(this, Control);
};

PopupOverlayPainter.prototype.classID = "PopupOverlayPainter";
PopupOverlayPainter.prototype.canCustomizeHeader = false;

PopupOverlayPainter.prototype.Paint = function() {
	this.Control.PaintParams.inset = true;
	// this.Control.PaintParams.showHeader = false;
	// this.Control.PaintParams.showFooter = false;
	// this.canCustomizeHeader = false;
    PopupOverlayPainter.prototype.parent.prototype.Paint.call(this);
};

PopupOverlayPainter.prototype.OnRenderContainer = function(container) {
	PopupOverlayPainter.prototype.parent.prototype.OnRenderContainer.call(this, container);

	this.colorColor = this.GetParam("color", "");
	if(this.Control.target && this.Control.target.data("object")) {
		this.btn = this.Control.target.data("object");
		// this.colorColor = this.btn.iconColor;
	};	
	
	// container.css("background", this.GetParam("color", ""))
	// this.arrowContainer = CreateElement("div", container).attr("dlg-sec", "arrow-container")
	// var innerContainer = CreateElement("div", this.arrowContainer).attr("dlg-sec", "arrow")
	// var arrow = CreateElement("div", innerContainer).attr("dlg-sec", "shape")		
		
	// arrow.css("border-"+this.snap+"-color", this.GetParam("color", ""))
};

PopupOverlayPainter.prototype.OnRenderContent = function(container) {
	PopupOverlayPainter.prototype.parent.prototype.OnRenderContent.call(this, container);
	
	// container.css("border-color", this.GetParam("color", ""));
	container
		.css("border-color", this.colorColor)
		.css("border-width", 2)
	// if(this.showFooter) {
		// container.css("border-bottom-style", "none");
	// };
	// this.arrowContainer = CreateElement("div", container).attr("dlg-sec", "arrow-container")
	// var innerContainer = CreateElement("div", this.arrowContainer).attr("dlg-sec", "arrow")
	// var arrow = CreateElement("div", innerContainer).attr("dlg-sec", "shape")		
		
	// arrow.css("border-"+this.snap+"-color", this.GetParam("color", ""))
};

PopupOverlayPainter.prototype.OnRenderHeader = function(container) {
	PopupOverlayPainter.prototype.parent.prototype.OnRenderHeader.call(this, container);
	
	// var color = this.GetParam("color", "");
	// var btn, icon;
	// if(this.Control.target && this.Control.target.data("object") && this.Control.target.data("object").icon) {
	// if(this.btn && this.btn.icon) {
		// btn = this.Control.target.data("object");
		// color = btn.iconColor;
	// };
	
	container
		// .css("border-color", this.GetParam("color", ""))
		.css("border-width", 2)
		.css("border-color", this.colorColor)
		.css("height", this.targetH+1)
		
	this.tabContainer = CreateElement("div", container)
		.attr("dlg-sec", "tab-container")
		.attr("dlg-sec", "tab-container")
		// .css("border-color", this.GetParam("color", ""))
		.css("border-color", this.colorColor)
		.css("width", this.targetW)
		
	if(this.btn && this.btn.icon) {
		// var btn = this.Control.target.data("object");
		// var icon = this.btn.icon;
		
		if(this.btn.icon.indexOf(".png") > -1)
			CreateElement("img", this.tabContainer)
				.attr("src", this.btn.icon)
		else {
			this.tabContainer.css("background", this.colorColor)
			desktop.GetSvg(this.tabContainer, this.btn.icon, defaultValue(this.btn.size, 28), {noTopMargin:true})
				.css("margin", "auto")
				.css("fill", "white")
		};
			
		if(this.Control.target.data("object").dropdown) {
			var d = CreateElement("div", this.tabContainer, "", "")		
				.attr("dlg-sec", "dropdown")
				
			desktop.GetSvg(d, "tree-collapse", 16, {noTopMargin:true})
			// desktop.GetSvg(d, "tree-expand", 16, {noTopMargin:true})
				.css("fill", "white")
		};
	};
};

PopupOverlayPainter.prototype.OnRenderFooter = function(container) {
	PopupOverlayPainter.prototype.parent.prototype.OnRenderFooter.call(this, container);
	container.css("border-color", this.GetParam("color", ""))
}

PopupOverlayPainter.prototype.AfterInitializeDialog = function() {		
	PopupOverlayPainter.prototype.parent.prototype.AfterInitializeDialog.call(this);
	
	this.container.attr("dlg-type", "overlay")

	if(this.snap == "bottom") {
		// if(this.align == "left")
	};
	// if(this.snap == "top") {
		// this.arrowContainer.appendTo(this.container);
	// };
		
	// if(this.snap == "right") {
		// var margin = 0;
		// if(this.align == "")
			// margin = (this.container.outerHeight() - 20)/2+1
		// else if(this.align == "bottom") 
			// margin = (this.container.outerHeight() - 20)
		
		// this.arrowContainer.css("margin-top", margin);
	// };
		
	// if(this.snap == "left") {
		// var margin = 0;
		// if(this.align == "")
			// margin = (this.container.outerHeight() - 20)/2+1
		// else if(this.align == "bottom") 
			// margin = (this.container.outerHeight() - 20)
		
		// this.arrowContainer.css("margin-top", margin);
		// this.arrowContainer.appendTo(this.container);
	// };
};

//**************************************************************************************************
// EditDialogPainter
//**************************************************************************************************
/*
Class.Inherits(EditDialogPainter, PopupBasePainter);
function EditDialogPainter(Control) {
    EditDialogPainter.prototype.parent.call(this, Control);
};

EditDialogPainter.prototype.CalculatePosition = function() {
	// display dialog box in the center of the target container
	return {
		top: this.targetY + (this.targetH - this.container.outerHeight()) / 2 + 1, 
		left: this.targetX + (this.targetW - this.container.outerWidth()) / 2 + 1
	};
};

EditDialogPainter.prototype.OnRenderContent = function(container) {
	EditDialogPainter.prototype.parent.prototype.OnRenderContent.call(this, container);	
	this.editContainer = CreateElement("div", container).attr("dlg-sec", "edit-container");
	if(this.GetParam("autoHeight", false)) {
		this.editContainer.css("height", "auto");
	};
};

EditDialogPainter.prototype.AfterPaint = function() {
	var dialog = this.Control;
	dialog.pg = new JPageControl({
		owner: dialog,
		container: this.editContainer,
		Painter: {
			// indent: 0,
			// spacing: 1,
			// margin: 4,
			// gutter: 20,
			autoHeight: this.GetParam("autoHeight", false),
			theme: "table"
		},
		init: function(pg) {
			pg.dialog = dialog;
			pg.Events.OnInitPageControl.add(function(pg) {
				pg.dialog.InitializePageControl(pg);
			});
		}
	});
};

EditDialogPainter.prototype.OnRenderFooter = function(container) {
};

EditDialogPainter.prototype.OnRenderFooter = function(container) {
	EditDialogPainter.prototype.parent.prototype.OnRenderFooter.call(this, container);
	
	var self = this;
	
	this.btnSave = CreateButton({
		container: container,
		caption: "Save",
		enabled: false,
		style: "green",
		click: function(button) {
			if(button.enabled)
				self.Control.Save();
			// self.Control.Hide();
		}
	});
	
	this.btnReset = CreateButton({
		container: container,
		caption: "Reset",
		enabled: false,
		style: "green",
		click: function(button) {
			if(button.enabled)
				self.Control.Reset();
			// self.Control.dateEdit.cancel();
		}
	});
	
	CreateButton({
		container: container,
		caption: "Close",
		enabled: true,
		style: "text",
		click: function(button) {
			self.Control.Hide();
		}
	});
};

EditDialogPainter.prototype.DataChanged = function(dataset) {
	this.btnSave.SetEnabled(dataset.editing);
	this.btnReset.SetEnabled(dataset.editing);
	// this.btnSave.SetEnabled(true);
};

EditDialogPainter.prototype.AfterInitializeDialog = function() {		
	EditDialogPainter.prototype.parent.prototype.AfterInitializeDialog.call(this);
	this.container.attr("dlg-type", "edit")
};
*/
//**************************************************************************************************
// EditDialogPainter2
//**************************************************************************************************
Class.Inherits(EditDialogPainter2, PopupBasePainter);
function EditDialogPainter2(Control) {
    EditDialogPainter2.prototype.parent.call(this, Control);
};

EditDialogPainter2.prototype.CalculatePosition = function() {
	// console.log(this)
	// console.log(this.Control.ActivatingTarget)
	// console.log(this.Control.ActivatingTarget.outerHeight())
	// console.log(this.Control.ActivatingTarget)
	// display dialog box in the center of the target container
	return {
		top: this.targetY + (this.targetH - this.container.outerHeight()) / 2 + 1, 
		left: this.targetX + (this.targetW - this.container.outerWidth()) / 2 + 1
	};
	
	var target = this.Control.ActivatingTarget;
	var p = target[0].getBoundingClientRect();
	return {
		// top: this.targetY + (this.targetH - this.container.outerHeight()) / 2 + 1, 
		top: p.top + target.outerHeight(), 
		// left: this.targetX + (this.targetW - this.container.outerWidth()) / 2 + 1
		// left: this.targetX+1
		left: p.left + target.outerWidth()
	};
};

EditDialogPainter2.prototype.OnRenderContent = function(container) {
	EditDialogPainter2.prototype.parent.prototype.OnRenderContent.call(this, container);	
	this.editContainer = CreateElement("div", container).attr("dlg-sec", "edit-container");
	if(this.GetParam("autoHeight", false)) {
		this.editContainer.css("height", "auto");
	};
};

EditDialogPainter2.prototype.AfterPaint = function() {
	var dialog = this.Control;
	// alerts("here")
};

// EditDialogPainter2.prototype.OnRenderFooter = function(container) {
// };

EditDialogPainter2.prototype.OnRenderFooter = function(container) {
	EditDialogPainter2.prototype.parent.prototype.OnRenderFooter.call(this, container);
	
	var self = this;
	this.btnSave = CreateButton({
		container: container,
		caption: "Save",
		enabled: false,
		style: "green",
		click: function(button) {
			if(button.enabled)
				self.Control.Save();
		}
	});
	
	this.btnReset = CreateButton({
		container: container,
		caption: "Reset",
		enabled: false,
		style: "green",
		click: function(button) {
			if(button.enabled)
				self.Control.Reset();
		}
	});
	
	CreateButton({
		container: container,
		caption: "Close",
		enabled: true,
		style: "text",
		click: function(button) {
			self.Control.Hide();
		}
	});
};

EditDialogPainter2.prototype.DataChanged = function(dataset) {
	// this.btnSave.SetEnabled(dataset.editing);
	// this.btnReset.SetEnabled(dataset.editing);
};

EditDialogPainter2.prototype.AfterInitializeDialog = function() {		
	EditDialogPainter2.prototype.parent.prototype.AfterInitializeDialog.call(this);
	this.container.attr("dlg-type", "edit");
	// this.container.css("opacity", "0");
	this.container.addClass("hide-dialog");
};
