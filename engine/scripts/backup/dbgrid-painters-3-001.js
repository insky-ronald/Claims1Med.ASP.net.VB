// *************************************************************************************************
// File name: dbgrid-painters.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// jGridPainter3
//**************************************************************************************************
Class.Inherits(jGridPainter3, jBasePainter);
function jGridPainter3(params) {
	jGridPainter3.prototype.parent.call(this, params);
};

jGridPainter3.prototype.classID = "jGridPainter3";

jGridPainter3.prototype.initialize = function(params) {
    jGridPainter3.prototype.parent.prototype.initialize.call(this, params);
};

jGridPainter3.prototype.prePaint = function() {
	this.mainContainer = this.creaMainContainer(undefined, "grid3", this.control.paintParams.theme)
}

jGridPainter3.prototype.paint = function(container) {
	jGridPainter3.prototype.parent.prototype.paint.call(this, container);
		
	var self = this;
	// this.mainContainer = this.creaMainContainer(container, defaultValue(this.control.paintParams.css0, "grid3"), this.control.paintParams.theme)
	// this.mainContainer = this.creaMainContainer(container, "grid3", this.control.paintParams.theme)
	this.mainContainer
		// .on("mouseleave", function() {
			// self.control.bands.each(function(i, band) {
				// band.painter.mouseLeave()
			// })
		// })
		
	this.sections = {
		header: {},
		body: {},
		footer: {},
	}
		
	this.paintHeader()
	this.paintBody()
	this.paintFooter()
	this.paintBands()
	
	this.sections.header.container.trigger("update")
	if(this.sections.footer.container) this.sections.footer.container.trigger("update")
		
	if(this.control.options.viewType !== "cardview") {
		this.sections.body.content.trigger("update-content")
		this.overlay.trigger("resize-check")
		
		this.sections.body.content.scroll(function(event) {
			var scrollTop = $(event.target).scrollTop()
			var scrollLeft = $(event.target).scrollLeft()
			
			self.sections.header.content.scrollLeft(scrollLeft)
			if(self.sections.footer.content) self.sections.footer.content.scrollLeft(scrollLeft)
			self.sections.body.left.scrollTop(scrollTop)
			self.sections.body.right.scrollTop(scrollTop)
		})
	
		desktop.windowResizeWatch(this.overlay)
	
		// $(window).on("resize", function(e) {
			// self.overlay.trigger("resize-check")
		// })	
		
		desktop.Events.OnResizeMenu.add(function(desktop) {
			self.overlay.trigger("resize-check")
		})	
	}
}
	
jGridPainter3.prototype.paintBands = function() {
	this.control.bands.each(function(i, band) {
		band.paint()
	})
}

jGridPainter3.prototype.repaint = function() {
	this.sections.header.left.html("")
	this.sections.header.content.html("")
	this.sections.header.right.html("")
	
	this.overlay.remove()
	this.sections.body.left.remove()
	this.sections.body.content.remove()
	this.sections.body.right.remove()
	
	this.paintBody()
	this.paintBands()
	
	this.sections.header.container.trigger("update")
	if(this.sections.footer.container) this.sections.footer.container.trigger("update")
	this.sections.body.content.trigger("update-content")
	this.overlay.trigger("update")
	
	this.sections.body.content.scroll(function(event) {
		var scrollTop = $(event.target).scrollTop()
		var scrollLeft = $(event.target).scrollLeft()
		
		self.sections.header.content.scrollLeft(scrollLeft)
		if(self.sections.footer.content) self.sections.footer.content.scrollLeft(scrollLeft)
		self.sections.body.left.scrollTop(scrollTop)
		self.sections.body.right.scrollTop(scrollTop)
	})
	
	// this.sections.body.left.html("")
	// this.sections.body.content.html("")
	// this.sections.body.right.html("")
}

jGridPainter3.prototype.update = function() {
	// this will only re-paint the content
	this.control.bands.each(function(i, band) {
		band.painter.update()
	})
}

// jGridPainter3.prototype.calculateResize = function() {
	// if(this.subContainer.outerHeight() > this.tempContainer.outerHeight() && this.resizeMode != -1) {
		// this.resizeMode = -1
		// var height = this.header.outerHeight() + this.footer.outerHeight() + desktop.scrollbarWidth
		// this.overlay.css("height", ("Calc(100% - {0}px)").format(height))
	// } else if(this.subContainer.outerHeight() <= this.tempContainer.outerHeight() && this.resizeMode != 1) {
		// this.resizeMode = 1
		// var height = this.header.outerHeight() + this.footer.outerHeight()
		// this.overlay.css("height", ("Calc(100% - {0}px)").format(height))
	// }
// }

jGridPainter3.prototype.bandMaxLevels = function() {
	var maxLevels = 1
	this.control.bands.each(function(i, band) {
		var count = band.levelCount()
		maxLevels = count > maxLevels ? count : maxLevels
	})

	return maxLevels//+1
}

jGridPainter3.prototype.paintBody = function() {
	var self = this;
	
	this.sections.body.content = CreateElementEx("div", this.mainContainer, function(c) {
		c.addClass("content")
		.attr("section", "content")
		
		if(self.control.options.viewType === "cardview") {
			c.bind("update-content", function() {
			})
		} else {
			c.bind("update-content", function() {
				var leftW = self.sections.body.left.outerWidth()
				var rightW = self.sections.body.right.outerWidth()
				if(leftW > 0 && !self.leftContentFiller) {
					$(this).prepend(self.leftContentFiller = CreateElement("div")
						.addClass("left-content-filler")
						.css("width", leftW)
					)
				}
				if(rightW > 0 && !self.rightContentFiller) {
					$(this).append(self.rightContentFiller = CreateElement("div")
						.addClass("right-content-filler")
						.css("width", rightW)
					)
				}
			})
			self.tempContainer = CreateElement("div", c).addClass("temp-container")	
		}
	})
	
	if(self.control.options.viewType !== "cardview") {
		this.overlay = CreateElementEx("div", this.mainContainer, function(o) {
			o.addClass("overlay")
			.css("z-index", desktop.zIndex++)
			.data("changed", -1)
			.data("header", self.mainHeader)
			// .data("footer", self.mainFooter)
			.data("content", self.sections.body.content)
			.data("temp-container", self.tempContainer)
			.bind("resize-check", function() {				
				var header = $(this).data("header")
				var content = $(this).data("content")
				var tempContainer = $(this).data("temp-container")
				var heightOffset = (content.outerHeight() - tempContainer.outerHeight())
				var topOffset = heightOffset * header.data("header")
				var changed = $(this).data("changed")

				if(changed !== topOffset) {
					var footer = $(this).data("footer")
					
					$(this).data("changed", topOffset)
					$(this).css({
						"top": header.outerHeight(),
						"left": 0,
						"width": ("Calc(100% - {0}px)").format(desktop.scrollbarWidth),
						"height": ("Calc(100% - {0}px)").format(header.outerHeight() + self.mainFooter.outerHeight() + heightOffset)
					})
				}
			})
			
			self.sections.body.left = CreateElementEx("div", o, function(left) {
				left.addClass("fixed-left").attr("fixed-band", "left")
				left.on('mousewheel DOMMouseScroll', function(e) {
					var top = self.sections.body.content.scrollTop()
					self.sections.body.content.scrollTop(top + e.originalEvent.deltaY)
				});
			})
			
			
			CreateElement("div", o).addClass("filler").attr("fixed-band", "filler")
			
			self.sections.body.right = CreateElementEx("div", o, function(right) {
				right.addClass("fixed-right").attr("fixed-band", "right")
				right.on('mousewheel DOMMouseScroll', function(e) {
					var top = self.sections.body.content.scrollTop()
					self.sections.body.content.scrollTop(top + e.originalEvent.deltaY)
				});
			})
		})
	}
	// this.mainHeader.after(this.sections.body.content)
	// this.mainHeader.after(this.overlay)
}

jGridPainter3.prototype.paintToolbar = function(container) {
	var grid = this.control;
	var toolbarContainer = CreateElement("div", container, "", "").attr("grid-sec", "toolbar")

	this.toolbar = new JToolbar({
			container: toolbarContainer,
			css: "toolbar",
			theme: grid.options.toolbar.theme,
			buttonSize: grid.options.toolbar.size
	});	
	
	if(this.control.search.visible) {
		if(grid.search.mode === "simple") {
			CreateElementEx("div", this.toolbar.Painter.buttonContainer, function(search) {
				search.addClass("simple-search")
				search.addClass("ss-theme-" + grid.options.toolbar.theme)
				search.attr("ss-size", grid.options.toolbar.size)
				
				CreateElementEx("div", search, function(inner) {
					inner.attr("ss-sec", "search")
					
					CreateElementEx("input", inner, function(input) {
						input.focusin(function() {
							$(this).parent().attr("ss-focused", "1");
						});
						
						input.focusout(function(e) {
							$(this).parent().removeAttr("ss-focused")
						});
						
						input.change(function() {
							grid.dataParams.set(grid.search.columnName, $(this).val());			
							if(grid.optionsData.cache) 
								grid.localFilter()
							else
								grid.refresh();
						});

						input.focus();
					})
						
					CreateElementEx("div", inner, function(btn) {
						btn.attr("ss-sec", "button")
						desktop.GetSvg(btn, "search", 20, {noTopMargin:true});
					})
				})
				
			})
		}
	}
	
	grid.events.OnInitToolbar.trigger(this.toolbar);
}

jGridPainter3.prototype.paintHeader = function() {
	var self = this;
	var grid = this.control;
	
	this.mainHeader = CreateElementEx("div", this.mainContainer, function(h1) {
		h1.addClass("header");
		
		if(grid.options.showCustomHeader)
				self.customHeader = CreateElementEx("div", h1, function(customHeader) {
					customHeader.addClass("custom-header");
					grid.events.OnDrawCustomHeader.trigger(customHeader);
				})
				
		self.paintToolbar(h1);
		
		self.sections.header.container = CreateElementEx("div", h1, function(h2) {
			h2.addClass("section");
			h2.bind("update", function() {
				self.sections.header.right.css("margin-right", desktop.scrollbarWidth);
			});
			
			self.sections.header.left = CreateElement("div", h2)
				.addClass("left-section")
				.attr("section", "left");
				
			self.sections.header.content = CreateElement("div", h2)
				.addClass("content-section")
				.attr("section", "content");
				
			self.sections.header.right = CreateElement("div", h2)
				.addClass("right-section")
				.attr("section", "right");
		});
	});
}
	
jGridPainter3.prototype.paintFooter = function() {
	var self = this;
	this.mainFooter = CreateElementEx("div", this.mainContainer, function(f1) {
		f1.addClass("footer")
		f1.attr("section", "footer")
		if(self.control.options.showSummary) {
			self.sections.footer.container = CreateElementEx("div", f1, function(f2) {
				self.sections.footer.left = CreateElement("div", f2)
					.addClass("left-section")
					.attr("section", "left")
					
				self.sections.footer.content = CreateElement("div", f2)
					.addClass("content-section")
					.attr("section", "content")
					
				self.sections.footer.right = CreateElement("div", f2)
					.addClass("right-section")
					.attr("section", "right")
					
			}).addClass("section")
			.attr("footer-sec", "table-summary")
			.bind("update", function() {
				self.sections.footer.right.css("margin-right", desktop.scrollbarWidth)
			})
		}
		
		if(self.control.options.showPager) {
			var pagerContainer = CreateElement("div", f1)//.addClass("pager")
			self.control.pager = new jPager({
				container: pagerContainer,
				grid: self.control,
				rowsPerPage: [25,50,75,100]
			});
		}
	})
}

jGridPainter3.prototype.showBusy = function(visible) {
	// if(this.mainContainer)
		visible ? desktop.showBusy(this.mainContainer): desktop.hideBusy(this.mainContainer)
	// else
		// visible ? desktop.showBusy(this.control.parentContainer): desktop.hideBusy();
}

jGridPainter3.prototype.hasLeftPanel = function() {
	return this.control.hasLeftFixedColumns
}

jGridPainter3.prototype.hasRightPanel = function() {
	return this.control.hasRightFixedColumns
}

jGridPainter3.prototype.hoverRow = function(keyID) {
	if(this.control.dataset.keyIsNumeric())
		keyID = parseInt(keyID)

	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.hoverRow(keyID)
	})
}

jGridPainter3.prototype.focusRowByIndex = function(index) {
	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.focusRowByIndex(index)
	})
}

jGridPainter3.prototype.focusRow = function(keyID) {
	if(this.control.dataset.gotoKey(keyID))
		this.control.bands.each(function(i, band) {
			band.painter.contentTable.painter.focusRow(keyID)
		})
	else
		this.focusRowByIndex(0)
}

jGridPainter3.prototype.deleteRow = function(keyID) {
	if(this.control.dataset.gotoKey(keyID))
		this.control.bands.each(function(i, band) {
			band.painter.contentTable.painter.deleteRow(keyID)
		})
}

jGridPainter3.prototype.updateRow = function(keyID) {
	if(this.control.dataset.gotoKey(keyID))
		this.control.bands.each(function(i, band) {
			band.painter.contentTable.painter.updateRow(keyID)
		})
}

jGridPainter3.prototype.updateHeaders = function() {
	this.control.bands.each(function(i, band) {
		band.painter.headerTable.painter.updateHeaders()
	})

}

jGridPainter3.prototype.updateSelectionHeader = function() {
	this.control.bands.each(function(i, band) {
		band.painter.headerTable.painter.updateSelectionHeader()
	})

}

jGridPainter3.prototype.updateSelectionContents = function() {
	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.updateSelectionContents()
	})
}

jGridPainter3.prototype.showMenu = function(id, e) {	
	// console.log("here")
	var self = this;
	new JPopupDialog({
		Target: e,
		Modal: false,
		Painter: {
			painterClass: PopupBalloonPainter,
			color: "orange",
			snap: "bottom",
			align: "",
			inset: false,
			OnRenderHeader: function(dialog, container) {
				desktop.svg.draw(container, "menu").css("height", 24).css("fill", "white")
			},
			OnRenderContent: function(dialog, container) {
			},
			OnRenderFooter: function(dialog, container) {
			}
		}
	})
}

jGridPainter3.prototype.showSelectionOptions = function(e, init) {	
	var self = this;
	new JPopupDialog({
		Target: e,
		Modal: false,
		Painter: {
			painterClass: PopupBalloonPainter,
			color: "orange",
			snap: "bottom",
			align: "",
			inset: false,
			OnRenderHeader: function(dialog, container) {
				desktop.svg.draw(container, "checkbox-multiple-blank").css("height", 24).css("fill", "white")
			},
			OnRenderContent: function(dialog, container) {
				container.css("position", "relative")
				
				var collection = [];
				var menus = {
					add: function(title) {
						var main = {
							add: function(title, url, icon) {
								this.item.subItems.push({icon:icon, title:title, url:url});
							},
							addCommand: function(title, icon, callback) {
								this.item.subItems.push({icon:icon, title:title, callback:callback});
							}
						};
						
						collection.push(main.item = {title:title, subItems:[]});
						return main;
					}
				}
				
				init(menus)
				
				desktop.Painter.createNavigatorMenu({
					container: container,
					theme: "grid-menu",
					menus: collection,
					click: function(e) {
						dialog.Hide()
					},
					init: function(container, item) {
						if(item.url) {
							container.attr("href", item.url)
							container.attr("target", "_blank")
						} else if(item.callback) {
							container.click(item.callback)
						}
					}
				});
				
			},
			OnRenderFooter: function(dialog, container) {
			}
		}
	})
}

jGridPainter3.prototype.showMasterDetail = function(cell) {	
	var row = cell.parent()
	var keyID = row.attr("row-id")
	var firstBandInContent, firstBandInContentFound = false
	this.control.bands.each(function(i, band) {
		if(!firstBandInContentFound && band.fixed === "middle") {
			firstBandInContent = band
			firstBandInContentFound = true
		}
		
		band.painter.contentTable.painter.showMasterDetail(keyID)
	})

	// var firstColumn = this.control.bands.getByIndex(0).painter.contentTable.painter.getMasterDetailFirstColumn(keyID)
	var firstColumn = firstBandInContent.painter.contentTable.painter.getMasterDetailFirstColumn(keyID)
	var self = this
	CreateElementEx("div", firstColumn, function(c1) {
		c1.addClass("master-detail-main")
		CreateElementEx("div", c1, function(c2) {
			c2.data("key-id", keyID)
			c2.addClass("master-detail-container")
			var width = 0
			self.control.eachColumn(function(column) {
				if(column.band.fixed === "middle" && column.fixedWidth)
					width += column.width
			})
			
			c2.css("width", width)
			
			var params = {
				container: c2,
				setHeight: function(height) {
					self.control.bands.each(function(i, band) {
						band.painter.contentTable.painter.setMasterDetailHeight(keyID, height)
					})
				},
				setWidth: function(width) {
					c2.css("width", width)
				}
			}
			
			self.control.events.OnMasterDetail.trigger(params)
		})
	})
}

jGridPainter3.prototype.hideMasterDetail = function(cell) {	
	var row = cell.parent()
	var keyID = row.attr("row-id")
	
	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.hideMasterDetail(keyID)
	})
}

jGridPainter3.prototype.setRowVisible = function(keyID, visible) {
	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.setRowVisible(keyID, visible)
	})
}

jGridPainter3.prototype.showEditDialog = function(params) {	
	var self = this;
	var title = defaultValue(this.control.methods.call("editTitle", params.mode));
	if(!title) {
		if(params.mode == "edit")
			title = "Edit"
		else if(params.mode == "new")
			title = "Add Record"
	};
	
	this.control.dataEdit.editDialog = this.control.editDialog = new JEditDialog2({
		// Target: this.parentContainer,
		// Target: $("body"),
		Target: $("#sub-data-container"),
		ActivatingTarget: params.target,
		Modal: false,
		OnInit: function(dialog) {
			// dialog.editor.Events.OnPostSuccess.add(function(editor, info) {
				// if(info)
					// InfoDialog({
						// target: self.control.toolbar.container,
						// title: "Information",
						// message: info,
						// snap: "bottom",
						// inset: false
					// });
				
				// desktop.hideBusy()
				// self.control.Refresh();
			// });
			dialog.editor.Events.OnPostSuccess2.add(function(editor, updateRecord) {
				// TODO
				// self.control.dataset.syncRecord(updateRecord)
				// self.updateRow(self.control.dataset.getKey());
				// self.repaint();
				
				self.control.Refresh();
			});
			
			dialog.editor.Events.OnPostSuccess.add(function(editor, info) {
				if(info)
					InfoDialog({
						target: self.control.toolbar.container,
						title: "Information",
						message: info,
						snap: "bottom",
						inset: false
					});
				
				desktop.hideBusy()
				// self.control.Refresh();
			});
			
			// console.log(dialog.busiIcon)
			dialog.busiIcon.remove();
		},
		Painter: {
			snap: "bottom",
			align: "",
			width: defaultValue(self.control.options.editDialogWidth, 500),
			inset: true,
			autoHeight: true,
			OnRenderContent: function(dialog, container) {
				var c = CreateElement("div", container)
					.css("width", "100%")

				params.editForm(c, dialog); // refer to jGrid.prototype.editRecord
			},
			OnRenderHeader: function(dialog, container) {
				// container.html(title);
				var label = CreateElementEx("label", container).html(title);
				CreateElementEx("div", container, function(icon) {
					icon.attr("header-sec", "icon");
					desktop.svg.draw(icon, "refresh");
					
					dialog.busiIcon = icon;
					// save the icon element, we will remove it later adter loaded
				})
				
				new JDrag(container, container, {
				// new JDrag(label, label, {
					Moving: true,
					Sizing: false,
					SizeOffset: 1,
					AllowDrag: function(s) {
						return true;
					},
					AllowSize: function(s) {
						return false;
					},
					InitDrag: function(s, ready) {
						if(ready) {
							op = container.parent().parent().offset();
						}
					},
					Dragging: function(s, x, y, w, h) {
						container.parent().parent()
							.css("top", op.top+y)
							.css("left", op.left+x)
					},
					DragEnd: function(s) {
					}
				});
			}
		}
	});
};

jGridPainter3.prototype.showAdvancedSearch = function() {
	var grid = this.control;
	
	this.toolbar.NewDropdownItem({
		id: "search",
		icon: "search",
		iconColor: "#315B8F",
		color: "#315B8F",
		hint: "Advanced Search",
		align: "right",
		onClose: function(dialog) {
			grid.dataParams.unbindControls();
		},
		painter: {
			footer: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "Start Search",
					style: "green",
					click: function(button) {
						if(button.enabled)
							grid.Refresh();
					}
				});
				
				CreateButton({
					container: container,
					caption: "Clear",
					style: "blue",
					click: function(button) {
						if(button.enabled)
							grid.dataParams.Events.OnClearSearch.trigger(grid);
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
				container.css("width", grid.search.searchWidth);
				new FormEditor({
					id: "xxx",
					dataset: grid.dataParams,
					dialog: dialog,
					container: container,
					containerPadding: 0,
					fillContainer: true,
					pageControlTheme: "main",
					showToolbar: false,
					url: "",
					init: function(editor) {
						grid.Events.OnInitSearch.trigger(editor);
					}
				});
			}
		}
	});
}
