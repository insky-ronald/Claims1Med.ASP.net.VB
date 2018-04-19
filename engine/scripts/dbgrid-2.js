// *************************************************************************************************
// File name: dbgrid-2.js
// Last modified on
// 14-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGrid
//**************************************************************************************************
Class.Inherits(jGrid, jControl)
function jGrid(params) {
    jGrid.prototype.parent.call(this, params)
}

jGrid.prototype.classID = "jGrid"
jGrid.prototype.controlType = "grid";

// jGrid.prototype.painterClass = jGridPainter
jGrid.prototype.painterClass = jGridPainter3

jGrid.prototype.initialize = function(params) {
    jGrid.prototype.parent.prototype.initialize.call(this, params)
	
	// console.log(params)
	this.Methods = this.methods // for backward compatibility
	this.Events = this.events // for backward compatibility
	this.NewColumn = this.newColumn // for backward compatibility
	this.NewCommand = this.newCommand // for backward compatibility
	this.NewBand = this.newBand // for backward compatibility
	this.Refresh = this.refresh // for backward compatibility
	
	this.editForm = params.editForm
	this.selectionColumn = params.selectionColumn // use only if this.options.showSelection is true
	
	this.options = $.extend({}, {
		viewType: "gridview", // gridview, cardview, treeview
		treeViewSettings: {
			keyColumnName: "", // name of the key column
			parentColumnName: "", // name of the parent column
			columnName: "" // name of the tree column
		},
		autoScroll: true, // if true, this will add a last column filler, otherwise, the last column will be set to width 100%
		editNewPage: false,
		showRefreshButton: true,
		showCustomHeader: false,
		showMasterDetail: false,
		showMenuButton: false,
		showPopupMenu: false,
		showSelection: false,
		showPreviewRow: false,
		showColumnHeader: true,
		showPager: true
	}, params.options)
	
	// this.options.editNewPage = defaultValue(this.options.editNewPage, false)
	// this.options.showPager = defaultValue(this.options.showPager, true)
	// this.options.showMasterDetail = defaultValue(this.options.showMasterDetail, false)
	// this.options.showRefreshButton = defaultValue(this.options.showRefreshButton, true)
	// this.options.showSelection = defaultValue(this.options.showSelection, false)
	// this.options.showMenuButton = defaultValue(this.options.showMenuButton, false)
	// this.options.showCustomHeader = defaultValue(this.options.showCustomHeader, false)
	// this.options.showPreviewRow = defaultValue(this.options.showCustomHeader, false)
	
	// this.options.autoScroll = defaultValue(this.options.autoScroll, true) // if true, this will add a last column filler, otherwise, the last column will be set to width 100%
	
	this.options.toolbar = $.extend({}, {
		size: 24,
		theme: "svg"
	}, params.paintParams.toolbar)
	
	// this.options.toolbar = $.extend({}, params.paintParams.toolbar)
	// this.options.toolbar.size = defaultValue(this.options.toolbar.size, 24)
	// this.options.toolbar.theme = defaultValue(this.options.toolbar.theme, "svg")
	
	// this.options.viewType = "gridview" // gridview, cardview, treeview
	// this.options.treeViewSettings = {
		// keyColumnName: "", // name of the key column
		// parentColumnName: "", // name of the parent column
		// columnName: "" // name of the tree column
	// }
	this.search = $.extend({}, {
		visible: false,
		mode: "",
		columnName: "",
		searchWidth: 500
	}, params.search)

	this.exportData = $.extend({}, {
		allow: false,
		name: "",
		souce: ""
	}, params.exportData)
	
	
	// this.search = $.extend({}, params.search)
	// this.search.visible = defaultValue(this.search.visible, false)
	// this.search.mode = defaultValue(this.search.mode, "") // simple, advanced
	// this.search.columnName = defaultValue(this.search.columnName, "") // required only if search.mode is "simple"
	// this.search.searchWidth = defaultValue(this.search.searchWidth, 500) // required only if search.mode is "asvanced"
	
	this.optionsData = $.extend(params.optionsData, {filtered: []})

	this.bands = new JList()
	// this.defaultBand = this.newBand({id:"default"})
	
	this.columns = new JList()
	this.selections = []
	this.hasLeftFixedColumns = false
	this.hasRightFixedColumns = false

	this.currentRowKey = undefined
	
	this.events.OnAfterPaint = new EventHandler(this)
	this.events.OnAfterPaint.add(function(grid) {
		if(grid.pager) grid.pager.update()
		grid.painter.updateHeaders()
		grid.painter.updateSelectionHeader()
		grid.painter.updateSelectionContents()
		if(grid.options.viewType === "gridview")
			grid.painter.focusRow(grid.currentRowKey)
	})
	
	this.events.OnInitToolbar = new EventHandler(this)
	this.events.OnInitToolbar.add(function(grid, toolbar) {
		grid.toolbar = toolbar;
		if(grid.options.showRefreshButton) {
			toolbar.NewItem({
				id: "refresh",
				icon: "refresh",
				iconColor: "#8DCF6E",
				hint: "Refresh",
				dataBind: grid.dataset,
				dataEvent: function(dataset, button) {
					button.show(!dataset.editing);
				},
				click: function(item) {
					grid.refresh();
				}
			});
		};
		
		if(grid.crud.add) {
			toolbar.NewItem({
				id: "new",
				icon: "new",
				iconColor: "#1CA8DD",
				hint: "Add Record",
				click: function(item) {
					grid.editRecord("new", item)
				}
			});
		};
		
		if(grid.exportData.allow) {
			grid.painter.showExport();
		}
		
		if(grid.search.visible && grid.search.mode === "advanced") {
			grid.painter.showAdvancedSearch();
		}
	})
	
	this.events.OnCommand = new EventHandler(this);
	this.events.OnCommand.add(function(grid, params) {
		if(params.command == "select")
			grid.selectRow(params.id, params.element)
		else if(params.command == "edit")
			grid.editRecord(params.id, params.element)
		else if(params.command == "delete")
			grid.deleteRecord(params.id, params.element)
		// else if(params.command == "open")			
			// grid.optionsData.editCallback(grid, params.id, params.element);
		else if(params.command == "menu")
			grid.showMenu(params.id, params.element)
		else if(params.command == "master-detail") {
			params.element.trigger("update")
			// grid.showMenu(params.id, params.element)
		}
	});
	
	this.events.OnPopupMenu = new EventHandler(this)
	
	this.events.OnMasterDetail = new EventHandler(this)
	
	this.events.OnInitCard = new EventHandler(this)
	this.events.OnDrawCustomHeader = new EventHandler(this)
	this.events.OnInitRow = new EventHandler(this)
	this.events.OnInitColumns = new EventHandler(this)
	this.events.OnInitColumns.add(function(grid) {
		if(grid.crud.edit || grid.crud["delete"] || grid.options.showSelection || grid.options.showMenuButton) 
			grid.NewBand({id:"db-control", caption: "", fixed:"left"}, function(band) {
				if(grid.options.showSelection) band.NewCommand({command:"select", internal: true})
				if(grid.options.showMenuButton) band.NewCommand({command:"menu", internal: true})
				if(grid.crud.edit && !grid.options.editNewPage) band.NewCommand({command:"edit", internal: true})
				if(grid.crud["delete"]) band.NewCommand({command:"delete", internal: true})
				if(grid.crud.edit && grid.options.editNewPage) band.NewCommand({command:"open", internal: true})
			})
		
		if(grid.options.showMasterDetail) 
			grid.NewBand({id:"master-detail", caption: "", fixed:"left"}, function(band) {
				band.NewCommand({command:"master-detail", internal: true})
			})
	})
	
	this.events.OnTreeViewButtons = new EventHandler(this)
	
	this.events.OnInitRequestParams = new EventHandler(this) // this is called in jGrid.fetchData()
	this.events.OnPrepareQuery = new EventHandler(this) // this is called in jGrid.fetchData()
	this.events.OnPrepareQuery.add(function(grid, data) {
		// console.log("OnPrepareQuery")
		if(grid.selectionColumn && !grid.preparedQuery) {
			grid.preparedQuery = true;
			var list = grid.selectionColumn.get().split(",")
			for(var i=0; i<list.length; i++) {
				if(list[i] !== "")
					if(grid.dataset.keyIsNumeric())
						grid.selections.push(parseInt(list[i]))
					else
						grid.selections.push(list[i]);
			};
		};
	});
	
	this.events.OnInitFetchedData = new EventHandler(this)
	this.events.OnInitFetchedData.add(function(grid, data) {
		grid.page = defaultValue(data.page, 1)
		grid.row_count = defaultValue(data.row_count, 0)
		grid.page_count = defaultValue(data.page_count, 0)
		grid.crud = data.crud
	})
	
	this.events.OnEdit = new EventHandler(this)
	this.events.OnInitData = new EventHandler(this)
	this.events.OnInitSubData = new EventHandler(this)
	this.events.OnInitSubDataEx = new EventHandler(this)
	this.events.OnInitEditData = new EventHandler(this)
	this.events.OnInitSearch = new EventHandler(this);
	
	this.cacheDatasetName = this.methods.call("getCacheDatasetName")
	
	this.events.OnInitDataRequest = new EventHandler(this)
	{ // data request query parameters
		this.dataParams = new Dataset([], "Paramaters")
		this.dataParams.grid = this
		this.dataParams.Methods.add("gotoPage", function(dataset, page) {
			dataset.set("page", dataset.grid.page = page)
			dataset.grid.Refresh()
		})
		
		this.dataParams.append()
		this.dataParams.addColumn = function(name, value, options) {
			this.Columns.setprops(name, options)
			this.data[0][name] = value
			return this
		}
		
		this.dataParams.Methods.add("excludeInClearSearch", function(dataset) {
			return ["page","pagesize","sort","order"];
		})
		
		this.dataParams.Events.OnClearSearch = new EventHandler(this.dataParams)
		this.dataParams.Events.OnResetSearch = new EventHandler(this.dataParams)
		this.dataParams.Events.OnClearSearch.add(function(dataset, grid) {
			var exclude = dataset.Methods.call("excludeInClearSearch");
			dataset.Columns.each(function(i, column) {
				if(exclude.indexOf(column.fname) == -1) {
					column.set(null)
				}
			});
			
			console.log(dataset.Events)
			dataset.Events.OnResetSearch.trigger();
			
			grid.Refresh();
		})
		
	} // data request query parameters
	
	{ // Methods
		this.methods.add("canAdd", function(grid) {
			return grid.crud.add
		})
		
		this.methods.add("canEdit", function(grid) {
			return grid.crud.edit
		})
		
		this.methods.add("canDelete", function(grid) {
			return grid.crud["delete"]
		})
		
		this.methods.add("editPageUrl", function(grid) {
			return ""
		})
		
		this.methods.add("initListData", function(grid, data) {
			return new Dataset(data.data_0, "Data")
		})
		
		this.methods.add("resetListData", function(grid, data) {
			return data.data_0
		})
		
		this.methods.add("deleteConfirm", function(grid, id) {
			return {
				title: "Delete?",
				message: "Just delete it!" + id
			}
		})
		
		this.methods.add("deleteKeys", function(grid, id) {
			var params = {};
			params[grid.dataset.primaryKey] = id;
			return [params];
			// if(grid.dataset.keyIsNumeric())
				// return ('[{"{0}":{1}}]').format(grid.dataset.primaryKey, id)
			// else
				// return ('[{"{0}":"{1}"}]').format(grid.dataset.primaryKey, id);
		})
		
		this.methods.add("getCacheDatasetName", function(grid) {
			return grid.optionsData.url
		})
		
		this.methods.add("localSearch", function(grid, options) {
			// return grid.optionsData.url
			// return options.expression.test(options.row["name"]) || options.expression.test(options.row["code"])
			return true
		})
		
		this.methods.add("allowCommand", function(grid, column, previous) {
			return true
		})
		
		this.methods.add("getCommandHeaderIcon", function(grid, column, previous) {
			if(column.command === "master-detail")
				return "db-master-detail"
			else if(column.command == "edit")
				return "db-edit"
			else if(column.command == "delete")
				return "db-delete"
			else
				return previous
		})
		
		this.methods.add("getCommandIcon", function(grid, column, previous) {
			if(column.command === "open")
				return "db-open"
			else if(column.command == "edit")
				return "db-edit"
			else if(column.command == "delete")
				return "db-delete"
			else
				return previous
		})
		
		this.methods.add("getCommandHint", function(grid, column, previous) {
			if(column.command == "master-detail")
				return "Show/Hide detail information"
			else if(column.command == "edit")
				return "Edit record"
			else if(column.command == "delete")
				return "Delete record"
			else if(column.command == "open")
				return "Open record in new a window or tab"
			else
				return previous
		})
		
		this.methods.add("getCommandUrl", function(grid, column, previous) {
			return ""
		})
		
		this.methods.add("getLinkUrl", function(grid, params, previous) {
			// params = {column, id}
			return ""
		})
		
		this.methods.add("editTitle", function(grid, mode, previous) {
			if(mode == "edit")
				return "Edit"
			else if(mode == "new")
				return "Add Record"
			else
				return ""
		})
	} // Methods
	
	this.params.delayPainting = function(grid) {
		grid.painter.prePaint();
		grid.fetchData("init", function(grid, data) {
			grid.prepareFetchData(data, function(grid) {
				grid.events.OnInitColumns.trigger()
				
				// always add a filler at the end - NO!
				// add a filles if options.autoScroll == true
				// if(grid.options.autoScroll)
				if(grid.options.horzScroll)
					grid.NewBand({id:"~filler", filler: true}, function(band) {
						band.NewColumn({allowSort: false, fixedWidth:false});
					})
				
				grid.bands.each(function(i, band) {
					if(band.fixed === "left") band.grid.hasLeftFixedColumns = true
					if(band.fixed === "right") band.grid.hasRightFixedColumns = true
				})

				grid.paint()
				grid.events.OnAfterPaint.trigger()
			})
			if(grid.optionsData.cache)
				desktop.cacheDataset.add(grid.cacheDatasetName, data)
			
		})
	}
}

jGrid.prototype.afterInitialize = function() {
	this.Events.OnInitData.trigger(this.dataset = new Dataset([], "Data"));
	this.events.OnInitDataRequest.trigger(this.dataParams)
	// this.Events.OnPrepareQuery.trigger(this.dataParams)
	
    jGrid.prototype.parent.prototype.afterInitialize.call(this)
}

jGrid.prototype.fetchData = function(mode, callback) {	
	var self = this;
	this.painter.showBusy(true)
	this.getData("list", function(params) {
			for(var name in self.requestParams) {
				params[name] = self.requestParams[name]
			}
			
			self.Events.OnPrepareQuery.trigger(self.dataParams)
			self.Events.OnInitRequestParams.trigger(params)
			params.qry = self.dataParams.stringifyRec(0)
		},
		function(data) {
			self.events.OnInitFetchedData.trigger(data)
			
			if(callback) callback(self, data)
			
			self.painter.showBusy(false)
		}
	)
}

// jGrid.prototype.getCurrentKey = function() {
	// return this.painter.getCurrentKey()
	// return this.bands.getByIndex(0)
// }

jGrid.prototype.refresh = function(keepData) {	
	var self = this
	
	if(!this.dataset.empty())
		this.currentRowKey = this.dataset.getKey()
	
	if(!keepData) {
		this.fetchData("refresh", function(grid, data) {
			self.dataset.resetData(self.methods.call("resetListData", data));
			for(var i = 0 i < data.table_count i++) {
				self.events.OnInitSubData.trigger({rawData:data["data_"+i], index:i})
			}
			
			self.painter.update()
			self.events.OnAfterPaint.trigger()
		})
	} else {
			// self.dataset.resetData(self.dataset.);
			// for(var i = 0 i < data.table_count i++) {
				// self.events.OnInitSubData.trigger({rawData:data["data_"+i], index:i})
			// }
			this.painter.showBusy(true)
			this.painter.update()
			this.events.OnAfterPaint.trigger()
			this.painter.showBusy(false)
			
			// this.painter.showBusyEx(function() {
				// self.painter.update()
				// self.events.OnAfterPaint.trigger()
				// self.painter.showBusy(false)
			// });
	}
}

// jGrid.prototype.repaint = function() {
	// this.bands.each(function(i, band) {
		// band.painter.update()
	// })
	// this.painter.update()
	// this.events.OnAfterPaint.trigger()
// }

jGrid.prototype.updateSelections = function() {	
	if(this.selectionColumn) {
		this.selectionColumn.set(this.selections.join(","));
	}
};

jGrid.prototype.prepareFetchData = function(data, callback) {	
	var self = this;

	// console.log("here")
	this.Events.OnInitData.trigger(this.dataset = self.Methods.call("initListData", data));
	this.Events.OnInitSubDataEx.trigger(data);
	
	for(var i = 0 i < data.table_count i++) {
		self.Events.OnInitSubData.trigger({rawData:data["data_"+i], index:i});
	};
	
	this.Events.OnInitEditData.trigger(this.dataEdit = new Dataset([], "Edit"));
	
	// this.dataEdit.Events.OnPost.add(function(dataSet, postCallback) {
		// self.GetData("update", function(params) {
			// params.mode = dataSet.mode;
			// params.data = dataSet.stringifyRec(0);
		// }, function(result) {
			// var msg;
			// if(result.status != 0) {
				// msg = {};
				// msg.title = "Update error";
				// msg.message = result.message;
			// } else {
				// msg = "";
				// self.Refresh();
			// };
			
			// postCallback(msg, result.status)
		// });
	// });
	
	callback(this);
};
	
jGrid.prototype.getData = function(mode, init, callback) {	
	var params = {}
	// console.log(mode)
	if(this.optionsData.requestParams) {
		var p = this.optionsData.requestParams.split("&")
		$(p).each(function(i, s) {
			var p = s.split("=")
			params[p[0]] = p[1]
		})
	}
	
	if(init) init(params)
	
	var src, path = "app"
	var values = this.optionsData.url.split("/")
	
	if(values.length > 1) {
		path = values[0]
		src = values[1]
	} else
		src = values[0]
	
	desktop.Ajax(this, ("/{0}/get/{1}/{2}").format(path, mode, src), params, callback)
}

jGrid.prototype.eachBand = function(callback) {
	var self = this;
	var gather = function(band) {
		callback(band)
		band.bands.each(function(i, band) {
			gather(band)
		})
	}
	
	this.bands.each(function(i, band) {
		gather(band)
	})
}

jGrid.prototype.eachColumn = function(callback) {
	this.columns.each(function(i, column) {
		callback(column)
	})
}

jGrid.prototype.createBand = function(params) {
	return new jGridBand(params)
}

jGrid.prototype.newBand = function(params, callback) {
	params.owner = this
	var band = this.createBand(params)
	if(callback) callback(band)
		
	return this.bands.add(params.id, band)
}

jGrid.prototype.createColumn = function(params) {
	if(params.command) {
		params.fname = ""
		params.width = 32		
		params.useAnchor = defaultValue(params.useAnchor, false)
		// params.internal = defaultValue(params.internal, false)
	}
	
	return this.columns.add(params.fname, new jGridColumn(params))
}

jGrid.prototype.newColumn = function(params) {
	params.owner = this
	if (!params.band) {
		if (!this.defaultBand)
			this.defaultBand = this.newBand({id:"default"})
		
		params.band = this.defaultBand
	}
	
	return params.band.newColumn(params)
}

jGrid.prototype.newCommand = function(params) {
	return this.newColumn(params)
}

jGrid.prototype.selectRow = function(id, e) {	
	if(this.dataset.keyIsNumeric()) id = parseInt(id)
	
	var index = this.selections.indexOf(id)
	if(index === -1)
		this.selections.push(id)
	else
		this.selections.splice(index, 1)
	
	this.updateSelections()
	
	e.trigger("update")
	this.painter.updateSelectionHeader()
}

jGrid.prototype.showMenu = function(id, e) {	
	if(this.options.showMenuButton || this.options.showPopupMenu)
		this.painter.showMenu(id, e)
}

jGrid.prototype.showSelectionOptions = function(e, init) {	
	this.painter.showSelectionOptions(e, init)
}

jGrid.prototype.deleteRecord = function(id, c) {	
	var self = this;
	var confirm = this.Methods.call("deleteConfirm", id); 
	
	this.dataset.gotoKey(id);
	ConfirmDialog({
		target: c,
		title: confirm.title,
		message: confirm.message,
		callback: function(dialog) {
			self.getData("delete", 
				function(params) {
					params.mode = "delete";
					params.data = JSON.stringify(self.methods.call("deleteKeys", id));
					// params.data = self.methods.call("deleteKeys", id);
					// if(self.dataset.keyIsNumeric())
						// params.data = ('[{"{0}":{1}}]').format(self.dataset.primaryKey, id)
					// else
						// params.data = ('[{"{0}":"{1}"}]').format(self.dataset.primaryKey, id);
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
					// else if(result.deleted)
						// self.painter.deleteRow(id)
					else
						self.refresh();
				}
			);
		}
	});
}

jGrid.prototype.editRecord = function(id, target) {	
// jGrid.prototype.editRecord_OLD = function(id, target) {
	var self = this;
	
	if(this.options.editNewPage) {
		if(id == 0)
			window.open(this.methods.call("editPageUrl", "new"), "_blank")
		if(id === "new")
			window.open(this.methods.call("editPageUrl", "new"), "_blank")
		else
			window.open(this.methods.call("editPageUrl", id), "_blank")
		
		return
	}

	if(id == 0)
		this.dataEdit.mode = "new"
	if(id === "new")
		this.dataEdit.mode = "new"
	else
		this.dataEdit.mode = "edit";
	
	this.painter.showEditDialog({
		mode: this.dataEdit.mode,
		target: target, // this is the target element, the user clicked to activate edit
		editForm: function(container, dialog) {
			self.editForm(id, container, dialog); // this call embeds the FormEditor in the container, refer to form-edit.js
		}
	});
}

jGrid.prototype.exportGrid = function(dialog) {	
	var getColumns = function(grid) {
		var columns = [];
		grid.eachColumn(function(c) {
			if(c.fname) {
				columns.push({
					type: grid.dataset.Columns.get(c.fname).type,
					name: c.fname,
					label: grid.dataset.Columns.get(c.fname).label,
					width: c.width
				})
			};
		});
		
		return JSON.stringify(columns)
	};
	
	var self = this;
	desktop.Ajax(self, "/engine/exportxls.aspx", {
		ext: "xls",
		exportName: this.exportData.name,
		source: this.exportData.source,
		searchData: this.dataParams.stringifyRec(0),
		columnsData: getColumns(this)
	}, 
	function(data) {
		dialog.Hide();
		if(self.tempframe) self.tempframe.remove();
		self.tempframe = CreateElement("iframe", $(document.body))
			.css("display", "none")
			.attr("src", ("/api/download/temp?file={0}.{1}&name={2}.{1}").format(data.src, data.ext, self.exportData.name));
	});
};

jGrid.prototype.localFilter = function() {
	var data = [];

	// console.log(this.SimpleSearchText())
	this.refresh();
	return;
	var self = this;
	var filter = this.SimpleSearchText();
	var searchExp = new RegExp(filter, 'i');
	this.optionsData.filtered = [];
	this.dataset.each(function(dataRow, i)) {
		var id = dataRow[self.dataset.primaryKey];
		var search = {
			expression:searchExp, 
			row:dataRow,
			test: function(name) {
				return this.expression.test(this.row[name])
			}
		};
		
		if(self.Methods.call("localSearch", search)) {
			self.optionsData.filtered.push(id);
		};
	});
	
	this.Painter.RepaintContent();
	// this.Busy();
};
