// ****************************************************************************************************
// Last modified on
// 28-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: service-details.js
//==================================================================================================
// function InitializeData(dbService, dbServiceCustom) {
function InitializeData(dbService) {
	// console.log({a:dbService, b:dbServiceCustom})
	dbService.Columns
	// dbServiceCustom.Columns
		// .setprops("claim_currency_code", {readonly:true})
		.setprops("provider_id", {label:"Hospital's Name", required:true, //lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.dataset.get("provider_name")
			}
		})
		.setprops("doctor_id", {label:"Physician's Name", required:true, //lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.dataset.get("doctor_name")
			}
		})
		// .setprops("provider_id", {label:"", numeric:true})
		// .setprops("provider_name", {label:"Hospital's Name", required:true})
		.setprops("hospital_medical_record", {label:"Medical Record #"})
		// .setprops("doctor_id", {label:"", numeric:true})
		// .setprops("doctor_name", {label:"Physician's Name"})
		.setprops("provider_contact_person", {label:"Attention To"})
		.setprops("provider_fax_no", {label:"Fax No."})
		.setprops("start_date", {label:"Admission Date", type:"date", required:true})
		.setprops("end_date", {label:"Discharge Date", type:"date"})
		// .setprops("claim_currency_code", {label:"Currency", required:true})
		.setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
		.setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
		.setprops("length_of_stay", {label:"Length of Stay", numeric:true, readonly:true});
		
	desktop.dbEstimates = new Dataset(desktop.customData.estimates);
	desktop.dbCalculationDates = new Dataset(desktop.customData.calculation_dates);
};

function ServiceDetailsView(viewParams) {
	viewParams.container.addClass("service-details");
	viewParams.dataset = desktop.dbService;
	viewParams.postBack = "app/service-gop"
	
	return new CustomEditView(viewParams, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnRefresh.add(function(view, data) {
			// memberData.resetData(data.member_data, "", true);
		});
		
		view.Events.OnInitContent.add(function(view, container) {
			new jSplitContainer($.extend(viewParams, {
				paintParams: {
					theme: "white-green-dark"
				},
				container: container,
				orientation: "vert",
				size: 50,
				usePercent: true,
				noBorder: true,
				init: function(splitter) {
					splitter.events.OnPaintPane1.add(function(splitter, container) {
						new jPageControl({
							paintParams: {
								css: "pg-service-detail",
								theme: "service-details",
								icon: {
									size: 20,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								// pg.addTab({caption: "General",
								pg.addTab({caption: desktop.customData.service_type_name,
									icon: {
										name: "details-edit",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										new jSplitContainer($.extend(viewParams, {
											paintParams: {
												theme: "white-green-dark"
											},
											container: tab.container,
											orientation: "horz",
											size: 50,
											usePercent: true,
											noBorder: true,
											init: function(splitter) {
												splitter.events.OnPaintPane1.add(function(splitter, container) {
													// container.addClass("bordered-content");
													// container.css("border-style", "solid none none none");
													ServiceCustomEdit({container: container, dataset:desktop.dbService});
													// ServiceCustomEdit({container: container, dataset:desktop.dbServiceSubType});
												});
												
												splitter.events.OnPaintPane2.add(function(splitter, container) {
													new jPageControl({
														paintParams: {
															css: "pg-service-detail",
															theme: "service-details",
															icon: {
																size: 20,
																position: "left"
															}
														},
														container: container,
														init: function(pg) {
															pg.addTab({caption:"Diagnosis",
																icon: {
																	name: "diagnosis",
																	color: "firebrick"
																},
																OnCreate: function(tab) {
																	ServiceDiagnosisView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}});
																}
															});
															pg.addTab({caption:"Medical Procedures",
																icon: {
																	name: "procedure",
																	color: "firebrick"
																},
																OnCreate: function(tab) {
																	ServiceProceduresView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}});
																}
															});
															// pg.addTab({caption:"Add Plan",
																// icon: {
																	// name: "table-edit",
																	// color: "forestgreen"
																// },
																// OnCreate: function(tab) {
																// }
															// });
															// pg.addTab({caption:"Admission/Discharge Calculation",
																// icon: {
																	// name: "view-list",
																	// color: "forestgreen"
																// },
																// OnCreate: function(tab) {
																	// CalculationDatesEdit({container: tab.container, dataset:desktop.dbCalculationDates});
																// }
															// });
															
															// pg.addTab({caption:"Estimation of Cost and LOS",
																// icon: {
																	// name: "view-list",
																	// color: "dodgerblue"
																// },
																// OnCreate: function(tab) {
																	// EstimatesEdit({container: tab.container, dataset:desktop.dbEstimates});
																// }
															// });
															
															pg.addTab({caption:"Remarks",
																icon: {
																	name: "notes",
																	color: "orange"
																},
																OnCreate: function(tab) {
																	
																}
															});
														}
													});
												});
											}
										}));
									}
								});
								
								// pg.addTab({caption:"Diagnosis",
									// icon: {
										// name: "pill",
										// color: "firebrick"
									// },
									// OnCreate: function(tab) {
									// }
								// });
								// pg.addTab({caption:"Medical Procedures",
									// icon: {
										// name: "pill",
										// color: "firebrick"
									// },
									// OnCreate: function(tab) {
									// }
								// });
								// pg.addTab({caption:"Add Plan",
									// icon: {
										// name: "table-edit",
										// color: "forestgreen"
									// },
									// OnCreate: function(tab) {
									// }
								// });
							}
						});
					});
					
					splitter.events.OnPaintPane2.add(function(splitter, container) {						
						new jPageControl({
							paintParams: {
								css: "pg-service-detail",
								theme: "service-details",
								icon: {
									size: 20,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								pg.addTab({caption:"Guarantee of Payment",
									icon: {
										name: "details-edit",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										// tab.container.addClass("bordered-content");
										// tab.container.css("border-style", "solid none none solid");
										ServiceEdit({container:tab.container, dataset:desktop.dbService});
									}
								});
								pg.addTab({caption:"Status History",
									icon: {
										name: "claim-status",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										// tab.container.addClass("bordered-content");
										// tab.container.css("border-style", "solid none none solid");
										ServiceStatusView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})										
									}
								});
								pg.addTab({caption:"Actions",
									icon: {
										name: "calendar-blank",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										// tab.container.addClass("bordered-content");
										// tab.container.css("border-style", "solid none none solid");
										ServiceActionsView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})
									}
								});
							}
						});
					});
				}
			}));
		});
		
		view.Events.OnInitToolbar.add(function(view, toolbar) {
			toolbar.NewDropDownConfirmItem({
				id: "delete",
				icon: "delete",
				color: "firebrick",
				hint: "Delete guarantee of payment",
				title: "Delete Guarantee of Payment",
				subTitle: "Please confirm to delete guarantee of payment.",
				dataBind: desktop.dbService,
				dataEvent: function(dataset, button) {
					button.show(!dataset.editing);
				},
				confirm: function() {
					
				}
			});
			
			toolbar.SetVisible("delete", !desktop.dbService.editing);
		});
	});
};
