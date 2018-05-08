// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: benefit-utilisation.js
//==================================================================================================
function BenefitUtilisationView(viewParams){
	new jPageControl({
		paintParams: {
			theme: "default",
			icon: {
				size: 22,
				position: "left"
			}
		},
		container: viewParams.container,
		init: function(pg) {
			pg.addTab({caption:"Normal",
				icon: {
					name: "authorisation",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					// new MemberBenefitUtilisationView({container:tab.container, requestParams: {member_id:viewParams.requestParams.member_id, type:1}});
					new MemberBenefitUtilisationView({container:tab.container, requestParams: {member_id:viewParams.requestParams.member_id, type:1}});
				}
			});
			pg.addTab({caption:"Per Year",
				icon: {
					name: "authorisation",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					new MemberBenefitUtilisationView({container:tab.container, requestParams: {member_id:viewParams.requestParams.member_id, type:2}});
					// new PaymentBatchingView({container:tab.container, requestParams: {referral:0}});
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
		}
	});
};

function MemberBenefitUtilisationView(params) {
	var type = params.requestParams.type;
	var memberID = params.requestParams.member_id;
	var url = "benefit-utilisation";

	return new jGrid($.extend(params, {
		paintParams: {
			css: "benefit-utilisation",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = url;
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;

				grid.options.viewType = "treeview";
				if (type == 1) {
					grid.options.treeViewSettings.keyColumnName = "SCHED_ID"
				} else {
					grid.options.treeViewSettings.keyColumnName = "ID"
				}
				grid.options.treeViewSettings.parentColumnName = "PARENT_ID";
				grid.options.treeViewSettings.columnName = "BENEFIT_NAME";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("id", memberID, {numeric:true})
						.addColumn("type", type, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					if (type == 1) {
						data.Columns.setprops("SCHED_ID", {numeric:true, key: true})
					} else {
						data.Columns.setprops("ID", {numeric:true, key: true})
					}
					
					data.Columns
						// .setprops("SCHED_ID", {numeric:true, key: true})
						.setprops("PARENT_ID", {numeric:true})
						.setprops("BENEFIT_NAME", {label:"Benefit"})
						.setprops("CRCY_CODE", {label:"Ccy"})
						.setprops("LIMIT", {label:"Max Amount", numeric:true, type:"money", format:"00"})
						.setprops("MAX_UNITS", {label:"Max Units", numeric:true, type:"money", format:"0"})
						.setprops("CLM_AMOUNT", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("APP_AMOUNT", {label:"Approved", numeric:true, type:"money", format:"00"})
						.setprops("APP_UNITS", {label:"Units", numeric:true, type:"money", format:"0"})
						// .setprops("units", {label:"Units", numeric:true, type:"money", format:"0"})
						// .setprops("unit_name", {label:"Unit Name",
							// getText: function(column, value) {
								// return column.dataset.get("units_required") ? value: ""
							// }
						// })
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					if (grid.dataset.get("PARENT_ID") == 0) {
						row.attr("x-main-plan", 1);
					}
					
					if (grid.dataset.get("PARENT_ID") > 0 && grid.dataset.get("ITEM_NO") == 0) {
						row.attr("x-period", 1);
					}
					
					if (grid.dataset.get("LIMIT")) {
						row.attr("x-limit", 1);
					}
					// 
					// row.attr("exists", grid.dataset.get("is_include") ? 1: 0);
					// row.attr("units-required", grid.dataset.get("units_required") ? 1: 0);
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
						band.NewColumn({fname: "BENEFIT_NAME", width: 300, allowSort: false, fixedWidth:true});
					});

					grid.NewBand({caption: "Details"}, function(band) {
						// band.NewColumn({fname: "amount", width: 150, drawContent: function(cell) {
								// if(grid.dataset.get("is_detail"))  {
									// inlineNavigator.add({cell:cell, field:"amount"});
								// }
							// }
						// });

						band.NewColumn({fname: "CRCY_CODE", width: 50});
						band.NewColumn({fname: "LIMIT", width: 150});
						band.NewColumn({fname: "MAX_UNITS", width: 150});
						band.NewColumn({fname: "CLM_AMOUNT", width: 150});
						band.NewColumn({fname: "APP_AMOUNT", width: 150});
						band.NewColumn({fname: "APP_UNITS", width: 150});
						// if(section == 0) {
							// band.NewColumn({fname: "units", width: 75,
								// drawContent: function(cell) {
									// if(grid.dataset.get("is_detail") && grid.dataset.get("units_required"))  {
										// inlineNavigator.add({cell:cell, field:"units"});
									// }
								// }
							// });
							// band.NewColumn({fname: "unit_name", width: 150});
						// };
					});
				});

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
				});
			})
		}
	}));
};
