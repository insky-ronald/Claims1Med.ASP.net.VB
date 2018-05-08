var GopContactsLookup = function(edit, grid) {
	grid.Events.OnInit.add(function(grid) {
		grid.optionsData.cache = false;
		// grid.options.horzScroll = true;
		grid.options.showPager = false;
		
		grid.search.visible = false;
		// grid.search.mode = "advanced";
		// grid.search.searchWidth = 450;
		grid.optionsData.url = "gop-contacts";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("provider_id", 0, {numeric:true})
			.addColumn("doctor_id", 0, {numeric:true})
			.addColumn("is_hospital", 0, {numeric:true})
			// .addColumn("sort", "name")
			// .addColumn("order", "asc")
			// .addColumn("page", 1, {numeric:true})
			// .addColumn("pagesize", 25, {numeric:true})
			
		// dataParams.Columns
			// .setprops("filter", {label:"Name"})
			// .setprops("category", {label:"Category"})
			
		// dataParams.Events.OnResetSearch.add(function(dataset) {
			// dataset.set("hospital_id", 0);
			// dataset.set("doctor_id", 0);
			// dataset.set("is_hospital", 0);
			// dataset.set("filter", "");
		// });
	});
										
	// grid.Events.OnInitSearch.add(function(grid, editor) {
		
		// editor.Events.OnInitEditor.add(function(sender, editor) {
			// editor.NewGroupEdit({caption:"Search"}, function(editor, tab) {
				// tab.container.css("border", "1px silver");
				// tab.container.css("border-style", "solid solid none solid");

				// editor.AddGroup("Find Provider", function(editor) {
					// editor.AddEdit("filter");
					// editor.AddRadioButton("category", {
						// key: "id",
						// value: "value",
						// data: [
							// {id:0, value:"Affiliated"},
							// {id:1, value:"Non-Affiliated"}
						// ]
					// });
				// });
			// });
		// });
	// });
	
	grid.Events.OnInitData.add(function(grid, data) {
		data.Columns
			.setprops("id", {label:"ID", numeric:true, key: true})
			.setprops("name", {label:"Name"})
			.setprops("fax", {label:"Fax No."})
			// .setprops("home_country", {label:"Country"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "name", width: 300, allowSort: true});
		grid.NewColumn({fname: "fax", width: 200, allowSort: true});
		// grid.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true);
		// grid.NewColumn({fname: "home_country", width: 150, allowSort: true});
	});
};
