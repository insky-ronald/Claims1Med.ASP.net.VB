var CountriesLookup = function(edit, grid) {
	grid.Methods.add("localSearch", function(grid, search) {
		// return search.expression.test(search.row["country"]) || search.expression.test(search.row["code"]);
		return search.test("country") || search.test("code");
	});
	

	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		grid.optionsData.url = "countries";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("action", 1) // lookup
			.addColumn("filter", "")
			.addColumn("sort", "country")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize")
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("country");
		});
		
		data.Columns
			.setprops("code", {label:"Code", numeric:false, key: true})
			.setprops("country", {label:"Country"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "country", width: 400, allowSort: true});
		grid.NewColumn({fname: "code", width: 75, allowSort: true, fixedWidth:true);
	});
};

var CountriesISOLookup = function(edit, grid) {
	grid.Methods.add("localSearch", function(grid, search) {
		// return search.expression.test(search.row["country"]) || search.expression.test(search.row["code"]);
		return search.test("country") || search.test("iso_code");
	});
	

	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		grid.optionsData.url = "countries";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("lookup", 1)
			.addColumn("filter", "")
			.addColumn("sort", "country")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize")
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("country");
		});
		
		data.Columns
			.setprops("iso_code", {label:"ISO Code", numeric:false, key: true})
			.setprops("country", {label:"Country"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "country", width: 400, allowSort: true});
		grid.NewColumn({fname: "iso_code", width: 75, allowSort: true, fixedWidth:true);
	});
};
