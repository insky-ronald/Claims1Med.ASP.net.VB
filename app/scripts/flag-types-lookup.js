var FlagTypesLookup = function(edit, grid) {
	grid.Methods.add("localSearch", function(grid, search) {
		return search.test("service_description") || search.test("code");
	});
	
	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		grid.optionsData.url = "flag-types";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("lookup", 1)
			.addColumn("filter", "")
			.addColumn("sort", "service_description")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize")
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("service_description");
		});
		
		data.Columns
			.setprops("code", {label:"Code", numeric:false, key: true})
			.setprops("service_description", {label:"Flag Type"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "service_description", width: 400, allowSort: true});
		// grid.NewColumn({fname: "code", width: 75, allowSort: true, fixedWidth:true);
	});
};
