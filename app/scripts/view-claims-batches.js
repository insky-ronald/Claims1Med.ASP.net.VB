function PaymentBatchesView(viewParams){	
	var batchesView;
	
	new jSplitContainer($.extend(viewParams, {
		paintParams: {
			theme: "white-green-dark"
		},
		container: viewParams.container,
		orientation: "horz",
		size: 50,
		usePercent: true,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
				batchesView = BatchesView($.extend(viewParams, {container:container}))
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				console.log(batchesView.grid)
				new jPageControl({
					paintParams: {
						theme: "member-claims",
						icon: {
							size: 22,
							position: "left"
						}
					},
					container: container,
					masterView: batchesView,
					init: function(pg) {
						pg.addTab({caption:"Payments",
							icon: {
								name: "user",
								color: "dodgerblue"
							},
							OnSetKey: function(detail, keyID) {
								detail.view.dataParams.set("batch_id", keyID);
								detail.view.refresh();
							},
							OnCreateMasterDetail: function(detail, keyID) {
								return new PaymentsByBatchView({
									batch_id: keyID,
									container: detail.tab.container
								});
							},
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
						
						pg.addTab({caption:"Breakdown 1",
							icon: {
								name: "user",
								color: "dodgerblue"
							},
							OnSetKey: function(detail, keyID) {
								detail.view.dataParams.set("batch_id", keyID);
								detail.view.refresh();
							},
							OnCreateMasterDetail: function(detail, keyID) {
								return new PaymentBreakdownByBatchView({
									batch_id: keyID,
									container: detail.tab.container
								});
							},
							OnCreate: function(tab) {
								tab.detail.update();
							},
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
						
						pg.addTab({caption:"Breakdown 2",
							icon: {
								name: "user",
								color: "dodgerblue"
							},
							OnSetKey: function(detail, keyID) {
								detail.view.dataParams.set("batch_id", keyID);
								detail.view.refresh();
							},
							OnCreateMasterDetail: function(detail, keyID) {
								return new PaymentBreakdownByBatchView2({
									batch_id: keyID,
									container: detail.tab.container
								});
							},
							OnCreate: function(tab) {
								tab.detail.update();
							},
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
					}
				});
			});
		}
	}));
};