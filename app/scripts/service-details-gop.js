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

								if (!desktop.customData.newRecord) {
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
												action: desktop.serviceType + "-status",
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
								}
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

			// if (desktop.canEdit) {
			// var btnSendOutbox = toolbar.NewDropDownConfirmItem({
				// id: "send-outbox",
				// icon: "send-to-outbox",
				// color: "dodgerblue",
				// hint: "Send to outbox",
				// title: "Send to Outbox",
				// subTitle: "Please confirm to send guarantee of payment to outbox for authorisation.",
				// dataBind: desktop.dbService,
				// dataEvent: function(dataset, button) {
					// button.show(!dataset.editing);
				// },
				// permission: {
					// view: desktop.canEdit && desktop.customData.permissions.service.post
				// },
				// confirm: function() {
					// desktop.Ajax(
						// null,
						// "/app/api/command/send-to-outbox",
						// {
							// id: desktop.dbService.getKey()
						// },
						// function(result) {
							// if (result.status == 0) {
								// location.reload();
							// } else {
								// ErrorDialog({
									// target: btnSendOutbox.elementContainer,
									// title: "Error",
									// message: result.message
								// });
							// }
						// }
					// )
				// }
			// });

			// toolbar.SetVisible("send-outbox", !desktop.dbService.editing);
			// }

			if (desktop.status == "S" && desktop.subStatus == "S08") {
				// var btnReceived = toolbar.NewDropDownViewItem({
					// id: "invoice-received",
					// icon: "invoice-received",
					// color: "dodgerblue",
					// hint: "Invoice received",
					// title: "Invoice Received",
					// subTitle: "Please confirm to send guarantee of payment to outbox for authorisation.",
					// view: ServiceSubTypesLookup,
					// viewParams: {serviceType:"INV"},
					// select: function(code) {
						// desktop.Ajax(
							// null,
							// "/app/api/command/invoice-received",
							// {
								// id: desktop.dbService.getKey(),
								// type: code
							// },
							// function(result) {
								// if (result.status == 0) {
									// location.href = __service(result.id, "inv", true);
								// } else {
									// ErrorDialog({
										// target: btnReceived.elementContainer,
										// title: "Error",
										// message: result.message
									// });
								// }
							// }
						// )
					// }
				// });

				// toolbar.SetVisible("invoice-received", !desktop.dbService.editing);
			}

			// if (desktop.status == "S" && desktop.subStatus != "S02" && desktop.subStatus != "S03") {
				// var btnSupercede = toolbar.NewDropDownConfirmItem({
					// id: "supercede",
					// icon: "supercede-gop",
					// color: "forestgreen",
					// hint: "Supercede guarantee of payment",
					// title: "Supercede",
					// subTitle: "Please confirm to supercede guarantee of payment.",
					// dataBind: desktop.dbService,
					// dataEvent: function(dataset, button) {
						// button.show(!dataset.editing);
					// },
					// confirm: function() {
						// desktop.Ajax(
							// null,
							// "/app/api/command/gop-supercede",
							// {
								// id: desktop.dbService.getKey()
							// },
							// function(result) {
								// if (result.status == 0) {
									// location.href = __service(result.id, "gop", true);
								// } else {
									// ErrorDialog({
										// target: btnSupercede.elementContainer,
										// title: "Error",
										// message: result.message
									// });
								// }
							// }
						// )
					// }
				// });

				// toolbar.SetVisible("supercede", !desktop.dbService.editing);
			// }
		});
	});
};
