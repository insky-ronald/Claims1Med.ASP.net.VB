// *************************************************************************************************
// File name: dbgrid-painters.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// jGridPainter
//**************************************************************************************************
Class.Inherits(jGridPainter, jBasePainter);
function jGridPainter(params) {
	jGridPainter.prototype.parent.call(this, params);
};

jGridPainter.prototype.classID = "jGridPainter";

jGridPainter.prototype.initialize = function(params) {
    jGridPainter.prototype.parent.prototype.initialize.call(this, params);
	
	// this.params.size = defaultValue(params.size, "250px")
	// this.params.fixed = defaultValue(params.fixed, true)
	// this.params.noBorder = defaultValue(params.noBorder, false)
	// this.params.orientation = defaultValue(params.orientation, "vert")
};

jGridPainter.prototype.paint = function(container) {
    jGridPainter.prototype.parent.prototype.paint.call(this, container);
		
	var self = this;
	this.mainContainer = this.creaMainContainer(container, "grid2", this.control.paintParams.theme)
		.on("mouseleave", function() {
			self.control.bands.each(function(i, band) {
				band.painter.mouseLeave()
			})
		})
	
	// console.log(this.control.paintParams)
	if(this.hasLeftPanel()) {
		this.leftSection = new jGridSectionPainter({control:this.control, fixed:"left", header:this.headerSectionContainer, content:this.mainContainer, footer:undefined})
	}

	this.middleSection = new jGridSectionPainter({control:this.control, fixed:"middle", header:this.headerSectionContainer, content:this.mainContainer, footer:undefined})
	
	if(this.hasRightPanel()) {
		this.rightSection = new jGridSectionPainter({control:this.control, fixed:"right", header:this.headerSectionContainer, content:this.mainContainer, footer:undefined})
	}
	
	if(this.leftSection || this.rightSection ) {
		this.overlay = CreateElement("div", this.mainContainer)
			.attr("grid-sec", "overlay")
	}
	
	this.paintHeader(this.header = CreateElement("div", this.mainContainer, "", "")
		.attr("grid-sec", "main-header")
	)
	
	this.paintBody(this.subContainer = CreateElement("div", this.mainContainer, "", "")
		.attr("grid-sec", "sub-container")
	)
	
	this.paintFooter(this.footer = CreateElement("div", this.mainContainer, "", "")
		.attr("grid-sec", "main-footer")
	)

	this.paintGrid()

	this.recomputeDimensions()
	
	this.resizeMode = 0
	this.calculateResize()
	$(window).on("resize", function(e) {
		self.calculateResize()
	})
	
	desktop.Events.OnResizeMenu.add(function(desktop) {
		self.calculateResize()
	})
	
	this.subContainer.scroll(function(event) {
		var scrollTop = $(event.target).scrollTop()
		var scrollLeft = $(event.target).scrollLeft()

		self.middleSection.scroll(scrollLeft)

		if(self.leftSection)
			self.leftSection.scroll({top: -scrollTop})
		
		if(self.rightSection)
			self.rightSection.scroll({top: -scrollTop})
	})	
	
}

jGridPainter.prototype.recomputeDimensions = function() {
		var leftOffset = 0, rightOffset = 0, widthAdjustment = 0
		if(this.leftSection) {
			leftOffset = this.leftSection.width()
			widthAdjustment = this.leftSection.width()+desktop.scrollbarWidth
		} else {
			widthAdjustment = desktop.scrollbarWidth
		}
		
		if(this.rightSection) {
			rightOffset = this.rightSection.width()
			
			this.rightSection.header.css("right", desktop.scrollbarWidth)
			
			if(this.rightSection.footer)
				this.rightSection.footer.css("right", desktop.scrollbarWidth)
		}

		this.middleSection.content.css("left", leftOffset)
		this.middleSection.content.css("padding-right", rightOffset)
		
		if(this.middleSection.header) {
			this.middleSection.header.css("left", leftOffset)
			this.middleSection.header.css("padding-right", rightOffset)
			this.middleSection.header.css("width", ("Calc(100% - {0}px").format(widthAdjustment))
		}
		
		if(this.middleSection.footer) {
			this.middleSection.footer.css("left", leftOffset)
			this.middleSection.footer.css("padding-right", rightOffset)
			this.middleSection.footer.css("width", ("Calc(100% - {0}px").format(widthAdjustment)
		}
		
		if(this.overlay) {
			var height = this.header.outerHeight() + this.footer.outerHeight()
			if(this.control.options.horzScroll) height += desktop.scrollbarWidth
				
			this.overlay.css({
				"top": this.header.outerHeight(),
				"z-index": desktop.zIndex += 1,
				"width": ("Calc(100% - {0}px").format(desktop.scrollbarWidth),
				"height": ("Calc(100% - {0}px").format(height)
			})
		}
		
		if(this.footer)
			this.subContainer
				.css("height", ("Calc(100% - {0}px").format(this.header.outerHeight() + this.footer.outerHeight()))
		else
			this.subContainer
				.css("height", ("Calc(100% - {0}px").format(this.header.outerHeight()))
				
		// var self = this
		// this.resizeMode = 0
		// this.calculateResize()
		// $(window).on("resize", function(e) {
			// self.calculateResize()
		// })
}

jGridPainter.prototype.calculateResize = function() {
	if(this.subContainer.outerHeight() > this.tempContainer.outerHeight() && this.resizeMode != -1) {
		this.resizeMode = -1
		var height = this.header.outerHeight() + this.footer.outerHeight() + desktop.scrollbarWidth
		this.overlay.css("height", ("Calc(100% - {0}px)").format(height))
	} else if(this.subContainer.outerHeight() <= this.tempContainer.outerHeight() && this.resizeMode != 1) {
		this.resizeMode = 1
		var height = this.header.outerHeight() + this.footer.outerHeight()
		this.overlay.css("height", ("Calc(100% - {0}px)").format(height))
	}
}

jGridPainter.prototype.bandMaxLevels = function() {
	var maxLevels = 1
	this.control.bands.each(function(i, band) {
		var count = band.levelCount()
		maxLevels = count > maxLevels ? count : maxLevels
		// maxLevels = (let count = band.levelCount()) > maxLevels ? count : maxLevels
	})

	return maxLevels//+1
}

jGridPainter.prototype.paintGrid = function() {
	this.control.bands.each(function(i, band) {
		band.paint()
	})
}

jGridPainter.prototype.update = function() {
	// this will only re-paint the content
	this.control.bands.each(function(i, band) {
		band.painter.update()
	})
	
	// this.recomputeDimensions()
}

jGridPainter.prototype.paintHeader = function(container) {
	var toolbarContainer = CreateElement("div", container, "", "")
		.attr("grid-sec", "toolbar")
	
	this.toolbar = new JToolbar({
			// id: "tb",
			// container: container,
			container: toolbarContainer,
			css: "toolbar",
			// theme: "default",
			theme: this.control.options.toolbarTheme,
			buttonSize: this.control.options.toolbarSize
			// Css: "toolbar",
			// Css: this.ToolbarCss,
			// Page: this,
			// Painter: {
				// buttonPainterClass: ToolbuttonPainter
			// }
	});	
	
	this.control.events.OnInitToolbar.trigger(this.toolbar);
	
	this.headerSectionContainer = CreateElement("div", container, "", "")
		.attr("grid-sec", "section-container")
		
		if(this.hasLeftPanel())
			this.leftSection.paintHeader(this.headerSectionContainer)
			
		this.middleSection.paintHeader(this.headerSectionContainer)
				
		if(this.hasRightPanel())
			this.rightSection.paintHeader(this.headerSectionContainer)
}
	
jGridPainter.prototype.paintFooter = function(container) {
	if(this.control.options.showSummary) {
		this.footerSectionContainer = CreateElement("div", container, "", "")
			.attr("grid-sec", "section-container")
			
			if(this.hasLeftPanel())
				this.leftSection.paintFooter(this.footerSectionContainer)
				
			this.middleSection.paintFooter(this.footerSectionContainer)
					
			if(this.hasRightPanel())
				this.rightSection.paintFooter(this.footerSectionContainer)
	}
		
	// var pagerContainer = CreateElement("div", container, "", "pager-container")
	var pagerContainer = CreateElement("div", container, "", "")
	this.control.pager = new jPager({
		container: pagerContainer,
		grid: this.control,
		rowsPerPage: [25,50,75,100]
	});
}
	
jGridPainter.prototype.paintBody = function(container) {
	var self = this
	
	this.tempContainer = CreateElement("div", container).css({
		"width": "100%",
		"height": "100%",
		"display": "hidden"
	}).attr("grid-sec", "temp")
		
	if(this.hasLeftPanel()) {
		this.leftSection.paintContent(this.overlay)
		this.leftSection.content.on('mousewheel DOMMouseScroll', function(e){
			var top = self.middleSection.content.parent().scrollTop()
			self.middleSection.content.parent().scrollTop(top + e.originalEvent.deltaY)
		});
	}

	this.middleSection.paintContent(container)
				
	if(this.hasRightPanel()) {
		this.rightSection.paintContent(this.overlay)
		this.rightSection.content.on('mousewheel DOMMouseScroll', function(e){
			var top = self.middleSection.content.parent().scrollTop()
			self.middleSection.content.parent().scrollTop(top + e.originalEvent.deltaY)
		});
	}
}

jGridPainter.prototype.showBusy = function(visible) {
	if(visible) {
		// this.busyContainer = CreateElement("div", this.control.parentContainer, "", "busy")
		// var inner1  = CreateElement("div", this.busyContainer).attr("x-sec", "inner-1")
		// var inner2  = CreateElement("div", inner1).attr("x-sec", "inner-2")
			// .css("background", "rgba(0,0,0,0.25)")
			// .css("animation", "spin 1s linear infinite")
			
		// desktop.GetSvg(inner2, "refresh")
		
		this.busyContainer = CreateElement("div", this.control.parentContainer, "", "busy2")
		desktop.GetSvg(this.busyContainer, "refresh")
		
	} else if(this.busyContainer) {
		this.busyContainer.remove()
	}
}

jGridPainter.prototype.hasLeftPanel = function() {
	return this.control.hasLeftFixedColumns
}

jGridPainter.prototype.hasRightPanel = function() {
	return this.control.hasRightFixedColumns
}

jGridPainter.prototype.hoverRow = function(keyID) {
	var id = parseInt(keyID)
	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.hoverRow(id)
	})
}

jGridPainter.prototype.focusRowByIndex = function(index) {
	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.focusRowByIndex(index)
	})
}

jGridPainter.prototype.focusRow = function(keyID) {
	if(this.control.dataset.gotoKey(keyID))
		this.control.bands.each(function(i, band) {
			band.painter.contentTable.painter.focusRow(keyID)
		})
	else
		this.focusRowByIndex(0)
}

jGridPainter.prototype.updateHeaders = function() {
	this.control.bands.each(function(i, band) {
		band.painter.headerTable.painter.updateHeaders()
	})

}

jGridPainter.prototype.updateSelectionHeader = function() {
	this.control.bands.each(function(i, band) {
		band.painter.headerTable.painter.updateSelectionHeader()
	})

}

jGridPainter.prototype.updateSelectionContents = function() {
	this.control.bands.each(function(i, band) {
		band.painter.contentTable.painter.updateSelectionContents()
	})
}

jGridPainter.prototype.showMenu = function(id, e) {	
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

jGridPainter.prototype.showSelectionOptions = function(e, init) {	
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
