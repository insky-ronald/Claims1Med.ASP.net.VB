// ****************************************************************************************************
// Last modified on
// 28-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: service-details-gop.js
//==================================================================================================
function InitializeGop(dbService) {
	dbService.Columns
		.setprops("service_date", {label:"Date", type:"date", required:true})
		.setprops("provider_id", {label:"Hospital's Name", required:true,
			getText: function(column, value) {
				return column.dataset.get("provider_name")
			}
		})
		.setprops("doctor_id", {label:"Physician's Name", required:false,
			getText: function(column, value) {
				return column.dataset.get("doctor_name")
			}
		})
		.setprops("hospital_medical_record", {label:"Medical Record #"})
		.setprops("provider_contact_person", {label:"Attention To"})
		.setprops("provider_fax_no", {label:"Fax No."})
		.setprops("start_date", {label:"Admission Date", type:"date", required:true,
			onChange: function(column) {
				column.dataset.set("claim_currency_rate_date", column.raw())
			}
		})
		.setprops("end_date", {label:"Discharge Date", type:"date",
			onChange: function(column) {
				var start = column.dataset.asDate("start_date");
				var end = column.dataset.asDate("end_date");
				
				if (end) {
					var diff = Math.floor(Math.abs((start.getTime() - end.getTime())/(24*60*60*1000)));
				
					column.dataset.set("length_of_stay", diff+1);
				} else {
					column.dataset.set("length_of_stay", 0);
				}
			}
		})
		.setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
		.setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
		.setprops("length_of_stay", {label:"Length of Stay", numeric:true, readonly:true})
		.setprops("link_service_no", {label:"Received Invoice", readonly:true});
		
	desktop.dbEstimates = new Dataset(desktop.customData.estimates);
	desktop.dbCalculationDates = new Dataset(desktop.customData.calculation_dates);
};

function GopView(viewParams) {
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
													GopCustomEdit({container: container, dataset:desktop.dbService});
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
															
															if (!desktop.customData.newRecord) {
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
															}
															
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
										GopEdit({container:tab.container, dataset:desktop.dbService});
									}
								});
								
								if (!desktop.customData.newRecord) {
									pg.addTab({caption:"Status History",
										icon: {
											name: "claim-status",
											color: "firebrick"
										},
										OnCreate: function(tab) {
											ServiceStatusView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})										
										}
									});
									pg.addTab({caption:"Actions",
										icon: {
											name: "calendar-blank",
											color: "forestgreen"
										},
										OnCreate: function(tab) {
											ServiceActionsView({container:tab.container, requestParams:{service_id:desktop.dbService.get("id")}})
										}
									});
								}
							}
						});
					});
				}
			}));
		});
		
		view.Events.OnInitToolbar.add(function(view, toolbar) {
			if (desktop.canEdit) {
				toolbar.NewDropDownConfirmItem({
					id: "delete",
					icon: "delete",
					color: "firebrick",
					hint: "Delete guarantee of payment",
					title: "Delete",
					subTitle: "Please confirm to delete guarantee of payment.",
					dataBind: desktop.dbService,
					dataEvent: function(dataset, button) {
						button.show(!dataset.editing);
					},
					confirm: function() {
						
					}
				});
				
				toolbar.SetVisible("delete", !desktop.dbService.editing);
			}
			
			if (desktop.canEdit) {
				var btnSendOutbox = toolbar.NewDropDownConfirmItem({
					id: "send-outbox",
					icon: "send-to-outbox",
					color: "dodgerblue",
					hint: "Send to outbox",
					title: "Send to Outbox",
					subTitle: "Please confirm to send guarantee of payment to outbox for authorisation.",
					dataBind: desktop.dbService,
					dataEvent: function(dataset, button) {
						button.show(!dataset.editing);
					},
					confirm: function() {
						desktop.Ajax(
							null, 
							"/app/api/command/send-to-outbox",
							{
								id: desktop.dbService.getKey()
							}, 
							function(result) {
								if (result.status == 0) {
									location.reload();
								} else {
									ErrorDialog({
										target: btnSendOutbox.elementContainer,
										title: "Error",
										message: result.message
									});
								}
							}
						)
					}
				});
				
				toolbar.SetVisible("send-outbox", !desktop.dbService.editing);
			}		

			if (desktop.status == "S" && desktop.subStatus == "S08") {
				var btnReceived = toolbar.NewDropDownViewItem({
					id: "invoice-received",
					icon: "invoice-received",
					color: "dodgerblue",
					hint: "Invoice received",
					title: "Invoice Received",
					subTitle: "Please confirm to send guarantee of payment to outbox for authorisation.",
					view: ServiceSubTypesLookup,
					viewParams: {serviceType:"INV"},
					select: function(code) {
						desktop.Ajax(
							null, 
							"/app/api/command/invoice-received",
							{
								id: desktop.dbService.getKey(),
								type: code
							}, 
							function(result) {
								if (result.status == 0) {
									location.href = __service(result.id, "inv", true);
								} else {
									ErrorDialog({
										target: btnReceived.elementContainer,
										title: "Error",
										message: result.message
									});
								}
							}
						)
					}
				});
				
				toolbar.SetVisible("invoice-received", !desktop.dbService.editing);
			}		
			
			if (desktop.status == "S" && desktop.subStatus != "S02" && desktop.subStatus != "S03") {
				var btnSupercede = toolbar.NewDropDownConfirmItem({
					id: "supercede",
					icon: "supercede-gop",
					color: "forestgreen",
					hint: "Supercede guarantee of payment",
					title: "Supercede",
					subTitle: "Please confirm to supercede guarantee of payment.",
					dataBind: desktop.dbService,
					dataEvent: function(dataset, button) {
						button.show(!dataset.editing);
					},
					confirm: function() {
						desktop.Ajax(
							null, 
							"/app/api/command/gop-supercede",
							{
								id: desktop.dbService.getKey()
							}, 
							function(result) {
								if (result.status == 0) {
									location.href = __service(result.id, "gop", true);
								} else {
									ErrorDialog({
										target: btnSupercede.elementContainer,
										title: "Error",
										message: result.message
									});
								}
							}
						)
					}
				});
				
				toolbar.SetVisible("supercede", !desktop.dbService.editing);
			}		
		});
	});
};
