// *************************************************************************************************
// File name: dbeditor-painter.js
// Last modified on
// 06-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// EditorPainter
//**************************************************************************************************
Class.Inherits(EditorPainter, JControlPainter);
function EditorPainter(Control) {
    EditorPainter.prototype.parent.call(this, Control);
    this.Editor = Control;
};

EditorPainter.prototype.type = "editor";
EditorPainter.prototype.classID = "EditorPainter";

EditorPainter.prototype.Paint = function() {
    EditorPainter.prototype.parent.prototype.Paint.call(this);
	
	var container = CreateElement("div", this.Control.container, "", "editor edit-theme-"+"default");
	this.editorTable = CreateElement("table", container)
		.attr("edit-sec", "table")
		.attr("border", 0)
		.attr("cellspacing", 0)
		.attr("cellpadding", 0)
		
	this.InitTableHeader(this.editorTable);
	
	this.editorData = CreateElement("tbody", this.editorTable);
		
	var self = this;
	this.Control.EachItem(function(i, item) {		
		item.Paint(self.editorData);
		item.AfterPaint();
	});
	
	this.SetContainer(container);
	
	var getSizerPosition = function() {
		var pos = 0;
		container.find("th").each(function() {
			var e = $(this);
			if(e.attr("edit-sec") !== "data" && e.attr("edit-sec") !== "required" && e.attr("edit-sec") !== "sizer") {
				pos += e.width()
			}
		});
		
		return pos - 1;
	};
	
	// var leftPos = 0;
	// var leftOffset = -1, labelWidth = 0, xleft = 0;
	// var label = container.find("th[edit-sec='label']");
	var sizer = CreateElement("div", container)
		.attr("edit-sec", "sizer")
		.css("left", getSizerPosition())
	
	var dragObject = new JSimpleDrag({
		Node: sizer,
		// Target: label,
		// Moving: true,
		// Sizing: false,
		// SizeOffset: 1,
		Init: function(s) {
			s.sizing = {};
			s.sizing.leftPos = 0;
			s.sizing.leftOffset = -1;
			s.sizing.labelWidth = 0;
			s.sizing.label = container.find("th[edit-sec='label']");
			s.sizing.sizer = sizer;
		},
		// AllowDrag: function(s) {
			// return true;
		// },
		// AllowSize: function(s) {
			// return false;
		// },
		InitDrag: function(s) {
			s.sizing.labelWidth = s.sizing.label.width();
			s.sizing.leftPos = getSizerPosition();
		},
		Dragging: function(s, x, y) {
			if(s.sizing.leftOffset < 0) s.sizing.leftOffset = x;
			
			// s.sizing.label.css("width", s.sizing.labelWidth+(x-s.sizing.leftOffset));
			// s.sizing.label.css("min-width", s.sizing.labelWidth+(x-s.sizing.leftOffset));
			// s.sizing.sizer.css("left", s.sizing.leftPos+(x-s.sizing.leftOffset));
			s.sizing.label.css("width", s.sizing.labelWidth+x);
			s.sizing.label.css("min-width", s.sizing.labelWidth+x);
			s.sizing.sizer.css("left", s.sizing.leftPos+x);
		},
		DragEnd: function(s) {
			s.sizing.leftOffset = -1;
		}
	});
	
	
};

EditorPainter.prototype.InitTableHeader = function(container) {
	var head = CreateElement("thead", container).attr("edit-sec", "header");
	var tr = CreateElement("tr", head);
	if(this.Control.PaintParams.showCategory) {
		CreateElement("th", tr).attr("cat-sec", "gutter");
	};
	var label = CreateElement("th", tr).attr("edit-sec", "label");//.css("width", 125);
	CreateElement("th", tr).attr("edit-sec", "button");
	CreateElement("th", tr).attr("edit-sec", "sizer");
	// CreateElement("th", tr).attr("edit-sec", "required");
	CreateElement("th", tr).attr("edit-sec", "data");
	
	// console.log(this.Control.Params)
	if(this.Control.PaintParams.labelWidth)
		label.css("width", this.Control.PaintParams.labelWidth);
};

EditorPainter.prototype.PaintEditors = function() {
};

//**************************************************************************************************
// EditCategoryPainter
//**************************************************************************************************
// Class.Inherits(EditCategoryPainter, BaseEditItemPainter);
Class.Inherits(EditCategoryPainter, JControlPainter);
function EditCategoryPainter(Control) {
    EditCategoryPainter.prototype.parent.call(this, Control);
};

// EditCategoryPainter.prototype.type = "edit";
EditCategoryPainter.prototype.classID = "EditCategoryPainter";

EditCategoryPainter.prototype.Paint = function() {
    EditCategoryPainter.prototype.parent.prototype.Paint.call(this);
	
	var category = this.Control;
	var container = CreateElement("tr", category.container)
		.attr("cat-state", "open")
		.attr("cat-sec", "category")

	this.button = CreateElement("td", container).attr("cat-sec", "button")
		.data("category", this.Control)
		.click(function() {
			var state = $(this).parent().attr("cat-state") == "open" ? "close" : "open";
			
			$(this).data("category").SetVisible(state == "open");
			$(this).parent().attr("cat-state", state);
			
			$(this).html("");
			if(state == "open") 
				desktop.GetSvg($(this), "tree-expand")
			else
				desktop.GetSvg($(this), "tree-collapse");
		});
	
	desktop.GetSvg(this.button, "tree-expand");
		
	this.label = CreateElement("td", container).attr("cat-sec", "label")
		.attr("colspan", 4)
		// .attr("colspan", 5)
		.html(category.GetCaption());
		
	// if(this.GetParam("showButton", false)) {
		// var self = this;
		// this.button = CreateElement("td", container).attr("edit-sec", "button")
			// .click(function() {
				// self.ButtonClick($(this));
			// });
		// CreateElement("img", this.button).attr("src", this.GetButtonImage());
	// } else
		// this.label.attr("colspan", 2);
	
	// this.data = CreateElement("td", container).attr("edit-sec", "data");
	// this.CreateEditControl(this.data);

	this.SetContainer(container);
};
/*
//**************************************************************************************************
// EditContainerPainter
//**************************************************************************************************
Class.Inherits(EditContainerPainter, BaseEditItemPainter);
function EditContainerPainter(Control) {
    EditContainerPainter.prototype.parent.call(this, Control);
};

EditContainerPainter.prototype.classID = "EditContainerPainter";
// EditContainerPainter.prototype.buttonImage = "/engine/images/drop-down.png";
EditContainerPainter.prototype.buttonImage = "drop-down";

EditContainerPainter.prototype.PaintRow = function(edit, container) {
	this.button = CreateElement("td", container).attr("edit-sec", "button").attr("button-type", "drop-down")
		.data("self", this)
		.click(function() {
			$(this).data("self").ShowContainerDialog();
		});
		
	// CreateElement("img", this.button).attr("src", this.buttonImage);
	desktop.GetSvg(this.button, this.buttonImage)

	if(edit.Required()) 
		desktop.GetSvg(CreateElement("td", container).attr("edit-sec", "required"), "star")
	else
		CreateElement("td", container).attr("edit-sec", "required");

	this.data = CreateElement("td", container).attr("edit-sec", "data");
	this.CreateEditControl(this.data);
};

EditContainerPainter.prototype.ShowContainerDialog = function() {
	// alerts("OK"); return;
	var self = this;
	this.edit.select();
	var dialog = new JPopupDialog({
		// Target: cell,
		Target: this.edit.parent(),
		Modal: false,
		Painter: {
			// painterClass: PopupBasePainter,
			painterClass: SimpleDialogPainter,
			color: this.GetParam("color", "dimgray"),
			snap: "bottom",
			// snap: "right",
			// snap: "top",
			align: "left",
			inset: false,
			// inset: true,
			width: this.GetParam("width", this.edit.parent().outerWidth()),
			OnRenderHeader: function(dialog, container) {
				container.remove();
			},
			OnRenderContent: function(dialog, container) {
				// container.parent().css("border", "1px solid silver");
				container.css("height", self.GetParam("height", 100));
				container.css("background", "white");
				self.GetParam("init")(dialog, container, self.Control);
			},
			OnRenderFooter: function(dialog, container) {
				container.remove();
			}
		}
	});
};
*/