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
	
	var grid = this.Control;
	
	var container = CreateElement("div", this.Control.container, "", "grid" + " grid-" + this.GetParam("css", ""))
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
	this.PaintHeader(this.header = CreateElement("div", this.subContent).attr("grid-sec", "header"), "none");
	this.PaintContent(this.content = CreateElement("div", this.subContent).attr("grid-sec", "content"), "none");
	this.PaintFooter(this.footer = CreateElement("div", this.subContent).attr("grid-sec", "footer"), "none");
	this.PaintFixedColumns(this.fixedLeft = CreateElement("div", this.subContent).attr("grid-sec", "fixed-left"));
	
	this.content.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight()+this.footer.outerHeight());
	
	if(!this.Control.options.horzScroll) {
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
	
	this.SetContainer(this.subContent);
};

GridPainter.prototype.RepaintContent = function() {
	var grid = this.Control;
	// this.content.html("")
	this.PaintContent(this.content.html(""), "none");
	this.content.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight()+this.footer.outerHeight());
	
	this.PaintContent(this.fixedContent.html(""), "left");

	this.fixedFooter.css("top", desktop.scrollbarWidth);
	this.fixedContent.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight());
	
	// if(grid.options.showPager) {
		// grid.pager.Update();
	// };
	
	// this.Control.AfterRepainContent.trigger();
	this.Control.Events.AfterRepainContent.trigger();
};

GridPainter.prototype.ComputeFixedColumns = function(float) {
	var w = 0;
	this.Control.EachColumn(function(i, column) {
		if(column.float == float) w += column.width;
	});
	
	return w;
}

GridPainter.prototype.ComputeColumnWidth = function(width) {
	// width is the width of the grid, must be already determine prior to calling this method
	if(this.Control.options.horzScroll)
		this.Control.EachColumn(function(i, column) {
			column.calcWidth = column.width + "px"
		});
	else {
		var fixWidths = 0;
		this.Control.EachColumn(function(i, column) {
			if(column.fixedWidth) {
				column.calcWidth = column.width + "px";
				fixWidths++;
			};
		})
		
		// pass 1
		var total = 0;
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
			css: "toolbar"
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

GridPainter.prototype.PaintTableBand = function(container, float) {
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

// GridPainter.prototype.PaintTableHeaderContent0 = function(container, float) {
	// var grid = this.Control;
	// var header = CreateElement("thead", container).attr("grid-sec", "header");
	// if(this.Control.options.showBand) this.PaintTableBand(header, float);

	// var headerRow = CreateElement("tr", header);

	// this.Control.EachColumn(function(i, column) {
		// if((column.float == float || float == "none") {
			// var cell = CreateElement("th", headerRow)
				// .html(column.getCaption())
				
			// if(column.command) {
				// cell.html("");
				// cell.attr("command", column.command);
				// CreateElement("a", cell);
				
				// if(column.command == "select") {
					// cell.click(function() {
						// var selections = $(this).attr("has-selections");
						// var key = grid.dataset.primaryKey;
						// if(selections == "some") {
							// grid.dataset.each(function(dataRow, i)) {
								// var id = dataRow[key].toString();
								// var index = grid.selections.indexOf(id);
								// if(index == -1) {
									// grid.selections.push(id);
								// }
							// });
						// } else if(selections == "all") {
							// grid.dataset.each(function(dataRow, i)) {
								// var id = dataRow[key].toString();
								// var index = grid.selections.indexOf(id);
								// if(index > -1) {
									// grid.selections.splice(index, 1);
								// }
							// });
						// } else {
							// grid.dataset.each(function(dataRow, i)) {
								// var id = dataRow[key].toString();
								// var index = grid.selections.indexOf(id);
								// if(index == -1) {
									// grid.selections.push(id);
								// }
							// });
						// }
						
						// grid.Painter.RepaintContent();
					// })
				// }
			// };
			
			// if(column.allowSort) {
				// var order = "";
				// if(grid.dataParams.get("sort") == column.id) {
					// order = grid.dataParams.get("order");
				// }

				// var sortContainer = CreateElement("div", cell).attr("grid-sec", "btn-sort")
					// .click(function() {
						// var b = $(this);
						// var order = defaultValue($(this).attr("sort-order"), "");
						// if(order == "" || order == "desc")
							// order = "asc"
						// else if(order == "asc")
							// order = "desc";
						
						// var row = b.closest("tr");
						// row.find("span[sort-order]").removeAttr("sort-order");
						// row.find("div[sort-order]").removeAttr("sort-order");
						
						// b.attr("sort-order", order);
						// b.find("span").attr("sort-order", order);

						// var rowID = grid.dataset.getKey();
						// grid.dataParams.set("sort", column.id);
						// grid.dataParams.set("order", order);
						// grid.Refresh(function() {
							// grid.Painter.GotoRow(rowID);
						// });
					// });
					
				// var img = CreateElement("span", sortContainer);
				// if(order !== "") {					
					// img.attr("sort-order", order);
					// sortContainer.attr("sort-order", order);
				// };
			// };
			
			// if(column.drawHeader) column.drawHeader(cell);
		// };
	// });
// }

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
					
				var img = CreateElement("span", sortContainer);
				if(order !== "") {					
					img.attr("sort-order", order);
					sortContainer.attr("sort-order", order);
				};
			};
				
			if(column.command) {
				cell.html("");
				cell.attr("command", column.command);
				CreateElement("a", cell);
				
				// we allow mouse click on select header
				if(column.command == "select") {
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
						
						grid.Painter.RepaintContent();
					})
				}
			};
			
			if(column.drawHeader) column.drawHeader(cell);
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

GridPainter.prototype.PaintTableContent = function(container, float) {
	this.Control.Events.OnInitRow.trigger(container);
	this.Control.EachColumn(function(i, column) {
		if((column.float == float || float == "none") {
			var cell = CreateElement("td", container);
				
			if(column.command) {
				cell.attr("command", column.command);
				var a = CreateElement("a", cell).data("column", column);
				a.on("click", function() {
					var id = $(this).parent().parent().attr("row-id");
					var col = $(this).data("column");
					col.grid.Events.OnCommand.trigger({
						id: id,
						command: col.command,
						element: $(this)
					});
				});
				
				if(column.command == "select") {
					var id = container.attr("row-id");
					var index = column.grid.selections.indexOf(id);
					if(index > -1) container.attr("row-selected", 1);
				};
				// if(float == "none" && column.float != "none") 
					// a.css("opacity", 0)
			} else 
				cell.html(column.getValue())
			// if(float == "none" && column.float != "none") {
				// cell.html("");
				// if(column.command) cell.attr("command", "open");
				// cell.css("opacity", 0);
			// };
			
			if(column.drawContent) column.drawContent(cell);
		};
	});
};

GridPainter.prototype.PaintContent = function(container, float) {
	var tableContent = this.CreateTable(container, "content", float);

	if(float == "none")
		this.tableContent = tableContent;
	
	this.PaintContentData(tableContent, float);
}

GridPainter.prototype.PaintContentData = function(container, float) {
	for (var r = 0; r < 100; r++) { 
		var row = CreateElement("tr", container);
		this.PaintTableContent(row, float);
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
	this.fixedContent.css("height", ("Calc(100% - {0}px)").format(this.header.outerHeight());

	this.updateScrolls.push(this.fixedContent);
	this.fixedContent.on("updatescroll", function(e, source) {
		$(this).scrollTop(source.scrollTop());
	});
	
	if(this.fixedHeader) {
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
			container: pagerContainer,
			Painter: {
				painterClass: FlatPagerPainter
			}
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
		
		this.PaintTableHeaderContent(tableHeader, float);
	};
}

GridPainter.prototype.ShowSearchInput = function(toolbar) {
	var grid = this.Control;
	
	if(grid.options.simpleSearch) {
		var c1 = CreateElement("div", toolbar.Painter.buttonContainer, "", "simple-search").attr("ss-size", grid.options.toolbarSize);
		var c2 = CreateElement("div", c1).attr("ss-sec", "search");
		this.searchInput = CreateElement("input", c2);
		var btn = CreateElement("div", c2).attr("ss-sec", "button");
		CreateElement("img", btn).attr("src", "/engine/images/magnifier-zoom.png");
		
		this.searchInput.focus();
		this.searchInput.change(function() {
			grid.dataParams.set(grid.options.simpleSearchField, $(this).val());
			grid.Refresh();
		});
	} else {
		var btnImage = "/engine/images/magnifier-zoom-24.png";
		if(grid.options.toolbarSize == 16)
			btnImage = "/engine/images/magnifier-zoom.png";
		
		toolbar.NewDropdownItem({
			id: "search",
			icon: btnImage,
			color: "#0754D0",
			hint: "Search",
			align: "right",
			painter: {
				content: function(dialog, container) {
					container.css("width", 300);
				}
			}
		});
	}
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

DataGridPainter.prototype.PaintContentData = function(container, float) {
	var dataset = this.Control.dataset;
	
	dataset.enableEvents = false;
	dataset.first();
	while (!dataset.eof()) {
		var key = dataset.get(dataset.primaryKey);
		var row = CreateElement("tr", container);
		this.PaintTableContent(row, float);
		dataset.next();
	};
	dataset.enableEvents = true;
	dataset.first();
	
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
	if(this.Control.options.showFocused) {
		this.tableContent.find("tr[focused='1']").removeAttr("focused", 0);
		this.tableContent.find(("tr[row-id='{0}']").format(id)).attr("focused", 1);
		if(this.fixedContent) {
			this.fixedContent.find("table[grid-sec='content'] tr[focused='1']").removeAttr("focused", 0);
			this.fixedContent.find(("table[grid-sec='content'] tr[row-id='{0}']").format(id)).attr("focused", 1);
		};
	}
};

DataGridPainter.prototype.EditDialog = function(mode) {	
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
