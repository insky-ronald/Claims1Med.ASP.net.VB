// ****************************************************************************************************
// Last modified on
// 28-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: service-details-gop.js
//==================================================================================================
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

															// if (!desktop.customData.newRecord) {
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
																			action: "gop-diagnosis",
																			container:tab.container,
																			requestParams: {
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
																			action: "gop-procedure",
																			container:tab.container,
																			requestParams:{
																				service_id: desktop.dbService.get("id")
																			}
																		});
																	}
																});
															// }

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

								pg.addTab({caption:"Notes",
									icon: {
										name: "notes",
										color: "orange"
									},
									permission: {
										view: desktop.customData.permissions.notes.view && !desktop.customData.newRecord
									},
									OnCreate: function(tab) {
										ClaimNotesView({
											action: "gop-note",
											container:tab.container,
											requestParams: {
												type: "S",
												service_id: desktop.dbService.get("id"),
												claim_id: desktop.dbService.get("claim_id")
											}
										});
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
											action: "gop-status",
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
									permission: {
										view: desktop.customData.permissions.action.view && !desktop.customData.newRecord
									},
									OnCreate: function(tab) {
										ServiceActionsView({
											action: "gop-action",
											container:tab.container, 
											requestParams:{
												service_id: desktop.dbService.get("id")
											}
										})
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
