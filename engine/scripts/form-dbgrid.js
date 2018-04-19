// *************************************************************************************************
// File name: form-dbgrid.js
// Last modified on
// 03-MAR-2015
// *************************************************************************************************
Class.Inherits(SubPageTable, SubPageData);
function SubPageTable(Params) {
	SubPageTable.prototype.parent.call(this, Params);
};

SubPageTable.prototype.classID = "SubPageTable";
SubPageTable.prototype.showToolbar = true;
SubPageTable.prototype.horzScroll = false;
SubPageTable.prototype.showPager = true;
SubPageTable.prototype.showSummary = false;

SubPageTable.prototype.Initialize = function(Params) {
	SubPageTable.prototype.parent.prototype.Initialize.call(this, Params);
};

SubPageTable.prototype.NewRecord = function() {
	this.grid.NewRecord();
};

SubPageTable.prototype.InitializeData = function(data) {
	SubPageTable.prototype.parent.prototype.InitializeData.call(this, data);
	// this.crud = data.crud;
	// alerts(this.crud);
};

SubPageTable.prototype.InitializeQuery = function(data) {
};

SubPageTable.prototype.InitializeDatatable = function(data, mode) {
};

SubPageTable.prototype.InitializeTableData = function(data) {
	// this.InitializeTableData(data, "table")
};

SubPageTable.prototype.InitializeEditData = function(data) {
	// this.InitializeTableData(data, "edit")
};

SubPageTable.prototype.InitializeEditor = function(editor) {
};

SubPageTable.prototype.InitializeToolbar = function(toolbar) {
	// var self = this;
	// if(this.rights.add && toolbar.grid.crud.add)
		// toolbar.NewItem({
			// id: "newrecord",
			// icon: "/engine/images/notebook-new-24.png",
			// hint: "Add Record",
			// click: function(item) {
				// self.NewRecord();
			// }
		// });
};

SubPageTable.prototype.InitializeColumns = function(grid) {
};

SubPageTable.prototype.InitializeGrid = function(grid) {
	
	grid.optionsData.url = this.dataSource;
	grid.options.showToolbar = this.showToolbar;
	grid.options.horzScroll = this.horzScroll;
	grid.options.showPager = this.showPager;
	grid.options.showSummary = this.showSummary;

	var parts = this.url.split("?");
	if(parts.length > 0
		grid.optionsData.requestParams = parts[1];
	
	// grid.Methods.add("canAdd", function(grid) {
		// return grid.owner.rights.add;
	// });
	
	// grid.Methods.add("canEdit", function(grid) {
		// return grid.owner.rights.edit;
	// });
	
	// grid.Methods.add("canDelete", function(grid) {
		// return grid.owner.rights["delete"];
	// });
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		grid.owner.InitializeQuery(dataParams);
	});
	
	grid.Events.OnInitData.add(function(grid, data) {
		// grid.owner.InitializeTableData(data.data_0);
		grid.owner.InitializeDatatable(data, "table");
		grid.owner.InitializeTableData(data);
	});
		
	grid.Events.OnInitEditData.add(function(grid, data) {
		grid.owner.InitializeDatatable(data, "edit");
		grid.owner.InitializeEditData(data);
	});
	
	grid.Events.OnInitEditor.add(function(grid, editor) {
		grid.owner.InitializeEditor(editor);
	});

	grid.Events.OnInitColumns.add(function(grid) {
		grid.owner.InitializeColumns(grid);
	});
	
	grid.Events.OnInitToolbar.add(function(grid, toolbar) {
		toolbar.grid = grid;
		grid.owner.InitializeToolbar(toolbar);
	});
};

SubPageTable.prototype.Paint = function() {
	SubPageTable.prototype.parent.prototype.Paint.call(this);
	this.PaintGrid();
	// this.Events.OnInitGrid.trigger(this.toolbar = this.Painter.createToolbar());
};

SubPageTable.prototype.PaintGrid = function() {
	this.grid = new JDBGrid({
		owner: this,
		// dataset: this.dataView,
		container: this.Painter.content,
		options: {
			horzScroll: false
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.owner.InitializeGrid(grid);
			});
		},
		Painter: {
			// buttonPainterClass: GridPainter,
			css: this.id
		},
		toolbarTheme:"svg"
		// Css: "toolbar",
		// Css: this.ToolbarCss,
		// Page: this,
	});
	
	// this.Events.OnInitGrid.trigger(this.dbgrid = this.Painter.createGrid());
	
	// this.dbgrid.OnInitColumns.add(function(grid) {
		// alerts("OK");
	// });
};
