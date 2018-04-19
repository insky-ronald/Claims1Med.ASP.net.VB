function MyMoney(params){
	return new JDBGrid({
		owner: params.owner,
		container: params.container, 
		requestParams: params.requestParams, 
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "mymoney"
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				// grid.optionsData.url = "masterpolicies";
				// grid.optionsData.url = "voterslist?municipality=angono";
				grid.optionsData.url = "mymoney";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = false;
				// grid.options.showSummary = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = false;
				// grid.options.showSelection = true;
				// grid.options.showBand = false;
				grid.options.showBand = true;
				// grid.options.simpleSearch = true;
				// grid.options.simpleSearchField = "name";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("year", 2016, {numeric:true})
						// .addColumn("year", 2015, {numeric:true})
				});
				
				grid.Events.OnInitSearch.add(function(sender, editor) {
					editor.Events.OnInitData.add(function(sender, data) {
						data.Columns
							.setprops("year", {label:"Year", numeric:true})
					});
					
					editor.Events.OnInitEditor.add(function(sender, editor) {
						editor.NewGroupEdit("Find Voter", function(editor, tab) {
							editor.AddGroup("Find", function(editor) {
								editor.AddEdit("year");
							});
						});
					});
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("type", {numeric:true})
						.setprops("code", {label:"Code"})
						.setprops("jan_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("jan_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("feb_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("feb_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("mar_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("mar_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("apr_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("apr_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("may_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("may_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("jun_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("jun_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("jul_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("jul_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("aug_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("aug_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("sep_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("sep_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("oct_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("oct_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("nov_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("nov_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
						.setprops("dec_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("dec_budget", {label:"Budget", numeric:true, type:"money", format:"00"})

						.setprops("total_expense", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("total_budget", {label:"Budget", numeric:true, type:"money", format:"00"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					if(grid.dataset.get("code") == "SUB-TOTAL") 
						row.attr("data-type", "sub").attr("data-row", "bold")
					else if(grid.dataset.get("code") == "TOTAL") 
						row.attr("data-type", "total").attr("data-row", "bold")
					else if(grid.dataset.get("code") == "RUNNING") 
						row.attr("data-type", "running").attr("data-row", "bold")
				});	
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"img", float: "left", drawContent: function(cell,column) {
						if(column.dataset.get("type2") == 1)
							desktop.GetSvg(cell, "new")
					}});
					// grid.NewColumn({fname: "", width: 30, float: "left"});
					
					
					// grid.NewColumn({fname: "code", width: 150});
					grid.InitBands("", function(band) {
						band.NewColumn({fname: "code", width: 150, float: "left"});
						// band.NewColumn({fname: "type", width: 25});
					});
					
					var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
					var mon = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
					var i, size = 110;
					for(i=0; i < 12; i++) {
						grid.InitBands(months[i], function(band) {
							band.NewColumn({fname: mon[i]+"_expense", width: size, drawContent: function(cell, column) {
								cell.attr("x-type", "actual");
							}});
							band.NewColumn({fname: mon[i]+"_budget", width: size, drawContent: function(cell, column) {
								cell.attr("x-type", "budget");
							}});
						});
					};
					
					grid.InitBands("Total", function(band) {
						band.NewColumn({fname: "total_expense", width: size});
						band.NewColumn({fname: "total_budget", width: size});
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.NewItem({
						// id: "test",
						// icon: "test",
						// iconColor: "#8DCF6E",
						// hint: "Test busy...",
						// click: function(item) {
							// grid.Busy(true);
						// }
					// });
				});
			});
		}
	});	
};
