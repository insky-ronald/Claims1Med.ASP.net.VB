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
					new PaymentAuthorisationView({container:tab.container, requestParams: {referral:0}});
				}
			});
			pg.addTab({caption:"Batching",
				icon: {
					name: "authorisation",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					new PaymentBatchingView({container:tab.container, requestParams: {referral:0}});
				}
			});
			pg.addTab({caption:"Batches",
				icon: {
					name: "table",
					color: "firebrick"
				},
				OnCreate: function(tab) {
					new PaymentBatchesView({container:tab.container});
				}
			});
			// pg.addTab({caption:"Find Payment",
				// icon: {
					// name: "search",
					// color: "forestgreen"
				// },
				// OnCreate: function(tab) {
				// }
			// });
		}
	});
};
