// ****************************************************************************************************
// File name: form-simple.js
// Last modified on
// 21-AUG-2016
// ****************************************************************************************************
//==================================================================================================
// FormSimple
//==================================================================================================
Class.Inherits(FormSimple, JControl);
function FormSimple(params) {
	FormSimple.prototype.parent.call(this, params); 
	// console.log(this.classID)
};

FormSimple.prototype.classID = "FormSimple";

FormSimple.prototype.DefaultPainter = function() {
    return new FormSimplePainter(this);
};

FormSimple.prototype.Refresh = function() {
	// this.GetData("edit", function(result) {
		// result.caller.editData.resetData(result.edit, "", true);
	// });
};

FormSimple.prototype.Initialize = function(params) {
	FormSimple.prototype.parent.prototype.Initialize.call(this, params);
	this.id = params.id;
	// this.url = params.url.split("?")[1];
	this.dataset = params.dataset;
	this.postBack = params.postBack;
	// this.postBackParams = params.url.split("?")[1];
	this.dialog = params.dialog;
	this.container = params.container;
	// this.labelWidth = defaultValue(params.labelWidth, 0);
	this.containerPadding = defaultValue(params.containerPadding, 0);
	// this.pageControlTheme = defaultValue(params.pageControlTheme, "data-entry");
	this.editorTheme = defaultValue(params.editorTheme, "default");
	this.fillContainer = defaultValue(params.fillContainer, false);
	this.showToolbar = defaultValue(params.showToolbar, true);
	
	this.Events = {};
	this.Events.OnInitData = new EventHandler(this);
	this.Events.OnInitToolbar = new EventHandler(this);
	this.Events.OnInitContent = new EventHandler(this);
	this.Events.OnPost = new EventHandler(this);
	this.Events.OnPostError = new EventHandler(this);
	this.Events.OnPostSuccess = new EventHandler(this);
	this.Events.OnPost.add(function(editor) {
		editor.dataset.post(function(dataset, msg, error) {
			if(error < 0) {
				var title = "Error";
				if(typeof msg == "string") {
					if(error == 1)
						title = "Incomplete information"
				} else {
					title = msg.title;
					msg = msg.message;
				};
				
				editor.Events.OnPostError.trigger({title:title, msg:msg});
			} else {
				editor.Events.OnPostSuccess.trigger(error ? msg.message: ""); /* pass error so we can evaluate it accordingly */
			};
		});	
	});

	if(!this.dialog)	
		this.Events.OnPostSuccess.add(function(editor, info) {
			if(info)
				InfoDialog({
					target: editor.toolbar.Element(),
					title: "Information",
					message: info,
					snap: "bottom",
					inset: false
				});
		});
	
	this.Events.OnPostError.add(function(dialog, error) {
		ErrorDialog({
			target: dialog.showToolbar ? dialog.toolbar.getItem("save").Element(): dialog.container,
			title: error.title,
			message: error.msg,
			snap: "bottom",
			inset: !dialog.showToolbar
		});
	});
	
	params.init(this);
	
	var self = this;
	if(this.dataset) {
		self.Events.OnInitData.trigger(self.dataset);
	} else {
		this.GetData("edit", function(params) {
				// params.qry = self.dataParams.stringifyRec(0);
			},
			function(data) {
				self.Events.OnInitData.trigger(self.dataset = new Dataset(data.edit, "Data"));
				self.Paint();
				self.AfterPaint();  
				if(self.dialog) {
					self.dialog.Painter.Reposition();
					self.dialog.SetEditor(self);
				};
				
				self.dataset.Events.OnPost.add(function(dataset, postCallback) {
					self.GetData("update", function(params) {
						params.mode = data.mode;
						params.data = dataset.stringifyRec(0);
					}, function(result) {
						var msg;
						if(result.status != 0) {
							msg = {};
							msg.title = "Update error";
							msg.message = result.message;
						} else {
							msg = "";
							// self.Refresh();
						};
						
						postCallback(msg, result.status);
					});
				})
				
			}
		);
		
		params.DelayPainting = true;
	};
	
};

FormSimple.prototype.GetData = function(mode, init, callback) {	
	var params = {};
	if(this.postBackParams) {
		var p = this.postBackParams.split("&");
		$(p).each(function(i, s) {
			var p = s.split("=");
			params[p[0]] = p[1];
		});
	};
	
	if(init) init(params);
	
	desktop.Ajax(this, ("/get/{0}/{1}").format(defaultValue(mode, "edit"), this.postBack), params, callback);
};

FormSimple.prototype.InitializeToolbar = function(toolbar) {
	var self = this;
	this.toolbar = toolbar;
	
	toolbar.NewItem({
		id: "refresh",
		// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
		icon: "refresh",
		iconColor: "#8DCF6E",
		hint: "Refresh",
		dataBind: this.dataset,
		dataEvent: function(dataset, button) {
			button.show(!dataset.editing);
		},
		click: function(item) {
			// grid.Refresh();
		}
	});
	
	toolbar.NewItem({
		id: "cancel",
		// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
		icon: "db-cancel",
		// iconColor: "#8DCF6E",
		iconColor: "firebrick",
		hint: "Cancel edit",
		dataBind: this.dataset,
		dataEvent: function(dataset, button) {
			button.show(dataset.editing);
		},
		click: function(item) {
			item.dataBind.cancel();
		}
	});
	
	toolbar.NewItem({
		id: "save",
		// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
		icon: "db-save",
		iconColor: "#1CA8DD",
		hint: "Save",
		dataBind: this.dataset,
		dataEvent: function(dataset, button) {
			button.show(dataset.editing);
		},
		click: function(item) {
			self.Events.OnPost.trigger();
		}
	});
	
	this.Events.OnInitToolbar.trigger(toolbar);
};

FormSimple.prototype.InitializeContent = function(container) {
	// this.Events.OnInitContent.trigger(content);
	this.Events.OnInitContent.trigger(container);
};

FormSimple.prototype.AfterPaint = function() {
	FormSimple.prototype.parent.prototype.AfterPaint.call(this); 
	// if(this.Painter.pageControl.TabCount() == 1) {
		// this.Painter.pageControl.ShowTabs(false);
	// };
};

//**************************************************************************************************
// FormSimplePainter
//**************************************************************************************************
Class.Inherits(FormSimplePainter, JControlPainter);
function FormSimplePainter(Control) {
	FormSimplePainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

FormSimplePainter.prototype.classID = "FormSimplePainter";
FormSimplePainter.prototype.type = "form-simple";

FormSimplePainter.prototype.InitializeToolbar = function(toolbar) {
	this.Control.InitializeToolbar(toolbar);
};

FormSimplePainter.prototype.Paint = function() {
	FormSimplePainter.prototype.parent.prototype.Paint.call(this); 
	var container = CreateElement("div", this.Control.container)
		.addClass("form-edit")
		// .addClass("form-simple")
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
	
	var subContainer = CreateElement("div", container)
		.attr("x-sec", "sub-container");

	if(this.Control.showToolbar) {
		toolbar.SetVisible("cancel", false);
		toolbar.SetVisible("save", false);
	};
	
	// var content = CreateElement("div", container)
	// this.SetContainer(content);
	this.SetContainer(subContainer);
	
	this.Control.InitializeContent(subContainer);
};
