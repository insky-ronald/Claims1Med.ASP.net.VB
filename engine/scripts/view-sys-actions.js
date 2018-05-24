// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-actions.js
// uses edit-action.js
//==================================================================================================
function ActionsView(params) {
	return new jGrid($.extend(params, {
		paintParams: {
			css: "sys-actions",
			toolbar: {
				theme: "svg"
			}
		},
		editForm: function(id, container, dialog) {
			ActionEdit({
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
				grid.optionsData.url = "engine/sys-actions";
				grid.options.horzScroll = false;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;
				grid.options.showMasterDetail = true;

				grid.options.viewType = "treeview";
				grid.options.treeViewSettings.keyColumnName = "id";
				grid.options.treeViewSettings.parentColumnName = "parent_id";
				grid.options.treeViewSettings.columnName = "action_name";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						// .addColumn("id", params.requestParams.id, {numeric:true})
						// .addColumn("mode", 11, {numeric:true})
						.addColumn("mode", 0, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						// .setprops("rights", {label:"Rights"})
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
						.setprops("rights", {label:"Rights",
							getText: function(column) {
								if(column.raw()) {
									var names = column.raw().split(",");
									var container = CreateElement("div");
									var items = CreateElement("ul", container).attr("x-rights", "1")
									for(var i = 0; i < names.length; i++) {
										var name = CreateElement("li", items).html(names[i].trim());
									};
									
									return container.html();
								} else
									return ""
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					// row.attr("x-limit", grid.dataset.get("has_limit") ? 1: 0);
					// row.attr("x-benefits", grid.dataset.get("has_benefits") ? 1: 0);
					// row.attr("x-top", grid.dataset.get("parent_id") == 0 ? 1: 0);
				});

				grid.Events.OnTreeViewButtons.add(function(grid, params) {
					// if(grid.dataset.get("parent_id") != 0)  {
					var position = params.addIcon({icon:"drag-vertical", name:"position"});
					new jResize({
						owner: grid, 
						sizer: position,
						orientation: "move",
						initDrag: function(drag, e) {
							$("body").addClass("moving");
							
							drag.sourceId = parseInt($(e.target).closest("tr").attr("row-id"));
							grid.dataset.gotoKey(drag.sourceId);
							drag.parentId = grid.dataset.get("parent_id");
							drag.name = grid.dataset.raw("action_name");
							
							grid.painter.focusRow(drag.sourceId);
							
							drag.X = e.pageX + 16;
							drag.Y = e.pageY;
							
							drag.hint = CreateElement("div", $("body"))
								.addClass("move-hint")
								.attr("x-allow", "0")
								.css("left", drag.X)
								.css("top", drag.Y)
								.css("padding", 4)									
								.css("z-index", ++desktop.zIndex)
								.html(drag.name);
							
								
							position.attr("moving", "1");
							grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='move']").css("pointer-events", "none");
							grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='position']").css("pointer-events", "none");
						},
						dragging: function(drag, x, y, e) {
							
							drag.hint.css("top", drag.Y + y);
							drag.hint.css("left", drag.X + x);
							
							var row = $(e.target).closest("tr");
							var id = parseInt(row.attr("row-id"));
							var parentId = grid.dataset.lookup(id, "parent_id");
							var name = grid.dataset.lookup(id, "action_name");
							var itemNo = grid.dataset.lookup(id, "position");
							
							drag.targetId = id;
							
							var off = row.offset();
							var pos = $(e.target).position();
							var height = row.height();
							var ypos = e.pageY-off.top;
							
							if (e.shiftKey) {
								drag.action = 0;
								drag.hint.attr("x-mode", "move");
								drag.hint.html(("Move {0} under {1}").format(drag.name, name));
							} else {
								drag.action = 1;
								drag.hint.attr("x-mode", "position");
								drag.hint.html(("Move {0} to position {1}").format(drag.name, itemNo, grid.dataset.lookup(parentId, "action_name")))
							}
							
							if (id == drag.sourceId) {
								drag.hint.attr("x-allow", "0")
								drag.hint.html(drag.name);
								drag.targetId = 0;
							} else {
								drag.hint.removeAttr("x-allow")									
							}
						},
						dragEnd: function(drag, e) {
							$("body").removeClass("moving");
							drag.hint.remove();
							
							grid.dataset.gotoKey(drag.targetId); // go to the destination row
							
							grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='move']").css("pointer-events", "");
							grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='position']").css("pointer-events", "");

							// return;
							if (drag.targetId) {
								desktop.Ajax(
									self, 
									"/app/api/command/move-action-item",
									{
										id: drag.sourceId,
										target_id: drag.targetId,
										action: drag.action
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh(false, function() {
												grid.painter.focusRow(drag.sourceId);
											});
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
						}
					});
						
					// }
				});

				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Item",
						message: ("Please confirm to delete action <b>{0}</b>.").format(grid.dataset.raw("action_name"))
					};
				});

				grid.methods.add("allowCommand", function(grid, column) {
					// if(column.command === "edit") {
						// return grid.dataset.get("parent_id") > 0
					// } else if(column.command === "delete") {
						// return grid.dataset.get("parent_id") > 0
					// } else if(column.command === "master-detail") {
						// return grid.dataset.get("parent_id") > 0
					// } else {
						return true
					// }
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "action_name", width: 300, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "code", width: 150, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "rights", width: 300, allowSort: false, fixedWidth:false});
					// grid.NewColumn({fname: "id", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "parent_id", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "sort", width: 100, allowSort: false, fixedWidth:true});
				});
				
				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.NewItem({
						// id: "test",
						// icon: "export-excel",
						// iconColor: "firebrick",
						// hint: "Test",
						// click: function(item) {
							// grid.refresh(true);
						// }
					// });
					// toolbar.NewItem({
						// id: "test2",
						// icon: "test",
						// iconColor: "firebrick",
						// hint: "Test",
						// click: function(item) {
						// }
					// });
				});
			})
		}
	}));
};

function ActionsView2(viewParams) {
	var name = "engine/sys-actions";
	var requestParams = viewParams.requestParams;
	
	return new JDBGrid({
		params: viewParams,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "sys-actions"
		},
		editForm: function(id, container, dialog) {
			ActionEdit({
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
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Action",
					message: ('Please confirm to delete action "<b>{0}</b>"').format(grid.dataset.lookup(id, "action_name"))
				}
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				// grid.optionsData.url = name +"?"+ ObjectToRequestParams(requestParams);
				grid.optionsData.url = name;
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				// grid.options.showAdvanceSearch = false;
				// grid.options.AdvanceSearchWidth = 500;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "position")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						
					if(viewParams.requestParams.app_only)
						dataParams.addColumn("mode", 11)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("position", {label:"Position", numeric:true})
						.setprops("code", {label:"Code"})
						.setprops("action_name", {label:"Action"})
						.setprops("description", {label:"Description"})
						// .setprops("rights", {label:"Rights"})
						.setprops("rights", {label:"Rights",
							getText: function(column) {
								if(column.raw()) {
									var names = column.raw().split(",");
									var container = CreateElement("div");
									var items = CreateElement("ul", container).attr("x-rights", "1")
									for(var i = 0; i < names.length; i++) {
										var name = CreateElement("li", items).html(names[i].trim());
									};
									
									return container.html();
								} else
									return ""
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"))
					row.attr("x-type", grid.dataset.get("action_type_id"))
					row.attr("x-app-id", grid.dataset.get("application_id"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "position", width: 75, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "action_name", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "description", width: 300, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "rights", width: 300, allowSort: false, fixedWidth:false});
				});
				
				// grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.NewItem({
						// id: "save",
						// icon: "db-save",
						// iconColor: "red",
						// hint: "Save",
						// dataBind: grid.dataset,
						// dataEvent: function(dataset, button) {
							// console.log("ok");
							// button.show(!dataset.editing);
							// button.show(false);
							// self.Events.OnDataEvent.trigger();
						// },
						// click: function(item) {
							// console.log("here");
							// self.Events.OnPost.trigger();
						// }
					// });
				// });
			});
		}
	});	
};
