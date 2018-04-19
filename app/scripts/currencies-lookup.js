var CurrenciesLookup = function(edit, grid) {
	//console.log(edit)
	grid.Methods.add("localSearch", function(grid, search) {
		return search.test("currency") || search.test("code");
	});
	

	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		grid.optionsData.url = "currencies";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("lookup", 1)
			.addColumn("filter", "")
			.addColumn("sort", "currency")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize")
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("currency");
		});
		
		data.Columns
			.setprops("code", {label:"Code", numeric:false, key: true})
			.setprops("currency", {label:"Currency"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "currency", width: 400, allowSort: true});
		grid.NewColumn({fname: "code", width: 75, allowSort: true, fixedWidth:true);
	});
};
