// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-master-policies.js
// uses edit-masterpolicy.js
//==================================================================================================
function MasterPoliciesView(params){
	return new JDBGrid({
		params: params,
		// container: params.container, 
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "masterpolicies"
		},
		editForm: function(id, container, dialog) {
			// alerts(dialog)
			MasterPolicyEdit({
				url: ("?id={0}").format(id),
				container: container,
				containerPadding: 0,
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog
			})
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "masterpolicies";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				// grid.options.showBand = false;
				grid.options.showBand = true;
				// grid.options.simpleSearch = true;
				// grid.options.simpleSearchField = "name";
				grid.optionsData.editCallback = function(grid, id) {
					__masterpolicy(id);
				};

				// var parts = this.url.split("?");
				// if(parts.length > 0
					// grid.optionsData.requestParams = parts[1];
				
				// grid.Methods.add("canAdd", function(grid) {
					// return defaultValue(params.canAdd, false);
				// });
				
				// grid.Methods.add("canEdit", function(grid) {
					// return defaultValue(params.canEdit, false);
				// });
				
				// grid.Methods.add("canDelete", function(grid) {
					// return defaultValue(params.canDelete, false);
				// });
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					// grid.owner.InitializeQuery(dataParams);
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "policy_number")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						// .addColumn("broker_ids", "1022689")
						.addColumn("broker_ids", "1022690")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					// grid.owner.InitializeTableData(data);
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("broker_name", {label:"Broker", required:true})
						.setprops("policy_number", {label:"Policy No.", required:true})
						.setprops("underwriting_currency", {label:"U/W Currency"})
						.setprops("underwriting_year", {label:"U/W Year"})
						.setprops("effective_date", {label:"Effective Date", type:"date", required:true})
						.setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
						.setprops("status", {label:"Status"})
						.setprops("expired", {label:"Expired"})
						.setprops("plan_name", {label:"Type", required:true})
						// .setprops("plan_description", {label:"Description", type:"memo"})
						.setprops("plan_description", {label:"Description", required:true})
						.setprops("plan_currency", {label:"Plan Currency", required:true})
				});

				grid.Events.OnInitColumns.add(function(grid) {
					// grid.owner.InitializeColumns(grid);
					// grid.NewCommand({command:"open", float: grid.owner.horzScroll ? "left" : ""});
					// grid.NewCommand({command:"open", float: ""});
					// grid.NewCommand({command:"editx", float: "left", 
						// drawContent: function(cell, column) {
							
						// }
					// });
					grid.NewCommand({command:"open", float: "left"});
					
					grid.InitBands("", function(band) {
						band.NewColumn({fname: "broker_name", width: 200, allowSort: true});
						// band.NewColumn({fname: "broker_name", width: 200, allowSort: true, float: grid.owner.horzScroll ? "left" : ""});
					});
					
					grid.InitBands("Master Policy", function(band) {
						band.InitBands("", function(band) {
							band.NewColumn({fname: "policy_number", width: 100, allowSort: true});
						};
						
						band.InitBands("Underwriting Test Header to Scroll", function(band) {
							band.NewColumn({fname: "underwriting_currency", width: 100});
							band.NewColumn({fname: "underwriting_year", width: 75});
						});
						band.InitBands("Date", function(band) {
							band.NewColumn({fname: "effective_date", width: 125});
							band.NewColumn({fname: "expiry_date", width: 125});
						});
						band.InitBands("Status", function(band) {
							band.NewColumn({fname: "status", width: 100});
							band.NewColumn({fname: "expired", width: 75});
						});
						band.InitBands("Plan", function(band) {
							band.NewColumn({fname: "plan_name", width: 300, allowSort: true});
							band.NewColumn({fname: "plan_description", width: 400});
							band.NewColumn({fname: "plan_currency", width: 100});
						});
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				});
			});
		}
	});	
};
