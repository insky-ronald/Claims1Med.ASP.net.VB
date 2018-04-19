// ****************************************************************************************************
// Last modified on
// 17-AUG-2017
// ****************************************************************************************************
//==================================================================================================
// File name: customer-service.js
//==================================================================================================
function CustomerServiceView(params) {
	var membersSearchView;
	var dbCustomerService = params.dataset = new Dataset(desktop.customData.data, "Data");
	dbCustomerService.Events.OnSearch = new EventHandler(dbCustomerService);
	
	new jSplitContainer($.extend(params, {
		paintParams: {
			css: "customer-service"
		},
		container: params.container,
		orientation: "vert",
		size: 300,
		usePercent: false,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
				container.addClass("search-container");
				
				CreateElementEx("div", container, function(toolbar) {
					var toolbar = new JToolbar({
						container: toolbar,
						css: "toolbar",
						theme: "svg",
						buttonSize: 24
					});
					
					toolbar.NewItem({
						id: "search",
						icon: "search",
						iconColor: "#8DCF6E",
						hint: "Apply Search",
						// dataBind: dbCustomerService,
						// dataEvent: function(dataset, button) {
							// button.show(!dataset.editing);
						// },
						click: function(item) {
							dbCustomerService.Events.OnSearch.trigger();
						}
					});
					
					toolbar.NewItem({
						id: "clear",
						icon: "close",
						iconColor: "firebrick",
						hint: "Clear Search",
						// dataBind: view.dataset,
						// dataEvent: function(dataset, button) {
							// button.show(!dataset.editing);
						// },
						click: function(item) {
							// desktop.Ajax(self, $("#__callback").attr("value"), {action:"refresh"}, function(result) {
								// self.dataset.resetData(result.data, "", true);
								// self.Events.OnRefresh.trigger(result);
							// })
						}
					});
					
				}, "toolbar-container");
				
				CreateElementEx("div", container, function(content) {
					CustomerServiceEdit({
						container: content,
						dataset: params.dataset
					})
				}, "search-edit-container");
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				container.addClass("view-container");
				new jPageControl({
					paintParams: {
						theme: "customer-service-view",
						icon: {
							size: 24,
							position: "left",
							name: "search",
							color: "dimgray"
						}
					},
					container: container,
					init: function(pg) {
						pg.addTab({caption:"Members",
							OnCreate: function(tab) {
								new jSplitContainer($.extend(params, {
									paintParams: {
										css: "customer-service"
									},
									container: tab.container,
									orientation: "horz",
									size: 40,
									usePercent: true,
									noBorder: true,
									init: function(splitter) {
										splitter.events.OnPaintPane1.add(function(splitter, container) {
											container.addClass("master-container")
											membersSearchView = MembersSearchView({
												container: container,
												searchDataset: dbCustomerService,
												initView: function(grid) {
												}
											});
										});
										
										splitter.events.OnPaintPane2.add(function(splitter, container) {
											container.addClass("detail-container")
											new jPageControl({
												paintParams: {
													theme: "member-claims",
													icon: {
														size: 22,
														position: "left"
													}
												},
												container: container,
												init: function(pg) {
													pg.masterDetail2 = new jMasterDetailController({
														pg: pg,
														master: membersSearchView
													});
													
													pg.masterDetail = {
														pg: pg,
														init: function(master) {															
															this.details = [];
															this.master = master;
														},
														add: function(params) {
															params.tab.detailView = {
																tab: params.tab,
																master: params.tab.pg.masterDetail.master,
																init: params.init,
																setKey: params.setKey,
																sync: function() {
																	if((this.tab.active && this.currentKey !== this.master.dataset.getKey()) {
																		this.setKey(this.currentKey = this.master.dataset.getKey());
																		this.view.refresh();
																	};
																},
																initDetail: function() {
																	var self = this;
																	this.master.dataset.Events.OnMoveRecord.add(function(dataset) {
																		self.sync();
																	});
																},
																update: function() {
																	if(this.master.ready) {
																		if(!this.ready) {
																			this.ready = true;
																			this.init(this.currentKey = this.master.dataset.getKey());
																		} else if(!this.prepared) {
																			this.prepared = true;
																			var self = this;
																			this.master.dataset.Events.OnMoveRecord.add(function(dataset) {
																				self.sync();
																			});
																		} else
																			this.sync();
																			
																	} else {
																		if(!this.master.painted) {
																			var self = this;
																			this.master.events.OnAfterPaint.add(function(grid) {
																				if(!self.master.painted) {
																					self.master.painted = true;
																					self.ready = self.master.ready = true;
																					self.init(self.currentKey = self.master.dataset.getKey());
																				}
																			});
																		};
																	}
																}
															};
															
															this.details.push(params.tab.detailView);
														}
													};
													
													pg.masterDetail.init(membersSearchView);
													
													pg.addTab({caption:"Member's Claims",
														icon: {
															name: "user",
															color: "dimgray"
														},
														OnCreate: function(tab) {
															tab.pg.masterDetail.add({
																tab: tab, 
																init: function(keyID) {
																	var self = this;
																	this.view = MemberClaimsView({
																		member_id: keyID,
																		container: this.tab.container,
																		initView: function(grid) {
																			self.initDetail();
																		}
																	});
																},
																setKey: function(keyID) {
																	this.view.dataParams.set("member_id", keyID);
																}
															});
														},
														OnActivate: function(tab) {
															tab.detailView.update();
														}
													});
													pg.addTab({caption:"Customer Service",
														icon: {
															name: "customer-service",
															color: "dimgray"
														},
														OnCreate: function(tab) {
															tab.pg.masterDetail.add({
																tab: tab, 
																init: function(keyID) {
																	var self = this;
																	this.view = MemberClaimsView({
																		member_id: keyID,
																		container: this.tab.container,
																		initView: function(grid) {
																			self.update();
																		}
																	});
																},
																setKey: function(keyID) {
																	this.view.dataParams.set("member_id", keyID);
																}
															});
														},
														OnActivate: function(tab) {
															tab.detailView.update();
														}
													});
												}
											});
										});
									}
								});
							}
						});
						pg.addTab({caption:"Policies",
							OnCreate: function(tab) {
							}
						});
						pg.addTab({caption:"Customer Service",
							OnCreate: function(tab) {
							}
						});
						pg.addTab({caption:"Claims",
							OnCreate: function(tab) {
							}
						});
					}
				});
			});
		}
	});
};
