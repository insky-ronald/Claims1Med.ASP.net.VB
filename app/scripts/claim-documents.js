function ClaimDocumentsView(viewParams){	
	new jPageControl({
		paintParams: {
			theme: "claim-documents",
			icon: {
				size: 22,
				position: "left"
			}
		},
		container: viewParams.container,
		init: function(pg) {
			pg.addTab({caption:"Inbox (Attachments)",
				icon: {
					name: "inbox",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					// ClaimDocumentsInView({container:tab.container, requestParams:$.extend(viewParams.requestParams, {source:"I"})});
					ClaimDocumentsInView($.extend(viewParams, {container:tab.container}))
				}
			});
			pg.addTab({caption:"Outbox (Templates)",
				icon: {
					name: "outbox",
					color: "firebrick"
				},
				OnCreate: function(tab) {
					// new UpdateBreakdownView({container:tab.container, serviceID:viewParams.requestParams.service_id, section:1});
				}
			});
		}
	});
};
