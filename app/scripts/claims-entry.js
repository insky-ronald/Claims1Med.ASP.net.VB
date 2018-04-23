// ****************************************************************************************************
// Last modified on
// 26-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: claims-entry.js
//==================================================================================================
function ClaimsEntry(viewParams) {
	var membersSearchView;
	
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
				membersSearchView = MembersSearchView($.extend(viewParams, {container:container}))
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				// console.log(membersSearchView.grid)
				new jPageControl({
					paintParams: {
						theme: "member-claims",
						icon: {
							size: 22,
							position: "left"
						}
					},
					container: container,
					// masterView: membersSearchView,
					masterView: membersSearchView.grid,
					init: function(pg) {
						pg.addTab({caption:"Member's Claims",
							icon: {
								name: "user",
								color: "dodgerblue"
							},
							OnSetKey: function(detail, keyID) {
								detail.view.dataParams.set("member_id", keyID);
								detail.view.refresh();
							},
							OnCreateMasterDetail: function(detail, keyID) {
								return new MemberClaimsView({
									member_id: keyID,
									container: detail.tab.container
								});
							},
							OnActivate: function(tab) {
								tab.detail.sync();
							}
						});
						
						// pg.addTab({caption:"Customer Service",
						pg.addTab({caption:"Call Logs",
							icon: {
								name: "customer-service",
								color: "forestgreen"
							// },
							// OnSetKey: function(detail, keyID) {
								// detail.view.dataParams.set("member_id", keyID);
								// detail.view.refresh();
							// },
							// OnCreateMasterDetail: function(detail, keyID) {
								// return new MemberClaimsView({
									// member_id: keyID,
									// container: detail.tab.container
								// });
							// },
							// OnCreate: function(tab) {
								// tab.detail.update();
							// },
							// OnActivate: function(tab) {
								// tab.detail.sync();
							}
						});
					}
				});
			});
		}
	}));
};
