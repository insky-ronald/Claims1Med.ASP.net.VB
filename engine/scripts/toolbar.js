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
	var item = this.list.get(name);
	if (item) {
		item.show(visible);
	}
}

JToolbar.prototype.NewItem = function(params) {
	
	// console.log(params.permission);
	// params.permission = $.extend({}, {canView:true}, params.permission);
	params.permission = $.extend({}, {view:true}, params.permission);
	
	if(params.permission.view) {
		params.toolbar = this;
		var item = new JToolbarButton(params);
		
		this.list.add(item.id, item);
		if(params.dataEvent) {
			params.dataEvent(params.dataBind, item)
		}
		return item;
	} else {
		return null;
	}
};

// JToolbar.prototype.NewTextBox = function(params) {
// };

JToolbar.prototype.NewDropdownItem = function(params) {
	params.dropdown = true;
	params.noIndicator = defaultValue(params.noIndicator, false);
	params.click = function(item) {
		// console.log(item);
		var dialog = new JPopupDialog({
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
		
		dialog.toolbarButton = item;
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

JToolbar.prototype.NewDropDownWizard = function(params) {
	
	params = $.extend({
		dropdown: true,
		noIndicator: false,
		height: "auto",
		width: "auto",
		align: "left",
		color: "dimgray"
		// css: ""
	}, params, {
		id: params.id,
		// css: defaultValue(params.css, params.id),
		// align: params.align || "left",
		align: params.align,
		color: params.color,
		icon: params.icon,
		iconColor: defaultValue(params.iconColor, params.color),
		noIndicator: params.noIndicator,
		hint: params.title,
		dataBind: params.dataBind,
		dataEvent: params.dataEvent,
		permission: params.permission
	});
	
	params.click = function(item) {
		var pg, btns = {}, tabIndex = 0, subTitle = "", wizard, subTitleContainer;
		
		// var updateButtons = function(wizard) {
			// btns.back.SetEnabled(wizard.pg.activeTab.id > 1);
			// btns.next.SetEnabled(wizard.pg.activeTab.id < wizard.pg.tabs.length);
			// btns.finish.SetEnabled(wizard.pg.activeTab.id == wizard.pg.tabs.length);
		// };
		
		var dialog = new JPopupDialog({
			Target: item.Element(),				
			Modal: false,
			onClose: params.onClose,
			Painter: {
				painterClass: PopupOverlayPainter,
				color: params.color,
				snap: "bottom",
				css: defaultValue(params.css, params.id),
				// align: defaultValue(params.dlgAlign, params.align),
				align: params.align,
				noIndicator: params.noIndicator,
				OnRenderContent: function(dialog, container) {
					// console.log(params.title)
					container.css("width", params.width);
					
					CreateElementEx("div", container, function(header) {
						CreateElement("h2", header).css("color", params.color).html(params.title).css("margin", 0);
						// subTitle = CreateElement("p", header).addClass("dialog-sub-title").html(params.subTitle);
						subTitleContainer = CreateElementEx("div", container, function(title) {
							// subTitle = CreateElement("p", title).addClass("dialog-sub-title").html(params.subTitle);
							subTitle = CreateElement("p", title).html(params.subTitle);
						}).addClass("dialog-sub-title");
					});
					
					CreateElementEx("div", container, function(content) {
						// content.css("width", params.width);
						content.css("height", params.height);
						pg = new jPageControl({
							paintParams: {
								css: "pg-claim2",
								theme: "search",
								icon: {
									size: 16,
									position: "left"
								}
							},
							showScrollButtons:true,
							container: content,							
							init: function(pg) {
								var i = 1;
								wizard = {
									pg: pg,
									update: function() {
										btns.back.SetEnabled(this.canBack());
										btns.next.SetEnabled(this.canNext());
										btns.finish.SetEnabled(this.canFinish());
									},
									canBack: function() {
										return this.pg.activeTab.id > 1;
									},
									canNext: function() {
										return this.pg.activeTab.id < this.pg.tabs.length && this.canNext2();
									},
									canNext2: function() {
										return true;
									},
									canFinish: function() {
										return this.pg.activeTab.id == this.pg.tabs.length;
									},
									add: function(options) {
										pg.addTab({caption: ("Wiz {0}").format(i++),
											icon: {
												name: "table",
												color: "forestgreen"
											},
											OnVisibility: function(tab, visible) {
												if (options.OnVisibility) {
													options.OnVisibility(wizard, visible)
												}
											},
											OnActivate: function(tab) {
												// updateButtons(tab.pg);
												// updateButtons(wizard);
												wizard.update();
												if (options.OnActivate) {
													options.OnActivate(wizard)
												}
											},
											OnCreate: function(tab) {
												if (tab.id > 1) {
													// updateButtons(tab.pg);
													// updateButtons(wizard);
													wizard.update();
												};
												
												options.OnCreate(wizard, tab.container);
												if (options.OnActivate) {
													options.OnActivate(wizard)
												}
											}
										})
									}, 
									subTitle: function(text) {
										subTitle.html(text);
									},
									resize: function(height) {
										// subTitle.html(text);
										content.css("height", height);
									},
									setSubTitle: function(content) {
										subTitleContainer.html("");
										subTitleContainer.append(content);
										// subTitle.html(text);
									}
								};
								
								params.prepare(wizard);
							}
						});
					});
				},
				OnRenderFooter: function(dialog, container) {
					btns.back = CreateButton({
						container: container,
						caption: "Back",
						style: "green",
						click: function(button) {
							// console.log(button)
							if (button.enabled == "enabled") {
								pg.tabs[pg.activeTab.id - 1 -1].show();
							}
							// dialog.Hide();
							// params.confirm(dialog.toolbarButton);
						}
					});
					
					btns.next = CreateButton({
						container: container,
						caption: "Next",
						style: "green",
						click: function(button) {
							if (button.enabled == "enabled") {
								pg.tabs[pg.activeTab.id + 1 - 1].show();
							}
							
							// dialog.Hide();
							// params.confirm(dialog.toolbarButton);
						}
					});
					
					btns.finish = CreateButton({
						container: container,
						caption: "Finish",
						style: "green",
						click: function(button) {
							if (button.enabled == "enabled") {
								params.finish(wizard);
								dialog.Hide();
							}
							// params.confirm(dialog.toolbarButton);
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
		
		pg.showTabs(false);
		// updateButtons(pg);
		// updateButtons(wizard);
		wizard.update();
		dialog.toolbarButton = item;
	};
	
	return this.NewItem(params);
};

JToolbar.prototype.NewDropDownWizard2 = function(params) {
	
	params = $.extend({
		dropdown: true,
		noIndicator: false,
		height: "auto",
		width: "auto",
		align: "left",
		color: "dimgray"
		// css: ""
	}, params, {
		id: params.id,
		// css: defaultValue(params.css, params.id),
		// align: params.align || "left",
		align: params.align,
		color: params.color,
		icon: params.icon,
		iconColor: defaultValue(params.iconColor, params.color),
		noIndicator: params.noIndicator,
		hint: params.title,
		dataBind: params.dataBind,
		dataEvent: params.dataEvent,
		permission: params.permission
	});
	
	params.click = function(item) {
		var pg, btns = {}, tabIndex = 0, subTitle = "", wizard, subTitleContainer;
		
		// var updateButtons = function(wizard) {
			// btns.back.SetEnabled(wizard.pg.activeTab.id > 1);
			// btns.next.SetEnabled(wizard.pg.activeTab.id < wizard.pg.tabs.length);
			// btns.finish.SetEnabled(wizard.pg.activeTab.id == wizard.pg.tabs.length);
		// };
		
		var dialog = new JPopupDialog({
			Target: item.Element(),				
			Modal: false,
			onClose: params.onClose,
			Painter: {
				painterClass: PopupOverlayPainter,
				color: params.color,
				snap: "bottom",
				css: defaultValue(params.css, params.id),
				// align: defaultValue(params.dlgAlign, params.align),
				align: params.align,
				noIndicator: params.noIndicator,
				showFooter: false,
				OnRenderContent: function(dialog, container) {
					container.css({
						width: params.width,
						height: params.height
					})
					
					var wizard = new jWizard({
						container: container,
						title: params.title,
						color: params.color,
						css: params.css || params.id,
						prepare: function(wizard) {							
							wizard.events.OnClose.add(function(wizard) {
								dialog.Hide();
							});
							params.prepare(wizard);
						}
					})
				}
			}
		});
		
		// pg.showTabs(false);
		// updateButtons(pg);
		// updateButtons(wizard);
		// wizard.update();
		dialog.toolbarButton = item;
	};
	
	return this.NewItem(params);
};

JToolbar.prototype.NewDropDownConfirmItem = function(params) {
	var item = this.NewDropdownItem({
		id: params.id,
		dataBind: params.dataBind,
		dataEvent: params.dataEvent,
		icon: params.icon,
		iconColor: defaultValue(params.iconColor, params.color),
		color: params.color,
		noIndicator: params.noIndicator,
		hint: params.title,
		align: params.align || "left",
		permission: params.permission,
		painter: {
			footer: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "Yes",
					style: "green",
					click: function(button) {
						dialog.Hide();
						params.confirm(dialog.toolbarButton);
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
	
	return item;
};

JToolbar.prototype.NewDropDownViewItem = function(params) {
	var self = this;
	var btn = this.NewDropdownItem({
		id: params.id,
		icon: params.icon,
		iconColor: params.color,
		color: params.color,
		hint: params.title,
		align: params.align || "left",
		permission: params.permission,
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
					if (params.subTitle) {
						CreateElement("p", header).html(params.subTitle);
					}
				});			
				
				CreateElementEx("div", container, function(view) {
					view.parent()
						.css("width", params.width || 500)
						
					view
						.css("height", params.height || 300)
						.css("border", "1px solid " + params.color);
						
					if(params.view) {
						params.view($.extend(params.viewParams, {container:view, select:function(id) {
							dialog.Hide();
							desktop.HideHints();
							if (params.select2) {
								// params.select2(btn, id);
								params.select2(self.getItem(params.id), id);
							} else {
								params.select(id);
							}
						}}));						
					};
				});
			}
		}
	});
	
	return btn;
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
    this.iconSize = defaultValue(params.iconSize, this.toolbar.buttonSize+4);
    this.iconColor = params.iconColor;
    this.hint = params.hint;
    this.align = defaultValue(params.align, "left");
    this.dropdown = defaultValue(params.dropdown, false);
    this.noIndicator = defaultValue(params.noIndicator, false);
    this.container = params.toolbar.Painter.buttonContainer;
	// this.permission = $.extend(params.permission, {
		// canView:true
	// });
	
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
