var AddressTypesLookup = function(edit, grid) {
	grid.Methods.add("localSearch", function(grid, search) {
		// return search.expression.test(search.row["country"]) || search.expression.test(search.row["code"]);
		return search.test("address_type") || search.test("code");
	});
	
	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		grid.optionsData.url = "address-types";
		//grid.optionsData.url = "lookup?name=lookup_address_types";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("action", 1)
			.addColumn("filter", "")
			.addColumn("sort", "address_type")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize", 1000000)
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("address_type");
		});
		
		data.Columns
			.setprops("code", {label:"Code", numeric:false, key: true})
			.setprops("address_type", {label:"Type"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "address_type", width: 400, allowSort: false});
		grid.NewColumn({fname: "code", width: 75, allowSort: false, fixedWidth:true});
	});
};
