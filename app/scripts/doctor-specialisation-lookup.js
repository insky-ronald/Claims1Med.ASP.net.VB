var DoctorSpecialisationLookup = function(edit, grid) {
	grid.Methods.add("localSearch", function(grid, search) {
		return search.test("specialisation") || search.test("specialisation_code");
	});
	

	grid.Events.OnInitGrid.add(function(grid) {
		grid.options.simpleSearch = true;
		grid.options.simpleSearchField = "filter";
		grid.optionsData.url = "doctor-specialisation";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("lookup", 1)
			.addColumn("filter", "")
			.addColumn("sort", "specialisation")
			.addColumn("order", "asc")
			.addColumn("page", 1)
			.addColumn("pagesize", 1000000)
	});

	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("specialisation");
		});
		
		data.Columns
			.setprops("specialisation_code", {label:"Code", numeric:false, key: true})
			.setprops("specialisation", {label:"Specialisation"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "specialisation", width: 400, allowSort: true});
		grid.NewColumn({fname: "specialisation_code", width: 75, allowSort: true, fixedWidth:true});
	});
};
