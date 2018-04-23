// ****************************************************************************************************
// Last modified on
// 05-OCT-2017
// ****************************************************************************************************
//==================================================================================================
// File name: member-case-history.js
//==================================================================================================
function MemberCaseHistoryView(params) {
	return new jGrid($.extend(params, {
		paintParams: {
			css: "case-history",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "member-case-history";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.options.showBand = false;
				grid.options.editNewPage = true;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("sort", "claim_no")
						.addColumn("order", "asc")
						.addColumn("member_id", params.requestParams.member_id)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("service_id", {label:"ID", numeric:true, key: true})
						.setprops("claim_no", {label:"Claim No."})
						.setprops("service_no", {label:"Reference No."})
						.setprops("service_type", {label:"Type"})
						.setprops("service_name", {label:"Service Name"})
						.setprops("case_status", {label:"Case Status"})
						.setprops("plan_code", {label:"Plan Code"})
						.setprops("provider_name", {label:"Provider"})
						.setprops("doctor_name", {label:"Physician's Name"})
						// .setprops("diagnosis", {label:"Diagnosis"})
						.setprops("diagnosis_list", {label:"Diagnosis"})
						.setprops("procedure_list", {label:"Procedures"})
						.setprops("start_date", {label:"Admission", type:"date"})
						.setprops("end_date", {label:"Discharge", type:"date"})
						.setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
						.setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
						.setprops("declined_amount", {label:"Declined", numeric:true, type:"money", format:"00"})
						.setprops("deductible_amount", {label:"Deductible", numeric:true, type:"money", format:"00"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("is_active"))
				});	
				
				grid.methods.add("getLinkUrl", function(grid, params) {
					// if(params.column.linkField === "id")
					if(params.column.linkField === "claim_id") {
						return __claim(params.id, true)
					} else if(params.column.linkField === "service_id") {
						return __service(params.id, grid.dataset.get("service_type").toLowerCase(), true)
					}
				});
				
				grid.methods.add("editPageUrl", function(grid, id) {
					return __service(id, grid.dataset.get("service_type").toLowerCase(), true)
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewBand({caption:"Document"}, function(band) {
					grid.NewColumn({fname: "claim_no", width: 100, fixedWidth:true, allowSort: true, linkField:"claim_id"});
					grid.NewColumn({fname: "service_type", width: 50, fixedWidth:true});
					grid.NewColumn({fname: "service_no", width: 150, fixedWidth:true, linkField:"service_id"});
					grid.NewColumn({fname: "case_status", width: 250, fixedWidth:true});
					grid.NewColumn({fname: "plan_code", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "provider_name", width: 250, fixedWidth:true});
					grid.NewColumn({fname: "doctor_name", width: 200, fixedWidth:true});
					grid.NewColumn({fname: "start_date", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "end_date", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "actual_amount", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "approved_amount", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "declined_amount", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "deductible_amount", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "service_name", width: 250, fixedWidth:true});
					
					grid.NewBand({caption: "Tags", fixed:"right"} , function(band) {
						band.NewColumn({fname: "diagnosis_list", width: 200, fixedWidth:true,
							drawContent: function(cell) {
								cell.addClass("diagnosis");
								var diagnosis = JSON.parse(grid.dataset.get("diagnosis_list"));
								$(diagnosis).each(function(i, a) {
									CreateElementEx("span", cell, function(item) {
										item.html(a.code);
										desktop.SetHint(item.data("hintTarget", item), a.diagnosis, "top")
									})
								})
							}
						});
						
						band.NewColumn({fname: "procedure_list", width: 200, fixedWidth:true,
							drawContent: function(cell) {
								cell.addClass("procedure");
								var diagnosis = JSON.parse(grid.dataset.get("procedure_list"));
								$(diagnosis).each(function(i, a) {
									CreateElementEx("span", cell, function(item) {
										item.html(a.code);
										desktop.SetHint(item.data("hintTarget", item), a.cpt, "top")
									})
								})
							}
						});
						// band.NewColumn({fname: "procedure_list", width: 200, fixedWidth:true});
					});
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(200);
					// new jPageControl({
						// paintParams: {
							// theme: "claim-services",
							// fullBorder: true,
							// icon: {
								// size: 18,
								// position: "left",
								// name: "view-list",
								// color: "dimgray"
							// }
						// },
						// indent: 0,
						// container: params.container,
						// init: function(pg) {
							// pg.addTab({caption:"Invoices",
								// OnCreate: function(tab) {
									// tab.container.addClass("master-detail-tab");
									// ListClaimServices({
										// container: tab.container,
										// requestParams: {
											// module: "inv",
											// claim_id: grid.dataset.getKey()
										// }
									// })
								// }
							// });
							// pg.addTab({caption:"Guarantee of Payments",
								// OnCreate: function(tab) {
									// tab.container.addClass("master-detail-tab");
									// ListClaimServices({
										// container: tab.container,
										// requestParams: {
											// module: "gop",
											// claim_id: grid.dataset.getKey()
										// }
									// })
								// }
							// });
						// }
					// });
				});
			});
		}
	}));
};
