//**************************************************************************************************
// BaseFormPainter
//**************************************************************************************************
Class.Inherits(BaseFormPainter, JControlPainter);
function BaseFormPainter(Control) {
	BaseFormPainter.prototype.parent.call(this, Control);
	this.Page = Control;
};

BaseFormPainter.prototype.type = "form";
BaseFormPainter.prototype.classID = "SubFormPainter";

BaseFormPainter.prototype.Paint = function() {
	BaseFormPainter.prototype.parent.prototype.Paint.call(this); 

	var container = CreateElement("div", this.Control.container, "", "sub-page-inner-container")
		.attr("form-id", this.Control.id)

	this.header = CreateElement("div", container, "", "sub-page-header")
	this.content = CreateElement("div", container, "", "sub-page-content")
	this.footer = CreateElement("div", container, "", "sub-page-footer");
	
	// test if there is no header
	if(!this.Control.showHeader) {
		this.header.css("display", "none");
		// this.content.css("top", 0).css("height", "100%");
	};
	
	// test if there is a footer
	// if(!this.footer.height()) {
		// this.footer.css("display", "none");
	// };
	
	this.SetContainer(container);
};

//**************************************************************************************************
// SubFormPainter
//**************************************************************************************************
Class.Inherits(SubFormPainter, BaseFormPainter);
function SubFormPainter(Control) {
	SubFormPainter.prototype.parent.call(this, Control);
};

SubFormPainter.prototype.type = "sub-form";
SubFormPainter.prototype.classID = "SubFormPainter";

SubFormPainter.prototype.Paint = function() {
	SubFormPainter.prototype.parent.prototype.Paint.call(this); 
};

SubFormPainter.prototype.createToolbar = function() {
	var toolbar = new JToolbar({
		id: "tb",
		container: this.header,
		css: "toolbar"
	});
	
	return toolbar;
};

//**************************************************************************************************
// SubEditPainter
//**************************************************************************************************
Class.Inherits(SubEditPainter, SubFormPainter);
function SubEditPainter(Control) {
	SubEditPainter.prototype.parent.call(this, Control);
};

SubEditPainter.prototype.type = "sub-form";
SubEditPainter.prototype.classID = "SubEditPainter";

// SubEditPainter.prototype.Paint = function() {
	// SubEditPainter.prototype.parent.prototype.Paint.call(this); 
// };
SubEditPainter.prototype.InitializeEditor = function(pg) {
	var self = this;
	// alerts(pg.classID);
	var editorInit = {
		PageControl: pg,
		// NewEdit: function(caption, callback) {
		NewGroupEdit: function(caption, callback) {
			pg.NewTab(caption, {
				OnCreate: function(tab) {
					tab.content.parent().css("padding", 10);
					var container = CreateElement("div", tab.content).addClass("editor-tab-container-full")
						
					var editor = new JEditor({
						ID: "edit_" + tab.id,
						Container: container,
						Css: "editor"
					});	          
					
					editor.Dataset = self.Control.editData;
					
					callback(editor, tab);
					
					editor.Paint();
					editor.AfterPaint();
					editor.Dataset.updateControls();
				}
			});
		},
		NewContainer: function(caption, callback) {
			pg.NewTab(caption, {
				OnCreate: function(tab) {
					callback(CreateElement("div", tab.content).css("width", "100%"), tab);
				}
			});
		}
	};
	
	this.Control.InitializeEditor(editorInit);
	// this.Events.OnInitEditor.trigger(editorInit);
};

SubEditPainter.prototype.createEditor = function() {
	// var self = this;
	var pg = new JPageControl({
		owner: this.Control,
		container: this.content,
		Painter: {
			// indent: 0,
			// spacing: 1,
			// margin: 4,
			// gutter: 20,
			autoHeight: false,
			theme: "main"
		},
		init: function(pg) {
			pg.owner.Painter.InitializeEditor(pg);
		}
	});
	
	// return editor;
};

//**************************************************************************************************
// SubTablePainter
//**************************************************************************************************
// Class.Inherits(SubTablePainter, SubFormPainter);
// function SubTablePainter(Control) {
	// SubTablePainter.prototype.parent.call(this, Control);
// };

// SubTablePainter.prototype.type = "sub-form-table";
// SubTablePainter.prototype.classID = "SubTablePainter";

// SubTablePainter.prototype.Paint = function() {
	// SubTablePainter.prototype.parent.prototype.Paint.call(this); 
// };

// SubTablePainter.prototype.createGrid = function() {
	// var grid = new JDBGrid({
			// id: "grid",
			// container: this.content,
			// css: "grid",
			// init: function(grid) {
				// alerts("init");
			// }
	// });
	
	// return grid;
// };
