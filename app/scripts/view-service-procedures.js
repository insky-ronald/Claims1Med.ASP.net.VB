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
				grid.options.action = params.action;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;

				// grid.options.viewType = "treeview";
				// grid.options.treeViewSettings.keyColumnName = "id"
				// grid.options.treeViewSettings.parentColumnName = "parent_id";
				// grid.options.treeViewSettings.columnName = "display";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", serviceId, {numeric:true})
				});

				grid.methods.add("canAdd", function(grid) {
					return false;
				});

				grid.methods.add("canEdit", function(grid) {
					return false;
				});

				grid.methods.add("canDelete", function(grid) {
					return false;
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("code", {label:"Code"})
						.setprops("cpt", {label:"Procedure"})
						.setprops("diagnosis_code", {label:"Diagnosis"})
						.setprops("procedure_type_name", {label:"Type"})
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
							color: "firebrick",
							target: column.element,
							title: "Delete Procedure",
							message: "Please confirm to delete procedure.",
							callback: function(dialog) {
								desktop.serverPost({
									url: "/app/get/delete-claim-procedure/" + url,
									params: {
										id: grid.dataset.getKey()
									},
									success: function(data) {
										grid.refresh();
									},
									error: {
										target: column.element,
										title: "deleting procedure"
									}
								});
							}
						});
					};
					
					if(column.command == "editx") {
						column.column.openDropDown({
							container: column.element,
							icon: "db-edit",
							color: "dodgerblue",
							title: "Edit Procedure",
							width: 600,
							height: 300,
							view: ProceduresView,
							select: function(code) {
								desktop.serverPost({
									url: "/app/get/edit-claim-procedure/"+url,
									params: {
										id: grid.dataset.getKey(),
										code: code,
										diagnosis_code: grid.dataset.get("diagnosis_code")
									},
									success: function(data) {
										grid.refresh();
									},
									error: {
										target: column.element,
										title: "updating procedure"
									}
								});
							}
						});
					};
					
					if(column.command == "diagnosis") {
						column.column.openDropDown({
							container: column.element,
							icon: "group",
							color: "forestgreen",
							title: "Assign to Diagnosis",
							width: 600,
							height: 200,
							view: DiagnosisGroupView,
							initParams: function(dataParams) {
								dataParams.set("id", desktop.dbService.get("id"));
							},
							select: function(diagnosisCode) {
								desktop.serverPost({
									url: "/app/get/edit-claim-procedure/"+url,
									params: {
										id: grid.dataset.getKey(),
										code: grid.dataset.get("code"),
										diagnosis_code: diagnosisCode
									},
									success: function(data) {
										grid.refresh();
									},
									error: {
										target: column.element,
										title: "assigning diagnosis to procedure"
									}
								});
							}
						});
					};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "...", fixed:"left"}, function(band) {					
						band.NewCommand({command:"deletex", permission:"delete"});
						band.NewCommand({command:"editx", permission:"edit"});
						band.NewCommand({command:"diagnosis", permission:"edit"});
					});
					grid.NewColumn({fname: "code", width: 75, fixedWidth:false});
					grid.NewColumn({fname: "cpt", width: 400, fixedWidth:false});
					grid.NewColumn({fname: "diagnosis_code", width: 75, fixedWidth:false});
					grid.NewColumn({fname: "procedure_type_name", width: 75, fixedWidth:false});
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					toolbar.NewDropDownViewItem({
						id: "new-diagnosis",
						icon: "new",
						color: "#1CA8DD",
						title: "Add Procedure",
						height: 300,
						width: 600,
						view: ProceduresView,
						permission: {
							view: desktop.canEdit && grid.crud.add
						},
						select2: function(btn, code) {
							desktop.serverPost({
								url: "/app/get/add-claim-procedure/" + url,
								params: {
									service_id: desktop.dbService.get("id"),
									claim_id: desktop.dbService.get("claim_id"),
									code: code,
									diagnosis_code: ""
								},
								success: function(data) {
									grid.refresh();
								},
								error: {
									target: btn.element(),
									title: "adding procedure"
								}
							});
						}
					});
				});
			});
		}
	});
};
