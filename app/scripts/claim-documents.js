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
			// pg.addTab({caption:"Inbox (Attachments)",
			pg.addTab({caption:"Documents",
				icon: {
					name: "inbox",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					DocumentsView($.extend(viewParams, {container:tab.container}))
				}
			});
			pg.addTab({caption:"Attachments",
				icon: {
					name: "inbox",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					ClaimDocumentsInView($.extend(viewParams, {container:tab.container}))
				}
			});
			pg.addTab({caption:"Outbox (Templates)",
				icon: {
					name: "outbox",
					color: "firebrick"
				},
				OnCreate: function(tab) {
					ClaimDocumentsOutView($.extend(viewParams, {container:tab.container}))
				}
			});
		}
	});
};
