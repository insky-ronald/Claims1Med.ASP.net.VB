// ****************************************************************************************************
// Last modified on
// 11:55 PM Wednesday, October 4, 2017
// ****************************************************************************************************
// File name: view-claim-notes.js
// ****************************************************************************************************
function ClaimNotesView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "claim-notes",
			toolbar: {theme: "svg"}
		},
		// editForm: function(id, container, dialog) {
			// CountriesEdit({
				// code: id,
				// container: container,
				// dialog: dialog
			// })
		// },
		init: function(grid, callback) {	
			var newNotes = [];
			// newNotes.push(92524);
			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/claim-notes";
				
				grid.options.action = viewParams.action;
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				grid.options.showMasterDetail = true;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("type", viewParams.requestParams.type)
						.addColumn("claim_id", viewParams.requestParams.claim_id, {numeric:true})
						.addColumn("service_id", viewParams.requestParams.service_id, {numeric:true})
						// .addColumn("sort", viewParams.requestParams.type == "C" ? "reference_no" : "category")
						.addColumn("sort", "create_date")
						.addColumn("order", "desc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("is_new", {numeric:true})
						.setprops("is_deleted", {numeric:true})
						.setprops("claim_id", {numeric:true})
						.setprops("service_id", {numeric:true})
						// .setprops("module_id", {label:"Module"})
						.setprops("reference_no", {label:"Service No."})
						// .setprops("code", {label:"Code"})
						.setprops("note_type_name", {label:"Category"})
						.setprops("note_sub_type_name", {label:"Sub-Category"})
						// .setprops("sub_status", {label:"Sub-Status"})
						.setprops("create_user_name", {label:"Created By"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						// .setprops("updated_user_name", {label:"User"})
						// .setprops("updated_at", {label:"Date", type:"date", format:"datetime"})
						.setprops("notes", {
							getText: function(column, value) {
								// return value.replace(/\n/g, "<br>").replace(/\t/g, "&emsp;");
								// return value.replace(/\n/g, "<br>").replace(/\t/g, "&#9;");
								return value;
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("service-status", grid.dataset.get("status_code").toLowerCase())
					if (newNotes.indexOf(grid.dataset.get("id")) > -1) {
						row.attr("new", "1")
					}
					if (grid.dataset.get("is_deleted")) {
						row.attr("deleted", "1")
					}
				});	
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "master-detail")
						return "notes"
					else if(column.command === "deletex")
						return "db-delete"
					else if(column.command === "editx")
						return "db-edit"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandIcon", function(grid, column, defaultValue) {
					if(column.command === "deletex")
						return "db-delete"
					else if(column.command === "editx")
						return "db-edit"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "master-detail") {
						if (newNotes.indexOf(grid.dataset.get("id")) > -1) {
							return "View/Edit note"
						} else {
							return "View note"
						}
					} else if(column.command === "deletex") {
						return "Delete note"
					} else {
						return defaultValue
					}
				});
		
				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "deletex")
						return !grid.dataset.get("is_deleted")
					// else if(column.command === "editx")
						// return newNotes.indexOf(grid.dataset.get("id")) > -1
					else
						return true
				});
				
				grid.Events.OnCommand.add(function(grid, column) {
					if(column.command == "editx") {
						column.column.openDropDown({
							container: column.element,
							icon: "db-edit",
							color: "dodgerblue",
							title: "Edit Note Type",
							width: 600,
							height: 300,
							// view: DiagnosisView,
							view: NotesLookup,
							select: function(data) {
								var data = [{
									id: grid.dataset.get("id"),
									claim_id: grid.dataset.get("claim_id"),
									service_id: grid.dataset.get("service_id"),
									notes: grid.dataset.get("notes"),
									note_type: data.parentCode,
									note_sub_type: data.code,
									is_new: false
								}];
								
								desktop.Ajax(
									grid, 
									"/app/get/update/claim-notes",
									{
										mode: "edit",
										data: JSON.stringify(data),
									}, 
									function(result) {
										if (result.status == 0) {										
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error updating note",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
					
					if(column.command === "deletex") {
						var confirm = grid.methods.call("deleteConfirm", grid.dataset.getKey());
						
						ConfirmDialog({
							color: "firebrick",
							target: column.element,
							title: confirm.title,
							message: confirm.message,
							callback: function(dialog) {
								var data = {
									id: grid.dataset.getKey(),
									is_new: newNotes.indexOf(grid.dataset.get("id")) > -1
								};
								
								desktop.Ajax(
									grid, 
									"/app/get/delete/claim-notes",
									{
										mode: "delete",
										data: JSON.stringify([data]),
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error deleting note",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Note", message: ("Please confirm to delete note <b>{0} > {1}</b>.").format(grid.dataset.get("note_type_name"), grid.dataset.get("note_sub_type_name"))};
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
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "...", fixed:"left"}, function(band) {					
						// band.NewCommand({command:"add"});
						// band.NewCommand({command:"default"});
						if (grid.crud["delete"]) {
							band.NewCommand({command:"deletex"});
						}
						// band.NewCommand({command:"editx"});
						// band.NewCommand({command:"group"});
					});
					
					if(viewParams.requestParams.type == "C") {
						grid.NewColumn({fname: "reference_no", width: 150});
					}
					
					grid.NewColumn({fname: "note_type_name", width: 150});
					grid.NewColumn({fname: "note_sub_type_name", width: 200});
					grid.NewColumn({fname: "create_date", width: 150});
					grid.NewColumn({fname: "create_user_name", width: 125});
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
					
					var dataset = new Dataset([{
							id: grid.dataset.raw("id"),
							claim_id: grid.dataset.raw("claim_id"),
							service_id: grid.dataset.raw("service_id"),
							note_type: grid.dataset.raw("note_type"),
							note_sub_type: grid.dataset.raw("note_sub_type"),
							notes: grid.dataset.raw("notes")
						}]);
						
					new SimpleNotesEditor({
						container:params.container, 
						dataset: dataset,
						columnName: "notes",
						requestParams: {
							showToolbar: true,
							readonly: newNotes.indexOf(grid.dataset.get("id")) == -1 && grid.crud.edit
						},
						update: function(editor) {
							// console.log(editor)
							this.dataset.set("notes", this.notes.html());
							
							desktop.Ajax(
								self, 
								"/app/get/update/claim-notes",
								{
									mode: "edit",
									data: JSON.stringify(this.dataset.data),
								}, 
								function(result) {
									if (result.status == 0) {
										editor.dataset.post();
										// grid.refresh();
									} else {
										ErrorDialog({
											target: editor.saveBtn.elementContainer,
											title: "Error adding note",
											message: result.message
										});
									}
								}
							)
							
							// var params = {
								// id: self.dataset.getKey(), 
								// mode: "edit",
								// data: "["+ JSON.stringify(self.dataset.data[0]) +"]"
							// };

							// desktop.Ajax(self, "/app/get/update/simple-note-editor", params, function(result) {
								// self.dataset.post();
							// })
						}
					})
					// CreateElementEx("pre", params.container, function(notes) {
						// notes.append(grid.dataset.text("notes"));
					// });
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.NewDropDownViewItem({
					var btn = toolbar.NewDropDownWizard({
						id: "new-note",
						icon: "new",
						// color: "#1CA8DD",
						// color: "#6DB2E3",
						color: "dodgerblue",
						// color: "orange",
						title: "New Note",
						width: 500,
						height: 300,
						permission: {
							view: grid.crud.add
						},
						subTitle: "Choose the type of claim to create",
						// view: NotesLookup,
						// viewParams: {module:"INV", mode:1},
						permission: {
							view: grid.crud.add
						},
						prepare: function(wizard) {
							wizard.dataset = new Dataset([{
								id: 0,
								claim_id: parseInt(viewParams.requestParams.claim_id),
								service_id: parseInt(viewParams.requestParams.service_id),
								note_type: "",
								note_sub_type: "",
								notes: "",
								is_new: true
							}]);
								
							wizard.canNext2 = function() {
								if (this.lookup.dataset.data.length > 0) {
									return this.lookup.dataset.get("parent_id") > 0
								} else {
									return false
								}
							};
							
							wizard.add({
								OnCreate: function(wizard, container) {
									container.css({
										border: "2px solid #6DB2E3"
									});
									
									wizard.lookup = NotesLookup({
										container: container,
										hideSelection: true,
										initData: function(grid) {
											grid.dataset.Events.OnMoveRecord.add(function(dataset) {
												wizard.update();
											});
										}
									});
								},
								OnActivate: function(wizard) {
									wizard.subTitle("Select the type of note to add.");
								}
							});
							
							wizard.add({
								OnCreate: function(wizard, container) {
									container.css({
										border: "2px solid orange"
									});
									
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
									var sub = wizard.lookup.dataset.get("description");
									var main = wizard.lookup.dataset.lookup(wizard.lookup.dataset.get("parent_id"), "description");
									
									wizard.subTitle(("<span x-sec='main'>{0}</span><span x-sec='sub'>{1}</span>").format(main, sub))
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
