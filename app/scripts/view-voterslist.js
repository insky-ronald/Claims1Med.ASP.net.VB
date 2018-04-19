function VotersListView(params){
	return new JDBGrid({
		owner: params.owner,
		container: params.container, 
		requestParams: params.requestParams, 
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "voterslist"
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				// grid.optionsData.url = "masterpolicies";
				// grid.optionsData.url = "voterslist?municipality=angono";
				grid.optionsData.url = "voterslist";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				// grid.options.showBand = false;
				// grid.options.showBand = true;
				// grid.options.simpleSearch = true;
				// grid.options.simpleSearchField = "name";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "")
						.addColumn("order", "asc")
						.addColumn("name", "")
						.addColumn("address", "")
						.addColumn("cluster", "")
						.addColumn("municipalities", "")
						// .addColumn("broker_ids", "1022690")
				});
				
				grid.Events.OnInitSearch.add(function(sender, editor) {
					editor.Events.OnInitData.add(function(sender, data) {
						data.Columns
							// .setprops("id", {label:"ID", numeric:true, key: true})
							.setprops("name", {label:"Name"})
							.setprops("address", {label:"Address"})
							.setprops("cluster", {label:"Cluster"})
							.setprops("municipalities", {label:"Municipality"})
							// .setprops("policy_number", {label:"Policy No.", required:true})
							// .setprops("underwriting_currency", {label:"U/W Currency"})
							// .setprops("underwriting_year", {label:"U/W Year"})
							// .setprops("effective_date", {label:"Effective Date", type:"date", required:true})
							// .setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
							// .setprops("status", {label:"Status"})
							// .setprops("expired", {label:"Expired"})
							// .setprops("plan_name", {label:"Type", required:true})
							// .setprops("plan_description", {label:"Description", required:true})
							// .setprops("plan_currency", {label:"Currency", required:true})
					});
					
					editor.Events.OnInitEditor.add(function(sender, editor) {
						// editor.container.css("yyy", "yyy")
						// alerts(editor.classID);
						editor.NewGroupEdit("Find Voter", function(editor, tab) {
							tab.content.attr("xxx", "123");
							tab.container.attr("xxx", "321");
							// alerts(tab.container.parent().css("border, 0")
							// alerts(tab.container.parent().parent().attr("x-sec"));
							// alerts(tab.content.parent().parent().attr("x-sec"));
							// alerts(tab.content.attr("x-sec"));
							editor.AddGroup("Find Voter", function(editor) {
								editor.AddEdit("name");
								editor.AddEdit("address");
								editor.AddEdit("cluster");
								editor.AddEdit("municipalities");
							});
								
							// editor.AddGroup("Dates", function(editor) {
								// editor.AddEdit({ID: "effective_date"});
								// editor.AddEdit({ID: "expiry_date"});
								// editor.AddEdit({ID: "underwriting_year"});
							// });
						});
						
						// editor.NewGroupEdit("Other", function(editor, tab) {
							// editor.AddGroup("Dates", function(editor) {
								// editor.AddEdit({ID: "effective_date"});
								// editor.AddEdit({ID: "expiry_date"});
								// editor.AddEdit({ID: "underwriting_year"});
							// });
						// });
						
						// editor.NewContainer("Test Container", function(editor, tab) {
						// });
					});
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("MUNICIPALITY", {label:"Municipality"})
						.setprops("BARANGAY", {label:"Barangay"})
						.setprops("PRECINCT", {label:"Precinct"})
						.setprops("NUM", {label:"#"})
						.setprops("NAME", {label:"Name"})
						.setprops("ADDRESS", {label:"Address"})
						.setprops("DOB", {label:"DOB", type:"date"})
				});

				grid.Events.OnInitColumns.add(function(grid) {
					if(!grid.requestParams.municipality)
						grid.NewColumn({fname: "MUNICIPALITY", width: 200, allowSort: true});
					
					grid.NewColumn({fname: "BARANGAY", width: 150, allowSort: true});
					grid.NewColumn({fname: "PRECINCT", width: 75, allowSort: true});
					grid.NewColumn({fname: "NUM", width: 50, allowSort: true});
					grid.NewColumn({fname: "NAME", width: 300, allowSort: true});
					grid.NewColumn({fname: "ADDRESS", width: 300, allowSort: true});
					grid.NewColumn({fname: "DOB", width: 100, allowSort: true});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					toolbar.NewItem({
						id: "test",
						icon: "test",
						iconColor: "#8DCF6E",
						hint: "Test busy...",
						click: function(item) {
							grid.Busy(true);
						}
					});
				});
			});
		}
	});	
};
