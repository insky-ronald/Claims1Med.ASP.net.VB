// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: clients.js
//==================================================================================================
function CreateSubPage(params){
	return new Clients(params)
};

Class.Inherits(Clients, SubPageTable);
function Clients(Params) {
	Clients.prototype.parent.call(this, Params);
};

Clients.prototype.classID = "Clients";
Clients.prototype.dataSource = "clients";
Clients.prototype.showHeader = true;
Clients.prototype.showToolbar = true;
// Clients.prototype.horzScroll = true; // at 870px width show the scrollbar
Clients.prototype.showPager = true;
Clients.prototype.showSummary = false;

Clients.prototype.InitializeGrid = function(grid) {
	Clients.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	grid.options.cardView = false;
	// grid.options.cardView = true;
	grid.options.autoScroll = true;
	grid.options.allowSort = true;
	grid.options.showSelection = true;
	// grid.options.showBand = true;
	grid.options.showBand = false;
	grid.options.simpleSearch = true;
	grid.options.simpleSearchField = "name";
	grid.optionsData.editCallback = function(grid, id) {
		__client(id);
	};
	
	grid.Events.OnInitRow.add(function(grid, row) {
		if(grid.dataset.get("pa_id") != 0) {
			row.attr("x-pa", "true")
		};
	});
	
	grid.Events.OnInitCard.add(function(grid, card) {
		var c = CreateElement("div", card).attr("x-client", "header");
		CreateElement("a", c)
			.attr("x-client", "name")
			.html(grid.dataset.text("name"))
		CreateElement("a", c)
			.attr("x-client", "pin")
			.html(grid.dataset.text("pin"));
			
		var f = CreateElement("div", card).attr("x-client", "footer");
		CreateElement("a", f)
			.attr("x-client", "country")
			.html(grid.dataset.text("country"))
	});
}

Clients.prototype.InitializeQuery = function(data) {
	Clients.prototype.parent.prototype.InitializeQuery.call(this, data);
	data
		.addColumn("name", "")
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "pin")
		.addColumn("order", "asc")
};

Clients.prototype.InitializeTableData = function(data) {
	Clients.prototype.parent.prototype.InitializeTableData.call(this, data);
	data.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("pin", {label:"PIN"})
		.setprops("name", {label:"Name"})
		.setprops("currency_code", {label:"Currency"})
		.setprops("country", {label:"Country"})
};

Clients.prototype.InitializeColumns = function(grid) {
	Clients.prototype.parent.prototype.InitializeColumns.call(this, grid);
	if(grid.options.cardView) {
		grid.NewColumn({fname: "pin", width: 75, allowSort: true, fixedWidth: true});
		grid.NewColumn({fname: "name", width: 100, allowSort: true, fixedWidth: true});
		grid.NewColumn({fname: "currency_code", width: 100, allowSort: true, fixedWidth: true});
		grid.NewColumn({fname: "country", width: 100, allowSort: true, fixedWidth: true});
		grid.NewColumn({fname: "", width: 400, allowSort: false});
	} else {
		grid.NewCommand({command:"open", float: "left"});
		
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
	};
};

Clients.prototype.InitializeToolbar = function(toolbar) {
	Clients.prototype.parent.prototype.InitializeToolbar.call(this, toolbar);
	var self = this;
	toolbar.NewItem({
		id: "newrecord",
		icon: "test",
		iconColor: "firebrick",
		hint: "Test Show/Hide horzScroll",
		click: function(item) {
			// self.grid.Refresh();
			// self.grid.options.horzScroll = true;
			// self.grid.Painter.ShowHorzScroll(true);
			self.grid.Painter.ShowHorzScroll(!self.grid.options.horzScroll);
			// if(!self.grid.dataset.empty())
				// self.grid.dataset.gotoKey(key);
			
		}
	});
	
	toolbar.NewDropdownItem({
		id: "test",
		// icon: btnImage,
		icon: "search",
		iconColor: "#315B8F",
		// iconColor: "firebrick",
		color: "#315B8F",
		hint: "Search",
		align: "left",
		// dlgAlign: "right",
		// snap: "right",
		painter: {
			content: function(dialog, container) {
				container.css("width", 400);
			}
		}
	});
	
	toolbar.NewItem({
		id: "newrecord",
		icon: "test",
		iconColor: "green",
		hint: "Test Show/Hide horzScroll",
		click: function(item) {
			// self.grid.Refresh();
			// self.grid.options.horzScroll = true;
			// self.grid.Painter.ShowHorzScroll(true);
			// self.grid.Painter.ShowHorzScroll(!self.grid.options.horzScroll);
			// if(!self.grid.dataset.empty())
				// self.grid.dataset.gotoKey(key);
			
		}
	});
};
