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
		editForm: function(id, container, dialog) {
			CountriesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
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
				grid.search.columnName = "name";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						// .addColumn("action", 1, {numeric:true})
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "pin")
						.addColumn("order", "asc")
						.addColumn("ids", "")
						.addColumn("name", "")
						
				});
				
				grid.Events.OnPrepareQuery.add(function(grid, dataParams) {
					if(grid.selectionColumn) {
						dataParams.set("ids", grid.selections.join(","));
					};
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("pin", {label:"PIN"})
						.setprops("organisation", {label:"Name"})
						
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "pin", width: 75, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "organisation", width: 350, aloowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};
