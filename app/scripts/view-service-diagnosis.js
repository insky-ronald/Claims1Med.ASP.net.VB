// ****************************************************************************************************
// File name: view-service-diagnosis.js
// Last modified on
// 
// ****************************************************************************************************
function ServiceDiagnosisView(params){
	var serviceId = params.requestParams.service_id;
	var url = "service-diagnosis";
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "service-diagnosis",
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
						.setprops("parent_id", {numeric:true})
						.setprops("diagnosis", {label:"Diagnosis"})
						.setprops("diagnosis_code", {label:"Code"})
						.setprops("is_default", {numeric:true})
						.setprops("display", {label:"Diagnosis",
							getText: function(column, value) {
								return ("{1}: {0}").format(column.dataset.get("diagnosis"), column.dataset.get("diagnosis_code"))
							}
						})
				});
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "default")
						return "override"
					else if(column.command === "deletex")
						return "db-delete"
					else if(column.command === "editx")
						return "db-edit"
					else if(column.command === "group")
						return "group"
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
					else if(column.command === "group")
						return "group"
					else
						return defaultValue
				});
				
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "default")
						return "Set as default diagnosis"
					else if(column.command === "deletex")
						return "Delete diagnosis"
					else if(column.command === "add")
						return "Add diagnosis"
					else if(column.command === "editx")
						return "Edit diagnosis"
					else if(column.command === "group")
						return "Change diagnosis group"
					else
						return defaultValue
				});
				
				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "default")
						return grid.dataset.get("is_default") == 0 && grid.dataset.get("parent_id") !== 0
					else if(column.command === "deletex")
						return grid.dataset.get("parent_id") != 0
					else if(column.command === "add")
						return grid.dataset.get("parent_id") == 0
					else if(column.command === "editx")
						return grid.dataset.get("parent_id") != 0
					else if(column.command === "group")
						return grid.dataset.get("parent_id") != 0
					else
						return defaultValue
				});

				grid.Events.OnCommand.add(function(grid, column) {
					if(column.command == "add") {
						column.column.openDropDown({
							container: column.element,
							icon: "new",
							color: "dodgerblue",
							title: "Add Diagnosis",
							// subTitle: "...",
							width: 600,
							height: 300,
							view: DiagnosisView,
							select: function(code) {
								desktop.Ajax(
									self, 
									"/app/api/command/add-claim-diagnosis",
									{
										service_id: desktop.dbService.get("id"),
										claim_id: desktop.dbService.get("claim_id"),
										diagnosis_group: grid.dataset.get("diagnosis_group"),
										diagnosis_code: code
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error adding diagnosis",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
					
					if(column.command === "deletex") {
						ConfirmDialog({
							color: "forestgreen",
							target: column.element,
							title: "Delete Diagnosis",
							message: "Please confirm to delete diagnosis.",
							callback: function(dialog) {
								desktop.Ajax(
									self, 
									"/app/api/command/delete-claim-diagnosis",
									{
										id: grid.dataset.getKey()
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error deleting diagnosis",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
					if(column.command === "default") {
						ConfirmDialog({
							color: "forestgreen",
							target: column.element,
							title: "Set Default",
							message: "Please confirm to set diagnosis as default.",
							callback: function(dialog) {
								desktop.Ajax(
									self, 
									"/app/api/command/edit-claim-diagnosis",
									{
										id: grid.dataset.getKey(),
										diagnosis_group: grid.dataset.get("diagnosis_group"),
										diagnosis_code: grid.dataset.get("diagnosis_code"),
										is_default: true
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error setting default",
												message: result.message
											});
										}
									}
								)
							}
						});
					}	
					
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
					
					if(column.command == "group") {
						column.column.openDropDown({
							container: column.element,
							icon: "group",
							color: "forestgreen",
							title: "Change Diagnosis Group",
							// subTitle: "...",
							width: 600,
							height: 200,
							view: DiagnosisGroupView,
							initParams: function(dataParams) {
								dataParams.set("id", desktop.dbService.get("id"));
							},
							select: function(code) {
								desktop.Ajax(
									self, 
									"/app/api/command/edit-claim-diagnosis",
									{
										id: grid.dataset.getKey(),
										diagnosis_group: code,
										diagnosis_code: grid.dataset.get("diagnosis_code"),
										is_default: false
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error changing diagnosis group",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {					
					if (grid.dataset.get("parent_id") == 0) {
						row.attr("x-main", 1)
					} else {
						row.attr("x-main", 0)
					}
					
					if (grid.dataset.get("is_default")) {
						row.attr("x-default", 1);
					};					
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "...", fixed:"left"}, function(band) {					
						band.NewCommand({command:"add"});
						band.NewCommand({command:"default"});
						band.NewCommand({command:"deletex"});
						band.NewCommand({command:"editx"});
						band.NewCommand({command:"group"});
					});
					grid.NewColumn({fname: "display", width: 575, fixedWidth:false});
					
					// grid.NewBand({caption: "Details"}, function(band) {
						// band.NewColumn({fname: "diagnosis_code", width: 50, fixedWidth:true});
					// });
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					var item = toolbar.NewDropDownViewItem({
						id: "new-diagnosis",
						icon: "new",
						color: "#1CA8DD",
						// color: "dodgerblue",
						title: "Add Diagnosis Group",
						height: 300,
						width: 600,
						// subTitle: "Choose the diagnosis to add",
						view: DiagnosisView,
						select: function(code) {
							desktop.Ajax(
								self, 
								"/app/api/command/add-claim-diagnosis",
								{
									service_id: desktop.dbService.get("id"),
									claim_id: desktop.dbService.get("claim_id"),
									diagnosis_group: code,
									diagnosis_code: code
								}, 
								function(result) {
									if (result.status == 0) {
										grid.refresh();
									} else {
										ErrorDialog({
											target: item.elementContainer,
											title: "Error adding diagnosis",
											message: result.message
										});
									}
								}
							)
						}
					});
				});
			});
		}
	});
};
