function AllServiceTypesLookupView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "clients",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_all_service_types";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showPager = false;
				grid.options.showSelection = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("codes", "")
						.addColumn("filter", "")
				});
				
				grid.Events.OnPrepareQuery.add(function(grid, dataParams) {
					if(grid.selectionColumn) {
						dataParams.set("codes", grid.selections.join(","));
					};
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key: true})
						.setprops("service_description", {label:"Status"})
						
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "service_description", width: 400, allowSort: true});
					grid.NewColumn({fname: "code", width: 75, allowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};