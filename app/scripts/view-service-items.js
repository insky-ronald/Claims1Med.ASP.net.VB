function ServiceItemsView(params){
	// alerts(JSON.stringify(params));
	return new JDBTreeView({
		owner: params.owner,
		container: params.container, 
		Painter: {
			css: "service-items" 
		},
		treeViewSettings: {
			key: "id",
			parent: "parent_id",
			getLevel: function(column) {
				return column.dataset.raw("level");
			},
			hasChildren: function(grid) {
				return grid.dataset.raw("has_children");
			},
			preInitColumn: function(column, c) {
				// c.push(("<span x-sec='code'>{0}</span>").format(column.dataset.text("diagnosis_code").trim());
				// if(grid.dataset.raw("limit_id") == 0) {
					// var hasNotes = grid.dataset.text("notes") == "" ? 0 : 1;
					// var hasLimits = grid.dataset.raw("limit_count") == 0 ? 0 : 1;
					// c.push(("<span x-sec='notes' x-type='{0}'}></span>").format(hasNotes);
					// c.push(("<span x-sec='limits' x-type='{0}'}></span>").format(hasLimits);
				// } else {
					// c.push("<span x-sec='limit'}></span>");
				// };
				
				// c.push("<span x-sec='edit'}></span>");
			},
			postInitColumn: function(column, c) {
				// c.push(("<span x-sec='code'>{0}</span>").format(column.dataset.text("diagnosis_code"));
				// if(grid.dataset.text("unit_required")) {
					// c.push(("<span x-sec='unit'>{0}</span>").format(grid.dataset.text("unit_spec")));
				// };
			},
			initColumn: function(column, cell) {
				// cell.find("span[x-sec='notes'][x-type='1']")
					// .each(function(i, o) {   
						// grid.page.SetHint($(o), grid.dataset.text("notes").replace(/\r\n|\n|\r/g, '<br>'));
					// });
			}
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "service-items";
				grid.options.toolbarTheme = "svg";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = false;
				grid.options.showSummary = true;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = false;
				grid.options.showSelection = false;
				grid.options.showBand = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", desktop.ServiceID, {numeric:true})
						.addColumn("service_type", desktop.ServiceType)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("diagnosis_code", {label:"ICD"})
						.setprops("benefit_code", {label:"Code"})
						.setprops("benefit_name", {label:"Benefit"})
						.setprops("currency_code", {label:"CCY"})
						.setprops("estimate", {label:"Estimate", numeric:true, type:"money", format:"00"})
						.setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("breakdown", {label:"Breakdown", numeric:true, type:"money", format:"00"})
						.setprops("units", {label:"Units", numeric:true, type:"money", format:"0"})
						.setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
						.setprops("ex_gratia", {label:"Ex-Gratia", numeric:true, type:"money", format:"00"})
						.setprops("declined_amount", {label:"Decline", numeric:true, type:"money", format:"00"})
						.setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
				});
				
				grid.Events.OnInitSubData.add(function(grid, params) {
					if(params.index == 1) {
						grid.options.summaryDataset = new Dataset(params.rawData, "Summary");
						
						grid.options.summaryDataset.Columns
							.setprops("estimate", {label:"Estimate", numeric:true, type:"money", format:"00"})
							.setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
							.setprops("breakdown", {label:"Breakdown", numeric:true, type:"money", format:"00"})
							.setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
							.setprops("ex_gratia", {label:"Ex-Gratia", numeric:true, type:"money", format:"00"})
							.setprops("declined_amount", {label:"Decline", numeric:true, type:"money", format:"00"})
							.setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
					};
				});
				// grid.Methods.add("editTitle", function(grid, mode) {
					// if(mode == "edit")
						// return "Edit Diagnosis"
					// else if(mode == "new")
						// return "Add New Diagnosis"
				// });
				
				grid.Methods.add("getCommandIcon", function(grid, column) {
					if(column.command == "notes") 
						return "notes"
				});
	
				grid.Methods.add("getCommandHint", function(grid, column) {
					if(column.command == "edit") 
						return "Edit benefit item"
					else if(column.command == "delete") 
						return "Remove benefit item"
					else if(column.command == "notes") 
						return "View validation message"
				});
				
				grid.Methods.add("allowCommand", function(grid, column) {
					if(column.command == "delete" || column.command == "edit") 
						return column.dataset.get("is_detail") && !column.dataset.get("is_breakdown")
					else if(column.command == "notes")
						return column.dataset.get("notes")
					else
						return true;
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					if(grid.dataset.get("is_breakdown")) 
						row.attr("x-breakdown", "1")
					else if(grid.dataset.get("is_exclusion")) 
						row.attr("x-exclusion", "1")
					else if(grid.dataset.get("is_novalidate")) 
						row.attr("x-novalidate", "1")
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"notes", float: "left"});
					grid.NewTreeViewColumn({fname: "benefit_name", width: 300, fixedWidth:true, float:"left"});
					grid.NewColumn({fname: "benefit_code", width: 200});
					grid.NewColumn({fname: "diagnosis_code", width: 75});
					grid.NewColumn({fname: "currency_code", width: 50});
					grid.NewColumn({fname: "estimate", width: 100, showSummary:true});
					grid.NewColumn({fname: "actual_amount", width: 100, showSummary:true});
					grid.NewColumn({fname: "breakdown", width: 100, showSummary:false});
					grid.NewColumn({fname: "units", width: 50});
					grid.NewColumn({fname: "approved_amount", width: 100, showSummary:true});
					grid.NewColumn({fname: "ex_gratia", width: 100, showSummary:true});
					grid.NewColumn({fname: "declined_amount", width: 100, showSummary:true});
					grid.NewCommand({command:"notes"});
					grid.NewColumn({fname: "deductible", width: 100, showSummary:true});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					toolbar.NewItem({
						id: "validate",
						icon: "validate",
						iconColor: "green",
						hint: "Validate",
						click: function(item) {
							grid.Refresh();
						}
					});
					
					toolbar.NewItem({
						id: "calc-report",
						icon: "calculation-report",
						iconColor: "#B34EE9",
						hint: "View Calculation Report",
						click: function(item) {
							grid.Refresh();
						}
					});
				});
			});
		}
	});	
};
