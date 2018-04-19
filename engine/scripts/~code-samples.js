	// ****************************************************************************************************
	// jSplitContainer	
	// ****************************************************************************************************
	new jSplitContainer($.extend(viewParams, {
		paintParams: {
			css: "members"
		},
		container: viewParams.container,
		orientation: "horz",
		size: 50,
		usePercent: true,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
			});
		}
	});

	// ****************************************************************************************************
	// jPageControl
	// ****************************************************************************************************
	new jPageControl({
		paintParams: {
			theme: "default",
			icon: {
				size: 24,
				position: "left"
			}
		},
		container: container,
		init: function(pg) {
			pg.addTab({caption:"Attach Master Policy",
				icon: {
					name: "attach",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					
				}
			});
			pg.addTab({caption:"Integrate Master Policy",
				icon: {
					name: "integrate",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					
				}
			});
		}
	});
	