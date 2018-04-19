// ****************************************************************************************************
// Last modified on
// 16-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-saved-reports.js
//==================================================================================================
function SavedReportsView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "saved-reports",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			SavedReportEdit({
				id: id,
				reportTypeId: params.reportTypeId,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "engine/sys-saved-reports";
				
				grid.options.horzScroll = false;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showPager = false;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "name";
				
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("report_type_id", params.reportTypeId, {numeric:true})
						.addColumn("sort", "name")
						.addColumn("order", "asc")
						.addColumn("name", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("name", {label:"Name"})
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Saved Report", message: ("Please confirm to delete saved report <b>{0}</b>.").format(grid.dataset.get("name"))};
				});
				
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					if(column.command === "run")
						return "run-report"
					else
						return previous;
				});
				
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					if(column.command === "run")
						return "Run Report"
					else
						return previous
					
				});
				
				// grid.methods.add("getCommandUrl", function(grid, column, previous) {
					// if(column.command === "run")
						// return __report(grid.dataset.get("id"), true)
					// else
						// return previous
					
				// });
				
				grid.Events.OnCommand.add(function(grid, column) {
					if(column.command === "run") {
						__report(grid.dataset.get("id"));
						console.log(event)
					};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewColumn({fname: "id", width: 50, allowSort: true, fixedWidth:true});
					grid.NewBand({caption:"", fixed:"left"}, function(band) {
						band.NewCommand({command:"run"});
					});
					grid.NewColumn({fname: "name", width: 300, fixedWidth:true});
				});
			});
		}
	}));
};
