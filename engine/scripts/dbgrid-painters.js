// *************************************************************************************************
// File name: dbgrid-painters.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// GridPainter
//**************************************************************************************************
Class.Inherits(GridPainter, JControlPainter);
function GridPainter(Control) {
	GridPainter.prototype.parent.call(this, Control);
};

GridPainter.prototype.type = "grid";
GridPainter.prototype.classID = "GridPainter";

GridPainter.prototype.Paint = function() {
	GridPainter.prototype.parent.prototype.Paint.call(this); 
	if(this.Control.options.cardView)
		this.PaintCard()
	else
		this.PaintTable();
};

GridPainter.prototype.PaintTable = function() {
	var grid = this.Control;
	
	var container = this.ContentContainer = CreateElement("div", this.Control.container, "", "grid" + " grid-" + this.GetParam("css", ""))
		.attr("opt-view", "table")
		.attr("opt-scroll", defaultValue(grid.options.horzScroll, false) ? "1": "0")

	this.subHeader = CreateElement("div", container).attr("grid-sec", "sub-header");
	if(defaultValue(this.Control.options.showToolbar, false)
		this.CreateToolbar(this.subHeader)
	else
		this.subHeader.css("height", 0);
		
	this.subContent = CreateElement("div", container).attr("grid-sec", "sub-content");
	
	this.PaintSubFooter(this.subFooter = CreateElement("div", container).attr("grid-sec", "sub-footer"));
	
	this.subContent.css("height", ("Calc(100% - {0}px)").format(this.subFooter.outerHeight()+this.subHeader.outerHeight()));

	this.updateScrolls = [];
	this.ComputeColumnWidth(this.subContent.outerWidth());
	
	if(this.Control.options.showBand) this.Control.CreateDefaultBands();
	if(this.Control.options.showHeader) this.PaintHeader(this.header = CreateElement("div", this.subContent).attr("grid-sec", "header"), "none");
	this.PaintContent(this.content = CreateElement("div", this.subContent).attr("grid-sec", "content"), "none");
	this.PaintFooter(this.footer = CreateElement("div", this.subContent).attr("grid-sec", "footer"), "none");
	
	if(this.Control.options.horzScroll)
		this.PaintFixedColumns(this.fixedLeft = CreateElement("div", this.subContent).attr("grid-sec", "fixed-left"));
	
	if(this.header)
		this.content.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight()+this.footer.outerHeight())
	else
		this.content.css("height", ("Calc(100% - {0}px)").format(this.footer.outerHeight());
	
	if(!this.Control.options.horzScroll && this.header) {
		this.header.css("padding-right", desktop.scrollbarWidth)
	};
	
	if(this.Control.options.horzScroll) {
		this.content.data("painter", this); // use in scrolling event callback
		this.content.scroll(function(e) {
			for(var i = 0; i < $(this).data("painter").updateScrolls.length; i++) {
				$(this).data("painter").updateScrolls[i].trigger("updatescroll", [$(this)]);
			};
		});
	};
	
	if(this.Control.options.autoScroll) {
		var width = this.ActualColumnsWidth() + $("#navigator-container").outerWidth();
		
		var self = this;
		var mqlHandler = function(mql, init) {
			if(mql.matches && !grid.options.horzScroll) {
				self.ShowHorzScroll(true);
			} else if(!mql.matches && grid.options.horzScroll) {
				self.ShowHorzScroll(false);
			}
		};
		
		var mql = window.matchMedia(("(min-width: 0px) and (max-width: {0}px)").format(width));
		mql.addListener(mqlHandler);
		
		mqlHandler(mql, true);
	};
	
	this.SetContainer(container);
};

GridPainter.prototype.PaintCard = function() {
	var grid = this.Control;
	
	var container = this.ContentContainer = CreateElement("div", this.Control.container, "", "grid" + " grid-" + this.GetParam("css", ""))
		.attr("opt-view", "card")
		.attr("opt-scroll", defaultValue(grid.options.horzScroll, "false") ? "1": "0")
		
	this.subHeader = CreateElement("div", container).attr("grid-sec", "sub-header");
	if(defaultValue(this.Control.options.showToolbar, false)
		this.CreateToolbar(this.subHeader)
	else
		this.subHeader.css("height", 0);
		
	this.subContent = CreateElement("div", container).attr("grid-sec", "sub-content");
	this.PaintSubFooter(this.subFooter = CreateElement("div", container).attr("grid-sec", "sub-footer"));
	
	this.subContent.css("height", ("Calc(100% - {0}px)").format(this.subFooter.outerHeight()+this.subHeader.outerHeight()));

	this.updateScrolls = [];
	this.ComputeColumnWidth(this.subContent.outerWidth());
	
	if(this.Control.options.showBand) this.Control.CreateDefaultBands();
	if(this.Control.options.showHeader) this.PaintHeader(this.header = CreateElement("div", this.subContent).attr("grid-sec", "header"), "none");
	this.PaintContent(this.content = CreateElement("div", this.subContent).attr("grid-sec", "content"), "none");
	this.PaintFooter(this.footer = CreateElement("div", this.subContent).attr("grid-sec", "footer"), "none");
	
	// if(this.Control.options.horzScroll)
		// this.PaintFixedColumns(this.fixedLeft = CreateElement("div", this.subContent).attr("grid-sec", "fixed-left"));

	if(this.header)
		this.content.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight()+this.footer.outerHeight())
	else
		this.content.css("height", ("Calc(100% - {0}px)").format(this.footer.outerHeight());
	
	if(!this.Control.options.horzScroll && this.header) {
		this.header.css("padding-right", desktop.scrollbarWidth)
	};
	
	// if(this.Control.options.horzScroll) {
		// this.content.data("painter", this); // use in scrolling event callback
		// this.content.scroll(function(e) {
			// for(var i = 0; i < $(this).data("painter").updateScrolls.length; i++) {
				// $(this).data("painter").updateScrolls[i].trigger("updatescroll", [$(this)]);
			// };
		// });
	// };
	
	// if(this.Control.options.autoScroll) {
		// var width = this.ActualColumnsWidth() + $("#navigator-container").outerWidth();
		
		// var self = this;
		// var mqlHandler = function(mql, init) {
			// if(mql.matches && !grid.options.horzScroll) {
				// self.ShowHorzScroll(true);
			// } else if(!mql.matches && grid.options.horzScroll) {
				// self.ShowHorzScroll(false);
			// }
		// };
		
		// var mql = window.matchMedia(("(min-width: 0px) and (max-width: {0}px)").format(width));
		// mql.addListener(mqlHandler);
		
		// mqlHandler(mql, true);
	// };
	
	// this.SetContainer(this.subContent);
	this.SetContainer(container);
};

GridPainter.prototype.TableView = function() {
	this.Control.options.cardView = false;
	this.Control.ClearColumns();
	this.Control.Events.OnInitColumns.trigger();
	this.ContentContainer.remove();
	this.PaintTable();
};

GridPainter.prototype.ChangeView = function(cardView) {
	this.Control.options.cardView = cardView;
	this.Control.ClearColumns();
	this.Control.Events.OnInitColumns.trigger();
	this.ContentContainer.attr("opt-view", cardView ? "card": "table");
	var grid = this.Control;

	this.subContent.html("");
	this.subFooter.html("");
	this.PaintSubFooter(this.subFooter.html(""));
	
	this.subContent.css("height", ("Calc(100% - {0}px)").format(this.subFooter.outerHeight()+this.subHeader.outerHeight()));
	this.updateScrolls = [];
	this.ComputeColumnWidth(this.subContent.outerWidth());
	
	if(this.Control.options.showBand) this.Control.CreateDefaultBands();
	this.PaintHeader(this.header = CreateElement("div", this.subContent).attr("grid-sec", "header"), "none");
	this.PaintContent(this.content = CreateElement("div", this.subContent).attr("grid-sec", "content"), "none");
	this.PaintFooter(this.footer = CreateElement("div", this.subContent).attr("grid-sec", "footer"), "none");
	
	if(this.Control.options.horzScroll)
		this.PaintFixedColumns(this.fixedLeft = CreateElement("div", this.subContent).attr("grid-sec", "fixed-left"));
	
	if(this.header)
		this.content.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight()+this.footer.outerHeight())
	else
		this.content.css("height", ("Calc(100% - {0}px)").format(this.footer.outerHeight());
	
	if(!this.Control.options.horzScroll && this.header) {
		this.header.css("padding-right", desktop.scrollbarWidth)
	};
	
	if(this.Control.options.horzScroll) {
		this.content.data("painter", this); // use in scrolling event callback
		this.content.scroll(function(e) {
			for(var i = 0; i < $(this).data("painter").updateScrolls.length; i++) {
				$(this).data("painter").updateScrolls[i].trigger("updatescroll", [$(this)]);
			};
		});
	};

	if(!cardView) {
		if(this.Control.options.autoScroll && !this.Control.options.autoScrollInit) {
			this.Control.options.autoScrollInit = true;
			var width = this.ActualColumnsWidth() + $("#navigator-container").outerWidth();
			
			var self = this;
			var mqlHandler = function(mql, init) {
				if(mql.matches && !grid.options.horzScroll) {
					self.ShowHorzScroll(true);
				} else if(!mql.matches && grid.options.horzScroll) {
					self.ShowHorzScroll(false);
				}
			};
			
			var mql = window.matchMedia(("(min-width: 0px) and (max-width: {0}px)").format(width));
			mql.addListener(mqlHandler);
			
			mqlHandler(mql, true);
		};
	};
};

GridPainter.prototype.ShowHorzScroll = function(visible) {
	this.Control.options.horzScroll = visible;
	var grid = this.Control;
	
	this.subContent.html("");
	this.subFooter.html("");
	this.PaintSubFooter(this.subFooter.html(""));
	
	this.subContent.css("height", ("Calc(100% - {0}px)").format(this.subFooter.outerHeight()+this.subHeader.outerHeight()));
	this.updateScrolls = [];
	this.ComputeColumnWidth(this.subContent.outerWidth());
	// alerts(this.ActualColumnsWidth(this.subContent.outerWidth()));
	
	// if(this.Control.options.showBand) this.Control.CreateDefaultBands();
	this.PaintHeader(this.header = CreateElement("div", this.subContent).attr("grid-sec", "header"), "none");
	this.PaintContent(this.content = CreateElement("div", this.subContent).attr("grid-sec", "content"), "none");
	this.PaintFooter(this.footer = CreateElement("div", this.subContent).attr("grid-sec", "footer"), "none");
	
	if(this.Control.options.horzScroll)
		this.PaintFixedColumns(this.fixedLeft = CreateElement("div", this.subContent).attr("grid-sec", "fixed-left"));
	
	if(this.header)
		this.content.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight()+this.footer.outerHeight())
	else
		this.content.css("height", ("Calc(100% - {0}px)").format(this.footer.outerHeight());
	
	if(!this.Control.options.horzScroll && this.header) {
		this.header.css("padding-right", desktop.scrollbarWidth)
	};
	
	if(this.Control.options.horzScroll) {
		this.content.data("painter", this); // use in scrolling event callback
		this.content.scroll(function(e) {
			for(var i = 0; i < $(this).data("painter").updateScrolls.length; i++) {
				$(this).data("painter").updateScrolls[i].trigger("updatescroll", [$(this)]);
			};
		});
	};
};

GridPainter.prototype.RepaintContent = function() {
	var grid = this.Control;
	this.PaintContent(this.content.html(""), "none");
	if(this.header)
		this.content.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight()+this.footer.outerHeight())
	else
		this.content.css("height", ("Calc(100% - {0}px)").format(this.footer.outerHeight());
	
	if(!this.Control.options.cardView) {
		if(this.Control.options.horzScroll) {
			this.PaintContent(this.fixedContent.html(""), "left");
			this.fixedFooter.css("top", desktop.scrollbarWidth);
			if(this.header)
				this.fixedContent.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight())
			else
				this.fixedContent.css("height", "100%")
		};
	};
	
	this.Control.Events.AfterRepainContent.trigger();
};

GridPainter.prototype.ComputeFixedColumns = function(float) {
	var w = 0;
	this.Control.EachColumn(function(i, column) {
		if(column.float == float) w += column.width;
	});
	
	return w;
}

GridPainter.prototype.ActualColumnsWidth = function() {
	var total = 0;
	this.Control.EachColumn(function(i, column) {
		total += column.width;
	});
	
	return total;
};

GridPainter.prototype.ComputeColumnWidth = function(width) {
	var total = 0;
	// width is the width of the grid, must be already determine prior to calling this method
	if(this.Control.options.horzScroll) {
		this.Control.EachColumn(function(i, column) {
			column.calcWidth = column.width + "px";
			total += column.width;
		});
	} else {
		var fixWidths = 0;
		this.Control.EachColumn(function(i, column) {
			if(column.fixedWidth) {
				column.calcWidth = column.width + "px";
				fixWidths++;
			};
		})
		
		// pass 1
		this.Control.EachColumn(function(i, column) {
			if(!column.fixedWidth) {
				column.calcWidth = column.width / width * 100;
				total += column.calcWidth;
			}
		})

		// pass 2
		var excess = (100 - total) / (this.Control.Count()-fixWidths);
		this.Control.EachColumn(function(i, column) {
			if(!column.fixedWidth) {
				column.calcWidth = column.calcWidth + excess + "%";
			}
		})
	};
	
	return total;
};

GridPainter.prototype.CreateToolbar = function(container) {
	var toolbarContainer = CreateElement("div", container)
		.attr("grid-sec", "toolbar-container")
		// .css("height", defaultValue(this.Control.options.toolbarSize, 34));
	
	if(this.Control.options.toolbarSize == 16)
		toolbarContainer.css("height", 25)
	else
		toolbarContainer.css("height", 34);		
		
	this.toolbar = new JToolbar({
			// id: "tb",
			// container: container,
			container: toolbarContainer,
			css: "toolbar",
			// theme: "default",
			theme: this.Control.options.toolbarTheme,
			buttonSize: this.Control.options.toolbarSize
			// Css: "toolbar",
			// Css: this.ToolbarCss,
			// Page: this,
			// Painter: {
				// buttonPainterClass: ToolbuttonPainter
			// }
	});
	
	// simpleSearch
	this.Control.Events.OnInitToolbar.trigger(this.toolbar);
};

GridPainter.prototype.CreateTable = function(container, location, float) {
	var table = CreateElement("table", container)
		.attr("grid-sec", location)
		.attr("border", 0)
		.attr("cellspacing", 0)
		.attr("cellspacing", 0)
	
	table.css("width", "100%");
	
	var innerHeader = CreateElement("thead", table).attr("grid-sec", "inner-header");
	var innerRow = CreateElement("tr", innerHeader)
	this.Control.EachColumn(function(i, column) {
		if((column.float == float || float == "none") {
			var th = CreateElement("th", innerRow)
				.css("width", column.calcWidth)
				
			if(column.fixedWidth) {
				th.css("min-width", column.calcWidth).css("max-width", column.calcWidth)
			};
		};
	});
	
	if(this.Control.options.horzScroll && location == "headers") {
		var th = CreateElement("th", innerRow).css("width", desktop.scrollbarWidth)
	};
	
	return table;
};

GridPainter.prototype.PaintTableBand = function(container, float, summary) {
	var grid = this.Control;
	
	if(float == "left") {
		var level;
		for(level = 0; level <= this.Control.bandLevels; level++) {
			var headerRow = CreateElement("tr", container);
			$(this.Control.bands).each(function(x, band) {
				if(band.HasFixedColumns(float) {
					if(band.level == level) {
						band.grid.lastLeftCell = band.cell = CreateElement("th", headerRow)
							.html(band.getCaption())
							
						band.cell.attr("colspan", band.ColCount());
						if(band.RowCount() == 0 && band.level < band.grid.bandLevels) {
							band.cell.attr("rowspan", band.grid.bandLevels+1-band.level);
						};
					};
				} else {
					if(band.level == level) {
						band.grid.lastLeftCell.attr("lband", "1");
						band.grid.leftExtraCell = CreateElement("th", headerRow)
							.html(".")
					};
				}
			});
		};
	};
	
	if(float == "none") {
		var level;
		for(level = 0; level <= this.Control.bandLevels; level++) {
			var headerRow = CreateElement("tr", container);
			$(this.Control.bands).each(function(x, band) {
				if(band.level == level) {
					band.cell = CreateElement("th", headerRow)
						.html(band.getCaption())
						
					band.cell.attr("colspan", band.ColCount());
					if(band.RowCount() == 0 && band.level < band.grid.bandLevels) {
						band.cell.attr("rowspan", band.grid.bandLevels+1-band.level);
					};
				};
			});
		};
	};
};

GridPainter.prototype.PaintHeaderCommandCell = function(column, cell) {
	var grid = column.grid;
	
	cell.html("");
	cell.attr("command", column.command);
	// CreateElement("a", cell);
	
	// we allow mouse click on select header
	if(column.command == "select") {
		// CreateElement("a", cell);
		desktop.GetSvg(cell, "db-un"+column.command)
		
		cell.click(function() {
			var selections = $(this).attr("has-selections");
			var key = grid.dataset.primaryKey;
			if(selections == "some") {
				grid.dataset.each(function(dataRow, i)) {
					var id = dataRow[key].toString();
					var index = grid.selections.indexOf(id);
					if(index == -1) {
						grid.selections.push(id);
					}
				});
			} else if(selections == "all") {
				grid.dataset.each(function(dataRow, i)) {
					var id = dataRow[key].toString();
					var index = grid.selections.indexOf(id);
					if(index > -1) {
						grid.selections.splice(index, 1);
					}
				});
			} else {
				grid.dataset.each(function(dataRow, i)) {
					var id = dataRow[key].toString();
					var index = grid.selections.indexOf(id);
					if(index == -1) {
						grid.selections.push(id);
					}
				});
			}
			
			grid.Events.OnSelect.trigger(grid.selections);
			grid.Painter.RepaintContent();
		})
	} else {
		// cell.html(column.command)
		// desktop.GetSvg(cell, "db-"+column.command)
		var header;
		if(column.internal) 
			header = desktop.GetSvg(cell, "db-"+column.command)
		else {
			var icon = column.grid.Methods.call("getCommandIcon", column);			
			if(icon) {
				header = desktop.GetSvg(cell, icon).data("column", column);
			};
		};
		
		if(header) {
			column.headerCell = header;
			var hint = column.grid.Methods.call("getCommandHint", column);
			if(hint) desktop.SetHint(header, hint, "top")
		};
	}
};

GridPainter.prototype.PaintHeaderCell = function(column, cell) {
	var grid = column.grid;
		
	if(column.command) {
		this.PaintHeaderCommandCell(column, cell);
	} else {
		var table = CreateElement("table", cell).attr("grid-sec", "column-header-table")
			.attr("cellspacing", 0)
			.attr("border", 0)
			
		var r = CreateElement("tr", table);
		var c = CreateElement("td", r)
			.html(column.getCaption())
		
		if(column.allowSort) {
			var s = CreateElement("td", r)
				.css("width", 13)
				.css("min-width", 13)
				.css("max-width", 13)
				.attr("grid-sec", "btn-sort")
				.attr("sort-order", "");
				
			var order = "";
			if(grid.dataParams.get("sort") == column.id) {
				order = grid.dataParams.get("order");
				s.attr("sort-order", order);
			};
				
			
			// desktop.GetSvg(s, "db-sortup").attr("sort", "asc").attr("sorted", order == "asc" ? 1: 0)
			// desktop.GetSvg(s, "unfold-more").attr("sorted", order == "asc" ? 1: 0)
			var icon = function(order) {
				if(order == "asc")
					return "db-sortup"
				else if(order == "desc")
					return "db-sortdown"
				else
					return "unfold-more";
			};
			
			// var icon = "unfold-more";
			// if(order == "asc")
				// icon = "db-sortup"
			// else if(order == "desc")
				// icon = "db-sortdown";
			
			var clickSort = function() {
				var sorted = $(this).attr("sorted");
				if(sorted == "" || sorted == "desc") 
					sort($(this), "asc")
				else 
					sort($(this), "desc");
			};
			
			desktop.GetSvg(s, icon(order)).attr("sorted", order).click(clickSort);

			var sort = function(e, order) {
				var b = e.parent();

				var row = b.closest("thead[grid-sec='header'] > tr");
				row.find("td[sort-order]").attr("sort-order", "");
				row.find("svg[sorted='asc']").each(function(e) {
					desktop.GetSvg($(this).html("").attr("sorted", ""), "unfold-more");
				});
				row.find("svg[sorted='desc']").each(function(e) {
					desktop.GetSvg($(this).html("").attr("sorted", ""), "unfold-more");
				});
				
				b.attr("sort-order", order);
				e.attr("sorted", order);
				
				var rowID = grid.dataset.getKey();
				grid.dataParams.set("sort", column.id);
				grid.dataParams.set("order", order);
				
				if(grid.optionsData.cache) {
					// console.log(("{0}, {1}").format(column.id, order))
					// console.log(column)
					var cacheDataset = desktop.cacheDataset.get(grid.optionsData.url);
					grid.LocalSort(column.id, order)
				} else {
					grid.Refresh(function() {
						grid.Painter.GotoRow(rowID);
					});
				}
				
				desktop.GetSvg(e.html(""), icon(order)).attr("sorted", order).click(clickSort);
			};
			
			// var order = "";
			// if(grid.dataParams.get("sort") == column.id) {
				// order = grid.dataParams.get("order");
				// s.attr("sort-order", order);
			// };
			
			// desktop.GetSvg(s, "db-sortup").attr("sort", "asc").attr("sorted", order == "asc" ? 1: 0)
				// .click(function() {
					// if($(this).attr("sorted") == "0") sort($(this), "asc");
				// });
				
			// desktop.GetSvg(s, "db-sortdown").attr("sort", "desc").attr("sorted", order == "desc" ? 1: 0)
				// .click(function() {
					// if($(this).attr("sorted") == "0") sort($(this), "desc");
				// });
		};
	};
	
	if(column.drawHeader) column.drawHeader(cell, column);
};

/*
GridPainter.prototype.PaintHeaderCell2 = function(column, cell) {
		var grid = column.grid;
		var table = CreateElement("table", cell).attr("grid-sec", "column-header-table")
			.attr("cellspacing", 0)
			.attr("border", 0)
			
		var r = CreateElement("tr", table);
		var c = CreateElement("td", r)
			.html(column.getCaption())
		
		// var cell1 = CreateElement("div", table)
			// .css("display", "table-cell")
			// .html(column.getCaption())
		
		if(column.allowSort) {
			var order = "";
			if(grid.dataParams.get("sort") == column.id) {
				order = grid.dataParams.get("order");
			}

			var s = CreateElement("td", r)
				.css("width", 13)
				.css("min-width", 13)
				.css("max-width", 13)
				
			var sortContainer = CreateElement("div", s).attr("grid-sec", "btn-sort")
				.click(function() {
					var b = $(this);
					var order = defaultValue($(this).attr("sort-order"), "");
					if(order == "" || order == "desc")
						order = "asc"
					else if(order == "asc")
						order = "desc";
					
					// var row = b.closest("tr");
					var row = b.closest("thead[grid-sec='header'] > tr");
					row.find("span[sort-order]").removeAttr("sort-order");
					row.find("div[sort-order]").removeAttr("sort-order");
					
					b.attr("sort-order", order);
					b.find("span").attr("sort-order", order);

					var rowID = grid.dataset.getKey();
					grid.dataParams.set("sort", column.id);
					grid.dataParams.set("order", order);
					grid.Refresh(function() {
						grid.Painter.GotoRow(rowID);
					});
				});

			// desktop.GetSvg(sortContainer, "db-sort", 16);
			var img = CreateElement("span", sortContainer);
			if(order !== "") {					
				img.attr("sort-order", order);
				sortContainer.attr("sort-order", order);
			};
		};
			
		if(column.command) {
			this.PaintHeaderCommandCell(column, cell);
		};
		
		if(column.drawHeader) column.drawHeader(cell, column);
};
*/

GridPainter.prototype.PaintTableSummaryContent = function(container, float) {
	var grid = this.Control;
	var header = CreateElement("thead", container).attr("grid-sec", "header");
	var headerRow = CreateElement("tr", header);

	this.Control.EachColumn(function(i, column) {
		if((column.float == float || float == "none") {
			var cell = CreateElement("th", headerRow)
				
			if(!column.command && column.showSummary) {
				if(column.showSummary) {
					cell.html(grid.options.summaryDataset.text(column.fname));
					var dataColumn = grid.options.summaryDataset.Columns.get(column.fname);
					if(dataColumn.numeric && dataColumn.type == "money") {
						cell.attr("format", "numeric")
					};
				};
			};
		};
	});
}

GridPainter.prototype.PaintTableHeaderContent = function(container, float) {
	var grid = this.Control;
	var header = CreateElement("thead", container).attr("grid-sec", "header");
	
	if(this.Control.options.showBand) {
		this.PaintTableBand(header, float);
	};

	var headerRow = CreateElement("tr", header);

	this.Control.EachColumn(function(i, column) {
		if((column.float == float || float == "none") {
			var cell = CreateElement("th", headerRow)
				// .html(column.getCaption())
			
			grid.Painter.PaintHeaderCell(column, cell);
		};
	});
}

GridPainter.prototype.PaintHeader = function(container, float) {
	this.PaintColumHeaders(container, float);
}

GridPainter.prototype.PaintColumHeaders = function(container, float) {
	var columHeader = CreateElement("div", container).attr("grid-sec", "headers-container");
	var tableHeader = this.CreateTable(columHeader, "headers", float);
	
	if(float == "none") {
		this.columHeader = columHeader;
		this.tableHeader = tableHeader;
		
		this.updateScrolls.push(columHeader);
		columHeader.on("updatescroll", function(e, source) {
			$(this).scrollLeft(source.scrollLeft());
		});
	}
	
	this.PaintTableHeaderContent(tableHeader, float);
}

GridPainter.prototype.AddCardCommand = function(cardContainer, toolBar, command) {
	var cell = CreateElement("li", toolBar).attr("card-sec", "btn");
	var column = {command: command, grid:this.Control};
	cell.attr("command", command).data("column", column);
	var a = CreateElement("a", cell);
	cell.on("click", function() {
		var id = $(this).closest("div[grid-sec='card']").attr("row-id");
		var col = $(this).data("column");
		col.grid.Events.OnCommand.trigger({
			id: id,
			command: col.command,
			element: $(this)
		});
	});
	
	if(column.command == "select") {
		var id = cardContainer.attr("row-id");
		var index = column.grid.selections.indexOf(id);
		if(index > -1) cardContainer.attr("row-selected", 1);
	};
};

GridPainter.prototype.PaintCardContent = function(container) {
	container.attr("grid-sec", "card");
	if(this.Control.options.simpleCardView) {
		var content = CreateElement("div", container).attr("card-sec", "content");
	} else {
		var inner = CreateElement("div", container).attr("card-sec", "inner");
		if(this.Control.options.showCardToolbar) {
			var toolbar = CreateElement("div", inner).attr("card-sec", "command-bar");
			var ul = CreateElement("ul", toolbar).attr("card-sec", "toolbar");
			
			if(this.Control.options.showSelection) this.AddCardCommand(container, ul, "select");
			if(this.Control.Methods.call("canEdit") && this.Control.crud.edit) this.AddCardCommand(container, ul, "edit");
			if(this.Control.Methods.call("canDelete") && this.Control.crud["delete"]) this.AddCardCommand(container, ul, "delete");
		};
		
		// this.Control.EachColumn(function(i, column) {
			// if(column.command) {
				// var cell = CreateElement("li", ul).attr("card-sec", "btn");
				// cell.attr("command", column.command).data("column", column);
				// var a = CreateElement("a", cell);
				// cell.on("click", function() {
					// var id = $(this).closest("div[grid-sec='card']").attr("row-id");
					// var col = $(this).data("column");
					// col.grid.Events.OnCommand.trigger({
						// id: id,
						// command: col.command,
						// element: $(this)
					// });
				// });
				
				// if(column.command == "select") {
					// var id = container.attr("row-id");
					// var index = column.grid.selections.indexOf(id);
					// if(index > -1) container.attr("row-selected", 1);
				// };
			// };
		// });
			
		
		var content = CreateElement("div", inner).attr("card-sec", "content");
		if(!this.Control.options.showCardToolbar) {
			content.css("width", "100%")
		};
	};
	
	this.Control.Events.OnInitCard.trigger(content);
};

GridPainter.prototype.PaintTableContent = function(container, float) {
	this.Control.Events.OnInitRow.trigger(container);
	this.Control.EachColumn(function(i, column) {
		if(column.float == float || float == "none") {
			var cell = CreateElement("td", container);
				
			if(column.command && column.grid.Methods.call("allowCommand", column)) {
				cell.attr("command", column.command);
				
				var a;
				if(column.command == "select") {
					var id = container.attr("row-id");
					var index = column.grid.selections.indexOf(id);
					if(index > -1)  {
						container.attr("row-selected", 1);
						a = desktop.GetSvg(cell, "db-"+column.command).data("column", column);
					} else {
						a = desktop.GetSvg(cell, "db-un"+column.command).data("column", column);
					};

					a.on("click", column.grid.ClickCommand);
				} else {
					// if(!column.drawContent) {
						// console.log(column)
					if(column.internal) {
						var a = desktop.GetSvg(cell, "db-"+column.command).data("column", column);
						a.on("click", column.grid.ClickCommand);
					} else {
						var icon = column.grid.Methods.call("getCommandIcon", column);
						if(icon) {
							var a = desktop.GetSvg(cell, icon).data("column", column);
							a.on("click", column.grid.ClickCommand);
						};
					};
				};
				
				if(a) {
					var hint = column.grid.Methods.call("getCommandHint", column);
					a.data("hintTarget", column.headerCell);
					if(hint) desktop.SetHint(a, hint, "top")
					// if(hint) desktop.SetHint(column.headerCell, hint, "top")
				};
				
			} else {
				cell.html(column.getValue());
				if(column.numeric()) cell.attr("format", "numeric");
			};
			
			if(column.drawContent) column.drawContent(cell, column);
		};
	});
};

GridPainter.prototype.PaintContent = function(container, float) {
	if(this.Control.options.cardView) {
		this.PaintCardContentData(container);
	} else {
		var tableContent = this.CreateTable(container, "content", float);

		if(float == "none")
			this.tableContent = tableContent;
		
		this.PaintContentData(tableContent, float);
	};	
};

GridPainter.prototype.PaintContentData = function(container, float) {
	for (var r = 0; r < 100; r++) { 		
		this.PaintTableContent(CreateElement("tr", container), float);
	}	
};

GridPainter.prototype.PaintCardContentData = function(container) {
	for (var r = 0; r < 100; r++) { 		
		this.PaintCardContent(CreateElement("div", container))
	}	
};

GridPainter.prototype.PaintFixedColumns = function(container) {
	this.PaintHeader(this.fixedHeader = CreateElement("div", container).attr("grid-sec", "fixed-header"), "left");
	this.PaintContent(this.fixedContent = CreateElement("div", container).attr("grid-sec", "fixed-content"), "left");
	this.PaintFooter(this.fixedFooter = CreateElement("div", container).attr("grid-sec", "fixed-footer"), "left");
		
	container.css("width", this.ComputeFixedColumns("left"));
	container.css("height", ("Calc(100% - {0}px)").format(this.footer.outerHeight()+desktop.scrollbarWidth);

	this.fixedFooter.css("top", desktop.scrollbarWidth);
	// this.fixedContent.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight());
	if(this.header)
		this.fixedContent.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight())
	else
		this.fixedContent.css("height", "100%");

	this.updateScrolls.push(this.fixedContent);
	this.fixedContent.on("updatescroll", function(e, source) {
		$(this).scrollTop(source.scrollTop());
	});
	
	if(this.fixedHeader && this.header) {
		var ct = this.header.find("thead[grid-sec='header']"); // content table
		var ft = this.fixedHeader.find("thead[grid-sec='header']"); // fixed table
		var cta = [], fta = [];
		
		// >tr, return only direct TR of THEAD
		if(ft) {
			ct.find(">tr").each(function(i, tr) {
				cta.push(tr);
			});
			ft.find(">tr").each(function(i, tr) {
				fta.push(tr);
			});
			
			var i = 0;
			for(i = 0; i < fta.length; i++) {
				var f = $(fta[i]);
				var c = $(cta[i]);
				
				if(f.outerHeight() < c.outerHeight()) {
					f.css("height", c.outerHeight())
				}
			}
		}
	}
	// alerts(cta, fta);
	// alerts(ct.find(">tr").length, ft.find(">tr").length);
	// alerts(this.header, this.fixedHeader);
	// alerts(ct, ft);
	
}

GridPainter.prototype.PaintSubFooter = function(container) {
	// container.css("height", 40);
	if(this.Control.options.showPager) {
		var pagerContainer = CreateElement("div", container).addClass("pager-container")
		this.Control.pager = new Pager({
			grid: this.Control,
			dataset: this.Control.dataParams,
			// rowsPerPage: this.Control.rowsPerPage,
			rowsPerPage: [25,50,75,100],
			// container: container.addClass("pager-container"),
			container: pagerContainer
			// Painter: {
				// painterClass: FlatPagerPainter
			// }
		});
		
		// this.pager.Update(1, 570, 27);
		this.Control.pager.Update();
		// this.pager.Update(this.Search.page, this.Search.row_count, this.Search.page_count);		
	};
}

GridPainter.prototype.PaintFooter = function(container, float) {
	if(this.Control.options.showSummary) {
		var columHeader = CreateElement("div", container).attr("grid-sec", "headers-container");
		var tableHeader = this.CreateTable(columHeader, "headers", float).attr("grid-loc", "footer");
		
		if(float == "none") {
			this.updateScrolls.push(columHeader);
			columHeader.on("updatescroll", function(e, source) {
				$(this).scrollLeft(source.scrollLeft());
			});
		}
		
		this.PaintTableSummaryContent(tableHeader, float);
		// this.PaintTableHeaderContent(tableHeader, float);
	};
}

GridPainter.prototype.ShowSearchInput = function(toolbar) {
	var grid = this.Control;
	if(grid.options.showAdvanceSearch) {
		// var btnImage = "/engine/images/magnifier-zoom-24.png";
		// if(grid.options.toolbarSize == 16)
			// btnImage = "/engine/images/magnifier-zoom.png";
		
		toolbar.NewDropdownItem({
			id: "search",
			// icon: btnImage,
			icon: "search",
			// iconColor: "#315B8F",
			iconColor: "#315B8F",
			// color: "#0754D0",
			color: "#315B8F",
			hint: "Advanced Search",
			align: "right",
			// dlgAlign: "right",
			onClose: function(dialog) {
				// alerts("onClose");
				grid.dataParams.unbindControls();
			},
			painter: {
				footer: function(dialog, container) {
					var btnSave = CreateButton({
						container: container,
						caption: "Start Search",
						// enabled: false,
						style: "green",
						click: function(button) {
							if(button.enabled)
								grid.Refresh();
						}
					});
					
					var btnClear = CreateButton({
						container: container,
						caption: "Clear",
						// enabled: false,
						style: "blue",
						click: function(button) {
							if(button.enabled)
								grid.dataParams.Events.OnClearSearch.trigger(grid);
								// grid.dataParams.clear();
							// self.Control.Hide();
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
					container.css("width", grid.options.AdvanceSearchWidth);
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
	};
	
	if(grid.options.simpleSearch) {
		var c1 = CreateElement("div", toolbar.Painter.buttonContainer, "", "simple-search ss-theme-"+grid.options.toolbarTheme).attr("ss-size", grid.options.toolbarSize);
		var c2 = CreateElement("div", c1).attr("ss-sec", "search");
		this.searchInput = CreateElement("input", c2);
		var btn = CreateElement("div", c2).attr("ss-sec", "button");
		desktop.GetSvg(btn, "search", 20, {noTopMargin:true});
		// CreateElement("img", btn).attr("src", "/engine/images/magnifier-zoom.png");
		
		this.searchInput
		.focusin(function() {
			$(this).parent().attr("ss-focused", "1");
			// alerts($(this)[0])
		})
		.focusout(function(e) {
			$(this).parent().removeAttr("ss-focused")
		});

		this.searchInput.focus();
		this.searchInput.change(function() {
			grid.dataParams.set(grid.options.simpleSearchField, $(this).val());			
			if(grid.optionsData.cache) 
				grid.LocalFilter()
			else
				grid.Refresh();
		});
		
		
	};
};

//**************************************************************************************************
// DataGridPainter
//**************************************************************************************************
Class.Inherits(DataGridPainter, GridPainter);
function DataGridPainter(Control) {
	DataGridPainter.prototype.parent.call(this, Control);
};

DataGridPainter.prototype.classID = "DataGridPainter";

DataGridPainter.prototype.Paint = function() {
	this.Control.Events.OnInitRow.add(function(grid, row) {
		row.attr("row-id", grid.dataset.getKey());
		row.data("dataset", grid.dataset);
		row.on("click", function() {
			if(grid.options.lookup) 
				grid.ReturnLookupData($(this))
			else
				$(this).data("dataset").gotoKey($(this).attr("row-id"));
		});
	});

	DataGridPainter.prototype.parent.prototype.Paint.call(this); 
};

DataGridPainter.prototype.PaintCardContentData = function(container) {
	// for (var r = 0; r < 100; r++) { 		
		// this.PaintCardContent(CreateElement("div", container))
	// }	
	var dataset = this.Control.dataset;
	
	if(!dataset.empty()) {
		dataset.enableEvents = false;
		dataset.first();
		while (!dataset.eof()) {
			var key = dataset.get(dataset.primaryKey);
			var card = CreateElement("div", container);
			card.attr("row-id", key);
			this.PaintCardContent(card);
			dataset.next();
		};
		dataset.enableEvents = true;
		dataset.first();
	};
	
	if(this.Control.options.lookup) {
		container.css("cursor", "pointer");
	};
};

DataGridPainter.prototype.PaintContentData = function(container, float) {
	var self = this;
	var dataset = this.Control.dataset;
	// var filter = self.Control.dataParams.get(self.Control.options.simpleSearchField);
	var filter = self.Control.SimpleSearchText();
	// alerts(filter)
	var filtered = function(key) {
		if(!filter)
			return false
		else if(self.Control.optionsData.filtered.length == 0)
			return false
		else
			return self.Control.optionsData.filtered.indexOf(key) == -1;
	};
	
	if(!dataset.empty()) {
		dataset.enableEvents = false;
		dataset.first();
		var i = 0;
		while (!dataset.eof()) {
			var key = dataset.get(dataset.primaryKey);
			if(!filtered(key)) {
				var row = CreateElement("tr", container);
				row.attr("odd", (++i & 1) ? "1" : "0");
				// if(self.fixedContent) {
					row.hover(function(e) {
						var id = $(e.target).parent().attr("row-id");
						self.content.find(("tr[row-id='{0}']").format(id)).attr("hover", "1");
						if(self.fixedContent)
							self.fixedContent.find(("tr[row-id='{0}']").format(id)).attr("hover", "1");
						// self.fixedContent.find(("tr[row-id='{0}']").format(id)).css("background", "red");
						// $(e.target).parent().css("background", "red");
						// $(e.target).parent().attr("hover", "1");
					}, function(e) {
						var id = $(e.target).parent().attr("row-id");
						// self.fixedContent.find(("tr[row-id='{0}']").format(id)).css("background", "");
						self.content.find(("tr[row-id='{0}']").format(id)).removeAttr("hover");
						if(self.fixedContent)
							self.fixedContent.find(("tr[row-id='{0}']").format(id)).removeAttr("hover");
						// $(e.target).parent().css("background", "");
						// $(e.target).parent().removeAttr("hover");
					});
				// };
				
				this.PaintTableContent(row, float);
			};
			
			dataset.next();
		};
		dataset.first();
		self.FocusRow(dataset.getKey());
		dataset.enableEvents = true;
	};
	
	if(this.Control.options.lookup) {
		container.css("cursor", "pointer");
	};
}

DataGridPainter.prototype.GotoRow = function(id) {
	var row = this.tableContent.find(("tr[row-id='{0}'] td").format(id));
	// alerts(id, row)
	if(row.length > 0) {
		var topOffset = this.content[0].getBoundingClientRect().top;
		var top = row[0].getBoundingClientRect().top;	
		this.content.scrollTop(top-topOffset);
	};
	// this.content.scrollTop(25*153);
	// this.targetX = this.Control.target[0].getBoundingClientRect().left;
	// alerts(topOffset, top); // 4405
};

DataGridPainter.prototype.FocusRow = function(id) {
	if(this.Control.options.showFocused && !this.Control.options.cardView) {
		this.tableContent.find("tr[focused='1']").removeAttr("focused", 0);
		this.tableContent.find(("tr[row-id='{0}']").format(id)).attr("focused", 1);
		if(this.fixedContent) {
			// this.fixedContent.find("table[grid-sec='content'] tr[focused='1']").removeAttr("focused", 0);
			// this.fixedContent.find(("table[grid-sec='content'] tr[row-id='{0}']").format(id)).attr("focused", 1);
			this.fixedContent.find("tr[focused='1']").removeAttr("focused", 0);
			this.fixedContent.find(("tr[row-id='{0}']").format(id)).attr("focused", 1);
		};
	}
};

// DataGridPainter.prototype.ShowEditDialog = function(mode, getEditForm) {	
DataGridPainter.prototype.ShowEditDialog = function(params) {	
	var self = this;
	var title = defaultValue(this.Control.Methods.call("editTitle", params.mode));
	if(!title) {
		if(params.mode == "edit")
			title = "Edit"
		else if(params.mode == "new")
			title = "Add Record"
	};
// console.log(this.Control.options.editDialogWidth)
	this.Control.dataEdit.editDialog = this.Control.editDialog = new JEditDialog2({
		Target: this.container,
		ActivatingTarget: params.target,
		Modal: false,
		OnInit: function(dialog) {
			// alerts("OK") 
			dialog.editor.Events.OnPostSuccess.add(function(editor, info) {
				if(info)
					InfoDialog({
						// target: self.Control.toolbar.Element(),
						target: self.Control.toolbar.container,
						title: "Information",
						message: info,
						snap: "bottom",
						inset: false
					});
				self.Control.Refresh();
			});
		},
		Painter: {
			snap: "bottom",
			align: "",
			// width: 500,
			width: self.Control.options.editDialogWidth,
			inset: true,
			autoHeight: true,
			OnRenderContent: function(dialog, container) {
				var c = CreateElement("div", container)
					.css("width", "100%")
					// .css("background", "wheat");
					
				params.editForm(c, dialog);
			},
			OnRenderHeader: function(dialog, container) {
				container.html(title);
				new JDrag(container, container, {
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
						// self.DisableFrame(false);
					}
				});
			}
		}
	});
};
/*
DataGridPainter.prototype.EditDialog2 = function(mode) {	
	var self = this;
	var title = defaultValue(this.Control.Methods.call("editTitle", mode));
	if(!title) {
		if(mode == "edit")
			title = "Edit"
		else if(mode == "new")
			title = "Add Record"
	};

	this.Control.dataEdit.editDialog = this.Control.editDialog = new JEditDialog({
		Target: this.container,
		Modal: false,
		Painter: {
			// painterClass: EditDialogPainter,
			snap: "bottom",
			align: "",
			width: 500,
			inset: true,
			autoHeight: true,
			OnInitTabs: function(editor) {
				self.Control.InitializeEditor(editor);
				
			},
			OnRenderContainer: function(dialog, container) {
				// alerts("OK");
			},
			OnRenderHeader: function(dialog, container) {
				container.html(title);
				var op;
				// new JDrag(this.ElementData("container"), this.Element(), {
				new JDrag(container, container, {
					Moving: true,
					Sizing: false,
					SizeOffset: 1,
					AllowDrag: function(s) {
						return true;
					},
					AllowSize: function(s) {
						// return !self.NoResize && !self.Maximized;
						return false;
					},
					InitDrag: function(s, ready) {
						if(ready) {
							op = container.parent().parent().offset();
							// alerts("ready");
							// self.DisableFrame(true)
						} else {
							// self.Activate();
						}
					},
					Dragging: function(s, x, y, w, h) {
						// var p = container.parent().offset();
						// container.html(("{0},{1},{2},{3}").format(x, y, p.left, p.top));
						container.parent().parent()
							.css("top", op.top+y)
							.css("left", op.left+x)
							
						// container.SetBounds(x, y, w, h);
					},
					DragEnd: function(s) {
						// self.DisableFrame(false);
					}
				});
			}
		}
	});
	
	this.Control.editDialog.grid = this.Control;
	this.Control.dataEdit.Events.OnChanged.add(function(dataset) {
		dataset.editDialog.DataChanged(dataset);
		// alerts("OK");
	});
};
*/
DataGridPainter.prototype.Busy = function(busy) {
	// console.log(busy)
	// if(this.busy ) {
	// if(this.busy && (busy == false || busy == undefined)) {
	if(this.busy || (busy == false && busy !== undefined)) {
		// console.log(busy)
		if(this.busy) this.busy.remove();
		this.busy = null;
	} else {		
		// this.busy = CreateElement("div", this.Control.container).addClass("busy")
		// desktop.GetSvg(this.busy, "refresh")
		
		this.busy = CreateElement("div", this.Control.container).addClass("busy")
		var innerContainer1 = CreateElement("div", this.busy).attr("x-sec", "inner-1"); //.addClass("busy-2")
		var innerContainer2 = CreateElement("div", innerContainer1).attr("x-sec", "inner-2"); //.addClass("busy-3")
			
		desktop.GetSvg(innerContainer2, "refresh")
	};
};