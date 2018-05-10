// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: service-details-inv.js
//==================================================================================================
function InitializeInvoice(dbService) {
	dbService.Columns
		.setprops("provider_id", {label:"Hospital's Name", required:true, //lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.dataset.get("provider_name")
			}
		})
		.setprops("doctor_id", {label:"Physician's Name", required:false, //lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return column.dataset.get("doctor_name")
			}
		})
		// .setprops("hospital_medical_record", {label:"Medical Record #"})
		// .setprops("provider_contact_person", {label:"Attention To"})
		// .setprops("provider_fax_no", {label:"Fax No."})
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
		.setprops("room_type", {label:"Room Type"})
		.setprops("medical_type", {label:"Medical Type"})
		.setprops("accident_date", {label:"Accident Date", type:"date", readonly:true})
		.setprops("treatment_country_code", {label:"Country of Treatment", lookupDataset: desktop.dbCountries,
			getText: function(column, value) {
				return ("{0} ({1})").format(column.lookupDataset.lookup(value, "country"), value);
			// },
			// onChange: function(column) {
				// column.dataset.Events.OnGetExchangeRates.trigger();
			}
		})
		// .setprops("misc_expense", {label:"Hospital Expenses", numeric:true, type:"money", format:"00"})
		// .setprops("room_expense", {label:"Room & Board (per day)", numeric:true, type:"money", format:"00"})
		// .setprops("length_of_stay", {label:"Length of Stay", numeric:true, readonly:true});
};

function InvoiceView(viewParams) {
	viewParams.container.addClass("service-details");
	viewParams.dataset = desktop.dbService;
	viewParams.postBack = "app/service-invoice"
	
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
													InvoiceCustomEdit({container: container, dataset:desktop.dbService});
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
															
															// pg.addTab({caption:"Remarks",
																// icon: {
																	// name: "notes",
																	// color: "orange"
																// },
																// OnCreate: function(tab) {
																	
																// }
															// });
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
										InvoiceEdit({container:tab.container, dataset:desktop.dbService});
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
						// console.log(code.toLowerCase())
						// console.log(grid.dataParams.get("claim_id"))
						// window.open(__newservice(grid.dataParams.get("claim_id"), module, code, true), "");
					}
				});
				// var btnSendOutbox = toolbar.NewDropDownConfirmItem({
					// id: "invoice-received",
					// icon: "invoice-received",
					// color: "dodgerblue",
					// hint: "Invoice received",
					// title: "Invoice Received",
					// subTitle: "Please confirm to send guarantee of payment to outbox for authorisation.",
					// dataBind: desktop.dbService,
					// dataEvent: function(dataset, button) {
						// button.show(!dataset.editing);
					// },
					// confirm: function() {
					// }
				// });
				
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
									// __service(result.id, "gop");
									location.href = __service(result.id, "gop", true);
									// console.log(result)
									// console.log(__service(result.id, "gop"))
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
