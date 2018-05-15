// ****************************************************************************************************
// File name: view-service-procedures.js
// Last modified on
// 
// ****************************************************************************************************
function ServiceProceduresView(params){
	var serviceId = params.requestParams.service_id;
	var url = "service-procedures";
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "service-procedures",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = url;
				// grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;

				grid.options.viewType = "treeview";
				grid.options.treeViewSettings.keyColumnName = "id"
				grid.options.treeViewSettings.parentColumnName = "parent_id";
				// grid.options.treeViewSettings.columnName = "diagnosis";
				grid.options.treeViewSettings.columnName = "display";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", serviceId, {numeric:true})
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("code", {label:"Code"})
						.setprops("cpt", {label:"Procedure"})
						.setprops("diagnosis_code", {label:"Diagnosis"})
						.setprops("procedure_type_name", {label:"Type"})
						// .setprops("display", {label:"Diagnosis",
							// getText: function(column, value) {
								// return ("{1}: {0}").format(column.dataset.get("diagnosis"), column.dataset.get("diagnosis_code"))
							// }
						// })
						// .setprops("CRCY_CODE", {label:"Ccy"})
						// .setprops("LIMIT", {label:"Max Amount", numeric:true, type:"money", format:"00"})
						// .setprops("MAX_UNITS", {label:"Max Units", numeric:true, type:"money", format:"0"})
						// .setprops("CLM_AMOUNT", {label:"Actual", numeric:true, type:"money", format:"00"})
						// .setprops("APP_AMOUNT", {label:"Approved", numeric:true, type:"money", format:"00"})
						// .setprops("APP_UNITS", {label:"Units", numeric:true, type:"money", format:"0"})
						// .setprops("units", {label:"Units", numeric:true, type:"money", format:"0"})
						// .setprops("unit_name", {label:"Unit Name",
							// getText: function(column, value) {
								// return column.dataset.get("units_required") ? value: ""
							// }
						// })
				});
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "default")
						return "override"
					else if(column.command === "deletex")
						return "db-delete"
					else if(column.command === "editx")
						return "db-edit"
					else if(column.command === "diagnosis")
						return "diagnosis"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandIcon", function(grid, column, defaultValue) {
					if(column.command === "default")
						return "override"
					else if(column.command === "deletex")
						return "db-delete"
					else if(column.command === "editx")
						return "db-edit"
					else if(column.command === "add")
						return "new"
					else if(column.command === "diagnosis")
						return "diagnosis"
					else
						return defaultValue
				});
				
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "deletex")
						return "Delete Procedure"
					else if(column.command === "editx")
						return "Change Procedure"
					else if(column.command === "diagnosis")
						return "Assign to Diagnosis"
					else
						return defaultValue
				});
				
				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "deletex")
						return desktop.canEdit
					else if(column.command === "editx")
						return desktop.canEdit
					else if(column.command === "diagnosis")
						return desktop.canEdit
					else
						return defaultValue
				});

				grid.Events.OnCommand.add(function(grid, column) {
					
					if(column.command === "deletex") {
						ConfirmDialog({
							color: "forestgreen",
							target: column.element,
							title: "Delete Procedure",
							message: "Please confirm to delete procedure.",
							callback: function(dialog) {
								desktop.Ajax(
									self, 
									"/app/api/command/delete-claim-procedure",
									{
										id: grid.dataset.getKey()
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error deleting procedure",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
					
					if(column.command == "editx") {
						column.column.openDropDown({
							container: column.element,
							icon: "db-edit",
							color: "dodgerblue",
							title: "Edit Diagnosis",
							// subTitle: "...",
							width: 600,
							height: 300,
							view: DiagnosisView,
							select: function(code) {
								desktop.Ajax(
									self, 
									"/app/api/command/edit-claim-diagnosis",
									{
										id: grid.dataset.getKey(),
										diagnosis_group: grid.dataset.get("diagnosis_group"),
										diagnosis_code: code,
										is_default: false
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error changing diagnosis",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
					
					if(column.command == "diagnosis") {
						column.column.openDropDown({
							container: column.element,
							icon: "group",
							color: "forestgreen",
							title: "Assign to Diagnosis",
							// subTitle: "...",
							width: 600,
							height: 200,
							view: DiagnosisGroupView,
							initParams: function(dataParams) {
								dataParams.set("id", desktop.dbService.get("id"));
							},
							select: function(diagnosisCode) {
								desktop.Ajax(
									self, 
									"/app/api/command/edit-claim-procedure",
									{
										id: grid.dataset.getKey(),
										code: grid.dataset.get("code"),
										diagnosis_code: diagnosisCode
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error changing procedure",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
				});
			
				// grid.Events.OnInitRow.add(function(grid, row) {					
					// if (grid.dataset.get("parent_id") == 0) {
						// row.attr("x-main", 1)
					// } else {
						// row.attr("x-main", 0)
					// }
					
					// if (grid.dataset.get("is_default")) {
						// row.attr("x-default", 1);
					// };					
				// });
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "...", fixed:"left"}, function(band) {					
						band.NewCommand({command:"deletex"});
						band.NewCommand({command:"editx"});
						band.NewCommand({command:"diagnosis"});
					});
					grid.NewColumn({fname: "code", width: 75, fixedWidth:false});
					grid.NewColumn({fname: "cpt", width: 400, fixedWidth:false});
					grid.NewColumn({fname: "diagnosis_code", width: 75, fixedWidth:false});
					grid.NewColumn({fname: "procedure_type_name", width: 75, fixedWidth:false});
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					if (desktop.canEdit) {
						var item = toolbar.NewDropDownViewItem({
							id: "new-diagnosis",
							icon: "new",
							color: "#1CA8DD",
							// color: "dodgerblue",
							title: "Add Procedure",
							height: 300,
							width: 600,
							// subTitle: "Choose the diagnosis to add",
							view: ProceduresView,
							select: function(code) {
								desktop.Ajax(
									self, 
									"/app/api/command/add-claim-procedure",
									{
										service_id: desktop.dbService.get("id"),
										claim_id: desktop.dbService.get("claim_id"),
										code: code,
										diagnosis_code: ""
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: item.elementContainer,
												title: "Error adding procedure",
												message: result.message
											});
										}
									}
								)
							}
						});
					}
				});
			});
		}
	});
};
