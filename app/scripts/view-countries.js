// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-countries.js
// uses edit-countries.js
//==================================================================================================
function CountriesView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "countries",
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
				grid.optionsData.url = "app/countries?"+ ObjectToRequestParams(params.requestParams);
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"ISO Code - 3 Digits", key:true})
						.setprops("iso_code", {label:"ISO Code - 2 Digits"})
						.setprops("country", {label:"Country"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("status_code"))
				});	
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Country", message: ("Please confirm to delete country <b>{0}</b>.").format(grid.dataset.get("country"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "iso_code", width: 150, aloowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "country", width: 300, allowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};
