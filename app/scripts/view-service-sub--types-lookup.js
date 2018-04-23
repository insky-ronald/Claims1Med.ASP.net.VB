// ****************************************************************************************************
// Last modified on
// 26-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-sub--types-lookup.js
//==================================================================================================
function ServiceSubTypesLookup(viewParams){
	// console.log(viewParams);
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "service-sub-types",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_service_sub_types";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showSelection = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("service_type", viewParams.serviceType)
						.addColumn("sort", "code")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("sub_type", {label:"Type"})
				});
	
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});
	
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select the claim type"
				});
				
				grid.Events.OnCommand.add(function(grid, column) {
					viewParams.select(grid.dataset.get("code"));
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"select"});
					grid.NewColumn({fname: "code", width: 75, allowSort: true});
					grid.NewColumn({fname: "sub_type", width: 300, allowSort: true});
				});
				
			});
		}
	}));
};
