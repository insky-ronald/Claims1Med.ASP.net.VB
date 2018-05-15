// ****************************************************************************************************
// Last modified on
// 12:20 PM Friday, October 6, 2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-breakdown.js
//==================================================================================================
var serviceBreakdownView, pgServiceBreakdown, gridServiceBreakdown;

function ServiceBreakdownContainer(params){
	pgServiceBreakdown = new jPageControl({
		paintParams: {
			theme: "service-breakdown",
			icon: {
				size: 22,
				position: "left"
			}
		},
		container: params.container,
		init: function(pg) {
			pg.addTab({caption:"Breakdown",
				icon: {
					name: "view-list",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					serviceBreakdownView = ServiceBreakdownView({container:tab.container, serviceID:params.requestParams.service_id});
				}
			});
			pg.addTab({caption:"Eligibles",
				icon: {
					name: "eligible",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					new UpdateBreakdownView({container:tab.container, serviceID:params.requestParams.service_id, section:0});
				}
			});
			pg.addTab({caption:"Exclusions",
				icon: {
					name: "exclusion",
					color: "firebrick"
				},
				OnCreate: function(tab) {
					new UpdateBreakdownView({container:tab.container, serviceID:params.requestParams.service_id, section:1});
				}
			});
		}
	});
};

function ServiceBreakdownView(params){
	var serviceID = params.serviceID;

	gridServiceBreakdown = new jGrid($.extend(params, {
		paintParams: {
			css: "breakdown",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			if (dialog.Dataset.get("is_detail")) {
				ServiceItemEdit({
					id: dialog.Dataset.get("item_id"),
					container: container,
					dialog: dialog
				})
			} else {
				dialog.Hide();
			}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/service-breakdown";
				grid.options.horzScroll = true;
				grid.options.showSummary = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = true;

				grid.options.viewType = "treeview";
				grid.options.treeViewSettings.keyColumnName = "id";
				grid.options.treeViewSettings.parentColumnName = "parent_id";
				grid.options.treeViewSettings.columnName = "benefit_name";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", serviceID, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("item_id", {numeric:true})
						.setprops("detail_id", {label:"ID", numeric:true})
						.setprops("benefit_name", {label:"Description"})
						.setprops("benefit_code", {label:"Code"})
						.setprops("diagnosis_code", {label:"Diagnosis"})
						.setprops("status_code", {label:"Status"})
						.setprops("currency_code", {label:"Ccy"})
						.setprops("estimate", {label:"Estimate", numeric:true, type:"money", format:"00"})
						.setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("breakdown", {label:"Breakdown", numeric:true, type:"money", format:"00"})
						.setprops("units", {label:"Units", numeric:true, type:"money", format:"0"})
						.setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
						.setprops("ex_gratia", {label:"Ex-Gratia", numeric:true, type:"money", format:"00"})
						.setprops("declined_amount", {label:"Declined", numeric:true, type:"money", format:"00"})
						.setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
				});

				grid.Events.OnInitSubData.add(function(grid, params) {
					if(params.index === 1) {
						if(grid.footerData) {
							grid.footerData.resetData(params.rawData)
						} else {
							grid.footerData = new Dataset(params.rawData, "Footer Data");
						}

						grid.footerData.Columns
							.setprops("estimate", {label:"Estimate", numeric:true, type:"money", format:"00"})
							.setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
							// .setprops("breakdown", {label:"Breakdown", numeric:true, type:"money", format:"00"})
							.setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
							.setprops("ex_gratia", {label:"Ex-Gratia", numeric:true, type:"money", format:"00"})
							.setprops("declined_amount", {label:"Declined", numeric:true, type:"money", format:"00"})
							.setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
					}
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					row.attr("detail", grid.dataset.get("is_detail") ? 1: 0);
					row.attr("breakdown", grid.dataset.get("is_breakdown") ? 1: 0);
					row.attr("novalidate", grid.dataset.get("is_novalidate") ? 1: 0);
					row.attr("recovery", grid.dataset.get("is_recover") ? 1: 0);
					row.attr("exclusion", grid.dataset.get("is_exclusion") ? 1: 0);
					row.attr("detail-id", grid.dataset.get("detail_id"));
					row.attr("status", grid.dataset.get("status_code"));
				});

				grid.Events.OnTreeViewButtons.add(function(grid, params) {
					// if(grid.dataset.get("type") === "L") {
						// params.addIcon({icon:"limit", name:"limit"})
					// } else
						// params.addIcon({icon:"folder-outline", name:"benefit"})
				});

				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Item",
						message: ("Please confirm to delete item <b>{0}</b>.").format(grid.dataset.get("benefit_name"))
					};
				});

				grid.methods.add("allowCommand", function(grid, column) {
					if(column.command === "edit") {
						return grid.dataset.get("is_detail") && !grid.dataset.get("is_breakdown")
					} else if(column.command === "delete") {
						return grid.dataset.get("is_detail") && !grid.dataset.get("is_breakdown")
					} else {
						return true
					}
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "Benefit", fixed:"left"}, function(band) {
						band.NewColumn({fname: "benefit_name", width: 350, allowSort: false, fixedWidth:true});
					});

					grid.NewBand({caption: ""}, function(band) {
						band.NewColumn({fname: "benefit_code", width: 75});
						// band.NewColumn({fname: "diagnosis_code", width: 75});
						// band.NewColumn({fname: "status_code", width: 100});
					});

					grid.NewBand({caption: "Amounts"}, function(band) {
						band.NewColumn({fname: "estimate", width: 100, showFooter: true});
						band.NewColumn({fname: "currency_code", width: 50});
						band.NewColumn({fname: "actual_amount", width: 100, showFooter: true});
						band.NewColumn({fname: "breakdown", width: 100});
						band.NewColumn({fname: "units", width: 75});
						band.NewColumn({fname: "approved_amount", width: 100, showFooter: true});
						band.NewColumn({fname: "ex_gratia", width: 100, showFooter: true});
						band.NewColumn({fname: "declined_amount", width: 100, showFooter: true});
						band.NewColumn({fname: "deductible", width: 100, showFooter: true});
					})
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					toolbar.NewItem({
						id: "validate",
						icon: "approval",
						// iconColor: "#8DCF6E",
						iconColor: "dodgerblue",
						hint: "Validate",
						// dataBind: grid.dataset,
						// dataEvent: function(dataset, button) {
							// button.show(dataset.editing);
						// },
						click: function(item) {
							grid.painter.showBusy(true);
							desktop.Ajax(
								self, 
								"/app/api/command/validate-service",
								{
									id: desktop.dbService.get("id")
								}, 
								function(result) {
									grid.painter.showBusy(false);
									if (result.status == 0) {
										grid.refresh();
									} else {
										ErrorDialog({
											target: item.elementContainer,
											title: "Error during validation",
											message: result.message
										});
									}
								}
							)
						}
					});
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
	
	return gridServiceBreakdown;
};

function UpdateBreakdownView(params) {
	var section = params.section;
	var serviceID = params.serviceID;
	var inlineNavigator;
	var url = "service-breakdown-update?section="+section;

	return new jGrid($.extend(params, {
		paintParams: {
			css: "breakdown-update-"+section,
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			inlineNavigator = new InlineEditNavigator({grid:grid});

			grid.Events.OnAfterPaint.add(function(grid) {
				// inlineNavigator.gridReady();
			});

			grid.Events.OnInit.add(function(grid) {
				// console.log(grid.painter.mainContainer)
				grid.optionsData.url = url;
				grid.options.horzScroll = true;
				// grid.options.showSummary = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;

				grid.options.viewType = "treeview";
				grid.options.treeViewSettings.keyColumnName = "id";
				grid.options.treeViewSettings.parentColumnName = "parent_id";
				grid.options.treeViewSettings.columnName = "benefit_name";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", serviceID, {numeric:true})
						.addColumn("section", section, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("service_id", {label:"ID", numeric:true})
						.setprops("benefit_code", {label:"Code"})
						.setprops("benefit_name", {label:"Description"})
						.setprops("currency_code", {label:"Ccy"})
						.setprops("amount", {label:"Amount", numeric:true, type:"money", format:"00"})
						.setprops("units", {label:"Units", numeric:true, type:"money", format:"0"})
						.setprops("unit_name", {label:"Unit Name",
							getText: function(column, value) {
								return column.dataset.get("units_required") ? value: ""
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					row.attr("detail", grid.dataset.get("is_detail") ? 1: 0);
					row.attr("exists", grid.dataset.get("is_include") ? 1: 0);
					row.attr("units-required", grid.dataset.get("units_required") ? 1: 0);
					// row.attr("novalidate", grid.dataset.get("is_novalidate") ? 1: 0)
					// row.attr("exclusion", grid.dataset.get("is_exclusion") ? 1: 0)
					// row.attr("detail-id", grid.dataset.get("detail_id"))
					// row.attr("status", grid.dataset.get("status_code"))
				});

				grid.Events.OnTreeViewButtons.add(function(grid, params) {
					// if(grid.dataset.get("type") === "L") {
						// params.addIcon({icon:"limit", name:"limit"})
					// } else
						// params.addIcon({icon:"folder-outline", name:"benefit"})
				});

				// grid.methods.add("allowCommand", function(grid, column) {
					// if(column.command === "edit")
						// return grid.dataset.get("is_detail")
					// else if(column.command === "delete")
						// return grid.dataset.get("is_detail")
					// else
						// return true
				// })

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "Benefit", fixed:"left"}, function(band) {
						band.NewColumn({fname: "benefit_name", width: 400, allowSort: false, fixedWidth:true});
					});

					grid.NewBand({caption: "Details"}, function(band) {
						band.NewColumn({fname: "amount", width: 150, drawContent: function(cell) {
								if(grid.dataset.get("is_detail"))  {
									inlineNavigator.add({cell:cell, field:"amount"});
								}
							}
						});

						band.NewColumn({fname: "currency_code", width: 50});
						if(section == 0) {
							band.NewColumn({fname: "units", width: 75,
								drawContent: function(cell) {
									if(grid.dataset.get("is_detail") && grid.dataset.get("units_required"))  {
										inlineNavigator.add({cell:cell, field:"units"});
									}
								}
							});
							band.NewColumn({fname: "unit_name", width: 150});
						};
					});
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.NewItem({
						// id: "test",
						// icon: "refresh",
						// iconColor: "firebrick",
						// hint: "Test refresh from local data",
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
							// grid.painter.showBusy(false);
							// grid.refresh(true);
						// }
					// });

					toolbar.NewItem({
						id: "cancel",
						icon: "db-cancel",
						iconColor: "firebrick",
						hint: "Cancel edit",
						dataBind: grid.dataset,
						dataEvent: function(dataset, button) {
							button.show(dataset.editing);
						},
						click: function(item) {
							$(item.dataBind.delta).each(function(i, rec) {
								if(item.dataBind.gotoKey(rec.id)) {
									item.dataBind.data[item.dataBind.recNo].units = rec.units;
									item.dataBind.data[item.dataBind.recNo].amount = rec.amount;
									item.dataBind.data[item.dataBind.recNo].is_include = rec.is_include;
									
									// [item.dataBind.recNo]
								};
							});
							
							$(inlineNavigator.editors).each(function(i, editor) {
								editor.dataset.recNo = editor.recNo;
								editor.cell.html(editor.dataset.text(editor.name));
								editor.cell.parent().attr("exists", editor.dataset.get("is_include") ? 1: 0);
							});
							
							item.dataBind.clearDelta();
							item.dataBind.setEditing(false);
							
							// grid.refresh(true);
						}
					});

					toolbar.NewItem({
						id: "save",
						// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
						icon: "db-save",
						iconColor: "#1CA8DD",
						hint: "Save",
						dataBind: grid.dataset,
						dataEvent: function(dataset, button) {
							button.show(dataset.editing);
						},
						click: function(item) {
							pgServiceBreakdown.tabs[0].show();
							gridServiceBreakdown.painter.showBusy(true);
							// grid.painter.showBusy(true);
							var updateData = [];
							$(item.dataBind.delta).each(function(i, rec) {
								if(item.dataBind.gotoKey(rec.id)) {
									var p = {};
									// for (var prop in rec) {
										// p[prop] = item.dataBind.raw(prop);
									// };

									p.service_id = rec.service_id;
									p.schedule_id = rec.schedule_id;
									p.benefit_code = rec.benefit_code;
									p.diagnosis_code = rec.diagnosis_code;
									p.is_split = rec.is_split;
									// p.id = parseInt(item.dataBind.raw("item_id"));
									p.id = parseInt(item.dataBind.raw("claim_id"));
									p.units = parseFloat(defaultValue(item.dataBind.raw("units"), 0));
									p.amount = parseFloat(item.dataBind.raw("amount"));

									updateData.push(p);
								};
							});

							item.dataBind.clearDelta();
							item.dataBind.setEditing(false);

							// console.log(pgServiceBreakdown)
							// pgServiceBreakdown.tabs[0].show();
							
							desktop.Ajax(grid, ("/app/get/update-items/{0}").format(url), {
								section: section,
								updateData: JSON.stringify(updateData)
							},
							function(data) {
								// grid.painter.showBusy(false);
								// pgServiceBreakdown.tabs[0].show();
								gridServiceBreakdown.painter.showBusy(false);
								serviceBreakdownView.refresh();
								grid.refresh(true);
							});
						}
					});

					toolbar.SetVisible("cancel", false);
					toolbar.SetVisible("save", false);
				});
			})
		}
	}));
};

function EditCell(params) {
	this.navigator = params.navigator;
	this.grid = params.grid;
	this.cell = params.cell;
	this.dataset = params.grid.dataset;
	this.field = params.field;
	this.name = params.field;
	this.recNo = params.grid.dataset.recNo;
	this.id = params.grid.dataset.getKey();
	this.editable = false;
	this.editing = false;
	this.nextEditor;
	this.prevEditor;
};

EditCell.prototype.next = function() {
	if (this.nextEditor) {
		this.nextEditor.select();
	}
};

EditCell.prototype.prev = function() {
	if (this.prevEditor) {
		this.prevEditor.select();
	}
};

EditCell.prototype.kill = function() {
	
	this.dataset.recNo = this.recNo;
	var val = parseFloat(this.input.val());	
	if(val !== this.dataset.get(this.name)) {
		this.dataset.set(this.name, val);
		if(this.dataset.get("amount") || this.dataset.get("units"))  {
			this.dataset.set("is_include", 1)
		} else {
			this.dataset.set("is_include", 0)
		};

		this.cell.parent().attr("exists", this.dataset.get("is_include") ? 1: 0)
	};
	
	this.editing = false;
	this.cell.attr("editing", 0);
	this.cell.html(this.dataset.text(this.name));

	this.input.remove();
};

EditCell.prototype.select = function() {
	var self = this;
	if(this.navigator.current) {
		this.navigator.current.kill();
	};
	// console.log(this.recNo)
	this.navigator.current = this;
	// this.grid.painter.focusRow(this.cell.parent().attr("row-id"));
	this.editing = true;
	this.cell
		.attr("editing", 1)
		.html("");
		
	this.input = CreateElementEx("input", this.cell, function(input) {
		self.cell.data("input", input);

		input
			.attr("inline-editor", "1")
			.data("cell", self.cell)
			.data("name", self.cell.data("name"))
			.data("dataset", self.cell.data("dataset"))
			.data("recNo", self.cell.data("recNo"))
			.on("keyup", function(e) {
				if(e.keyCode == 13) {
					// console.log(self)
					self.next();
					e.preventDefault();
				}
			})
			.on("keydown", function(e) {
				if(e.keyCode == 40) {
					self.next();
					e.preventDefault();
				} else if(e.keyCode == 38) {
					self.prev();
					e.preventDefault();
				}
			})
			.blur(function() {
				// console.log("OK")
				self.kill();
			})
			.val(self.dataset.get(self.name, self.recNo))
			.select()
	});
};

function InlineEditNavigator(params) {
	this.grid = params.grid;
	this.cells = [];
	this.editors = [];
	this.current;
	
	this.next;
	this.prev;
	this.counter = 0;
};

// InlineEditNavigator.prototype.gridReady = function(params) {
	// var self = this;
	// this.grid.painter.mainContainer.click(function() {
		// if(!($(event.target).is("td[editable='1']") || $(event.target).is("input[inline-editor='1']"))) {
			// self.hideEditor();
		// }
	// });
// };

// InlineEditNavigator.prototype.hideEditor = function() {
	// if(this.current) {
		// this.kill(this.current);
		// this.current = undefined;
	// };
// };

InlineEditNavigator.prototype.add = function(params) {
	// if (!this.grid.dataset.get("is_detail")) {
		// console.log("ok")
		// return;
	// }
	
	var self = this;
		
	params.cell
		.attr("field", params.field)
		.attr("editing", 0)
		.attr("editable", 1)
		.data("name", params.field)
		.data("dataset", this.grid.dataset)
		.data("recNo", this.grid.dataset.recNo)
		// .data("next", this.next)
		// .data("prev", this.prev)
		.html(this.grid.dataset.text(params.field))
		.click(function() {
			var editor = $(this).data("editor");
			if(!editor.editing) {
				editor.select()
			} else {
				event.preventDefault();
			}
			// if(!parseInt($(this).attr("editing"))) {
				// self.select($(this))
			// } else {
				// event.preventDefault();
			// }
		})
	
	var editor = new EditCell({
		navigator: this,
		grid: this.grid,
		cell: params.cell,
		field: params.field
	});
	params.cell.data("editor", editor);
	
	var prev, prev2;
	
	if (this.counter) {		
		prev = this.cells[this.counter-1];		
		prev.data("next", params.cell);
		
		prev2 = this.editors[this.counter-1];		
		prev2.nextEditor = editor;
	};
	
	this.counter++;
	params.cell.data("prev", prev);
	editor.prevEditor = prev2;
	
	this.cells.push(params.cell);
	this.editors.push(editor);
};

// InlineEditNavigator.prototype.select = function(cell) {
	// var self = this;
	// if(this.current) {
		// this.kill(this.current);
	// }

	// this.current = cell;
	// this.grid.painter.focusRow(cell.parent().attr("row-id"));

	// cell
		// .attr("editing", 1)
		// .html("");

	// CreateElementEx("input", cell, function(input) {
		// cell.data("input", input);

		// input
			// .attr("inline-editor", "1")
			// .data("cell", cell)
			// .data("name", cell.data("name"))
			// .data("dataset", cell.data("dataset"))
			// .data("recNo", cell.data("recNo"))
			// .on("keyup", function(e) {
				// if(e.keyCode == 13) {
					// self.next();
					// e.preventDefault();
				// }
			// })
			// .on("keydown", function(e) {
				// if(e.keyCode == 40) {
					// self.next();
					// e.preventDefault();
				// } else if(e.keyCode == 38) {
					// self.prev();
					// e.preventDefault();
				// }
			// })
			// .val(self.grid.dataset.get(cell.data("name"), cell.data("recNo")))
			// .select()
	// });
// };

// InlineEditNavigator.prototype.kill = function(cell) {
	// var name = cell.data("name");
	// var dataset = cell.data("dataset");
	// var recNo = cell.data("recNo");
	// var input = cell.data("input");

	// var val = parseFloat(input.val());
	// if(val !== dataset.get(name, recNo)) {
		// dataset.set(name, val, recNo);
		// if(dataset.get("amount", recNo) || dataset.get("units", recNo))  {
			// dataset.set("is_include", 1, recNo)
		// } else {
			// dataset.set("is_include", 0, recNo)
		// };

		// cell.parent().attr("exists", dataset.get("is_include", recNo) ? 1: 0)
	// };

	// cell.attr("editing", 0);
	// cell.html(dataset.text(name, recNo));

	// input.remove();
// };

// InlineEditNavigator.prototype.next = function() {
	// if (this.current.data("next")) {
		// this.select(this.current.data("next"));
	// }
	// var next, row = this.current.parent();
	// if(this.current.data("name") == "amount") {
		// next = row.find(".data-cell[field='units']");
		// if(!next.is("td")) {
			// row = row.next("tr");
			// next = row.find(".data-cell[field='amount']");
			// if(!next.is("td")) {
				// while(row.is("tr")) {
					// row = row.next("tr");
					// next = row.find(".data-cell[field='amount']");
					// if(next.is("td")) {
						// break;
					// }
				// };
			// };
		// };
	// } else {
		// next = row.next("tr").find(".data-cell[field='amount']");
	// };


	// if(next.is("td")) {
		// this.select($(next))
	// } else {
		// this.hideEditor()
	// }
// };

// InlineEditNavigator.prototype.prev = function() {
	// if (this.current.data("prev")) {
		// this.select(this.current.data("prev"));
	// }
	// var prev, row = this.current.parent();
	// if(this.current.data("name") == "amount") {
		// prev = row.prev().find(".data-cell[field='units']");
		// if(!prev.is("td")) {
			// row = row.prev("tr");
			// prev = row.find(".data-cell[field='amount']");
			// if(!prev.is("td")) {
				// while(row.is("tr")) {
					// row = row.prev("tr");
					// prev = row.find(".data-cell[field='amount']");
					// if(prev.is("td")) {
						// break;
					// }
				// };
			// };
		// };
	// } else {
		// prev = row.find(".data-cell[field='amount']");
	// };

	// if(prev.is("td")) {
		// this.select($(prev))
	// } else {
		// this.hideEditor();
	// }
// };
