function CustomerServiceStatusCodesLookupView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "clients",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_customer_service_sub_status";
				
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
						.addColumn("sort", "sub_status_code")
						.addColumn("order", "asc")
						.addColumn("sub_status_codes", "")
						.addColumn("filter", "")
				});
				
				grid.Events.OnPrepareQuery.add(function(grid, dataParams) {
					if(grid.selectionColumn) {
						dataParams.set("sub_status_codes", grid.selections.join(","));
					};
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("sub_status_code", {label:"Code", numeric:false, key: true})
						.setprops("sub_status", {label:"Status"})
						
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "sub_status", width: 400, allowSort: true});
					grid.NewColumn({fname: "sub_status_code", width: 75, allowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};