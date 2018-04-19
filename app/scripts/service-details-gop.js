// ****************************************************************************************************
// Last modified on
// 28-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: service-details.js
//==================================================================================================
function InitializeData(service, serviceData) {
	service.Columns
		.setprops("claim_currency_code", {readonly:true})

	serviceData.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
		.setprops("provider_id", {label:"", numeric:true})
		.setprops("provider_name", {label:"Hospital's Name", required:true})
		.setprops("hospital_medical_record", {label:"Medical Record #"})
		.setprops("doctor_id", {label:"", numeric:true})
		.setprops("doctor_name", {label:"Physician's Name"})
		.setprops("provider_contact_person", {label:"Attention To"})
		.setprops("provider_fax_no", {label:"Fax No."})
		.setprops("start_date", {label:"Admission Date", type:"date", required:true})
		.setprops("end_date", {label:"Discharge Date", type:"date"})
		.setprops("claim_currency_code", {label:"Currency", required:true})
		.setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
		.setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
		.setprops("length_of_stay", {label:"Length of Stay", numeric:true, readonly:true})
		
	desktop.dbEstimates = new Dataset(desktop.customData.estimates)
	desktop.dbCalculationDates = new Dataset(desktop.customData.calculation_dates)
};

function ServiceDetailsView(viewParams) {
	viewParams.container.addClass("service-details");
	viewParams.dataset = desktop.dbService;
	
	return new CustomEditView(viewParams, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnRefresh.add(function(view, data) {
			// memberData.resetData(data.member_data, "", true);
		});
		
		view.Events.OnInitContent.add(function(view, container) {
			new jSplitContainer($.extend(viewParams, {
				paintParams: {
					css: "members"
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
								theme: "service-details",
								icon: {
									size: 20,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								pg.addTab({caption: "General",
									icon: {
										name: "view-list",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										new jSplitContainer($.extend(viewParams, {
											// paintParams: {
												// css: "members"
											// },
											container: tab.container,
											orientation: "horz",
											size: 50,
											usePercent: true,
											noBorder: true,
											init: function(splitter) {
												splitter.events.OnPaintPane1.add(function(splitter, container) {
													container.addClass("bordered-content");
													container.css("border-style", "solid solid solid none");
													ServiceCustomEdit({container: container, dataset:desktop.dbServiceSubType});
												});
												
												splitter.events.OnPaintPane2.add(function(splitter, container) {
													new jPageControl({
														paintParams: {
															theme: "service-details",
															icon: {
																size: 20,
																position: "left"
															}
														},
														container: container,
														init: function(pg) {
															pg.addTab({caption:"Admission/Discharge Calculation",
																icon: {
																	name: "view-list",
																	color: "forestgreen"
																},
																OnCreate: function(tab) {
																	tab.container.addClass("bordered-content");
																	tab.container.css("border-style", "solid solid none none");
																	CalculationDatesEdit({container: tab.container, dataset:desktop.dbCalculationDates});
																}
															});
															
															pg.addTab({caption:"Estimation of Cost and LOS",
																icon: {
																	name: "view-list",
																	color: "dodgerblue"
																},
																OnCreate: function(tab) {
																	tab.container.addClass("bordered-content");
																	tab.container.css("border-style", "solid solid none none");
																	EstimatesEdit({container: tab.container, dataset:desktop.dbEstimates});
																}
															});
															
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
										});
									}
								});
								pg.addTab({caption:"Diagnosis",
									icon: {
										name: "pill",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										// ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
								pg.addTab({caption:"Medical Procedures",
									icon: {
										name: "pill",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										// ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
								pg.addTab({caption:"Add Plan",
									icon: {
										name: "table-edit",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										// ClaimDiagnosisSummaryView({container:tab.container, claim_id:desktop.dbClaim.get("id")})
									}
								});
							}
						});
					});
					
					splitter.events.OnPaintPane2.add(function(splitter, container) {						
						new jPageControl({
							paintParams: {
								theme: "service-details",
								icon: {
									size: 20,
									position: "left"
								}
							},
							container: container,
							init: function(pg) {
								pg.addTab({caption:"GOP",
									icon: {
										name: "table-edit",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										tab.container.addClass("bordered-content");
										tab.container.css("border-style", "solid none none solid");
										ServiceEdit({container:tab.container, dataset:desktop.dbService});
									}
								});
								pg.addTab({caption:"Status History",
									icon: {
										name: "claim-status",
										color: "firebrick"
									},
									OnCreate: function(tab) {
										tab.container.addClass("bordered-content");
										tab.container.css("border-style", "solid none none solid");
										ServiceStatusView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})										
									}
								});
								pg.addTab({caption:"Actions",
									icon: {
										name: "calendar-blank",
										color: "forestgreen"
									},
									OnCreate: function(tab) {
										tab.container.addClass("bordered-content");
										tab.container.css("border-style", "solid none none solid");
										ServiceActionsView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})
									}
								});
							}
						});
					});
				}
			});
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
