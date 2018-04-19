// *************************************************************************************************
// File name: utils-table.js
// Last modified on
// 19-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
{ // jTable
//**************************************************************************************************
	Class.Inherits(jTable, jControl)
	function jTable(params) {
		jTable.prototype.parent.call(this, params)
	}

	jTable.prototype.classID = "jTable"
	jTable.prototype.painterClass = undefined
	jTable.prototype.paintImediately = true

	jTable.prototype.initialize = function(params) {
		jTable.prototype.parent.prototype.initialize.call(this, params)
		
		this.band = params.band
		this.grid = params.band.grid
		this.dataset = params.band.grid.dataset
		// console.log("here")
	}

	jTable.prototype.attr = function(name, value) {
		this.painter.table.attr(name, value)
	}

	jTable.prototype.css = function(name, value) {
		this.painter.table.css(name, value)
	}

	jTable.prototype.paintData = function() {
		this.painter.paintData()
	}

	// marge all columns from children bands of this band
	jTable.prototype.gatherColumns = function() {
		var columns = new JList()
		
		var gather = function(band) {
			band.bands.each(function(i, band) {
				gather(band)
			})
			
			band.columns.each(function(i, column) {
				columns.add(column.fname, column)
			})
		}
		
		gather(this.band)

		return columns;
	}

	jTable.prototype.countBandColumns = function(band) {
		var columns = 0 //band.columns.count()
		
		// if(band) {
			var gather = function(band) {
				band.bands.each(function(i, band) {
					gather(band)
				})
				
				columns += band.columns.count()
			}
			
			if(band)
				gather(band)
			else
				gather(this.band)
		// }
		
		// this.log(columns)
		return columns;
	}
} // jTable

//**************************************************************************************************
// jCardViewPainter
//**************************************************************************************************
Class.Inherits(jCardViewPainter, jBasePainter)
function jCardViewPainter(params) {
	jCardViewPainter.prototype.parent.call(this, params)
}

jCardViewPainter.prototype.type = "grid"
jCardViewPainter.prototype.classID = "jCardViewPainter"

jCardViewPainter.prototype.drawRow = function(row) {
}

jCardViewPainter.prototype.mouseLeave = function() {
}

jCardViewPainter.prototype.doPaint = function(update) {
	var self = this;
	var grid = this.control.grid;
	var dataset = grid.dataset;
	
	dataset.each(function(row, rowNo) {
		CreateElementEx("div", self.parentContainer, function(card) {
			card.addClass("card");
			card.attr("grid-sec", "card");
			card.attr("row-id", dataset.getKey(rowNo));
			
			grid.events.OnInitCard.trigger(card);
		})
	});
}

jCardViewPainter.prototype.update = function() {
	// console.log("update")
	this.parentContainer.html("");
	this.doPaint(true)
}

jCardViewPainter.prototype.paint = function() {
    jCardViewPainter.prototype.parent.prototype.paint.call(this)
	this.doPaint(false)
}

jCardViewPainter.prototype.focusRowByIndex = function() {
}

jCardViewPainter.prototype.updateSelectionContents  = function() {
}

//**************************************************************************************************
// jTableBasePainter
//**************************************************************************************************
Class.Inherits(jTableBasePainter, jBasePainter)
function jTableBasePainter(params) {
	jTableBasePainter.prototype.parent.call(this, params)
}

jTableBasePainter.prototype.type = "grid"
jTableBasePainter.prototype.classID = "jTableBasePainter"

jTableBasePainter.prototype.getContent = function(column) {
	return ""
}

jTableBasePainter.prototype.drawCell = function(cell, column) {
	cell.addClass("cell")
	// if(column.command)
		// cell.addClass("command-cell")
	// else
		// cell.addClass("cell")
}

jTableBasePainter.prototype.createRow = function() {
	return CreateElement("tr", this.body)
		.addClass("row")
		.attr("grid-sec", "row")
}

jTableBasePainter.prototype.drawRow = function(row) {
}

jTableBasePainter.prototype.mouseLeave = function() {
}

jTableBasePainter.prototype.doPaint = function(update) {
	if(update)
		this.table.remove()
	else
		this.container = CreateElement("div", this.parentContainer)
			.addClass("band")
			.attr("grid-sec", "band")
			.attr("band", this.control.band.id)
			
	// if(!this.control.grid.options.autoScroll)
	if(!this.control.grid.options.horzScroll)
		this.container.css("flex", 1)
			
	if(this.control.band.filler) {
		this.container.addClass("band-filler")
		this.container.css("flex-grow", "1")
		this.container.css("flex-shrink", "1")
	}
	
	this.table = CreateElement("table", this.container)
		.addClass("data-table")
		.attr("table-sec", "main")
		.attr("grid-sec", this.control.params.section)
		.attr("border", 0)
		.attr("cellspacing", 0)
		.attr("cellspacing", 0)
		
	if(this.classID === "jTableHeaderPainter" ) {
		this.table.attr("band-sec", "header")
	} else if(this.classID === "jTableContentPainter" ) {
		this.table.attr("band-sec", "content")
	} else if(this.classID === "jTableFooterPainter" ) {
		this.table.attr("band-sec", "footer")
	}
		
	this.colGroup = CreateElement("colgroup", this.table)
	
	var self = this, columns = this.control.gatherColumns()
	this.tableWidth = 0	
	columns.each(function(i, column) {
		self.tableWidth += column.width
	})
	columns.each(function(i, column) {
		var col = CreateElement("col", self.colGroup)
			.css("white-space", "nowrap")
			.css("overflow", "hidden")
			
		if(column.fixedWidth)
			col.css({
				"width": column.width,
				"min-width": column.width,
				"max-width": column.width
			})
		else if(typeof column.width === "string")
			col.css("width", column.width)
		else
			col.css({
				"width": (column.width / self.tableWidth * 100) + "%"
			})

		if(self.classID === "jTableHeaderPainter" )
			column.colGroupHeader = col
		else if(self.classID === "jTableContentPainter" )
			column.colGroupContent = col
		else if(self.classID === "jTableFooterPainter" )
			column.colGroupFooter = col		
		else
			column.colGroup = col
	})
	
		
	if(this.control.band.filler) {
		this.table.css("width", "100%")
	} else {
		if(this.control.params.mainSection === "middle" && !this.control.grid.options.horzScroll) {		
			this.container.css("width", "100%")
			this.table.css("width", "100%")
		} else	
			this.table.css("width", this.tableWidth)
	}
	
	this.body = CreateElement("tbody", this.table).attr("grid-sec", "data")
}

jTableBasePainter.prototype.update = function() {
	this.doPaint(true)
}

jTableBasePainter.prototype.paint = function() {
    jTableBasePainter.prototype.parent.prototype.paint.call(this)
	this.doPaint(false)
}

jTableBasePainter.prototype.getCommandHeaderIcon = function(column, noDefault) {
	var icon = this.control.grid.methods.call("getCommandHeaderIcon", column)
	
	if(!icon && !noDefault)
		return this.getCommandIcon(column)
	else
		return icon		
}

jTableBasePainter.prototype.getCommandIcon = function(column) {
	return this.control.grid.methods.call("getCommandIcon", column)
}

jTableBasePainter.prototype.getCommandHint = function(column) {
	// return this.control.grid.methods.call("getCommandHint", column) || "..."
	return this.control.grid.methods.call("getCommandHint", column) || ""
}

jTableBasePainter.prototype.setCommandHint = function(cell, column) {
	var hint = this.getCommandHint(column);
	if(hint) {
		// cell.data("hintTarget", column.colHeader);
		// desktop.SetHint(cell.data("hintTarget", column.colHeader), hint, "top")
		desktop.SetHint(cell.data("hintTarget", cell), hint, "top")
	}
}

//**************************************************************************************************
// jTableHeaderFooterPainter
//**************************************************************************************************
Class.Inherits(jTableHeaderFooterPainter, jTableBasePainter)
function jTableHeaderFooterPainter(params) {
	jTableHeaderFooterPainter.prototype.parent.call(this, params)
}

jTableHeaderFooterPainter.prototype.type = "grid"
jTableHeaderFooterPainter.prototype.classID = "jTableHeaderFooterPainter"

jTableHeaderFooterPainter.prototype.drawCell = function(cell, column) {
	jTableHeaderFooterPainter.prototype.parent.prototype.drawCell.call(this, cell, column)
		
	var self = this
	
	if(column.command) {
		// cell.attr("header-sec", "command")
		// cell.attr("command", column.command)
		// desktop.svg.draw(cell, this.control.grid.methods.call("getCommandIcon", column))
	} else {
		CreateElementEx("table", cell, function(table) {
			table.addClass("header-table")
				.attr("header-sec", "header")
				.attr("border", 0)
				.attr("cellspacing", 0)
				.attr("cellspacing", 0)
				
			CreateElementEx("tbody", table, function(body) {
				self.content = CreateElementEx("tr", body, function(row) {
					self.label = CreateElementEx("td", row, function(label) {
						label.addClass("header-label")
						label.attr("header-sec", "label")
						label.html(self.getContent(column))
					})
				})
			})
		})
	}
}

//**************************************************************************************************
// jTableHeaderPainter
//**************************************************************************************************
Class.Inherits(jTableHeaderPainter, jTableHeaderFooterPainter)
function jTableHeaderPainter(params) {
	jTableHeaderPainter.prototype.parent.call(this, params)
}

jTableHeaderPainter.prototype.type = "grid"
jTableHeaderPainter.prototype.classID = "jTableHeaderPainter"

jTableHeaderPainter.prototype.getContent = function(column) {
	var dbCol = column.grid.dataset.columnByName(column.fname)
	if(dbCol)
		return dbCol.label
	else
		return ""
}

jTableHeaderPainter.prototype.paint = function() {
    jTableHeaderPainter.prototype.parent.prototype.paint.call(this)

	var self = this
	
	if(this.control.grid.options.showBand) {
		var matrix = []
		var rowCount = this.control.grid.painter.bandMaxLevels()		
		var colCount = this.control.countBandColumns(this.band)
		
		for(var r = 0; r < rowCount; r++) {
			var row = CreateElement("tr", this.body)
				.addClass("row")
				.addClass("band-row")
				.attr("grid-sec", "band-row")
				
			matrix.push([])
			
			for(var c = 0; c < colCount; c++) {
				var col = CreateElement("td", row)
					.addClass("cell")
					.addClass("band-cell")
					.attr("grid-sec", "band-header")
					.attr("used", "0")
					
				matrix[r].push(col)
			}
		}
		
		var gather = function(band, pos) {
			band.pos = pos
			var columnCount = self.control.countBandColumns(band)
			var col = matrix[band.level-1][pos]
						.attr("colspan", columnCount)
						.attr("used", "1")
						.html(band.caption)
			
			var levels = self.control.grid.painter.bandMaxLevels()
			if(band.bands.count() == 0 && band.level < levels) 
				col.attr("rowspan", levels-band.level+1)
			else {
				var p = 0
				band.bands.each(function(i, band) {
					gather(band, p + band.band.pos)
					p += (self.control.countBandColumns(band))
				})
			}
				
		}
		
		gather(this.control.band, 0)
		
		this.table.find("td[used='0']").each(function(i, e) {
			$(e).remove()
		})
	}
	
	// this.row = CreateElement("tr", this.body).attr("grid-sec", "row")
	this.row = this.createRow()
	
	var columns = this.control.gatherColumns()
	columns.each(function(i, column) {
		var cell = CreateElement("td", self.row).attr("grid-sec", "data")
		self.drawCell(cell, column)
	})
}

jTableHeaderPainter.prototype.updateHeaders = function() {
	this.table.find("td[grid-sec='sort']").each(function(i, e) {
		$(e).trigger("update")
	})
}

jTableHeaderPainter.prototype.updateSelectionHeader = function() {
	this.table.find("td[command='select']").each(function(i, e) {
		$(e).trigger("update")
	})
}

jTableHeaderPainter.prototype.drawCell = function(cell, column) {
	jTableHeaderPainter.prototype.parent.prototype.drawCell.call(this, cell, column)
	var self = this;
	cell.addClass("header-cell")
		
	column.colHeader = cell
	cell.data("column", column)
	
	if(column.command) {
		// this.setCommandHint(cell, column)
		cell.addClass("command-cell")
		cell.attr("command", column.command)
		if(column.internal) {
			if(column.command == "select") {
				cell.on("update", function() {
					$(this).html("")
					if(column.grid.selections.length == 0) {
						$(this).attr("select-mode", "none")
						desktop.svg.draw($(this), "checkbox-multiple-blank")
					} else if(column.grid.selections.length == column.grid.row_count) {
						$(this).attr("select-mode", "all")
						desktop.svg.draw($(this), "checkbox-multiple-marked-all")
					} else {
						$(this).attr("select-mode", "some")
						desktop.svg.draw($(this), "checkbox-multiple-marked-some")
					}
				}).click(function() {
					$(this).data("column").grid.showSelectionOptions($(this), function(menu) {
						var selection = menu.add("Selection")
						selection.addCommand("Clear all selections", "checkbox-multiple-blank", function() {
							column.grid.selections = []
							column.grid.painter.updateSelectionHeader()
							column.grid.painter.updateSelectionContents()
							column.grid.updateSelections()
						})
						selection.addCommand("Clear all selections in this page", "checkbox-multiple-marked-some", function() {
							column.grid.dataset.each(function(row, i) {
								var index = column.grid.selections.indexOf(row[column.grid.dataset.primaryKey])
								if(index > -1)
									column.grid.selections.splice(index, 1)
							})
							column.grid.painter.updateSelectionHeader()
							column.grid.painter.updateSelectionContents()
							column.grid.updateSelections()
						})
						selection.addCommand("Select all in this page", "checkbox-multiple-marked-all", function() {
							column.grid.dataset.each(function(row, i) {
								column.grid.selections.push(row[column.grid.dataset.primaryKey])
							})
							column.grid.painter.updateSelectionHeader()
							column.grid.painter.updateSelectionContents()
							column.grid.updateSelections()
						})
					})
				})
			// } else if(column.command == "master-detail") {
				// command = desktop.svg.draw(cell, this.getCommandHeaderIcon(column))
			} else {
				// desktop.svg.draw(cell, "db-" + column.command)
				desktop.svg.draw(cell, this.getCommandHeaderIcon(column))
			}
		} else {
			// this.setCommandHint(cell, column)
			desktop.svg.draw(cell, this.getCommandHeaderIcon(column))
		}
		
		return
	} 
	
	if(column.allowSort) {
		CreateElementEx("td", this.content, function(btn) {
			btn.addClass("header-icon")
			btn.data("column", column)
			btn.attr("header-sec", "icon")
			btn.attr("grid-sec", "sort")
			desktop.svg.draw(btn, "db-sort")
		}).on("update", function() {
			var column = $(this).data("column")
			var order = self.control.grid.dataParams.get("order")
			
			$(this).find("svg").remove()
			if(self.control.grid.dataParams.get("sort") === column.fname) {
				$(this).attr("sorted", "1")
				$(this).attr("sort-order", order)
				if(order === "asc")
					desktop.svg.draw($(this), "chevron-up")
				else
					desktop.svg.draw($(this), "chevron-down")
			} else {
				$(this).attr("sorted", "0")
				$(this).attr("sort-order", "")
				desktop.svg.draw($(this), "db-sort")
			}
		}).click(function() {
			var column = $(this).data("column")
			var order = $(this).attr("sort-order")
			
			self.control.grid.dataParams.set("sort", column.fname)
			if(order === "asc")
				self.control.grid.dataParams.set("order", "desc")
			else 
				self.control.grid.dataParams.set("order", "asc")
			
			self.control.grid.refresh()
		})
	}
		
	if(column.allowFilter) {
		var sort = CreateElement("div", this.content)
			.attr("grid-sec", "filter")
	}
	
	{ // Resizing column
		var self = this;
		cell.on("mousemove", function() {
			// var target = $(event.target);
			var target = $(this);
			var xy = target.offset();
			var x = event.pageX - xy.left + 1;
			// var y = event.pageY - xy.top + 1;
			var w = target.outerWidth();
			// var h = target.outerHeight();
			
			if(x >= w-2 && x <= w) {
				target.css("cursor", "col-resize")
				target.data("sizing-ready", true)
			} else {
				target.css("cursor", "")
				target.data("sizing-ready", false)
			}
		})
		
		cell.on("mousedown", function() {
			var target = $(this);
			if(target.data("sizing-ready") {
				var xy = target.offset();
				var xy2 = self.parentContainer.offset();
				var x = event.pageX - xy.left + 1;
				var y = event.pageY - xy.top + 1;
				var w = target.outerWidth();
				var h = target.outerHeight();
				
				// console.log({xy:xy, xy2:xy2})
				
				var sizer = CreateElement("div", self.control.grid.painter.mainContainer)
					.css("position", "fixed")
					.css("top", xy2.top)
					.css("left", xy.left + w)
					.css("width", 3)
					.css("height", self.control.grid.painter.mainContainer.outerHeight()
									- self.control.grid.painter.mainHeader.outerHeight()
									- self.control.grid.painter.mainFooter.outerHeight()
									+ self.table.outerHeight()
									)
					// .css("height", 200)
					.css("background", "rgba(0,0,0,0.25)")
					.css("z-index", desktop.zIndex++)
					
				target.data("sizer", sizer)
				
				// self.control.grid.painter.leftSection.contentContainer.css("pointer-events", "none")
				$("#desktop-container").css("pointer-events", "none")
				$("body").css("cursor", "col-resize")
				
				$("body").on("mouseup", function() {
					var sizer = target.data("sizer")
					if(sizer) {
						var x = event.pageX
						var xy = target.offset()
						
						if(sizer && x - xy.left > 0) {
							var width = x - xy.left
							
							// console.log(target.data("column").colGroupHeader)
							// console.log(target.data("column").colGroupContent)
							// console.log(target.data("column").colGroupFooter)
							
							if(target.data("column").colGroupHeader)
								target.data("column").colGroupHeader
									.css("width", width)
									.css("max-width", width)
									.css("min-width", width)
								
							if(target.data("column").colGroupContent)
								target.data("column").colGroupContent
									.css("width", width)
									.css("max-width", width)
									.css("min-width", width)
								
							if(target.data("column").colGroupFooter)
								target.data("column").colGroupFooter
									.css("width", width)
									.css("max-width", width)
									.css("min-width", width)
								
							// console.log({width:target.data("column").colGroup.width(), newWidth:width})
							// target.data("column").colGroup.css("width", width)
						}
						
						target.data("sizer").remove()
						target.removeData("sizer")
						target.removeData("sizing-ready")
						
						$("body").off("mouseup") // important! turn off					
						$("body").off("mousemove") // important! turn off					
						$("body").css("cursor", "")
						$("#desktop-container").css("pointer-events", "")
						
						// console.log("done")
					}
				})
				
				$("body").on("mousemove", function() {
					var xy = target.offset();
					var x = event.pageX;
					var y = event.pageY;
					var sizer = target.data("sizer")
					if(sizer && x - xy.left > 0) {
						sizer.css("left", x)
						xy.width = x - xy.left
						
					}
					// console.log(xy)
				})
			}
		})
		
		// cell.on("mouseup", function() {
			// var target = $(this)
			// if(target.data("sizer")) {
				// target.data("sizer").remove()
				// target.removeData("sizer")
			// }
		// })
	} // Resizing column
}

//**************************************************************************************************
// jTableFooterPainter
//**************************************************************************************************
Class.Inherits(jTableFooterPainter, jTableHeaderFooterPainter)
function jTableFooterPainter(params) {
	jTableFooterPainter.prototype.parent.call(this, params)
}

jTableFooterPainter.prototype.type = "grid"
jTableFooterPainter.prototype.classID = "jTableFooterPainter"

jTableFooterPainter.prototype.getContent = function(column) {
	// return "..."
	return ""
}

jTableFooterPainter.prototype.drawCell = function(cell, column) {
	jTableFooterPainter.prototype.parent.prototype.drawCell.call(this, cell, column)	
	cell.addClass("footer-cell")
	if(column.showFooter) {
		cell.addClass("footer-enabled");
		if(this.control.grid.footerData) {
			cell.html(this.control.grid.footerData.text(column.fname));
			if(this.control.grid.footerData.Columns.get(column.fname).numeric)
				cell.addClass("cell-numeric")
		};
	}
}

jTableFooterPainter.prototype.paintContent = function(update) {
	var self = this
	// this.row = CreateElement("tr", this.body).attr("grid-sec", "row")
	if(update) this.row.remove();
	this.row = this.createRow()
	
	var columns = this.control.gatherColumns()
	// this.control.band.columns.each(function(i, column) {
	columns.each(function(i, column) {
		var cell = CreateElement("td", self.row).attr("grid-sec", "data")
		self.drawCell(cell, column)
	})
};

jTableFooterPainter.prototype.paint = function() {
    jTableFooterPainter.prototype.parent.prototype.paint.call(this);
	this.paintContent();
}

jTableFooterPainter.prototype.update = function() {
    jTableFooterPainter.prototype.parent.prototype.update.call(this);
	this.paintContent(true);
}

//**************************************************************************************************
// jTableContentPainter
//**************************************************************************************************
Class.Inherits(jTableContentPainter, jTableBasePainter)
function jTableContentPainter(params) {
	jTableContentPainter.prototype.parent.call(this, params)
}

jTableContentPainter.prototype.type = "grid"
jTableContentPainter.prototype.classID = "jTableContentPainter"

jTableContentPainter.prototype.initialize = function(params) {
	jTableContentPainter.prototype.parent.prototype.initialize.call(this, params)
	
	this.treeViewCells = new JList(true)
}

jTableContentPainter.prototype.getContent = function(column) {
	return this.control.band.grid.dataset.text(column.fname)
}

jTableContentPainter.prototype.updateSelectionContents = function() {
	// console.log("here")
	this.table.find("td[command='select']").each(function(i, e) {
		$(e).trigger("update")
	})
}

jTableContentPainter.prototype.drawRow = function(row) {
	jTableContentPainter.prototype.parent.prototype.drawRow.call(this, row)
	this.control.grid.events.OnInitRow.trigger(row)
}

jTableContentPainter.prototype.drawCell = function(cell, column) {
	jTableContentPainter.prototype.parent.prototype.drawCell.call(this, cell, column)
	cell.addClass("data-cell")

	var self = this
	if(column.command) {		
		var command
		
		if(column.grid.methods.call("allowCommand", column)) {
			cell.addClass("command-cell")
			cell.attr("command", column.command)
			if(column.internal) {
				if(column.command == "select") {
					cell.data("grid", column.grid)
					cell.data("row-id", cell.parent().attr("row-id"))
					cell.on("update", function() {
						$(this).html("")
						var grid = $(this).data("grid")
						if(grid.selections.indexOf(grid.dataset.parseKeyValue($(this).data("row-id"))) > -1) {
							desktop.svg.draw($(this), "checkbox-marked")
							$(this).attr("is-selected", "1")
						} else {
							desktop.svg.draw($(this), "checkbox-blank-outline")
							$(this).removeAttr("is-selected")
						}
					})
					
					command = desktop.svg.draw(cell, "checkbox-blank-outline")
				} else if(column.command == "master-detail") {
					command = desktop.svg.draw(cell, "tree-collapse")
					cell.data("expanded", false)
					cell.bind("update", function() {
						var cell = $(this)
						var expanded = !$(this).data("expanded")
						cell.html("")
						if(expanded) {
							desktop.svg.draw(cell, "tree-expand")
							self.control.grid.painter.showMasterDetail(cell)
						} else {
							desktop.svg.draw(cell, "tree-collapse")
							self.control.grid.painter.hideMasterDetail(cell)
						}
						
						$(this).data("expanded", expanded)
					})
				} else {
					if(column.command === "open" && column.grid.options.editNewPage) {
						CreateElementEx("a", cell, function(anchor) {
							anchor.attr("href", column.grid.methods.call("editPageUrl", cell.parent().attr("row-id")))
							command = desktop.svg.draw(anchor, self.getCommandIcon(column))
						})
					} else {
						command = desktop.svg.draw(cell, "db-" + column.command)
					}
				}
			
			} else {
				CreateElementEx("a", cell, function(anchor) {
					var href = column.grid.methods.call("getCommandUrl", column)
					if(href) anchor.attr("href", href)
					command = desktop.svg.draw(anchor, self.getCommandIcon(column))
				})
			}
		}
		
		if(command) {
			this.setCommandHint(cell, column);
			cell.data("column", column)
			cell.click(function() {
				var params = {}
				params.element = $(this)
				params.column = $(this).data("column")
				params.command = params.column.command
				params.row = $(this).parent()
				params.id = params.row.attr("row-id")
				
				column.grid.dataset.gotoKey(params.id)
				column.grid.events.OnCommand.trigger(params)
			})
		}
	} else {
		
		var dbCol = column.grid.dataset.columnByName(column.fname)
		
		if(dbCol) {
			if(self.control.grid.options.viewType === "treeview" && column.fname === self.control.grid.options.treeViewSettings.columnName) {
				{ // draw the tree view cell
					cell.addClass("tree-cell")
					cell.attr("tree-view", "1")					
					cell.bind("update", function(event, row) {
						// this event is called from row.add event
						var btn = $(this).data("btn")
						var parentLevel = $(this).parent().data("level")
						
						for(var i = 0; i < parentLevel-1; i++) {
							CreateElementEx("div", undefined, function(filler) {
								filler.attr("tree-sec", "filler")
								btn.before(filler)
							})
						}
					})
					
					CreateElementEx("div", cell, function(container) {
						cell.data("tree-container", container)
						
						container.attr("tree-sec", "container")
						
						// create the button
						CreateElementEx("div", container, function(btn) {
							cell.data("btn", btn)
							
							btn
								.data("parent-row", cell.parent())
								.attr("tree-sec", "btn")
								.click(function() {
									if($(this).data("parent-row").data("children").length)
										$(this).data("parent-row").trigger("collapse-expand")
								})
						})
						
						// add custom buttons here
						var eventParams = {
							container: container,
							addIcon: function(params) {
								CreateElementEx("div", this.container, function(btn) {
									btn
										.attr("tree-sec", "icon")
										.attr("icon-name", params.name)
									
									desktop.svg.draw(btn, params.icon)
								})
							},
							addCommand: function(params) {
								CreateElementEx("div", this.container, function(btn) {
									btn
										.attr("tree-sec", "command")
										.attr("command-name", params.name)
										.click(function() {
											// $(this).data("parent-row").trigger("collapse-expand")
										})
									
									desktop.svg.draw(btn, params.icon)
								})
							}
						}
						
						self.control.grid.events.OnTreeViewButtons.trigger(eventParams)
						
						// create the label/caption
						CreateElementEx("div", container, function(label) {
							cell.data("label", label)
							label.attr("tree-sec", "label")
							
							label.html(self.control.dataset.text(column.fname))
						})
					})
				} // end: draw the tree view cell
				
				{ // prepare the tree row
					var keyID = self.control.grid.options.treeViewSettings.keyColumnName // this is the column name, not the value
					var parentID = self.control.grid.options.treeViewSettings.parentColumnName // this is the column name, not the value
					var row = cell.parent()
					
					row
						.data("children", [])
						.data("tree-cell", cell)
						.data("id", keyID)
						.data("parentID", parentID)
						.data("level", 1)
						.data("expanded", true)
						.data("btnDrawn", false)
						.attr("tree-expanded", 1)
						.attr("tree-level", 1)
						.attr("tree-id", self.control.dataset.get(keyID))
						.attr("tree-parent-id", self.control.dataset.get(parentID))
						.bind("add", function(event, child) { // child is a row (TD)
							// push child row to parent array of children
							$(this).data("children").push(child)

							// set the level of this child row
							var level = $(this).data("level") + 1
							child.data("level", level)
							child.attr("tree-level", level)  // set the attribute level
							
							// update the indenting of the child cell
							child.data("tree-cell").trigger("update", [child])
							
							// if this is a parent, then draw the collapse/expand svg
							if(!$(this).data("btnDrawn")) {
								$(this).data("btnDrawn", true)
								
								var btn = $(this).data("tree-cell").data("btn")
								desktop.svg.draw(btn, "tree-expand")
							}
							
							// set the parent row of this child row
							child.data("parent-row", $(this))
						})
						.bind("collapse-expand", function() {
							var btn = $(this).data("tree-cell").data("btn")
							var expanded = !$(this).data("expanded")
							$(this).data("expanded", expanded)
							
							btn.html("")
							btn.data("parent-row").attr("tree-expanded", expanded ? 1: 0)
							desktop.svg.draw(btn, expanded ? "tree-expand": "tree-collapse")
							
							var expandCollapse = function(rows) {
								$(rows).each(function(i, row) {									
									var parentRow = row.data("parent-row")
									
									if(!expanded || (parentRow.data("expanded") && parentRow.attr("row-visible") === "1")
										self.control.grid.painter.setRowVisible(row.attr("row-id"), expanded)
									
									if(row.data("children").length)
										expandCollapse(row.data("children"))
								})
							}
							
							expandCollapse($(this).data("children"))
						})
						
					// if(!self.tree) self.tree = new JList(true)
					self.tree.add(self.control.dataset.get(keyID), row)
					var parentRow = self.tree.get(self.control.dataset.get(parentID))
					if(parentRow) {
						parentRow.trigger("add", [row])
					}
				
					
				} // end: prepare the tree row
			} else {				
				if(column.drawContent)
					column.drawContent(cell)
				else if(column.linkField) {
					cell.addClass("cell-link")
					CreateElementEx("a", cell, function(link) {
						link.attr("href", self.control.grid.methods.call("getLinkUrl", {column:column, id:self.control.dataset.get(column.linkField)}));
						link.html(self.control.dataset.text(column.fname));
					});
				} else
					cell.html(this.control.dataset.text(column.fname));
				
				if(this.control.dataset.Columns.get(column.fname).numeric)
					cell.addClass("cell-numeric")
			}
		}
	}
}

jTableContentPainter.prototype.hoverRow = function(keyID) {
	if(this.currentRow) {
		this.currentRow.removeAttr("hover")
		if(this.currentRow.data("previewRow"))
			this.currentRow.data("previewRow").removeAttr("hover")
	}
	
	this.currentRow = this.rows.get(keyID)
	this.currentRow.attr("hover", "1")
	if(this.currentRow.data("previewRow"))
		this.currentRow.data("previewRow").attr("hover", "1")
}

jTableContentPainter.prototype.focusRow = function(keyID) {
	if(this.focusedRow) {
		this.focusedRow.removeAttr("focused")
		if(this.focusedRow.data("previewRow"))
			this.focusedRow.data("previewRow").removeAttr("focused")
	}
	
	this.focusedRow = this.rows.get(keyID)
	
	if(this.focusedRow) {
		this.focusedRow.attr("focused", "1")
		if(this.focusedRow.data("previewRow"))
			this.focusedRow.data("previewRow").attr("focused", "1")
	}
}

jTableContentPainter.prototype.deleteRow = function(keyID) {
	this.focusedRow = this.rows.get(keyID)
	if(this.focusedRow)
		this.focusedRow.remove()
}

jTableContentPainter.prototype.updateRow = function(keyID) {
	// this.focusedRow = this.rows.get(keyID)
	// if(this.focusedRow)
		// this.focusedRow.remove()
}

jTableContentPainter.prototype.focusRowByIndex = function(index) {
	if(this.focusedRow)
		this.focusedRow.removeAttr("focused")
	
	this.focusedRow = this.rows.getByIndex(index)
	
	if(this.focusedRow)
		this.focusedRow.attr("focused", "1")
}

jTableContentPainter.prototype.mouseLeave = function() {
	if(this.currentRow) {
		this.currentRow.removeAttr("hover")
		this.currentRow = undefined
	}
}

jTableContentPainter.prototype.initialize = function(params) {
    jTableContentPainter.prototype.parent.prototype.initialize.call(this, params)

	// console.log(this.control.grid)
	// this.control.grid.dataset.Events.OnMoveRecord.add(function(dataset) {
		// console.log(dataset.getKey())
	// })
}

jTableContentPainter.prototype.paintContent = function(update) {
	var self = this
	var band = this.control.band
	var grid = this.control.band.grid
	var dataset = this.control.band.grid.dataset
		
	this.currentRow	= undefined
	this.tree = new JList(true)
	
	if(update) this.rows.clear()
	this.rows = new JList(dataset.keyIsNumeric())
	
	var columns = this.control.gatherColumns()
	
	dataset.each(function(row, rowNo) {
		dataset.recNo = rowNo
		var row = self.createRow()
			.addClass((rowNo & 1) ? "odd" : "")
			.attr("row-id", dataset.getKey(rowNo))
			.attr("row-visible", 1)
			.on("mouseenter", function(e) {
				self.control.grid.painter.hoverRow($(this).attr("row-id"))
			})
			.on("click", function(e) {
				self.control.grid.painter.focusRow($(this).attr("row-id"))
			})
			.on("dblclick", function(e) {
				self.control.grid.editRecord($(this).attr("row-id"), $(this))
			})
			.on("contextmenu", function(e) {
				self.control.grid.painter.focusRow($(this).attr("row-id"));
				if(self.control.grid.options.showPopupMenu && !$(e.target).is("a")) {
					self.control.grid.showMenu($(this).attr("row-id"), $(e.target));
					e.preventDefault();
				}
			})
			
		if(grid.options.showPreviewRow) {
			var previewRow = self.createRow()
				.addClass("preview-row")
				.addClass((rowNo & 1) ? "odd" : "")
				.attr("row-id", dataset.getKey(rowNo))
				.attr("row-visible", 1)
				.data("parentRow", row)
				.on("mouseenter", function(e) {
					self.control.grid.painter.hoverRow($(this).attr("row-id"))
				})
				.on("click", function(e) {
					self.control.grid.painter.focusRow($(this).attr("row-id"))
				})
				.on("dblclick", function(e) {
					self.control.grid.editRecord($(this).attr("row-id"), $(this))
				})
				
				CreateElementEx("td", previewRow, function(col) {
					col.attr("colspan", columns.count())
				})
				
			row.data("previewRow", previewRow)
		}
		
		self.drawRow(row)
		self.rows.add(dataset.getKey(rowNo), row)
		
		columns.each(function(i, column) {
			self.drawCell(CreateElement("td", row), column)
		})
	})
	
	dataset.recNo = 0
}

jTableContentPainter.prototype.update = function() {
	jTableContentPainter.prototype.parent.prototype.update.call(this)
	// console.log("update")
	this.paintContent(true)
}

jTableContentPainter.prototype.paint = function() {
    jTableContentPainter.prototype.parent.prototype.paint.call(this)
	this.paintContent()
}

jTableContentPainter.prototype.setRowVisible = function(keyID, visible) {
	var row = this.rows.get(keyID)
	if(row) row.attr("row-visible", visible ? 1: 0)
}

jTableContentPainter.prototype.getMasterDetailFirstColumn = function(keyID) {
	var currentRow = this.rows.get(keyID)
	return currentRow.data("master-detail-cell")
}

jTableContentPainter.prototype.hideMasterDetail = function(keyID) {
	this.rows.get(keyID).data("master-detail").remove()
}

jTableContentPainter.prototype.showMasterDetail = function(keyID) {
	var self = this
	var currentRow = this.rows.get(keyID)
	
	CreateElementEx("tr", undefined, function(row) {
		currentRow.after(row)
		currentRow.data("master-detail", row)

		row.attr({
			"row-id": keyID,
			"row-type": "master-detail"			
		}).addClass("master-detail-row")
		
		CreateElementEx("td", row, function(cell) {
			currentRow.data("master-detail-cell", cell)
			cell.attr({
				"key-id": keyID,
				"cell-type": "master-detail",
				"colspan": self.control.countBandColumns(self.control.band)
			}).css({
				// "border": 0
			})
		})			
	})
}

jTableContentPainter.prototype.setMasterDetailHeight = function(keyID, height) {
	this.rows.get(keyID).data("master-detail-cell").css("height", height)
}