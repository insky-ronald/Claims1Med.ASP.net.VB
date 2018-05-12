var DiagnosisLookup = function(edit, grid) {
	grid.Events.OnInit.add(function(grid) {
		grid.optionsData.cache = false;
		grid.options.horzScroll = true;
		grid.options.showPager = true;
		
		grid.search.visible = true;
		grid.search.mode = "mixed";
		grid.search.columnName = "filter";
		grid.search.searchWidth = 350;
		grid.optionsData.url = "diagnosis";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
			dataParams
				.addColumn("page", 1, {numeric:true})
				.addColumn("pagesize", 25, {numeric:true})
				.addColumn("sort", "code")
				.addColumn("order", "asc")
				.addColumn("filter", "")
				.addColumn("version", "10")
				.addColumn("is_shortlist", 1, {numeric:true})
	
			dataParams.Columns
				.setprops("filter", {label:"Diagnosis"})
				.setprops("is_shortlist", {label:"Condensed list"})
				.setprops("version", {label:"Version"})
				
			dataParams.Events.OnResetSearch.add(function(dataset) {
				dataset.set("is_shortlist", 1);
				dataset.set("version", "10");
			});
		
		// dataParams.Events.OnResetSearch.trigger();
	});
										
	grid.Events.OnInitSearch.add(function(grid, editor) {
		editor.Events.OnInitEditor.add(function(sender, editor) {
			editor.NewGroupEdit({caption:"Search"}, function(editor, tab) {
				tab.container.css("border", "1px silver");
				tab.container.css("border-style", "solid solid none solid");

				// editor.AddGroup("Find Diagnosis", function(editor) {
				editor.AddGroup("Advanced Search", function(editor) {
					// editor.AddEdit("filter");
					editor.AddRadioButton("is_shortlist", {
						key: "id",
						value: "value",
						data: [
							{id:1, value:"Yes"},
							{id:0, value:"No"}
						]
					});
					editor.AddRadioButton("version", {
						key: "id",
						value: "value",
						data: [
							{id:"10", value:"ICD-10"},
							{id:"09", value:"ICD-9"}
						]
					});
				});
			});
		});
	});
	
	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("diagnosis");
		});
		
		data.Columns
			.setprops("code", {label:"Code", key:true})
			.setprops("diagnosis", {label:"Diagnosis"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "code", width: 75, allowSort: true, fixedWidth:true});
		grid.NewColumn({fname: "diagnosis", width: 400, allowSort: true, fixedWidth:false});
	});
};
