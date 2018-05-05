// ****************************************************************************************************
// Last modified on
// 26-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-plans-lookup.js
//==================================================================================================
function PlansLookup(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "claim-types",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_plans";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showSelection = false;
				grid.options.showPager = false;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("plan_name", {label:"Plan"})
						.setprops("product_name", {label:"Product"})
						.setprops("client_name", {label:"Client"})
				});
	
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});
	
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select this plan"
				});
				
				grid.Events.OnCommand.add(function(grid, column) {
					viewParams.select(grid.dataset.get("code"));
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"select"});
					grid.NewColumn({fname: "code", width: 75, allowSort: true});
					grid.NewColumn({fname: "plan_name", width: 250, allowSort: true});
					grid.NewColumn({fname: "product_name", width: 250, allowSort: true});
					grid.NewColumn({fname: "client_name", width: 250, allowSort: true});
				});
				
			});
		}
	}));
};
