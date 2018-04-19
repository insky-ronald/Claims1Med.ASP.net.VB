// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-currencies.js
// uses edit-currencies.js
//==================================================================================================
function CurrenciesView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "currencies",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			CurrenciesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/currencies?"+ ObjectToRequestParams(params.requestParams);
				
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
						.setprops("code", {label:"Code", numeric:false, key:true})
						.setprops("currency", {label:"Currency"})
						.setprops("is_active", {label:"Status"})						
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});	
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Currency", message: ("Please confirm to delete currency <b>{0}</b>.").format(grid.dataset.get("currency"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "currency", width: 300, allowSort: true, fixedWidth:true});
				});
				
			});
		}
	}));
};
