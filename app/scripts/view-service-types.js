// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-types.js
// uses edit-service-types.js
//==================================================================================================
function ServiceTypesView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "service-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ServiceTypesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/service-types";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.exportData.allow = true;
				grid.exportData.name = "Service Types";
				grid.exportData.source = "DBApp.GetInvoiceTypes";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Service Type",
						message: ('Please confirm to delete service type "<b>{0}</b>"').format(grid.dataset.get("service_description"))
					}
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key:true})
						.setprops("service_description", {label:"Service Type Description"})						
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "service_description", width: 250, allowSort: true, fixedWidth:true});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});
			});
		}
	}));	
};
