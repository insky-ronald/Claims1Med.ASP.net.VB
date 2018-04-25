var ServiceStatusLookup = function(edit, grid) {
	grid.Methods.add("localSearch", function(grid, search) {
		return search.test("status_code") || search.test("main_status");
	});
	
	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		// grid.optionsData.url = "servicestatus";
		grid.optionsData.url = "lookup?name=lookup_service_status";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("service_type", edit.dataset.get("service_type"))
			.addColumn("lookup", 1)
			.addColumn("filter", "")
			.addColumn("sort", "status_code")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize", 1000000)
			
			// console.log(edit.dataset.get("service_type"));
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("main_status");
		});
		
		data.Columns
			.setprops("status_code", {label:"Code", numeric:false, key: true})
			.setprops("main_status", {label:"Status"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "main_status", width: 400, allowSort: true});
		grid.NewColumn({fname: "status_code", width: 75, allowSort: true, fixedWidth:true});
	});
};
