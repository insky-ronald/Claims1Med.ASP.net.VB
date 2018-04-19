// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: brokers.js
//==================================================================================================
function CreateSubPage(params){
	return new Brokers(params)
};

Class.Inherits(Brokers, SubPageTable);
function Brokers(Params) {
	Brokers.prototype.parent.call(this, Params);
};

Brokers.prototype.classID = "Brokers";
Brokers.prototype.dataSource = "brokers";
Brokers.prototype.showToolbar = true;
Brokers.prototype.horzScroll = false;
Brokers.prototype.showPager = true;
Brokers.prototype.showSummary = false;

Brokers.prototype.Open = function(id) {
	window.open(("/nav/broker/{0}").format(id), "")
};

Brokers.prototype.NewRecord = function() {
	this.Open(0);
};

Brokers.prototype.InitializeGrid = function(grid) {
	Brokers.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	grid.options.allowSort = true;
	grid.options.simpleSearch = true;
	grid.options.showSelection = true;
	
	grid.Events.OnCommand.add(function(grid, params) {
		if(params.command == "open")
			grid.owner.Open(params.id)
	});
	
	grid.Events.OnInitRow.add(function(grid, row) {
		if(grid.dataset.get("pa_id") != 0) {
			row.attr("x-pa", "true")
		};

		row.dblclick(function() {
			grid.owner.Open($(this).attr("row-id"));
		});
	});
}

Brokers.prototype.InitializeQuery = function(data) {
	Brokers.prototype.parent.prototype.InitializeQuery.call(this, data);
	data
		.addColumn("filter", "")
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "name")
		.addColumn("order", "asc")
};

Brokers.prototype.InitializeTableData = function(data) {
	Brokers.prototype.parent.prototype.InitializeTableData.call(this, data);
	data.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("pin", {label:"PIN"})
		.setprops("name", {label:"Name"})
		.setprops("currency_code", {label:"Currency"})
		.setprops("country", {label:"Country"})
};

Brokers.prototype.InitializeColumns = function(grid) {
	Brokers.prototype.parent.prototype.InitializeColumns.call(this, grid);
	grid.NewCommand({command:"open", float: grid.owner.horzScroll ? "left" : ""});
	// grid.NewColumn({fname: "pin", width: 50, allowSort: true});
	grid.NewColumn({fname: "name", width: 450, allowSort: true});
	// grid.NewColumn({fname: "currency_code", width: 100});
	grid.NewColumn({fname: "country", width: 300});
};
