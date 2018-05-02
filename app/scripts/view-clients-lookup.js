// ****************************************************************************************************
// Last modified on
// 4-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-clients-lookup.js
//==================================================================================================
function ClientsLookupView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "clients",
			toolbar: {theme: "svg"}
		},
		// editForm: function(id, container, dialog) {
			// CountriesEdit({
				// code: id,
				// container: container,
				// dialog: dialog
			// })
		// },
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "lookup?name=lookup_clients";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				// grid.options.showPager = false;
				grid.options.showSelection = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						// .addColumn("action", 1, {numeric:true})
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "name")
						.addColumn("order", "asc")
						.addColumn("ids", "")
						.addColumn("filter", "")
						
				});
				
				grid.Events.OnPrepareQuery.add(function(grid, dataParams) {
					if(grid.selectionColumn) {
						dataParams.set("ids", grid.selections.join(","));
					};
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("account_code", {label:"Account Code"})
						.setprops("name", {label:"Name"})
						
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "name", width: 350, aloowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "account_code", width: 100, allowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};
