//==================================================================================================
// JFormEditor
//==================================================================================================
Class.Inherits(JFormEditor, JControl);
function JFormEditor(params) {
	JFormEditor.prototype.parent.call(this, params);
	// console.log("JFormEditor")
};

JFormEditor.prototype.classID = "JFormEditor";

JFormEditor.prototype.DefaultPainter = function() {
    return new JFormEditPainter(this);
};

JFormEditor.prototype.Refresh = function() {
	// this.GetData("edit", function(result) {
		// result.caller.editData.resetData(result.edit, "", true);
	// });
};

JFormEditor.prototype.Initialize = function(params) {
	JFormEditor.prototype.parent.prototype.Initialize.call(this, params);
	// alerts("here...")
	this.id = params.id;
	this.mode = parseInt(this.id) == 0 || this.id == "" ? "new" : "edit";
	// console.log(this);
	// this.url = params.url.split("?")[1];
	this.dataset = params.dataset;
	this.mode = defaultValue(params.mode, "edit");
	this.postData = defaultValue(params.postData, true);
	this.postBack = params.postBack;
	this.postBackParams = params.url.split("?")[1];
	// console.log(this.postBack)
	// console.log(this.postBackParams)
	this.dialog = params.dialog;
	this.container = params.container;
	this.autoHeight = defaultValue(params.autoHeight, false);
	this.labelWidth = defaultValue(params.labelWidth, 0);
	this.containerPadding = defaultValue(params.containerPadding, 0);
	this.pageControlOptions = $.extend({
		theme: "default",
		iconSize: 24
	}, params.pageControlOptions);
	
	this.pageControlTheme = defaultValue(params.pageControlTheme, "data-entry");
	// this.pageControlTheme = defaultValue(params.pageControlTheme, "search");
	// this.pageControlTheme = defaultValue(params.pageControlTheme, "default");
	this.editorTheme = defaultValue(params.editorTheme, "default");
	this.fillContainer = defaultValue(params.fillContainer, false);
	this.showToolbar = defaultValue(params.showToolbar, false);
	
	this.Events = {};
	this.Events.OnInitData = new EventHandler(this);
	this.Events.OnInitToolbar = new EventHandler(this);
	this.Events.OnInitEditor = new EventHandler(this);
	this.Events.OnPost = new EventHandler(this);
	this.Events.OnPostError = new EventHandler(this);
	this.Events.OnPostSuccess = new EventHandler(this);
	this.Events.OnPostSuccess2 = new EventHandler(this);
	
	this.Events.OnPost.add(function(editor) {
		editor.dataset.post(function(dataset, msg, error) {
			// console.log({dataset:dataset, msg:msg, error:error})
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
				// console.log("here...")
				editor.Events.OnPostSuccess.trigger(error ? msg.message: ""); /* pass error so we can evaluate it accordingly */
				// editor.Events.OnPostSuccess2.trigger({msg: error ? msg.message: ""}); /* pass error so we can evaluate it accordingly */
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
			// target: dialog.showToolbar ? dialog.toolbar.Element(): dialog.container,
			target: dialog.showToolbar ? dialog.toolbar.getItem("save").Element(): dialog.container,
			title: error.title,
			message: error.msg,
			snap: "bottom",
			inset: !dialog.showToolbar
		});
	});
	
	params.init(this);
	
	var self = this;
	// if(this.dataset && this.postData) {
	if(this.dataset) {
		// self.mode = "edit";
		self.Events.OnInitData.trigger(self.dataset);
		if (self.postData) {
			self.dataset.Events.OnPost.add(function(dataset, postCallback) {	
				self.GetData("update", function(params) {
					// params.mode = data.mode;
					// params.mode = "edit";
					params.mode = self.mode;
					params.data = dataset.stringifyRec(0);
				}, function(result) {
					var msg;
					if(result.status != 0) {
						msg = {};
						msg.title = "Update error";
						msg.message = result.message;
					} else {
						msg = "";
						// self.Events.OnPostSuccess2.trigger(result.update);
						self.Events.OnPostSuccess2.trigger(result);
					};
					
					postCallback(msg, result.status);
				});
			})
		}
	} else {
		// console.log(this)
		// this.GetData("edit", function(params) {
		this.GetData(self.mode, function(params) {
				// params.qry = self.dataParams.stringifyRec(0);
			},
			function(data) {
				// console.log(data)
				self.mode = data.mode;
				self.Events.OnInitData.trigger(self.dataset = new Dataset(data.edit, "Data"));
				self.Paint();
				self.AfterPaint();  
				if(self.dialog) {
					self.dialog.Painter.Reposition();
					self.dialog.SetEditor(self);
					// console.log(self.dialog)
					// self.dialog.OnEditorLoaded.trigger();
					// self.dialog.EditorLoaded();
					// self.container.trigger("loaded")
				};
				
				// console.log(self.dataset)
				self.dataset.Events.OnPost.add(function(dataset, postCallback) {	
					// console.log("ok...")
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
							// self.Events.OnPostSuccess2.trigger(result.update);
							self.Events.OnPostSuccess2.trigger(result);
						};
						
						postCallback(msg, result.status);
					});
				})
				
			}
		);
		
		params.DelayPainting = true;
	};
	
};
	
// JFormEditor.prototype.Save = function() {
	
// };

JFormEditor.prototype.GetData = function(mode, init, callback) {	
	var params = {};
	if(this.postBackParams) {
		var p = this.postBackParams.split("&");
		$(p).each(function(i, s) {
			var p = s.split("=");
			params[p[0]] = p[1];
		});
	};
	
	if(init) init(params);
	
	var parts = this.postBack.split("/");
	// console.log(("{0}/get/{1}/{2}").format(parts[0], defaultValue(mode, "edit"), parts[1]));
	// console.log(mode)
	if(parts.length == 2)
		desktop.Ajax(this, ("/{0}/get/{1}/{2}").format(parts[0], defaultValue(mode, "edit"), parts[1]), params, callback)
	else
		desktop.Ajax(this, ("/get/{0}/{1}").format(defaultValue(mode, "edit"), this.postBack), params, callback);
	// desktop.Ajax(this, "/engine/get/edit/sys-users", params, callback);
};

JFormEditor.prototype.InitializeToolbar = function(toolbar) {
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
			// console.log("save")
			self.Events.OnPost.trigger();
		}
	});
	
	this.Events.OnInitToolbar.trigger(toolbar);
};

JFormEditor.prototype.InitializeEditor = function(editor) {
	this.Events.OnInitEditor.trigger(editor);
};

JFormEditor.prototype.AfterPaint = function() {
	JFormEditor.prototype.parent.prototype.AfterPaint.call(this); 
	// console.log(this.Painter.pageControl.tabs)
	if(this.Painter.pageControl.tabs.length === 1) {
		this.Painter.pageControl.showTabs(false);
	};
};
//**************************************************************************************************
// JFormEditPainter
//**************************************************************************************************
Class.Inherits(JFormEditPainter, JControlPainter);
function JFormEditPainter(Control) {
	JFormEditPainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

JFormEditPainter.prototype.classID = "JFormEditPainter";
JFormEditPainter.prototype.type = "form-edit";

JFormEditPainter.prototype.InitializePageControl = function(pg) {
	var self = this;

	var editorInit = {
		PageControl: pg,
		NewGroupEdit: function(params, initEditor, dataset) {
			params.OnCreate = function(tab) {
				// tab.container
					// .css("box-sizing", "border-box")
					// .css("padding", self.Control.containerPadding);
				// var container = CreateElement("div", tab.container)
					// .attr("x-sec", "edit-container")
					// .css("overflow-y", "auto")
					// .css("padding", self.Control.containerPadding);
					
				// var subContainer = CreateElement("div", container)
					// .attr("x-sec", "edit-sub-container");
					
				// if(self.Control.fillContainer) 
					// subContainer.attr("x-fill", "1")
				
				// initEditor(editor, tab); // test
				// return; // testsddddddddddddddddddddddddddd
				
				tab.container.css("overflow-y", "auto");
				
				var editor = new JEditor({
					ID: "edit_" + tab.id,
					// Container: subContainer,
					Container: tab.container,
					Theme: self.Control.editorTheme,
					Css: "editor",
					LabelWidth: self.Control.labelWidth
				});	          
				
				var group = this;
				
				editor.Dataset = defaultValue(dataset, tab.pg.owner.dataset);
				editor.Dataset.Events.OnChanged.add(function(dataset, columnName) {
					group.OnDatasetChanged.trigger(columnName);
				});
				editor.Dataset.Events.OnCancel.add(function(dataset) {
					group.OnDatasetChanged.trigger();
				});
				
				this.OnDatasetChanged = new EventHandler(this);
				editor.group = this;
				editor.group.dataset = editor.Dataset;

				initEditor(editor, tab);
				
				editor.Paint();
				editor.AfterPaint();
				
				editor.list.each(function(i, item) {
					if(item.classID === "JEditCategory") {
						if(item.Params.Dataset)
							item.Params.Dataset.updateControls();
					};
				})
				
				if(!params.noFucus)
					editor.FocusFirstEditor();
			};
			
			pg.addTab(params);
		},
		NewContainer: function(params, initContainer) {
			params =  $.extend(params, {
				OnCreate: function(tab) {
					initContainer(tab.container);
				}
			})
			
			pg.addTab(params);
			/*
			return;
			
			pg.addTab({caption:caption,
				OnCreate: function(tab) {
					// var container = CreateElement("div", tab.content).attr("x-sec", "edit-container").css("padding", self.Control.containerPadding);
					// var subContainer = CreateElement("div", container).attr("x-sec", "edit-sub-container")
					// initContainer(subContainer, tab);
					initContainer(tab);
				}
			}); */
		},
		NewSubSelectionView: function(caption, height, selectionColumnName, initView) {
			pg.addTab({caption:caption, 
				OnCreate: function(tab) {
					tab.container.css("height", height);
					CreateElementEx("div", tab.container, function(container) {
						container.attr("x-sec", "edit-container")
							.css("overflow-y", "auto")
							.css("padding", self.Control.containerPadding);
							
						CreateElementEx("div", container, function(subContainer) {
							subContainer.attr("x-sec", "edit-sub-container");
								
							if(self.Control.fillContainer) 
								subContainer.attr("x-fill", "1")
								
							var params = {
								editor: self,
								container: subContainer,
								selectionColumn: self.Control.dataset.Columns.get(selectionColumnName)
							};
							
							initView(params);
								
						});
					});
					
					// var container = CreateElement("div", tab.container)
						// .attr("x-sec", "edit-container")
						// .css("overflow-y", "auto")
						// .css("padding", self.Control.containerPadding);
						
					// var subContainer = CreateElement("div", container)
						// .attr("x-sec", "edit-sub-container");
						
					// if(self.Control.fillContainer) 
						// subContainer.attr("x-fill", "1")
					
					// var params = {
						// editor: self,
						// container: subContainer,
						// selectionColumn: self.Control.dataset.Columns.get(selectionColumnName)
					// };
					
					// initView(params);
				}
			});
		}
	};
	
	this.Control.InitializeEditor(editorInit);
};

JFormEditPainter.prototype.InitializeToolbar = function(toolbar) {
	this.Control.InitializeToolbar(toolbar);
};

JFormEditPainter.prototype.Paint = function() {
	JFormEditPainter.prototype.parent.prototype.Paint.call(this); 
	var container = CreateElement("div", this.Control.container)
		.addClass("form-edit")
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
		
	// console.log(this.Control.pageControlOptions)
	this.pageControl = new jPageControl({
		owner: this.Control,
		paintParams: {
			// theme: "search",
			// theme: this.Control.pageControlTheme,
			theme: this.Control.pageControlOptions.theme,
			icon: {
				size: this.Control.pageControlOptions.iconSize,
				position: "left",
				name: "search",
				color: "dodgerblue"
			},
			// fullBorder: true,
			autoHeight: this.Control.autoHeight
		},
		indent: 4,
		container: subContainer,
		init: function(pg) {
			pg.owner.Painter.InitializePageControl(pg);
		}
	});
		
	// this.pageControl = new JPageControl({
		// owner: this.Control,
		// container: subContainer,
		// Painter: {
			// autoHeight: false,
			// theme: this.Control.pageControlTheme
		// },
		// init: function(pg) {
			// pg.owner.Painter.InitializePageControl(pg);
		// }
	// });

	if(this.Control.showToolbar) {
		toolbar.SetVisible("refresh", !this.Control.dataset.editing);
		toolbar.SetVisible("cancel", this.Control.dataset.editing);
		toolbar.SetVisible("save", this.Control.dataset.editing);
	};
	
	this.SetContainer(container);
};
