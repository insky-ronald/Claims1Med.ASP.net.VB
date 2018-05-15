// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-templates-lookup.js
//==================================================================================================
function ServiceTemplatesLookup(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "claim-types",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_service_templates";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showSelection = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("service_type", "GOP")
						// .addColumn("sort", "code")
						// .addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("template", {label:"Template"})
				});
	
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});
	
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select the template"
				});
				
				grid.Events.OnCommand.add(function(grid, column) {
					viewParams.select(grid.dataset.get("code"));
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"select"});
					grid.NewColumn({fname: "code", width: 75, allowSort: true});
					grid.NewColumn({fname: "template", width: 300, allowSort: true});
				});
				
			});
		}
	}));
};
