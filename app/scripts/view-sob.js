// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sob.js
//==================================================================================================
function SobView(params) {
	var serviceID = params.requestParams.serviceID;

	return new jGrid($.extend(params, {
		paintParams: {
			css: "sob",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/sob";
				grid.options.horzScroll = false;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;
				grid.options.showMasterDetail = true;

				grid.options.viewType = "treeview";
				grid.options.treeViewSettings.keyColumnName = "id";
				grid.options.treeViewSettings.parentColumnName = "parent_id";
				grid.options.treeViewSettings.columnName = "benefit_name";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", params.requestParams.id, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("detail_id", {label:"ID", numeric:true})
						.setprops("benefit_name", {label:"Benefit",
							getText: function(column, value) {
								return ("{0}. {1}").format(column.dataset.get("item_no"), value)
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					row.attr("x-limit", grid.dataset.get("has_limit") ? 1: 0);
					row.attr("x-benefits", grid.dataset.get("has_benefits") ? 1: 0);
					row.attr("x-top", grid.dataset.get("parent_id") == 0 ? 1: 0);
				});

				grid.Events.OnTreeViewButtons.add(function(grid, params) {
					// if(grid.dataset.get("parent_id") != 0)  {
					if(false)  {
						var move = params.addIcon({icon:"drag-vertical", name:"move"})
							.attr("x-id", grid.dataset.get("id"));
							
						new jResize({
							owner:grid, 
							sizer:move,
							orientation: "move",
							initDrag: function(drag, e) {
								$("body").addClass("moving");
								var row = $(e.target).closest("tr");
								drag.sourceId = parseInt(row.attr("row-id"));
								grid.painter.focusRow(drag.sourceId);
								grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='move']").css("pointer-events", "none");
								grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='position']").css("pointer-events", "none");
							},
							dragging: function(drag, x, y, e) {
								var row = $(e.target).closest("tr");
								var id = parseInt(row.attr("row-id"));
								move.attr("moving", "1");
								// console.log(id);
								// var size, size2;
								// if(drag.orientation === "vert")
									// size = drag.baseSize + x
								// else
									// size = drag.baseSize + y;
								
								// if(drag.owner.control.params.usePercent) {
									// if(drag.orientation === "horz")
										// drag.target2.css("height", 100 - 6 - (size / drag.parentSize * 100) + "%"); // this is for compatibility with Chrome issue
									// else
										// drag.target2.css("width", 100 - 6 - (size / drag.parentSize * 100) + "%"); // this is for compatibility with Chrome issue
									// size = size / drag.parentSize * 100 + "%";
								// };
								
								// drag.target.css("flex-basis", size);
								// if(drag.orientation === "vert")
									// drag.target.css("width", size)
								// else
									// drag.target.css("height", size);
							},
							dragEnd: function(drag, e) {
								$("body").removeClass("moving");
								var row = $(e.target).closest("tr");
								var id = parseInt(row.attr("row-id"));
								move.removeAttr("moving");
								grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='move']").css("pointer-events", "");
								grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='position']").css("pointer-events", "");
								
								/* METHOD 1							
								grid.dataset.gotoKey(id); // go to the destination row
								var itemNo = grid.dataset.get("children_count")+1, sort = grid.dataset.get("sort");

								grid.dataset.set("children_count", itemNo);
								grid.dataset.post();
								
								grid.dataset.gotoKey(drag.sourceId);
								var itemNo2 =  grid.dataset.get("item_no");
								var parentId = grid.dataset.get("parent_id");
								
								var sort2 = grid.dataset.lookup(parentId, "sort");
								
								grid.dataset.gotoKey(drag.sourceId);
								
								grid.dataset.set("parent_id", id);
								grid.dataset.set("item_no", itemNo);
								grid.dataset.set("sort", sort +"."+ itemNo.strZero(2);
								grid.dataset.post();

								grid.dataset.gotoKey(parentId);
								grid.dataset.set("children_count", grid.dataset.get("children_count")-1);
								grid.dataset.each(function(row) {
									if (row.parent_id == parentId && row.item_no > itemNo2) {
										row.item_no--;
										row.sort = sort2 + "." + row.item_no.strZero(2);
									}
								});
								
								grid.dataset.post();
								
								var newData = $(grid.dataset.data).sort(function(a, b) {
									if (a.sort < b.sort) {
										return -1
									} else if (a.sort > b.sort) {
										return 1
									} else {
										return 0
									}
								});
								
								grid.dataset.data = newData;
								*/
								
								/* METHOD 2
								var moveRow;
								moveRow = grid.dataset.data[grid.dataset.recNo];
								// temp.push(grid.dataset.data[grid.dataset.recNo]);
								grid.dataset.data.splice(grid.dataset.recNo, 1);
								// $(grid.dataset.data).remove(grid.dataset.recNo);
								
								grid.dataset.gotoKey(id); // go to the destination row
								grid.dataset.recNo++; // move pointer 1 row down
								while (grid.dataset.get("parent_id") == id) {
									grid.dataset.recNo++;
								};
								
								// grid.dataset.data.splice(grid.dataset.recNo+1, 0, moveRow);
								grid.dataset.data.splice(grid.dataset.recNo, 0, moveRow);
								*/
								
								// grid.refresh(false, function() {
									// grid.painter.focusRow(drag.sourceId);
								// });
								if (id != drag.sourceId) {
									desktop.Ajax(
										self, 
										"/app/api/command/move-schedule-item",
										{
											id: drag.sourceId,
											position: 0,
											parent_id: id
										}, 
										function(result) {
											if (result.status == 0) {
												grid.refresh(false, function() {
													grid.painter.focusRow(drag.sourceId);
												});
											} else {
												// ErrorDialog({
													// target: column.element,
													// title: "Error adding diagnosis",
													// message: result.message
												// });
											}
										}
									)
								}
								
								// grid.refresh(true);
								// grid.painter.focusRow(drag.sourceId);
							}
						});
					}
					
					if(grid.dataset.get("parent_id") != 0)  {
					// if(true)  {
						// var position = params.addIcon({icon:"unfold-more", name:"position"})
						var position = params.addIcon({icon:"drag-vertical", name:"position"})
						
						new jResize({
							owner:grid, 
							sizer:position,
							orientation: "move",
							initDrag: function(drag, e) {
								$("body").addClass("moving");
								
								drag.sourceId = parseInt($(e.target).closest("tr").attr("row-id"));
								grid.dataset.gotoKey(drag.sourceId);
								drag.parentId = grid.dataset.get("parent_id");
								drag.name = grid.dataset.raw("benefit_name");
								
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
								var name = grid.dataset.lookup(id, "benefit_name");
								var itemNo = grid.dataset.lookup(id, "item_no");
								
								drag.targetId = id;
								
								var off = row.offset();
								var pos = $(e.target).position();
								var height = row.height();
								var ypos = e.pageY-off.top;
								
								if (e.shiftKey) {
									drag.action = 0;
									drag.hint.attr("x-mode", "move");
									drag.hint.html(("Move {0} under {1}").format(drag.name, name));
								// } else if (ypos < height/2+1) {
									// drag.hint.html("move before ....");
								// } else if (ypos > height/2) {
									// drag.hint.html("move after ....");
								} else {
									drag.action = 1;
									drag.hint.attr("x-mode", "position");
									// drag.hint.html(("Move to {0}. {1}").format(itemNo, drag.name))
									drag.hint.html(("Move {0} to position {1} under {2}").format(drag.name, itemNo, grid.dataset.lookup(parentId, "benefit_name")))
								}
								
								// drag.hint.html(("left:{0},top:{1},height:{2},y:{3}").format(pos.left, pos.top, height, ypos);
								// drag.hint.html(("pageX:{0},pageY:{1},left:{2},top:{3},left:{4},top:{5}").format(e.pageX, e.pageY, off.left, off.top, pos.left, pos.top);
								
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
								
								// var row = $(e.target).closest("tr");
								// var id = parseInt(row.attr("row-id"));
								// position.removeAttr("moving");
								
								// grid.dataset.gotoKey(id); // go to the destination row
								grid.dataset.gotoKey(drag.targetId); // go to the destination row
								
								grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='move']").css("pointer-events", "");
								grid.painter.mainContainer.find("div[tree-sec='icon'][icon-name='position']").css("pointer-events", "");

								// return;
								// if (id && id != drag.sourceId) {
								if (drag.targetId) {
									desktop.Ajax(
										self, 
										"/app/api/command/move-schedule-item",
										{
											id: drag.sourceId,
											target_id: drag.targetId,
											action: drag.action
											// position: grid.dataset.get("item_no"),
											// parent_id: 0
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
					}
					
					if(grid.dataset.get("has_limit")) 
						params.addIcon({icon:"limits", name:"limit"})
					else 
						params.addIcon({icon:"limits", name:"no-limit"});
					
					if(grid.dataset.get("has_benefits")) 
						params.addIcon({icon:"schedule-benefits", name:"benefits"})
					else 
						params.addIcon({icon:"schedule-benefits", name:"no-benefits"})
					
					if(grid.dataset.get("has_exclusions")) 
						params.addIcon({icon:"schedule-exclusions", name:"exclusions"})
					else 
						params.addIcon({icon:"schedule-exclusions", name:"no-exclusions"})
				});

				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Item",
						message: ("Please confirm to delete item <b>{0}</b>.").format(grid.dataset.raw("benefit_name"))
					};
				});

				grid.methods.add("allowCommand", function(grid, column) {
					if(column.command === "edit") {
						return grid.dataset.get("parent_id") > 0
					} else if(column.command === "delete") {
						return grid.dataset.get("parent_id") > 0
					} else {
						return true
					}
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "benefit_name", width: 600, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "id", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "parent_id", width: 100, allowSort: false, fixedWidth:true});
					// grid.NewColumn({fname: "sort", width: 100, allowSort: false, fixedWidth:true});
				});
				
				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
					new jPageControl({
						paintParams: {
							theme: "sob",
							fullBorder: true,
							icon: {
								size: 18,
								position: "left",
								name: "view-list",
								color: "dimgray"
							}
						},
						indent: 0,
						container: params.container,
						init: function(pg) {
							pg.addTab({caption:"Limits",
								icon: {
									name: "limits",
									color: "forestgreen"
								},
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									LimitsView({
										container: tab.container,
										requestParams: {
											service_id: grid.dataset.getKey()
										}
									})
								}
							});
							pg.addTab({caption:"Eligibles",
								icon: {
									name: "schedule-benefits",
									color: "dodgerblue"
								},
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									ScheduleEligiblesView({
										container: tab.container,
										requestParams: {
											service_id: grid.dataset.getKey()
										}
									})
								}
							});
							pg.addTab({caption:"Exclusions",
								icon: {
									name: "schedule-exclusions",
									color: "firebrick"
								},
								OnCreate: function(tab) {
									tab.container.addClass("master-detail-tab");
									ScheduleExclusionsView({
										container: tab.container,
										requestParams: {
											service_id: grid.dataset.getKey()
										}
									})
								}
							});
						}
					});
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
