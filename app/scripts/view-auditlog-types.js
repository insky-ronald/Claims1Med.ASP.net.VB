// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-auditlog-types.js
// uses edit-auditlog-types.js
//==================================================================================================
function AuditLogTypesView(params){
	// var name = "app/auditlog-types";
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "auditlog-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			AuditLogTypesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Audit Log Type",
					message: ('Please confirm to delete audit log type "<b>{0}</b>"').format(grid.dataset.get("description"))
				}
			});
			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/auditlog-types?"+ ObjectToRequestParams(params.requestParams);
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.exportData.allow = true;
				grid.exportData.name = "Audit Log Types";
				grid.exportData.source = "DBMedics.GetAuditlogTypes";
				
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
						.setprops("description", {label:"Description"})	
						.setprops("log_type_desc", {label:"Log Type"})
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "description", width: 400, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "log_type_desc", width: 100, allowSort: true, fixedWidth:true});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});
			});
		}
	});	
};
