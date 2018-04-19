// DefaultView() refer to view-default.js
function SysTablesView(params){
	// console.log(params)
	return DefaultView(params, {
		viewID: "db-tables",
		defaultSort: "table_name",
		requestPath: "engine",
		init: function(grid) {
			// grid.optionsData.url = "engine/db-tables";
			
			grid.Events.OnInitData.add(function(grid, data) {
				data.Columns
					.setprops("table_name", {label:"Name", key: true, readonly:true})
					.setprops("table_type", {label:"Type", required:true})
			});

			grid.Events.OnInitColumns.add(function(grid) {
				grid.NewColumn({fname: "table_name", width: 200, allowSort: true, fixedWidth:true});
				grid.NewColumn({fname: "table_type", width: 100, allowSort: true, fixedWidth:true});
				grid.NewColumn({fname: "", width: 400, allowSort: false});
			});
		}
	});	
};
