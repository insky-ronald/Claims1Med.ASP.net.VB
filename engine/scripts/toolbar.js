// *************************************************************************************************
// File name: toolbar.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JToolbar
//**************************************************************************************************
Class.Inherits(JToolbar, JControl);
function JToolbar(Params) {
    JToolbar.prototype.parent.call(this, Params);
};

JToolbar.prototype.classID = "JToolbar";

JToolbar.prototype.DefaultPainter = function() {
    return new ToolbarPainter(this);
};

JToolbar.prototype.Initialize = function(params) {
    JToolbar.prototype.parent.prototype.Initialize.call(this, params);
    this.id = params.id;
    this.container = params.container;
    this.css = params.css;
    this.theme = params.theme;
    this.buttonSize = params.buttonSize;
    this.hintAlign = defaultValue(params.hintAlign, "top");
	this.list = new JList();
	
	this.Events = {};
	this.Events.OnSelectItem = new EventHandler(this);
	this.Events.OnSelectItem.add(function(toolbar, item) {
		item.click(item);
	});
};

JToolbar.prototype.getItem = function(name) {
	return this.list.get(name);
}

JToolbar.prototype.SetVisible = function(name, visible) {
	this.list.get(name).show(visible);
}

JToolbar.prototype.NewItem = function(params) {

	params.toolbar = this;
	var item = new JToolbarButton(params);
	
	return this.list.add(item.id, item);
};

// JToolbar.prototype.NewTextBox = function(params) {
// };

JToolbar.prototype.NewDropdownItem = function(params) {
	params.dropdown = true;
	params.noIndicator = defaultValue(params.noIndicator, false);
	params.click = function(item) {
		new JPopupDialog({
			Target: item.Element(),				
			Modal: false,
			onClose: params.onClose,
			Painter: {
				painterClass: PopupOverlayPainter,
				color: defaultValue(params.color, "dimgray"),
				snap: "bottom",
				// align: defaultValue(params.dlgAlign, "left"),
				align: defaultValue(params.dlgAlign, params.align),
				noIndicator: defaultValue(params.noIndicator, false),
				OnRenderHeader: params.painter.header,
				OnRenderContent: params.painter.content,
				OnRenderFooter: params.painter.footer
			}
		});
	};
	
	return this.NewItem(params);
};

JToolbar.prototype.NewDropdownConfirm = function(params) {
	params.painter = {
		content: function(dialog, container) {
			container.attr("dlg-sub", "confirm")
			CreateElement("div", container).attr("dlg-sec", "title")
				// .css("color", defaultValue(params.color, ""))
				.css("color", defaultValue(params.color, ""))
				.css("font-weight", "bold")
				.css("font-size", "120%")
				.css("margin-bottom", "5px")
				.html(params.title)
				
			CreateElement("div", container).attr("dlg-sec", "description")
				.html(params.description)
		},
		footer: function(dialog, container) {
			CreateButton({
				container: container,
				caption: "Yes",
				enabled: true,
				style: "green",
				click: function(button) {
					dialog.Hide();
					params.confirm(button);
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
	};
	
	return this.NewDropdownItem(params);
};

JToolbar.prototype.NewDropDownConfirmItem = function(params) {
	return this.NewDropdownItem({
		id: params.id,
		dataBind: params.dataBind,
		dataEvent: params.dataEvent,
		icon: params.icon,
		iconColor: defaultValue(params.iconColor, params.color),
		color: params.color,
		noIndicator: params.noIndicator,
		hint: params.title,
		align: params.align || "left",
		painter: {
			footer: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "Yes",
					style: "green",
					click: function(button) {
						dialog.Hide();
						params.confirm();
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
			},
			content: function(dialog, container) {
				CreateElementEx("div", container, function(header) {
					CreateElement("h2", header).html(params.title).css("margin", 0);
					CreateElement("p", header).html(params.subTitle);
				});
				
				// CreateElementEx("div", container, function(view) {
					// view.parent()
						// .css("width", params.width || 500)
						
					// view
						// .css("height", params.height || 300)
						// .css("border", "1px solid " + params.color);
				// });
			}
		}
	});
};

JToolbar.prototype.NewDropDownViewItem = function(params) {
	return this.NewDropdownItem({
		id: params.id,
		icon: params.icon,
		iconColor: params.color,
		color: params.color,
		hint: params.title,
		align: params.align || "left",
		painter: {
			footer: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "Close",
					style: "green",
					click: function(button) {
						dialog.Hide();
					}
				});
			},
			content: function(dialog, container) {
				CreateElementEx("div", container, function(header) {
					CreateElement("h2", header).html(params.title).css("margin", 0);
					CreateElement("p", header).html(params.subTitle);
				});
				
				CreateElementEx("div", container, function(view) {
					view.parent()
						.css("width", params.width || 500)
						
					view
						.css("height", params.height || 300)
						.css("border", "1px solid " + params.color);
						
					if(params.view) {
						params.view($.extend(params.viewParams, {container:view, select:function(code) {
							dialog.Hide();
							desktop.HideHints();
							params.select(code);
						}}));						
					};
				});
			}
		}
	});
};

//**************************************************************************************************
// JToolbarButton
//**************************************************************************************************
Class.Inherits(JToolbarButton, JControl);
function JToolbarButton(Params) {
    JToolbarButton.prototype.parent.call(this, Params);
};

JToolbarButton.prototype.classID = "JToolbarButton";

JToolbarButton.prototype.DefaultPainter = function() {
    return new ToolButtonPainter(this);
};

JToolbarButton.prototype.Initialize = function(params) {
    JToolbarButton.prototype.parent.prototype.Initialize.call(this, params);
    this.id = params.id;
    this.toolbar = params.toolbar;
    this.icon = params.icon;
    this.iconColor = params.iconColor;
    this.hint = params.hint;
    this.align = defaultValue(params.align, "left");
    this.dropdown = defaultValue(params.dropdown, false);
    this.noIndicator = defaultValue(params.noIndicator, false);
    this.container = params.toolbar.Painter.buttonContainer;
    this.click = params.click;
	
    this.dataBind = params.dataBind;
    this.dataEvent = params.dataEvent;
	if(this.dataBind && this.dataEvent) {
		var self = this;
		this.dataBind.Events.OnEditState.add(function(dataset, editing) {
			self.dataEvent(dataset, self);
		};
		// this.dataBind.Events.OnCancel.add(function(dataset) {
			// self.dataEvent(dataset, self);
		// };
		
		// self.dataEvent(this.dataBind, self);
	};
};

JToolbarButton.prototype.show = function(visible) {
	if(visible)
		this.Painter.container.css("display", "")
	else
		this.Painter.container.css("display", "none");
};
