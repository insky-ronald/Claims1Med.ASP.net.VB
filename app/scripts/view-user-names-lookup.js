function UserNamesLookupView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "clients",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_user_names";
				
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
						.addColumn("sort", "user_name")
						.addColumn("order", "asc")
						.addColumn("user_names", "")
						.addColumn("filter", "")
				});
				
				grid.Events.OnPrepareQuery.add(function(grid, dataParams) {
					if(grid.selectionColumn) {
						dataParams.set("user_names", grid.selections.join(","));
					};
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("user_name", {label:"User ID", key: true})
						.setprops("name", {label:"Fullname"})
						
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "user_name", width: 100, allowSort: true});
					grid.NewColumn({fname: "name", width: 250, allowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};