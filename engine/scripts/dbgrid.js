// *************************************************************************************************
// File name: dbgrid.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JGrid
//**************************************************************************************************
Class.Inherits(JGrid, JControl);
function JGrid(Params) {
    JGrid.prototype.parent.call(this, Params);
};

JGrid.prototype.classID = "JGrid";

JGrid.prototype.DefaultPainter = function() {
    return new GridPainter(this);
};

JGrid.prototype.Repaint = function(callback) {
	this.Painter.RepaintContent();
};

JGrid.prototype.SimpleSearchText = function() {
	return this.dataParams.get(this.options.simpleSearchField);
};

JGrid.prototype.Refresh = function(callback) {
	this.Events.BeforeRefresh.trigger();
	
	var SavedSimpleSearchText;
	if(this.optionsData.cache && this.options.simpleSearchField) {
		SavedSimpleSearchText = this.dataParams.get(this.options.simpleSearchField);
		this.dataParams.set(this.options.simpleSearchField, "");
	};
	
	var self = this;
	var key = 0;
	if(!this.dataset.empty()) 
		key = this.dataset.getKey();
	
	this.Busy();
	this.GetData("list", function(params) {
		for(var name in self.requestParams) {
			params[name] = self.requestParams[name];
		};
		
		params.qry = self.dataParams.stringifyRec(0);
		self.Events.OnInitRequestParams.trigger(params);
	},
	function(data) {
		self.Events.OnInitFetchedData.trigger(data);
		
		if(self.optionsData.cache)
			desktop.cacheDataset.add(self.cacheDatasetName, data);

		if(self.optionsData.cache && self.options.simpleSearchField) {
			self.dataParams.set(self.options.simpleSearchField, SavedSimpleSearchText);
		};

		if(self.options.showPager) {
			self.dataParams.set("page", self.page = self.page);
			self.row_count = data.row_count;
			self.page_count = data.page_count;
			self.crud = data.crud;
		};
		
		self.dataset.resetData(self.Methods.call("resetListData", data));
		for(var i = 0; i < data.table_count; i++) {
			self.Events.OnInitSubData.trigger({rawData:data["data_"+i], index:i});
		}
		self.Painter.RepaintContent();
		if(!self.dataset.empty())
			self.dataset.gotoKey(key);
		
		self.Events.AfterRefresh.trigger(data);
		
		if(callback) callback();
		
		// this.Busy();
	});
};

JGrid.prototype.LocalSort = function(name, order) {
	// alerts(name, order)
	this.dataset.sort(name, order);
	this.Painter.RepaintContent();
	// this.Busy();
};

JGrid.prototype.LocalFilter = function() {
	var data = [];

	this.optionsData.filtered = [];
	var self = this;
	// var filter = this.dataParams.get(this.options.simpleSearchField);
	var filter = this.SimpleSearchText();
	var searchExp = new RegExp(filter, 'i');
	this.dataset.each(function(dataRow, i)) {
		// var id = dataRow[self.dataset.primaryKey].toString();
		var id = dataRow[self.dataset.primaryKey];
		// self.Events.OnLocalSearch.trigger(searchExp);
		// if(searchExp.test(dataRow["name"]) || searchExp.test(dataRow["code"]))
		// console.log(dataRow);
		// var test = function
		var search = {
			expression:searchExp, 
			row:dataRow,
			test: function(name) {
				return this.expression.test(this.row[name])
			}
		};
		
		// if(self.Methods.call("localSearch", {expression:searchExp, row:dataRow})) {
		if(self.Methods.call("localSearch", search)) {
			self.optionsData.filtered.push(id);
		};
	});
	
	this.Painter.RepaintContent();
	// this.Busy();
};

JGrid.prototype.Initialize = function(params) {
    JGrid.prototype.parent.prototype.Initialize.call(this, params);
	// console.log(params);

	this.options = defaultValue(params.options, {});
	this.optionsData = defaultValue(params.optionsData, {});
	this.optionsData.filtered = [];
	
    this.id = params.id;
	
	if(params.params) {
		this.owner = params.params.owner;
		this.container = params.params.container;
		this.options.lookup = params.params.lookup;
		this.optionsData.cache = params.params.cache;
	} else {
		this.owner = params.owner;
		this.container = params.container;
		this.options.lookup = params.lookup;
		this.optionsData.cache = params.cache;
	};
	
	// console.log(this.optionsData)
	
	if(this.options.lookup) {
		if(params.params) {
			this.options.lookupDialog = params.params.owner;
			this.options.lookupColumn = params.params.lookupColumn;
		} else {
			this.options.lookupDialog = params.owner;
			this.options.lookupColumn = params.lookupColumn;
		};
	};
	
    this.css = params.css;
	this.list = new JList();
	this.bands = [];
	this.selections = []; // used if this.options.showSelection = true
	
	
	// this.optionsData.editCallback = this.EditRecord;
	this.optionsData.editCallback = function(grid, id, button) {
		// console.log(id);
		grid.EditRecord(id, button);
	};
	
	this.options.cardView = false;
	this.options.showCardToolbar = true;
	this.options.showFixedColumn = true;
	this.options.showBand = false;
	this.options.showHeader = true;
	this.options.showSelection = false;
	this.options.showFocused = true;
	this.options.allowSort = false;
	this.options.simpleSearch = false;
	this.options.showAdvanceSearch = false;
	this.options.simpleSearchField = "filter";
	this.options.showRefreshButton = true;
	this.options.autoScroll = false;
	this.options.toolbarSize = 24;
    this.options.toolbarTheme = params.toolbarTheme;
    this.options.editDialogWidth = 500;
    // this.options.showSummary = false;
	
	this.requestParams = params.requestParams;
	// console.log(this.requestParams)
	// this.requestParams = {};
	// if(params.requestParams) {
		// this.requestParams = RequestParamsToObject(params.requestParams);
	// };
	
	this.editForm = params.editForm;
	// console.log(this.editForm);
	this.Methods = new MethodHandler(this);
	this.Methods.add("canAdd", function(grid) {
		return grid.crud.add;
	});
	this.Methods.add("canEdit", function(grid) {
		return grid.crud.edit;
	});
	this.Methods.add("canDelete", function(grid) {
		return grid.crud["delete"];
	});
	this.Methods.add("initListData", function(grid, data) {
		return new Dataset(data.data_0, "Data");
	});
	this.Methods.add("resetListData", function(grid, data) {
		return data.data_0;
	});
	this.Methods.add("deleteConfirm", function(grid, id) {
		return {
			title: "Hello",
			message: "Got it..." + id
		}
	});
	this.Methods.add("getCacheDatasetName", function(grid) {
		// return grid.optionsData.url;
		return defaultValue(grid.optionsData.cacheName, grid.optionsData.url);
	});
	this.Methods.add("localSearch", function(grid, options) {
		// return grid.optionsData.url;
		// return options.expression.test(options.row["name"]) || options.expression.test(options.row["code"]);
		return true;
	});
	
	this.Methods.add("allowCommand", function(grid, column) {
		return true;
	});
	
	this.Methods.add("getCommandIcon", function(grid, column) {
		return "";
	});
	
	this.Methods.add("getCommandHint", function(grid, column) {
		return "";
	});
	
	this.Methods.add("editTitle", function(grid, mode) {
		if(mode == "edit")
			return "Edit"
		else if(mode == "new")
			return "Add Record"
	});
	
	// this.Methods.add("addRecordHint", function(grid) {
		// return "Add Record"
	// });
	
	this.Events = {};
	this.Events.OnInitDataRequest = new EventHandler(this);
	this.Events.OnInitRequestParams = new EventHandler(this);
	this.Events.OnInitFetchedData = new EventHandler(this);
	this.Events.OnInitData = new EventHandler(this);
	this.Events.OnInitSubData = new EventHandler(this);
	this.Events.OnInitEditData = new EventHandler(this);
	this.Events.OnInitEditor = new EventHandler(this);
	this.Events.OnInitSearch = new EventHandler(this);
	this.Events.OnInitGridMenu = new EventHandler(this);
	// this.Events.OnLocalSearch = new EventHandler(this);
	this.Events.OnInitGrid = new EventHandler(this);
	this.Events.OnInitRow = new EventHandler(this);
	this.Events.OnInitColumns = new EventHandler(this);
	this.Events.OnInitCard = new EventHandler(this);
	// this.Events.OnInitEdit = new EventHandler(this);
	this.Events.OnInitToolbar = new EventHandler(this);
	this.Events.AfterPaintContent = new EventHandler(this);
	this.Events.AfterRepainContent = new EventHandler(this);
	this.Events.AfterRepainContent.add(function(grid) {
		grid.Busy(false);
		grid.UpdateSelection();
		if(grid.options.showPager) {
			grid.pager.Update();
		};
	});

	this.Events.AfterRefresh = new EventHandler(this);
	this.Events.BeforeRefresh = new EventHandler(this);
	
	this.Events.OnInitSelect = new EventHandler(this);
	this.Events.OnSelect = new EventHandler(this);
	this.Events.OnSelection = new EventHandler(this);

	this.Events.OnInitRequestParams.add(function(grid, requestParams) {
		// console.log("OcatholicnInitRequestParams")
		if(grid.options.lookup)
			requestParams.lookup = 1;
	});
	
	// this.Events.OnInitEdit.add(function(grid, id) {
	// });
	
	this.Events.OnInitRow.add(function(grid, row) {
		row.dblclick(function() {
			// grid.Events.OnInitEdit.trigger($(this).attr("row-id"));
			grid.optionsData.editCallback(grid, $(this).attr("row-id"), $(this));
		});
	});
	
	this.Events.OnCommand = new EventHandler(this);
	this.Events.OnCommand.add(function(grid, params) {
		if(params.command == "select")
			grid.SelectRecord(params.id, params.element)
		else if(params.command == "edit") 
			grid.EditRecord(params.id, params.element)
		else if(params.command == "delete")
			grid.DeleteRecord(params.id, params.element)
		else if(params.command == "open")			
			grid.optionsData.editCallback(grid, params.id, params.element);
		else if(params.command == "menu")
			grid.ShowMenu(params.id, params.element)
	});
	
	this.Events.OnInitColumns.add(function(grid) {
		// console.log("OnInitColumns")
		if(grid.options.showSelection)
			grid.NewCommand({command:"select", float: grid.options.showFixedColumn ? "left" : "", internal:true});
			// grid.NewCommand({command:"select", float: "left"});
		
		if(grid.Methods.call("canEdit") && grid.crud.edit && !grid.options.cardView)
		// if(grid.Methods.call("canEdit") && grid.crud.edit)
			grid.NewCommand({command:"edit", float: grid.options.showFixedColumn ? "left" : "", internal:true});
			// grid.NewCommand({command:"edit", float: "left"});
		
		if(grid.Methods.call("canDelete") && grid.crud["delete"] && !grid.options.cardView)
		// if(grid.Methods.call("canDelete") && grid.crud["delete"])
			grid.NewCommand({command:"delete", float: grid.options.showFixedColumn  ? "left" : "", internal:true});
			// grid.NewCommand({command:"delete", float: "left"});
	});
	
	if(params.init) {
		// creator/owner of the grid must add an event to this.Events.OnInitGrid in "init"
		params.init(this);
	};
	
	this.Events.OnInitToolbar.add(function(grid, toolbar) {
		grid.toolbar = toolbar;
		if(grid.options.showRefreshButton) {
			toolbar.NewItem({
				id: "refresh",
				// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
				icon: "refresh",
				iconColor: "#8DCF6E",
				hint: "Refresh",
				click: function(item) {
					grid.Refresh();
				}
			});
		};
		
		if(grid.Methods.call("canAdd") && grid.crud.add) {
			toolbar.NewItem({
				id: "newrecord",
				// icon: "/engine/images/notebook-new-24.png",
				icon: "new",
				iconColor: "#1CA8DD",
				// hint: "Add Record",
				hint: grid.Methods.call("editTitle", "new"),
				click: function(item) {
					grid.optionsData.editCallback(grid, 0);
					// grid.Methods.call("newRecord");
					// grid.NewRecord();
					// grid.Events.OnCommand.trigger({command: "add", callback: function(grid) {
						// grid.NewRecord();
					// });
				}
			});
		};
		
		grid.Painter.ShowSearchInput(toolbar);
	})

	this.Events.OnInitGrid.trigger();
	this.cacheDatasetName = this.Methods.call("getCacheDatasetName");
	
	// this.Events.OnInitSelect.trigger(this.selections);
	
	this.dataParams = new Dataset([], "Paramaters");
	this.dataParams.grid = this;
	this.dataParams.Methods.add("gotoPage", function(dataset, page) {
		dataset.set("page", dataset.grid.page = page);
		dataset.grid.Refresh();
	});
	
	this.dataParams.append();
	this.dataParams.addColumn = function(name, value, options) {
		this.Columns.setprops(name, options);
		this.data[0][name] = value;
		return this;
	};

	this.dataParams.Events.OnClearSearch = new EventHandler(this.dataParams);
	this.dataParams.Events.OnClearSearch.add(function(dataset, grid) {
		// exclude the following fields: page, pagesize, sort
		var exclude = ["page","pagesize","sort","order"];
		// var exclude = dataset.Methods.call("excludeClear").concat(["page","pagesize","sort","order"]);
		dataset.Columns.each(function(i, column) {
			if(exclude.indexOf(column.fname) == -1) {
				column.set(null);
			};
		});
		
		grid.Refresh();
	});
	
	if(!desktop.cache || !desktop.cacheDataset.exists(this.cacheDatasetName + "_params")) {
		// console.log("1")
		this.Events.OnInitDataRequest.trigger(this.dataParams);
		this.Events.OnInitSelect.trigger(this.selections);
		desktop.cacheDataset.add(this.cacheDatasetName + "_params", this.dataParams);
	} else {
		// console.log("2")
		this.dataParams = desktop.cacheDataset.get(this.cacheDatasetName + "_params");
	};
	
	var self = this;
	
	this.Busy();
	
		// console.log(this.optionsData.cache)
	if(this.optionsData.cache && desktop.cacheDataset.exists(this.cacheDatasetName)) {
		// console.log("here")
		setTimeout(function() {
			self.PrepareFetchData(desktop.cacheDataset.get(self.cacheDatasetName));
		}, 2);
		// params.DelayPainting = false;
	} else {
		this.GetData("list", function(params) {
				for(var name in self.requestParams) {
					params[name] = self.requestParams[name];
				};
				
				params.qry = self.dataParams.stringifyRec(0);
				self.Events.OnInitRequestParams.trigger(params);
			},
			function(data) {
				self.PrepareFetchData(data);
				if(self.optionsData.cache)
					desktop.cacheDataset.add(self.cacheDatasetName, data);
			}
		);
	};
	
	params.DelayPainting = true;
};

JGrid.prototype.PrepareFetchData = function(data) {	
	var self = this;
	self.page = defaultValue(data.page, 1);
	self.row_count = defaultValue(data.row_count, 0);
	self.page_count = defaultValue(data.page_count, 0);
	self.crud = data.crud;
	
	self.Events.OnInitFetchedData.trigger(data);
	self.Events.OnInitData.trigger(self.dataset = self.Methods.call("initListData", data));
	for(var i = 0; i < data.table_count; i++) {
		self.Events.OnInitSubData.trigger({rawData:data["data_"+i], index:i});
	}
	
	self.Events.OnInitEditData.trigger(self.dataEdit = new Dataset([], "Edit"));
	self.Events.OnInitColumns.trigger();
	
	self.dataEdit.Events.OnPost.add(function(data, postCallback) {
		self.GetData("update", function(params) {
			params.mode = data.mode;
			params.data = data.stringifyRec(0);
		}, function(result) {
			var msg;
			if(result.status != 0) {
				msg = {};
				msg.title = "Update error";
				msg.message = result.message;
			} else {
				msg = "";
				self.Refresh();
			};
			
			postCallback(msg, result.status);
		});
	})
	
	self.Paint();
	self.AfterPaint();  
	self.Events.AfterPaintContent.trigger();
	self.Events.AfterRepainContent.trigger();
};

JGrid.prototype.CreateDefaultBands = function() {	
	if(!this.systemBand) this.systemBand = this.CreateBand("")
	
	this.bandLevels = 0;
	$(this.bands).each(function(i, band) {
		if(band.level > band.grid.bandLevels) band.grid.bandLevels = band.level;
	});
	
	if(this.systemBand && this.bandLevels) this.systemBand.rowSpan = this.bandLevels;
	
	this.EachColumn(function(i, column) {
		var systemColumns = ["edit","delete","open","select","menu"];
		if(column.command && systemColumns.indexOf(column.command > -1) {
			if(!column.grid.systemBand) column.grid.systemBand = column.grid.NewBand("");
			column.grid.systemBand.columns.push(column);
			column.band = column.grid.systemBand;
		} else if(!column.band) {
			if(!column.grid.defaultBand) column.grid.defaultBand = column.grid.NewBand("");
			column.grid.defaultBand.columns.push(column);
			column.band = column.grid.defaultBand;
		};
	});
};

JGrid.prototype.CreateBand = function(caption, parent) {
	var params = {
		grid: this,
		caption: caption,
		parent: parent
	};

	// if(parent)
		// this.bandLevels = 1
	// else
		// this.bandLevels = defaultValue(parent.level, 0) + 1;
	
	var band = new JGridBand(params);
	this.bands.push(band);
	return band;
};

JGrid.prototype.NewBand = function(caption, parent) {
	if(!this.systemBand) {
		this.systemBand = this.CreateBand("");
	};
	
	return this.CreateBand(caption, parent);
};

JGrid.prototype.InitBands = function(caption, callback) {
	var band = this.NewBand(caption);
	callback(band);
};

JGrid.prototype.ColumnClass = JGridColumn;

JGrid.prototype.CreateColumn = function(params) {
	params.grid = this;
	var col = new this.ColumnClass(params);
	this.list.add(params.id, col);
	return col;
};

JGrid.prototype.ClearColumns = function() {
	this.list.clear();
}

JGrid.prototype.NewColumn = function(params) {
	return this.CreateColumn(params);
};

JGrid.prototype.NewCommand = function(params) {
	if(typeof params == "string") {
		params = {
			id: params,
			command: params
		};
	} else {
		params.id = params.command;
		params.command = params.command;
	};
	params.width = 30;
	params.fixedWidth = true;
	params.grid = this;
	
	var systemColumns = ["edit","delete","open","select","menu"];
	// params.internal = defaultValue(params.internal, false);
	params.internal = systemColumns.indexOf(params.command) > -1;
	
	// var col = new this.ColumnClass(params);
	// this.list.add(params.id, col);
	return this.CreateColumn(params);
};

JGrid.prototype.EachColumn = function(callback) {
	this.list.each(callback);
};

JGrid.prototype.Count = function() {
	return this.list.count();
};

//**************************************************************************************************
// JDBGrid
//**************************************************************************************************
Class.Inherits(JDBGrid, JGrid);
function JDBGrid(Params) {
    JDBGrid.prototype.parent.call(this, Params);
};

JDBGrid.prototype.classID = "JDBGrid";

JDBGrid.prototype.DefaultPainter = function() {
    return new DataGridPainter(this);
    // return new JDataGridPainter(this);
};

JDBGrid.prototype.ColumnClass = JDBGridColumn;

JDBGrid.prototype.Initialize = function(params) {
    JDBGrid.prototype.parent.prototype.Initialize.call(this, params);
	
};

// JDBGrid.prototype.FocusRecord = function(id) {
	// this.Painter.tableContent.find("tr[focused='1']").removeAttr("focused", 0);
	// this.Painter.tableContent.find(("tr[row-id='{0}']").format(id)).attr("focused", 1);
// };
JDBGrid.prototype.AfterPaint = function() {
	JDBGrid.prototype.parent.prototype.AfterPaint.call(this); 
	// console.log("AfterPaint")
	if(this.options.lookupColumn) {
		// this.dataset.gotoKey(this.options.lookupColumn.get());
		// this.Painter.GotoRow(this.options.lookupColumn.get());
		this.dataset.gotoKey(this.options.lookupColumn.raw());
		this.Painter.GotoRow(this.options.lookupColumn.raw());
	};
	
	// if(this.options.simpleSearch) {
		// var self = this;
		// alerts(this.searchInput);
		// alerts(this.dataParams.get("page"));
		// this.dataParams.bindControl(this.Painter.searchInput, {
			// fname: "filter"
		// });
		// this.Painter.searchInput.focus();
		// this.dataParams.updateControls();
		// this.dataParams.Events.OnChanged.add(function(dataset) {
			// self.Refresh();
		// });
		
	// };
	// alerts(this.dialog);
};
	
JDBGrid.prototype.GetData = function(mode, init, callback) {	
	var params = {};
	
	if(this.optionsData.requestParams) {
		var p = this.optionsData.requestParams.split("&");
		$(p).each(function(i, s) {
			var p = s.split("=");
			params[p[0]] = p[1];
		});
	};
	
	if(init) init(params);
	
	// desktop.Ajax(this, ("/get/{0}/{1}").format(mode, this.optionsData.url), params, callback);
	var src, path = "app";
	var values = this.optionsData.url.split("/");
	
	if(values.length > 1) {
		path = values[0];
		src = values[1];
	} else
		src = values[0];
	
	// console.log(values.length);
	// console.log(values);
	// console.log(path);
	// console.log(src);
	// console.log(("/{0}/get/{1}/{2}").format(path, mode, src));

	desktop.Ajax(this, ("/{0}/get/{1}/{2}").format(path, mode, src), params, callback);
	
	// desktop.Ajax(this, ("/{0}/get/{1}/{2}").format("app", mode, this.optionsData.url), params, callback);
};

JDBGrid.prototype.UpdateSelection = function() {
	if(!this.Painter.content) return;
	var selections = "some";
	var selectionCount;
	
	if(this.options.cardView)
		selectionCount = this.Painter.content.find("div[grid-sec='card'][row-selected]").length
	else
		selectionCount = this.Painter.content.find("tr[row-selected]").length;

	if(selectionCount) {
		if(selectionCount == this.dataset.count()) {
			selections = "all";
		} else {
			selections = "some";
		};
	} else
		selections = "";
	
	if(this.Painter.header) {
		var cell;
		if(this.Painter.fixedHeader) {
			cell = this.Painter.fixedHeader.find("th[command='select']").attr("has-selections", selections)
		} else
			cell = this.Painter.header.find("th[command='select']").attr("has-selections", selections);
		
		if(selections == "some")
			desktop.GetSvg(cell.html(""), "db-selectsome")
		else if(selections == "all")
			desktop.GetSvg(cell.html(""), "db-selectall")
		else
			desktop.GetSvg(cell.html(""), "db-selectnone")
	};
};

JDBGrid.prototype.ClickCommand = function() {	
	// console.log("ClickCommand")
	// var id = $(this).parent().parent().attr("row-id");
	var id = $(this).closest("tr").attr("row-id");
	var col = $(this).data("column");
	col.grid.Events.OnCommand.trigger({
		id: id,
		command: col.command,
		element: $(this)
	});
};

JDBGrid.prototype.InitSelections = function(selections) {
	if(selections) {
		this.selections = [];
		var list = selections.split(",");
		for(var i=0; i<list.length; i++) {
			this.selections.push(list[i]);
		};
	};
};

JDBGrid.prototype.SetSelections = function(selections) {	// selections is a comma-delimeted string 
	if(selections) {
		var list = selections.split(",");
		for(var i=0; i<list.length; i++) {
			this.selections.push(list[i]);
		};
		
		this.Events.OnSelect.trigger(this.selections);
	};
};

JDBGrid.prototype.ShowMenu = function(id, c) {	
	var self = this;
	var confirm = this.Methods.call("deleteConfirm", id); 
	this.dataset.gotoKey(id);
	new JPopupDialog({
		Target: c,
		Modal: false,
		Painter: {
			painterClass: PopupBalloonPainter,
			color: "orange",
			snap: "bottom",
			align: "",
			inset: false,
			OnRenderHeader: function(dialog, container) {
				desktop.GetSvg(container, "menu").css("height", 24).css("fill", "white")
				// container.append("Menu");
				// container.html(c.title);
			},
			OnRenderContent: function(dialog, container) {
				var collection = [];
				var menus = {
					add: function(title) {
						var main = {
							// item.subItems.push({id:"claim", icon:"db-open", title:"Claim", url:"/app/claim/0"});
							add: function(title, url, icon) {
								this.item.subItems.push({icon:icon, title:title, url:url});
							},
							addCommand: function(title, callback, icon) {
								this.item.subItems.push({icon:icon, title:title, callback:callback});
							}
						};
						
						collection.push(main.item = {title:title, subItems:[]});
						return main;
					}
				}
				
				self.Events.OnInitGridMenu.trigger(menus);
				
				desktop.Painter.createNavigatorMenu({
					container: container,
					theme: "grid-menu",
					menus: collection,
					click: function(e) {
						// $(e).data("callback")();
						// console.log($(e.target).data("callback"))
						// console.log($(e.target))
						// location.hash = $(e.target).attr("href");
						dialog.Hide();
					},
					init: function(container, item) {
						if(item.url) {
							container.attr("href", item.url);
							container.attr("target", "_blank");
						} else if(item.callback) {
							// container.data("callback", item.callback);
							// container.data("dialog", dialog);
							container.click(item.callback);
							// console.log(container)
						}
					}
				});
				
				// container.html(c.message)
			},
			OnRenderFooter: function(dialog, container) {
				// CreateButton({
					// container: container,
					// caption: "Close",
					// enabled: true,
					// style: "blue",
					// click: function(button) {
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
	// ConfirmDialog({
		// target: c,
		// title: confirm.title,
		// message: confirm.message,
		// callback: function(dialog) {
			// self.GetData("delete", 
				// function(params) {
					// params.mode = "delete";
					// params.data = ('[{"{0}":{1}}]').format(self.dataset.primaryKey, id);
				// },
				// function(result) {
					// self.Refresh();
				// }
			// );
		// }
	// });
};

JDBGrid.prototype.SelectRecord = function(id, e) {	
	// console.log("here");
	var index = this.selections.indexOf(id);
	var parent, parent2;
	
	if(this.options.cardView)
		parent = e.closest("div[grid-sec='card']")
	else {
		parent = e.closest("tr");
		if(this.Painter.fixedHeader) {
			var id = parent.attr("row-id");
			parent2 = this.Painter.content.find(("tr[row-id='{0}']").format(id));
		};
	};
	
	
	var icon;
	if(index == -1) {
		this.Events.OnSelection.trigger({id: id, remove: false});
		this.selections.push(id);
		parent.attr("row-selected", 1);
		if(parent2) parent2.attr("row-selected", 1);
		icon = "db-select";
	} else {
		this.Events.OnSelection.trigger({id: id, remove: true});
		this.selections.splice(index, 1);
		parent.removeAttr("row-selected");
		if(parent2) parent2.removeAttr("row-selected");
		icon = "db-unselect";
	};
	
	 var column = e.data("column");
	// var click = e.click;
	var s = desktop.GetSvg(e.closest("td").html(""), icon).data("column", column);
	s.on("click", this.ClickCommand);
	
	this.UpdateSelection();
	this.Events.OnSelect.trigger(this.selections);
};
	
// JDBGrid.prototype.NewRecord = function() {	
	// this.GetData("new", 
		// function(params) {
			// params.id = 0;
		// },
		// function(result) {
			// result.caller.dataEdit.resetData(result.edit);
			// result.caller.Painter.EditDialog(result.caller.dataEdit.mode = "new");
		// }
	// );
// };

JDBGrid.prototype.EditRecord = function(id, target, initCallback) {
	// console.log(this.dataEdit.mode)
	if(!this.Methods.call("canEdit")) {
		this.editForm(id, "edit");
	} else {
		var self = this;
		if(id == 0)
			this.dataEdit.mode = "new"
		else
			this.dataEdit.mode = "edit";
		
		// console.log(thsis.dataEdit.mode)
		this.Painter.ShowEditDialog({
			// mode: this.dataEdit.mode = "edit",
			mode: this.dataEdit.mode,
			target: target, // this is the target element, the user clicked to activate edit
			editForm: function(container, dialog) {
				self.editForm(id, container, dialog, initCallback); // this call embeds the FormEditor in the container, refer to form-edit.js
			}
		});
	};
};

// JDBGrid.prototype.EditRecord = function(id) {	
	// this.GetData("edit", 
		// function(params) {
			// params.id = id;
		// },
		// function(result) {		
			// result.caller.dataEdit.resetData(result.edit);
			// result.caller.Painter.EditDialog(result.caller.dataEdit.mode = "edit");
		// }
	// );
// };

JDBGrid.prototype.DeleteRecord = function(id, c) {	
	var self = this;
	var confirm = this.Methods.call("deleteConfirm", id); 
	this.dataset.gotoKey(id);
	ConfirmDialog({
		target: c,
		title: confirm.title,
		message: confirm.message,
		callback: function(dialog) {
			self.GetData("delete", 
				function(params) {
					params.mode = "delete";
					params.data = ('[{"{0}":{1}}]').format(self.dataset.primaryKey, id);
				},
				function(result) {
					if(result.status < 0)
						ErrorDialog({
							target: c,
							title: "Attempt to delete failed",
							message: result.message,
							snap: "bottom",
							inset: false
						})
					// else if(result.status > 0)
						// InfoDialog({
							// target: c,
							// title: "Deletion was successful",
							// message: result.message,
							// snap: "bottom",
							// inset: false
						// })
					else
						self.Refresh();
				}
			);
		}
	});
};

JDBGrid.prototype.UpdateRecord = function(callback) {	
	var self = this;
	// this.dataEdit.set("plan_description", this.dataEdit.get("plan_description")+".");
	this.GetData("update", function(params) {
		params.mode = self.dataEdit.mode;
		params.data = self.dataEdit.stringifyRec(0);
	},
	function(data) {
		self.Refresh(callback);
		// self.dataEdit.resetData(data.edit);
	});
};

JDBGrid.prototype.ReturnLookupData = function(row) {
	var value = row.attr("row-id");
	this.dataset.gotoKey(value);
	this.options.lookupColumn.lookupDataset = this.dataset;
	
	this.options.lookupColumn.set(value);
	this.options.lookupDialog.Hide();
	// console.log(this.options.lookupColumn)
};

JDBGrid.prototype.Initialize = function(params) {	
    JDBGrid.prototype.parent.prototype.Initialize.call(this, params);
	
	this.Events.OnInitData.add(function(grid) {
		grid.dataset.Events.OnMoveRecord.add(function(dataset) {
			// if(grid.options.showFocused) {
				grid.Painter.FocusRow(dataset.getKey());
			// };
		});
	});
};

JDBGrid.prototype.InitializeEditor = function(pg) {
	var self = this;
	// alerts(pg.classID);
	var editorInit = {
		PageControl: pg,
		// NewEdit: function(caption, callback) {
		NewGroupEdit: function(caption, callback) {
			pg.NewTab(caption, {
				OnCreate: function(tab) {
					var container = CreateElement("div", tab.content).addClass("editor-tab-container")
						
					var editor = new JEditor({
						ID: "edit_" + tab.id,
						Container: container,
						Css: "editor"
					});	          
					
					editor.Dataset = self.dataEdit;
					
					callback(editor, tab);
					
					editor.Paint();
					editor.AfterPaint();
					editor.Dataset.updateControls();
				}
			});
		},
		NewContainer: function(caption, callback) {
			pg.NewTab(caption, {
				OnCreate: function(tab) {
					callback(CreateElement("div", tab.content).css("width", "100%"), tab);
				}
			});
		}
	};
	
	this.Events.OnInitEditor.trigger(editorInit);
	
	// pg.ShowTabs(false);
};

JDBGrid.prototype.Busy = function(busy) {
	// var self = this;
	this.Painter.Busy(busy);
	// setTimeout(function() {
		// self.Painter.Busy();
	// }, 1000)
};

//**************************************************************************************************
// JGridBand
//**************************************************************************************************
function JGridBand(params) {
    if (params == undefined) {
        return;
    };

    this.Initialize(params);
};

JGridBand.prototype.classID = "JGridBand";

JGridBand.prototype.Initialize = function(params) {
	this.bands = [];
	this.columns = [];	
    this.grid = params.grid;
	this.parent = params.parent;
	this.rowSpan = 0;
	if(params.parent)
		this.level = params.parent.level + 1
	else
		this.level = 0;
	
	this.caption = params.caption;
};

JGridBand.prototype.getCaption = function() {
	return this.caption;
	// return this.caption+","+this.Count();
	// return this.caption+","+this.bands.length;
};

JGridBand.prototype.HasFixedColumns = function(float) {
	var yes = false;
	$(this.columns).each(function(i, column) {
		if(column.float == float) yes = true;
		// if(column.command) yes = true;
	});
	
	return yes;
};

JGridBand.prototype.Count = function() {
	if(this.bands.length) {
		var count = 0;
		$(this.bands).each(function(i, band) {
			count += band.Count();
		});
		
		return count;
	} else
		return this.columns.length;
};

JGridBand.prototype.ColCount = function() {
	if(this.bands.length) {
		var count = 0;
		$(this.bands).each(function(i, band) {
			count += band.Count();
		});
		
		return count;
	} else
		return this.columns.length;
};

JGridBand.prototype.RowCount = function() {
	return this.bands.length;
};

JGridBand.prototype.InitBands = function(caption, callback) {
	var band = this.NewBand(caption);
	callback(band);
};

JGridBand.prototype.NewBand = function(caption) {
	var band = this.grid.NewBand(caption, this);
	// band.band = this;
	this.bands.push(band);
	return band;
};

JGridBand.prototype.NewColumn = function(params) {
	var col = this.grid.NewColumn(params);
	col.band = this;
	this.columns.push(col);
	return col;
};

JGridBand.prototype.NewCommand = function(params) {
	var col = this.grid.NewCommand(params);
	col.band = this;
	this.columns.push(col);
	return col;
};

//**************************************************************************************************
// JGridColumn
//**************************************************************************************************
function JGridColumn(params) {
    if (params == undefined) {
        return;
    };

    this.fname = params.fname;
    this.id = defaultValue(params.id, params.fname);
    this.Initialize(params);
};

JGridColumn.prototype.classID = "JGridColumn";

JGridColumn.prototype.Initialize = function(params) {
    this.grid = params.grid;
    this.internal = params.internal;
    this.command = params.command;
	this.width = params.width;
	this.caption = defaultValue(params.caption, params.fname);
	this.drawHeader = params.drawHeader;
	this.drawContent = params.drawContent;
	this.drawSummary = params.drawSummary;
	this.fixedWidth = defaultValue(params.fixedWidth, false);
	this.showSummary = defaultValue(params.showSummary, false);
	// this.allowSort = defaultValue(params.allowSort, false);
	if(!this.command)
		this.allowSort = defaultValue(params.allowSort, this.grid.options.allowSort);
		// this.allowSort = true;
	
	this.float = defaultValue(params.float, "none");
};

JGridColumn.prototype.getCaption = function() {
	return this.caption;
};

JGridColumn.prototype.getValue = function() {
	return this.caption;
};

//**************************************************************************************************
// JDBGridColumn
//**************************************************************************************************
Class.Inherits(JDBGridColumn, JGridColumn);
function JDBGridColumn(Params) {
    JDBGridColumn.prototype.parent.call(this, Params);
};

JDBGridColumn.prototype.classID = "JDBGridColumn";

JDBGridColumn.prototype.Initialize = function(params) {
    JDBGridColumn.prototype.parent.prototype.Initialize.call(this, params);
    this.dataset = params.grid.dataset;
};

JGridColumn.prototype.getCaption = function() {
	if(this.dataset) {
		var c = this.dataset.Columns.get(this.id);
		if(c) 
			return c.label
		else
			return this.caption
	} else
		return this.caption;
};

JGridColumn.prototype.getValue = function() {
	if(this.dataset) {
		var c = this.dataset.Columns.get(this.id);
		if(c)
			return c.text()
		else
			return ""
	} else
		return ""
};

JGridColumn.prototype.numeric = function() {
	if(this.dataset) {
		var c = this.dataset.Columns.get(this.id);
		if(c)
			return c.numeric
		else
			return false
	} else
		return false
};

//**************************************************************************************************
// JDBTreeView
//**************************************************************************************************
Class.Inherits(JDBTreeView, JDBGrid);
function JDBTreeView(Params) {
    JDBTreeView.prototype.parent.call(this, Params);
};

JDBTreeView.prototype.classID = "JDBTreeView";

JDBTreeView.prototype.Initialize = function(params) {
    JDBTreeView.prototype.parent.prototype.Initialize.call(this, params);

	this.settings = params.treeViewSettings;
	this.Events.BeforeRefresh.add(function(grid) {	
		grid.SaveTreeViewState();
	});
	
	this.Events.AfterRefresh.add(function(grid) {	
		grid.UpdateTreeView();
	});
	
	this.Events.OnInitRow.add(function(grid, row) {	
		row.attr("key-id", grid.dataset.get(grid.settings.key))
		row.attr("parent-id", grid.dataset.get(grid.settings.parent))
		if(grid.settings.hasChildren(grid)) {
			row.attr("has-items", 1)
			row.attr("parent-state", "expand")
		} else {
			row.attr("has-items", 0)
		};
	});	
};

JDBTreeView.prototype.SaveTreeViewState = function() {
	var self = this;
	this.TreeViewStates = [];
	this.container.find("tbody tr").each(function(i, r) {
		var state = {};
		state.id = $(r).attr("row-id");
		state.visible = $(r).is(":visible");
		if($(r).attr("parent-state")) {
			state.state = $(r).attr("parent-state");
		};
		
		self.TreeViewStates.push(state);
	});
};

JDBTreeView.prototype.UpdateTreeView = function() {
	if(this.TreeViewStates) {
		var self = this;
		$(this.TreeViewStates).each(function(i, v) {
			self.container.find(("tr[row-id='{0}']").format(v.id)).each(function(i, r) {
				if(v.state) {
					$(r).attr("parent-state", v.state);
				};
				
				if(!v.visible) {
					$(r).css("display", "none");
				};
			});
		});
		
		self.container.find("span[x-sec='parent']").each(function(i, o) {
			var r = $(o).closest("tr");
			if(r.attr("parent-state") == "expand")
				$(o).attr("x-toggle", "minus")
			else
				$(o).attr("x-toggle", "expand");
		});
		
		this.TreeViewStates = [];
	} else if(this.TreeViewCollapse) {
		// parent-state="expand"
		// <tr row-id="A01" odd="1" key-id="1" parent-id="0" has-items="1" parent-state="expand" focused="1" style="cursor: default;">

		// what is the class name of the grid?
		// var name = "grid-"+this.Window.CallerID;
		this.container.find("tr[parent-state='expand']").each(function(i, o) {
			$(o).attr("parent-state", "minus");
		});
		this.container.find("tr[has-items='0']").each(function(i, o) {
			$(o).css("display", "none");
		});
		this.container.find("span[x-toggle='minus']").each(function(i, o) {
			$(o).attr("x-toggle", "expand");
		});
	};
};

JDBTreeView.prototype.ToggleNode = function(node, collapse) {
	var self = this;
	var parent = node.parent().find(("tr[key-id='{0}']").format(node.attr("parent-id"));
	
	if(!collapse && parent.attr("parent-state") == "expand") 
		node.css("display", "");
	else if(collapse)
		node.css("display", "none");
		
	if(node.attr("has-items") == "1") {
		node.parent().find(("tr[parent-id='{0}']").format(node.attr("key-id")))
			.each(function(i, o) {
				if(!collapse && parent.attr("parent-state") == "expand") 
					self.ToggleNode($(o), collapse)
				else if(collapse)
					self.ToggleNode($(o), collapse)
			}
	}
};

JDBTreeView.prototype.ExpandNodes = function(e, collapse) {
	var toggle, collapse, state;
	if(collapse) {
		visible = "none";
		toggle = "expand";
		state = "minus";
	} else {
		visible = "";
		toggle = "minus";
		state = "expand";
	};
	
	e.closest("tr").attr("parent-state", state);
	
	var self = this;
	e.closest("table").find(("tr[parent-id='{0}']").format(e.attr("x-id")))
		.each(function(i, o) {
			self.ToggleNode($(o), collapse)
		}
	
	e.attr("x-toggle", toggle);
};

JDBTreeView.prototype.NewTreeViewColumn = function(params) {
	var self = this;
	params.drawContent = function(cell, column) {
		// console.log(cell)
		cell.html("");
		cell.css("padding-left", (column.dataset.get("level")-1)*16);
		
		var level = 0;
		var type = "";
		var toggle = "";
		var c = [];
		
		c.push("<div x-sec='main'>");

		if(column.grid.settings.hasChildren(column.grid)) {
			type = "parent"
			toggle = "minus";
		} else {
			type = "detail"
		};
			
		$(c.push(("<span x-sec='{0}' x-toggle='{1}' x-id={2}></span>").format(type, toggle, column.dataset.get(column.grid.settings.key))));
		
		column.grid.settings.preInitColumn(column, c);
		
		// c.push(("<span x-sec='caption' x-type='{1}'>{0}</span>").format(column.dataset.get("benefit_name"), type));
		// c.push(("<span x-sec='caption' x-type='{1}'>{0}</span>").format(column.dataset.get("benefit_name"), type));
		c.push(("<span x-sec='caption' x-type='{1}'>{0}</span>").format(column.dataset.get(column.fname), type));
		
		column.grid.settings.postInitColumn(column, c);
		
		c.push("</div>");
		
		cell.html(c.join(""))
			.find("span[x-sec='parent']")
			.each(function(i, o) {   
				// console.log(o)
				$(o).click(function() {
					self.ExpandNodes($(this), $(this).attr("x-toggle") == "minus");
				});
			});   
			
		// console.log(c)
	};
	
	this.NewColumn(params);
};
