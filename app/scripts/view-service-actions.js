// ****************************************************************************************************
// Last modified on
// 29-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-actions.js
//==================================================================================================
function ServiceActionsView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "service-actions",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ServiceActionEdit({
				url: ("?id={0}").format(id),
				container: container,
				containerPadding: 0,				
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog
				// customData: {
					// owner_id: requestParams.owner_id
				// }
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/service-actions";
				
				// grid.options.viewType = "cardview";
				grid.options.action = viewParams.action;
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				grid.options.showMasterDetail = true;
				// grid.options.showPager = true;
				// grid.options.hideHeader = true;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", 0, {numeric:true})
						.addColumn("service_id", viewParams.requestParams.service_id, {numeric:true})
						.addColumn("sort", "due_date")
						.addColumn("order", "desc")
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
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("is_done", {label:"", 
							getText: function(column, value) {
								if(value === "D") {
									return "Closed"
								} else if(value === "X") {
									return "Canceled"
								} else if(value === "N") {
									return "Open"
								} else  {
									return value
								}
							}
						})
						.setprops("action_type", {label:"Class"})
							// getText: function(column, value) {
								// return value.toLowerCase()
							// }
						// })
						.setprops("action_name", {label:"Action"})
						.setprops("due_date", {label:"Due Date", type:"date"})
						.setprops("action_owner_name", {label:"Owner"})
						.setprops("completion_date", {label:"Date Completed", type:"date", format:"datetime"})
						.setprops("completion_user_name", {label:"Completed By"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						.setprops("create_user_name", {label:"Created by"})
						.setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
						.setprops("update_user_name", {label:"Updated by"})
						.setprops("due_date", {label:"Due Date", type:"date", format:"datetime"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.raw("is_done"))
				});	
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "master-detail")
						return "notes"
					// else if(column.command === "deletex")
						// return "db-delete"
					// else if(column.command === "editx")
						// return "db-edit"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "master-detail") {
						return "View notes"
					// } else if(column.command === "deletex") {
						// return "Delete note"
					// } else {
						return defaultValue
					}
				});
				
				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
					
					var dataset = new Dataset([{
							id: grid.dataset.raw("id"),
							notes: grid.dataset.raw("notes")
						}]);
					
					new SimpleNotesEditor({
						container: params.container, 
						dataset: dataset,
						columnName: "notes",
						requestParams: {
							showToolbar: false,
							readonly: true
						// },
						// update: function(editor) {
						}
					})
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "action_type", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "action_name", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "due_date", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "action_owner_name", width: 150, allowSort: true});
					grid.NewColumn({fname: "create_date", width: 150, allowSort: true});
					grid.NewColumn({fname: "create_user_name", width: 150, allowSort: true});
					grid.NewColumn({fname: "update_date", width: 150, allowSort: true});
					grid.NewColumn({fname: "create_user_name", width: 150, allowSort: true});
					grid.NewColumn({fname: "completion_date", width: 150, allowSort: true});
					grid.NewColumn({fname: "completion_user_name", width: 150, allowSort: true});
				})
							
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					var btn = toolbar.NewDropDownWizard2({
						id: "new-action",
						icon: "new",
						color: "dodgerblue",
						title: "New Action",
						width: 500,
						height: 400,
						permission: {
							view: grid.crud.add
						},
						prepare: function(wizard) {
							wizard.dataset = new Dataset([{
								id: 0,
								// claim_id: parseInt(viewParams.requestParams.claim_id),
								service_id: parseInt(viewParams.requestParams.service_id),
								action_type_code: "",
								action_code: "",
								action_owner: "",
								notes: ""
							}]);
								
							wizard.events.OnFinish.add(function(wizard) {
								// wizard.dataset.set("action_type_code", wizard.actionsLookup.dataset.get("action_type_code"));
								// wizard.dataset.set("action_code", wizard.lookup.dataset.get("action_code"));
								wizard.dataset.set("notes", wizard.notes.notes.html());
								
								desktop.Ajax(
									self, 
									"/app/get/update/service-actions",
									{
										mode: "new",
										data: JSON.stringify(wizard.dataset.data),
									}, 
									function(result) {
										if (result.status == 0) {
											wizard.close();
											// newNotes.push(parseInt(result.result.id));
											grid.refresh();
										} else {
											ErrorDialog({
												target: btn.elementContainer,
												title: "Error adding note",
												message: result.message
											});
										}
									}
								)
							});
								
							wizard.events.OnDrawHeader.add(function(wizard, container) {
								wizard.editor = new SimpleEditor({
									id: "new-action",
									container: container,
									theme: "default",
									css: "editor", 
									labelWidth: 100,
									resize: false,
									showCategory: false,
									dataset: wizard.dataset,
									initData: function(editor, dataset) {
										dataset.Events.OnChanged.add(function(dataset, columnName) {
											var index = wizard.activeTabIndex();
											editor.SetVisible("action_type_code", index >= 2);
											editor.SetVisible("action_code", index >= 2);
											editor.SetVisible("action_owner", index >= 3);
											// editor.SetVisible("action_owner_full_name", index >= 3);
										});
										
										dataset.Columns
											.setprops("id", {numeric:true, key: true})
											.setprops("action_type_code", {label:"Type", readonly:true,
												getText: function(col) {
													if (wizard.actionsLookup.dataset.data.length > 0) {
														return wizard.actionsLookup.dataset.lookup(wizard.actionsLookup.dataset.get("parent_id"), "description")
													} else {
														return ""
													}
												}
											})
											.setprops("action_code", {label:"Action", readonly:true,
												getText: function(col) {
													if (wizard.actionsLookup.dataset.data.length > 0) {
														return wizard.actionsLookup.dataset.get("description")
													} else {
														return ""
													}
												}
											})
											.setprops("action_owner", {label:"Assigned to", readonly:true,
												getText: function(col) {
													if (wizard.usersLookup && wizard.usersLookup.dataset.data.length > 0) {
														return wizard.usersLookup.dataset.get("full_name")
													} else {
														return ""
													}
												}
											})
											.setprops("due_date", {label:"Due Date", type:"date", format:"datetime", readonly:false})
									},
									initEditor: function(editor) {
										editor.AddText("action_type_code");
										editor.AddText("action_code");
										editor.AddText("action_owner");
										editor.AddDate("due_date");
									}
								});	          
							});
							
							wizard.add({
								OnNext: function(wizard) {
									return wizard.actionsLookup.dataset.data.length > 0 && wizard.actionsLookup.dataset.get("parent_id") > 0
								},
								OnSubTitle: function(wizard, container) {
									wizard.dataset.set("action_type_code", "");
									wizard.dataset.set("action_code", "");
								},
								OnCreate: function(wizard, container) {
									container.attr("x-sec", "actions");
									
									wizard.actionsLookup = ActionsLookup({
										container: container,
										hideSelection: true,
										initData: function(grid) {
											grid.dataset.Events.OnMoveRecord.add(function(dataset) {
												wizard.update();
											});
										}
									});
								}
							});
							
							wizard.add({
								OnSubTitle: function(wizard, container) {
									wizard.dataset.set("action_owner", "");
									// wizard.dataset.set("action_owner_full_name", "");
									wizard.dataset.set("action_type_code", wizard.actionsLookup.dataset.get("parent_code"));
									wizard.dataset.set("action_code", wizard.actionsLookup.dataset.get("code"));
									// wizard.dataset.set("action_type", wizard.actionsLookup.dataset.lookup(wizard.actionsLookup.dataset.get("parent_id"), "description"));
									// wizard.dataset.set("action_name", wizard.actionsLookup.dataset.get("description"));
								},
								OnCreate: function(wizard, container) {
									container.attr("x-sec", "users");
									
									wizard.usersLookup = UsersLookup({
										container: container,
										hideSelection: true,
										initData: function(grid) {
											grid.dataset.Events.OnMoveRecord.add(function(dataset) {
												wizard.update();
											});
										}
									});
								}
							});
							
							wizard.add({
								OnSubTitle: function(wizard, container) {
									wizard.dataset.set("action_owner", wizard.usersLookup.dataset.get("user_name"));
									// wizard.dataset.set("action_owner_full_name", wizard.usersLookup.dataset.get("full_name"));
								},
								OnCreate: function(wizard, container) {
									container.attr("x-sec", "notes");
									
									wizard.notes = new SimpleNotesEditor({
										container: container, 
										dataset: wizard.dataset,
										columnName: "notes",
										requestParams: {
											showToolbar: false,
											readonly: false
										}
									})
								},
								OnActivate: function(wizard) {
									var name = wizard.usersLookup.dataset.get("full_name");
									// var main = wizard.actionsLookup.dataset.lookup(wizard.actionsLookup.dataset.get("parent_id"), "description");
									wizard.setSubTitle($(("<div x-sec='note-tab'><span x-sec='main'>{0}</span><span x-sec='sub'>{1}</span></div>").format("Assign to", name)));
								},
								OnVisibility: function(wizard, visible) {
									wizard.notes.notes.focus();
								}
							});
						},
						finish: function(wizard) {
							wizard.dataset.set("note_type", wizard.lookup.dataset.get("parent_code"));
							wizard.dataset.set("note_sub_type", wizard.lookup.dataset.get("code"));
							wizard.dataset.set("notes", wizard.notes.notes.html());
							
							desktop.Ajax(
								self, 
								"/app/get/update/claim-notes",
								{
									mode: "new",
									data: JSON.stringify(wizard.dataset.data),
								}, 
								function(result) {
									if (result.status == 0) {										
										newNotes.push(parseInt(result.result.id));
										grid.refresh();
									} else {
										ErrorDialog({
											target: btn.elementContainer,
											title: "Error adding note",
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
	}));
};
