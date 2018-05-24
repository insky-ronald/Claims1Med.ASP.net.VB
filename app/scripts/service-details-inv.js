// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: service-details-inv.js
// InvoiceView() is used in main-service.ashx
//==================================================================================================
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
													InvoiceCustomEdit({container: container, postBack: viewParams.postBack, dataset:desktop.dbService});
												});
												
												// if (!desktop.customData.newRecord) {
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
																		permission: {
																			view: desktop.customData.permissions.diagnosis.view && !desktop.customData.newRecord
																		},
																		OnCreate: function(tab) {
																			ServiceDiagnosisView({
																				action: "inv-diagnosis",
																				container:tab.container, 
																				requestParams:{
																					service_id: desktop.dbService.get("id")
																				}
																			});
																		}
																	});
																	pg.addTab({caption:"Medical Procedures",
																		icon: {
																			name: "procedure",
																			color: "firebrick"
																		},
																		permission: {
																			view: desktop.customData.permissions.procedure.view && !desktop.customData.newRecord
																		},
																		OnCreate: function(tab) {
																			ServiceProceduresView({
																				action: "inv-procedure",
																				container:tab.container, 
																				requestParams:{
																					service_id: desktop.dbService.get("id")
																				}
																			});
																		}
																	});
															}
														});
													});
												// }
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
								pg.addTab({caption:"Invoice",
									icon: {
										name: "details-edit",
										color: "dodgerblue"
									},
									OnCreate: function(tab) {
										InvoiceEdit({
											container:tab.container, 
											postBack: viewParams.postBack, 
											dataset:desktop.dbService
										});
									}
								});
								
								// if (!desktop.customData.newRecord) {
									pg.addTab({caption:"Payment",
										icon: {
											name: "invoice-payment",
											color: "dodgerblue"
										},
										OnCreate: function(tab) {
											PaymentEdit({container:tab.container, dataset:desktop.dbService, requestParams:{service_id:desktop.dbService.get("id")}})										
										}
									});
									
									pg.addTab({caption:"Status History",
										icon: {
											name: "claim-status",
											color: "firebrick"
										},
										permission: {
											view: desktop.customData.permissions.status.view && !desktop.customData.newRecord
										},
										OnCreate: function(tab) {
											ServiceStatusView({
												action: "inv-status",
												container:tab.container, 
												requestParams:{
													service_id: desktop.dbService.get("id")
												}
											})
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
								// }
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
				title: "Delete",
				subTitle: "Please confirm to delete guarantee of payment.",
				dataBind: desktop.dbService,
				dataEvent: function(dataset, button) {
					button.show(!dataset.editing);
				},
				permission: {
					view: desktop.canEdit && desktop.customData.permissions.service["delete"]
				},
				confirm: function() {
					
				}
			});
		});
	});
};
