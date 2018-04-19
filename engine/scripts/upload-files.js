// ****************************************************************************************************
// File name: upload-files.js
// Last modified on
// 21-AUG-2016
// ****************************************************************************************************
//==================================================================================================
// UploadFiles
//==================================================================================================
Class.Inherits(UploadFiles, JControl);
function UploadFiles(params) {
	UploadFiles.prototype.parent.call(this, params); 
	// console.log(this.classID)
};

UploadFiles.prototype.classID = "UploadFiles";

UploadFiles.prototype.DefaultPainter = function() {
    return new UploadFilesPainter(this);
};

UploadFiles.prototype.Refresh = function() {
	// this.GetData("edit", function(result) {
		// result.caller.editData.resetData(result.edit, "", true);
	// });
};

UploadFiles.prototype.Initialize = function(params) {
	UploadFiles.prototype.parent.prototype.Initialize.call(this, params);
	// this.id = params.id;
	// this.textID = params.textID;
	// this.url = params.url.split("?")[1];
	// this.dataset = params.dataset;
	this.postBack = params.postBack;
	// this.postBackParams = params.url.split("?")[1];
	// this.dialog = params.dialog;
	this.container = params.container;
	this.containerPadding = defaultValue(params.containerPadding, 0);
	this.fillContainer = defaultValue(params.fillContainer, false);
	this.showToolbar = defaultValue(params.showToolbar, true);
	this.uploadUrl = defaultValue(params.uploadUrl, "/api/upload/test");
	this.multipleFiles = defaultValue(params.multipleFiles, true);

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
	
	this.Events.OnSubmit = new EventHandler(this);
	this.Events.OnAfterSubmit = new EventHandler(this);
	
	params.init(this);
};

UploadFiles.prototype.Edit = function() {
	// this.htmlContainer.attr("contentEditable", true);
	// this.htmlContainer.focus();
	// this.Events.OnEdit.trigger();
};

UploadFiles.prototype.Cancel = function() {
	// this.htmlContainer.removeAttr("contentEditable");
	// this.Events.OnCancel.trigger();
};

UploadFiles.prototype.Save = function() {
	// this.htmlContainer.removeAttr("contentEditable");
	// desktop.Ajax(this, ("/get/{0}/{1}").format("update", "get-text"), 
		// {
			// text_id: this.textID,
			// html: this.Content()
		// }, 
		// function(result) {
		// }
	// );
	// this.Events.OnSave.trigger();
};

// UploadFiles.prototype.Content = function() {
	// return this.htmlContainer.html();
// };

UploadFiles.prototype.InitializeToolbar = function(toolbar) {
	var self = this;
	this.toolbar = toolbar;
	
	toolbar.NewItem({
		id: "addfiles",
		icon: "plus-box",
		iconColor: "#8DCF6E",
		hint: "Add Files...",
		// dataBind: this.dataset,
		// dataEvent: function(dataset, button) {
			// button.show(!dataset.editing);
		// },
		click: function(item) {
			self.fileInput.click();
			// grid.Refresh();
		}
	});
	
	toolbar.NewItem({
		id: "upload",
		icon: "upload",
		iconColor: "#1CA8DD",
		hint: "Start Upload",
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

UploadFiles.prototype.DisplayFile = function(file) {
	// console.log(file)
	// console.log($(file).data("info");
	var info = $(file).data("info");
	// console.log(info)
	
	var row = CreateElement("div", this.htmlContainer, "", "image-preview");
	if(!this.multipleFiles) {
		row.css("border", 0);
	};
	
	var imgContainer = CreateElement("div", row)
		.attr("x-sec", "img-container")
		
	var name = CreateElement("div", row)
		.html(info.name)
		
	var type = CreateElement("div", row)
		.html(info.type)
	
	var size = info.size;
	
	if(size >= 1024*1024) {
		size = (size / 1024 / 1024).toFixed(2) + " MB"
	} else if(size >= 1024) {
		size = (size / 1024).toFixed(2) + " KB"
	} else
		size = size + " Bytes";
	
	CreateElement("div", row)
		.html(size)
		
	var self = this;
	var naturalWidth = 0;
	var naturalHeight = 0;
	var img = CreateElement("img", imgContainer)
		.attr("src", file.result)
		.load(function() {
			naturalWidth = this.naturalWidth;
			naturalHeight = this.naturalHeight;
	
			CreateElement("div", row)
				.html( naturalWidth +"x"+ naturalHeight);
				
			$(file).data("width", naturalWidth);
			$(file).data("height", naturalHeight);
			
			CreateElement("a", row)
				.attr("x-sec", "upload-button")
				.html("Upload...")
				.click(function() {
					var fileToUpload = $(file).data("info");
					if (fileToUpload.type.match('image.*')) {
						var formData = new FormData();
						formData.append('photos[]', fileToUpload, fileToUpload.name);
						formData.append("size", fileToUpload.size);
						formData.append("image_type", fileToUpload.type);
						formData.append("width", $(file).data("width"));
						formData.append("height", $(file).data("height"));
						
						self.Events.OnSubmit.trigger(formData);
						
						/*
						$.ajax({
							   url: "/api/upload/test",
							   type: "POST",
							   data: formData,
							   processData: false,
							   contentType: false,
							   success: function(response) {
								   // .. do something
							   },
							   error: function(XHR, textStatus, errorMessage) {
								   // console.log(errorMessage); // Optional
							   }
							});				
							*/
							
						var xhr = new XMLHttpRequest();
						xhr.open('POST', self.uploadUrl, true);
						xhr.onload = function () {
							self.Events.OnAfterSubmit.trigger();
							if(xhr.status === 200) {							  
								// File(s) uploaded.
								// uploadButton.innerHTML = 'Upload';
								// console.log("uploaded")
							} else {
								// alert('An error occurred!');
								// console.log("upload error")
							}
						};
						
						var s = $(this);
						s.off("click");
						xhr.upload.onprogress = function(e) {
							var percentComplete = Math.ceil((e.loaded / e.total) * 100);
							s.html(percentComplete+"%");
							// console.log(percentComplete);
						};
						
						xhr.send(formData);
					};
				})
				
		});
};

UploadFiles.prototype.InitializeContent = function(container) {
	var self = this;
	
	this.fileInput = CreateElement("input", container)
		.attr("type", "file")
		.attr("name", "files[]")
		.attr("multiple", "").
		.on("change", function(e) {
			var f = e.target.files[0];
			$(e.target.files).each(function(a, file) {
				// console.log(a)
				// console.log(b)
				var r = new FileReader();
				$(r).data("info", file);
				r.onload = function(e) {
					self.DisplayFile(e.target);
				};
				
				// r.readAsDataURL(f);
				// console.log(file)
				r.readAsDataURL(file);
			});
			
			// if(f) {
				// var r = new FileReader();
				// r.onload = function(e) {
					// self.DisplayFile(e.target);
				// };
				
				// r.readAsDataURL(f);
			// }
		})
		
	if(!this.multipleFiles) this.fileInput.removeAttr("multiple");
	
	this.Events.OnInitContent.trigger(container);
};

UploadFiles.prototype.AfterPaint = function() {
	UploadFiles.prototype.parent.prototype.AfterPaint.call(this); 
	// if(this.Painter.pageControl.TabCount() == 1) {
		// this.Painter.pageControl.ShowTabs(false);
	// };
};

//**************************************************************************************************
// UploadFilesPainter
//**************************************************************************************************
Class.Inherits(UploadFilesPainter, JControlPainter);
function UploadFilesPainter(Control) {
	UploadFilesPainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

UploadFilesPainter.prototype.classID = "UploadFilesPainter";
UploadFilesPainter.prototype.type = "upload-files";

UploadFilesPainter.prototype.InitializeToolbar = function(toolbar) {
	this.Control.InitializeToolbar(toolbar);
};

UploadFilesPainter.prototype.Paint = function() {
	UploadFilesPainter.prototype.parent.prototype.Paint.call(this); 
	var container = CreateElement("div", this.Control.container)
		.addClass("upload-files")
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
		
	if(!this.Control.multipleFiles) {
		subContainer.css("overflow-y", "hidden");
	};

	if(this.Control.showToolbar) {
		toolbar.SetVisible("cancel", false);
		toolbar.SetVisible("save", false);
	};
	
	subContainer.html(this.Control.htmlContent);
	this.SetContainer(subContainer);
	
	this.Control.InitializeContent(subContainer);
};

//**************************************************************************************************
// Upload File Dialog
//**************************************************************************************************
function UploadFileDialog(c) {
	// console.log(c)
	return new JPopupDialog({
		Target: c.target,
		Modal: c.modal,
		Painter: {
			painterClass: PopupBalloonPainter,
			color: "#315B8F",
			// snap: "left",
			// snap: "right",
			// snap: "top",
			snap: "bottom",
			align: "",
			inset: false,
			// inset: true,
			OnRenderHeader: function(dialog, container) {
				container.html(c.title);
			},
			OnRenderContent: function(dialog, container) {
				// container.html(c.message)
				container.css("height", 185)
				// container.css("height", "auto")
				// container.css("min-height", 100)
				container.css("width", 500)
				container.css("padding", 0)
				new UploadFiles({
					container: container,
					// containerPadding: 0,
					containerPadding: 10,
					fillContainer: false,
					showToolbar: true,
					uploadUrl: c.uploadUrl,
					multipleFiles: c.multipleFiles,
					init: function(uploader) {
						c.init(uploader, c.target, dialog);
						// uploader.Events.OnSubmit.add(function(uploader, formData) {
							// formData.append("parent_type", requestParams.parent_type);
							// formData.append("parent_id", requestParams.parent_id);
						// });
						
						// uploader.Events.OnAfterSubmit.add(function(uploader) {
							// grid.Refresh();
						// });
					}
				});
			},
			OnRenderFooter: function(dialog, container) {
				// CreateButton({
					// container: container,
					// caption: "Close",
					// enabled: true,
					// style: "green",
					// click: function(button) {
						// c.callback(dialog);
						// dialog.Hide();
					// }
				// });
				// CreateButton({
					// container: container,
					// caption: "Close",
					// enabled: true,
					// style: "text",
					// click: function(button) {
						// dialog.Hide();
					// }
				// });
			}
		}
	});
};
