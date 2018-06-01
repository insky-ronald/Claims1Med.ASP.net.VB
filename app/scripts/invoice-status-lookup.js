var InvoiceStatusLookup = function(edit, grid) {
	grid.Events.OnInit.add(function(grid) {
		grid.optionsData.cache = false;
		grid.options.horzScroll = true;
		grid.options.showPager = true;
		
		grid.search.visible = false;
		grid.search.mode = "simple";
		grid.search.columnName = "filter";
		// grid.search.searchWidth = 450;
		grid.optionsData.url = "lookup?name=lookup_invoice_status";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("status_code", "")
			// .addColumn("action", 1, {numeric:true})
			.addColumn("filter", "")
			.addColumn("sort", "status")
			.addColumn("order", "asc")
	});
	
	grid.Events.OnInitData.add(function(grid, data) {		
		data.Columns
			.setprops("status_code", {label:"Code", key: true})
			.setprops("status", {label:"Status"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "status", width: 250, allowSort: true});
		grid.NewColumn({fname: "status_code", width: 100, allowSort: true, fixedWidth:true});
	});
};

var InvoiceSubStatusLookup = function(edit, grid) {
	grid.Events.OnInit.add(function(grid) {
		grid.optionsData.cache = false;
		grid.options.horzScroll = true;
		grid.options.showPager = true;
		
		grid.search.visible = true;
		grid.search.mode = "simple";
		grid.search.columnName = "filter";
		// grid.search.searchWidth = 450;
		grid.optionsData.url = "lookup?name=lookup_invoice_sub_status";
		// grid.optionsData.url = "service-status-details";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("service_type", "INV")
			.addColumn("status_code", "")
			.addColumn("page", 1, {numeric:true})
			.addColumn("pagesize", 50, {numeric:true})
			.addColumn("sort", "code")
			.addColumn("order", "asc")
			.addColumn("filter", "")
	});
	
	grid.Events.OnInitData.add(function(grid, data) {		
		data.Columns
			.setprops("sub_status_code", {label:"Code", key: true})
			.setprops("sub_status", {label:"Status"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "sub_status", width: 250, allowSort: true});
		grid.NewColumn({fname: "sub_status_code", width: 100, allowSort: true, fixedWidth:true});
	});
};
