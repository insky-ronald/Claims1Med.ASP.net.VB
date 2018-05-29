var NoteTypesLookup = function(edit, grid) {
	grid.Events.OnInit.add(function(grid) {
		grid.optionsData.cache = false;
		grid.options.horzScroll = true;
		grid.options.showPager = true;
		
		grid.search.visible = true;
		grid.search.mode = "simple";
		grid.search.columnName = "filter";
		grid.search.searchWidth = 450;
		grid.optionsData.url = "note-types";
	});
	
	grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
		dataParams
			.addColumn("code", "")
			.addColumn("action", 1, {numeric:true})
			.addColumn("filter", "")
			
		dataParams.Events.OnResetSearch.add(function(dataset) {
			dataset.set("code", "");
			dataset.set("action", 1);
			dataset.set("filter", "");
		});
		
		// dataParams.Events.OnResetSearch.trigger();
	});
										
	grid.Events.OnInitSearch.add(function(grid, editor) {
		
		editor.Events.OnInitEditor.add(function(sender, editor) {
			editor.NewGroupEdit({caption:"Search"}, function(editor, tab) {
				tab.container.css("border", "1px silver");
				tab.container.css("border-style", "solid solid none solid");

				// editor.AddGroup("Find Provider", function(editor) {
					// editor.AddEdit("filter");
					// editor.AddRadioButton("provider_types", {
						// key: "id",
						// value: "value",
						// data: [
							// {id:"H", value:"Hospital"},
							// {id:"K", value:"Clinic"},
							// // {id:"D", value:"Doctor"},
							// {id:"PHA", value:"Pharmacy"},
							// {id:"", value:"All"}
						// ]
					// });
					// editor.AddRadioButton("status_code", {
						// key: "id",
						// value: "value",
						// data: [
							// {id:"A", value:"Active"},
							// {id:"X", value:"Inactive"},
							// {id:"", value:"Show all"}
						// ]
					// });
					// editor.AddRadioButton("category", {
						// key: "id",
						// value: "value",
						// data: [
							// {id:0, value:"Client Provider"},
							// {id:1, value:"Non-Provider"}
						// ]
					// });
				// });
			});
		});
	});
	
	grid.Events.OnInitData.add(function(grid, data) {
		data.Methods.add("lookupValue", function(dataset) {
			return dataset.get("code");
		});
		
		data.Columns
			.setprops("code", {label:"Code", key: true})
			.setprops("note_type", {label:"Type"})
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
		grid.NewColumn({fname: "note_type", width: 250, allowSort: true});
		grid.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true);
	});
};
