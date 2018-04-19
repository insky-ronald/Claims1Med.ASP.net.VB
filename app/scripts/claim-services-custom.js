// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// this is loaded from main-claim
// ****************************************************************************************************
Class.Inherits(Services, SubPageTable);
function Services(Params) {
	Services.prototype.parent.call(this, Params);
};

Services.prototype.showHeader = true;
Services.prototype.classID = "Services";
Services.prototype.dataSource = "...";
Services.prototype.showToolbar = true;
// Services.prototype.horzScroll = true; // at 870px width show the scrollbar
Services.prototype.showPager = false;
Services.prototype.showSummary = false;
Services.prototype.title = "Services";
Services.prototype.icon = "table";

Services.prototype.AfterPaint = function() {
	Services.prototype.parent.prototype.AfterPaint.call(this);
	
	// this.Painter.content.parent().addClass("sub-services").addClass("sub-"+this.module);
	// this.Painter.content.addClass("services");
	
	// alerts(this.Painter.header)
	// desktop.GetSvg(CreateElement("span", this.Painter.header), "table", 32, {noTopMargin:true});
	// desktop.GetSvg(CreateElement("span", this.Painter.header), this.icon, 24);
	// CreateElement("span", this.Painter.header).html("...");
	// CreateElement("span", this.Painter.header).html(this.title);
};	

Services.prototype.Initialize = function(Params) {
	Services.prototype.parent.prototype.Initialize.call(this, Params);
	if(this.id == "invoices") {
		this.icon = "table";
		this.title = "Invoices";
	} else if(this.id == "gop") {
		this.icon = "table";
		this.title = "Guarantee of Payments";
	} else if(this.id == "noc") {
		this.icon = "table";
		this.title = "Notification of Claims";
	}
};

Services.prototype.InitializeData = function(data) {
	Services.prototype.parent.prototype.InitializeData.call(this, data);
	this.module = data.module;
	// alerts(this.module);
};

Services.prototype.InitializeGrid = function(grid) {
	Services.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	grid.options.cardView = false;
	// grid.options.cardView = true;
	grid.options.autoScroll = true;
	grid.options.allowSort = true;
	// grid.options.showSelection = true;
	// grid.options.showBand = true;
	grid.options.showBand = false;
	grid.options.simpleSearch = true;
	grid.options.simpleSearchField = "name";
	
	grid.optionsData.editCallback = function(grid, id) {
		// if(grid.owner.module == "inv")
		__service(id, grid.owner.module);
	};
}

Services.prototype.InitializeQuery = function(data) {
	Services.prototype.parent.prototype.InitializeQuery.call(this, data);
	data
		.addColumn("name", "")
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "pin")
		.addColumn("order", "asc")
};

// Services.prototype.InitializeTableData = function(data) {
	// Services.prototype.parent.prototype.InitializeTableData.call(this, data);
	// data.Columns
		// .setprops("id", {label:"ID", numeric:true, key: true})
		// .setprops("pin", {label:"PIN"})
		// .setprops("name", {label:"Name"})
		// .setprops("currency_code", {label:"Currency"})
		// .setprops("country", {label:"Country"})
// };

// Services.prototype.InitializeColumns = function(grid) {
	// Services.prototype.parent.prototype.InitializeColumns.call(this, grid);
	// grid.NewCommand({command:"open", float: "left"});
	
	// grid.InitBands("Client", function(band) {
		// band.InitBands("PIN and Name", function(band) {
			// band.InitBands("1", function(band) {
				// band.NewColumn({fname: "pin", width: 100, allowSort: true});
			// });
			
			// band.InitBands("2", function(band) {
				// band.NewColumn({fname: "name", width: 300, allowSort: true});
			// });
		// })
		// band.InitBands("Currency and Country", function(band) {
			// band.NewColumn({fname: "currency_code", width: 100});
			// band.NewColumn({fname: "country", width: 200});
		// });
	// });
// };

Services.prototype.InitializeToolbar = function(toolbar) {
	Services.prototype.parent.prototype.InitializeToolbar.call(this, toolbar);
	// var self = this;
	// toolbar.NewItem({
		// id: "newrecord",
		// icon: "/engine/images/tick-24.png",
		// hint: "Test Show/Hide horzScroll",
		// click: function(item) {
			// self.grid.Painter.ShowHorzScroll(!self.grid.options.horzScroll);
		// }
	// });
};
