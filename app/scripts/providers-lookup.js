var ProvidersLookup = function(edit, grid) {
	grid.Events.OnInit.add(function(grid) {
		grid.optionsData.cache = false;
		grid.options.horzScroll = true;
		grid.options.showPager = true;
		
		grid.search.visible = true;
		grid.search.mode = "mixed";
		grid.search.columnName = "filter";
		grid.search.searchWidth = 450;
		grid.optionsData.url = "client-providers";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("id", 0, {numeric:true})
			.addColumn("client_id", 0, {numeric:true})
			.addColumn("provider_types", "")
			.addColumn("status_code", "")
			.addColumn("category", 0, {numeric:true})
			.addColumn("filter", "")
			.addColumn("sort", "name")
			.addColumn("order", "asc")
			.addColumn("page", 1, {numeric:true})
			.addColumn("pagesize", 25, {numeric:true})
			
		dataParams.Columns
			.setprops("filter", {label:"Name"})
			.setprops("provider_types", {label:"Type"})
			.setprops("status_code", {label:"Status"})
			.setprops("category", {label:"Category"})
			
		dataParams.Events.OnResetSearch.add(function(dataset) {
			dataset.set("id", 0);
			dataset.set("client_id", 0);
			dataset.set("provider_types", "");
			dataset.set("status_code", "");
			dataset.set("category", 0);
			dataset.set("filter", "");
		});
		
		// dataParams.Events.OnResetSearch.trigger();
	});
										
	grid.Events.OnInitSearch.add(function(grid, editor) {
		
		editor.Events.OnInitEditor.add(function(sender, editor) {
			editor.NewGroupEdit({caption:"Search"}, function(editor, tab) {
				tab.container.css("border", "1px silver");
				tab.container.css("border-style", "solid solid none solid");

				editor.AddGroup("Find Provider", function(editor) {
					editor.AddEdit("filter");
					editor.AddRadioButton("provider_types", {
						key: "id",
						value: "value",
						data: [
							{id:"H", value:"Hospital"},
							{id:"K", value:"Clinic"},
							// {id:"D", value:"Doctor"},
							{id:"PHA", value:"Pharmacy"},
							{id:"", value:"All"}
						]
					});
					editor.AddRadioButton("status_code", {
						key: "id",
						value: "value",
						data: [
							{id:"A", value:"Active"},
							{id:"X", value:"Inactive"},
							{id:"", value:"Show all"}
						]
					});
					editor.AddRadioButton("category", {
						key: "id",
						value: "value",
						data: [
							{id:0, value:"Client Provider"},
							{id:1, value:"Non-Provider"}
						]
					});
				});
			});
		});
	});
	
	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("name");
		});
		
		data.Columns
			.setprops("id", {label:"ID", numeric:true, key: true})
			.setprops("code", {label:"Code"})
			.setprops("name", {label:"Name"})
			.setprops("provider_type_name", {label:"Type"})
			.setprops("home_country", {label:"Country"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "name", width: 250, allowSort: true});
		grid.NewColumn({fname: "provider_type_name", width: 100, allowSort: true});
		grid.NewColumn({fname: "home_country", width: 150, allowSort: true});
		grid.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true);
	});
};
