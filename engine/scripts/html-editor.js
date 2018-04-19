// ****************************************************************************************************
// File name: html-editor.js
// Last modified on
// 21-AUG-2016
// ****************************************************************************************************
//==================================================================================================
// HtmlEditor
//==================================================================================================
Class.Inherits(HtmlEditor, JControl);
function HtmlEditor(params) {
	HtmlEditor.prototype.parent.call(this, params); 
	// console.log(this.classID)
};

HtmlEditor.prototype.classID = "HtmlEditor";

HtmlEditor.prototype.DefaultPainter = function() {
    return new HtmlEditorPainter(this);
};

HtmlEditor.prototype.Refresh = function() {
	// this.GetData("edit", function(result) {
		// result.caller.editData.resetData(result.edit, "", true);
	// });
};

HtmlEditor.prototype.Initialize = function(params) {
	HtmlEditor.prototype.parent.prototype.Initialize.call(this, params);
	this.id = params.id;
	this.textID = params.textID;
	// this.url = params.url.split("?")[1];
	this.dataset = params.dataset;
	this.postBack = params.postBack;
	// this.postBackParams = params.url.split("?")[1];
	// this.dialog = params.dialog;
	this.container = params.container;
	this.htmlContent = params.htmlContent;
	// this.labelWidth = defaultValue(params.labelWidth, 0);
	this.containerPadding = defaultValue(params.containerPadding, 0);
	// this.pageControlTheme = defaultValue(params.pageControlTheme, "data-entry");
	// this.editorTheme = defaultValue(params.editorTheme, "default");
	this.fillContainer = defaultValue(params.fillContainer, false);
	this.showToolbar = defaultValue(params.showToolbar, true);
	
	this.editing = false;
	
	this.Events = {};
	this.Events.OnInitToolbar = new EventHandler(this);
	this.Events.OnInitContent = new EventHandler(this);

	this.Events.OnUpdateButtons = new EventHandler(this);
	this.Events.OnUpdateButtons.add(function(editor) {
		editor.toolbar.SetVisible("cancel", editor.editing);
		editor.toolbar.SetVisible("save", editor.editing);
		editor.toolbar.SetVisible("edit", !editor.editing);
		editor.toolbar.SetVisible("refresh", !editor.editing);
	});
	
	this.Events.OnEdit = new EventHandler(this);
	this.Events.OnEdit.add(function(editor) {
		editor.editing = true;
		editor.Events.OnUpdateButtons.trigger();
	});
	
	this.Events.OnCancel = new EventHandler(this);
	this.Events.OnCancel.add(function(editor) {
		editor.editing = false;
		editor.Events.OnUpdateButtons.trigger();
	});
	
	this.Events.OnSave = new EventHandler(this);
	this.Events.OnSave.add(function(editor) {
		editor.editing = false;
		editor.Events.OnUpdateButtons.trigger();
	});
	
	params.init(this);
};

HtmlEditor.prototype.UpdateState = function() {
		console.log(document.activeElement);
		// console.log("UpdateState");
};

HtmlEditor.prototype.Edit = function() {
	// this.htmlContainer.on("click", function() {
		// $(this).data("editor").UpdateState();
	// });
	// this.htmlContainer.on("keydown", function() {
		// $(this).data("editor").UpdateState();
	// });
	// this.htmlContainer.attr("contentEditable", true);
	// this.htmlContainer.focus();
	// this.Events.OnEdit.trigger();

	// console.log(tinymce)
	// if(tinymce.EditorManager.editors.length) {
		// console.log("ok")
		// tinymce.EditorManager.editors = []; 
		// self.editor.remove();
		// self.target.attr("x-content-edit", "1");
	// };
	
	// this.htmlContainer.css("overflow", "hidden");
	// this.htmlContainer.css("padding", 0);
	// this.htmlContainer.css("height", "Calc(100% - 34px - 42px)");

	// this.quill = new Quill('#html-editor', {
		// theme: 'snow'
	  // });
	
	// console.log(this.quill.root.innerHTML);
	this.quill.editor.enable(true);
	this.Events.OnEdit.trigger();
	
	return;
	
	tinymce.EditorManager.editors = []; 
	// tinymce.init({ selector:'div[control-type="html-editor"]' });
	tinymce.init({ selector:'div[id="html-editor"]' });
	return;
	var self = this;
	
	if(tinymce.EditorManager.editors.length) {
		tinymce.EditorManager.editors = []; 
		this.editor.remove();
		this.target.attr("x-content-edit", "1");
	};	
	
	self.target = this.htmlContainer;
	if(self.target.attr("x-content-edit") == "0") return;
	self.target.attr("x-content-edit", "0");

	self.editor = $("<div>").attr("id", "mce-editor");
	var offset = self.target.offset();
	self.editor.css("top", offset.top - $(document).scrollTop());
	self.editor.css("left", offset.left);
	self.editor.css("width", self.target.outerWidth());
	
	var container = $("<div>").attr("x-mce", "content");
	var content = $("<div>").attr("id", "mce-content")
		.html(self.target.clone().html());
};

HtmlEditor.prototype.Cancel = function() {
	// this.htmlContainer.off("click");
	// this.htmlContainer.off("keydown");
	
	// this.htmlContainer.removeAttr("contentEditable");
	// console.log(this.quill)
	// console.log(this.quill.editor)
	// this.quill.destroy();
	// this.htmlContainer.attr("style", "");
	// this.htmlContainer.html(this.quill.root.innerHTML);
	// console.log(this.quill.getHTML());
	// console.log(this.quill);
	// console.log(this.quill.editor.getDelta());
	this.quill.root.innerHTML = this.htmlContent;
	this.quill.editor.enable(false);	
	this.Events.OnCancel.trigger();
};

HtmlEditor.prototype.Save = function() {
	// this.htmlContainer.removeAttr("contentEditable");
	// this.htmlContent = this.quill.root.innerHTML;
	desktop.Ajax(this, ("/get/{0}/{1}").format("update", "get-text"), 
		{
			text_id: this.textID,
			// html: this.Content()
			html: this.htmlContent = this.quill.root.innerHTML
		}, 
		function(result) {
			// HtmlEdit({
				// container: tab.content,
				// textID: params.requestParams.golf,
				// htmlContent: result.data[0].notes_html
			// });
		}
	);
	this.Events.OnSave.trigger();
};

HtmlEditor.prototype.Content = function() {
	return this.htmlContainer.html();
};

HtmlEditor.prototype.InitializeToolbar = function(toolbar) {
	var self = this;
	this.toolbar = toolbar;
	
	toolbar.NewItem({
		id: "refresh",
		icon: "refresh",
		iconColor: "#8DCF6E",
		hint: "Refresh",
		// dataBind: this.dataset,
		// dataEvent: function(dataset, button) {
			// button.show(!dataset.editing);
		// },
		click: function(item) {
			// grid.Refresh();
		}
	});
	
	toolbar.NewItem({
		id: "edit",
		icon: "pencil",
		iconColor: "#1CA8DD",
		hint: "Edit",
		// dataBind: this.dataset,
		// dataEvent: function(dataset, button) {
			// button.show(dataset.editing);
		// },
		click: function(item) {
			self.Edit();
		}
	});
	
	toolbar.NewItem({
		id: "save",
		icon: "db-save",
		iconColor: "#1CA8DD",
		hint: "Save",
		// dataBind: this.dataset,
		// dataEvent: function(dataset, button) {
			// button.show(dataset.editing);
		// },
		click: function(item) {
			self.Save();
		}
	});
	
	toolbar.NewItem({
		id: "cancel",
		icon: "db-cancel",
		iconColor: "firebrick",
		hint: "Cancel edit",
		// dataBind: this.dataset,
		// dataEvent: function(dataset, button) {
			// button.show(dataset.editing);
		// },
		click: function(item) {
			self.Cancel();
		}
	});
	
	this.Events.OnInitToolbar.trigger(toolbar);
};

HtmlEditor.prototype.InitializeContent = function(container) {
	// this.Events.OnInitContent.trigger(content);
	this.Events.OnInitContent.trigger(container);
	container.data("editor", this);
	container.attr("id", "html-editor");
	
	this.htmlContainer.css("overflow", "hidden");
	this.htmlContainer.css("padding", 0);
	this.htmlContainer.css("height", "Calc(100% - 34px - 42px)");

	this.quill = new Quill('#html-editor', {
		theme: 'snow'
	  });
	  
	this.htmlContent = this.quill.root.innerHTML;
	this.quill.editor.enable(false);
};

HtmlEditor.prototype.AfterPaint = function() {
	HtmlEditor.prototype.parent.prototype.AfterPaint.call(this); 
	// if(this.Painter.pageControl.TabCount() == 1) {
		// this.Painter.pageControl.ShowTabs(false);
	// };
};

//**************************************************************************************************
// HtmlEditorPainter
//**************************************************************************************************
Class.Inherits(HtmlEditorPainter, JControlPainter);
function HtmlEditorPainter(Control) {
	HtmlEditorPainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

HtmlEditorPainter.prototype.classID = "HtmlEditorPainter";
HtmlEditorPainter.prototype.type = "html-editor";

HtmlEditorPainter.prototype.InitializeToolbar = function(toolbar) {
	this.Control.InitializeToolbar(toolbar);
};

HtmlEditorPainter.prototype.Paint = function() {
	HtmlEditorPainter.prototype.parent.prototype.Paint.call(this); 
	var container = CreateElement("div", this.Control.container)
		.addClass("html-edit")
		.attr("x-sec", "main-container");
		
	if(this.Control.showToolbar) {
		var toolbarContainer = CreateElement("div", container)
			.attr("x-sec", "toolbar-container");

		var toolbar = new JToolbar({
				// id: "tb",
				// container: container,
				container: toolbarContainer,
				css: "toolbar",
				// theme: this.Control.options.toolbarTheme,
				theme: "svg",
				// buttonSize: this.Control.options.toolbarSize
				buttonSize: 24
		});
				
		this.InitializeToolbar(toolbar);
	};
	
	var subContainer = this.Control.htmlContainer = CreateElement("div", container)
		.attr("x-sec", "sub-container");

	if(this.Control.showToolbar) {
		toolbar.SetVisible("cancel", false);
		toolbar.SetVisible("save", false);
	};
	
	// var content = CreateElement("div", container)
	// this.SetContainer(content);
	subContainer.html(this.Control.htmlContent);
	this.SetContainer(subContainer);
	
	this.Control.InitializeContent(subContainer);
};
