var UsersLookup = function(edit, grid) {
	grid.Methods.add("localSearch", function(grid, search) {
		// return search.expression.test(search.row["country"]) || search.expression.test(search.row["code"]);
		return search.test("user_name") || search.test("name");
	});
	

	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		grid.optionsData.url = "users";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("lookup", 1)
			.addColumn("filter", "")
			.addColumn("sort", "name")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize")
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("name");
		});
		
		data.Columns
			.setprops("user_name", {label:"ID", numeric:false, key: true})
			.setprops("name", {label:"Name"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "name", width: 400, allowSort: true});
		grid.NewColumn({fname: "user_name", width: 75, allowSort: true, fixedWidth:true);
	});
};
