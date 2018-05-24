// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-permissions.js
// uses edit-permission.js
//==================================================================================================
function PermissionsView(params){
	var roleID = params.requestParams.role_id;
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "sys-permissions",
			toolbar: {
				theme: "svg"
			}
		},
		// editForm: function(id, container, dialog) {
			// PermissionEdit({
				// url: ("?action_id={0}&role_id={1}").format(id, roleID),
				// container: container,
				// containerPadding: 0,				
				// showToolbar: false,
				// pageControlTheme: "data-entry",
				// fillContainer: true,
				// dialog: dialog
			// })
		// },
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "engine/sys-permissions";
				grid.options.horzScroll = false;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;
				grid.options.showMasterDetail = false;

				grid.options.viewType = "treeview";
				grid.options.treeViewSettings.keyColumnName = "action_id";
				grid.options.treeViewSettings.parentColumnName = "parent_id";
				grid.options.treeViewSettings.columnName = "action_name";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("role_id", roleID, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("action_id", {numeric:true, key: true})
						.setprops("code", {label:"Code"})
						.setprops("action_name", {label:"Action",
							getText: function(column, value) {
								// if (column.dataset.get("parent_id")) {
									return ("{0}. {1}").format(column.dataset.get("position"), value)
								// } else {
									// return value
								// }
							}
						})
						.setprops("rights_names", {label:"Rights",})
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					if (grid.dataset.get("code") == "") {
						row.attr("x-type", "A")
					} else if (grid.dataset.get("code") == "-") {
						row.attr("x-type", "C")
					}
					// row.attr("x-type", grid.dataset.get("action_type_id"))
					// row.attr("x-limit", grid.dataset.get("has_limit") ? 1: 0);
					// row.attr("x-benefits", grid.dataset.get("has_benefits") ? 1: 0);
					// row.attr("x-top", grid.dataset.get("parent_id") == 0 ? 1: 0);
				});

				grid.Events.OnTreeViewButtons.add(function(grid, params) {
					// params.addIcon({icon:"drag-vertical", name:"position"});
				});

				// grid.Methods.add("deleteConfirm", function(grid, id) {
					// return {
						// title: "Delete Item",
						// message: ("Please confirm to delete action <b>{0}</b>.").format(grid.dataset.raw("action_name"))
					// };
				// });

				grid.methods.add("allowCommand", function(grid, column) {
					if(column.command === "edit") {
						return grid.dataset.get("rights") && grid.dataset.get("rights") != "0"
					// } else if(column.command === "delete") {
						// return grid.dataset.get("parent_id") > 0
					// } else if(column.command === "master-detail") {
						// return grid.dataset.get("parent_id") > 0
					} else {
						return true
					}
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "action_name", width: 400, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "permissions", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "rights", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "code", width: 150, allowSort: false, fixedWidth:false});
					grid.NewColumn({fname: "rights_names", width: 1024, allowSort: false, fixedWidth:false, 
						drawContent: function(cell, column) {
							cell.html("");
							var names = grid.dataset.text("rights_names").split(",");
							var ids = grid.dataset.text("rights").split(",");
							var permissions = [];
							// if(grid.dataset.get("permissions") != "")
							if(grid.dataset.get("permissions"))
								permissions = grid.dataset.get("permissions").split(",");
							
							if(grid.dataset.get("rights") && grid.dataset.get("rights") != "0") {
								var container = CreateElement("div", cell);
								var items = CreateElement("ul", container).attr("x-has-rights", "1");
								items.attr("x-id", grid.dataset.get("action_id"));
								// items.attr("x-permissions", grid.dataset.get("permissions"));
								for(var i = 0; i < names.length; i++) {
									CreateElementEx("li", items, function(name) {
										if(permissions.indexOf(ids[i]) > -1) {
											name.attr("x-active", 1)
										} else {
											name.attr("x-active", 0);
										}
										
										name.attr("x-id", ids[i]);
										name.html(names[i].trim());
									}).click(function() {
										var item = $(this);
										var id = item.attr("x-id");
										var actionId = parseInt(item.parent().attr("x-id"));
										var active = parseInt(item.attr("x-active"));

										grid.dataset.gotoKey(actionId);

										var permissions = grid.dataset.get("permissions").split(",");
										if (permissions[0] == "") {
											permissions = [];
										}
										
										if (active) {
											var pos = permissions.indexOf(id);
											permissions.splice(pos, 1);
											item.attr("x-active", 0)
										} else {
											permissions.push(id);
											item.attr("x-active", 1)
										}
										
										// item.parent().attr("x-permissions", permissions.join(","));
										
										grid.dataset.set("permissions", permissions.join(","));
									});
								}
							}
						}
					});
					// grid.NewColumn({fname: "rights", width: 300, allowSort: false, fixedWidth:false});
					// grid.NewColumn({fname: "id", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "parent_id", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "sort", width: 100, allowSort: false, fixedWidth:true});
				});
				
				// grid.Events.OnMasterDetail.add(function(grid, params) {
					// params.setHeight(250);
				// });

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					toolbar.NewItem({
						id: "save",
						icon: "db-save",
						iconColor: "dodgerblue",
						hint: "Save",
						dataBind: grid.dataset,
						dataEvent: function(dataset, button) {
							button.show(dataset.editing);
						},
						click: function(item) {
							grid.painter.showBusy(true);
							
							var updateData = [];
							$(grid.dataset.delta).each(function(i, row) {
								if (grid.dataset.gotoKey(row.action_id)) {
									updateData.push({
										role_id: grid.dataset.get("role_id"),
										action_id: grid.dataset.get("action_id"),
										permissions: grid.dataset.get("permissions")
									});
								}
							});
							
							item.dataBind.clearDelta();
							item.dataBind.setEditing(false);
							
							desktop.Ajax(grid, "/engine/get/update-permissions/sys-permissions", {
								updateData: JSON.stringify(updateData)
							},
							function(data) {
								// grid.refresh(true);
								grid.painter.showBusy(false);
							});
						}
					});
					
					toolbar.NewItem({
						id: "cancel",
						icon: "db-cancel",
						iconColor: "firebrick",
						hint: "Cancel",
						dataBind: grid.dataset,
						dataEvent: function(dataset, button) {
							button.show(dataset.editing);
						},
						click: function(item) {
							$(grid.dataset.delta).each(function(i, row) {
								grid.dataset.gotoKey(row.action_id);
								grid.dataset.set("permissions", row.permissions);
							});
							
							item.dataBind.clearDelta();
							item.dataBind.setEditing(false);
							grid.refresh(true);
						}
					});
					
					toolbar.SetVisible("save", false);
					toolbar.SetVisible("cancel", false);
				});
			})
		}
	}));
};

function PermissionsView2(params){
	var roleID = params.requestParams.role_id;
	
	return DefaultView(params, {
		url: "engine/sys-permissions",
		css: "sys-permissions",
		initRequestParams: function(grid, requestParams) {
			// console.log(params.requestParams.role_id)
			requestParams.role_id = params.requestParams.role_id;
		},
		initData: function(grid, data) {
			data.Columns
				.setprops("action_id", {label:"ID", numeric:true, key: true})
				.setprops("role_id", {label:"Role ID", numeric:true})
				.setprops("code", {label:"Code"})
				.setprops("action_name", {label:"Action"})
				.setprops("rights_names", {label:"Permissions",
					getTextx: function(column) {
						var names = column.raw().split(",");
						var ids = column.dataset.get("rights").split(",");
						var permissions = [];
						if(column.dataset.get("permissions") != "")
							permissions = column.dataset.get("permissions").split(",");
						
						var container = CreateElement("div");
						var items = CreateElement("ul", container).attr("x-rights", "1")
						for(var i = 0; i < names.length; i++) {
							var name = CreateElement("li", items).html(names[i].trim());
							var id = ids[i];
							if(permissions.indexOf(id) > -1)
								name.attr("x-active", 1)
							else
								name.attr("x-active", 0)
						};
						
						return container.html();
					}
				})
		},
		onMaterDatasetUpdate: function(grid, requestParams) {
			// we expect grid.optionsData.masterDataset primary key to be the role_id
			requestParams.role_id = grid.optionsData.masterDataset.text(grid.optionsData.masterDataset.primaryKey);
		},
		initGrid: function(grid) {
			grid.options.showPager = false;
			grid.options.simpleSearch = false;
			grid.options.showFocused = false;
		},
		initRow: function(grid, row) {
			row.attr("x-type", grid.dataset.get("action_type_id"))
		},
		// getCommandIcon: function(grid, column) {
			// if(column.command == "edit")
				// return "security"
			// else
				// return "";
		// },
		getCommandHint: function(grid, column) {
			if(column.command == "edit")
				return "Assign permissions"
			else
				return "";
		},
		initColumns: function(grid) {
			grid.NewColumn({fname: "action_id", width: 75, allowSort: false, fixedWidth:true});
			grid.NewColumn({fname: "code", width: 150, allowSort: false, fixedWidth:true});
			grid.NewColumn({fname: "action_name", width: 175, allowSort: false, fixedWidth:true});
			grid.NewColumn({fname: "rights_names", width: 1024, allowSort: false, fixedWidth:false, 
				drawContent: function(cell, column) {
					cell.html("");
					var names = column.dataset.text("rights_names").split(",");
					var ids = column.dataset.text("rights").split(",");
					var permissions = [];
					if(column.dataset.get("permissions") != "")
						permissions = column.dataset.get("permissions").split(",");
					
					var container = CreateElement("div", cell);
					var items = CreateElement("ul", container).attr("x-has-rights", "1");
					for(var i = 0; i < names.length; i++) {
						var name = CreateElement("li", items).html(names[i].trim());
						var id = ids[i];
						if(permissions.indexOf(id) > -1)
							name.attr("x-active", 1)
						else
							name.attr("x-active", 0)
					};
				}
			});
		},
		deleteConfirm: function(grid, id) {
			return {
				title: "Delete Action",
				message: ('Please confirm to delete action "<b>{0}</b>"').format(grid.dataset.lookup(id, "action_name"))
			}
		},
		editProc: PermissionEdit,
		initEdit: function(params) {		
			// ("?id={0}&role_id={1}").format(params.id, params.requestParams.role_id);
			// ("?id={0}&role_id={1}").format(params.id, params.requestParams.role_id);
			params.url = ("?id={0}&role_id={1}").format(params.id, roleID);
		}
	});
};
