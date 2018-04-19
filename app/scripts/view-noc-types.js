// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-noc-types.js
// uses edit-noc-types.js
//==================================================================================================
function NOCTypesView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "noc-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			NOCTypesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Notification of Claims Type",
					message: ('Please confirm to delete notification of claims type "<b>{0}</b>"').format(grid.dataset.get("service_description"))
				}
			});
			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/noc-types?"+ ObjectToRequestParams(params.requestParams);
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.exportData.allow = true;
				grid.exportData.name = "NOC Types";
				grid.exportData.source = "DBMedics.GetNOCTypes";
				
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
						.setprops("service_description", {label:"Notification of Claims Type Description"})		
						.setprops("display_name", {label:"Display Name"})
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "service_description", width: 380, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "display_name", width: 300, allowSort: true, fixedWidth:true});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});
			});
		}
	});	
};
