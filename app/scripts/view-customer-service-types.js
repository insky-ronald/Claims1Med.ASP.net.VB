// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-customer-service-types.js
// uses edit-customer-service-types.js
//==================================================================================================
function CustomerServiceTypesView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "customer-service-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			CustomerServiceTypesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Customer Service Type",
					message: ('Please confirm to delete customer service type "<b>{0}</b>"').format(grid.dataset.get("service_description"))
				}
			});
			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/customer-service-types?"+ ObjectToRequestParams(params.requestParams);
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.exportData.allow = true;
				grid.exportData.name = "Customer Service Types";
				grid.exportData.source = "DBMedics.GetCustomerServiceTypes";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key:true})
						.setprops("service_description", {label:"Customer Service Type Description"})		
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "service_description", width: 380, allowSort: true, fixedWidth:true});
				});
				
				/* grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				}); */
			});
		}
	});	
};
