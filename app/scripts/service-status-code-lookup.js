// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: service-status-code-lookup.js
//==================================================================================================
function ServiceStatusCodesLookup (viewParams){
	// console.log(viewParams);
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "service-status-codes",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_service_status_codes";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showSelection = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("service_type", viewParams.serviceType)
						.addColumn("status_code", viewParams.statusCode)
						.addColumn("sort", "sub_status_code")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("sub_status_code", {label:"Code", key: true})
						.setprops("sub_status", {label:"Sub-Status"})
				});
	
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});
	
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select the claim type"
				});
				
				grid.Events.OnCommand.add(function(grid, column) {
					viewParams.select(grid.dataset.get("sub_status_code"));
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"select"});
					grid.NewColumn({fname: "sub_status_code", width: 75, allowSort: true});
					grid.NewColumn({fname: "sub_status", width: 300, allowSort: true});
				});
				
			});
		}
	}));
};
