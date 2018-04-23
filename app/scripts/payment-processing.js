// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: payment-processing.js
//==================================================================================================
function PaymentProcessingView(viewParams){
	new jPageControl({
		paintParams: {
			theme: "default",
			icon: {
				size: 22,
				position: "left"
			}
		},
		container: viewParams.container,
		init: function(pg) {
			pg.addTab({caption:"Authorization",
				icon: {
					name: "authorisation",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					new jAuthorisationView({container:tab.container, requestParams: {referral:0}});
					// MembersSearchView($.extend(viewParams, {container:tab.container}))
					// ClaimDocumentsInView({container:tab.container, requestParams:$.extend(viewParams.requestParams, {source:"I"})});
					// ClaimDocumentsInView($.extend(viewParams, {container:tab.container}))
				}
			});
			pg.addTab({caption:"Batching",
				icon: {
					name: "authorisation",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
			pg.addTab({caption:"Batches",
				icon: {
					name: "table",
					color: "firebrick"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
			pg.addTab({caption:"Find Payment",
				icon: {
					name: "search",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
		}
	});
	
	// return new MultiTabsView(params, function(pg) {
		// pg.add("Authorization", function(tab) {
			// PaymentAuthorizationView({
				// container: tab.content
			// })
		// });

		// pg.add("Batching", function(tab) {
			// PaymentBatchingView({
				// container: tab.content
			// })
		// });

		// pg.add("Batches", function(tab) {
			// PaymentBatchesView({
				// container: tab.content
			// })
		// });

		// pg.add("Find Payment", function(tab) {
			// PaymentsSearchView({
				// container: tab.content
			// })
		// });
	// });
};
