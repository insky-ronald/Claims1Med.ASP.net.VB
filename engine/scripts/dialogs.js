// *************************************************************************************************
// File name: dialogs.js
// Last modified on
// 04-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JPopupDialog
//**************************************************************************************************
Class.Inherits(JPopupDialog, JControl);
function JPopupDialog(Params) {
    JPopupDialog.prototype.parent.call(this, Params);
};

JPopupDialog.prototype.classID = "JPopupDialog";

JPopupDialog.prototype.Initialize = function(Params) {
    JPopupDialog.prototype.parent.prototype.Initialize.call(this, Params);
    this.target = Params.Target;
    this.container = $("body");
    this.modal = Params.Modal;
	this.close_on_espace = defaultValue(Params.CloseOnEsc, true);
	this.onClose = Params.onClose;
	// console.log(Params)
};

JPopupDialog.prototype.DefaultPainter = function() {
    return new PopupBasePainter(this);
    // return new PopupBalloonPainter(this);
};

JPopupDialog.prototype.Hide = function() {
    this.Painter.Hide();
	// alerts("here", this.onClose)
	if(this.onClose) this.onClose(this);
};

// JPopupDialog.prototype.SetTitle = function(title) {
    // this.Painter.SetTitle(title);
// };

// JPopupDialog.prototype.Element = function() {
    // return this.Painter.Container;
// };

// JPopupDialog.prototype.RePosition = function() {
	// this.Painter.RePosition();
// };

//**************************************************************************************************
// JHint
//**************************************************************************************************
Class.Inherits(JHint, JPopupDialog); 
function JHint(Params) {
    JHint.prototype.parent.call(this, Params);
};

JHint.prototype.DefaultPainter = function() {
    return new PopupHintPainter(this);
    // return new PopupBalloonPainter(this);
};

//**************************************************************************************************
// JEditDialog
//**************************************************************************************************
/*
Class.Inherits(JEditDialog, JPopupDialog); 
function JEditDialog(Params) {
    JEditDialog.prototype.parent.call(this, Params);
};

JEditDialog.prototype.classID = "JEditDialog";

JEditDialog.prototype.DefaultPainter = function() {
    // return new EditDialogPainter(this);
    return new EditDialogPainter2(this);
};

JEditDialog.prototype.Initialize = function(Params) {
    JEditDialog.prototype.parent.prototype.Initialize.call(this, Params);
};

JEditDialog.prototype.AfterPaint = function() {
    JEditDialog.prototype.parent.prototype.AfterPaint.call(this);
	this.Painter.AfterPaint(); // It is important that the page control be create on AfterPaint event
	this.Painter.Reposition();
	
	// alerts(this.pg.TabCount());
	if(this.pg.TabCount() == 1) {
		this.pg.ShowTabs(false);
	};
};

JEditDialog.prototype.InitializePageControl = function(pg) {
	if(this.PaintParams.OnInitTabs) {
		pg.Events.OnInitTabs.add(this.PaintParams.OnInitTabs);
	};
};

JEditDialog.prototype.DataChanged = function(dataset) {
	this.Painter.DataChanged(this.dataset = dataset);
};

JEditDialog.prototype.Reset = function() {
	this.dataset.cancel();
	this.Painter.DataChanged(this.dataset);
};

JEditDialog.prototype.Save = function() {
	// var self = this;
	// this.grid.UpdateRecord(function() {
		// self.Hide();
	// });	
	var self = this;
	
	// alerts(this.dataset);
	this.dataset.post(function(data, msg, error) {
		if(error == 0) {
			self.Hide()
		else {
			var title = "Error";
			var msgTarget = self.Painter.editContainer;
			if(typeof msg == "string") {
				if(error == 1) {
					title = "Incomplete information";
					msgTarget = self.Painter.editContainer.find("td[cat-sec='gutter']");
				};
			} else {
				title = msg.title;
				msg = msg.message;
			}
			
			ErrorDialog({
				// target: self.toolbar.getItem("save").elementContainer,
				// target: self.Painter.editContainer,
				target: msgTarget,
				title: title,
				message: msg,
				snap: "top",
				// align: "left",
				inset: false
			});
		};		
	});
};

JEditDialog.prototype.ShowTabs = function(visible) {
	this.pg.ShowTabs(visible);
};
*/
//**************************************************************************************************
// JEditDialog2
//**************************************************************************************************
Class.Inherits(JEditDialog2, JPopupDialog); 
function JEditDialog2(Params) {
    JEditDialog2.prototype.parent.call(this, Params);
};

JEditDialog2.prototype.classID = "JEditDialog2";

JEditDialog2.prototype.DefaultPainter = function() {
    return new EditDialogPainter2(this);
};

JEditDialog2.prototype.Initialize = function(Params) {
    JEditDialog2.prototype.parent.prototype.Initialize.call(this, Params);
	this.OnInit = Params.OnInit;
	this.ActivatingTarget = Params.ActivatingTarget;
	this.Dataset = Params.Dataset;

	this.OnEditorLoaded = new EventHandler(this;
	// console.log(this.ActivatingTarget)

	// this.Events = {};
	// this.Events.OnPostError = new EventHandler(this);
	// this.Events.OnPostSuccess = new EventHandler(this);
	
	// this.dataset = Params.Dataset;
	// alerts(this.dataset);
};

JEditDialog2.prototype.AfterPaint = function() {
    JEditDialog2.prototype.parent.prototype.AfterPaint.call(this);
	// this.Painter.AfterPaint(); // It is important that the page control be create on AfterPaint event
	// this.Painter.RePosition();
	// alerts("OK")
};

JEditDialog2.prototype.SetEditor = function(editor) {
	var self = this;
	this.editor = editor;
	this.dataset = this.editor.dataset;
	this.dataset.Events.OnEditState.add(function(dataset, editing) {
		self.Painter.btnSave.SetEnabled(editing);
		self.Painter.btnReset.SetEnabled(editing);
	};
	
	this.editor.Events.OnPostSuccess.add(function(editor) {
		self.Hide();
	});
	
	// this.editor.Events.OnPostError.add(function(dialog, error) {
		// alerts(error)
	// });
	
	// this.editor.Events.OnPostSuccess.add(function(dialog) {
		// self.Control.Refresh();
	// });
	
	this.OnInit(self);
};

JEditDialog2.prototype.Save = function() {
	// var self = this;
	this.editor.Events.OnPost.trigger();
	// this.dataset.post(function(dataset, msg, error) {
		// if(error) {
			// var title = "Error";
			// if(typeof msg == "string") {
				// if(error == 1)
					// title = "Incomplete information"
			// } else {
				// title = msg.title;
				// msg = msg.message;
			// };
			
			// self.editor.Events.OnPostError.trigger({title:title, msg:msg});
		// } else {
			// self.Hide();
			// self.editor.Events.OnPostSuccess.trigger();
		// };
	// });	
};

JEditDialog2.prototype.Reset = function() {
	this.dataset.cancel();
	// this.Painter.btnSave.attr("btn-state", "disabled");
	// this.Painter.btnSave.SetEnabled(true);
	// this.Painter.btnReset.SetEnabled(false);
	// alerts("Reset")
};

//**************************************************************************************************
// Misc Functions
//**************************************************************************************************
function ConfirmDialog(c) {
	return new JPopupDialog({
		Target: c.target,
		Modal: c.modal,
		Painter: {
			painterClass: PopupBalloonPainter,
			color: defaultValue(c.color, "firebrick"),
			// snap: "left",
			// snap: "right",
			// snap: "top",
			snap: "bottom",
			align: "",
			inset: false,
			OnRenderHeader: function(dialog, container) {
				container.html(c.title);
			},
			OnRenderContent: function(dialog, container) {
				container.html(c.message)
				// container.css("height", 100)
				// container.css("width", 600)
			},
			OnRenderFooter: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "Yes",
					enabled: true,
					style: "green",
					click: function(button) {
						c.callback(dialog);
						dialog.Hide();
					}
				});
				CreateButton({
					container: container,
					caption: "Close",
					enabled: true,
					style: "text",
					click: function(button) {
						dialog.Hide();
					}
				});
			}
		}
	});
};

function ErrorDialog(c) {
	return new JPopupDialog({
		Target: c.target,
		Modal: c.modal,
		Painter: {
			painterClass: PopupBalloonPainter,
			color: "firebrick",
			snap: defaultValue(c.snap, "bottom"),,
			align: defaultValue(c.align, ""),
			// align: "",
			inset: defaultValue(c.inset, false),
			OnRenderHeader: function(dialog, container) {
				container.html(c.title);
			},
			OnRenderContent: function(dialog, container) {
				container.html(c.message)
			},
			OnRenderFooter: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "OK",
					enabled: true,
					style: "green",
					click: function(button) {
						// c.callback(dialog);
						dialog.Hide();
					}
				});
			}
		}
	});
};

function InfoDialog(c) {
	return new JPopupDialog({
		Target: c.target,
		Modal: c.modal,
		Painter: {
			painterClass: PopupBalloonPainter,
			color: "#2C5E93",
			snap: defaultValue(c.snap, "bottom"),,
			align: defaultValue(c.align, ""),
			inset: defaultValue(c.inset, false),
			OnRenderHeader: function(dialog, container) {
				container.html(c.title);
			},
			OnRenderContent: function(dialog, container) {
				container.html(c.message)
			},
			OnRenderFooter: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "OK",
					enabled: true,
					style: "green",
					click: function(button) {
						dialog.Hide();
					}
				});
			}
		}
	});
};

function Hint(item, show) {
	if(defaultValue(show, true)) {
		item.data("activated", true);
		
		setTimeout(function() {
			if(item.data("activated") {
				var lastHint = $(document).data("hint");
				if(lastHint) {
					lastHint.removeData("activated");
					if(lastHint.data("visible")) {
						lastHint.removeData("visible");
						lastHint.data("hint-dlg").Hide();
						lastHint.removeData("hint-dlg");
						$(document).removeData("hint");
					};
				};
				
				$(document).data("hint", item);
				
				var hint = item.data("hintData");
				var snap = item.data("hintSnap");
				
				item.data("visible", true);
				self.hint = new JHint({
					Target: item,
					Modal: false,
					Painter: {
						snap: defaultValue(snap, "bottom"),
						align: "",
						inset: false,
						OnRenderContent: function(dialog, container) {
							container.parent().parent().addClass("hint");
							if(typeof hint == "string")
								container.html(hint)
							else if(hint !== undefined)
								hint(dialog, container)
						}
					}
				});
				
				item.data("hint-dlg", self.hint);
			};
		}, 200);
	} else {
		item.removeData("activated");
		if(item.data("visible")) {
			item.removeData("visible");
			item.data("hint-dlg").Hide();
			item.removeData("hint-dlg");
		};
	}
};
