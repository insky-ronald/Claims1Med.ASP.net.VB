// ****************************************************************************************************
// Last modified on 
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: Notes.js
//==================================================================================================
function CreateSubPage(params){
	return new Notes(params)
};

Class.Inherits(Notes, SubPageData);
function Notes(Params) {
	Notes.prototype.parent.call(this, Params);
};

Notes.prototype.classID = "Notes";
Notes.prototype.showHeader = false;
Notes.prototype.showFooter = false;
Notes.prototype.dataSource = "notes";

Notes.prototype.Initialize = function(Params) {
	Notes.prototype.parent.prototype.Initialize.call(this, Params);
};

Notes.prototype.InitializeData = function(data) {
	Notes.prototype.parent.prototype.InitializeData.call(this, data);
	// alerts(this.serverData.module);
	// this.serverData = data; // holds the entire JSON from server
	// this.rights = data.rights;
};

Notes.prototype.Paint = function() {
	Notes.prototype.parent.prototype.Paint.call(this);
	
};

Notes.prototype.AfterPaint = function() {
	Notes.prototype.parent.prototype.AfterPaint.call(this);
	
	// this.Painter.content.parent().addClass("notes-container");
	// this.Painter.content.addClass("notes");
	
	ClientsView({
		container: this.Painter.content,
		canAdd: this.rights.add,
		canEdit: this.rights.edit,
		canDelete: this.rights["delete"]
	});
	
	return;
	this.grid = new JDBGrid({
		owner: this,
		container: this.Painter.content,
		options: {
			horzScroll: false
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "clients";
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "name";
				// grid.optionsData.editCallback = function(grid, id) {
					// __client(id);
				// };

				// var parts = this.url.split("?");
				// if(parts.length > 0
					// grid.optionsData.requestParams = parts[1];
				
				grid.Methods.add("canAdd", function(grid) {
					return grid.owner.rights.add;
					// return false;
				});
				
				grid.Methods.add("canEdit", function(grid) {
					return grid.owner.rights.edit;
					// return false;
				});
				
				grid.Methods.add("canDelete", function(grid) {
					return grid.owner.rights["delete"];
					// return false;
				});
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					// grid.owner.InitializeQuery(dataParams);
					dataParams
						.addColumn("name", "")
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "pin")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					// grid.owner.InitializeTableData(data);
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("pin", {label:"PIN"})
						.setprops("name", {label:"Name"})
						.setprops("currency_code", {label:"Currency"})
						.setprops("country", {label:"Country"})
				});
					
				grid.Events.OnInitEditData.add(function(grid, data) {
					// grid.owner.InitializeEditData(data);
				});
				
				grid.Events.OnInitEditor.add(function(grid, editor) {
					// grid.owner.InitializeEditor(editor);
				});

				grid.Events.OnInitColumns.add(function(grid) {
					// grid.owner.InitializeColumns(grid);
					// grid.NewCommand({command:"open", float: "left"});
					grid.InitBands("Client", function(band) {
						band.InitBands("PIN and Name", function(band) {
							band.InitBands("1", function(band) {
								band.NewColumn({fname: "pin", width: 100, allowSort: true});
							});
							
							band.InitBands("2", function(band) {
								band.NewColumn({fname: "name", width: 300, allowSort: true});
							});
						})
						band.InitBands("Currency and Country", function(band) {
							band.NewColumn({fname: "currency_code", width: 100});
							band.NewColumn({fname: "country", width: 200});
						});
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				});
			});
		},
		Painter: {
			css: "clients"
		}
	});	
};
