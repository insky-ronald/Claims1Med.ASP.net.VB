// ****************************************************************************************************
// Last modified on
// 15-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-reports.js
//==================================================================================================
function ReportsView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "reports",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ReportEdit({
				id: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "engine/sys-reports";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showColumnHeader = false;
				grid.options.showMasterDetail = true;
				
				grid.search.visible = false;
				// grid.search.mode = "simple";
				// grid.search.columnName = "name";
				
				grid.exportData.allow = false;
				// grid.exportData.name = "Clients";
				// grid.exportData.source = "DBClaims.GetClients";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "report_type")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						// .setprops("id", {label:"ID", key:true})
						// .setprops("pa_id", {labelnumeric:true})
						// .setprops("pin", {label:"PIN"})
						.setprops("report_type", {label:"Report"})
						// .setprops("pa_name", {label:"PA Name"})
						// .setprops("country", {label:"Country"})
						// .setprops("currency_code", {label:"Currency"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"));
				});	
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Report", message: ("Please confirm to delete report <b>{0}</b>.").format(grid.dataset.get("report_type"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "id", width: 50, allowSort: true, fixedWidth:true,
						drawContent: function(cell) {
							cell.attr("x-sec", "id");
							cell.html(grid.dataset.get("id"));
						}
					});
					// grid.NewColumn({fname: "name", width: 500, fixedWidth:true});
					// grid.NewColumn({fname: "report_type", width: 500, fixedWidth:true, linkField:"id", 
					grid.NewColumn({fname: "report_type", width: 480, fixedWidth:true, linkField:"id", 
						drawContent: function(cell) {
							// console.log($(this))
							cell.attr("x-sec", "name");
							cell.html(grid.dataset.get("report_type"));
							// CreateElementEx("a", cell, function(link) {
								// link.attr("href", __report(grid.dataset.get("id"), true));
								// link.html(grid.dataset.get("name"));
							// });
						}
					});
					// grid.NewColumn({fname: "currency_code", width: 100, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "country", width: 150, allowSort: true, fixedWidth:true});
				});
				
				grid.methods.add("getCommandHeaderIcon", function(grid, column, previous) {
					if(column.command === "master-detail")
						return "db-save"
					else
						return previous;
				});
				
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					if(column.command === "master-detail")
						return "Manage Saved Reports"
					else
						return previous
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
					SavedReportsView({
						reportTypeId: grid.dataset.get("id"),
						container: params.container
					})
				})
				
			});
		}
	}));
};
